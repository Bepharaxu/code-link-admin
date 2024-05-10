<template>
  <a-modal
    :title="title"
    :width="520"
    :visible="visible"
    :isLoading="isLoading"
    :confirmLoading="isLoading"
    :maskClosable="false"
    okText="打印"
    @ok="handleOK"
    @cancel="handleCancel"
  >
    <a-spin :spinning="isLoading">
      <div class="eorder-content" v-html="eorderContent">s</div>
    </a-spin>
  </a-modal>
</template>

<script>
import * as Api from '@/api/order/delivery'
import { getLodop } from './lodopFuncs'

export default {
  components: {},
  data () {
    return {
      // 对话框标题
      title: '查看电子面单',
      // 标签布局属性
      labelCol: { span: 7 },
      // 输入框布局属性
      wrapperCol: { span: 13 },
      // modal(对话框)是否可见
      visible: false,
      // modal(对话框)确定按钮 loading
      isLoading: false,
      // 打印控件CLodop
      LODOP: undefined,
      // 当前记录
      record: {},
      // 电子面单内容
      eorderContent: ''
    }
  },
  methods: {

    // 显示对话框
    handle (record) {
      // 显示窗口
      this.visible = true
      // 当前记录
      this.record = record
      // 获取发货单详情
      this.getDetail()
    },

    // 获取发货单详情
    getDetail () {
      this.isLoading = true
      Api.detail(this.record.delivery_id)
        .then(result => this.eorderContent = result.data.detail.eorder_html)
        .finally(() => this.isLoading = false)
    },

    // 确认按钮
    handleOK (e) {
      if (!this.eorderContent) {
        this.$message.error('很抱歉，没有电子面单内容', 1.2)
        return
      }
      if (getLodop()) {
        // 执行打印
        this.printEOrder(this.eorderContent)
      }
    },

    // 关闭对话框事件
    handleCancel () {
      this.visible = false
      this.eorderContent = ''
    },

    // 调用打印控件
    printEOrder (template) {
      LODOP.PRINT_INIT()
      LODOP.SET_PRINT_PAGESIZE(0)

      LODOP.NewPageA()
      LODOP.ADD_PRINT_HTML(0, 0, '100%', '100%', template)

      // LODOP.NewPageA()
      // LODOP.ADD_PRINT_HTML(0, 0, "100%", "100%", template)

      LODOP.SET_PRINT_MODE('AUTO_CLOSE_PREWINDOW', true)
      LODOP.SET_PRINT_MODE('CATCH_PRINT_STATUS', true)
      LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Auto-Width')
      LODOP.SET_SHOW_MODE('HIDE_PAGE_PERCENT', true)
      LODOP.PREVIEW()
    }

  }
}
</script>
<style lang="less" scoped>
/deep/.ant-modal-header {
  border-bottom: none;
}
/deep/.ant-modal-footer {
  border-top: none;
}
/deep/.ant-modal-body {
  padding: 0px 24px;
}
/deep/.ant-tabs-bar {
  margin-bottom: 22px;
}
.ant-table-wrapper {
  margin-bottom: 40px;
}
.eorder-content {
  margin: 10px auto;
  width: 460px;
  min-height: 580px;
  position: relative;
}
</style>
