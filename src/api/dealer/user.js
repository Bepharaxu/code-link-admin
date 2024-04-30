import { axios } from '@/utils/request'

// api接口列表
const api = {
  list: '/dealer.user/list',
  fans: '/dealer.user/fans',
  edit: '/dealer.user/edit',
  delete: '/dealer.user/delete',
  poster: '/dealer.user/poster'
}

/**
 * 分销商用户列表
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
 * 分销商粉丝列表
 * @param {*} dealerId
 */
export function fans (dealerId, params) {
  return axios({
    url: api.fans,
    method: 'get',
    params: { dealerId, ...params }
  })
}

/**
 * 分销商二维码
 * @param {*} dealerId
 */
export function poster (dealerId) {
  return axios({
    url: api.poster,
    method: 'get',
    params: { dealerId }
  })
}

/**
 * 编辑分销商
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
 * 删除分销商
 * @param {*} dealerId
 */
export function deleted (dealerId) {
  return axios({
    url: api.delete,
    method: 'post',
    data: { dealerId }
  })
}
