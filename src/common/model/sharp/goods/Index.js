import _ from 'lodash'
import * as GoodsApi from '@/api/sharp/goods'

/**
 * 商品 model类
 * GoodsModel
 */
export default {

  // 当前商品ID
  sharpGoodsId: null,

  // 当前商品记录
  goods: {},

  // 表单数据
  formData: {},

  // 获取form所需的数据
  getFromData (sharpGoodsId = null) {
    // 记录商品ID (编辑时)
    this.sharpGoodsId = sharpGoodsId
    return new Promise((resolve, reject) => {
      Promise.all([
        // 获取商品详情信息(编辑时)
        this.getGoodsDetail(sharpGoodsId)
      ]).then(() => {
        // 设置默认数据
        this.setDefaultData()
        resolve({ goods: this.goods, formData: this.formData })
      })
    })
  },

  // 获取商品详情
  getGoodsDetail (sharpGoodsId = null) {
    if (!sharpGoodsId) return false
    return new Promise((resolve, reject) => {
      GoodsApi.detail({ sharpGoodsId })
        .then(result => {
          this.goods = result.data.goodsInfo
          resolve()
        })
    })
  },

  // 获取表单默认值(用于form.setFieldsValue的数据)
  getFieldsValue () {
    // 商品详情信息
    const goodsInfo = this.formData.goods
    // 商品基本数据
    const goodsFormData = _.pick(goodsInfo, [
      'goods_name', 'goods_no', 'delivery_type', 'sort'
    ])
    // 单规格数据
    const skuOne = _.pick(goodsInfo.skuList[0], ['goods_price', 'line_price', 'stock_num', 'goods_weight'])
    return {
      ...goodsFormData,
      ...skuOne
    }
  },

  // 设置默认的数据(无法用于form.setFieldsValue的数据)
  setDefaultData () {

  }

}
