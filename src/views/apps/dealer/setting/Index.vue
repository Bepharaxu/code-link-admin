<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form-model
        v-if="!isLoading"
        ref="myForm"
        class="my-form"
        :label-col="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-tabs :activeKey="tabKey" :tabBarStyle="{ marginBottom: '30px' }" @change="handleTabs">
          <a-tab-pane :key="0" tab="基础设置"></a-tab-pane>
          <a-tab-pane :key="1" tab="分销商条件"></a-tab-pane>
          <a-tab-pane :key="2" tab="佣金设置"></a-tab-pane>
          <a-tab-pane :key="3" tab="结算"></a-tab-pane>
          <a-tab-pane :key="4" tab="自定义文字"></a-tab-pane>
          <a-tab-pane :key="5" tab="申请协议"></a-tab-pane>
          <a-tab-pane :key="6" tab="页面背景图"></a-tab-pane>
        </a-tabs>
        <div class="tabs-content">
          <!-- 基本信息 -->
          <div class="tab-pane" v-show="tabKey == 0">
            <a-form-model-item label="是否开启分销功能" required>
              <a-radio-group v-model="setting.basic.is_open">
                <a-radio :value="1">开启</a-radio>
                <a-radio :value="0">关闭</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="分销层级" required>
              <a-radio-group v-model="setting.basic.level">
                <a-radio :value="1">一级</a-radio>
                <a-radio :value="2">二级</a-radio>
                <a-radio :value="3">三级</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="分销商内购" required>
              <a-radio-group v-model="setting.basic.self_buy">
                <a-radio :value="1">开启</a-radio>
                <a-radio :value="0">关闭</a-radio>
              </a-radio-group>
              <div class="form-item-help">
                <small>注：分销商自己购买商品，获得一级佣金，上级获得二级佣金</small>
              </div>
            </a-form-model-item>
          </div>
          <!-- 分销商条件 -->
          <div class="tab-pane" v-show="tabKey == 1">
            <a-form-model-item label="成为分销商条件" required>
              <a-radio-group v-model="setting.condition.become">
                <a-radio :value="10">需后台审核</a-radio>
                <a-radio :value="20">无需审核</a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="购买指定商品成为分销商" required>
              <a-radio-group v-model="setting.condition.becomeBuyGoods">
                <a-radio :value="0">关闭</a-radio>
                <a-radio :value="1">开启</a-radio>
              </a-radio-group>
              <div class="form-item-help">
                <small>注：购买指定商品付款后自动成为分销商，无需后台审核</small>
              </div>
              <div v-if="setting.condition.becomeBuyGoods" class="mt-20">
                <SelectGoods
                  :defaultList="becomeBuyGoodsList"
                  v-model="setting.condition.becomeBuyGoodsIds"
                />
              </div>
            </a-form-model-item>
          </div>

          <!-- 佣金设置 -->
          <div class="tab-pane" v-show="tabKey == 2">
            <a-form-model-item label="一级佣金比例 " required>
              <a-input-number
                v-model="setting.commission.first_money"
                :min="0"
                :max="100"
                :precision="0"
              />
              <span class="ml-10">%</span>
              <div class="form-item-help">
                <small>注：佣金比例范围 0% - 100%</small>
              </div>
            </a-form-model-item>
            <a-form-model-item label="二级佣金比例 " required>
              <a-input-number
                v-model="setting.commission.second_money"
                :min="0"
                :max="100"
                :precision="0"
              />
              <span class="ml-10">%</span>
              <div class="form-item-help">
                <small>注：佣金比例范围 0% - 100%</small>
              </div>
            </a-form-model-item>
            <a-form-model-item label="三级佣金比例 " required>
              <a-input-number
                v-model="setting.commission.third_money"
                :min="0"
                :max="100"
                :precision="0"
              />
              <span class="ml-10">%</span>
              <div class="form-item-help">
                <small>注：佣金比例范围 0% - 100%</small>
              </div>
            </a-form-model-item>
          </div>

          <!-- 结算设置 -->
          <div class="tab-pane" v-show="tabKey == 3">
            <a-form-model-item label="提现方式" required>
              <a-checkbox-group v-model="setting.settlement.pay_type">
                <a-checkbox :value="30">银行卡支付</a-checkbox>
                <a-checkbox :value="20">支付宝支付</a-checkbox>
                <a-checkbox :value="10">微信支付 [商家转账到零钱]</a-checkbox>
              </a-checkbox-group>
              <div class="form-item-help">
                <p class="extra">如使用支付宝支付或银行卡支付需要线下手动打款</p>
                <p class="extra">如使用微信支付，则需申请微信支付商家转账到零钱功能</p>
                <p class="extra">如使用微信支付，分销商必须在微信小程序端申请提现</p>
              </div>
            </a-form-model-item>
            <a-form-model-item label="最低提现额度 " required>
              <a-input-number v-model="setting.settlement.min_money" :min="0" :precision="2" />
              <span class="ml-10">元</span>
              <div class="form-item-help">
                <p class="extra">如使用微信支付 [商家转账到零钱]，则打款额度必须大于0.30元</p>
              </div>
            </a-form-model-item>
            <a-form-model-item label="佣金结算周期 " required>
              <a-input-number v-model="setting.settlement.settle_days" :min="0" :precision="0" />
              <span class="ml-10">天</span>
              <div class="form-item-help">
                <small>佣金结算规则：用户下单付款 -> 订单完成确认收货 -> 超出售后期限 -> 结算佣金</small>
              </div>
            </a-form-model-item>
          </div>

          <!-- 自定义文字 -->
          <div class="tab-pane" v-show="tabKey == 4">
            <a-divider orientation="left">分销中心页面</a-divider>
            <a-form-model-item label="页面标题" required>
              <a-input v-model="setting.words.index.title.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="非分销商提示" required>
              <a-input v-model="setting.words.index.words.not_dealer.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="申请成为分销商" required>
              <a-input v-model="setting.words.index.words.apply_now.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="推荐人" required>
              <a-input v-model="setting.words.index.words.referee.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="可提现佣金" required>
              <a-input v-model="setting.words.index.words.money.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="待提现佣金" required>
              <a-input v-model="setting.words.index.words.freeze_money.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="已提现金额" required>
              <a-input v-model="setting.words.index.words.total_money.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="去提现" required>
              <a-input v-model="setting.words.index.words.withdraw.value" autocomplete="off" />
            </a-form-model-item>

            <a-divider orientation="left">申请成为分销商页面</a-divider>
            <a-form-model-item label="页面标题" required>
              <a-input v-model="setting.words.apply.title.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="请填写申请信息" required>
              <a-input v-model="setting.words.apply.words.title.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="分销商申请协议" required>
              <a-input v-model="setting.words.apply.words.license.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="申请成为经销商" required>
              <a-input v-model="setting.words.apply.words.submit.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="审核中提示信息" required>
              <a-input v-model="setting.words.apply.words.wait_audit.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="去商城逛逛" required>
              <a-input v-model="setting.words.apply.words.goto_mall.value" autocomplete="off" />
            </a-form-model-item>

            <a-divider orientation="left">分销订单页面</a-divider>
            <a-form-model-item label="页面标题" required>
              <a-input v-model="setting.words.order.title.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="全部" required>
              <a-input v-model="setting.words.order.words.all.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="未结算" required>
              <a-input v-model="setting.words.order.words.unsettled.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="已结算" required>
              <a-input v-model="setting.words.order.words.settled.value" autocomplete="off" />
            </a-form-model-item>

            <a-divider orientation="left">我的团队页面</a-divider>
            <a-form-model-item label="页面标题" required>
              <a-input v-model="setting.words.team.title.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="团队总人数" required>
              <a-input v-model="setting.words.team.words.total_team.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="一级团队" required>
              <a-input v-model="setting.words.team.words.first.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="二级团队" required>
              <a-input v-model="setting.words.team.words.second.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="三级团队" required>
              <a-input v-model="setting.words.team.words.third.value" autocomplete="off" />
            </a-form-model-item>

            <a-divider orientation="left">提现明细页面</a-divider>
            <a-form-model-item label="页面标题" required>
              <a-input v-model="setting.words.withdraw_list.title.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="全部" required>
              <a-input v-model="setting.words.withdraw_list.words.all.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="审核中" required>
              <a-input
                v-model="setting.words.withdraw_list.words.apply_10.value"
                autocomplete="off"
              />
            </a-form-model-item>
            <a-form-model-item label="审核通过" required>
              <a-input
                v-model="setting.words.withdraw_list.words.apply_20.value"
                autocomplete="off"
              />
            </a-form-model-item>
            <a-form-model-item label="驳回" required>
              <a-input
                v-model="setting.words.withdraw_list.words.apply_30.value"
                autocomplete="off"
              />
            </a-form-model-item>
            <a-form-model-item label="已打款" required>
              <a-input
                v-model="setting.words.withdraw_list.words.apply_40.value"
                autocomplete="off"
              />
            </a-form-model-item>

            <a-divider orientation="left">申请提现页面</a-divider>
            <a-form-model-item label="页面标题" required>
              <a-input v-model="setting.words.withdraw_apply.title.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="可提现佣金" required>
              <a-input
                v-model="setting.words.withdraw_apply.words.capital.value"
                autocomplete="off"
              />
            </a-form-model-item>
            <a-form-model-item label="提现金额" required>
              <a-input v-model="setting.words.withdraw_apply.words.money.value" autocomplete="off" />
            </a-form-model-item>
            <a-form-model-item label="请输入要提取的金额" required>
              <a-input
                v-model="setting.words.withdraw_apply.words.money_placeholder.value"
                autocomplete="off"
              />
            </a-form-model-item>
            <a-form-model-item label="最低提现佣金" required>
              <a-input
                v-model="setting.words.withdraw_apply.words.min_money.value"
                autocomplete="off"
              />
            </a-form-model-item>
            <a-form-model-item label="提交申请" required>
              <a-input
                v-model="setting.words.withdraw_apply.words.submit.value"
                autocomplete="off"
              />
            </a-form-model-item>

            <a-divider orientation="left">推广二维码</a-divider>
            <a-form-model-item label="页面标题" required>
              <a-input v-model="setting.words.poster.title.value" autocomplete="off" />
            </a-form-model-item>
          </div>

          <!-- 申请协议 -->
          <div class="tab-pane" v-show="tabKey == 5">
            <a-form-model-item label="分销商申请协议" required>
              <a-textarea
                v-model="setting.license.license"
                :auto-size="{ minRows: 6, maxRows: 12 }"
              />
            </a-form-model-item>
          </div>

          <!-- 页面背景图 -->
          <div class="tab-pane" v-show="tabKey == 6">
            <a-form-model-item label="分销中心首页" required>
              <SelectImage2
                v-model="setting.background.index"
                class="mb-10"
                :width="375"
                :height="100"
                tips="建议尺寸：宽750 高度200"
              />
              <div class="form-item-help">
                <p class="extra">尺寸：宽750像素 高度不限</p>
              </div>
            </a-form-model-item>
            <a-form-model-item label="申请成为分销商页" required>
              <SelectImage2
                class="mb-10"
                v-model="setting.background.apply"
                :width="375"
                :height="100"
                tips="建议尺寸：宽750 高度200"
              />
              <div class="form-item-help">
                <p class="extra">尺寸：宽750像素 高度不限</p>
              </div>
            </a-form-model-item>
            <a-form-model-item label="申请提现页" required>
              <SelectImage2
                v-model="setting.background.withdraw_apply"
                class="mb-10"
                :width="375"
                :height="100"
                tips="建议尺寸：宽750 高度200"
              />
              <div class="form-item-help">
                <p class="extra">尺寸：宽750像素 高度不限</p>
              </div>
            </a-form-model-item>
          </div>

          <a-form-model-item class="mt-30" :wrapperCol="{ offset: 5 }">
            <a-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</a-button>
          </a-form-model-item>
        </div>
      </a-form-model>
    </a-spin>
  </a-card>
