<template>
  <a-card :bordered="false">
    <div class="card-title">电子面单设置</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="是否开启电子面单" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['enable', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="API 服务网关" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['provider', { initialValue: 'kdniao', rules: [{ required: true }] }]"
          >
            <a-radio value="kdniao">快递鸟</a-radio>
            <a-radio value="kd100">快递100</a-radio>
          </a-radio-group>
        </a-form-item>

        <div v-show="form.getFieldValue('provider') === 'kd100'">
          <a-form-item label="授权 KEY" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['providerConfig.kd100.key']" />
            <div class="form-item-help">
              <small>快递100官网提供，登录快递100</small>
              <a
                href="https://api.kuaidi100.com/manager/page/myinfo/enterprise"
                target="_blank"
              >企业信息</a>
              <small>获取</small>
            </div>
          </a-form-item>

          <a-form-item label="Secret" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['providerConfig.kd100.secret']" />
            <div class="form-item-help">
              <small>快递100官网提供，登录快递100</small>
              <a
                href="https://api.kuaidi100.com/manager/page/myinfo/enterprise"
                target="_blank"
              >企业信息</a>
              <small>获取</small>
            </div>
          </a-form-item>
        </div>

        <div v-show="form.getFieldValue('provider') === 'kdniao'">
          <a-form-item label="用户ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['providerConfig.kdniao.eBusinessID']" />
            <div class="form-item-help">
              <small>快递鸟官网提供，登录快递鸟</small>
              <a href="https://www.kdniao.com/UserCenter/v4/UserHome.aspx" target="_blank">会员中心</a>
              <small>获取</small>
            </div>
          </a-form-item>

          <a-form-item label="API KEY" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['providerConfig.kdniao.apiKey']" />
            <div class="form-item-help">
              <small>快递鸟官网提供，登录快递鸟</small>
              <a href="https://www.kdniao.com/UserCenter/v4/UserHome.aspx" target="_blank">会员中心</a>
              <small>获取</small>
            </div>
          </a-form-item>
        </div>

        <a-form-item :wrapperCol="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/eorder/setting'
import { isEmpty } from '@/utils/util'

export default {
  data () {
    return {
      // 当前设置项的key
      key: 'basic',
      // 标签布局属性
      labelCol: { span: 4 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // loading状态
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 当前记录详情
      record: {}
    }
  },
  // 初始化数据
  async created () {
    // 获取当前详情记录
    await this.getDetail()
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
          this.record = result.data.detail
        })
        .finally(() => this.isLoading = false)
    },

    // 设置默认值
    setFieldsValue () {
      const { record, $nextTick, form } = this
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        form.setFieldsValue(pick(record, ['enable', 'provider', 'providerConfig']))
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
/deep/.ant-form-item-control {
  padding-left: 10px;

  .ant-form-item-control {
    padding-left: 0;
  }
}
</style>
