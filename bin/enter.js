#! /usr/bin/env node

import { program } from "commander/esm.mjs";
import chalk from "chalk";
import { _require } from "../utils/require.js";
import { initProject } from "../lib/init.js";
import { getTemplateList } from "../utils/getTemplateList.js";

const pkgManifest = _require("../package.json");

program
  .name("gyenno-cli")
  .description("脚手架工具，快速生成模版")
  .version(`${pkgManifest.version}`);


program
  .command("init <project-name>")
  .description("按照模版初始化项目")
  .action((projectName) => initProject(projectName));

program
  .command("list")
  .description("查看模版列表")
  .action(async () => {
    const templateList = await getTemplateList();

    console.log("模板列表：\n");

    for (const template of templateList) {
      const templateName = chalk.blue.bold(`${template.name}`);

      console.log(chalk.green(`${templateName} \n`));
    }
  });

program.parse();
