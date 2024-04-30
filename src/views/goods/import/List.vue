<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.pageTitle }}</div>
    <div class="table-operator">
      <!-- 搜索板块 -->
      <a-row class="row-item-search">
        <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
          <a-form-item label="导入状态">
            <a-select v-decorator="['status', { initialValue: -1 }]">
              <a-select-option :value="-1">全部</a-select-option>
              <a-select-option
                v-for="(item, index) in ImportStatusEnum.data"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item class="search-btn">
            <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
          </a-form-item>
        </a-form>
      </a-row>
      <!-- 操作板块 -->
      <div class="row-item-tab clearfix">
        <a-button
          v-if="$auth('/goods/import/batch')"
          class="fl-l"
          type="primary"
          icon="arrow-up"
          @click="handleImport()"
        >批量导入</a-button>
      </div>
    </div>
    <s-table
      ref="table"
      rowKey="id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
    >
      <!-- 开始时间 -->
      <template slot="start_time" slot-scope="text">
        <span>{{ text ? text : '--' }}</span>
      </template>
      <!-- 结束时间 -->
      <template slot="end_time" slot-scope="text">
        <span>{{ text ? text : '--' }}</span>
      </template>
      <!-- 导入状态 -->
      <span slot="status" slot-scope="text">
        <a-tag :color="ImportStatusColorEnum[text]">{{ ImportStatusEnum[text].name }}</a-tag>
      </span>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <a v-action:delete @click="handleDelete(item)">删除</a>
        <a v-if="item.fail_count > 0" @click="handleFailLog(item)">失败日志</a>
      </span>
    </s-table>
    <!-- 查看失败日志 -->
    <a-modal v-model="visibleFailLog" title="失败日志" @ok="visibleFailLog = false">
      <div class="modal-content">
        <p class="log-item" v-for="(item, index) in failLogContent" :key="index">
          <span class="mr-5">序号[{{ item.goodsSn }}]</span>
          <span>{{ item.message }}</span>
        </p>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import * as Api from '@/api/goods/import'
import { STable } from '@/components'
import { ImportStatusEnum } from '@/common/enum/goods'

// 导入状态标签颜色
const ImportStatusColorEnum = {
  [ImportStatusEnum.NORMAL.value]: '',
  [ImportStatusEnum.COMPLETED.value]: 'green'
}

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // 正在加载
      isLoading: false,
      // 枚举类
      ImportStatusEnum,
      ImportStatusColorEnum,
      // 表头
      columns: [
        {
          title: '记录ID',
          dataIndex: 'id'
        },
        {
          title: '导入总数量',
          dataIndex: 'total_count'
        },
        {
          title: '导入成功数量',
          dataIndex: 'success_count'
        },
        {
          title: '导入失败数量',
          dataIndex: 'fail_count'
        },
        {
          title: '开始时间',
          dataIndex: 'start_time',
          scopedSlots: { customRender: 'start_time' }
        },
        {
          title: '结束时间',
          dataIndex: 'end_time',
          scopedSlots: { customRender: 'end_time' }
        },
        {
          title: '导入状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
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
      },
      // 显示失败日志弹窗
      visibleFailLog: false,
      // 失败日志内容
      failLogContent: []
    }
  },
  created () { },
  methods: {

    // 批量导入
    handleImport () {
      this.$router.push('/goods/import/batch')
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted({ id: item['id'] })
            .then(result => {
              app.$message.success(result.message, 1.5)
              app.handleRefresh()
            })
            .finally(result => modal.destroy())
        }
      })
    },

    // 查看失败日志
    handleFailLog (item) {
      this.visibleFailLog = true
      this.failLogContent = item.fail_log
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      this.$refs.table.refresh(bool)
    },

    // 确认搜索
    handleSearch (e) {
      e.preventDefault()
      this.searchForm.validateFields((error, values) => {
        if (!error) {
          this.queryParam = { ...this.queryParam, ...values }
          this.handleRefresh(true)
        }
      })
    },

  }
}
</script>
<style lang="less" scoped>
.modal-content {
  max-height: 350px;
  overflow-y: auto;
  line-height: 26px;
}
</style>
