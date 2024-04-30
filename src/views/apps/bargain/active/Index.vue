<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col :span="5">
          <a-button
            v-if="$auth('/apps/bargain/active/create')"
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
      rowKey="active_id"
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
      <!-- 发起/截止时间 -->
      <template slot="time" slot-scope="item">
        <p>开始：{{ item.start_time }}</p>
        <p>结束：{{ item.end_time }}</p>
      </template>
      <!-- 砍价底价 -->
      <template slot="floor_price" slot-scope="text">
        <p class="c-p">¥{{ text }}</p>
      </template>
      <!-- 活动状态 -->
      <template slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : 'orange'">{{ text ? '进行中' : '已结束' }}</a-tag>
      </template>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <a v-if="$auth('/apps/bargain/active/update')" @click="handleEdit(item)">编辑</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import * as Api from '@/api/bargain/active'
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
          title: '活动ID',
          dataIndex: 'active_id'
        },
        {
          title: '商品信息',
          dataIndex: 'goods',
          width: '340px',
          scopedSlots: { customRender: 'goods' }
        },
        {
          title: '活动时间',
          width: '220px',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '砍价底价',
          dataIndex: 'floor_price',
          scopedSlots: { customRender: 'floor_price' }
        },
        {
          title: '帮砍人数',
          dataIndex: 'peoples'
        },
        {
          title: '活动销量(件)',
          dataIndex: 'actual_sales'
        },
        {
          title: '活动状态',
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
      this.$router.push({ path: './update', query: { activeId: item.active_id } })
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = app.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
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
    },

    // 检索查询
    onSearch () {
      this.handleRefresh(true)
    }

  }
}
</script>
