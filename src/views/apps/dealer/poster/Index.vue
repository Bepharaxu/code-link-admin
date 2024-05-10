<template>
  <a-card :bordered="false">
    <div class="card-title">分销海报设置</div>
    <a-spin :spinning="isLoading">
      <a-alert class="mb-15" :showIcon="true" message="分销商海报设置说明" banner>
        <template slot="description">
          <p>1. 可拖动头像、二维码、昵称调整位置</p>
          <p>2. 修改后如需生效请前往 设置-清理缓存，清除临时图片</p>
        </template>
      </a-alert>
      <div v-if="!isLoading" class="container clearfix" style="margin-top: 25px">
        <div class="poster-preview" ref="preview">
          <div class="backdrop">
            <img ref="posterImage" :src="record.backdrop.src" @load="loadImage" alt />
          </div>
          <div
            ref="qrcode"
            class="drag pre-qrcode"
            :class="record.qrcode.style"
            :style="{ width: record.qrcode.width + 'px', height: record.qrcode.width + 'px', top: record.qrcode.top + 'px', left: record.qrcode.left + 'px' }"
          >
            <img :src="record.qrcode.src" alt />
          </div>
          <div
            ref="avatar"
            class="drag pre-avatar"
            :class="record.avatar.style"
            :style="{ width: record.avatar.width + 'px', height: record.avatar.width + 'px', top: record.avatar.top + 'px', left: record.avatar.left + 'px' }"
          >
            <img :src="record.avatar.src" alt />
          </div>
          <div
            ref="nickName"
            class="drag pre-nickName"
            :style="{ fontSize: record.nickName.fontSize + 'px', color: record.nickName.color, top: record.nickName.top + 'px', left: record.nickName.left + 'px' }"
          >
            <span>这里是昵称</span>
          </div>
        </div>
        <a-form-model ref="myForm" class="my-form" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-form-model-item label="背景图片" required>
            <SelectImage2 v-model="record.backdrop.src" tips="图片尺寸：宽750 高度1200" />
            <div class="form-item-help mt-5">
              <p class="extra">图片尺寸：宽750像素 高度1200</p>
              <p class="extra">请按照要求尺寸上传，否则生成时会错误</p>
            </div>
          </a-form-model-item>
          <a-form-model-item label="头像宽度">
            <a-input-number v-model="record.avatar.width" :min="30" :max="150" autocomplete="off" />
          </a-form-model-item>
          <a-form-model-item label="头像样式">
            <a-radio-group v-model="record.avatar.style">
              <a-radio value="circle">圆形</a-radio>
              <a-radio value="square">方形</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item class="mt-30" label="昵称字体大小">
            <a-input-number
              v-model="record.nickName.fontSize"
              :min="12"
              :max="38"
              autocomplete="off"
            />
          </a-form-model-item>
          <a-form-model-item label="昵称字体颜色">
            <colorPicker class="m-colorPicker" v-model="record.nickName.color" defaultColor="#fff" />
          </a-form-model-item>
          <a-form-model-item class="mt-30" label="二维码宽度">
            <a-input-number v-model="record.qrcode.width" :min="60" :max="300" autocomplete="off" />
          </a-form-model-item>
          <!-- <a-form-model-item label="二维码样式">
            <a-radio-group v-model="record.qrcode.style">
              <a-radio value="circle">圆形</a-radio>
              <a-radio value="square">方形</a-radio>
            </a-radio-group>
          </a-form-model-item>-->
          <a-form-model-item :wrapperCol="{ offset: 3 }">
            <a-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </a-spin>
  </a-card>
</template>

<script>
import Vue from 'vue'
import pick from 'lodash.pick'
import vcolorpicker from 'vcolorpicker'
import * as Api from '@/api/dealer/setting'
import { SelectImage2 } from '@/components'

Vue.use(vcolorpicker)

