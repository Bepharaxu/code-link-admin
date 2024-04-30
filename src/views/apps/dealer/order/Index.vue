<template>
  <a-card :bordered="false">
    <a-spin :spinning="isLoading">
      <div class="card-title">{{ $route.meta.title }}</div>
      <div class="table-operator">
        <!-- 搜索板块 -->
        <a-row class="row-item-search">
          <a-form class="search-form" :form="searchForm" layout="inline" @submit="handleSearch">
            <a-form-item label="订单查询">
              <a-input style="width: 342px" placeholder="请输入关键词" v-decorator="['searchValue']">
                <a-select
                  slot="addonBefore"
                  v-decorator="['searchType', { initialValue: 10 }]"
                  style="width: 100px"
                >
                  <a-select-option
                    v-for="(item, index) in SearchTypeEnum"
                    :key="index"
                    :value="item.value"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-input>
            </a-form-item>
            <a-form-item label="佣金结算">
              <a-select v-decorator="['settled', { initialValue: -1 }]">
                <a-select-option :value="-1">全部</a-select-option>
                <a-select-option :value="1">已结算</a-select-option>
                <a-select-option :value="0">未结算</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item class="search-btn">
              <a-button type="primary" icon="search" html-type="submit">搜索</a-button>
            </a-form-item>
          </a-form>
        </a-row>
      </div>
      <!-- 列表内容 -->
      <div class="ant-table ant-table-scroll-position-left ant-table-default ant-table-bordered">
        <div class="ant-table-content">
          <div class="ant-table-body">
            <table>
              <thead class="ant-table-thead">
                <tr>
                  <th v-for="(item, index) in columns" :key="index">
                    <span class="ant-table-header-column">
                      <div>
                        <span class="ant-table-column-title">{{ item.title }}</span>
                      </div>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody class="ant-table-tbody">
                <template v-for="item in orderList.data">
                  <tr class="order-empty" :key="`order_${item.order.order_id}_1`">
                    <td colspan="8"></td>
                  </tr>
                  <tr :key="`order_${item.order.order_id}_2`">
                    <td colspan="8">
                      <span class="mr-20">{{ item.order.create_time }}</span>
                      <span>订单号：{{ item.order.order_no }}</span>
                    </td>
                  </tr>
                  <tr
                    v-for="(goodsItm, goodsIdx) in item.order.goods"
                    :key="`orderGoods_${item.order.order_id}_${goodsIdx}`"
                  >
                    <td>
                      <GoodsItem
                        :data="{
                          image: goodsItm.goods_image,
                          imageAlt: '商品图片',
                          title: goodsItm.goods_name,
                          goodsProps: goodsItm.goods_props
                        }"
                      />
                    </td>
                    <td>
                      <p>￥{{ goodsItm.goods_price }}</p>
                      <p>×{{ goodsItm.total_num }}</p>
                    </td>
                    <template v-if="goodsIdx===0">
                      <td :rowspan="item.order.goods.length">
                        <p>￥{{ item.order.pay_price }}</p>
                        <p class="c-muted-1">(含运费：￥{{ item.order.express_price }})</p>
                      </td>
                      <td :rowspan="item.order.goods.length">
                        <UserItem v-if="item.order.user" :user="item.order.user" />
                      </td>
                      <td :rowspan="item.order.goods.length">
                        <a-tag v-if="item.pay_method">{{ PaymentMethodEnum[item.pay_method].name }}</a-tag>
                        <span v-else>--</span>
                      </td>
                      <td :rowspan="item.order.goods.length">
                        <p class="mtb-2">
                          <span class="f-13">付款状态：</span>
                          <a-tag
                            :color="item.order.pay_status == PayStatusEnum.SUCCESS.value ? 'green' : ''"
                          >{{ PayStatusEnum[item.order.pay_status].name }}</a-tag>
                        </p>
                        <p class="mtb-2">
                          <span class="f-13">发货状态：</span>
                          <a-tag
                            :color="item.order.delivery_status == DeliveryStatusEnum.DELIVERED.value ? 'green' : ''"
                          >{{ DeliveryStatusEnum[item.order.delivery_status].name }}</a-tag>
                        </p>
                        <p class="mtb-2">
                          <span class="f-13">收货状态：</span>
                          <a-tag
                            :color="item.order.receipt_status == ReceiptStatusEnum.RECEIVED.value ? 'green' : ''"
                          >{{ ReceiptStatusEnum[item.order.receipt_status].name }}</a-tag>
                        </p>
                        <p
                          v-if="[OrderStatusEnum.CANCELLED.value,OrderStatusEnum.APPLY_CANCEL.value].includes(item.order.order_status)"
                          class="mtb-2"
                        >
                          <span class="f-13">订单状态：</span>
                          <a-tag
                            :color="renderOrderStatusColor(item.order.order_status)"
                          >{{ OrderStatusEnum[item.order.order_status].name }}</a-tag>
                        </p>
                      </td>
                      <td :rowspan="item.order.goods.length">
                        <a-tag
                          :color="item.is_settled ? 'green' : ''"
                        >{{ item.is_settled ? '已结算' : '未结算' }}</a-tag>
                      </td>
                      <td :rowspan="item.order.goods.length">
                        <div class="actions">
                          <router-link
                            v-if="$auth('/order/detail')"
                            :to="{ path: '/order/detail', query: { orderId: item.order.order_id } }"
                            target="_blank"
                          >详情</router-link>
                        </div>
                      </td>
                    </template>
                  </tr>
                  <tr :key="`order_${item.order.order_id}_3`">
                    <td class="am-text-middle am-text-left" colspan="8">
                      <div class="order-dealer clearfix">
                        <div v-if="item.dealer_first" class="dealer-item">
                          <p>
                            <span class="am-text-right">一级分销商：</span>
                            <span>{{ item.dealer_first.user.nick_name }} (ID: {{ item.first_user_id }})</span>
                          </p>
                          <p>
                            <span class="am-text-right">分销佣金：</span>
                            <span class="c-red">￥{{ item.first_money }}</span>
                          </p>
                        </div>
                        <div v-if="item.dealer_second" class="dealer-item">
                          <p>
                            <span class="am-text-right">二级分销商：</span>
                            <span>{{ item.dealer_second.user.nick_name }} (ID: {{ item.second_user_id }})</span>
                          </p>
                          <p>
                            <span class="am-text-right">分销佣金：</span>
                            <span class="c-red">￥{{ item.second_money }}</span>
                          </p>
                        </div>
                        <div v-if="item.dealer_third" class="dealer-item">
                          <p>
                            <span class="am-text-right">三级分销商：</span>
                            <span>{{ item.dealer_third.user.nick_name }} (ID: {{ item.third_user_id }})</span>
                          </p>
                          <p>
                            <span class="am-text-right">分销佣金：</span>
                            <span class="c-red">￥{{ item.third_money }}</span>
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          <!-- 空状态 -->
          <a-empty v-if="!orderList.data.length" :image="simpleImage" />
        </div>
      </div>
      <!-- 分页器 -->
      <div v-if="orderList.data.length" class="pagination">
        <a-pagination
          :current="page"
          :pageSize="orderList.per_page"
          :total="orderList.total"
          @change="onChangePage"
        />
      </div>
    </a-spin>
  </a-card>
