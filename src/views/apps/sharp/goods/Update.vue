<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="商品信息" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <GoodsItem
            v-if="goods"
            :data="{
              image: goods.goods_image,
              imageAlt: '商品图片',
              title: goods.goods_name,
              subtitle: `¥${goods.goods_price_min}`
            }"
            :subTitleColor="true"
          />
        </a-form-item>

        <!-- <a-form-item
          v-if="goods"
          label="商品原价"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          required
        >
          <span class="c-p">¥{{ goods.goods_price_min }}</span>
        </a-form-item>-->

        <a-form-item v-if="goods" label="商品编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span>{{ goods.goods_no ? goods.goods_no : '-' }}</span>
        </a-form-item>

        <!-- 多规格的表单内容 -->
        <div v-if="record.spec_type == 20 && goods && record">
          <MultiSpec
            ref="MultiSpec"
            :defaultSpecList="record.specList"
            :defaultSkuList="record.skuList"
          />
        </div>

        <!-- 单规格的表单内容 -->
        <div v-show="record.spec_type == 10 && goods && record">
          <a-form-item label="秒杀价格" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number
              :min="0.01"
              :precision="2"
              v-decorator="['seckill_price', { rules: [{ required: true, message: '请输入秒杀价格' }] }]"
            />
            <span class="ml-5">元</span>
          </a-form-item>

          <a-form-item label="秒杀库存数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number
              :min="0"
              :precision="0"
              v-decorator="['seckill_stock', { rules: [{ required: true, message: '请输入秒杀库存数量' }] }]"
            />
            <span class="ml-5">件</span>
            <p class="form-item-help">
              <small>注：秒杀库存为独立库存，与主商品库存不同步</small>
            </p>
          </a-form-item>
        </div>

        <a-form-item label="限购数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :precision="0"
            v-decorator="['limit_num', { rules: [{ required: true, message: '请输入限购数量' }] }]"
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
import * as GoodsApi from '@/api/goods'
import { isEmpty } from '@/utils/util'
import { GoodsItem } from '@/components/Table'
import { MultiSpec } from './modules'

export default {
  components: {
    GoodsItem,
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
      form: this.$form.createForm(this),
      // 秒杀商品ID
      sharpGoodsId: null,
      // 秒杀商品详情
      record: null,
      // 主商品信息
      goods: null
    }
  },
  async created () {
    // 记录秒杀商品ID
    this.sharpGoodsId = this.$route.query.sharpGoodsId
    this.isLoading = true
    // 获取当前活动记录
    await this.getDetail()
    // 获取商品信息
    await this.getGoodsInfo()
    this.isLoading = false
    // 设置表单默认值
    this.setFieldsValue()
  },
  methods: {

    // 获取当前记录
    async getDetail () {
      const { sharpGoodsId } = this
      await Api.detail({ sharpGoodsId })
        .then(result => this.record = result.data.detail)
    },

    // 获取指定的商品列表
    async getGoodsInfo () {
      const { record } = this
      await GoodsApi.basic(record.goods_id)
        .then(result => this.goods = result.data.detail)
    },

    // 设置表单默认值
    setFieldsValue () {
      const { record, form, $nextTick, getFieldsValue } = this
      // 设置表单内容
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        form.setFieldsValue(getFieldsValue())
      })
    },

    // 获取表单默认值(用于form.setFieldsValue的数据)
    getFieldsValue () {
      // 商品详情信息
      const { record, goods } = this
      // 商品基本数据
      const goodsFormData = pick(record, ['deduct_stock_type', 'limit_num', 'sort', 'status'])
      // 单规格数据
      const skuOne = pick(record.skuList[0], ['seckill_price', 'seckill_stock'])
      return {
        ...goodsFormData,
        ...skuOne
      }
    },

    // 确认按钮
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { record, form: { validateFields }, onFormSubmit } = this
      validateFields((errors, values) => {
        if (errors) return false
        // 验证多规格
        if (record.spec_type === 20) {
          const MultiSpec = this.$refs.MultiSpec
          if (!MultiSpec.verifyForm()) {
            return false
          }
          // 记录多规格数据
          values.specData = MultiSpec.getFromSpecData()
        }
        // 提交到后端api
        onFormSubmit(values)
      })
    },

    // 提交到后端api
    onFormSubmit (values) {
      this.isLoading = true
      this.isBtnLoading = true
      Api.edit(this.sharpGoodsId, { form: values })
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
