import { glob } from "glob";
import fs from "fs-extra";

const overrides=fs.readJSONSync("./overrides.json");

// 只允许拷贝的字体目录 key
const allowedKeys = Object.keys(overrides);

fs.emptyDirSync("./dist");

const files = await glob(
  `./packages/*/dist/**/*.{woff,woff2,ttf,bin,svg,css,html,proto}`,
  {
    ignore: "node_modules/**",
  }
);
console.log(files)
// 过滤路径，只包含在允许目录下的文件
const filteredFiles = files.filter((filePath) => {
  const normalized = filePath.replaceAll("\\", "/");
  return allowedKeys.some((key) => normalized.includes(`packages/${key}/`));
});

filteredFiles.forEach((i) => {
  const newPath =
    "./dist/" +
    i
      .replaceAll("\\", "/")
      .replaceAll(" ", "_")
      .replace(/(?<=\/.*)\.(?=.*\/)/g, "_");

  fs.copySync(i, newPath);
});

fs.copySync("./_headers", "./dist/_headers");
fs.copySync("./_redirects", "./dist/_redirects");
fs.copySync("./index.html", "./dist/index.html");
fs.copySync("./index.json", "./dist/index.json");
