import Enum from '../../enum'

/**
 * 枚举类：分销商体现打款方式
 * PayTypeEnum
 */
export default new Enum([
  { key: 'WECHAT', name: '微信', value: 10 },
  { key: 'ALIPAY', name: '支付宝', value: 20 },
  { key: 'BANK_CARD', name: '银行卡', value: 30 }
])
