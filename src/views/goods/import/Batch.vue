<template>
  <a-card :bordered="false">
    <div class="card-title">
      <span>{{ $route.meta.pageTitle }}</span>
    </div>
    <a-spin :spinning="isLoading">
      <div class="container">
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
              <a-icon type="cloud-upload" />
            </p>
            <div v-if="!fileList.length">
              <p class="ant-upload-text">点击选择文件，或者将文件拖拽至此区域</p>
              <p class="ant-upload-hint">仅支持 .xls, .xlsx 格式的excel文件，限2M以内</p>
            </div>
            <div v-else>
              <p class="ant-upload-text">
                <span>{{ fileList[0].name }}</span>
                <a
                  class="ml-10"
                  href="javascript:void(0);"
                  @click.stop="handleRemove(fileList[0])"
                >删除</a>
              </p>
              <a-button class="mt-20" type="primary" @click.stop="onFormSubmit">立即导入</a-button>
            </div>
          </a-upload-dragger>
        </div>
        <div class="import-explain">
          <h2 class="title">导入说明</h2>
          <a-timeline class="timeline">
            <a-timeline-item class="timeline-item">
              <p class="name">下载模板</p>
              <ul class="content">
                <li class="content-li">
                  <span>批量导入商品需要系统开启队列服务，可在超管后台中查看是否开启</span>
                </li>
                <li class="content-li">
                  <span class="mr-5">商品导入前需要您用Excel整理需要导入的商品资料，请先</span>
                  <a href="static/template/batch-goods.xlsx" target="_blank">下载商品导入模板</a>
                </li>
              </ul>
            </a-timeline-item>
            <a-timeline-item class="timeline-item">
              <p class="name">使用模板</p>
              <ul class="content">
                <li class="content-li">
                  <span>模板中最多不能超过500个商品，如超过500个商品，请分批导入</span>
                </li>
                <li class="content-li">
                  <span>模板中的字段含义以及填写规则，可查看模板文件中标题栏的标注</span>
                </li>
              </ul>
            </a-timeline-item>
            <a-timeline-item class="timeline-item">
              <p class="name">上传图片</p>
              <ul class="content">
                <li class="content-li">
                  <span>需提前在后台上传商品图片，然后填写到模板文件的 "商品图片" 列中</span>
                </li>
                <li class="content-li">
                  <span class="mr-5">通过文件库上传图片，并复制图片ID集</span>
                  <a href="javascript:void(0);" @click="handleSelectImage()">点击上传图片</a>
                </li>
              </ul>
            </a-timeline-item>
          </a-timeline>
        </div>
        <!-- 文件选择器 -->
        <FilesModal
          ref="FilesModal"
          :multiple="true"
          :maxNum="10"
          :actions="['delete', 'move', 'copyIds']"
        />
      </div>
    </a-spin>
  </a-card>
</template>

<script>
import * as Api from '@/api/goods/import'
import { FilesModal } from '@/components/Modal'

export default {
  components: {
    FilesModal
  },
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

    // 打开文件选择器
    handleSelectImage () {
      this.$refs.FilesModal.show()
    },

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
          this.$message.success(result.message, 1.8)
          setTimeout(() => this.$router.push('/goods/import/list'), 1500)
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

/deep/span.ant-radio + * {
  color: #7a7a7a;
}

.card-title {
  display: flex;
  justify-content: space-between;
}

.container {
  width: 1000px;
  margin: 0 auto;
}

.timeline {
  color: #111;
}

.import-explain {
  margin-top: 40px;

  .title {
    margin-bottom: 25px;
    font-weight: bold;
    font-size: 15px;
  }

  .name {
    font-size: 14px;
    margin-bottom: 8px;
  }

  .timeline-item {
    padding-bottom: 20px;
  }

  .content {
    color: #7a7a7a;
    padding-left: 20px;
    .content-li {
      list-style-type: disc;
      margin-bottom: 5px;
    }
  }
}
</style>
