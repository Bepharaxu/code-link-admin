<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col class="flex flex-x-end">
          <a-input-search
            style="max-width: 300px; min-width: 150px;"
            v-model="queryParam.search"
            placeholder="请输入姓名/手机号/昵称"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="apply_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!-- 会员信息 -->
      <template slot="user" slot-scope="text">
        <UserItem :user="text" />
      </template>
      <!-- 联系人 -->
      <template slot="contacts" slot-scope="item">
        <p>{{ item.real_name }}</p>
        <p>{{ item.mobile }}</p>
      </template>
      <!-- 推荐人 -->
      <template slot="referee" slot-scope="item">
        <span v-if="item.referee_id && item.referee">
          <UserItem :user="item.referee" />
        </span>
        <span v-else>--</span>
      </template>
      <!-- 审核状态 -->
      <template slot="apply_status" slot-scope="text">
        <a-tag :color="ApplyStatusTagColor[text]">{{ ApplyStatusEnum[text].name }}</a-tag>
      </template>
      <!-- 申请方式 -->
      <template slot="apply_type" slot-scope="text">
        <a-tag>{{ ApplyTypeEnum[text].name }}</a-tag>
      </template>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <span v-if="item.apply_status == ApplyStatusEnum.WAIT.value">
          <a v-action:audit @click="handleAudit(item)">审核</a>
        </span>
      </span>
    </s-table>
    <AuditForm ref="AuditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/dealer/apply'
import { STable, UserItem } from '@/components/Table'
import { ApplyStatusEnum, ApplyTypeEnum } from '@/common/enum/dealer/apply'
import { AuditForm } from './modules'

export default {
  name: 'Index',
  components: {
    STable,
    UserItem,
    AuditForm
  },
  data () {
    return {
      // 枚举类
      ApplyStatusEnum,
      ApplyTypeEnum,
      ApplyStatusTagColor: {
        [ApplyStatusEnum.WAIT.value]: '',
        [ApplyStatusEnum.PASSED.value]: 'green',
        [ApplyStatusEnum.REJECT.value]: 'red'
      },
      // 查询参数
      queryParam: { search: '' },
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '申请ID',
          dataIndex: 'apply_id'
        },
        {
          title: '会员信息',
          dataIndex: 'user',
          scopedSlots: { customRender: 'user' }
        },
        {
          title: '姓名/手机号',
          scopedSlots: { customRender: 'contacts' }
        },
        {
          title: '推荐人',
          scopedSlots: { customRender: 'referee' }
        },
        {
          title: '审核状态',
          dataIndex: 'apply_status',
          scopedSlots: { customRender: 'apply_status' }
        },
        {
          title: '申请方式',
          dataIndex: 'apply_type',
          scopedSlots: { customRender: 'apply_type' }
        },
        {
          title: '申请时间',
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
      }
    }
  },
  created () {

  },
  methods: {

    // 审核记录
    handleAudit (item) {
      this.$refs.AuditForm.edit(item)
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
