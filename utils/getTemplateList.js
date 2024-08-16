import { getRepoTree } from './api.js'
import { loading } from "./loading.js"

// 获取模版列表
export async function getTemplateList() {
  loading.start('fetching...')
  const tree = await getRepoTree()
  loading.stop()
  return JSON.parse(tree.body)
}
