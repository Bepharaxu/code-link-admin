import { axios } from '@/utils/request'

const api = {
  list: '/sharp.activeTime/list',
  existTimes: '/sharp.activeTime/existTimes',
  detail: '/sharp.activeTime/detail',
  state: '/sharp.activeTime/state',
  add: '/sharp.activeTime/add',
  edit: '/sharp.activeTime/edit',
  delete: '/sharp.activeTime/delete'
}

/**
 * 活动会场场次列表
 * @param {*} activeId
 * @param {*} params
 */
export function list (activeId, params) {
  return axios({
    url: api.list,
    method: 'get',
    params: { activeId, ...params }
  })
}

/**
 * 获取已存在的活动场次
 * @param {*} activeId
 * @param {*} params
 */
export function existTimes (activeId, params) {
  return axios({
    url: api.existTimes,
    method: 'get',
    params: { activeId, ...params }
  })
}

/**
 * 获取活动场次详情
 * @param {*} activeTimeId
 * @param {*} params
 */
export function detail (activeTimeId, params) {
  return axios({
    url: api.detail,
    method: 'get',
    params: { activeTimeId, ...params }
  })
}

/**
 * 修改活动场次状态
 * @param {*} data
 * @param {int} state
 */
export function state (activeTimeId, state) {
  return axios({
    url: api.state,
    method: 'post',
    data: { activeTimeId, state }
  })
}

/**
 * 新增活动会场场次
 * @param {*} activeId
 * @param {*} data
 */
export function add (activeId, data) {
  return axios({
    url: api.add,
    method: 'post',
    data: { activeId, ...data }
  })
}

/**
 * 新增活动会场场次
 * @param {*} activeTimeId
 * @param {*} data
 */
export function edit (activeTimeId, data) {
  return axios({
    url: api.edit,
    method: 'post',
    data: { activeTimeId, ...data }
  })
}

/**
 * 删除秒杀活动会场
 * @param {*} activeTimeId
 * @param {*} data
 */
export function deleted (activeTimeId, data) {
  return axios({
    url: api.delete,
    method: 'post',
    data: { activeTimeId, ...data }
  })
}
