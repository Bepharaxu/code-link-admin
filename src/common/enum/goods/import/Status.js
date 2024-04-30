import Enum from '../../enum'

/**
 * 枚举类：商品批量导入状态
 * ImportStatusEnum
 */
export default new Enum([
  { key: 'NORMAL', name: '进行中', value: 10 },
  { key: 'COMPLETED', name: '导入完成', value: 20 }
])
