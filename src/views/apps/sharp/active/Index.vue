<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col :span="5">
          <a-button
            v-if="$auth('/apps/sharp/active/create')"
            type="primary"
            icon="plus"
            @click="handleAdd()"
          >新增会场</a-button>
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="active_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!-- 活动状态 -->
      <template slot="status" slot-scope="text, item">
        <a-tag
          class="cur-p"
          :color="text ? 'green' : 'orange'"
          @click="handleStatus(item, text ? 0 : 1)"
        >{{ text ? '启用' : '禁用' }}</a-tag>
      </template>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <a v-if="$auth('/apps/sharp/active/time/index')" @click="handleTime(item)">场次管理</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/sharp/active'
import { STable } from '@/components/Table'

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: {},
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '会场ID',
          dataIndex: 'active_id'
        },
        {
          title: '活动日期',
          dataIndex: 'active_date'
        },
        {
          title: '场次数量',
          dataIndex: 'activeTimeCount'
        },
        {
          title: '活动状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'create_time'
        },
        {
          title: '操作',
          width: '180px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return Api.list({ ...param, ...this.queryParam })
          .then(response => {
            return response.data.list
          })
      }
    }
  },
  created () {
  },
  methods: {

    // 新增秒杀会场
    handleAdd () {
      this.$router.push('./create')
    },

    // 场次管理
    handleTime (item) {
      this.$router.push({ path: './time/index', query: { activeId: item.active_id } })
    },

    // 设置活动状态
    handleStatus (item, val) {
      const app = this
      const text = val ? '启用' : '禁用'
      const modal = this.$confirm({
        title: `您确定要${text}该活动吗?`,
        // content: '删除后不可恢复',
        onOk () {
          return Api.state(item.active_id, val)
            .then(result => {
              app.$message.success(result.message, 1.5)
              app.handleRefresh()
            })
            .finally(() => modal.destroy())
        }
      })
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = app.$confirm({
        title: '您确定要删除该记录吗?',
        onOk () {
          return Api.deleted(item.active_id)
            .then(result => {
              app.$message.success(result.message, 1.5)
              app.handleRefresh()
            })
            .finally(result => modal.destroy())
        }
      })
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
