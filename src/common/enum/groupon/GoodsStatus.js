import Enum from '../enum'

/**
 * 枚举类：拼团商品状态
 * GoodsStatusEnum
 */
export default new Enum([
  { key: 'NORMAL', name: '进行中', value: 10 },
  { key: 'FINISH', name: '已结束', value: 20 }
])
