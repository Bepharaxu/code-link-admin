<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="活动日期" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <span>{{ detail ? detail.active.active_date : '--' }}</span>
        </a-form-item>
        <a-form-item label="活动场次" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span>{{ detail ? detail.active_time : '--' }}</span>
        </a-form-item>
        <a-form-item label="秒杀商品" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <SelectSharpGoods
            :multiple="true"
            :defaultList="goodsList"
            v-decorator="['sharpGoodsIds', { rules: [{ required: true, message: '请选择指定的秒杀商品' }] }]"
          />
        </a-form-item>
        <a-form-item label="活动状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['status', { initialValue: 1, rules: [{ required: true }] }]">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
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
import * as ActiveApi from '@/api/sharp/active'
import * as TimeApi from '@/api/sharp/active/time'
import { SelectSharpGoods } from '@/components'
import { inArray, isEmpty } from '@/utils/util'

// 默认的活动场次
const getTimesOptions = () => {
  const data = []
  for (let i = 0; i <= 23; i++) {
    data.push({
      label: ('0' + i).slice(-2) + ':00',
      value: i
    })
  }
  return data
}

export default {
  components: {
    SelectSharpGoods
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
      // 默认场次范围
      timesOptions: getTimesOptions(),
      // 活动会场ID
      activeTimeId: this.$route.query.activeTimeId,
      // 活动场次详情
      detail: null,
      // 当前场次关联的商品
      goodsList: []
    }
  },
  created () {
    // 加载页面数据
    this.getPageData()
  },
  methods: {

    // 加载页面数据
    getPageData () {
      const app = this
      app.isLoading = true
      Promise.all([app.getTimeDetail()])
        .finally(() => app.isLoading = false)
    },

    // 活动场次详情
    getTimeDetail () {
      const app = this
      return new Promise((resolve, reject) => {
        TimeApi.detail(app.activeTimeId)
          .then(result => {
            app.detail = result.data.detail
            app.goodsList = result.data.goodsList
            // 设置表单默认值
            this.setFieldsValue()
            resolve()
          })
          .catch(reject)
      })
    },

    // 设置表单默认值
    setFieldsValue () {
      const { detail, form, $nextTick } = this
      // 设置表单内容
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        form.setFieldsValue(pick(detail, ['status']))
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
      const app = this
      app.isLoading = true
      app.isBtnLoading = true
      TimeApi.edit(app.activeTimeId, { form: values })
        .then(result => {
          // 显示提示信息
          app.$message.success(result.message, 1.5)
          // 跳转到列表页
          setTimeout(() => {
            this.$router.push({ path: './index', query: { activeId: app.detail.active_id } })
          }, 1200)
        })
        .catch(() => app.isBtnLoading = false)
        .finally(result => app.isLoading = false)
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

.times-checkbox {
  width: 570px;
  margin-bottom: -12px;
  /deep/.ant-checkbox-wrapper {
    margin-right: 15px;
    margin-bottom: 11px;
  }
}
</style>
