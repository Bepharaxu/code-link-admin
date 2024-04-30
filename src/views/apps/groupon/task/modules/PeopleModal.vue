<template>
  <a-modal
    class="noborder"
    :title="title"
    :width="920"
    :visible="visible"
    :isLoading="isLoading"
    :maskClosable="false"
    :cancelText="false"
    @ok="handleCancel"
    @cancel="handleCancel"
  >
    <s-table
      v-if="taskId"
      ref="table"
      :scroll="{ y: '420px', scrollToFirstRowOnChange: true }"
      :rowKey="fieldName"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!-- 用户信息 -->
      <span slot="user" slot-scope="item">
        <UserItem v-if="!item.is_robot" :user="item.user" />
        <UserItem v-if="item.is_robot" :user="item.robot" />
      </span>
      <!-- 成员身份 -->
      <span slot="identity" slot-scope="item">
        <a-tag
          v-if="!item.is_robot"
          :color="item.is_leader ? 'green' : ''"
        >{{ item.is_leader ? '团长' : '成员' }}</a-tag>
        <a-tag v-else color>机器人</a-tag>
      </span>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope=" item">
        <router-link
          v-if="!item.is_robot"
          v-action:order
          target="_blank"
          :to="{ path: '/order/detail', query: { orderId: item.order_id } }"
        >查看订单</router-link>
      </span>
    </s-table>
  </a-modal>
</template>

<script>
import * as Api from '@/api/groupon/task'
import { STable, UserItem } from '@/components/Table'

// table表头
const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '用户信息',
    scopedSlots: { customRender: 'user' }
  },
  {
    title: '成员身份',
    scopedSlots: { customRender: 'identity' }
  },
  {
    title: '参团时间',
    dataIndex: 'create_time'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'PeopleModal',
  components: {
    STable,
    UserItem
  },
  data () {
    return {
      // 对话框标题
      title: '拼单成员列表',
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
        return Api.users(this.taskId, { ...param, ...this.queryParam })
          .then(response => response.data.list)
      },
      // 主键ID字段名
      fieldName: 'id',
      // 拼单ID
      taskId: undefined
    }
  },
  methods: {

    // 显示对话框
    handle (taskId) {
      this.visible = true
      this.taskId = taskId
      this.$nextTick(() => {
        // 刷新列表数据
        this.handleRefresh(true)
      })
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(true)
    },

    // 关闭对话框事件
    handleCancel () {
      this.visible = false
    },

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
