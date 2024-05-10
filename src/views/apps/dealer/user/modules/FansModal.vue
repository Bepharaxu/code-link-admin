<template>
  <a-modal
    class="noborder"
    :title="title"
    :width="820"
    :visible="visible"
    :isLoading="isLoading"
    :maskClosable="false"
    @ok="handleCancel"
    @cancel="handleCancel"
  >
    <!-- 搜索板块 -->
    <div class="table-operator">
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="昵称/手机号">
            <a-input v-decorator="['search']" placeholder="请输入昵称/手机号" />
          </a-form-item>
          <a-form-item label="推荐关系">
            <a-select allowClear v-decorator="['level', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option :value="1">1级</a-select-option>
              <a-select-option :value="2">2级</a-select-option>
              <a-select-option :value="3">3级</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="search-btn">
            <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="id"
      :scroll="{ y: '420px', scrollToFirstRowOnChange: true }"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!-- 会员信息 -->
      <template slot="user" slot-scope="text">
        <UserItem :user="text" />
      </template>
      <!-- 手机号 -->
      <template slot="mobile" slot-scope="item">
        <span>{{ item.user.mobile ? item.user.mobile : '--' }}</span>
      </template>
      <!-- 实际消费金额 -->
      <template slot="money" slot-scope="item">
        <span class="c-p">{{ item.user.expend_money }}</span>
      </template>
      <!-- 实际消费金额 -->
      <template slot="time" slot-scope="item">
        <span>{{ item.user.create_time }}</span>
      </template>
    </s-table>
  </a-modal>
</template>

<script>
import * as Api from '@/api/dealer/user'
import { STable, UserItem } from '@/components/Table'

// table表头
const columns = [
  {
    title: '会员ID',
    dataIndex: 'user_id'
  },
  {
    title: '会员信息',
    dataIndex: 'user',
    scopedSlots: { customRender: 'user' }
  },
  {
    title: '手机号',
    scopedSlots: { customRender: 'mobile' }
  },
  {
    title: '实际消费金额',
    scopedSlots: { customRender: 'money' }
  },
  {
    title: '注册时间',
    scopedSlots: { customRender: 'time' }
  }
]

export default {
  components: {
    STable,
    UserItem
  },
  data () {
    return {
      // 对话框标题
      title: '查看下级粉丝',
      // modal(对话框)是否可见
      visible: false,
      // loading状态
      isLoading: false,
      // 对话框是否创建 (首次显示时赋值)
      isCreated: false,
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // table表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.fans(this.dealerId, { ...param, ...this.queryParam })
          .then(response => {
            return response.data.list
          })
      }
    }
  },
  methods: {

    // 显示对话框
    show (dealerId, level) {
      // 显示窗口
      this.visible = true
      // 记录分销商ID
      this.dealerId = dealerId
      // 记录默认查询参数
      this.setDefaultValue(level)
      // 刷新列表数据
      this.$nextTick(() => {
        this.isCreated && this.handleRefresh(true)
        this.isCreated = true
      })
    },

    // 设置默认查询参数
    setDefaultValue (level = -1) {
      const { queryParam, searchForm: { setFieldsValue } } = this
      queryParam.level = level
      this.$nextTick(() => {
        setFieldsValue({ level })
      })
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(true)
    },

    // 确认搜索
    handleSearch (e) {
      e.preventDefault()
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
