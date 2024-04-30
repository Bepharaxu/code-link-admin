<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="模板名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入模板名称"
            v-decorator="['name', { rules: [{ required: true, min: 2, message: '请输入至少2个字符' }] }]"
          />
        </a-form-item>

        <a-form-item label="API网关" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['provider', { initialValue: 'kdniao', rules: [{ required: true }] }]"
          >
            <a-radio value="kdniao">快递鸟</a-radio>
            <a-radio value="kd100">快递100</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="物流公司" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-decorator="['express_id', { rules: [{ required: true, message: '请选择物流公司' }] }]"
            placeholder="请选择物流公司"
          >
            <a-select-option
              v-for="(item, index) in expressList"
              :key="index"
              :value="item.express_id"
            >{{ item.express_name }}</a-select-option>
          </a-select>
          <div class="form-item-help">
            <router-link target="_blank" :to="{ path: '/setting/delivery/express/index' }">物流公司管理</router-link>
          </div>
        </a-form-item>

        <a-form-item label="电子面单客户号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="需快递线下（网点）申请"
            v-decorator="['config.customerName', { rules: [{ required: true, min: 2, message: '请输入至少2个字符' }] }]"
          />
        </a-form-item>

        <a-form-item label="电子面单密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="需快递线下（网点）申请"
            v-decorator="['config.customerPwd']"
          />
        </a-form-item>

        <a-form-item label="月结编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['config.monthCode']" />
        </a-form-item>

        <a-form-item label="网点名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['config.stationName']" />
        </a-form-item>

        <a-form-item label="网点编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['config.sendSite']" />
        </a-form-item>

        <a-form-item label="邮费支付方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['config.payType', { initialValue: 'SHIPPER', rules: [{ required: true }] }]"
          >
            <a-radio value="SHIPPER">现付</a-radio>
            <a-radio value="CONSIGNEE">到付</a-radio>
            <a-radio value="MONTHLY">月结</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            v-decorator="['sort', { initialValue: 100, rules: [{ required: true, message: '请输入排序值' }] }]"
          />
        </a-form-item>

        <a-form-item class="mt-20" :wrapperCol="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit" :loading="isBtnLoading">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import { pick } from 'lodash'
import * as Api from '@/api/eorder/template'
import * as ExpressApi from '@/api/setting/express'
import { isEmpty } from '@/utils/util'

export default {
  data () {
    return {
      // 正在加载
      isLoading: false,
      isBtnLoading: false,
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // 当前表单元素
      form: this.$form.createForm(this),
      // 物流公司列表
      expressList: [],
    }
  },
  async created () {
    // 获取物流公司列表
    await this.getExpressList()
  },
  methods: {

    // 获取物流公司列表
    async getExpressList () {
      this.isLoading = true
      await ExpressApi.all()
        .then(result => this.expressList = result.data.list)
        .finally(() => this.isLoading = false)
    },

    // 确认按钮
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields }, onFormSubmit } = this
      validateFields((errors, values) => {
        !errors && onFormSubmit(values)
      })
    },

    // 提交到后端api
    onFormSubmit (values) {
      this.isLoading = true
      this.isBtnLoading = true
      Api.add({ form: values })
        .then(result => {
          // 显示提示信息
          this.$message.success(result.message, 1.5)
          // 跳转到列表页
          setTimeout(() => this.$router.push('./index'), 1500)
        })
        .catch(() => this.isBtnLoading = false)
        .finally(() => this.isLoading = false)
    }

  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
