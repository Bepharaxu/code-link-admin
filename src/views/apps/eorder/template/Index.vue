<template>
  <a-card :bordered="false">
    <div class="card-title">电子面单模板</div>
    <div class="table-operator">
      <a-row>
        <a-col :span="6">
          <a-button
            v-if="$auth('/apps/eorder/template/create')"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增</a-button>
        </a-col>
        <a-col :span="8" :offset="10">
          <a-input-search
            style="max-width: 300px; min-width: 150px;float: right;"
            v-model="queryParam.search"
            placeholder="请输入模板名称"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="template_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!-- API网关 -->
      <span slot="provider" slot-scope="text">
        <a-tag>{{ ProviderEnum[text] }}</a-tag>
      </span>
      <!-- 物流公司 -->
      <span slot="express" slot-scope="express">
        <a-tag>{{ express.express_name }}</a-tag>
      </span>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <a v-if="$auth('/apps/eorder/template/update')" @click="handleEdit(item)">编辑</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/eorder/template'
import { STable } from '@/components'

const ProviderEnum = {
  'kd100': '快递100',
  'kdniao': '快递鸟'
}

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
      // 枚举类
      ProviderEnum,
      // 表头
      columns: [
        {
          title: '模板ID',
          dataIndex: 'template_id'
        },
        {
          title: '模板名称',
          dataIndex: 'name'
        },
        {
          title: 'API网关',
          dataIndex: 'provider',
          scopedSlots: { customRender: 'provider' }
        },
        {
          title: '物流公司',
          dataIndex: 'express',
          scopedSlots: { customRender: 'express' }
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '添加时间',
          dataIndex: 'create_time'
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
          .then(response => response.data.list)
      }
    }
  },
  created () { },
  methods: {

    // 新增记录
    handleAdd () {
      this.$router.push('./create')
    },

    // 编辑记录
    handleEdit (item) {
      this.$router.push({ path: './update', query: { templateId: item.template_id } })
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted({ templateId: item['template_id'] })
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
