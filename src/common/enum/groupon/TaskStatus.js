import Enum from '../enum'

/**
 * 枚举类：拼单状态
 * TaskStatusEnum
 */
export default new Enum([
  { key: 'NORMAL', name: '进行中', value: 10 },
  { key: 'COMPLETED', name: '拼单成功', value: 20 },
  { key: 'FAIL', name: '拼单失败', value: 30 }
])
