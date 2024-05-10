<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item class="mt-30" label="拼单失败自动退款" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['taskFailAutoRefund', { rules: [{ required: true }] }]">
            <a-radio :value="true">开启</a-radio>
            <a-radio :value="false">关闭</a-radio>
          </a-radio-group>
          <div class="form-item-help">
            <small>注：拼单如果超时还未拼成，则自动将订单取消并退款</small>
          </div>
        </a-form-item>

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
            <small>注：拼团活动订单是否参与分销（需开启分销功能）</small>
          </div>
        </a-form-item>

        <a-form-item class="mt-30" label="是否叠加其他优惠方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['isOtherDiscount', { rules: [{ required: true }] }]">
            <a-radio :value="true">开启</a-radio>
            <a-radio :value="false">关闭</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-show="form.getFieldValue('isOtherDiscount')"
          label="可用优惠方式"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          required
        >
          <a-checkbox-group v-decorator="['otherDiscount']">
            <a-checkbox value="coupon">优惠券</a-checkbox>
            <a-checkbox value="points">积分抵扣</a-checkbox>
          </a-checkbox-group>
        </a-form-item>

        <a-divider orientation="left">活动说明</a-divider>
        <a-form-item label="拼团活动图" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectImage2
            :width="375"
            :height="184"
            v-decorator="['backdrop.src', { initialValue: '', rules: [{ required: true, message: '请上传拼团活动图' }] }]"
            tips="建议尺寸：宽750 高度368"
          />
          <div class="form-item-help">
            <p class="extra">尺寸：宽750像素 高度不限</p>
          </div>
        </a-form-item>

        <a-form-item label="拼团活动简述" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['ruleBrief', { rules: [{ required: true, message: '拼团活动简述' }] }]" />
        </a-form-item>

        <a-form-item label="拼团活动规则" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            v-decorator="['ruleDetail', { rules: [{ required: true, message: '拼团活动规则' }] }]"
            :auto-size="{ minRows: 6, maxRows: 12 }"
          />
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
import * as Api from '@/api/groupon/setting'
import { SelectImage2 } from '@/components'

export default {
  components: {
    SelectImage2
  },
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
        form.setFieldsValue(pick(record, [
          'taskFailAutoRefund', 'isDealer', 'isOtherDiscount', 'otherDiscount', 'backdrop', 'ruleBrief', 'ruleDetail'
        ]))
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
.ant-divider {
  margin-top: 60px !important;
}
</style>