export default {
  components: {
    SelectImage2
  },
  data () {
    return {
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 12 },
      // loading状态
      isLoading: false,
      confirmLoading: false,
      // 海报图默认数据(后台api会覆盖此处数值)
      record: {
        backdrop: { src: '' },
        nickName: { 'fontSize': '14', 'color': '#000000', 'left': '199', 'top': '524' },
        avatar: { 'width': '60', 'style': 'circle', 'left': '127', 'top': '502', src: '' },
        qrcode: { 'width': '100', 'style': 'circle', 'left': '17', 'top': '480', src: '' }
      }
    }
  },
  // 初始化数据
  created () {
    // 获取当前详情记录
    this.getDetail()
  },
  methods: {

    // 注册拖拽事件
    initDragEvent () {
      this.$nextTick(() => {
        this.dragEvent('qrcode')
        this.dragEvent('avatar')
        this.dragEvent('nickName')
      })
    },

    // 图片加载完成事件
    // 需要在这里注册拖拽事件, 因为会出现未加载完成图片时 获取preview高度不正确, 导致鼠标拖动位置不正确
    loadImage () {
      // 注册拖拽事件
      this.initDragEvent()
    },

    /**
      * 注册拖拽事件
      * @param ele
      */
    dragEvent (ele) {
      const app = this
         const $preview = app.$refs.preview
         const $ele = app.$refs[ele]
         const l = 0
         const t = 0
         const r = $preview.offsetWidth - $ele.offsetWidth
         const b = $preview.offsetHeight - $ele.offsetHeight

      $ele.onmousedown = ev => {
        const sentX = ev.clientX - $ele.offsetLeft
        const sentY = ev.clientY - $ele.offsetTop
        document.onmousemove = ev => {
          let slideLeft = ev.clientX - sentX
          let slideTop = ev.clientY - sentY
          slideLeft <= l && (slideLeft = l)
          slideLeft >= r && (slideLeft = r)
          slideTop <= t && (slideTop = t)
          slideTop >= b && (slideTop = b)

          app.record[ele].left = slideLeft
          app.record[ele].top = slideTop
        }
        document.onmouseup = () => {
          document.onmousemove = null
          document.onmouseup = null
        }
        return false
      }
    },

    // 获取当前详情记录
    getDetail () {
      this.isLoading = true
      Api.detail('poster')
        .then(result => {
          // 当前记录
          this.record = result.data.detail
          // // 注册拖拽事件
          // setTimeout(() => {
          //   this.initDragEvent()
          // }, 100)
        })
        .finally(() => this.isLoading = false)
    },

    // 表单提交
    handleSubmit (e) {
      e.preventDefault()
      this.confirmLoading = true
      Api.update({ form: { poster: this.record } })
        .then(result => {
          // 显示成功
          this.$message.success(result.message, 1.5)
        })
        .finally(() => this.confirmLoading = false)
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

.poster-preview,
.my-form {
  float: left;
}

.my-form {
  margin-left: 80px;
  min-width: 800px;
  margin-top: 20px;
}

.poster-preview {
  width: 377px;
  height: auto;
  min-height: 500px;
  margin: 0 auto;
  border: 1px solid #ccc;
  position: relative;
  img {
    display: block;
    width: 100%;
    height: auto;
  }
  .backdrop img {
    user-select: none;
    -webkit-user-select: none;
  }
  .drag {
    position: absolute;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    top: 0;
    &.pre-avatar {
      width: 70px;
      height: 70px;
      &.circle img {
        border-radius: 100%;
      }
    }
    &.pre-nickName {
      font-size: 13x;
      line-height: 1;
      span {
        display: block;
      }
    }
    &.pre-qrcode {
      width: 100px;
      height: 100px;
      &.circle img {
        border-radius: 100%;
      }
    }
  }
}

.pannel__right {
  min-width: 500px;
  max-width: 800px;
}

// 颜色选择组件
.m-colorPicker {
  display: block;
  background-color: #ffffff;
  border: 1px solid #d9d9d9;
  padding: 6px 5px;
  width: 66px;

  /deep/.colorBtn {
    cursor: pointer;
    width: 53px;
    height: 20px;
    border: 1px solid #000;
  }

  /deep/.box {
    left: -152px;
    top: 35px;
  }
}
</style>
