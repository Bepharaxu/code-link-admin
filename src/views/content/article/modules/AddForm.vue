<template>
  <a-modal
    :title="title"
    :width="780"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :destroyOnClose="true"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="客户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['name', { rules: [{ required: true, min: 2, message: '请输入至少2个字符' }] }]"
          />
        </a-form-item>
        <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['phone', { rules: [{ required: false, min: 11, message: '请输入正确的手机号' }] }]"
          />
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['remark', { rules: [{ required: false, min: 2, message: '请输入至少2个字符' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/content/article'
import { SelectImage, Ueditor } from '@/components'

export default {
  components: {
    SelectImage,
    Ueditor
  },
  props: {
    // 分类列表
    categoryList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      // 对话框标题
      title: '新增文章',
      // 标签布局属性
      labelCol: {
        span: 7
      },
      // 输入框布局属性
      wrapperCol: {
        span: 13
      },
      // modal(对话框)是否可见
      visible: false,
      // modal(对话框)确定按钮 loading
      confirmLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this)
    }
  },
  methods: {

    // 显示对话框
    add () {
      // 显示窗口
      this.visible = true
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
      Api.add(values)
        .then(result => {
           // 显示成功
          this.$message.success('保存成功', 1.5)
          // 关闭对话框事件
          this.handleCancel()
          // 通知父端组件提交完成了
          this.$emit('handleSubmit', values)
        })
        .finally(result => {
          this.confirmLoading = false
        })
    }

  }
}
</script>
