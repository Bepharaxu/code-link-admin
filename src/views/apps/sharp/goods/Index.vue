<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col :span="5">
          <a-button
            v-if="$auth('/apps/sharp/goods/create')"
            type="primary"
            icon="plus"
            @click="handleAdd()"
          >新增</a-button>
        </a-col>
        <a-col class="flex flex-x-end" :span="11" :offset="8">
          <a-input-search
            style="max-width: 300px; min-width: 150px;"
            v-model="queryParam.search"
            placeholder="请输入商品名称"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="sharp_goods_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
      :scroll="{ x: 1450 }"
    >
      <!-- 商品信息 -->
      <template slot="goods" slot-scope="item">
        <GoodsItem
          :data="{
            image: item.goods_image,
            imageAlt: '商品图片',
            title: item.goods_name,
            subtitle: `¥${item.goods_price_min}`
          }"
          :subTitleColor="true"
        />
      </template>
      <!-- 秒杀价格 -->
      <template slot="seckill_price_min" slot-scope="text">
        <p class="c-p">¥{{ text }}</p>
      </template>
      <!-- 商品状态 -->
      <template slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : 'orange'">{{ text ? '上架' : '下架' }}</a-tag>
      </template>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <a v-if="$auth('/apps/sharp/goods/update')" @click="handleEdit(item)">编辑</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/sharp/goods'
import { STable, GoodsItem } from '@/components/Table'

export default {
  name: 'Index',
  components: {
    STable,
    GoodsItem
  },
  data () {
    return {
      // 查询参数
      queryParam: { search: '' },
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '秒杀商品ID',
          dataIndex: 'sharp_goods_id'
        },
        {
          title: '商品信息',
          dataIndex: 'goods',
          width: '320px',
          scopedSlots: { customRender: 'goods' }
        },
        {
          title: '秒杀价格',
          dataIndex: 'seckill_price_min',
          scopedSlots: { customRender: 'seckill_price_min' }
        },
        {
          title: '限购数量(件)',
          dataIndex: 'limit_num',
          scopedSlots: { customRender: 'limit_num' }
        },
        {
          title: '累积销量(件)',
          dataIndex: 'total_sales'
        },
        {
          title: '库存总量',
          dataIndex: 'seckill_stock'
        },
        {
          title: '商品状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '创建时间',
          width: '180px',
          dataIndex: 'create_time'
        },
        {
          title: '操作',
          width: '150px',
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

    // 新增砍价活动
    handleAdd () {
      this.$router.push('./create')
    },

    // 编辑砍价活动
    handleEdit (item) {
      this.$router.push({ path: './update', query: { sharpGoodsId: item.sharp_goods_id } })
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = app.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted(item.sharp_goods_id)
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
