import { axios } from '@/utils/request'

// api接口列表
const api = {
  list: '/project',
  add: '/project',
  edit: '/project',
  delete: '/project'
}

// 列表记录
export function list (params) {
  return axios({
    url: api.list + `/${params}`,
    method: 'get'
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
    url: api.edit + `/${data.id}`,
    method: 'patch',
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
    method: 'delete'
  })
}

export function detail (data) {
  return axios({
    url: api.delete + `/${data}`,
    method: 'get'
  })
}

export function updateContent (data) {
  return axios({
    url: api.edit + `/${data.id}`,
    method: 'patch',
    data
  })
}
