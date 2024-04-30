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
    <s-table
      ref="table"
      rowKey="help_id"
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
      <template slot="cut_money" slot-scope="text">
        <span class="c-p">¥{{ text }}</span>
      </template>
      <!-- 实际消费金额 -->
      <template slot="time" slot-scope="item">
        <span>{{ item.user.create_time }}</span>
      </template>
    </s-table>
  </a-modal>
</template>

<script>
import * as Api from '@/api/bargain/task'
import { STable, UserItem } from '@/components/Table'

// table表头
const columns = [
  {
    title: '记录ID',
    dataIndex: 'help_id'
  },
  {
    title: '会员信息',
    dataIndex: 'user',
    scopedSlots: { customRender: 'user' }
  },
  {
    title: '砍掉的金额',
    dataIndex: 'cut_money',
    scopedSlots: { customRender: 'cut_money' }
  },
  {
    title: '操作时间',
    dataIndex: 'create_time'
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
      title: '砍价助力榜',
      // modal(对话框)是否可见
      visible: false,
      // loading状态
      isLoading: false,
      // 查询参数
      queryParam: {},
      // table表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.help(this.taskId, { ...param, ...this.queryParam })
          .then(response => {
            return response.data.list
          })
      },
    }
  },
  methods: {

    // 显示对话框
    show (taskId, level) {
      // 显示窗口
      this.visible = true
      // 记录分销商ID
      this.taskId = taskId
      // 刷新列表数据
      this.$nextTick(() => {
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
      this.queryParam = {}
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