</template>

<script>
import { Empty } from 'ant-design-vue'
import { inArray, assignment } from '@/utils/util'
import { GoodsItem, UserItem } from '@/components/Table'
import {
  DeliveryStatusEnum,
  DeliveryTypeEnum,
  OrderStatusEnum,
  PayStatusEnum,
  ReceiptStatusEnum
} from '@/common/enum/order'
import { PaymentMethodEnum } from '@/common/enum/payment'
import * as Api from '@/api/dealer/order'

// 表格字段
const columns = [
  {
    title: '商品信息',
    align: 'center',
    dataIndex: 'goods',
    scopedSlots: { customRender: 'goods' }
  },
  {
    title: '单价/数量',
    align: 'center',
    scopedSlots: { customRender: 'unit_price' }
  },
  {
    title: '实付款',
    align: 'center',
    dataIndex: 'pay_price',
    scopedSlots: { customRender: 'pay_price' }
  },
  {
    title: '买家',
    dataIndex: 'user',
    scopedSlots: { customRender: 'user' }
  },
  {
    title: '支付方式',
    dataIndex: 'pay_method',
    scopedSlots: { customRender: 'pay_method' }
  },
  {
    title: '交易状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '分销佣金结算',
    dataIndex: 'delivery_type',
    scopedSlots: { customRender: 'delivery_type' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '180px',
    scopedSlots: { customRender: 'action' }
  }
]

// 搜索关键词类型枚举
const SearchTypeEnum = [
  { name: '订单号', value: 10 },
  { name: '分销商ID', value: 20 },
  { name: '会员ID', value: 30 }
]

export default {
  name: 'Index',
  components: {
    GoodsItem,
    UserItem,
  },
  data () {
    return {
      // 当前表单元素
      searchForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // 正在加载
      isLoading: false,
      // 表格字段
      columns,
      // 当前页码
      page: 1,
      // 列表数据
      orderList: { data: [], total: 0, per_page: 10 }
    }
  },
  beforeCreate () {
    // 批量给当前实例赋值
    assignment(this, {
      SearchTypeEnum,
      DeliveryStatusEnum,
      DeliveryTypeEnum,
      OrderStatusEnum,
      PayStatusEnum,
      ReceiptStatusEnum,
      PaymentMethodEnum,
      simpleImage: Empty.PRESENTED_IMAGE_SIMPLE
    })
  },
  created () {
    // 初始化页面
    this.init()
  },
  methods: {

    // 初始化页面
    init () {
      this.setFieldsValue()
      this.handleRefresh(true)
    },

    // 设置默认的搜索条件
    setFieldsValue () {
      const query = this.$route.query
      this.queryParam = {
        searchType: query.searchType ? Number(query.searchType) : 10,
        searchValue: query.searchValue ? query.searchValue : ''
      }
      this.$nextTick(() => {
        this.searchForm.setFieldsValue(this.queryParam)
      })
    },

    // 获取列表数据
    getList () {
      const { queryParam, page } = this
      this.isLoading = true
      return Api.list({ ...queryParam, page })
        .then(response => {
          this.orderList = response.data.list
        })
        .finally(() => this.isLoading = false)
    },

    // 渲染订单状态标签颜色
    renderOrderStatusColor (orderStatus) {
      const { OrderStatusEnum } = this
      const ColorEnum = {
        [OrderStatusEnum.NORMAL.value]: '',
        [OrderStatusEnum.CANCELLED.value]: 'red',
        [OrderStatusEnum.APPLY_CANCEL.value]: 'red',
        [OrderStatusEnum.COMPLETED.value]: 'green'
      }
      return ColorEnum[orderStatus]
    },

    /**
     * 刷新列表
     * @param Boolean bool 强制刷新到第一页
     */
    handleRefresh (bool = false) {
      bool && (this.page = 1)
      this.getList()
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

    // 重置搜索表单
    handleReset () {
      this.searchForm.resetFields()
    },

    // 翻页事件
    onChangePage (current) {
      this.page = current
      this.handleRefresh()
    }

  }
}
</script>

<style lang="less" scoped>
// 分页器
.pagination {
  margin-top: 16px;
  .ant-pagination {
    float: right;
  }
}

.ant-table {
  table {
    border: none;
    border-collapse: collapse;
  }
  .ant-table-thead > tr {
    border: 1px solid #e8e8e8;
  }
  tr.order-empty {
    height: 15px;
    border: 1px solid #fff;
    td {
      padding: 0;
      border-right: none;
      border-left: none;
      background: none !important;
    }
  }
}

.ant-table-thead > tr > th {
  border-right: none;
  border-bottom: none;
  padding: 12px 12px;
  font-weight: bold;
}
.ant-table-tbody > tr > td {
  border-right: 1px solid #e8e8e8;
  border-left: 1px solid #e8e8e8;
  padding: 12px 12px;
}

// 分销商信息
.order-dealer {
  .dealer-item {
    float: left;
    margin-right: 100px;
    font-size: @font-size-base;
    .am-text-right {
      display: inline-block;
      width: 80px;
      text-align: right;
    }
  }
}
</style>
