<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <div class="table-operator">
      <div class="guide-create">
        <a-row :gutter="40">
          <a-col :span="8">
            <div class="guide-item">
              <div class="title">普通拼团</div>
              <div class="describe">用户下单开团后，邀请好友拼团，以优惠价格购买，提升店铺转化</div>
              <div class="action" v-if="$auth('/apps/groupon/goods/create')">
                <router-link
                  :to="{ path: '/apps/groupon/goods/create', query: { type: ActiveTypeEnum.NORMAL.value } }"
                >
                  <a-button type="primary">立即创建</a-button>
                </router-link>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="guide-item">
              <div class="title">老带新拼团</div>
              <div class="describe">新老用户都可下单开团，但仅限新用户参团，快速裂变获取新客</div>
              <div class="action" v-if="$auth('/apps/groupon/goods/create')">
                <router-link
                  :to="{ path: '/apps/groupon/goods/create', query: { type: ActiveTypeEnum.PULL_NEW.value } }"
                >
                  <a-button type="primary">立即创建</a-button>
                </router-link>
              </div>
            </div>
          </a-col>
          <a-col :span="8">
            <div class="guide-item">
              <div class="title">阶梯拼团</div>
              <div class="describe">人数越多价格越低，用低价刺激用户发起拉人更多的拼团，高效裂变</div>
              <div class="action" v-if="$auth('/apps/groupon/goods/create')">
                <router-link
                  :to="{ path: '/apps/groupon/goods/create', query: { type: ActiveTypeEnum.STEPS.value } }"
                >
                  <a-button type="primary">立即创建</a-button>
                </router-link>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <a-row>
        <a-col :span="8">
          <div class="tab-list">
            <a-radio-group :defaultValue="queryParam.activeType" @change="handleTabs">
              <a-radio-button :value="0">全部</a-radio-button>
              <a-radio-button
                v-for="(item, index) in ActiveTypeEnum.data"
                :key="index"
                :value="item.value"
              >{{ item.name }}</a-radio-button>
            </a-radio-group>
          </div>
        </a-col>
        <a-col class="flex flex-x-end" :offset="8">
          <a-select
            style="width: 220px; margin-right: 20px;"
            placeholder="活动状态"
            v-model="queryParam.status"
          >
            <a-select-option
              v-for="(item, index) in GoodsStatusEnum.data"
              :key="index"
              :value="item.value"
            >{{ item.name }}</a-select-option>
          </a-select>
          <a-input-search
            style="max-width: 250px; min-width: 150px;"
            v-model="queryParam.search"
            placeholder="请输入商品名称"
            @search="onSearch"
          />
        </a-col>
      </a-row>
    </div>
    <s-table
      ref="table"
      rowKey="groupon_goods_id"
      :loading="isLoading"
      :columns="columns"
      :data="loadData"
      :pageSize="15"
      :scroll="{ x: 1300 }"
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
      <!-- 拼团类型 -->
      <span slot="active_type" slot-scope="text">
        <a-tag>{{ ActiveTypeEnum[text].name }}</a-tag>
      </span>
      <!-- 拼团价格 -->
      <template slot="groupon_price_min" slot-scope="text">
        <p class="c-p">¥{{ text }}</p>
      </template>
      <!-- 活动时间 -->
      <span slot="time" slot-scope="item">
        <p>开始：{{ item.start_time }}</p>
        <p>结束：{{ item.end_time }}</p>
      </span>
      <!-- 活动状态 -->
      <span slot="status" slot-scope="text">
        <a-tag
          :color="text == ActiveTypeEnum.NORMAL.value ? 'green' : 'orange'"
        >{{ GoodsStatusEnum[text].name }}</a-tag>
      </span>
      <!-- 操作 -->
      <span class="actions" slot="action" slot-scope="text, item">
        <router-link
          v-if="$auth('/apps/groupon/goods/update')"
          :to="{ path: '/apps/groupon/goods/update', query: { grouponGoodsId: item.groupon_goods_id } }"
        >编辑</router-link>
        <a v-action:delete @click="handleDelete(item)">删除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable, GoodsItem } from '@/components/Table'
import { GoodsStatusEnum, ActiveTypeEnum } from '@/common/enum/groupon'
import * as Api from '@/api/groupon/goods'

export default {
  name: 'Index',
  components: {
    STable,
    GoodsItem
  },
  data () {
    return {
      // 查询参数
      queryParam: { activeType: 0, status: undefined, search: '' },
      // 正在加载
      isLoading: false,
      // 枚举类
      GoodsStatusEnum,
      ActiveTypeEnum,
      // 表头
      columns: [
        {
          title: '商品ID',
          dataIndex: 'groupon_goods_id'
        },
        {
          title: '商品信息',
          dataIndex: 'goods',
          width: '320px',
          scopedSlots: { customRender: 'goods' }
        },
        {
          title: '拼团类型',
          dataIndex: 'active_type',
          scopedSlots: { customRender: 'active_type' }
        },
        {
          title: '拼团价格',
          dataIndex: 'groupon_price_min',
          scopedSlots: { customRender: 'groupon_price_min' }
        },
        {
          title: '活动时间',
          width: '200px',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: '实际销量',
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

    // 切换tab
    handleTabs (e) {
      this.queryParam.activeType = e.target.value
      this.handleRefresh(true)
    },

    // 新增记录
    handleAdd () {
      this.$refs.AddForm.handle()
    },

    // 删除记录
    handleDelete (item) {
      const app = this
      const modal = this.$confirm({
        title: '您确定要删除该记录吗?',
        content: '删除后不可恢复',
        onOk () {
          return Api.deleted({ grouponGoodsId: item.groupon_goods_id })
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
</script>
<style lang="less" scoped>
.guide-create {
  max-width: 1520px;
  margin: 0 auto 40px auto;
  .guide-item {
    padding: 18px 22px;
    background: rgb(255, 250, 240);
    text-align: center;
    border-radius: 5px;
    .title {
      font-weight: 600;
      font-size: 18px;
      margin-top: 3px;
      margin-bottom: 15px;
    }
    .describe {
      margin-bottom: 15px;
    }
    .action {
      /deep/.ant-btn {
        width: 105px;
      }
    }
  }
}
</style>
