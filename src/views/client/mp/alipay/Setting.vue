<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form-model
        ref="myForm"
        class="my-form"
        :model="record"
        :label-col="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item label="是否开启访问" prop="enabled" :rules="[{ required: true }]">
          <a-radio-group v-model="record.enabled">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
          <div class="form-item-help">
            <small>注：如关闭，用户则无法通过支付宝端访问商城</small>
          </div>
        </a-form-model-item>

        <a-form-model-item
          class="mt-30"
          label="小程序 AppID"
          prop="appId"
          :rules="[{ required: true, message: '请输入小程序AppID' }]"
        >
          <a-input v-model="record.appId" autocomplete="off" />
          <div class="form-item-help">
            <small>登录支付宝小程序控制台，小程序应用，记录应用ID（16位数字）</small>
          </div>
        </a-form-model-item>

        <a-divider orientation="left">接口加签方式</a-divider>
        <a-form-model-item
          label="签名算法 (signType)"
          prop="signType"
          :rules="[{ required: true, message: '请选择签名算法 (signType)' }]"
        >
          <a-radio-group v-model="record.signType">
            <a-radio value="RSA2">RSA2</a-radio>
            <a-radio value="RSA" :disabled="true">RSA</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item
          label="加签模式"
          prop="signMode"
          :rules="[{ required: true, message: '请选择加签模式' }]"
        >
          <a-radio-group v-model="record.signMode">
            <a-radio :value="10">
              <span>公钥证书</span>
              <a-tag class="ml-5" color="green">推荐</a-tag>
            </a-radio>
            <a-radio :value="20">公钥</a-radio>
          </a-radio-group>
          <div class="form-item-help">
            <small>如需使用资金支出类的接口，则必须使用公钥证书模式</small>
          </div>
        </a-form-model-item>

        <div v-if="record.signMode === 20" :method="record.method">
          <a-form-model-item
            label="支付宝公钥 (alipayPublicKey)"
            prop="alipayPublicKey"
            :rules="[{ required: true, message: '请填写支付宝公钥 (alipayPublicKey)' }]"
          >
            <a-textarea
              v-model="record.alipayPublicKey"
              :autoSize="{ minRows: 4, maxRows: 6 }"
              autocomplete="off"
            />
            <div class="form-item-help">
              <small>可在 "支付宝开放平台" - "应用信息" - "接口加签方式" - "支付宝公钥" 中复制</small>
            </div>
          </a-form-model-item>
        </div>

        <div v-if="record.signMode === 10" :method="record.method">
          <a-form-model-item
            label="应用公钥证书"
            prop="appCertPublicKey"
            :rules="[{ required: true, message: '需要上传该文件' }]"
          >
            <InputFile
              accept=".crt"
              v-model="record.appCertPublicKey"
              @change="onChangeInputFile($event, arguments, 'appCertPublicKey')"
            />
            <div class="form-item-help">
              <small>请上传 "appCertPublicKey_xxxxxxxx.crt" 文件</small>
            </div>
          </a-form-model-item>

          <a-form-model-item
            label="支付宝公钥证书"
            prop="alipayCertPublicKey"
            :rules="[{ required: true, message: '需要上传该文件' }]"
          >
            <InputFile
              accept=".crt"
              v-model="record.alipayCertPublicKey"
              @change="onChangeInputFile($event, arguments, 'alipayCertPublicKey')"
            />
            <div class="form-item-help">
              <small>请上传 "alipayCertPublicKey_RSA2.crt" 文件</small>
            </div>
          </a-form-model-item>

          <a-form-model-item
            label="支付宝根证书"
            prop="alipayRootCert"
            :rules="[{ required: true, message: '需要上传该文件' }]"
          >
            <InputFile
              accept=".crt"
              v-model="record.alipayRootCert"
              @change="onChangeInputFile($event, arguments, 'alipayRootCert')"
            />
            <div class="form-item-help">
              <small>请上传 "alipayRootCert.crt" 文件</small>
            </div>
          </a-form-model-item>
        </div>

        <a-form-model-item
          label="应用私钥 (privateKey)"
          prop="merchantPrivateKey"
          :rules="[{ required: true, message: '请填写应用私钥 (privateKey)' }]"
        >
          <a-textarea
            v-model="record.merchantPrivateKey"
            :autoSize="{ minRows: 4, maxRows: 6 }"
            autocomplete="off"
          />
          <div class="form-item-help">
            <small>查看 "应用私钥RSA2048-敏感数据，请妥善保管.txt" 文件，将全部内容复制到此处</small>
          </div>
        </a-form-model-item>

        <a-divider orientation="left">授权域名设置</a-divider>
        <a-form-item
          v-for="(item , index) in domainList"
          :key="index"
          class="mt-30"
          :label="item.name"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          required
        >
          <span class="f-14">{{ `${item.protocol}://${domain}` }}</span>
          <a class="ml-15 f-12" href="javascript:void(0);" @click="handleCopyLink(domain)">点击复制</a>
          <p class="form-item-help">
            <small>登录支付宝小程序控制台，开发 - 开发设置 - 服务器域名白名单，添加{{ item.protocol }}域名</small>
          </p>
        </a-form-item>

        <a-form-model-item :wrapperCol="{ offset: labelCol.span }">
          <a-button type="primary" :loading="isBtnLoading" @click="handleSubmit">保存</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-card>
