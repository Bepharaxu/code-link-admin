<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <div class="upload-dragger">
        <a-upload-dragger
          accept=".xls, .xlsx"
          :multiple="false"
          :fileList="fileList"
          :showUploadList="false"
          :beforeUpload="beforeUpload"
          :remove="handleRemove"
        >
          <p class="ant-upload-drag-icon">
            <a-icon type="inbox" />
          </p>

          <div v-if="!fileList.length">
            <p class="ant-upload-text">点击选择文件，或者将文件拖拽至此区域</p>
            <p class="ant-upload-hint">仅支持 .xls, .xlsx 格式，限2M以内</p>
          </div>
          <div v-else>
            <p class="ant-upload-text">
              <span>{{ fileList[0].name }}</span>
              <a class="ml-10" href="javascript:void(0);" @click.stop="handleRemove(fileList[0])">删除</a>
            </p>
            <a-button class="mt-20" type="primary" @click.stop="onFormSubmit">立即导入</a-button>
          </div>
        </a-upload-dragger>
      </div>
      <div class="upload-rules">
        <p class="title">导入规则</p>
        <p class="text">
          1. 上传前请先按照导入模版格式填写信息；
          <a href="static/template/batch-delivery.xlsx" target="_blank">下载模版文件</a>
        </p>
        <p class="text">2. 导入的订单以订单号做唯一判断，重复数据将无法导入；</p>
        <p class="text">3. 单次最多导入200条，超出的部分会被自动删除；</p>
      </div>
    </a-spin>
  </a-card>
</template>

<script>
import * as Api from '@/api/order/delivery'

export default {
  data () {
    return {
      // 正在加载
      isLoading: false,
      // 文件列表
      fileList: [],
      // 上传文件大小限制 2m
      uploadSizeLimit: '2'
    }
  },
  // 初始化数据
  created () {

  },
  methods: {

    // 上传文件之前的钩子
    beforeUpload (file) {
      // 验证文件大小
      const fileSizeMb = file.size / 1024 / 1024
      if (fileSizeMb > this.uploadSizeLimit) {
        this.$message.error(`上传的文件大小不能超出${this.uploadSizeLimit}MB`)
        return false
      }
      this.fileList = [file]
      return false
    },

    // 文件移除
    handleRemove (file) {
      const { fileList } = this
      const index = fileList.indexOf(file)
      if (index > -1) {
        fileList.splice(index, 1)
      }
    },

    // 提交到后端api
    onFormSubmit () {
      const { fileList } = this
      const formData = new FormData()
      formData.append('file', fileList[0])

      this.isLoading = true
      Api.batch(formData)
        .then(result => {
          this.fileList = []
          this.$message.success(result.message, 1.5)
          setTimeout(() => this.$router.back(), 1200)
        })
        .finally(() => this.isLoading = false)
    }

  }
}
</script>
<style lang="less" scoped>
/deep/.ant-upload.ant-upload-drag .ant-upload {
  padding: 82px 0;
}
.upload-rules {
  margin-top: 32px;
  .title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }
  .text {
    font-size: 13.5px;
    line-height: 23px;
    color: #333;
  }
}
</style>
