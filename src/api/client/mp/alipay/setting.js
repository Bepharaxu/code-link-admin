import { axios } from '@/utils/request'

// api接口列表
const api = {
  basic: '/client.mp.alipay.setting/basic',
  detail: '/client.mp.alipay.setting/detail',
  update: '/client.mp.alipay.setting/update',
  updateBasic: '/client.mp.alipay.setting/updateBasic'
}

/**
 * 获取支付宝小程序基础设置
 * @param {*} key
 */
export function basic () {
  return axios({
    url: api.basic,
    method: 'get'
  })
}

/**
 * 获取支付宝小程序设置 (指定)
 * @param {*} key
 */
export function detail (key) {
  return axios({
    url: api.detail,
    method: 'get',
    params: { key }
  })
}

/**
 * 更新设置项
 * @param {*} key
 * @param {*} data
 */
export function update (key, data) {
  return axios({
    url: api.update,
    method: 'post',
    data: { key, ...data }
  })
}

/**
 * 更新设置项（基础设置）
 * @param {*} key
 * @param {*} data
 */
export function updateBasic (data) {
  return axios({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: api.updateBasic,
    method: 'post',
    data
  })
}