</template>

<script>
import pick from 'lodash.pick'
import * as Api from '@/api/dealer/setting'
import * as GoodsApi from '@/api/goods'
import { SelectGoods, SelectImage2 } from '@/components'

export default {
  components: {
    SelectGoods,
    SelectImage2
  },
  data () {
    return {
      // 默认的标签索引
      tabKey: 0,
      // 标签布局属性
      labelCol: { span: 5 },
      // 输入框布局属性
      wrapperCol: { span: 10 },
      // loading状态
      isLoading: false,
      confirmLoading: false,
      // 当前记录详情
      setting: {},
      // 购买指定商品的列表
      becomeBuyGoodsList: []
    }
  },
  // 初始化数据
  async created () {
    // 获取当前详情记录
    await this.getDetail()
    // 获取不参与包邮的商品列表
    await this.getBecomeBuyGoodsList()
  },
  methods: {

    // 切换tab选项卡
    handleTabs (key) {
      this.tabKey = key
    },

    // 获取当前详情记录
    async getDetail () {
      this.isLoading = true
      await Api.all()
        .then(result => {
          // 当前记录
          this.setting = result.data.setting
        })
        .finally(() => this.isLoading = false)
    },

    // 获取购买指定商品的列表
    async getBecomeBuyGoodsList () {
      const becomeBuyGoodsIds = this.setting.condition.becomeBuyGoodsIds
      if (becomeBuyGoodsIds.length > 0) {
        this.isLoading = true
        await GoodsApi.listByIds(becomeBuyGoodsIds)
          .then(result => {
            this.becomeBuyGoodsList = result.data.list
          })
          .finally(result => {
            this.isLoading = false
          })
      }
    },

    // 表单提交
    handleSubmit (e) {
      e.preventDefault()
      this.confirmLoading = true
      Api.update({ form: this.setting })
        .then(result => {
          // 显示成功
          this.$message.success(result.message, 1.5)
        })
        .finally(() => this.confirmLoading = false)
    },

    // 提交到后端api
    onFormSubmit (values) {
      this.isLoading = true
      Api.update({ form: values })
        .then(result => this.$message.success(result.message, 1.5))
        .finally(() => this.isLoading = false)
    }

  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 15px;
}
/deep/.ant-form-item-control {
  padding-left: 10px;

  .ant-form-item-control {
    padding-left: 0;
  }
}
.ant-divider {
  margin-top: 60px !important;
  &::before {
    width: 10%;
  }
  &.first {
    margin-top: 10px !important;
  }
}
</style>
