import JsonToTS from "json-to-ts";

const json2ts = function(codeText: string): string {
  const text = codeText
    .replace(/("([^\\"]*(\\.)?)*")|('([^\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g, function(word) {
      // 去除注释后的文本
      return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;
    })
    .replace(/[\n|\s+]/g, "")
    .replace(/,}$/, "}")
    .replace(/00,/g, "0,")
    .replace(/},]/g, "}]");
  let jsonData = undefined;

  try {
    jsonData = JSON.parse(text);
  } catch (e) {
    jsonData = undefined;
  }
  if (!jsonData) return "";
  try {
    return JsonToTS(jsonData).join("\n");
  } catch (e) {
    return "";
  }
};
export default json2ts;
