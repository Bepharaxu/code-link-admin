import { axios } from '@/utils/request'

// api接口列表
const api = {
  list: '/groupon.goods/list',
  detail: '/groupon.goods/detail',
  add: '/groupon.goods/add',
  edit: '/groupon.goods/edit',
  delete: '/groupon.goods/delete'
}

// 列表记录
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

// 商品详情
export function detail (grouponGoodsId, params) {
  return axios({
    url: api.detail,
    method: 'get',
    params: { grouponGoodsId, ...params }
  })
}

/**
 * 新增记录
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
 * 编辑记录
 * @param {*} data
 */
export function edit (grouponGoodsId, data) {
  return axios({
    url: api.edit,
    method: 'post',
    data: { grouponGoodsId, ...data }
  })
}

/**
 * 删除记录
 * @param {*} data
 */
export function deleted (data) {
  return axios({
    url: api.delete,
    method: 'post',
    data: data
  })
}
