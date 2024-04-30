<template>
  <a-modal
    :title="title"
    :width="680"
    :visible="visible"
    :isLoading="isLoading"
    :confirmLoading="isLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="isLoading">
      <a-alert class="mb-30" :showIcon="true" message="功能说明" banner>
        <template slot="description">
          <p>1. 用于打印发货物流的电子面单，无需人工录入单号，提升效率；</p>
          <p>2. 获取电子面单成功后，将自动录入物流单号并更新订单状态为已发货；</p>
        </template>
      </a-alert>
      <a-form-model
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        :label-col="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-tabs v-model="tabKey">
          <a-tab-pane :key="1" tab="未发货的商品">
            <a-table
              rowKey="order_goods_id"
              :columns="columns1"
              :dataSource="notDeliveredList"
              :row-selection="rowSelection"
              :pagination="false"
              :scroll="{ y: '320px', scrollToFirstRowOnChange: true }"
            >
              <!-- 商品信息 -->
              <template slot="goods" slot-scope="goods">
                <GoodsItem
                  :data="{
                    image: goods.goods_image,
                    imageAlt: '商品图片',
                    title: goods.goods_name,
                    goodsProps: goods.goods_props,
                    titleWidth: 170
                  }"
                  :subTitleColor="true"
                />
              </template>
              <!-- 可发货数量 -->
              <span slot="quantity" slot-scope="text, item">{{ item.total_num - item.delivery_num }}</span>
              <!-- 发货数量 -->
              <template slot="input" slot-scope="text, item, index">
                <a-input-number
                  :min="1"
                  :max="item.total_num - item.delivery_num"
                  :precision="0"
                  v-model="packGoodsData[index].deliveryNum"
                />
              </template>
            </a-table>
            <a-form-model-item label="电子面单模板" prop="templateId">
              <a-select v-model="formData.templateId" placeholder="请选择电子面单模板">
                <a-select-option
                  v-for="(item, index) in templateList"
                  :key="index"
                  :value="item.template_id"
                >{{ item.name }}</a-select-option>
              </a-select>
              <div class="form-item-help">
                <router-link :to="{ path: '/apps/eorder/template/index' }">模板管理</router-link>
              </div>
            </a-form-model-item>
            <a-form-model-item label="发货地址" prop="addressId">
              <a-select v-model="formData.addressId" placeholder="请选择发货地址">
                <a-select-option
                  v-for="(item, index) in addressList"
                  :key="index"
                  :value="item.address_id"
                >{{ item.full_address }}</a-select-option>
              </a-select>
              <div class="form-item-help">
                <router-link :to="{ path: '/store/address/index' }">地址管理</router-link>
              </div>
            </a-form-model-item>
            <div
              v-if="record.pay_method === PaymentMethodEnum.WECHAT.value && record.platform === ClientEnum.MP_WEIXIN.value"
            >
              <a-form-model-item label="同步微信平台" prop="syncMpWeixinShipping" required>
                <a-radio-group v-model="formData.syncMpWeixinShipping">
                  <a-radio :value="1">同步</a-radio>
                  <a-radio :value="0">不同步</a-radio>
                </a-radio-group>
                <div class="form-item-help">
                  <p class="extra">同步至微信小程序平台的《发货信息录入》</p>
                  <p class="extra">仅全部发货或最后一次发货时同步</p>
                </div>
              </a-form-model-item>
            </div>
          </a-tab-pane>
          <a-tab-pane :key="2" tab="已发货的商品">
            <a-table
              :columns="columns2"
              rowKey="order_goods_id"
              :dataSource="deliveredList"
              :pagination="false"
              :scroll="{ y: '320px', scrollToFirstRowOnChange: true }"
            >
              <!-- 商品信息 -->
              <template slot="goods" slot-scope="goods">
                <GoodsItem
                  :data="{
                    image: goods.goods_image,
                    imageAlt: '商品图片',
                    title: goods.goods_name,
                    goodsProps: goods.goods_props,
                    titleWidth: 170
                  }"
                  :subTitleColor="true"
                />
              </template>
              <!-- 购买数量 -->
              <span slot="total_num" slot-scope="text">{{ text }}</span>
              <!-- 已发货数量 -->
              <span slot="quantity" slot-scope="text, item">{{ item.delivery_num }}</span>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { assignment } from '@/utils/util'
import * as Api from '@/api/order/delivery'
import * as TemplateApi from '@/api/eorder/template'
import * as AddressApi from '@/api/store/address'
import ClientEnum from '@/common/enum/Client'
import { PaymentMethodEnum } from '@/common/enum/payment'
import { DeliveryStatusEnum } from '@/common/enum/order'
import { AddressTypeEnum } from '@/common/enum/store/address'
import { GoodsItem } from '@/components/Table'
import { getLodop } from './lodopFuncs'

const columns1 = [
  {
    title: '商品信息',
    scopedSlots: { customRender: 'goods' },
    width: '50%'
  },
  {
    title: '可发货的数量',
    scopedSlots: { customRender: 'quantity' },
    width: '20%',
  },
  {
    title: '发货数量',
    scopedSlots: { customRender: 'input' },
    width: '30%',
  }
]

const columns2 = [
  {
    title: '商品信息',
    scopedSlots: { customRender: 'goods' },
    width: '50%'
  },
  {
    title: '购买数量',
    dataIndex: 'total_num',
    width: '20%',
  },
  {
    title: '已发货的数量',
    scopedSlots: { customRender: 'quantity' },
    width: '20%',
  }
]

const rules = {
  templateId: [
    { required: true, message: '请选择电子面单模板', trigger: 'blur' }
  ],
  addressId: [
    { required: true, message: '请选择发货地址', trigger: 'blur' }
  ],
}

