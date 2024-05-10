<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-alert class="mb-15" :showIcon="true" message="微信公众号端链接分享说明" banner>
        <template slot="description">
          <p>1. 开启链接分享卡片之前请先配置完成公众号设置（开发者信息和IP白名单等），<strong>否则用户访问商城时会报错</strong></p>
          <p>2. 只有通过微信扫码、微信公众号底部菜单和对话框打开H5链接，点击右上角的 “转发给朋友” 才会是卡片形式</p>
        </template>
      </a-alert>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item class="mt-30" label="链接分享卡片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['enabled', { rules: [{ required: true }] }]">
            <a-radio :value="true">开启</a-radio>
            <a-radio :value="false">关闭</a-radio>
          </a-radio-group>
          <div class="form-item-help">
            <p class="extra">
              <small>在微信公众号端分享商品链接时，通过卡片形式展示封面图、标题和描述；</small>
              <a-popover :title="false">
                <template slot="content">
                  <img
                    class="bg-image"
                    style="width: 360px"
                    src="static/img/client/wxofficial/linkShareCard.png"
                  />
                </template>
                <a href="javascript:;">查看示例</a>
                <!-- 隐藏图片: 目的是预加载 -->
                <img class="hiden" src="static/img/client/wxofficial/linkShareCard.png" />
              </a-popover>
            </p>
          </div>
        </a-form-item>

        <div v-show="form.getFieldValue('enabled')">
          <a-form-item class="mt-30" label="分享标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['title', { rules: [{ required: true, message: '请输入分享标题' }] }]" />
            <p class="form-item-help">
              <small>分享链接给微信好友时，链接卡片的标题内容</small>
            </p>
          </a-form-item>
          <a-form-item label="分享描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['desc', { rules: [{ required: true, message: '请输入分享描述' }] }]" />
            <p class="form-item-help">
              <small>分享链接给微信好友时，链接卡片的描述内容</small>
            </p>
          </a-form-item>
          <a-form-model-item label="分享图标" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
            <SelectImage2
              v-decorator="['imgUrl', { initialValue: '', rules: [{ required: true, message: '请上传分享图标' }] }]"
              tips="建议尺寸：宽300 高度300"
            />
          </a-form-model-item>
        </div>

        <a-form-item :wrapperCol="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import { isEmpty } from '@/utils/util'
import * as Api from '@/api/client/wxofficial/setting'
import { SelectImage2 } from '@/components'

export default {
  components: {
    SelectImage2
  },
  data () {
    return {
      // 标签布局属性
      labelCol: { span: 4 },
      // 输入框布局属性
      wrapperCol: { span: 14 },
      // loading状态
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 当前记录详情
      record: {}
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
      Api.detail('share')
        .then(result => {
          // 当前记录
          this.record = result.data.detail
          // 设置默认值
          this.setFieldsValue()
        })
        .finally(() => this.isLoading = false)
    },

    // 设置默认值
    setFieldsValue () {
      const { record, $nextTick, form } = this
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        form.setFieldsValue(pick(record, ['enabled', 'title', 'desc', 'imgUrl']))
      })
    },

    // 确认按钮
    handleSubmit (e) {
      e.preventDefault()
      // 表单验证
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        // 提交到后端api
        !errors && this.onFormSubmit(values)
      })
    },

    // 提交到后端api
    onFormSubmit (values) {
      this.isLoading = true
      Api.update('share', { form: values })
        .then(result => this.$message.success(result.message, 1.5))
        .finally(() => this.isLoading = false)
    }

  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 20px;
}
/deep/.ant-form-item-control {
  padding-left: 10px;

  .ant-form-item-control {
    padding-left: 0;
  }
}
.ant-divider {
  margin-top: 60px !important;
}

.ant-input-disabled {
  background-color: #fafafa;
  color: rgba(0, 0, 0, 0.45);
}
</style>
