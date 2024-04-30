import { axios } from '@/utils/request'

const api = {
  list: '/dealer.apply/list',
  audit: '/dealer.apply/audit'
}

/**
 * 分销商申请列表
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
 * 分销商审核
 * @param {*} data
 */
export function audit (data) {
  return axios({
    url: api.audit,
    method: 'post',
    data
  })
}
