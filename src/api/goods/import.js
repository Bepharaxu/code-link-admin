import { axios } from '@/utils/request'

// api接口列表
const api = {
  list: '/goods.import/list',
  batch: '/goods.import/batch',
  delete: '/goods.import/delete'
}

// 列表记录
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

/**
 * 执行批量导入
 * @param {*} data
 */
export function batch (data) {
  return axios({
    url: api.batch,
    method: 'post',
    data
  })
}

/**
 * 删除记录
 * @param {*} data
 */
export function deleted (data) {
  return axios({
    url: api.delete,
    method: 'post',
    data: data
  })
}
