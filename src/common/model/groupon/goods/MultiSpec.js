import _ from 'lodash'
import { debounce, isEmpty } from '@/utils/util'
import { ActiveTypeEnum } from '@/common/enum/groupon'

// 默认的SKU字段属性
const defaultColumns = [
  {
    title: 'SKU编码',
    dataIndex: 'goods_sku_no',
    scopedSlots: { customRender: 'goods_sku_no' }
  },
  {
    title: '商品原价（元）',
    dataIndex: 'goods_price',
    scopedSlots: { customRender: 'goods_price' }
  },
  {
    title: '商品库存',
    dataIndex: 'stock_num',
    scopedSlots: { customRender: 'stock_num' }
  }
  // {
  //   title: '拼团价格（元）',
  //   dataIndex: 'groupon_price',
  //   scopedSlots: { customRender: 'groupon_price' }
  // },
]

// 默认的sku记录值
const defaultSkuItemData = {
  goods_sku_id: '',
  goods_sku_no: '',
  goods_price: '',
  stock_num: '',
  groupon_price: '',
  steps_price_config: []
}

/**
 * 商品 model类
 * GoodsModel
 */
export default class MultiSpec {
  // 当前vue实例
  app = undefined

  // 拼团类型
  activeType = undefined

  // 阶梯价格
  stepsConfig = []

  // 商品多规格数据
  multiSpecData = {}

  // 错误信息
  error = '';

  /**
   * 构造方法
   * @param {array} specList 规格列表
   * @param {array} skuList SKU列表
   */
  constructor (app) {
    this.app = app
    this.multiSpecData = {
      // 规格列表
      specList: [],
      // SKU列表
      skuList: [],
      // SKU字段
      skuColumns: _.cloneDeep(defaultColumns),
      // 批量设置sku
      skuBatchForm: _.cloneDeep(defaultSkuItemData)
    }
  }

  // 生成并获取多规格数据
  getData (specList = [], skuList = [], activeType, stepsConfig) {
    if (specList.length) {
      this.multiSpecData.specList = _.cloneDeep(specList)
      this.multiSpecData.skuList = _.cloneDeep(skuList)
      this.activeType = activeType
      this.stepsConfig = stepsConfig
    }
    // 整理所有的规格组
    const specGroupArr = this.specGroupArr()
    // sku记录的规格属性集(生成笛卡尔积)
    const cartesianList = cartesianProductOf(specGroupArr)
    // 合并单元格
    const rowSpanArr = this.rowSpanArr(specGroupArr, cartesianList)
    // 生成sku字段名
    this.buildSkuColumns(rowSpanArr)
    // 生成sku列表数据
    this.buildSkuList(cartesianList)
    // 返回多规格数据
    return this.multiSpecData
  }

  // 数据是否为空
  isEmpty () {
    return this.multiSpecData.specList.length === 0
  }

  // 返回错误信息
  getError () {
    return this.error
  }

  // 整理所有的规格
  specGroupArr () {
    const specGroupArr = []
    this.multiSpecData.specList.forEach(specGroup => {
      const itemArr = []
      specGroup.valueList.forEach(value => {
        itemArr.push(value)
      })
      specGroupArr.push(itemArr)
    })
    return specGroupArr
  }

  // 合并单元格
  rowSpanArr (specGroupArr, cartesianList) {
    const rowSpanArr = []
    var rowSpan = cartesianList.length
    for (let i = 0; i < specGroupArr.length; i++) {
      rowSpanArr[i] = parseInt(rowSpan / specGroupArr[i].length)
      rowSpan = rowSpanArr[i]
    }
    return rowSpanArr
  }

  // 生成skuList
  buildSkuList (cartesianList) {
    // 生成新的skuList
    const newSkuList = []
    for (let i = 0; i < cartesianList.length; i++) {
      const newSkuItem = {
        ...defaultSkuItemData,
        key: i,
        // skuKey用于合并旧记录
        skuKey: cartesianList[i].map(item => item.key).join('_'),
        // skuKeys用于传参给后端
        skuKeys: cartesianList[i].map(item => {
          return {
            groupKey: item.groupKey,
            valueKey: item.key
          }
        })
      }
      cartesianList[i].forEach((val, idx) => {
        newSkuItem[`spec_value_${idx}`] = val.spec_value
      })
      newSkuItem.steps_price_config = []
      this.stepsConfig.forEach((val, idx) => {
        newSkuItem[`groupon_price_${idx}`] = undefined
        newSkuItem.steps_price_config.push(undefined)
      })
      newSkuList.push(newSkuItem)
    }
    // 兼容旧的sku数据
    this.multiSpecData.skuList = this.oldSkuList(newSkuList)
  }

