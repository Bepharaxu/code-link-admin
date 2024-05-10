import { axios } from '@/utils/request'

// api接口列表
const api = {
  list: '/order.delivery/list',
  detail: '/order.delivery/detail',
  delivery: '/order.delivery/delivery',
  batch: '/order.delivery/batch',
  eorder: '/order.delivery/eorder'
}

// 列表记录
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

// 详情记录
export function detail (deliveryId) {
  return axios({
    url: api.detail,
    method: 'get',
    params: { deliveryId }
  })
}

/**
 * 确认发货 (手动录入)
 * @param {*} data
 */
export function delivery (data) {
  return axios({
    url: api.delivery,
    method: 'post',
    data
  })
}

/**
 * 批量发货 (导入模板文件)
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
 * 确认发货 (电子面单)
 * @param {*} data
 */
export function eorder (data) {
  return axios({
    url: api.eorder,
    method: 'post',
    data
  })
}
