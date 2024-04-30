<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col class="flex flex-x-end">
          <a-select
            style="width: 220px; margin-right: 20px;"
            placeholder="是否购买"
            v-model="queryParam.isBuy"
          >
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option :value="0">未购买</a-select-option>
            <a-select-option :value="1">已购买</a-select-option>
          </a-select>
          <a-select
            style="width: 220px; margin-right: 20px;"
            placeholder="任务状态"
            v-model="queryParam.status"
          >
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option :value="1">进行中</a-select-option>
            <a-select-option :value="0">已结束</a-select-option>
          </a-select>
          <a-input-search
            style="max-width: 300px; min-width: 150px;"
            v-model="queryParam.search"
            placeholder="请输入会员昵称/商品名称"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="task_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
      :scroll="{ x: 1400 }"
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
      <!-- 会员信息 -->
      <template slot="user" slot-scope="text">
        <UserItem :user="text" />
      </template>
      <!-- 原价/底价 -->
      <template slot="price" slot-scope="item">
        <p class="c-p" :style="{ textDecoration: 'line-through' }">¥{{ item.goods_price }}</p>
        <p class="c-p">¥{{ item.floor_price }}</p>
      </template>
      <!-- 已砍金额 -->
      <template slot="cut_money" slot-scope="text">
        <p class="c-p">¥{{ text }}</p>
      </template>
      <!-- 原价/底价 -->
      <template slot="price" slot-scope="item">
        <p class="c-p" :style="{ textDecoration: 'line-through' }">¥{{ item.goods_price }}</p>
        <p class="c-p">¥{{ item.floor_price }}</p>
      </template>
      <!-- 帮砍/已砍人数 -->
      <template slot="peoples" slot-scope="item">
        <p>{{ item.peoples }}人</p>
        <p>{{ item.cut_people }}人</p>
      </template>
      <!-- 审核状态 -->
      <template slot="is_buy" slot-scope="text">
        <a-tag :color="text ? 'green' : ''">{{ text ? '已购买' : '未购买' }}</a-tag>
      </template>
      <!-- 审核状态 -->
      <template slot="status" slot-scope="text">
        <a-tag :color="text ? 'green' : ''">{{ text ? '进行中' : '已结束' }}</a-tag>
      </template>
      <!-- 发起/截止时间 -->
      <template slot="time" slot-scope="item">
        <p>{{ item.create_time }}</p>
        <p>{{ item.end_time }}</p>
      </template>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <a v-action:help @click="handleHelp(item)">砍价榜</a>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
    <HelpModal ref="HelpModal" />
  </a-card>
</template>

<script>
import * as Api from '@/api/bargain/task'
import { STable, UserItem, GoodsItem } from '@/components/Table'
import { HelpModal } from './modules'

export default {
  name: 'Index',
  components: {
    STable,
    UserItem,
    GoodsItem,
    HelpModal
  },
  data () {
    return {
      // 查询参数
      queryParam: { isBuy: undefined, status: undefined, search: '' },
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '任务ID',
          dataIndex: 'task_id'
        },
        {
          title: '商品信息',
          dataIndex: 'goods',
          width: '320px',
          scopedSlots: { customRender: 'goods' }
        },
        {
          title: '会员信息',
          dataIndex: 'user',
          width: '210px',
          scopedSlots: { customRender: 'user' }
        },
        {
          title: '商品原价/底价',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '帮砍/已砍人数',
          scopedSlots: { customRender: 'peoples' }
        },
        {
          title: '已砍金额',
          dataIndex: 'cut_money',
          scopedSlots: { customRender: 'cut_money' }
        },
        {
          title: '发起/截止时间',
          width: '180px',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '是否购买',
          dataIndex: 'is_buy',
          scopedSlots: { customRender: 'is_buy' }
        },
        {
          title: '砍价状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
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

    // 查看砍价榜
    handleHelp (item) {
      this.$refs.HelpModal.show(item.task_id)
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = app.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted(item.task_id)
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
