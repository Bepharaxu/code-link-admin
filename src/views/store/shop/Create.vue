<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="门店名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入门店名称"
            v-decorator="['shop_name', { rules: [{ required: true, min: 2, message: '请输入至少2个字符' }] }]"
          />
        </a-form-item>
        <a-form-item
          label="门店Logo"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          extra="建议尺寸: 300*300"
          required
        >
          <SelectImage
            v-decorator="['logo_image_id', { rules: [{ required: true, message: '请上传门店logo' }] }]"
          />
        </a-form-item>
        <a-form-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入联系人"
            v-decorator="['linkman', { rules: [{ required: true, min: 2, message: '请输入至少2个字符' }] }]"
          />
        </a-form-item>
        <a-form-item label="联系电话" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入联系电话" v-decorator="['phone', { rules: [{ required: true }] }]" />
        </a-form-item>
        <a-form-item
          label="营业时间"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          extra="例如：8:30-17:30"
        >
          <a-input placeholder="请输入营业时间" v-decorator="['shop_hours', { rules: [{ required: true }] }]" />
        </a-form-item>
        <a-form-item label="门店区域" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectRegion
            placeholder="请选择省市区"
            v-decorator="['cascader', { rules: [{ required: true, message: '请选择省市区' }] }]"
          />
        </a-form-item>
        <a-form-item label="详细地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input placeholder="请输入详细地址" v-decorator="['address', { rules: [{ required: true }] }]" />
        </a-form-item>

        <a-form-item label="门店坐标" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <a-input placeholder="请选择门店坐标" v-decorator="['coordinate', { rules: [{ required: true }] }]" />
          <Getpoint @setCoordinate="setCoordinate" />
        </a-form-item>

        <a-form-item label="门店简介" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea :autoSize="{ minRows: 4 }" v-decorator="['summary']" />
        </a-form-item>
        <a-form-item label="自提核销" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['is_check', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">支持</a-radio>
            <a-radio :value="0">不支持</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
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
import * as Api from '@/api/store/shop'
import { SelectImage, SelectRegion, Getpoint } from '@/components'

export default {
  components: {
    SelectImage,
    SelectRegion,
    Getpoint
  },
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
      form: this.$form.createForm(this)
    }
  },
  created () {
  },
  methods: {

    // 设置门店坐标
    setCoordinate (coordinate) {
      const { form, $nextTick } = this
      $nextTick(() => {
        form.setFieldsValue({ coordinate })
      })
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
          setTimeout(() => {
            this.$router.push('./index')
          }, 1500)
        })
        .catch(() => {
          this.isBtnLoading = false
        })
        .finally(() => this.isLoading = false)
    }

  }
}
</script>
