const MonacoWebpackPlugin = require("monaco-editor-esm-webpack-plugin");
module.exports = {
  framework: "html",
  entry: "src/views/**/index.ts",
  publicPath: "/",
  buildPath: "dist/production/dist",
  devtool: "source-map",
  template: "view/layout.html",
  port: 9001,
  alias: {
    asset: "asset",
    "@": "src"
  },
  externals: {
    /**
     * 不把第三方库打包进文件内，前面是npm包名，后面是使用的名称。
     * 如 import Vue from 'vue'
     */
    // vue: "Vue"
  },
  loaders: {
    typescript: true,
    tslint: true,
    scss: {
      enable: true,
      exclude: /node_modules/,
      postcss: true
    },
    nunjucks: {
      options: {
        searchPaths: ["./widget", "./test"]
      }
    }
  },
  module: {
    rules: [
      // {
      //   test: /\.js/,
      //   enforce: "pre",
      //   include: /node_modules[\\\/]monaco-editor[\\\/]esm/,
      //   use: MonacoWebpackPlugin.loader
      // }
    ]
  },
  plugins: [
    new MonacoWebpackPlugin({
      //不做提示
      languages: [],
      features: []
    }),
    { imagemini: false },
    {
      html: {
        favicon: "./favicon.ico"
      }
    },
    {
      copy: [
        { from: "./node_modules/onigasm/lib/onigasm.wasm", to: "asset/onigasm/onigasm.wasm" },
        { from: "./asset/grammars", to: "asset/grammars" },
        { from: "./asset/monaco", to: "asset/monaco" },
        { from: "./asset/theme/theme.json", to: "asset/theme/theme.json" },
        { from: "./public", to: "" }
      ]
    }
  ],
  compile: {
    thread: false
  },
  devServer: {
    // proxy
  },
  done() {}
};
