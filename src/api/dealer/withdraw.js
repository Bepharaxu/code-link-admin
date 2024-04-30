import { axios } from '@/utils/request'

const api = {
  list: '/dealer.withdraw/list',
  audit: '/dealer.withdraw/audit',
  payed: '/dealer.withdraw/payed',
  wechatPay: '/dealer.withdraw/wechatPay'
}

/**
 * 分销商提现列表
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
 * 分销商提现审核
 * @param {*} data
 */
export function audit (data) {
  return axios({
    url: api.audit,
    method: 'post',
    data
  })
}

/**
 * 确认已打款
 * @param {*} data
 */
export function payed (id) {
  return axios({
    url: api.payed,
    method: 'post',
    data: { id }
  })
}

/**
 * 微信支付商家转账到零钱
 * @param {*} data
 */
export function wechatPay (id) {
  return axios({
    url: api.wechatPay,
    method: 'post',
    data: { id }
  })
}
