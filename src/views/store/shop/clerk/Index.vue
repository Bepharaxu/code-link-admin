<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col :span="5">
          <a-button v-action:add type="primary" icon="plus" @click="handleAdd">新增</a-button>
        </a-col>
        <a-col class="flex flex-x-end" :span="11" :offset="8">
          <a-select
            style="width: 220px; margin-right: 20px;"
            placeholder="所属门店"
            v-model="queryParam.shop_id"
          >
            <a-select-option :value="0">全部</a-select-option>
            <a-select-option
              v-for="(item, index) in shopList"
              :key="index"
              :value="item.shop_id"
            >{{ item.shop_name }}</a-select-option>
          </a-select>
          <a-input-search
            style="max-width: 300px; min-width: 150px;"
            v-model="queryParam.search"
            placeholder="请输入店员姓名/手机号"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="clerk_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!-- 会员信息 -->
      <span slot="user" slot-scope="text">
        <UserItem :user="text" />
      </span>
      <!-- 所属门店 -->
      <span slot="shop" slot-scope="text">
        <a-tag>{{ text.shop_name }}</a-tag>
      </span>
      <!-- 状态 -->
      <span slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : ''">{{ text ? '启用' : '禁用' }}</a-tag>
      </span>
      <!-- 操作 -->
      <span slot="action" slot-scope="text, item">
        <a v-action:edit style="margin-right: 8px;" @click="handleEdit(item)">编辑</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
    <AddForm ref="AddForm" :shopList="shopList" @handleSubmit="handleRefresh" />
    <EditForm ref="EditForm" :shopList="shopList" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/store/shop/clerk'
import * as ShopApi from '@/api/store/shop'
import { STable, UserItem } from '@/components/Table'
import { AddForm, EditForm } from './modules'

export default {
  name: 'Index',
  components: {
    STable,
    UserItem,
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
          title: '店员ID',
          dataIndex: 'clerk_id'
        },
        {
          title: '会员信息',
          dataIndex: 'user',
          scopedSlots: { customRender: 'user' }
        },
        {
          title: '所属门店',
          dataIndex: 'shop',
          scopedSlots: { customRender: 'shop' }
        },
        {
          title: '店员姓名',
          dataIndex: 'real_name'
        },
        {
          title: '手机号',
          dataIndex: 'mobile'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
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
          .then(response => {
            return response.data.list
          })
      },
      // 门店列表
      shopList: []
    }
  },
  created () {
    // 获取门店列表
    this.getShopList()
  },
  methods: {

    // 获取门店列表
    getShopList () {
      ShopApi.all().then(result => {
        this.shopList = result.data.list
      })
    },

    // 新增记录
    handleAdd () {
      this.$refs.AddForm.add()
    },

    // 编辑记录
    handleEdit (item) {
      this.$refs.EditForm.edit(item)
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted({ clerkId: item.clerk_id })
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
