<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item class="mt-30" label="是否开启访问" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group v-decorator="['enabled', { rules: [{ required: true }] }]">
            <a-radio :value="true">开启</a-radio>
            <a-radio :value="false">关闭</a-radio>
          </a-radio-group>
          <div class="form-item-help">
            <small>注：如关闭，用户则无法通过微信中公众号端访问商城</small>
          </div>
        </a-form-item>
        <a-form-item class="mt-30" label="公众号名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入公众号名称' }] }]" />
        </a-form-item>
        <a-form-item label="原始ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['originalId', { rules: [{ required: true, message: '请输入公众号原始ID' }] }]"
          />
          <p class="form-item-help">
            <small>登录微信公众平台，设置与开发 - 公众号设置 - 注册信息，查看原始ID</small>
          </p>
        </a-form-item>
        <a-form-item label="二维码图片" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <SelectImage2
            v-decorator="['qrcodeImageUrl', { initialValue: '', rules: [{ required: true, message: '请上传分享图标' }] }]"
            tips="建议尺寸：宽430 高度430"
          />
          <p class="form-item-help">
            <small>登录微信公众平台，设置与开发 - 公众号设置 - 公开信息，下载公众号二维码（15cm）</small>
          </p>
        </a-form-item>

        <a-divider orientation="left">开发者信息</a-divider>
        <a-form-item class="mt-30" label="开发者 AppID" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['appId', { rules: [{ required: true, message: '请输入开发者AppID' }] }]"
          />
          <p class="form-item-help">
            <small>登录微信公众平台，设置与开发 - 基本配置 - 公众号开发信息，记录开发者ID(AppID)</small>
          </p>
        </a-form-item>
        <a-form-item label="开发者 AppSecret" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            type="password"
            v-decorator="['appSecret', { rules: [{ required: true, message: '请输入开发者AppSecret' }] }]"
          />
          <p class="form-item-help">
            <small>登录微信公众平台，设置与开发 - 基本配置 - 公众号开发信息，设置开发者密码(AppSecret)</small>
          </p>
        </a-form-item>

        <!--
        <a-divider orientation="left">服务器配置</a-divider>
        <a-form-item class="mt-30" label="服务器地址 URL" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span>{{ serverUrl }}</span>
          <a class="ml-10" href="javascript:void(0);" @click="handleCopyText(serverUrl)">复制</a>
          <p class="form-item-help">
            <small>登录微信公众平台，设置与开发 - 基本配置 - 服务器配置，填写服务器地址URL（需确保外网可以访问）</small>
          </p>
        </a-form-item>
        <a-form-item label="令牌 Token" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['token', { rules: [{ required: true, message: '请输入Token' }] }]" />
        </a-form-item>
        <a-form-item label="消息加解密秘钥 EncodingAESKey" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['encodingAesKey', { rules: [{ required: true, message: '请输入秘钥' }] }]"
          />
        </a-form-item>
        <a-form-item label="消息加解密模式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            :style="{ paddingTop: '10px', marginBottom: '-16px' }"
            v-decorator="['encryptionType', { rules: [{ required: true }] }]"
          >
            <a-radio :style="radioStyle" :value="10">明文模式（不使用消息体加解密功能，安全系数较低）</a-radio>
            <a-radio :style="radioStyle" :value="20">兼容模式（明文、密文将共存，方便开发者调试和维护）</a-radio>
            <a-radio :style="radioStyle" :value="30">
              <span>安全模式</span>
              <span>（消息包为纯密文，需要开发者加密和解密，安全系数高）</span>
              <a-tag class="ml-5" color="green">推荐</a-tag>
            </a-radio>
          </a-radio-group>
        </a-form-item>-->

        <a-divider orientation="left">授权域名设置</a-divider>

        <a-form-item
          class="mt-30"
          label="服务器IP白名单"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          required
        >
          <span class="f-14">{{ serverIP }}</span>
          <a class="ml-15 f-12" href="javascript:void(0);" @click="handleCopyText(serverIP)">点击复制</a>
          <p class="form-item-help">
            <small>登录微信公众平台，设置与开发 - 基本配置 - IP白名单，填写服务器IP</small>
          </p>
        </a-form-item>

        <a-form-item label="业务域名" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <span class="f-14">{{ domain }}</span>
          <a class="ml-15 f-12" href="javascript:void(0);" @click="handleCopyText(domain)">点击复制</a>
          <p class="form-item-help">
            <small>登录微信公众平台，设置与开发 - 公众号设置 - 功能设置，填写业务域名</small>
          </p>
        </a-form-item>

        <a-form-item label="JS接口安全域名" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <span class="f-14">{{ domain }}</span>
          <a class="ml-15 f-12" href="javascript:void(0);" @click="handleCopyText(domain)">点击复制</a>
          <p class="form-item-help">
            <small>登录微信公众平台，设置与开发 - 公众号设置 - 功能设置，填写JS接口安全域名</small>
          </p>
        </a-form-item>

        <a-form-item label="网页授权域名" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <span class="f-14">{{ domain }}</span>
          <a class="ml-15 f-12" href="javascript:void(0);" @click="handleCopyText(domain)">点击复制</a>
          <p class="form-item-help">
            <small>登录微信公众平台，设置与开发 - 公众号设置 - 功能设置，填写网页授权域名</small>
          </p>
        </a-form-item>

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
      wrapperCol: { span: 12 },
      // loading状态
      isLoading: false,
      // 当前表单元素
      form: this.$form.createForm(this),
      // 当前记录详情
      record: {},
      // 服务端域名
      domain: '',
      // 服务端接口url (token)
      serverUrl: '',
      // 服务器IP地址
      serverIP: '',
      // 垂直的radio组
      radioStyle: {
        display: 'block',
        marginBottom: '16px'
      }
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
      Api.basic()
        .then(result => {
          // 当前记录
          this.record = result.data.setting
          this.domain = result.data.domain
          this.serverUrl = result.data.serverUrl
          this.serverIP = result.data.serverIP
          // 设置默认值
          this.setFieldsValue()
        })
        .finally(() => this.isLoading = false)
    },

    // 设置默认值
    setFieldsValue () {
      const { record, $nextTick, form } = this
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        form.setFieldsValue(pick(record, [
          'enabled', 'name', 'originalId', 'qrcodeImageUrl',
          'appId', 'appSecret'
          //  'token', 'encodingAesKey', 'encryptionType'
        ]))
      })
    },

    // 复制链接地址
    handleCopyText (value) {
      this.$copyText(value).then(res => {
        this.$message.success('复制成功', 0.8)
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
      Api.update('basic', { form: values })
        .then(result => this.$message.success(result.message, 1.5))
        .finally(() => this.isLoading = false)
    }

  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 15px;
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
