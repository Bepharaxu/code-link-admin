<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col class="flex flex-x-end">
          <a-select
            style="width: 220px; margin-right: 20px;"
            placeholder="拼团类型"
            v-model="queryParam.activeType"
          >
            <a-select-option
              v-for="(item, index) in ActiveTypeEnum.data"
              :key="index"
              :value="item.value"
            >{{ item.name }}</a-select-option>
          </a-select>
          <a-select
            style="width: 220px; margin-right: 20px;"
            placeholder="拼单状态"
            v-model="queryParam.status"
          >
            <a-select-option
              v-for="(item, index) in TaskStatusEnum.data"
              :key="index"
              :value="item.value"
            >{{ item.name }}</a-select-option>
          </a-select>
          <a-input-search
            style="max-width: 300px; min-width: 150px;"
            v-model="queryParam.search"
            placeholder="请输入发起人昵称/商品名称"
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
      :scroll="{ x: 1450 }"
    >
      <!-- 商品信息 -->
      <template slot="goods" slot-scope="item">
        <GoodsItem
          :data="{
            image: item.goods.goods_image,
            imageAlt: '商品图片',
            title: item.goods.goods_name,
            subtitle: `¥${item.groupGoods.groupon_price_min}`
          }"
          :subTitleColor="true"
        />
      </template>
      <!-- 拼单状态 -->
      <span slot="active_type" slot-scope="text">
        <a-tag>{{ ActiveTypeEnum[text].name }}</a-tag>
      </span>
      <!-- 已拼人数 -->
      <span slot="people" slot-scope="text">
        <p>{{ text }}人</p>
      </span>
      <!-- 已拼人数 -->
      <span slot="now_people" slot-scope="item">
        <a-tooltip placement="top">
          <template slot="title">
            <p class="f-12">真实成员：{{ item.actual_people }}人</p>
            <p class="f-12" style="padding-left: 12px">机器人：{{ item.robot_people }}人</p>
          </template>
          <a href="javascript:void(0);" @click="handlePeoples(item)">
            <p>{{ item.actual_people }}人</p>
            <p v-if="item.robot_people">{{ item.robot_people }}人</p>
          </a>
        </a-tooltip>
      </span>
      <!-- 会员信息 -->
      <template slot="user" slot-scope="text">
        <UserItem :user="text" />
      </template>
      <!-- 发起结束时间 -->
      <span slot="time" slot-scope="item">
        <p>{{ item.start_time }}</p>
        <p>{{ item.end_time }}</p>
      </span>
      <!-- 拼单状态 -->
      <span slot="status" slot-scope="text">
        <a-tag :color="TaskStatusEnumTagColor[text]">{{ TaskStatusEnum[text].name }}</a-tag>
      </span>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <a @click="handlePeoples(item)">拼单成员</a>
      </span>
    </s-table>
    <PeopleModal ref="PeopleModal" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import { STable, UserItem, GoodsItem } from '@/components/Table'
import { TaskStatusEnum, ActiveTypeEnum } from '@/common/enum/groupon'
import { OrderSourceEnum } from '@/common/enum/order'
import * as Api from '@/api/groupon/task'
import { PeopleModal } from './modules'

export default {
  name: 'Index',
  components: {
    STable,
    GoodsItem,
    UserItem,
    PeopleModal
  },
  data () {
    return {
      // 查询参数
      queryParam: { activeType: undefined, status: undefined, search: '' },
      // 正在加载
      isLoading: false,
      // 枚举类
      TaskStatusEnum,
      ActiveTypeEnum,
      TaskStatusEnumTagColor: {
        [TaskStatusEnum.NORMAL.value]: '',
        [TaskStatusEnum.COMPLETED.value]: 'green',
        [TaskStatusEnum.FAIL.value]: 'red'
      },
      // 表头
      columns: [
        {
          title: '拼单ID',
          dataIndex: 'task_id'
        },
        {
          title: '拼团商品',
          width: '320px',
          scopedSlots: { customRender: 'goods' }
        },
        {
          title: '拼团类型',
          dataIndex: 'active_type',
          scopedSlots: { customRender: 'active_type' }
        },
        {
          title: '成团人数',
          dataIndex: 'people',
          scopedSlots: { customRender: 'people' }
        },
        {
          title: '已拼人数',
          scopedSlots: { customRender: 'now_people' }
        },
        {
          title: '发起人 (团长)',
          dataIndex: 'user',
          width: '200px',
          scopedSlots: { customRender: 'user' }
        },
        {
          title: '发起/结束时间',
          width: '180px',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '拼单状态',
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
          .then(response => response.data.list)
      }
    }
  },
  created () {

  },
  methods: {

    // 显示拼团成员列表
    handlePeoples (item) {
      this.$refs.PeopleModal.handle(item.task_id)
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
