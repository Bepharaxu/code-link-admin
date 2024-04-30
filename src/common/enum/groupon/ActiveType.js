import Enum from '../enum'

/**
 * 枚举类：拼团类型
 * ActiveTypeEnum
 */
export default new Enum([
  { key: 'NORMAL', name: '普通拼团', value: 10 },
  { key: 'PULL_NEW', name: '老带新拼团', value: 20 },
  { key: 'STEPS', name: '阶梯拼团', value: 30 }
])
