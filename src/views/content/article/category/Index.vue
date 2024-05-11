<template>
  <a-card :bordered="false">
    <div class="card-title"><a-icon type="left" style="margin-right: 10px; cursor: pointer;" @click="returnPage" />{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
    </div>
    <a-table
      v-if="!isLoading"
      rowKey="id"
      :columns="columns"
      :dataSource="projectList"
      :defaultExpandAllRows="true"
      :expandIconColumnIndex="1"
      :pagination="false"
      :loading="isLoading"
    >
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : ''">{{ text ? '启用' : '未启用' }}</a-tag>
      </span>
      <template slot="createTime" slot-scope="text, record">
        {{formatDate(record.createTime)}}
      </template>
      <span slot="action" slot-scope="text, item">
        <a style="margin-right: 8px;" @click="handleConfig(item)">配置内容</a>
        <a style="margin-right: 8px;" @click="handleEdit(item)">编辑</a>
        <a @click="handleDelete(item)">删除</a>
      </span>
    </a-table>
    <AddForm ref="AddForm" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/content/article/category'
import { STable } from '@/components'
import AddForm from './modules/AddForm'
import EditForm from './modules/EditForm'
import dayjs from 'dayjs'

export default {
  name: 'Index',
  components: {
    STable,
    AddForm,
    EditForm
  },
  data () {
    return {
      // 分类列表
      projectList: [],
      // 查询参数
      queryParam: {},
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '项目ID',
          dataIndex: 'id'
        },
        {
          title: '项目名称',
          dataIndex: 'name'
        },
        {
          title: '项目描述',
          dataIndex: 'desc'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '180px',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created () {
    console.log(this.$route.query.id, 'route')
    this.customerId = this.$route.query.id
    // 获取分类列表
    this.getProjectList()
  },
  methods: {

    // 获取分类列表
    getProjectList () {
      this.isLoading = true
      Api.list(this.customerId)
        .then(result => {
          this.projectList = result
        })
        .finally(() => this.isLoading = false)
    },

    // 新增记录
    handleAdd () {
      this.$refs.AddForm.add(this.customerId)
    },

    // 编辑记录
    handleEdit (item) {
      this.$refs.EditForm.edit(item)
    },

    // 删除记录
    handleDelete (item) {
      const self = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted(item.id)
            .then(result => {
              self.$message.success('删除成功', 1.5)
              self.handleRefresh()
            })
            .finally(result => modal.destroy())
        }
      })
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh () {
      // 获取分类列表
      this.getProjectList()
    },

    returnPage () {
      this.$router.go(-1)
    },

    handleConfig (record) {
      this.$router.push({ path: '/project/config', query: { id: record.id } })
    },

    formatDate (time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }

  }
}
</script>
