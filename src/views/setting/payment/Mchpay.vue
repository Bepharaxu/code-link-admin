<template>
  <a-spin :spinning="isLoading">
    <a-form :form="form" @submit="handleSubmit">
      <a-card :bordered="false">
        <div class="card-title">打款设置</div>
        <a-alert class="mb-30" :showIcon="true" message="打款设置说明" banner>
          <template slot="description">
            <p>1. 如使用微信支付打款，则需申请微信商家转账到零钱功能</p>
            <p>2. 支付宝打款需签约 "转账到支付宝账户" 能力，且加签模式必须是 "公钥证书"</p>
          </template>
        </a-alert>
        <a-form-item label="微信公众号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            style="width: 260px;"
            placeholder="请选择支付模板"
            v-decorator="[`wechat.${ClientEnum.WXOFFICIAL.value}.templateId`, { rules: [{ required: true, message: '请选择支付模板' }] }]"
          >
            <a-select-option :value="0">不启用</a-select-option>
            <a-select-option
              v-for="(item, index) in wechatTemplateList"
              :key="index"
              :value="item.template_id"
            >{{ item.name }}</a-select-option>
          </a-select>
          <router-link
            v-if="$auth('/setting/payment/template/create')"
            :to="{ path: '/setting/payment/template/create' }"
            class="ml-10 f-12"
            target="_blank"
          >新增模板</router-link>
        </a-form-item>
        <a-form-item label="微信小程序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            style="width: 260px;"
            placeholder="请选择支付模板"
            v-decorator="[`wechat.${ClientEnum.MP_WEIXIN.value}.templateId`, { rules: [{ required: true, message: '请选择支付模板' }] }]"
          >
            <a-select-option :value="0">不启用</a-select-option>
            <a-select-option
              v-for="(item, index) in wechatTemplateList"
              :key="index"
              :value="item.template_id"
            >{{ item.name }}</a-select-option>
          </a-select>
          <router-link
            v-if="$auth('/setting/payment/template/create')"
            :to="{ path: '/setting/payment/template/create' }"
            class="ml-10 f-12"
            target="_blank"
          >新增模板</router-link>
        </a-form-item>
        <a-divider orientation="left">支付宝打款</a-divider>
        <a-form-item label="支付宝模板" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            style="width: 260px;"
            placeholder="请选择支付模板"
            v-decorator="['alipay.templateId', { rules: [{ required: true, message: '请选择支付模板' }] }]"
          >
            <a-select-option :value="0">不启用</a-select-option>
            <a-select-option
              v-for="(item, index) in alipayTemplateList"
              :key="index"
              :value="item.template_id"
            >{{ item.name }}</a-select-option>
          </a-select>
          <router-link
            v-if="$auth('/setting/payment/template/create')"
            :to="{ path: '/setting/payment/template/create' }"
            class="ml-10 f-12"
            target="_blank"
          >新增模板</router-link>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-card>
    </a-form>
  </a-spin>
</template>

<script>
import pick from 'lodash.pick'
import { isEmpty } from '@/utils/util'
import * as Api from '@/api/setting/store'
import * as TemplateApi from '@/api/setting/payment/template'
import ClientEnum from '@/common/enum/Client'

export default {
  data () {
    return {
      // 当前设置项的key
      key: 'mch_pay',
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // loading状态
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 枚举类
      ClientEnum,
      // 当前记录详情
      record: {},
      // 支付模板列表
      templateList: []
    }
  },
  computed: {
    wechatTemplateList () {
      return this.templateList.filter(item => item.method === 'wechat')
    },
    alipayTemplateList () {
      return this.templateList.filter(item => item.method === 'alipay')
    }
  },
  // 初始化数据
  async created () {
    // 获取当前详情记录
    await this.getDetail()
    // 获取支付模板列表
    await this.getTemplateList()
    // 设置默认值
    this.setFieldsValue()
  },
  methods: {

    // 获取当前详情记录
    async getDetail () {
      this.isLoading = true
      return Api.detail(this.key)
        .then(result => {
          // 当前记录
          this.record = result.data.values
        })
        .finally(() => this.isLoading = false)
    },

    // 获取支付模板列表
    async getTemplateList () {
      this.isLoading = true
      return TemplateApi.all()
        .then(result => {
          this.templateList = result.data.list
        })
        .finally(() => this.isLoading = false)
    },

    // 设置默认值
    setFieldsValue () {
      const { record, $nextTick, form } = this
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        form.setFieldsValue(pick(record, ['wechat', 'alipay']))
      })
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

    // 提交到后端api
    onFormSubmit (values) {
      this.isLoading = true
      Api.update(this.key, { form: values })
        .then(result => this.$message.success(result.message, 1.5))
        .finally(() => this.isLoading = false)
    }

  }
}
</script>
<style lang="less" scoped>

.ant-divider {
  margin-top: 60px !important;
  margin-bottom: 40px !important;
}
/deep/.ant-form-item-control {
  padding-left: 10px;

  .ant-form-item-control {
    padding-left: 0;
  }
}
</style>
