const fs = require("fs");
const path = require("path");
let data = fs.readFileSync("./dist/production/dist/index.html", "utf8");
let str = data.replace(/href=\//g, "href=./").replace(/src=\//g, "src=./");
fs.writeFileSync("./dist/production/dist/index.html", str);
