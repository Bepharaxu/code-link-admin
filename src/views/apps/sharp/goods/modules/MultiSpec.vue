<template>
  <div>
    <a-form-item
      v-show="multiSpecData.skuList.length"
      label="商品SKU"
      :labelCol="labelCol"
      :wrapperCol="wrapperCol"
      required
    >
      <!-- 批量设置 -->
      <div v-if="multiSpecData.skuList.length > 1" class="sku-batch">
        <span class="title">批量设置:</span>
        <a-input-number
          v-model="multiSpecData.skuBatchForm.seckill_price"
          placeholder="秒杀价格"
          :min="0.01"
          :precision="2"
        />
        <a-input-number
          v-model="multiSpecData.skuBatchForm.seckill_stock"
          placeholder="秒杀库存"
          :min="0"
          :precision="0"
        />
        <a-button @click="handleSkuBatch">立即设置</a-button>
      </div>
      <!-- sku列表table -->
      <a-table
        class="sku-list"
        :columns="multiSpecData.skuColumns"
        :dataSource="multiSpecData.skuList"
        :scroll="{ x: true }"
        :pagination="false"
        bordered
      >
        <!-- TODO 商品价格 -->
        <!-- <template slot="goods_price" slot-scope="text, item">
          <a-input-number v-model="item.goods_price" size="small" :min="0.01" :precision="2" />
        </template>-->

        <!-- 商品SKU编码 -->
        <template slot="goods_sku_no" slot-scope="text">
          <span>{{ text ? text : '--' }}</span>
        </template>
        <!-- 秒杀价格 -->
        <template slot="seckill_price" slot-scope="text, item">
          <a-input-number v-model="item.seckill_price" size="small" :min="0.01" :precision="2" />
        </template>
        <!-- 秒杀库存数量 -->
        <template slot="seckill_stock" slot-scope="text, item">
          <a-input-number v-model="item.seckill_stock" size="small" :min="0" :precision="0" />
        </template>
      </a-table>
    </a-form-item>
  </div>
</template>

<script>
import PropTypes from 'ant-design-vue/es/_util/vue-types'
import MultiSpecModel from '@/common/model/sharp/goods/MultiSpec'

export default {
  props: {
    // 默认的规格列表
    defaultSpecList: PropTypes.array.def([]),
    // 默认的SKU列表
    defaultSkuList: PropTypes.array.def([])
  },
  data () {
    return {
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 21 },
      // 商品多规格模型
      MultiSpecModel: new MultiSpecModel(),
      // MultiSpecModel: Object,
      multiSpecData: {
        // 规格列表
        specList: [],
        // SKU列表
        skuList: []
      }
    }
  },
  watch: {
    defaultSpecList (val) {
      if (val.length && this.MultiSpecModel.isEmpty()) {
        this.getData()
      }
    }
  },
  // 初始化数据
  created () {
    // 获取规格及SKU信息
    this.getData()
  },
  methods: {

    // 获取规格及SKU信息(展示)
    getData () {
      const { defaultSpecList, defaultSkuList } = this
      this.multiSpecData = this.MultiSpecModel.getData(defaultSpecList, defaultSkuList)
    },

    // 获取规格及SKU信息(表单提交)
    getFromSpecData () {
      return this.MultiSpecModel.getFromSpecData()
    },

    // 批量设置sku事件
    handleSkuBatch () {
      this.MultiSpecModel.handleSkuBatch()
    },

    // 验证多规格表单
    verifyForm () {
      if (!this.MultiSpecModel.verifyForm()) {
        this.$message.error(this.MultiSpecModel.getError(), 2)
        return false
      }
      return true
    }

  }
}

</script>
<style lang="less" scoped>
// 批量设置sku
.sku-batch {
  line-height: 40px;
  margin-bottom: 12px;
  .title {
    line-height: 28px;
    margin-right: 15px;
    font-size: @font-size-base;
  }
  /deep/.ant-input,
  /deep/.ant-input-number {
    width: 120px;
    margin-right: 15px;
  }
  /deep/.ant-input {
    width: 140px;
  }
}

// sku列表
.sku-list {
  width: 895px;
  /deep/.ant-table-thead > tr > th,
  /deep/.ant-table-tbody > tr > td {
    white-space: nowrap;
  }
  /deep/.ant-table-tbody > tr > td {
    padding: 12px 18px;
  }

  /deep/.ant-input-sm,
  /deep/.ant-input-number-sm {
    height: 28px;
  }
  /deep/.ant-input-number-sm input {
    height: 26px;
  }
}
</style>
