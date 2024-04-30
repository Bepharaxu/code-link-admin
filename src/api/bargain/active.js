import { axios } from '@/utils/request'

const api = {
  list: '/bargain.active/list',
  detail: '/bargain.active/detail',
  add: '/bargain.active/add',
  edit: '/bargain.active/edit',
  delete: '/bargain.active/delete'
}

/**
 * 砍价活动列表
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
 * 砍价活动详情
 * @param {*} params
 */
export function detail (params) {
  return axios({
    url: api.detail,
    method: 'get',
    params
  })
}

/**
 * 新增砍价活动
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
 * 编辑砍价活动
 * @param {*} activeId
 * @param {*} data
 */
export function edit (activeId, data) {
  return axios({
    url: api.edit,
    method: 'post',
    data: { activeId, ...data }
  })
}

/**
 * 删除砍价活动
 * @param {*} activeId
 * @param {*} data
 */
export function deleted (activeId, data) {
  return axios({
    url: api.delete,
    method: 'post',
    data: { activeId, ...data }
  })
}
