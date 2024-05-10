import { axios } from '@/utils/request'

// api接口列表
const api = {
  basic: '/client.wxofficial.setting/basic',
  detail: '/client.wxofficial.setting/detail',
  update: '/client.wxofficial.setting/update'
}

/**
 * 获取微信公众号基础设置
 * @param {*} key
 */
export function basic (params) {
  return axios({
    url: api.basic,
    method: 'get'
  })
}

/**
 * 获取微信公众号设置 (指定)
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