export default {
  components: {
    GoodsItem
  },
  data () {
    return {
      // 对话框标题
      title: '打印电子面单',
      // 标签布局属性
      labelCol: { span: 7 },
      // 输入框布局属性
      wrapperCol: { span: 13 },
      // modal(对话框)是否可见
      visible: false,
      // modal(对话框)确定按钮 loading
      isLoading: false,
      // 商品表格字段
      columns1,
      columns2,
      // 验证规则
      rules,
      // 当前tab索引
      tabKey: 1,
      // 打印控件CLodop
      LODOP: undefined,
      // form记录
      formData: {
        // 分包发货的商品
        packGoodsData: [],
        // 电子面单模板
        templateId: undefined,
        // 商家发货地址
        addressId: undefined,
        // 同步至微信小程序《发货信息录入》
        syncMpWeixinShipping: 1,
      },
      // 商家发货地址列表
      addressList: [],
      // 电子面单模板列表
      templateList: [],
      // 当前记录
      record: {},
      // 发货商品数量
      packGoodsData: [],
      // 选择的商品
      selectedRowKeys: [],
    }
  },
  computed: {
    rowSelection () {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
        },
        selectedRowKeys: this.selectedRowKeys
      }
    },
    // 未发货的商品列表
    notDeliveredList () {
      const { record } = this
      if (record && record.goods) {
        const list = []
        record.goods.forEach(item => {
          if (item.delivery_status != DeliveryStatusEnum.DELIVERED.value) {
            list.push(item)
          }
        })
        this.selectedRowKeys = list.map(item => item.order_goods_id)
        return list
      }
    },
    // 已发货的商品列表
    deliveredList () {
      const { record } = this
      if (record && record.goods) {
        const list = []
        record.goods.forEach(item => {
          if (item.delivery_status != DeliveryStatusEnum.NOT_DELIVERED.value) {
            list.push(item)
          }
        })
        return list
      }
    },
  },
  beforeCreate () {
    // 批量给当前实例赋值
    assignment(this, {
      ClientEnum,
      PaymentMethodEnum
    })
  },
  async created () {
    this.isLoading = true
    // 获取商家发货地址
    await this.getAddressList()
    // 电子面单模板列表
    await this.getTemplateList()
    this.isLoading = false
  },
  methods: {

    // 显示对话框
    handle (record) {
      if (getLodop()) {
        // 显示窗口
        this.visible = true
        // 当前记录
        this.record = record
        // 未发货的model记录
        this.initPackGoodsData()
      }
    },

    // 未发货的model记录
    initPackGoodsData () {
      const { notDeliveredList } = this
      if (notDeliveredList && notDeliveredList.length) {
        this.packGoodsData = notDeliveredList.map(item => {
          return {
            orderGoodsId: item.order_goods_id,
            deliveryNum: item.total_num - item.delivery_num
          }
        })
      }
    },

    // 获取商家发货地址
    async getAddressList () {
      await AddressApi.all({ type: AddressTypeEnum.DELIVERY.value })
        .then(result => this.addressList = result.data.list)
    },

    // 获取电子面单模板列表
    async getTemplateList () {
      await TemplateApi.all()
        .then(result => this.templateList = result.data.list)
    },

    // 确认按钮
    handleSubmit (e) {
      e.preventDefault()
      this.tabKey = 1
      // 验证是否选择了商品
      if (!this.selectedRowKeys.length) {
        this.$message.error('您还没有选择要发货的商品')
        return false
      }
      // 生成分包商品数据
      this.formData.packGoodsData = this.packGoodsData.filter(item => this.selectedRowKeys.includes(item.orderGoodsId))
      // 表单验证
      this.$refs.ruleForm.validate(valid => {
        // 提交到后端api
        valid && this.onFormSubmit()
      })
    },

    // 关闭对话框事件
    handleCancel () {
      this.visible = false
      this.$refs.ruleForm.resetFields()
    },

    // 提交到后端api
    onFormSubmit () {
      this.isLoading = true
      Api.eorder({ orderId: this.record.order_id, form: this.formData })
        .then(result => {
          // 显示成功
          this.$message.success(result.message, 1.5)
          // 关闭对话框事件
          this.handleCancel()
          // 执行打印
          this.printEOrder(result.data.template)
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', true)
        })
        .finally(() => this.isLoading = false)
    },

    // 调用打印控件
    printEOrder (template) {
      LODOP.PRINT_INIT()
      LODOP.SET_PRINT_PAGESIZE(0)

      LODOP.NewPageA()
      LODOP.ADD_PRINT_HTML(0, 0, "100%", "100%", template)

      // LODOP.NewPageA()
      // LODOP.ADD_PRINT_HTML(0, 0, "100%", "100%", template)

      LODOP.SET_PRINT_MODE("AUTO_CLOSE_PREWINDOW", true)
      LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS", true)
      LODOP.SET_PRINT_MODE("PRINT_PAGE_PERCENT", "Auto-Width")
      LODOP.SET_SHOW_MODE("HIDE_PAGE_PERCENT", true)
      LODOP.PREVIEW()
    }

  }
}
</script>
<style lang="less" scoped>
/deep/.ant-modal-header {
  border-bottom: none;
}
/deep/.ant-modal-footer {
  border-top: none;
}
/deep/.ant-modal-body {
  padding: 0px 24px;
}
/deep/.ant-tabs-bar {
  margin-bottom: 22px;
}
.ant-table-wrapper {
  margin-bottom: 30px;
}
.ant-form-item {
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 5px;
  }
}
</style>