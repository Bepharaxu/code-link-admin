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

        <a-form-item label="活动时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-range-picker
            format="YYYY-MM-DD HH:mm:ss"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
            v-decorator="['betweenTime', { initialValue: defaultDate, rules: [{ required: true, message: '请选择有效期范围' }] }]"
          />
        </a-form-item>

        <a-form-item label="拼团类型" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <a-tooltip>
            <template slot="title">拼团类型创建后不允许修改</template>
            <a-radio-group
              v-decorator="['active_type', { initialValue: 10, rules: [{ required: true }] }]"
              :disabled="true"
            >
              <a-radio
                v-for="(item, index) in ActiveTypeEnum.data"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-radio>
            </a-radio-group>
          </a-tooltip>

          <p class="form-item-help">
            <small
              v-if="record.active_type == ActiveTypeEnum.NORMAL.value"
            >用户下单开团后，邀请好友拼团，以优惠价格购买，提升店铺转化</small>
            <small
              v-if="record.active_type == ActiveTypeEnum.PULL_NEW.value"
            >新老用户都可下单开团，但仅限新用户参团；新用户定义: 从未下单付款过的用户</small>
            <small
              v-if="record.active_type == ActiveTypeEnum.STEPS.value"
            >人数越多价格越低，用低价刺激用户发起拉人更多的拼团，高效裂变</small>
          </p>
        </a-form-item>

        <a-form-item label="拼单有效期" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="1"
            :precision="0"
            v-decorator="['group_time', { initialValue: 24, rules: [{ required: true, message: '请输入拼团有效期' }] }]"
          />
          <span class="ml-8">小时</span>
          <p class="form-item-help">
            <small>自用户成功发起拼团到拼单截止的周期</small>
          </p>
        </a-form-item>

        <a-form-item label="参团人数" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <div v-if="record.active_type == ActiveTypeEnum.STEPS.value">
            <a-form-item v-for="(value, index) in record.steps_config" :key="index">
              <span class="mr-10">第{{ index + 1 }}阶梯人数</span>
              <a-input-number
                :min="2"
                :max="100"
                :precision="0"
                v-decorator="[`steps_config[${index}]`, {
                  initialValue: value ? value.toString() : '',
                  validateTrigger: ['blur'],
                  rules: [
                    { required: true, message: '参团人数不能为空' },
                    { validator: validatorStepsConfig }
                  ],
                },
              ]"
              />
              <span class="ml-8">人</span>
              <a
                v-if="index > 1"
                class="ml-8"
                href="javascript:;"
                @click="handleDeleteStepsItem(index)"
              >删除</a>
            </a-form-item>
            <div v-if="record.steps_config.length < 5" class="action">
              <a href="javascript:;" @click="handleAddStepsItem()">添加阶梯人数</a>
            </div>
          </div>

          <div v-if="record.active_type != ActiveTypeEnum.STEPS.value">
            <a-input-number
              :min="2"
              :max="100"
              :precision="0"
              v-decorator="['people', { initialValue: 2, rules: [{ required: true, message: '请输入2-100之间的整数' }] }]"
            />
            <span class="ml-8">人</span>
            <p class="form-item-help">
              <small>如果参团人数不满足，则视为拼团失败，需取消订单并退款</small>
            </p>
          </div>
        </a-form-item>

        <!-- 多规格的表单内容 -->
        <div v-if="record.spec_type == 20 && goods && record">
          <MultiSpec
            ref="MultiSpec"
            :activeType="record.active_type"
            :stepsConfig="form.getFieldValue('steps_config')"
            :defaultSpecList="record.specList"
            :defaultSkuList="record.skuList"
          />
        </div>

        <!-- 单规格的表单内容 -->
        <div v-if="record.spec_type == 10 &&  goods && record">
          <a-form-item label="拼团价格" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
            <div v-if="record.active_type == ActiveTypeEnum.STEPS.value">
              <a-form-item
                v-for="(value, index) in form.getFieldsValue()['steps_config']"
                :key="index"
                v-show="value"
              >
                <span class="mr-10">{{ value }}人拼团价格</span>
                <a-input-number
                  :min="0.01"
                  :precision="2"
                  v-decorator="[`steps_price_config[${index}]`, {
                      validateTrigger: ['blur'],
                      rules: [
                        { required: true, message: '拼团价格不能为空' },
                        { validator: validatorStepsPrice }
                      ],
                    },
                  ]"
                />
                <span class="ml-8">元</span>
              </a-form-item>
            </div>

            <div v-if="record.active_type != ActiveTypeEnum.STEPS.value">
              <a-input-number
                :min="0.01"
                :precision="2"
                v-decorator="['groupon_price', { rules: [{ required: true, message: '请输入拼团价格' }] }]"
              />
              <span class="ml-8">元</span>
            </div>
          </a-form-item>
        </div>

        <a-form-item label="活动状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['status', { initialValue: 10, rules: [{ required: true }] }]"
          >
            <a-radio :value="10">进行中</a-radio>
            <a-radio :value="20">已结束</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" extra="数字越小越靠前">
          <a-input-number
            :min="0"
            :precision="0"
            v-decorator="['sort', { initialValue: 100, rules: [{ required: true, message: '请输入排序值' }] }]"
          />
        </a-form-item>

        <a-divider orientation="left">其他设置</a-divider>

        <a-form-item label="初始销量" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number
            :min="0"
            :precision="0"
            v-decorator="['initial_sales', { initialValue: 100, rules: [{ required: true, message: '请输入初始销量' }] }]"
          />
          <p class="form-item-help">
            <small>用户端显示的销量 = 初始销量 + 实际销量</small>
          </p>
        </a-form-item>

        <a-form-item label="单独购买" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['is_alone_buy', { initialValue: 1, rules: [{ required: true }] }]"
          >
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
          <p class="form-item-help">
            <small>开启后买家进入拼团商品详情页，无需发起拼团可直接选择原价购买</small>
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
            <a-form-item>
              <span class="mr-10">每单限购</span>
              <a-input-number
                :min="1"
                :precision="0"
                v-decorator="['restrict_single', { rules: [{ required: true, message: '请输入每单限购数量' }] }]"
              />
              <span class="ml-10">件/人</span>
            </a-form-item>
          </div>
        </a-form-item>

        <a-form-item label="显示凑团" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['is_quick_join', { initialValue: 1, rules: [{ required: true }] }]"
          >
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
          <p class="form-item-help">
            <small>活动商品详情页展示未成团的团列表，买家可以任选一个团参团，提升成团率</small>
          </p>
        </a-form-item>

        <a-form-item label="模拟成团" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['is_mock_task', { initialValue: 0, rules: [{ required: true }] }]"
          >
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
          <p class="form-item-help">
            <small>开启后，满足条件的团（拼单结束前12分钟内），系统将会模拟 “虚拟买家” 凑满该团，请确保拼团机器人的数量足够</small>
          </p>
          <!-- 最低参团人数 -->
          <div class="mt-10" v-if="form.getFieldValue('is_mock_task')">
            <a-form-item>
              <span class="mr-10">最低参团人数满足</span>
              <a-input-number
                :min="1"
                :precision="0"
                v-decorator="['mock_min_people', { initialValue: 1, rules: [{ validator: validatorMockMinPeople }] }]"
              />
              <span class="ml-10">人的团</span>
            </a-form-item>
          </div>
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
import * as Api from '@/api/groupon/goods'
import * as GoodsApi from '@/api/goods'
import { ActiveTypeEnum } from '@/common/enum/groupon'
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
      // 枚举类
      ActiveTypeEnum,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 默认日期范围
      defaultDate: [moment(), moment().add(7, 'days')],
      // 拼团商品ID
      grouponGoodsId: null,
      // 拼团商品详情
      record: {},
      // 主商品信息
      goods: null,

    }
  },
  beforeCreate () {
    this.moment = moment
  },
  async created () {
    // 记录拼团商品ID
    this.grouponGoodsId = this.$route.query.grouponGoodsId
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
      const { grouponGoodsId } = this
      await Api.detail(grouponGoodsId)
        .then(result => {
          this.record = result.data.detail
        })
    },

    // 获取指定的商品列表
    async getGoodsInfo () {
      const { record } = this
      await GoodsApi.basic(record.goods_id)
        .then(result => this.goods = result.data.detail)
    },

    // 设置表单默认值
    setFieldsValue () {
      const { record, form, $nextTick, getExistFields } = this
      // 设置表单内容
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        // 第一次赋值 (基础数据)
        const data = pick(record, [
          'active_type', 'group_time', 'is_quick_join', 'is_alone_buy', 'is_restrict',
          'is_mock_task', 'initial_sales', 'sort', 'status'
        ])
        // 时间范围
        data.betweenTime = this.getBetweenTime(record)
        form.setFieldsValue(data)
        // 第二次赋值 (适用于动态渲染的form-item)
        $nextTick(() => {
          const secondaryFields = getExistFields(['mock_min_people', 'restrict_total', 'restrict_single', 'people', 'steps_config'])
          form.setFieldsValue(pick(record, secondaryFields))
          // 单规格数据
          const skuOneFields = getExistFields(['groupon_price', 'steps_price_config'])
          $nextTick(() => {
            form.setFieldsValue(pick(record.skuList[0], skuOneFields))
          })
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

    // 自定义验证：最低参团人数
    validatorMockMinPeople (rule, value, callback) {
      const { form, record } = this
      const activeType = record.active_type
      const stepsConfig = form.getFieldValue('steps_config')
      if (!value) {
        callback('请填写模拟成团最低参团人数')
        return
      }
      const comparative = (activeType != ActiveTypeEnum.STEPS.value) ? form.getFieldValue('people') : stepsConfig[stepsConfig.length - 1]
      if (parseInt(value) >= parseInt(comparative)) {
        callback('模拟成团人数应小于最大参团人数')
        return
      }
      callback()
    },

    // 自定义验证：阶梯人数
    validatorStepsConfig (rule, value, callback) {
      const stepsConfig = this.form.getFieldValue('steps_config')
      const index = rule.field.match(/steps_config\[(\d+)\]/)[1]
      if (parseInt(value) < 2) {
        callback('参团人数最少2人')
        return
      }
      if (parseInt(value) > 100) {
        callback('参团人数最多100人')
        return
      }
      if (value && index > 0 && parseInt(stepsConfig[index - 1]) >= parseInt(value)) {
        callback('参团人数需要大于上一级阶梯')
        return
      }
      callback()
    },

    // 自定义验证：阶梯价格
    validatorStepsPrice (rule, value, callback) {
      const stepsPrice = this.form.getFieldValue('steps_price_config')
      const index = rule.field.match(/steps_price_config\[(\d+)\]/)[1]
      if (value && index > 0 && parseFloat(stepsPrice[index - 1]) <= parseFloat(value)) {
        callback('价格需要小于上一级阶梯')
        return
      }
      callback()
    },

    // 添加阶梯人数
    handleAddStepsItem () {
      this.record.steps_config.push(undefined)
      this.forceUpdate()
    },

    // 删除阶梯人数
    handleDeleteStepsItem (index) {
      this.record.steps_config.splice(index, 1)
      this.forceUpdate()
    },

    forceUpdate () {
      this.$nextTick(() => this.$forceUpdate(), 10)
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
      Api.edit(this.grouponGoodsId, { form: values })
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
  .ant-form-item-control {
    padding-left: 0;
  }
}
.ant-form-item {
  .ant-form-item {
    margin-bottom: 0;
  }
}

.ant-divider {
  margin-top: 50px !important;
}
</style>
