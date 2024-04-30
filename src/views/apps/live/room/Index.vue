<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-alert class="mb-15" :showIcon="true" message="微信小程序直播操作说明" banner>
      <template slot="description">
        <p>
          1. 登录
          <a href="https://mp.weixin.qq.com/" target="_blank">微信小程序运营平台</a>，点击左侧菜单栏 “直播”，点击 “创建直播间” 按钮。
        </p>
        <p>2. 点击本页面中的 "同步直播间" 按钮，将直播间列表导入商城系统中。</p>
      </template>
    </a-alert>

    <div class="table-operator">
      <a-row>
        <a-col :span="5">
          <a-button v-action:sync type="primary" icon="sync" @click="handleSync()">同步直播间</a-button>
        </a-col>
        <a-col class="flex flex-x-end" :span="11" :offset="8">
          <a-input-search
            style="max-width: 300px; min-width: 150px;"
            v-model="queryParam.search"
            placeholder="请输入直播间名称/主播昵称"
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
      <!-- 直播时间 -->
      <template slot="time" slot-scope="item">
        <p>开始：{{ item.start_time }}</p>
        <p>结束：{{ item.end_time }}</p>
      </template>
      <!-- 直播状态 -->
      <template slot="live_status" slot-scope="text">
        <a-tag :color="LiveStatusColorEnum[text]">{{ LiveStatusEnum[text].name }}</a-tag>
      </template>
      <!-- 是否置顶 -->
      <template slot="is_top" slot-scope="text, item">
        <a-tag
          class="cur-p"
          :color="text ? 'green' : ''"
          @click="handleSetTop(item, text ? 0 : 1)"
        >{{ text ? '是' : '否' }}</a-tag>
      </template>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import * as Api from '@/api/live/room'
import { LiveStatusEnum } from '@/common/enum/live'

// 直播间直播状态标签颜色
const LiveStatusColorEnum = {
  101: 'green',
  102: 'green',
  103: 'red',
  104: 'red',
  105: 'orange',
  106: 'red',
  107: 'red',
}

export default {
  name: 'Index',
  components: {
    STable
  },
  data () {
    return {
      // 查询参数
      queryParam: { search: undefined },
      // 正在加载
      isLoading: false,
      // 枚举类
      LiveStatusEnum,
      LiveStatusColorEnum,
      // 表头
      columns: [
        {
          title: '直播间ID',
          dataIndex: 'id'
        },
        {
          title: '直播间名称',
          dataIndex: 'room_name'
        },
        {
          title: '主播昵称',
          dataIndex: 'anchor_name',
          scopedSlots: { customRender: 'anchor_name' }
        },
        {
          title: '直播时间',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '直播状态',
          dataIndex: 'live_status',
          scopedSlots: { customRender: 'live_status' }
        },
        {
          title: '是否置顶',
          dataIndex: 'is_top',
          scopedSlots: { customRender: 'is_top' }
        },
        {
          title: '更新时间',
          dataIndex: 'update_time'
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

    // 同步直播间
    handleSync () {
      const app = this
      app.isLoading = true
      Api.sync()
        .then(result => {
          app.$message.success(result.message, 1.5)
          app.queryParam.search = undefined
          app.handleRefresh(true)
        })
        .finally(() => app.isLoading = false)
    },

    // 编辑记录
    handleEdit (item) {
      this.$refs.EditForm.edit(item)
    },

    // 设置直播间置顶
    handleSetTop (item, val) {
      const app = this
      if (!this.$auth('/apps/live/room/index.setTop')) {
        return false
      }
      const text = val ? '' : '取消'
      const modal = this.$confirm({
        title: `您确定要${text}置顶该直播间吗?`,
        onOk () {
          return Api.setTop(item.id, val)
            .then(result => {
              app.$message.success(result.message, 1.5)
              app.handleRefresh()
            })
            .finally(() => modal.destroy())
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
