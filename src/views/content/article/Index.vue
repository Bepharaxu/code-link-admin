<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <!-- 操作板块 -->
      <div class="row-item-tab clearfix">
        <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
      </div>
    </div>
    <a-table rowKey="id" :columns="columns" :data-source="loadData">
      <template slot="createTime" slot-scope="text, record">
        {{formatDate(record.createTime)}}
      </template>
      <template slot="action" slot-scope="text, record">
        <a href="javascript:;" style="margin-right: 10px" @click="handleViewProject(record)">项目列表</a>
        <a href="javascript:;" style="margin-right: 10px" @click="handleEdit(record)">编辑</a>
        <a-popconfirm title="是否删除?" @confirm="() => onDelete(record)">
          <a href="javascript:;">删除</a>
        </a-popconfirm>
      </template>
    </a-table>

    <AddForm ref="AddForm" :categoryList="categoryList" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" :categoryList="categoryList" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as ArticleApi from '@/api/content/article'
import EditForm from './modules/EditForm'
import AddForm from './modules/AddForm'
import dayjs from 'dayjs'

// 表格表头
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '客户姓名',
    dataIndex: 'name',
    width: '320px',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: '320px',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    scopedSlots: { customRender: 'createTime' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    fixed: 'right',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  name: 'Index',
  components: {
    AddForm,
    EditForm,
  },
  data() {
    return {
      expand: false,
      // 分类列表
      categoryList: [],
      // 查询参数
      queryParam: {},
      // 正在加载
      isLoading: false,
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: [],
    }
  },
  created() {
    // 获取客户列表
    this.getCustomerList()
  },
  methods: {
    // 获取客户列表
    getCustomerList() {
      this.isLoading = true
      ArticleApi.list()
        .then((result) => {
          console.log(result, 'result')
          this.loadData = result
        })
        .finally(() => (this.isLoading = false))
    },

    // 删除记录
    handleDelete(item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk() {
          return ArticleApi.deleted({ articleId: item.article_id })
            .then((result) => {
              app.$message.success(result.message, 1.5)
              app.handleRefresh()
            })
            .finally((result) => modal.destroy())
        },
      })
    },

    // 新增记录
    handleAdd() {
      this.$refs.AddForm.add()
    },

    // 编辑记录
    handleEdit(item) {
      this.$refs.EditForm.edit(item.id)
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh(bool = false) {
      this.getCustomerList()
    },
    onDelete(record) {
      console.log(record, 'record')
      ArticleApi.deleted(record.id).then((result) => {
        console.log(result, 'result')
        this.$message.success('删除成功', 1.5)
        this.getCustomerList()
      })
    },
    handleViewProject(record) {
      console.log(record)
      this.$router.push({ path: '/project/index', query: { id: record.id } })
    },
    formatDate (time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
}
</script>
<style lang="less" scoped>
.ant-card-body {
  padding: 22px 29px 25px;
}

// 筛选tab
.tab-list {
  margin-right: 20px;
}
</style>
