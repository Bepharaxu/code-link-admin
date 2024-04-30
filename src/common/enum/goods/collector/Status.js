import Enum from '../../enum'

/**
 * 枚举类：商品采集状态
 * CollectorStatusEnum
 */
export default new Enum([
  { key: 'NORMAL', name: '进行中', value: 10 },
  { key: 'COMPLETED', name: '采集完成', value: 20 }
])
