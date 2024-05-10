<template>
  <div class="container">
    <s-table
      ref="table"
      rowKey="id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="10"
    >
      <!-- 开始时间 -->
      <template slot="start_time" slot-scope="text">
        <span>{{ text ? text : '--' }}</span>
      </template>
      <!-- 结束时间 -->
      <template slot="end_time" slot-scope="text">
        <span>{{ text ? text : '--' }}</span>
      </template>
      <!-- 采集状态 -->
      <span slot="status" slot-scope="text">
        <a-tag :color="CollectorStatusColorEnum[text]">{{ CollectorStatusEnum[text].name }}</a-tag>
      </span>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <a v-action:delete @click="handleDelete(item)">删除</a>
        <a v-if="item.fail_count > 0" v-action:failLog @click="handleFailLog(item)">失败日志</a>
      </span>
    </s-table>
    <!-- 查看失败日志 -->
    <a-modal v-model="visibleFailLog" title="失败日志" @ok="visibleFailLog = false">
      <div class="modal-content">
        <p class="log-item" v-for="(item, index) in failLogContent" :key="index">
          <span class="mr-5">链接 [{{ item.url }}]</span>
          <span>{{ item.message }}</span>
        </p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { STable } from '@/components'
import * as Api from '@/api/goods/collector'
import { CollectorStatusEnum } from '@/common/enum/goods'

// 采集状态标签颜色
const CollectorStatusColorEnum = {
  [CollectorStatusEnum.NORMAL.value]: '',
  [CollectorStatusEnum.COMPLETED.value]: 'green'
}

// 订单导出记录组件
export default {
  name: 'CollectorList',
  components: {
    STable
  },

  data () {
    return {
      // 正在加载
      isLoading: false,
      // 枚举类
      CollectorStatusEnum,
      CollectorStatusColorEnum,
      // 表头
      columns: [
        {
          title: '记录ID',
          dataIndex: 'id'
        },
        {
          title: '采集总数量',
          dataIndex: 'total_count'
        },
        {
          title: '成功数量',
          dataIndex: 'success_count'
        },
        {
          title: '失败数量',
          dataIndex: 'fail_count'
        },
        {
          title: '开始时间',
          dataIndex: 'start_time',
          scopedSlots: { customRender: 'start_time' }
        },
        {
          title: '结束时间',
          dataIndex: 'end_time',
          scopedSlots: { customRender: 'end_time' }
        },
        {
          title: '采集状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '180px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.list(param).then(response => response.data.list)
      },
      // 显示失败日志弹窗
      visibleFailLog: false,
      // 失败日志内容
      failLogContent: []
    }
  },
  created () {
  },
  methods: {

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        // content: '删除后不可恢复',
        content: item['status'] == CollectorStatusEnum.NORMAL.value ? '当前任务进行中，如果删除会导致未完成的任务终止' : '删除后不可恢复',
        onOk () {
          return Api.deleted({ id: item['id'] })
            .then(result => {
              app.$message.success(result.message, 1.5)
              app.handleRefresh()
            })
            .finally(result => modal.destroy())
        }
      })
    },

    // 查看失败日志
    handleFailLog (item) {
      this.visibleFailLog = true
      this.failLogContent = item.fail_log
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(bool)
    }

  }
}
</script>

<style lang="less" scoped>
</style>
