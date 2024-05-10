<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="砍价商品" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
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

        <a-form-item label="活动时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-range-picker
            format="YYYY-MM-DD HH:mm:ss"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
            v-decorator="['betweenTime', { initialValue: defaultDate, rules: [{ required: true, message: '请选择有效期范围' }] }]"
          />
        </a-form-item>

        <a-form-item label="砍价有效期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="2"
            :precision="0"
            v-decorator="['expiryt_time', { initialValue: 2, rules: [{ required: true, message: '请输入砍价有效期' }] }]"
          />
          <span class="ml-5">小时</span>
          <p class="form-item-help">
            <small>自用户发起砍价到砍价截止的时间</small>
          </p>
        </a-form-item>

        <a-form-item label="砍价底价" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0.01"
            :precision="2"
            v-decorator="['floor_price', { rules: [{ required: true, message: '请输入砍价底价' }] }]"
          />
          <span class="ml-5">元</span>
          <div class="form-item-help">
            <small>砍价商品的最低价格</small>
          </div>
        </a-form-item>

        <a-form-item label="帮砍人数" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="2"
            :precision="0"
            v-decorator="['peoples', { initialValue: 2, rules: [{ required: true, message: '请输入帮砍人数' }] }]"
          />
          <span class="ml-5">人</span>
          <p class="form-item-help">
            <small>每个砍价订单的帮砍人数，达到该人数才可砍至底价</small>
          </p>
        </a-form-item>

        <a-form-item label="可自砍一刀" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['is_self_cut', { initialValue: 1, rules: [{ required: true }] }]"
          >
            <a-radio :value="1">允许</a-radio>
            <a-radio :value="0">不允许</a-radio>
          </a-radio-group>
          <div class="form-item-help">
            <small>砍价发起人自己砍一刀</small>
          </div>
        </a-form-item>

        <a-form-item label="必须底价购买" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['is_floor_buy', { initialValue: 1, rules: [{ required: true }] }]"
          >
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
          <div class="form-item-help">
            <small>只有砍到底价才可以购买</small>
          </div>
        </a-form-item>

        <a-form-item label="活动状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">进行中</a-radio>
            <a-radio :value="0">已结束</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            v-decorator="['sort', { initialValue: 100, rules: [{ required: true, message: '请输入排序值' }] }]"
          />
        </a-form-item>

        <a-divider orientation="left">其他设置</a-divider>

        <a-form-item label="初始销量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :precision="0"
            v-decorator="['initial_sales', { initialValue: 0, rules: [{ required: true, message: '请输入初始销量' }] }]"
          />
          <span class="ml-5">件</span>
          <p class="form-item-help">
            <small>用户端显示的销量 = 初始销量 + 实际销量</small>
          </p>
        </a-form-item>

        <a-form-item label="活动限购" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['is_restrict', { initialValue: 0, rules: [{ required: true }] }]"
          >
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
          <!-- 最低参团人数 -->
          <div class="mt-10" v-if="form.getFieldValue('is_restrict')">
            <a-form-item>
              <span class="mr-10">总限购</span>
              <a-input-number
                :min="1"
                :precision="0"
                v-decorator="['restrict_total', { rules: [{ required: true, message: '请输入总限购数量' }] }]"
              />
              <span class="ml-10">件/人</span>
            </a-form-item>
          </div>
        </a-form-item>

        <a-form-item label="分享标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入分享标题"
            v-decorator="['share_title', { rules: [{ required: true, min: 2, message: '请输入至少2个字符' }] }]"
          />
        </a-form-item>

        <a-form-item label="砍价助力语" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入砍价助力语"
            v-decorator="['prompt_words', { rules: [{ required: true, min: 2, message: '请输入至少2个字符' }] }]"
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
import moment from 'moment'
import _, { pick, get } from 'lodash'

import * as Api from '@/api/bargain/active'
import * as GoodsApi from '@/api/goods'
import { isEmpty } from '@/utils/util'
import { GoodsItem } from '@/components/Table'

export default {
  components: {
    GoodsItem
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
      // 默认日期范围
      defaultDate: [moment(), moment().add(7, 'days')],
      // 砍价活动ID
      activeId: null,
      // 当前记录
      record: {},
      // 商品信息
      goods: null
    }
  },
  beforeCreate () {
    this.moment = moment
  },
  async created () {
    // 记录砍价活动ID
    this.activeId = this.$route.query.activeId
    // 获取当前活动记录
    await this.getDetail()
    // 获取商品信息
    await this.getGoodsInfo()
  },
  methods: {

    // 获取当前记录
    async getDetail () {
      const { activeId } = this
      this.isLoading = true
      await Api.detail({ activeId })
        .then(result => {
          // 当前记录
          this.record = result.data.detail
          // 设置表单默认值
          this.setFieldsValue()
        })
        .finally(() => this.isLoading = false)
    },

    // 获取指定的商品列表
    async getGoodsInfo () {
      const { record } = this
      this.isLoading = true
      await GoodsApi.basic(record.goods_id)
        .then(result => this.goods = result.data.detail)
        .finally(() => this.isLoading = false)
    },

    // 设置表单默认值
    setFieldsValue () {
      const { record, form, $nextTick, getExistFields } = this
      // 设置表单内容
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        // 第一次赋值 (基础数据)
        const data = pick(record, [
          'expiryt_time', 'floor_price', 'peoples', 'is_self_cut', 'is_floor_buy', 'is_restrict',
          'share_title', 'prompt_words', 'initial_sales', 'sort', 'status'
        ])
        // 时间范围
        data.betweenTime = this.getBetweenTime(record)
        form.setFieldsValue(data)
        // 第二次赋值 (适用于动态渲染的form-item)
        $nextTick(() => {
          form.setFieldsValue(pick(record, getExistFields(['restrict_total'])))
        })
      })
    },

    // 获取已存在的字段
    getExistFields (fields) {
      const { record, form } = this
      return _.intersection(_.keys(form.getFieldsValue()), fields)
    },

    // 格式化时间范围
    getBetweenTime (record) {
      return [moment(new Date(record.start_time)), moment(new Date(record.end_time))]
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
      Api.edit(this.activeId, { form: values })
        .then(result => {
          // 显示提示信息
          this.$message.success(result.message, 1.5)
          // 跳转到列表页
          setTimeout(() => this.$router.push('./index'), 1200)
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
