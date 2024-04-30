import { axios } from '@/utils/request'

const api = {
  list: '/sharp.active/list',
  detail: '/sharp.active/detail',
  state: '/sharp.active/state',
  add: '/sharp.active/add',
  delete: '/sharp.active/delete'
}

/**
 * 秒杀活动会场列表
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
 * 秒杀活动会场详情
 * @param {*} params
 */
export function detail (activeId, params) {
  return axios({
    url: api.detail,
    method: 'get',
    params: { activeId, ...params }
  })
}

/**
 * 修改活动状态
 * @param {*} data
 * @param {int} state
 */
export function state (activeId, state) {
  return axios({
    url: api.state,
    method: 'post',
    data: { activeId, state }
  })
}

/**
 * 新增秒杀活动会场
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
 * 删除秒杀活动会场
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
