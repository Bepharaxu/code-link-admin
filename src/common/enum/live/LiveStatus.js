import Enum from '../enum'

/**
 * 枚举类：微信小程序直播间状态
 * LiveStatusEnum
 */
export default new Enum([
  { key: 101, name: '直播中', value: 101 },
  { key: 102, name: '未开始', value: 102 },
  { key: 103, name: '已结束', value: 103 },
  { key: 104, name: '禁播', value: 104 },
  { key: 105, name: '暂停中', value: 105 },
  { key: 106, name: '异常', value: 106 },
  { key: 107, name: '已过期', value: 107 }
])
