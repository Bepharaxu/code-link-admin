import { axios } from '@/utils/request'

const api = {
  list: '/sharp.goods/list',
  existGoods: '/sharp.goods/existGoods',
  detail: '/sharp.goods/detail',
  add: '/sharp.goods/add',
  edit: '/sharp.goods/edit',
  delete: '/sharp.goods/delete'
}

/**
 * 秒杀商品列表
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
 * 秒杀商品详情
 * @param {*} params
 */
export function existGoods (goodsId, params) {
  return axios({
    url: api.detail,
    method: 'get',
    params: { goodsId, ...params }
  })
}

/**
 * 秒杀商品详情
 * @param {*} params
 */
export function detail (params) {
  return axios({
    url: api.detail,
    method: 'get',
    params
  })
}

/**
 * 新增秒杀商品
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
 * 编辑秒杀商品
 * @param {*} sharpGoodsId
 * @param {*} data
 */
export function edit (sharpGoodsId, data) {
  return axios({
    url: api.edit,
    method: 'post',
    data: { sharpGoodsId, ...data }
  })
}

/**
 * 删除秒杀商品
 * @param {*} sharpGoodsId
 * @param {*} data
 */
export function deleted (sharpGoodsId, data) {
  return axios({
    url: api.delete,
    method: 'post',
    data: { sharpGoodsId, ...data }
  })
}
