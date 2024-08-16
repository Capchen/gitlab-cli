import chalk from "chalk";
import { execSync } from 'child_process'
import { getAccessToken } from './api.js'

let _hasGit

export let access_token = process.env.GITLAB_ACCESS_TOKEN

export const hasGit = () => {
  if (_hasGit != null) {
    return _hasGit
  }
  try {
    execSync('git --version', { stdio: 'ignore' })
    return (_hasGit = true)
  } catch (e) {
    return (_hasGit = false)
  }
}

export const getGitUserInfo = () => {
  const gitInfo = {
    username: '',
    password: '',
  }

  gitInfo.username = execSync('git config user.email').toString().split(/\r?\n/)[0]
  gitInfo.password = execSync('git config user.password').toString().split(/\r?\n/)[0]

  return gitInfo
}

async function setAccessTokenByUserInfo() {
  try {
    const params = getGitUserInfo()
    params.grant_type = 'password'
    const { body } = await getAccessToken(params)
    access_token = JSON.parse(body).access_token
  } catch (e) {}
}

function showAccessTokenConfigTip() {
  const GITLAB_ACCESS_TOKEN_DOCS_LINK = 'https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html'

  console.log(`
${chalk.red('无法获取 GitLab access token！')}

请从 GitLab 生成 access_token, 你可以参照 ${chalk.blue(GITLAB_ACCESS_TOKEN_DOCS_LINK)} 。

然后在命令行执行：

${chalk.green('export GITLAB_ACCESS_TOKEN=<access_token>')}

或者将 export 语句写在你的 ${chalk.green('.bashrc / .zshrc')} 文件中

如果你不用环境变量，你也可以设置用户名密码：

${chalk.green('git config --global user.email <your_email>')}
${chalk.green('git config --global user.password <your_password>')}
`)
}

/**
  * 获取 GitLab 的 access_token
  *
 **/
export const getGitLabAccessToken = async () => {
  if (access_token) {
    return access_token
  }

  await setAccessTokenByUserInfo()

  if (!access_token) {
    showAccessTokenConfigTip()
    process.exit(1)
  }


  return access_token
}
