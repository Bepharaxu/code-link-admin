<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col :span="5">
          <a-button
            v-if="$auth('/store/shop/create')"
            type="primary"
            icon="plus"
            @click="handleAdd"
          >新增</a-button>
        </a-col>
        <a-col class="flex flex-x-end" :span="11" :offset="8">
          <a-select
            style="width: 220px; margin-right: 20px;"
            placeholder="是否支持自提核销"
            v-model="queryParam.isCheck"
          >
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option :value="1">支持</a-select-option>
            <a-select-option :value="0">不支持</a-select-option>
          </a-select>
          <a-input-search
            style="max-width: 300px; min-width: 150px;"
            v-model="queryParam.search"
            placeholder="请输入门店名称/联系人/电话"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="shop_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
      :scroll="{ x: 1300 }"
    >
      <!-- 门店logo -->
      <span slot="logo_url" slot-scope="url">
        <a title="点击查看原图" :href="url" target="_blank">
          <img width="50" height="50" :src="url" alt="门店logo" />
        </a>
      </span>
      <!-- 门店名称 -->
      <span slot="shop_name" slot-scope="text">
        <p class="oneline-hide">{{ text }}</p>
      </span>
      <!-- 详细地址 -->
      <span slot="full_address" slot-scope="text">
        <p class="twoline-hide" style="width: 240px;">{{ text }}</p>
      </span>
      <!-- 自提核销 -->
      <span slot="is_check" slot-scope="text">
        <a-tag :color="text ? 'green' : ''">{{ text ? '支持' : '不支持' }}</a-tag>
      </span>
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : ''">{{ text ? '启用' : '禁用' }}</a-tag>
      </span>
      <!-- 操作 -->
      <div class="actions" slot="action" slot-scope="text, item">
        <a v-if="$auth('/store/shop/update')" @click="handleEdit(item)">编辑</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </div>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/store/shop'
import { STable } from '@/components'

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
          title: '门店ID',
          dataIndex: 'shop_id'
        },
        {
          title: '门店logo',
          dataIndex: 'logo_url',
          scopedSlots: { customRender: 'logo_url' }
        },
        {
          title: '门店名称',
          dataIndex: 'shop_name',
          width: '200px',
          scopedSlots: { customRender: 'shop_name' }
        },
        {
          title: '营业时间',
          dataIndex: 'shop_hours',
          width: '150px'
        },
        {
          title: '详细地址',
          dataIndex: 'full_address',
          width: '260px',
          scopedSlots: { customRender: 'full_address' }
        },
        {
          title: '自提核销',
          dataIndex: 'is_check',
          scopedSlots: { customRender: 'is_check' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '添加时间',
          dataIndex: 'create_time',
          width: '150px'
        },
        {
          title: '操作',
          width: '180px',
          fixed: 'right',
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
      this.$router.push('./create')
    },

    // 编辑记录
    handleEdit (item) {
      this.$router.push({ path: './update', query: { shopId: item.shop_id } })
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted({ shopId: item.shop_id })
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
