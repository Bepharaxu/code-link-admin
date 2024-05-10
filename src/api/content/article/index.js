import { axios } from '@/utils/request'

// api接口列表
const api = {
  list: '/customer',
  detail: '/content.article/detail',
  add: '/customer',
  edit: '/customer',
  delete: '/customer'
}

// 列表记录
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

// 详情信息
export function detail (params) {
  return axios({
    url: api.detail,
    method: 'get',
    params
  })
}

/**
 * 新增记录
 * @param {*} data
 */
export function add (data) {
  return axios({
    url: api.add,
    method: 'post',
    data
  })
}

/**
 * 编辑记录
 * @param {*} data
 */
export function edit (data) {
  return axios({
    url: api.edit,
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
    url: api.delete + `/${data}`,
    method: 'delete',
    data: data
  })
}
