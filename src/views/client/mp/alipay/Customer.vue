<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form-model
        ref="myForm"
        class="my-form"
        :model="record"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item label="开启商城客服" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <a-radio-group v-model="record.enabled">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
          <p class="form-item-help">
            <small>开启后将在用户端商品详情页、个人中心页显示在线客服按钮</small>
          </p>
        </a-form-model-item>
        <div v-if="record.enabled == 1">
          <a-form-model-item label="在线客服方式" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
            <a-radio-group v-model="record.provider">
              <a-radio value="myznkf">蚂蚁智能客服</a-radio>
            </a-radio-group>
            <div v-show="record.provider === 'myznkf'" class="form-item-help">
              <p class="extra">
                <span>云客服地址：</span>
                <a
                  href="https://csmng.cloud.alipay.com/ccm.htm#/home"
                  target="_blank"
                >https://csmng.cloud.alipay.com/ccm.htm#/home</a>
              </p>
            </div>
          </a-form-model-item>
          <div v-if="record.provider === 'myznkf'">
            <a-form-model-item
              label="企业编码 tntInstId"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="config.myznkf.tntInstId"
              :rules="{ required: true, message: '请输入企业编码' }"
            >
              <a-input v-model="record.config.myznkf.tntInstId" />
              <div class="form-item-help">
                <p class="extra">
                  <span>在</span>
                  <a href="https://csmng.cloud.alipay.com/ccm.htm#/home" target="_blank">云客服</a>
                  <span>中进入 设置 -> 服务窗配置，点击操作栏中的 部署 ，获取 tntInstId（租户ID）和 scene（聊天窗ID）</span>
                </p>
              </div>
            </a-form-model-item>
            <a-form-model-item
              label="聊天窗编码 scene"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              prop="config.myznkf.scene"
              :rules="{ required: true, message: '请输入聊天窗编码' }"
            >
              <a-input v-model="record.config.myznkf.scene" />
            </a-form-model-item>
          </div>
        </div>
        <a-form-model-item :wrapperCol="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-card>
</template>

<script>
import { cloneDeep } from 'lodash'
import * as Api from '@/api/client/mp/alipay/setting'

// 默认数据
const defaultData = {
  enabled: 0,
  provider: 'myznkf',
  config: {
    myznkf: {
      tntInstId: '',
      scene: ''
    }
  }
}

export default {
  data () {
    return {
      // 当前设置项的key
      key: 'customer',
      // 标签布局属性
      labelCol: { span: 4 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // 加载状态
      isLoading: false,
      confirmLoading: false,
      // 当前记录详情
      record: cloneDeep(defaultData)
    }
  },
  // 初始化数据
  created () {
    // 获取当前详情记录
    this.getDetail()
  },
  methods: {

    // 获取当前详情记录
    getDetail () {
      this.isLoading = true
      Api.detail(this.key)
        .then(result => this.record = result.data.detail)
        .finally(() => this.isLoading = false)
    },

    // 确认按钮
    handleSubmit (e) {
      this.$refs.myForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          Api.update(this.key, { form: this.record })
            .then(result => {
              // 显示提示信息
              this.$message.success(result.message, 1.5)
            })
            .finally(result => this.confirmLoading = false)
        }
      })
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
</style>
