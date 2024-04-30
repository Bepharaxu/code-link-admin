import { axios } from '@/utils/request'

const api = {
  list: '/bargain.task/list',
  help: '/bargain.task/help',
  delete: '/bargain.task/delete'
}

/**
 * 砍价任务列表
 * @param {*} params
 */
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

/**
 * 砍价榜
 * @param {*} taskId
 * @param {*} params
 */
export function help (taskId, params) {
  return axios({
    url: api.help,
    method: 'get',
    params: { taskId, ...params }
  })
}

/**
 * 删除砍价任务
 * @param {*} taskId
 * @param {*} data
 */
export function deleted (taskId, data) {
  return axios({
    url: api.delete,
    method: 'post',
    data: { taskId, ...data }
  })
}
