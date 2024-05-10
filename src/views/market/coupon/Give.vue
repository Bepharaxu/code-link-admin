<template>
  <a-card :bordered="false">
    <div class="card-title">优惠券 - 手动发放</div>
    <a-alert class="mb-30" message="注：选择指定的优惠券（仅一张）发放给指定的用户；发放成功后无法撤销，请谨慎操作" banner />
    <a-spin :spinning="isLoading">
      <a-form-model
        ref="myForm"
        class="my-form"
        :model="form"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item
          label="选择指定优惠券"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="couponId"
          :rules="{ required: true, message: '请选择优惠券' }"
        >
          <SelectCoupon :multiple="false" v-model="form.couponId" />
          <div class="form-item-help">
            <small>请先确保优惠券剩余数量充足，否则将会导致发送失败</small>
          </div>
        </a-form-model-item>
        <a-form-model-item
          label="发送类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="type"
          :rules="{ required: true, message: '请选择发送类型' }"
        >
          <a-radio-group v-model="form.type">
            <a-radio :value="10">指定的会员</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="选择会员"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          prop="target.userIds"
          :rules="{ required: true, message: '请选择会员' }"
        >
          <SelectUser :multiple="true" v-model="form.target.userIds" />
        </a-form-model-item>
        <a-form-model-item :wrapperCol="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-card>
</template>

<script>
import { cloneDeep } from 'lodash'
import { SelectCoupon, SelectUser } from '@/components'
import * as CouponApi from '@/api/market/coupon'

// 默认数据
const defaultData = {
  couponId: null,
  type: 10,
  target: {
    userIds: []
  }
}

export default {
  components: {
    SelectCoupon,
    SelectUser
  },
  data () {
    return {
      // 标签布局属性
      labelCol: { span: 4 },
      // 输入框布局属性
      wrapperCol: { span: 12 },
      // 加载状态
      isLoading: false,
      confirmLoading: false,
      // 当前记录详情
      form: cloneDeep(defaultData)
    }
  },
  // 初始化数据
  created () {

  },
  methods: {

    // 确认按钮
    handleSubmit (e) {
      const app = this
      app.$refs.myForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          CouponApi.give({ form: app.form })
            .then(result => {
              app.$message.success(result.message, 1.5)
              app.form = cloneDeep(defaultData)
              // 跳转到列表页
              setTimeout(() => this.$router.push('./receive/index'), 1200)
            })
            .finally(result => app.confirmLoading = false)
        }
      })
    }

  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  .ant-form-item {
    margin-bottom: 0;
  }
}

/deep/.ant-form-item-control {
  padding-left: 10px;
  .ant-form-item-control {
    padding-left: 0;
  }
}
</style>
