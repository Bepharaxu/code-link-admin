<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="选择商品" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <SelectGoods
            :multiple="false"
            v-decorator="['goods_id', { rules: [{ required: true, message: '请选择指定的商品' }] }]"
          />
          <p class="form-item-help">
            <small>注：添加秒杀商品后，将不允许修改主商品的规格属性</small>
          </p>
        </a-form-item>

        <a-form-item label="限购数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :precision="0"
            v-decorator="['limit_num', { initialValue: 1, rules: [{ required: true, message: '请输入限购数量' }] }]"
          />
          <span class="ml-5">件</span>
          <p class="form-item-help">
            <small>注：每人限制购买的数量，如果填写0则不限购</small>
          </p>
        </a-form-item>
        <a-form-item label="库存计算方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['deduct_stock_type', { initialValue: 10, rules: [{ required: true }] }]"
          >
            <a-radio :value="10">下单减库存</a-radio>
            <a-radio :value="20" disabled>付款减库存</a-radio>
          </a-radio-group>
          <p class="form-item-help">
            <small>注：秒杀商品为防止超卖风险仅支持下单减库存</small>
          </p>
        </a-form-item>

        <a-form-item label="商品状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">上架</a-radio>
            <a-radio :value="0">下架</a-radio>
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
import { pick, get } from 'lodash'
import * as Api from '@/api/sharp/goods'
import { isEmpty } from '@/utils/util'
import { SelectGoods } from '@/components'
import { MultiSpec } from './modules'

export default {
  components: {
    SelectGoods,
    MultiSpec
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

    // 确认按钮
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { record, form: { validateFields }, onFormSubmit } = this
      validateFields((errors, values) => {
        // 提交到后端api
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
          }, 1200)
        })
        .catch(() => this.isBtnLoading = false)
        .finally(() => this.isLoading = false)
    }

  }
}
</script>
<style lang="less" scoped>
/deep/.ant-form-item-control {
  padding-left: 10px;
}
.ant-form-item {
  .ant-form-item {
    margin-bottom: 0;
  }
}
</style>
