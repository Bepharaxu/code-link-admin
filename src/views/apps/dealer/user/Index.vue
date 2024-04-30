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
    <s-table ref="table" rowKey="user_id" :columns="columns" :data="loadData" :pageSize="15">
      <!-- 会员信息 -->
      <template slot="user" slot-scope="text">
        <UserItem :user="text" />
      </template>
      <!-- 联系人 -->
      <template slot="contacts" slot-scope="item">
        <p>{{ item.real_name }}</p>
        <p>{{ item.mobile }}</p>
      </template>
      <!-- 累计佣金/可提现佣金 -->
      <template slot="money" slot-scope="item">
        <!-- <p>{{ Number(item.money) + Number(item.freeze_money) + Number(item.total_money) }}元</p> -->
        <p>{{ item.full_money }}元</p>
        <p>{{ item.money }}元</p>
      </template>
      <!-- 推荐人 -->
      <template slot="referee" slot-scope="item">
        <span v-if="item.referee_id && item.referee">
          <UserItem :user="item.referee" />
        </span>
        <span v-else>--</span>
      </template>
      <!-- 粉丝数量 -->
      <template slot="fans" slot-scope="item">
        <p>
          <a @click="handleFans(item, 1)">1级：{{ item.first_num }}</a>
        </p>
        <p>
          <a @click="handleFans(item, 2)">2级：{{ item.second_num }}</a>
        </p>
        <p>
          <a @click="handleFans(item, 3)">3级：{{ item.third_num }}</a>
        </p>
      </template>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <a v-action:edit @click="handleEdit(item)">编辑</a>
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick($event, item)">
            <a-menu-item v-if="$auth('/apps/dealer/order')" key="1">分销订单</a-menu-item>
            <a-menu-item v-if="$auth('/apps/dealer/withdraw')" key="2">提现明细</a-menu-item>
            <a-menu-item v-action:poster key="3">海报二维码</a-menu-item>
            <a-menu-item v-action:delete key="4">删除</a-menu-item>
          </a-menu>
          <a>
            <span>更多</span>
            <a-icon type="down" />
          </a>
        </a-dropdown>
      </span>
    </s-table>
    <a-modal v-model="visible" title="分销海报二维码">
      <div class="poster-modal">
        <a-spin :spinning="isLoading">
          <img v-if="posterUrl" :src="posterUrl" alt />
        </a-spin>
      </div>
    </a-modal>
    <FansModal ref="FansModal" />
    <EditForm ref="EditForm" @handleSubmit="handleRefresh" />
  </a-card>
</template>

<script>
import * as Api from '@/api/dealer/user'
import { STable, UserItem } from '@/components/Table'
import { EditForm, FansModal } from './modules'

export default {
  name: 'Index',
  components: {
    STable,
    UserItem,
    EditForm,
    FansModal
  },
  data () {
    return {
      // 查询参数
      queryParam: { search: '' },
      // 表头
      columns: [
        {
          title: '用户ID',
          dataIndex: 'user_id'
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
          title: '累计佣金/可提现佣金',
          scopedSlots: { customRender: 'money' }
        },
        {
          title: '推荐人',
          scopedSlots: { customRender: 'referee' }
        },
        {
          title: '下级用户',
          scopedSlots: { customRender: 'fans' }
        },
        {
          title: '成为时间',
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
      // 是否显示海报图弹窗
      visible: false,
      // 加载状态
      isLoading: true,
      // 二维码图片路径
      posterUrl: ''
    }
  },
  created () {

  },
  methods: {

    // 查看下级用户(粉丝)
    handleFans (item, level = 1) {
      this.$refs.FansModal.show(item.user_id, level)
    },

    // 编辑记录
    handleEdit (item) {
      this.$refs.EditForm.edit(item)
    },

    // 更多按钮点击事件
    handleMenuClick ({ key }, item) {
      const events = {
        1: this.handleOrder,
        2: this.handleWithdraw,
        3: this.handlePoster,
        4: this.handleDelete
      }
      events[key](item)
    },

    // 查看分销订单
    handleOrder (item) {
      this.$router.push({ path: '/apps/dealer/order', query: { searchType: 20, searchValue: item.user_id } })
    },

    // 查看分销订单
    handleWithdraw (item) {
      this.$router.push({ path: '/apps/dealer/withdraw', query: { dealerId: item.user_id } })
    },

    // 海报二维码
    handlePoster (item) {
      const app = this
      app.isLoading = true
      app.visible = true
      Api.poster(item.user_id, 'H5')
        .then(result => {
          app.posterUrl = result.data.imageUrl
        })
        .finally(() => app.isLoading = false)
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = app.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted(item.user_id)
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

<style lang="less" scoped>
.poster-modal {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 100%;
  }
}
</style>