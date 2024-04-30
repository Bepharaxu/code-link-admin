import { axios } from '@/utils/request'

const api = {
  all: '/dealer.setting/all',
  detail: '/dealer.setting/detail',
  update: '/dealer.setting/update'
}

// 分销商设置(全部)
export function all () {
  return axios({
    url: api.all,
    method: 'get'
  })
}

/**
 * 获取指定的设置项
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
 * 更新设置
 * @param {*} data
 */
export function update (data) {
  return axios({
    url: api.update,
    method: 'post',
    data
  })
}