  // 合并已存在的sku数据
  oldSkuList (newSkuList) {
    // const oldSkuList = _.cloneDeep(this.multiSpecData.skuList)
    const oldSkuList = this.multiSpecData.skuList.concat()
    if (!oldSkuList.length || !newSkuList.length) {
      return newSkuList
    }
    for (const index in newSkuList) {
      // 查找符合的旧记录
      let oldSkuItem = {}
      if (oldSkuList.length === newSkuList.length) {
        oldSkuItem = _.cloneDeep(oldSkuList[index])
      } else {
        oldSkuItem = oldSkuList.find(item => {
          return item.skuKey === newSkuList[index].skuKey
        })
      }
      // 写入新纪录
      if (oldSkuItem) {
        newSkuList[index] = this.mergeOldSkuItem(newSkuList[index], oldSkuItem)
      }
    }
    return newSkuList
  }

  // 整理SKU旧记录
  mergeOldSkuItem (newSkuItem, oldSkuItem) {
    const { stepsConfig } = this
    // 默认存在的字段
    const defaultKeys = Object.keys(defaultSkuItemData)
    stepsConfig.forEach((val, idx) => {
      defaultKeys.push(`groupon_price_${idx}`)
      defaultKeys.push(`steps_price_config`)
    })
    // 提取SKU旧记录
    const oldData = _.pick(oldSkuItem, defaultKeys)
    // 根据steps_price_config补充idx，用于首次加载后端api数据 （后端传参没有groupon_price_${idx}）
    if (oldData.steps_price_config && oldData.steps_price_config.length) {
      oldData.steps_price_config.forEach((val, idx) => {
        if (!oldData[`groupon_price_${idx}`]) {
          oldData[`groupon_price_${idx}`] = val
        }
      })
    }
    // 根据groupon_price_${idx}补充steps_price_config，用于批量设置阶梯价格
    oldData.steps_price_config = []
    stepsConfig.forEach((val, idx) => {
      if (oldData.hasOwnProperty(`groupon_price_${idx}`)) {
        oldData.steps_price_config.push(oldData[`groupon_price_${idx}`])
      }
    })
    return { ...newSkuItem, ...oldData }
  }

  // 生成sku表格字段名
  buildSkuColumns (rowSpanArr) {
    const specList = this.multiSpecData.specList
    const newColumns = this.getDefaultColumns()
    // 渲染字段的rowSpan
    const customRender = (specIndex, value, row, index) => {
      const obj = {
        children: value,
        attrs: {}
      }
      const rowSpan = rowSpanArr[specIndex - 1]
      if ((index % rowSpan) === 0) {
        obj.attrs.rowSpan = rowSpan
      } else {
        obj.attrs.rowSpan = 0
      }
      return obj
    }
    // 遍历规格组整理字段
    for (let specIndex = specList.length; specIndex > 0; specIndex--) {
      const specGroupItem = specList[specIndex - 1]
      newColumns.unshift({
        title: specGroupItem.spec_name,
        dataIndex: `spec_value_${specIndex - 1}`,
        customRender: (value, row, index) => customRender(specIndex, value, row, index)
      })
    }
    this.multiSpecData.skuColumns = newColumns
  }

  // 获取默认的SKU字段
  getDefaultColumns () {
    const self = this
    const newColumns = _.cloneDeep(defaultColumns)
    // 拼团价格
    if (self.activeType != ActiveTypeEnum.STEPS.value) {
      newColumns.push({
        title: '拼团价格（元）',
        dataIndex: 'groupon_price',
        scopedSlots: { customRender: 'groupon_price' }
      })
    }
    // 阶梯拼团的字段
    if (self.activeType == ActiveTypeEnum.STEPS.value) {
      self.stepsConfig.forEach((val, index) => {
        const field = `groupon_price_${index}`
        newColumns.push({
          title: `${val}人拼团价格（元）`,
          dataIndex: field,
          width: 150,
          customRender (value, row) {
            return self.app.$createElement('div', {
              class: { 'has-error': isEmpty(row[field]) && row[field] !== undefined }
            }, [
              self.app.$createElement('a-input-number', {
                props: { value: row[field], min: 0.01, precision: 2 },
                on: {
                  change (args) {
                    row[field] = args
                    row.steps_price_config[index] = args
                  }
                }
              })
            ])
          }
        })
      })
    }
    return newColumns
  }

  // 添加规格组
  handleAddSpecGroup () {
    const specList = this.multiSpecData.specList
    specList.push({
      key: specList.length || 0,
      spec_name: '',
      valueList: []
    })
    // 默认规格值
    const groupIndex = specList.length - 1
    this.handleAddSpecValue(groupIndex)
  }

  // 添加规格值
  handleAddSpecValue (groupIndex) {
    const specGroupItem = this.multiSpecData.specList[groupIndex]
    const specValueList = specGroupItem.valueList
    specValueList.push({
      key: specValueList.length || 0,
      groupKey: specGroupItem.key,
      spec_value: ''
    })
  }

