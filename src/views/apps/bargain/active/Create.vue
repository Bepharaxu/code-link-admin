<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="砍价商品" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <SelectGoods
            :multiple="false"
            v-decorator="['goods_id', { rules: [{ required: true, message: '请选择指定的商品' }] }]"
          />
          <p class="form-item-help">
            <small>每个活动只能选择一个商品</small>
          </p>
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
            v-decorator="['expiryt_time', { initialValue: 24, rules: [{ required: true, message: '请输入砍价有效期' }] }]"
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
            v-decorator="['share_title', {
              initialValue: '麻烦帮我砍一刀！我真的很想要了，爱你哟！(๑′ᴗ‵๑)',
              rules: [{ required: true, min: 2, message: '请输入至少2个字符' }]
            }]"
          />
        </a-form-item>

        <a-form-item label="砍价助力语" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            placeholder="请输入砍价助力语"
            v-decorator="['prompt_words', {
              initialValue: '&quot;朋友一生一起走，帮砍一刀有没有&quot;',
              rules: [{ required: true, min: 2, message: '请输入至少2个字符' }]
            }]"
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
import { pick, get } from 'lodash'
import * as Api from '@/api/bargain/active'
import * as GoodsApi from '@/api/goods'
import { SelectGoods } from '@/components'

export default {
  components: {
    SelectGoods
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
      defaultDate: [moment(), moment().add(7, 'days')]
    }
  },
  beforeCreate () {
    this.moment = moment
  },
  methods: {

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
