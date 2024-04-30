import Enum from '../../enum'

/**
 * 枚举类：分销商提现申请状态
 * ApplyStatusEnum
 */
export default new Enum([
  { key: 'WAIT', name: '待审核', value: 10 },
  { key: 'PASSED', name: '审核通过', value: 20 },
  { key: 'REJECT', name: '驳回', value: 30 },
  { key: 'PAYMENT', name: '已打款', value: 40 }
])
