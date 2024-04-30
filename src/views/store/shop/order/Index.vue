<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col class="flex flex-x-end">
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
            placeholder="请输入姓名/联系电话"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!-- 核销门店 -->
      <span slot="shop" slot-scope="text">{{ text.shop_name }}</span>
      <!-- 核销门店 -->
      <span slot="clerk" slot-scope="text">{{ text.real_name }}</span>
      <!-- 核销门店 -->
      <span slot="order" slot-scope="text">{{ text.order_no }}</span>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/store/shop/order'
import * as ShopApi from '@/api/store/shop'
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
          title: '记录ID',
          dataIndex: 'id'
        },
        {
          title: '核销门店',
          dataIndex: 'shop',
          scopedSlots: { customRender: 'shop' }
        },
        {
          title: '核销员',
          dataIndex: 'clerk',
          scopedSlots: { customRender: 'clerk' }
        },
        {
          title: '订单号',
          dataIndex: 'order',
          scopedSlots: { customRender: 'order' }
        },
        {
          title: '核销时间',
          dataIndex: 'create_time'
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
