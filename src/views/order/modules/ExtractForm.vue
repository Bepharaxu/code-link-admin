<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :isLoading="isLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="isLoading">
      <a-form :form="form">
        <a-form-item label="门店核销员" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['clerkId', { rules: [{ required: true, message: '请选择核销员' }] }]"
            placeholder="请选择核销员"
          >
            <a-select-option
              v-for="(item, index) in shopClerkList"
              :key="index"
              :value="item.clerk_id"
            >
              <span>{{ item.real_name }}</span>
              <span class="ml-5 f-13">({{ item.shop.shop_name }})</span>
            </a-select-option>
          </a-select>
          <div class="form-item-help">
            <router-link target="_blank" :to="{ path: '/store/shop/clerk/index' }">门店店员管理</router-link>
          </div>
        </a-form-item>
        <a-form-item
          label="买家取货状态"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          extra="买家必须已取货才可确认核销"
        >
          <a-radio-group v-decorator="['status', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">已取货</a-radio>
            <a-radio :value="0" disabled>未取货</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="同步微信平台" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['syncMpWeixinShipping', { initialValue: 1, rules: [{ required: true }] }]"
          >
            <a-radio :value="1">同步</a-radio>
            <a-radio :value="0">不同步</a-radio>
          </a-radio-group>
          <div class="form-item-help">
            <p class="extra">同步至微信小程序平台的《发货信息录入》</p>
            <p class="extra">仅全部发货或最后一次发货时同步</p>
          </div>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import * as Api from '@/api/order/event'
import * as ClerkApi from '@/api/store/shop/clerk'

export default {
  data () {
    return {
      // 对话框标题
      title: '门店自提核销',
      // 标签布局属性
      labelCol: { span: 7 },
      // 输入框布局属性
      wrapperCol: { span: 13 },
      // modal(对话框)是否可见
      visible: false,
      // modal(对话框)确定按钮 loading
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 门店店员列表
      shopClerkList: [],
      // 当前记录
      record: {}
    }
  },
  created () {
    // 获取门店店员列表
    this.getShopClerkList()
  },
  methods: {

    // 显示对话框
    show (record) {
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record
    },

    // 获取门店店员列表
    getShopClerkList () {
      this.isLoading = true
      ClerkApi.all()
        .then(result => this.shopClerkList = result.data.list)
        .finally(() => this.isLoading = false)
    },

    // 确认按钮
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        // 提交到后端api
        !errors && this.onFormSubmit(values)
      })
    },

    // 关闭对话框事件
    handleCancel () {
      this.visible = false
      this.form.resetFields()
    },

    // 提交到后端api
    onFormSubmit (values) {
      this.isLoading = true
      Api.extract({ orderId: this.record.order_id, form: values })
        .then(result => {
          // 显示成功
          this.$message.success(result.message, 1.5)
          // 关闭对话框事件
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', values)
        })
        .finally(() => this.isLoading = false)
    }

  }
}
</script>
