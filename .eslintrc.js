module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["vue-typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console": "off",
    "prettier/prettier": [
      "error",
      {
        jsxBracketSameLine: true,
        htmlWhitespaceSensitivity: "ignore",
        printWidth: 120
      }
    ]
  }
};