</template>

<script>
import { cloneDeep } from 'lodash'
import { isEmpty } from '@/utils/util'
import InputFile from '@/components/InputFile'
import * as Api from '@/api/client/mp/alipay/setting'

// 授权域名列表
const domainList = [
  {
    name: '服务器域名白名单',
    protocol: 'https'
  }
]

// 默认表单数据
const defaultData = {
  enabled: 0,
  appId: '',
  signType: 'RSA2',
  signMode: 10,
  alipayPublicKey: '',
  appCertPublicKey: '',
  alipayCertPublicKey: '',
  alipayRootCert: '',
  merchantPrivateKey: ''
}

export default {
  components: {
    InputFile
  },
  data () {
    return {
      // 正在加载
      isLoading: false,
      isBtnLoading: false,
      // 标签布局属性
      labelCol: { span: 4 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // 当前表单元素
      form: this.$form.createForm(this),
      // 当前设置项key
      key: 'basic',
      // 授权域名列表
      domainList,
      // 表单记录
      record: cloneDeep(defaultData),
      // 要上传的文件域
      uploadFiles: {
        appCertPublicKey: null,
        alipayCertPublicKey: null,
        alipayRootCert: null,
      },
      // 服务端域名
      domain: '',
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
        .then(result => {
          // 当前记录
          this.record = { ...defaultData, ...result.data.detail }
          this.domain = result.data.domain
        })
        .finally(() => this.isLoading = false)
    },

    // 设置默认值
    setFieldsValue () {
      const { record, $nextTick, form } = this
      !isEmpty(form.getFieldsValue()) && $nextTick(() => {
        form.setFieldsValue(pick(record, ['enabled', 'appId']))
      })
    },

    // 复制链接地址
    handleCopyLink (url) {
      this.$copyText(url).then(res => {
        this.$message.success('复制成功', 0.8)
      })
    },

    // 点击表单提交
    handleSubmit (e) {
      e.preventDefault()
      this.$refs.myForm.validate(valid => {
        if (valid) {
          this.onSubmitForm()
        } else {
          console.log('validate error')
          return false
        }
      });
    },

    // 上传文件后记录到 uploadFiles中
    onChangeInputFile (name, args, key) {
      const { uploadFiles } = this
      if (args[1] !== null) {
        uploadFiles[key] = args[1]
      }
    },

    // 提交到后端api
    onSubmitForm () {
      this.isLoading = true
      this.isBtnLoading = true
      const formData = this.buildFormData()
      Api.updateBasic(formData)
        .then(result => this.$message.success(result.message, 1.5))
        .finally(() => {
          this.isBtnLoading = false
          this.isLoading = false
        })
    },

    // 生成表单数据 FormData格式
    buildFormData () {
      const { key, record, uploadFiles } = this
      const formData = new FormData()
      for (const key in record) {
        formData.append(key, record[key])
      }
      for (const index in uploadFiles) {
        if (uploadFiles[index] != null) {
          formData.append(index, uploadFiles[index])
        }
      }
      return formData
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
