<template>
  <a-modal
    class="noborder"
    :title="title"
    :width="920"
    :visible="visible"
    :isLoading="isLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <!-- 搜索板块 -->
    <div class="table-operator">
      <a-row>
        <a-col class="flex flex-x-end">
          <a-input-search
            style="max-width: 300px; min-width: 150px;"
            v-model="queryParam.goodsName"
            placeholder="请输入商品名称"
            @search="handleSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      :scroll="{ y: '420px', scrollToFirstRowOnChange: true }"
      :rowKey="fieldName"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :rowSelection="rowSelection"
      :pageSize="15"
    >
      <!-- 商品信息 -->
      <template slot="item" slot-scope="item">
        <GoodsItem
          :data="{
            image: item.goods.goods_image,
            imageAlt: '商品图片',
            title: item.goods.goods_name,
            subtitle: `¥${item.goods.goods_price_min}`
          }"
          :subTitleColor="true"
        />
      </template>
      <!-- 发起/截止时间 -->
      <template slot="time" slot-scope="item">
        <p>{{ item.start_time }}</p>
        <p>{{ item.end_time }}</p>
      </template>
      <!-- 砍价底价 -->
      <template slot="floor_price" slot-scope="text">
        <p class="c-p">¥{{ text }}</p>
      </template>
      <!-- 活动状态 -->
      <template slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : 'orange'">{{ text ? '进行中' : '已结束' }}</a-tag>
      </template>
    </s-table>
  </a-modal>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import cloneDeep from 'lodash.clonedeep'
import * as GoodsApi from '@/api/bargain/active'
import { STable, GoodsItem } from '@/components/Table'

// table表头
const columns = [
  {
    title: '活动ID',
    dataIndex: 'active_id'
  },
  {
    title: '商品信息',
    width: '302px',
    scopedSlots: { customRender: 'item' }
  },
  {
    title: '活动时间',
    width: '170px',
    scopedSlots: { customRender: 'time' }
  },
  {
    title: '砍价底价',
    dataIndex: 'floor_price',
    scopedSlots: { customRender: 'floor_price' }
  },
  {
    title: '帮砍人数',
    dataIndex: 'peoples'
  },
  {
    title: '活动状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  }
]

export default {
  name: 'BargainGoodsModal',
  props: {
    // 多选模式, 如果false为单选
    multiple: PropTypes.bool.def(true),
    // 最大选择的数量限制, multiple模式下有效
    maxNum: PropTypes.integer.def(100),
    // 默认选中的列表记录
    defaultList: PropTypes.array.def([])
  },
  components: {
    STable,
    GoodsItem
  },
  data () {
    return {
      // 对话框标题
      title: '砍价商品库',
      // modal(对话框)是否可见
      visible: false,
      // loading状态
      isLoading: false,
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // table表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return GoodsApi.list({ ...param, ...this.queryParam })
          .then(response => {
            return response.data.list
          })
      },
      // 主键ID字段名
      fieldName: 'active_id',
      // 已选择的元素
      selectedRowKeys: [],
      // 已选择的列表记录
      selectedItems: []
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        type: !this.multiple ? 'radio' : 'checkbox'
      }
    }
  },
  created () {

  },
  methods: {

    // 显示对话框
    handle () {
      // 显示窗口
      this.visible = true
      this.$nextTick(() => {
        // 刷新列表数据
        // this.handleRefresh(true)
        // 设置默认数据
        this.setDefaultValue()
      })
    },

    // 设置默认数据
    setDefaultValue () {
      const { fieldName, defaultList } = this
      if (defaultList.length) {
        this.selectedItems = cloneDeep(defaultList)
        this.selectedRowKeys = defaultList.map(item => item[fieldName])
      }
    },

    // 选中项发生变化时的回调
    onSelectChange (selectedRowKeys, newSelectedItems) {
      const { selectedItems } = this
      this.selectedRowKeys = selectedRowKeys
      this.selectedItems = this.createSelectedItems(selectedRowKeys, selectedItems, newSelectedItems)
    },

    /**
     * 生成已选中的元素列表
     * @param array selectedRowKeys 当前已选中的ID集
     * @param array oldSelectedItems 已选择的列表记录 (change前)
     * @param array newSelectedItems 已选择的列表记录 (change后)
     */
    createSelectedItems (selectedRowKeys, oldSelectedItems, newSelectedItems) {
      const { fieldName } = this
      const selectedItems = []
      oldSelectedItems.forEach(item => {
        if (selectedRowKeys.includes(item[fieldName])) {
          selectedItems.push(item)
        }
      })
      const oldSelectedKeys = oldSelectedItems.map(item => item[fieldName])
      newSelectedItems.forEach(item => {
        if (!oldSelectedKeys.includes(item[fieldName]) && selectedRowKeys.includes(item[fieldName])) {
          selectedItems.push(item)
        }
      })
      return selectedItems
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(true)
    },

    // 确认搜索
    handleSearch () {
      this.searchForm.validateFields((error, values) => {
        if (!error) {
          this.queryParam = { ...this.queryParam, ...values }
          this.handleRefresh(true)
        }
      })
    },

    // 关闭对话框事件
    handleCancel () {
      this.visible = false
      this.queryParam = {}
      this.searchForm.resetFields()
      this.selectedRowKeys = []
      this.selectedItems = []
    },

    // 确认按钮
    handleSubmit (e) {
      e.preventDefault()
      // 通知父端组件提交完成了
      this.$emit('handleSubmit', {
        selectedItems: this.selectedItems,
        selectedRowKeys: this.selectedRowKeys
      })
      // 关闭对话框
      this.handleCancel()
    }

  }
}
</script>

<style lang="less" scoped>
.ant-modal-root {
  background: #ccc;
  /deep/.ant-modal-body {
    padding-bottom: 8px;
  }
  /deep/.ant-modal-footer {
    padding-top: 0;
  }
}
// 搜索表单
.search-form {
  /deep/.ant-form-item-control-wrapper {
    min-width: 180px;
  }
}
</style>
