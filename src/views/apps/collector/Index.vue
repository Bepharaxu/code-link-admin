<template>
  <div class="container">
    <a-card class="mb-20" :bordered="false">
      <div class="card-title">{{ $route.meta.title }}</div>
      <a-alert class="mb-30" :showIcon="true" message="功能说明" banner>
        <template slot="description">
          <p>支持采集淘宝、天猫、京东、拼多多、1688平台的商品，需先进行API接口配置</p>
          <p>商品采集之前需要系统开启队列服务，可在超管后台中查看是否开启</p>
        </template>
      </a-alert>
      <a-form class="my-form" :form="myForm" @submit="handleSubmit">
        <a-form-item label="商品链接" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            v-decorator="['urls', { rules: [{ required: true, message: '请输入商品链接' }] }]"
            :auto-size="{ minRows: 6, maxRows: 12 }"
          />
          <div class="form-item-help">
            <small>请填写要采集的商品链接，请用回车换行间隔，每次最多100个；</small>
            <a-popover title="其他说明">
              <template slot="content">
                <p class="mb-5">1. 商品采集数据来源于第三方，采集完成后建议手动编辑价格、库存等敏感信息后再上架；</p>
                <p class="mb-5">2. 京东商品无法获取SKU的信息，默认写入主商品价格，所以务必手动编辑后再上架；</p>
                <p class="mb-5">3. 商品采集无法获取到商品重量，默认为1kg，请手动进行编辑，以免影响运费；</p>
              </template>
              <a href="javascript:;">其他说明</a>
            </a-popover>
          </div>
        </a-form-item>
        <a-form-item label="商品主图" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['imageStorage', { initialValue: 20, rules: [{ required: true }] }]"
          >
            <a-radio :value="10">下载到本地</a-radio>
            <a-radio :value="20">使用源图片url</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="商品类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['goods_type', { initialValue: 10, rules: [{ required: true }] }]"
          >
            <a-radio :value="10">实物商品</a-radio>
            <a-radio :value="20">虚拟商品</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="商品分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree-select
            placeholder="请选择商品分类"
            :dropdownStyle="{ maxHeight: '500px', overflow: 'auto' }"
            :treeData="categoryList"
            treeCheckable
            treeCheckStrictly
            allowClear
            v-decorator="['categorys', { rules: [{ required: true, message: '请至少选择1个商品分类' }] }]"
          ></a-tree-select>
        </a-form-item>
        <a-form-item
          v-if="myForm.getFieldValue('goods_type') == 10"
          label="运费模板"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            style="width: 300px"
            v-decorator="['delivery_id', { rules: [{ required: true, message: '请选择运费模板' }] }]"
            placeholder="请选择运费模板"
          >
            <a-select-option
              v-for="(item, index) in deliveryList"
              :key="index"
              :value="item.delivery_id"
            >{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="商品状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-radio-group
            v-decorator="['goods_status', { initialValue: 20, rules: [{ required: true }] }]"
          >
            <a-radio :value="10">上架</a-radio>
            <a-radio :value="20">下架</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: wrapperCol.span, offset: labelCol.span }">
          <a-button type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card :bordered="false">
      <div class="card-title">
        <span>商品采集记录</span>
        <div class="right-action">
          <a href="javascript:;" @click="handleRefreshCollectorList()">刷新</a>
        </div>
      </div>
      <CollectorList ref="CollectorList" />
    </a-card>
  </div>
</template>

<script>
import * as Api from '@/api/goods/collector'
import * as DeliveryApi from '@/api/setting/delivery'
import CategoryModel from '@/common/model/Category'
import { CollectorList } from './modules'

export default {
  name: 'Collector',
  components: {
    CollectorList
  },
  data () {
    return {
      // 当前表单元素
      myForm: this.$form.createForm(this),
      // 正在加载
      isLoading: false,
      isBtnLoading: false,
      // 标签布局属性
      labelCol: { span: 3 },
      // 输入框布局属性
      wrapperCol: { span: 12 },
      // 商品分类列表
      categoryList: [],
      // 获取运费模板列表
      deliveryList: []
    }
  },
  created () {
    // 获取商品分类列表
    this.getCategoryList()
    // 获取运费模板列表
    this.getDeliveryList()
  },
  methods: {

    // 获取分类列表
    getCategoryList () {
      CategoryModel.getCategoryTreeSelect().then(selectList => this.categoryList = selectList)
    },

    // 获取运费模板列表
    getDeliveryList () {
      DeliveryApi.all().then(result => this.deliveryList = result.data.list)
    },

    // 表单提交
    handleSubmit (e) {
      e.preventDefault()
      this.myForm.validateFields((error, values) => {
        if (!error) {
          // 整理商品分类ID集
          values.categoryIds = values.categorys.map(item => item.value)
          delete values.categorys
          // 提交到后端api
          this.onFormSubmit(values)
        }
      })
    },

    // 提交到后端api
    onFormSubmit (data) {
      const app = this
      app.isLoading = true
      app.isBtnLoading = true
      Api.batch(data)
        .then(result => {
          // 显示提示信息
          app.$message.success(result.message, 1.5)
          // 刷新采集记录
          app.handleRefreshCollectorList()
          // 重置表单
          app.myForm.resetFields()
        })
        .finally(result => {
          app.isLoading = false
          app.isBtnLoading = false
        })
    },

    // 刷新采集记录列表
    handleRefreshCollectorList () {
      this.$refs.CollectorList.handleRefresh()
    }

  }

}
</script>

<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 25px;
}
/deep/.ant-form-item-control {
  padding-left: 10px;

  .ant-form-item-control {
    padding-left: 0;
  }
}
</style>
