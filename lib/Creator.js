import EventEmitter from 'events'
import fs from 'fs'
import chalk from 'chalk'
import inquirer from 'inquirer/lib/inquirer.js'
import{ loading } from "../utils/loading.js"
import{ hasGit } from "../utils/git.js"
import { getRepoTree, getRepoFileRaw } from '../utils/api.js'
import { getTemplateList } from '../utils/getTemplateList.js'


// 获取仓库的文件列表
async function getFileList(fileRoot, targetDir) {
  // 查询模版目录下的tree
  const tree = await getRepoTree(fileRoot)
  const treeList = JSON.parse(tree.body)

  for (let index = 0; index < treeList.length; index++) {
    const element = treeList[index];
    let path = element.path.replace(fileRoot, targetDir)
    if (element.type === 'tree') {
      // 是文件夹，就判断有没有存在同名文件夹，没有就创建文件夹
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        await getFileList(element.path, path)
      }
    } else {
      // 不是文件夹的话，就去下载文件
      const { body } = await getRepoFileRaw(element.path)
      fs.writeFileSync(path, body)
    }
  }

}
/**
 * 创建步骤
 * 1. 获取仓库文件树
 * 2. 用户选择分支后，修改package.json的项目名
 * 3. 下载分支
 */

class Creator extends EventEmitter {
  constructor(name, context) {
    super()
    this.name = name
    this.context = context
  }
  async create() {
    const { name, context } = this
    // 正在创建项目
    loading.start(`✨`, `正在创建项目 ${chalk.yellow(context)}.`)
    this.emit('creation', { event: 'creating' })
    loading.stop()

    // 获取当前所支持的所有模版列表
    const templateList = await getTemplateList()

    // 让用户选择使用哪个模版
    const result = await inquirer
    .prompt([
      {
        type: 'checkbox',
        message: '选择需要应用的模版',
        name: 'templateName',
        choices: templateList.map((e) => {
          return {
            name: e.name
          }
        }),
        validate(answer) {
          if (answer.length < 1) {
            return '必须选择一个模版';
          }
          return true;
        },
      },
    ])

    // 选择模版后，去拉去对应模版文件夹下的文件到当前目录
    const templateName = result.templateName[0]

    loading.start(`🚗🚗🚗`, `正在拉取模板： ${chalk.blueBright.bold.dim(templateName)}.`)

    await getFileList(`templates/${templateName}`, context)

    this.emit('creation', { event: 'done' })
    loading.stop()
    console.log()
    console.log(chalk.bgBlackBright.white('🎉🎉🎉  项目创建成功.'))
    console.log()
    console.log(chalk.bgBlackBright.white('👉  请按如下命令，开始愉快开发吧！\n\n'))
    console.log(chalk.cyanBright.bold(`🌟 cd ${name} 🌟 \n`))
    console.log(chalk.cyanBright.bold(`🌟 npm install 🌟 \n`))
    console.log(chalk.cyanBright.bold(`🌟 npm run dev 🌟 \n`))
  }
  // git
  shouldInitGit () {
    if (!hasGit()) {
      return false
    }
    return true
  }
}

export default Creator
