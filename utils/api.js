import got from 'got'
import { _require } from './require.js'
import { getGitLabAccessToken } from './git.js'

const download = _require('download-git-repo')
const GITLAB_API_BASEURL = 'https://gitlab.gyenno.com'
const GYENNO_TEMPLATE_REPO_PROJECT_ID = 503
const gotGitLab = async (url = "", customOption = {}) => {
  const accessToken = await getGitLabAccessToken()
  const prefixUrl = `${GITLAB_API_BASEURL}/api/v4/projects/${GYENNO_TEMPLATE_REPO_PROJECT_ID}/repository`
  const option = {
    prefixUrl,
    headers: {
      'Authorization': `Bearer ${accessToken}`|| ''
    },
    ...customOption
  }

  return got(url, option)
}

/**
 * 获取 git 的access_token
 * @param {*} postData {"grant_type": '', "username": '', "password": ""}
 * @returns 返回 {"access_token":"","token_type":"Bearer","refresh_token":"", "scope":"api","created_at":}
 */
export const getAccessToken = (postData) => {
  return got.post(`${GITLAB_API_BASEURL}/oauth/token`, {
    json: postData
  })
}

/**
  * 列出仓库树
  */
export const getRepoTree = (path = 'templates') => {
  return gotGitLab(`tree?ref=main&path=${path}`)
}

/**
 * 获取仓库文件
 * @returns
 */
export const getRepoFileRaw = (filePath) => {
  const path = encodeURIComponent(filePath)
  return gotGitLab(`files/${path}/raw?ref=main`)
}


/**
  * 使用 download-git-repo 的能力，去clone指定分支到本地目录
  * 这里需要指定对应的模版仓库的地址和分支
  */
export const downloadTem = async () => {
  download('******', '*****', { clone: true }, function (err) {
    console.log(err)
  })
}
