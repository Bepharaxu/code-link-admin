<template>
  <a-modal
    :title="title"
    :width="720"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="用户昵称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['nick_name', { rules: [{ required: true, message: '请输入用户昵称' }] }]"
          />
        </a-form-item>

        <a-form-item
          label="用户头像"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          extra="建议尺寸: 300*300"
          required
        >
          <SelectImage
            :defaultList="record.avatar ? [record.avatar] : []"
            v-decorator="['avatar_id', { rules: [{ required: true, message: '请上传用户头像' }] }]"
          />
        </a-form-item>

        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['gender', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="2">女</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            v-decorator="['sort', { initialValue: 100, rules: [{ required: true, message: '请输入排序值' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/groupon/robot'
import { SelectImage } from '@/components'

export default {
  components: {
    SelectImage
  },
  data () {
    return {
      // 对话框标题
      title: '编辑机器人',
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
    handle (record) {
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record
      // 设置默认值
      this.setFieldsValue()
    },

    // 设置默认值
    setFieldsValue () {
      const { record, form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, ['nick_name', 'avatar_id', 'gender', 'sort']))
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

    // 关闭对话框事件
    handleCancel () {
      this.visible = false
      this.form.resetFields()
    },

    // 提交到后端api
    onFormSubmit (values) {
      this.confirmLoading = true
      Api.edit({ robotId: this.record.robot_id, form: values })
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
