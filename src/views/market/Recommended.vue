<template>
  <a-card :bordered="false">
    <div class="card-title">{{ $route.meta.title }}</div>
    <a-spin :spinning="isLoading">
      <a-form-model ref="myForm" class="my-form" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-model-item label="开启商品推荐" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <a-radio-group v-model="record.enabled">
            <a-radio :value="1">开启</a-radio>
            <a-radio :value="0">关闭</a-radio>
          </a-radio-group>
          <p class="form-item-help">
            <small>开启后将在用户端购物车页底部、个人中心页底部显示推荐的商品列表</small>
          </p>
        </a-form-model-item>

        <a-form-model-item label="商品来源" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <a-radio-group v-model="record.params.source">
            <a-radio value="auto">自动获取</a-radio>
            <a-radio value="choice">手动选择</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <div v-show="record.params.source === 'auto'">
          <a-form-model-item label="商品分类" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
            <SelectCategory v-model="record.params.auto.category" />
          </a-form-model-item>

          <a-form-model-item label="商品排序" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
            <a-radio-group v-model="record.params.auto.goodsSort">
              <a-radio value="all">默认</a-radio>
              <a-radio value="sales">销量</a-radio>
              <a-radio value="price">价格</a-radio>
            </a-radio-group>
          </a-form-model-item>

          <a-form-model-item label="显示数量" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
            <a-input-number
              v-model="record.params.auto.showNum"
              :min="0"
              :max="50"
              autocomplete="off"
            />
            <span class="ml-10">件</span>
          </a-form-model-item>
        </div>

        <div v-show="record.params.source === 'choice'">
          <a-form-model-item label="选择的商品" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
            <SelectGoods :defaultList="choiceGoodsList" v-model="record.params.goodsIds" />
          </a-form-model-item>
        </div>

        <a-divider orientation="left">样式设置</a-divider>
        <a-form-model-item label="标题内容" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <a-input v-model="record.style.title" />
          <div class="form-item-help">
            <small>例如：商品推荐、精选好物、为你推荐</small>
          </div>
        </a-form-model-item>

        <a-form-model-item label="商品分列" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <a-radio-group v-model="record.style.column">
            <a-radio :value="1">单列</a-radio>
            <a-radio :value="2">两列</a-radio>
            <a-radio :value="3">三列</a-radio>
          </a-radio-group>
        </a-form-model-item>

        <a-form-model-item label="商品内容" :labelCol="labelCol" :wrapperCol="wrapperCol" required>
          <a-checkbox-group v-model="record.style.show">
            <a-checkbox value="goodsName">商品名称</a-checkbox>
            <a-checkbox value="goodsPrice">商品价格</a-checkbox>
            <a-checkbox value="linePrice">划线价格</a-checkbox>
            <a-checkbox v-show="record.style.column === 1" value="sellingPoint">商品卖点</a-checkbox>
            <a-checkbox v-show="record.style.column === 1" value="goodsSales">商品销量</a-checkbox>
          </a-checkbox-group>
        </a-form-model-item>

        <a-form-model-item :wrapperCol="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" :loading="confirmLoading" @click="handleSubmit">保存</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-card>
</template>

<script>
import { cloneDeep } from 'lodash'
import * as Api from '@/api/setting/store'
import * as GoodsApi from '@/api/goods'
import { SelectGoods, SelectCategory } from '@/components'
import { SettingEnum } from '@/common/enum/store'

// 默认数据
const defaultData = {
  enabled: 1,
  params: {
    source: 'auto',
    auto: {
      category: 0,
      goodsSort: 'all',
      showNum: 6,
    },
    goodsIds: []
  },
  style: {
    title: '',
    // background: '#F6F6F6',
    // display: 'list',
    column: 2,
    show: ['goodsName', 'goodsPrice', 'linePrice', 'sellingPoint', 'goodsSales']
  }
}

export default {
  components: {
    SelectGoods,
    SelectCategory
  },
  data () {
    return {
      // 当前设置项的key
      key: SettingEnum.RECOMMENDED.value,
      // 标签布局属性
      labelCol: { span: 4 },
      // 输入框布局属性
      wrapperCol: { span: 12 },
      // 加载状态
      isLoading: false,
      confirmLoading: false,
      // 当前记录详情
      record: cloneDeep(defaultData),
      // 手动选择的商品列表
      choiceGoodsList: []
    }
  },
  // 初始化数据
  async created () {
    // 获取当前详情记录
    await this.getDetail()
    // 获取手动选择的商品列表
    await this.getChoiceGoodsList()
  },
  methods: {

    // 获取当前详情记录
    async getDetail () {
      this.isLoading = true
      await Api.detail(this.key)
        .then(result => this.record = result.data.values)
        .finally(() => this.isLoading = false)
    },

    // 获取手动选择的商品列表
    async getChoiceGoodsList () {
      const goodsIds = this.record.params.goodsIds
      if (goodsIds.length > 0) {
        this.isLoading = true
        await GoodsApi.listByIds(goodsIds)
          .then(result => this.choiceGoodsList = result.data.list)
          .finally(() => this.isLoading = false)
      }
    },

    // 确认按钮
    handleSubmit (e) {
      this.confirmLoading = true
      Api.update(this.key, { form: this.record })
        .then(result => this.$message.success(result.message, 1.5))
        .finally(result => this.confirmLoading = false)
    },

  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  .ant-form-item {
    margin-bottom: 0;
  }
}

/deep/.ant-form-item-control {
  padding-left: 10px;
  .ant-form-item-control {
    padding-left: 0;
  }
}
</style>
