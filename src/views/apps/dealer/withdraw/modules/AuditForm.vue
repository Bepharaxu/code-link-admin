<template>
  <a-modal
    :title="title"
    :width="520"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="审核状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['apply_status', { initialValue: 20, rules: [{ required: true }] }]"
          >
            <a-radio :value="20">审核通过</a-radio>
            <a-radio :value="30">驳回</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="驳回原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['reject_reason']" placeholder="仅在驳回时填写" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/dealer/withdraw'

export default {
  data () {
    return {
      // 对话框标题
      title: '审核提现申请',
      // 标签布局属性
      labelCol: { span: 7 },
      // 输入框布局属性
      wrapperCol: { span: 13 },
      // modal(对话框)是否可见
      visible: false,
      // modal(对话框)确定按钮 loading
      confirmLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 当前记录
      record: {}
    }
  },
  methods: {

    // 显示对话框
    edit (record) {
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record
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
      this.confirmLoading = true
      Api.audit({ id: this.record.id, form: values })
        .then(result => {
          // 显示成功
          this.$message.success(result.message, 1.5)
          // 关闭对话框事件
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', values)
        })
        .finally(() => this.confirmLoading = false)
    }

  }
}
</script>
