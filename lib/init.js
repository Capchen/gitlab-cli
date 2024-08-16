import path from 'path'
import chalk from 'chalk'
import inquirer from 'inquirer/lib/inquirer.js'
import Creator from './Creator.js'
import { _require } from '../utils/require.js'
import { exit } from '../utils/exit.js'

const fs = _require('fs-extra')
const validatePackageName = _require('validate-npm-package-name')

/**
 * 初始化项目
 * @param {*} projectName
 */
export const initProject = (projectName) => {
  const cwd = process.cwd()
  // 是否在当前目录
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')

  // 校验工程名是否合法
  const result = validatePackageName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.pink(`不合法的项目名${name}`))
    try {
      result.errors && result.errors.forEach(err => {
        console.error(chalk.red.dim('❌ ' + err))
      })
      result.warnings && result.warnings.forEach(warn => {
        console.error(chalk.red.dim('⚠️' + warn))
      })
    } catch (error) {
      console.error(error)
    }
    exit(1)
  }

  // 判断工程目录是否存在
  if (fs.existsSync(targetDir)) {
    inquirer.prompt([
      {
        type: "expand",
        message: "已存在对应工程名，是否需要覆盖？",
        name: '重命名',
        choices: [
          {
            key: 'y',
            name: '确定覆盖',
            value: 'overwrite',
          },
          {
            key: 'N',
            name: '不覆盖，继续新建',
            value: 'other',
          },
        ]
      }
    ]).then(async (ans) => {
      if (ans && ans['重命名']) {
        if (ans['重命名'] === 'overwrite') {
          // 选择overwrite,先删再新建
          await fs.remove(targetDir)
        } else {
          // 继续新建就改文件名
        }
        // 前面完成准备工作，正式开始创建项目
        fs.mkdirSync(targetDir);
        const creator = new Creator(name, targetDir)
        await creator.create()
      }
    })
    .catch(error => {
      console.log(error)
    })
  } else {
    // 前面完成准备工作，正式开始创建项目
    fs.mkdirSync(targetDir);
    const creator = new Creator(name, targetDir)
    creator.create()
  }

}
