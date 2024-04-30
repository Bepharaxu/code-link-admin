<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <a-row>
        <a-col class="flex flex-x-end">
          <a-select
            style="width: 220px; margin-right: 20px;"
            placeholder="请选择打款方式"
            v-model="queryParam.payType"
          >
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option
              v-for="(item, index) in PayTypeEnum.data"
              :key="index"
              :value="item.value"
            >{{ item.name }}</a-select-option>
          </a-select>
          <a-select
            style="width: 220px; margin-right: 20px;"
            placeholder="请选择申请状态"
            v-model="queryParam.applyStatus"
          >
            <a-select-option :value="-1">全部</a-select-option>
            <a-select-option
              v-for="(item, index) in ApplyStatusEnum.data"
              :key="index"
              :value="item.value"
            >{{ item.name }}</a-select-option>
          </a-select>
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
      rowKey="id"
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
      <!-- 提现金额 -->
      <template slot="money" slot-scope="text">
        <p>{{ Number(text) }}元</p>
      </template>
      <!-- 打款方式 -->
      <template slot="pay_type" slot-scope="text">
        <a-tag>{{ PayTypeEnum[text].name }}</a-tag>
      </template>
      <!-- 提现信息 -->
      <template slot="pay_info" slot-scope="item">
        <div v-if="item.pay_type == PayTypeEnum.WECHAT.value">
          <span>--</span>
        </div>
        <div v-if="item.pay_type == PayTypeEnum.ALIPAY.value">
          <p>{{ item.alipay_name }}</p>
          <p>{{ item.alipay_account }}</p>
        </div>
        <div v-if="item.pay_type == PayTypeEnum.BANK_CARD.value">
          <p>{{ item.bank_name }}</p>
          <p>{{ item.bank_account }}</p>
          <p>{{ item.bank_card }}</p>
        </div>
      </template>
      <!-- 审核状态 -->
      <template slot="apply_status" slot-scope="text">
        <a-tag :color="ApplyStatusColor[text]">{{ ApplyStatusEnum[text].name }}</a-tag>
      </template>
      <!-- 审核时间 -->
      <template slot="audit_time" slot-scope="text">
        <span>{{ text ? text : '--' }}</span>
      </template>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <template v-if="item.apply_status == ApplyStatusEnum.WAIT.value">
          <a v-action:audit @click="handleAudit(item)">审核</a>
        </template>
        <template v-if="item.apply_status == ApplyStatusEnum.PASSED.value">
          <a v-action:payed @click="handlePayed(item)">已打款</a>
          <a v-action:wechatPay @click="handleWechatPay(item)">微信打款</a>
        </template>
      </span>
    </s-table>
    <AuditForm ref="AuditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/dealer/withdraw'
import { STable, UserItem } from '@/components/Table'
import { PayTypeEnum, ApplyStatusEnum } from '@/common/enum/dealer/withdraw'
import { AuditForm } from './modules'

// 标签颜色：审核状态
const ApplyStatusColor = {
  [ApplyStatusEnum.WAIT.value]: '',
  [ApplyStatusEnum.PASSED.value]: 'green',
  [ApplyStatusEnum.REJECT.value]: 'red',
  [ApplyStatusEnum.PAYMENT.value]: 'green',
}

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
      PayTypeEnum,
      ApplyStatusEnum,
      ApplyStatusColor,
      // 查询参数
      queryParam: { dealerId: undefined, payType: undefined, applyStatus: undefined, search: '' },
      // 正在加载
      isLoading: false,
      // 表头
      columns: [
        {
          title: '记录ID',
          dataIndex: 'id'
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
          title: '提现金额',
          dataIndex: 'money',
          scopedSlots: { customRender: 'money' }
        },
        {
          title: '打款方式',
          dataIndex: 'pay_type',
          scopedSlots: { customRender: 'pay_type' }
        },
        {
          title: '提现信息',
          scopedSlots: { customRender: 'pay_info' }
        },
        {
          title: '审核状态',
          dataIndex: 'apply_status',
          scopedSlots: { customRender: 'apply_status' }
        },
        {
          title: '申请时间',
          dataIndex: 'create_time'
        },
        {
          title: '审核时间',
          dataIndex: 'audit_time',
          scopedSlots: { customRender: 'audit_time' }
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
    const query = this.$route.query
    if (query.dealerId) {
      this.queryParam.dealerId = Number(query.dealerId)
    }
  },
  methods: {

    // 审核提现申请
    handleAudit (item) {
      this.$refs.AuditForm.edit(item)
    },

    // 确认已打款
    handlePayed (item) {
      const app = this
      const modal = app.$confirm({
        title: '您确定要标记为已打款状态吗?',
        content: '该操作仅改变提现申请状态，实际的付款/支付需要您线下操作',
        onOk () {
          return Api.payed(item.id)
            .then(result => {
              app.$message.success(result.message, 1.5)
              app.handleRefresh()
            })
            .finally(result => modal.destroy())
        }
      })
    },

    // 使用微信支付在线打款, 并标记为已打款状态
    handleWechatPay (item) {
      const app = this
      const modal = app.$confirm({
        title: '您确定要使用微信支付在线打款吗?',
        content: '该操作将使用微信支付在线打款（需开通商家转账到零钱功能）',
        onOk () {
          return Api.wechatPay(item.id)
            .then(result => {
              // app.$message.success(result.message, 6)
              app.$success({ title: result.message })
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
