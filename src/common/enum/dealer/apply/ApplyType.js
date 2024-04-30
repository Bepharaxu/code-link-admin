import Enum from '../../enum'

/**
 * 枚举类：分销商申请方式
 * ApplyTypeEnum
 */
export default new Enum([
  { key: 'AUDIT', name: '需后台审核', value: 10 },
  { key: 'PASS', name: '无需审核', value: 20 }
])
