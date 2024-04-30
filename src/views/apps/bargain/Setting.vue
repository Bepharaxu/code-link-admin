<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          v-if="$module('apps-dealer')"
          class="mt-30"
          label="是否参与分销"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-radio-group v-decorator="['isDealer', { rules: [{ required: true }] }]">
            <a-radio :value="true">开启</a-radio>
            <a-radio :value="false">关闭</a-radio>
          </a-radio-group>
          <div class="form-item-help">
            <small>注：砍价活动订单是否参与分销（需开启分销功能）</small>
          </div>
        </a-form-item>
        <a-form-item label="砍价活动规则" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            v-decorator="['rulesDesc', { rules: [{ required: true, message: '请输入砍价规则' }] }]"
            :auto-size="{ minRows: 6, maxRows: 12 }"
          />
        </a-form-item>
        <a-form-item label="每日帮砍限制" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :precision="0"
            v-decorator="['helpCutLimitNum', { initialValue: 0, rules: [{ required: true, message: '请输入每日帮砍限制' }] }]"
          />
          <span class="ml-5">次</span>
          <p class="form-item-help">
            <small>每人每日可以帮他人砍价的次数限制，如果为0则不限制</small>
          </p>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { isEmpty } from '@/utils/util'
import * as Api from '@/api/bargain/setting'

export default {
  data () {
    return {
      // 标签布局属性
      labelCol: { span: 4 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // loading状态
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 当前设置项key
      key: 'basic',
      // 当前记录详情
      record: {}
    }
  },
  // 初始化数据
  created () {
    // 获取当前详情记录
    this.getDetail()
  },
  methods: {

    // 获取当前详情记录
    getDetail () {
      this.isLoading = true
      Api.detail(this.key)
        .then(result => {
          // 当前记录
          this.record = result.data.detail
          // 设置默认值
          this.setFieldsValue()
        })
        .finally(() => this.isLoading = false)
    },

    // 设置默认值
    setFieldsValue () {
      const { record, $nextTick, form } = this
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        form.setFieldsValue(pick(record, ['isDealer', 'rulesDesc', 'helpCutLimitNum']))
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
.ant-form-item {
  margin-bottom: 25px;
}
/deep/.ant-form-item-control {
  padding-left: 10px;

  .ant-form-item-control {
    padding-left: 0;
  }
}
</style>
