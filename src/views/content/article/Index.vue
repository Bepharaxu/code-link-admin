<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <!-- 操作板块 -->
      <div class="row-item-tab clearfix">
        <a-button v-action:add type="primary" icon="plus" @click="handleAdd">新增</a-button>
      </div>
    </div>
    <a-table :columns="columns" :data-source="loadData"></a-table>
    
    <AddForm ref="AddForm" :categoryList="categoryList" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" :categoryList="categoryList" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as ArticleApi from '@/api/content/article'
import * as CategoryApi from '@/api/content/article/category'
import { ContentHeader, STable } from '@/components'
import EditForm from './modules/EditForm'
import AddForm from './modules/AddForm'

// 表格表头
const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
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
    // width: '180px',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    fixed: 'right',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'Index',
  components: {
    ContentHeader,
    STable,
    AddForm,
    EditForm
  },
  data() {
    return {
      expand: false,
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      // 分类列表
      categoryList: [],
      // 查询参数
      queryParam: {},
      // 正在加载
      isLoading: false,
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: []
    }
  },
  created() {
    // 获取分类列表
    this.getCategoryList()
  },
  methods: {

    // 获取客户列表
    getCategoryList() {
      this.isLoading = true
      CategoryApi.list()
        .then(result => {
          console.log(result, 'result')
          this.loadData = result
        })
        .finally(() => this.isLoading = false)
    },

    // 确认搜索
    handleSearch(e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        if (!error) {
          this.queryParam = { ...this.queryParam, ...values }
          this.handleRefresh(true)
        }
      })
    },

    // 删除记录
    handleDelete(item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk() {
          return ArticleApi.deleted({ articleId: item.article_id })
            .then(result => {
              app.$message.success(result.message, 1.5)
              app.handleRefresh()
            })
            .finally(result => modal.destroy())
        }
      })
    },

    // 新增记录
    handleAdd() {
      this.$refs.AddForm.add()
    },

    // 编辑记录
    handleEdit(item) {
      this.$refs.EditForm.edit(item.article_id)
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh(bool = false) {
      this.$refs.table.refresh(bool)
    }

  }
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
