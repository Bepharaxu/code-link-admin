import { axios } from '@/utils/request'

const api = {
  list: '/dealer.order/list'
}

/**
 * 分销商订单列表
 * @param {*} params
 */
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}