  // 删除规格组
  handleDeleteSpecGroup (groupIndex) {
    this.multiSpecData.specList.splice(groupIndex, 1)
    this.onUpdate(false)
  }

  // 删除规格值
  handleDeleteSpecValue (groupIndex, valueIndex) {
    this.multiSpecData.specList[groupIndex].valueList.splice(valueIndex, 1)
    this.onUpdate(false)
  }

  // 批量设置sku事件
  handleSkuBatch () {
    const skuBatchForm = this.getFilterObject(this.multiSpecData.skuBatchForm)
    const skuList = this.multiSpecData.skuList
    // if (!skuBatchForm.image_id) {
    //   delete skuBatchForm.image
    // }
    console.log('skuBatchForm', skuBatchForm)
    for (const index in skuList) {
      skuList[index] = { ...skuList[index], ...skuBatchForm }
    }
    this.onUpdate(false)
  }

  /**
   * 过滤对象的空元素
   * (仅支持一维对象)
   * @param {object} object 源对象
   * @returns {object}
   */
  getFilterObject (object) {
    const newObj = {}
    for (const key in object) {
      const value = object[key]
      // value === 0 可以不过滤image_id为0的情况
      // if (!isEmpty(value) || value === 0) {
      //   newObj[key] = value
      // }
      if (!isEmpty(value)) {
        newObj[key] = value
      }
    }
    return newObj
  }

  // 表单验证
  verifyForm () {
    // 验证规格
    if (!this.verifySpec()) {
      return false
    }
    // 验证sku
    if (!this.verifySkuList()) {
      return false
    }
    return true
  }

  // 验证sku
  verifySkuList () {
    const verifiedColumns = [
      { field: 'groupon_price', name: '拼团价格' },
      { field: 'groupon_price_', name: '拼团价格', dynamic: true }
    ]
    this.error = ''
    const skuList = this.multiSpecData.skuList
    for (const skuIndex in skuList) {
      const skuItem = skuList[skuIndex]
      for (const colIndex in verifiedColumns) {
        const verified = verifiedColumns[colIndex]
        let fields = [verified.field]
        if (verified.dynamic) {
          fields = _.keys(skuItem).filter(key => {
            return new RegExp(`^${verified.field}\\d+$`).test(key)
          })
        }
        fields.forEach(field => {
          const value = skuItem[field]
          if (value === '' || value === null || value === undefined) {
            skuItem[field] = ''
            this.error = `${verified.name}不能为空`
          }
        })
      }
    }
    !isEmpty(this.error) && this.onUpdate(false)
    return isEmpty(this.error)
  }

  // 验证规格
  verifySpec () {
    const specList = this.multiSpecData.specList
    if (!specList.length) {
      this.error = '亲，还没有添加规格组~'
      return false
    }
    for (const index in specList) {
      // 验证规格组
      const specGroup = specList[index]
      if (isEmpty(specGroup.spec_name)) {
        this.error = '规格组名称不能为空~'
        return false
      }
      // 验证规格值
      const valueList = specGroup.valueList
      if (!valueList.length) {
        this.error = '还没有添加规格值~'
        return false
      }
      for (const i in valueList) {
        if (isEmpty(valueList[i].spec_value)) {
          this.error = '规格值不能为空~'
          return false
        }
      }
    }
    return true
  }

  // 获取规格及SKU信息(表单提交)
  getFromSpecData () {
    const { multiSpecData: { skuList } } = this
    const specData = {
      skuList: _.cloneDeep(skuList)
    }
    for (const skuIndex in specData.skuList) {
      const skuItem = specData.skuList[skuIndex]
      delete skuItem.image
      delete skuItem.key
    }
    return specData
  }

  /**
   * 使用防抖节流方式刷新sku列表
   * @param {boolean} isDebounce 如果true则使用防抖函数
   */
  onUpdate (isDebounce = true) {
    if (isDebounce) {
      debounce(getDataForDebounce, 200)(this)
    } else {
      getDataForDebounce(this)
    }
  }
}

// onUpdate调用的逻辑方法
const getDataForDebounce = MultiSpecModel => {
  return MultiSpecModel.getData()
}

/**
 * 生成笛卡尔积数据
 * cartesianProductOf([arr1, arr2, arr3 ...])
 */
const cartesianProductOf = arrays => {
  if (!arrays.length) {
    return []
  }
  return Array.prototype.reduce.call(arrays, (arr1, arr2) => {
    var ret = []
    arr1.forEach(v1 => {
      arr2.forEach(v2 => {
        ret.push(v1.concat([v2]))
      })
    })
    return ret
  }, [[]])
}
