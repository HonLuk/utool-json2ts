import "asset/css/normalize.css";
import "./index.scss";
const DEVELOPMENT = process.env.NODE_ENV === "development";
const monaco = require("monaco-editor/esm/vs/editor/editor.api");
import { wireTmGrammars } from "monaco-editor-textmate";
import { Registry } from "monaco-textmate";
const base = DEVELOPMENT ? window.location.origin : ".";
monaco.languages.register({ id: "json" });
monaco.languages.register({ id: "typescript" });
import { loadWASM } from "onigasm";
import json2ts from "./json2ts";
import ClipboardJS from "clipboard";

const themeMap = {
  dark: "vs-dark",
  light: "vs"
};
const init = async (theme: keyof typeof themeMap) => {
  //校验
  await loadWASM(`${base}/asset/onigasm/onigasm.wasm`);
  //不做提示
  (window as any).MonacoEnvironment = {
    getWorkerUrl: function(moduleId, label) {
      // console.log(moduleId, label);
      // if (label === "json") {
      //   return `${base}/asset/monaco/json.worker.bundle.js`;
      // }
      // if (label === "typescript" || label === "javascript") {
      //   return `${base}/asset/monaco/ts.worker.bundle.js`;
      // }
      return `${base}/asset/monaco/editor.worker.bundle.js`;
    }
  };
  //语法
  const inputRegistry = new Registry({
    getGrammarDefinition: async scopeName => {
      return {
        format: "json", // 语法文件格式，有json、plist
        content: await (await fetch(`${base}/asset/grammars/JSON.tmLanguage.json`)).text()
      };
    }
  });
  const outputRegistry = new Registry({
    getGrammarDefinition: async scopeName => {
      return {
        format: "json", // 语法文件格式，有json、plist
        content: await (await fetch(`${base}/asset/grammars/TypeScript.tmLanguage.json`)).text()
      };
    }
  });
  const inputGrammars = new Map();
  inputGrammars.set("json", "source.json");
  const outputGrammars = new Map();
  outputGrammars.set("typescript", "source.ts");

  //编辑器初始化
  const inputInstance = monaco.editor.create(document.querySelector(".input-editor")!, {
    value: "",
    language: "json",
    theme: themeMap[theme],
    fontSize: 14,
    minimap: {
      enabled: false
    },
    lineNumbersMinChars: 2
  });
  const outputInstance = monaco.editor.create(document.querySelector(".output-editor")!, {
    value: "",
    language: "typescript",
    theme: themeMap[theme],
    fontSize: 14,
    minimap: {
      enabled: false
    },
    lineNumbersMinChars: 2
  });

  if (theme === "dark") {
    //主题
    const OneDark = await (await fetch(`${base}/asset/theme/theme.json`)).json();
    // 定义主题
    monaco.editor.defineTheme("OneDark", OneDark);
    // 使用定义的主题
    monaco.editor.setTheme("OneDark");
  }
  inputInstance.onDidChangeModelContent(() => {
    outputInstance.setValue(json2ts(inputInstance.getValue()));
    setCopyButton(theme, outputInstance);
  });
  await Promise.all([
    wireTmGrammars(monaco, inputRegistry, inputGrammars, inputInstance),
    wireTmGrammars(monaco, outputRegistry, outputGrammars, outputInstance)
  ]);
  window.onresize = function() {
    inputInstance.layout();
    outputInstance.layout();
  };
  //处理刚进入
  let clipboardData = "";

  try {
    clipboardData = await navigator.clipboard.readText();
    inputInstance.setValue(clipboardData);
  } catch (e) {}
};

//设置复制按钮
function setCopyButton(theme: keyof typeof themeMap, outputInstance: any) {
  const old = document.querySelector("#_copy");
  if (old) {
    document.body.removeChild(document.body.removeChild(old));
  }
  if (!outputInstance.getValue()) {
    return;
  }
  const copyButton = document.createElement("button");
  copyButton.setAttribute("id", "_copy");
  copyButton.innerText = "复制";
  if (theme === "dark") {
    copyButton.classList.add("dark");
  }

  copyButton.onclick = () => {
    utools.copyText(outputInstance.getValue());
    new ClipboardJS(copyButton, {
      text: function(trigger) {
        return outputInstance.getValue();
      }
    });
  };
  document.body.appendChild(copyButton);
}

if (window.utools) {
  utools.onPluginEnter(() => {
    init(utools.isDarkColors() ? "dark" : "light");
  });
} else {
  init("dark");
}
