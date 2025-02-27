<template>
  <div class="container">
    <a-spin :spinning="isLoading">
      <!-- 工作区 -->
      <div class="work-content">
        <!-- 组件库 -->
        <Components @handleClickItem="onAddItem" />
        <!--手机容器-->
        <Phone
          v-if="!isLoading"
          :data="data"
          :selectedIndex="selectedIndex"
          @onEditer="onEditer"
          @onDeleleItem="onDeleleItem"
        />
        <!-- 编辑器 -->
        <Editor
          v-if="!isLoading"
          :defaultData="defaultData"
          :data="data"
          :selectedIndex="selectedIndex"
          :curItem="curItem"
        />
      </div>
      <!-- 操作栏 -->
      <div class="footer">
        <div class="footer-content">
          <a-button type="primary" :loading="isLoading" @click="onFormSubmit">保存</a-button>
          <!-- <a-button>另存为</a-button> -->
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import _ from 'lodash'
import draggable from 'vuedraggable'
import { inArray } from '@/utils/util'
import * as Api from '@/api/page'
import { SelectImage } from '@/components'
import { Components, Phone, Editor } from './modules'

export default {
  components: {
    SelectImage,
    draggable,
    Components,
    Phone,
    Editor
  },
  data () {
    return {
      // loading状态
      isLoading: false,
      // 页面装修默认数据
      defaultData: {},
      // 当前页面数据
      data: { page: {}, items: [] },
      // 当前选中的元素索引
      selectedIndex: 'page',
      // 当前选中的元素
      curItem: {},
      // 当前页面ID
      pageId: null
    }
  },
  // 初始化数据
  created () {
    // 记录页面ID
    this.pageId = this.$route.query.pageId
    // 获取初始化数据
    this.initData()
  },
  methods: {

    // 获取初始化数据
    initData () {
      this.isLoading = true
      Promise.all([
        // 获取默认数据
        this.getDefaultData(),
        // 获取当前页面数据
        this.getPageData()
      ]).then(() => {
        this.isLoading = false
      })
    },

    // 获取默认数据
    getDefaultData () {
      return new Promise((resolve, reject) => {
        Api.defaultData()
          .then(result => {
            this.defaultData = result.data
            resolve()
          })
      })
    },

    // 获取当前页面数据
    getPageData () {
      const { pageId } = this
      return new Promise((resolve, reject) => {
        Api.detail({ pageId })
          .then(result => {
            this.data = result.data.detail.page_data
            resolve()
          })
      })
    },

    /**
     * 新增Diy组件
     * @param type
     */
    onAddItem (type) {
      // 验证新增Diy组件
      if (!this.onCheckAddItem(type)) {
        return false
      }
      const { defaultData, data } = this
      // 复制默认diy组件数据
      const newItem = _.cloneDeep(defaultData.items[type])
      // 新增到diy列表数据
      data.items.push(newItem)
      // 编辑当前选中的元素
      this.onEditer(data.items.length - 1)
    },

    /**
     * 验证新增Diy组件
     * @param type
     */
    onCheckAddItem (type) {
      const { data } = this
      // 验证关注公众号组件只能存在一个
      if (type === 'officialAccount') {
        const itemsTypes = data.items.map(item => item.type)
        if (inArray(type, itemsTypes)) {
          this.$message.warning('该组件最多存在一个')
          return false
        }
      }
      return true
    },

    /**
     * 编辑当前选中的Diy元素
     * @param index
     */
    onEditer (index) {
      const { data } = this
      // 记录当前选中元素的索引
      this.selectedIndex = index
      // 当前选中的元素数据
      this.curItem = index === 'page' ? data.page
        : data.items[index]
    },

    /**
     * 删除diy元素
     * @param index
     */
    onDeleleItem (index) {
      const { data: { items } } = this
      items.splice(index, 1)
      this.selectedIndex = -1
    },

    /**
     * 编辑器：重置颜色
     * @param holder
     * @param attribute
     * @param color
     */
    onEditorResetColor (holder, attribute, color) {
      holder[attribute] = color
    },

    // 提交到后端api
    onFormSubmit () {
      this.isLoading = true
      const { pageId, data, $message } = this
      Api.edit({ pageId, form: data })
        .then(result => {
          // 显示成功
          $message.success(result.message, 1.5)
        })
        .finally(() => this.isLoading = false)
    }

  }
}
</script>
<style lang="less" scoped>
@import './style.less';
</style>
