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
            <small>添加拼团商品后，将不允许修改主商品的规格属性</small>
          </p>
        </a-form-item>

        <a-form-item label="活动时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-range-picker
            format="YYYY-MM-DD HH:mm:ss"
            :show-time="{ defaultValue: moment('00:00:00', 'HH:mm:ss') }"
            v-decorator="['betweenTime', { initialValue: defaultDate, rules: [{ required: true, message: '请选择有效期范围' }] }]"
          />
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
          <div v-if="activeType == ActiveTypeEnum.STEPS.value">
            <a-form-item v-for="(item, index) in stepsConfig" :key="index">
              <span class="mr-10">第{{ index + 1 }}阶梯人数</span>
              <a-input-number
                :min="2"
                :precision="0"
                v-decorator="[`steps_config[${index}]`, {
                  initialValue: item.value ? item.value.toString() : '',
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
            <div v-if="stepsConfig.length < 5" class="action">
              <a href="javascript:;" @click="handleAddStepsItem()">添加阶梯人数</a>
            </div>
          </div>
          <div v-if="activeType != ActiveTypeEnum.STEPS.value">
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
                v-decorator="['restrict_total', { initialValue: 9999, rules: [{ required: true, message: '请输入总限购数量' }] }]"
              />
              <span class="ml-10">件/人</span>
            </a-form-item>
            <a-form-item>
              <span class="mr-10">每单限购</span>
              <a-input-number
                :min="1"
                :precision="0"
                v-decorator="['restrict_single', { initialValue: 9999, rules: [{ required: true, message: '请输入每单限购数量' }] }]"
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
import * as Api from '@/api/groupon/goods'
import { SelectGoods } from '@/components'
import { ActiveTypeEnum } from '@/common/enum/groupon'

// 默认的阶梯人数配置
const stepsConfig = [
  { value: 2 },
  { value: 3 }
]

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
      // 枚举类
      ActiveTypeEnum,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 默认日期范围
      defaultDate: [moment(), moment().add(7, 'days')],
      // 默认的阶梯人数配置
      stepsConfig,
      // 拼团类型
      activeType: undefined
    }
  },
  beforeCreate () {
    this.moment = moment
  },
  created () {
    this.activeType = parseInt(this.$route.query.type)
  },
  methods: {

    // 自定义验证：最低参团人数
    validatorMockMinPeople (rule, value, callback) {
      const { form, activeType } = this
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

    // 添加阶梯人数
    handleAddStepsItem () {
      this.stepsConfig.push({ value: undefined })
    },

    // 删除阶梯人数
    handleDeleteStepsItem (index) {
      this.stepsConfig.splice(index, 1)
    },

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
      Api.add({ form: { ...values, active_type: this.activeType } })
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
