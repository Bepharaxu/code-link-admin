<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-alert message="拼团活动开启 “模拟成团” 后，满足条件的拼单，系统将会使用随机的 “拼团机器人” 模拟 “虚拟买家” 凑满该团，仅需对真实拼团买家发货。" banner />
    <div class="table-operator">
      <a-button v-action:add type="primary" icon="plus" @click="handleAdd">新增</a-button>
    </div>
    <s-table
      ref="table"
      rowKey="robot_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!-- 用户头像 -->
      <span slot="avatar" slot-scope="text">
        <div class="avatar">
          <img v-if="text" width="45" height="45" :src="text.preview_url" alt="用户头像" />
          <img v-else width="45" height="45" src="~@/assets/img/default-avatar.png" alt="用户头像" />
        </div>
      </span>
      <!-- 用户性别 -->
      <span slot="gender" slot-scope="text">
        <a-tag>{{ ['未知','男', '女'][text] }}</a-tag>
      </span>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <a v-action:edit @click="handleEdit(item)">编辑</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import * as Api from '@/api/groupon/robot'
import { AddForm, EditForm } from './modules'

export default {
  name: 'Index',
  components: {
    STable,
    AddForm,
    EditForm
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
          title: '机器人ID',
          dataIndex: 'robot_id'
        },
        {
          title: '用户头像',
          dataIndex: 'avatar',
          scopedSlots: { customRender: 'avatar' }
        },
        {
          title: '用户昵称',
          dataIndex: 'nick_name'
        },
        {
          title: '性别',
          dataIndex: 'gender',
          scopedSlots: { customRender: 'gender' }
        },
        {
          title: '排序',
          dataIndex: 'sort'
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

    // 新增记录
    handleAdd () {
      this.$refs.AddForm.handle()
    },

    // 编辑记录
    handleEdit (item) {
      this.$refs.EditForm.handle(item)
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted({ robotId: item.robot_id })
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
    },

    // 检索查询
    onSearch () {
      this.handleRefresh(true)
    }

  }
}
</script>
