<template>
  <div class="container">
    <a-spin :spinning="isLoading">
      <!-- 工作区 -->
      <div class="work-content">
        <!-- 组件库 -->
        <Components @handleClickItem="onAddItem" />
        <!--手机容器-->
        <Phone
          v-if="!isLoading"
          :data="data"
          :selectedIndex="selectedIndex"
          @onEditer="onEditer"
          @onDeleleItem="onDeleleItem"
        />
        <!-- 编辑器 -->
        <Editor
          v-if="!isLoading"
          :defaultData="defaultData"
          :data="data"
          :selectedIndex="selectedIndex"
          :curItem="curItem"
        />
      </div>
      <!-- 操作栏 -->
      <div class="footer">
        <div class="footer-content">
          <a-button type="primary" :loading="isLoading" @click="onFormSubmit">保存</a-button>
          <!-- <a-button>另存为</a-button> -->
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import _ from 'lodash'
import draggable from 'vuedraggable'
import { inArray } from '@/utils/util'
import * as Api from '@/api/page'
import { SelectImage } from '@/components'
import { Components, Phone, Editor } from './modules'

export default {
  components: {
    SelectImage,
    draggable,
    Components,
    Phone,
    Editor
  },
  data () {
    return {
      // loading状态
      isLoading: false,
      // 页面装修默认数据
      defaultData: {},
      // 当前页面数据
      data: { page: {}, items: [] },
      // 当前选中的元素索引
      selectedIndex: 'page',
      // 当前选中的元素
      curItem: {}
    }
  },
  // 初始化数据
  created () {
    // 获取初始化数据
    this.initData()
  },
  methods: {

    // 获取初始化数据
    initData () {
      this.isLoading = true
      Promise.all([
        // 获取默认数据
        this.getDefaultData()
      ]).then(() => {
        // 生成默认的data
        this.createNewData()
        this.isLoading = false
      })
    },

    // 生成默认的data
    createNewData () {
      const { defaultData, data } = this
      data.page = defaultData.page
      data.items = []
    },

    // 获取默认数据
    getDefaultData () {
      return new Promise((resolve, reject) => {
        // Api.defaultData()
        //   .then(result => {
            this.defaultData = {
        'page': {
            'params': {
                'name': '页面名称',
                'title': '页面标题',
                'shareTitle': '分享标题'
            },
            'style': {
                'titleTextColor': 'black',
                'titleBackgroundColor': '#ffffff'
            }
        },
        'items': {
            'search': {
                'name': '搜索框',
                'type': 'search',
                'params': {
                    'placeholder': '请输入关键字进行搜索'
                },
                'style': {
                    'textAlign': 'left',
                    'searchStyle': 'square'
                }
            },
            'banner': {
                'name': '图片轮播',
                'type': 'banner',
                'style': {
                    'btnColor': '#ffffff',
                    'btnShape': 'round',
                    'interval': 2.5
                },
                'data': [
                    {
                        'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/banner\/01.png',
                        'link': null
                    },
                    {
                        'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/banner\/01.png',
                        'link': null
                    }
                ]
            },
            'image': {
                'name': '图片',
                'type': 'image',
                'style': {
                    'paddingTop': 0,
                    'paddingLeft': 0,
                    'background': '#ffffff'
                },
                'data': [
                    {
                        'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/banner\/01.png',
                        'imgName': 'image-1.jpg',
                        'link': null
                    }
                ]
            },
            'navBar': {
                'name': '导航组',
                'type': 'navBar',
                'style': {
                    'rowsNum': 4,
                    'background': '#ffffff',
                    'paddingTop': 0,
                    'textColor': '#666666'
                },
                'data': [
                    {
                        'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/navbar\/01.png',
                        'imgName': 'icon-1.png',
                        'link': null,
                        'text': '按钮文字1'
                    },
                    {
                        'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/navbar\/01.png',
                        'imgName': 'icon-2.jpg',
                        'link': null,
                        'text': '按钮文字2'
                    },
                    {
                        'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/navbar\/01.png',
                        'imgName': 'icon-3.jpg',
                        'link': null,
                        'text': '按钮文字3'
                    },
                    {
                        'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/navbar\/01.png',
                        'imgName': 'icon-4.jpg',
                        'link': null,
                        'text': '按钮文字4'
                    }
                ]
            },
            'blank': {
                'name': '辅助空白',
                'type': 'blank',
                'style': {
                    'height': 20,
                    'background': '#ffffff'
                }
            },
            'guide': {
                'name': '辅助线',
                'type': 'guide',
                'style': {
                    'background': '#ffffff',
                    'lineStyle': 'solid',
                    'lineHeight': 1,
                    'lineColor': '#000000',
                    'paddingTop': 10
                }
            },
            'video': {
                'name': '视频组',
                'type': 'video',
                'params': {
                    'videoUrl': 'http:\/\/wxsnsdy.tc.qq.com\/105\/20210\/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400.mp4',
                    'poster': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/video_poster.png',
                    'autoplay': 0
                },
                'style': {
                    'paddingTop': 0,
                    'height': 190
                }
            },
            'article': {
                'name': '文章组',
                'type': 'article',
                'params': {
                    'source': 'auto',
                    'auto': {
                        'category': -1,
                        'showNum': 6
                    }
                },
                'defaultData': [
                    {
                        'title': '此处显示文章标题',
                        'show_type': 10,
                        'image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/article\/01.png',
                        'views_num': 309
                    },
                    {
                        'title': '此处显示文章标题',
                        'show_type': 10,
                        'image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/article\/01.png',
                        'views_num': 309
                    }
                ],
                'data': []
            },
            'notice': {
                'name': '店铺公告',
                'type': 'notice',
                'params': {
                    'text': '这里是第一条自定义公告的标题',
                    'link': null,
                    'showIcon': true,
                    'scrollable': true
                },
                'style': {
                    'paddingTop': 0,
                    'background': '#fffbe8',
                    'textColor': '#de8c17'
                }
            },
            'richText': {
                'name': '富文本',
                'type': 'richText',
                'params': {
                    'content': '<p>这里是文本的内容<\/p>'
                },
                'style': {
                    'paddingTop': 0,
                    'paddingLeft': 0,
                    'background': '#ffffff'
                }
            },
            'window': {
                'name': '图片橱窗',
                'type': 'window',
                'style': {
                    'paddingTop': 0,
                    'paddingLeft': 0,
                    'background': '#ffffff',
                    'layout': 2
                },
                'data': [
                    {
                        'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/window\/01.jpg',
                        'link': null
                    },
                    {
                        'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/window\/02.jpg',
                        'link': null
                    },
                    {
                        'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/window\/03.jpg',
                        'link': null
                    },
                    {
                        'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/window\/04.jpg',
                        'link': null
                    }
                ],
                'dataNum': 4
            },
            'hotZone': {
                'name': '热区',
                'type': 'hotZone',
                'style': {
                    'paddingTop': 0,
                    'paddingLeft': 0,
                    'background': '#ffffff'
                },
                'data': {
                    'imgUrl': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/banner\/01.png',
                    'imgName': 'image-1.jpg',
                    'maps': [
                        {
                            'width': 300,
                            'height': 100,
                            'left': 0,
                            'top': 0,
                            'link': null,
                            'key': 1
                        }
                    ]
                }
            },
            'goods': {
                'name': '商品组',
                'type': 'goods',
                'params': {
                    'source': 'auto',
                    'auto': {
                        'category': 0,
                        'goodsSort': 'all',
                        'showNum': 6
                    }
                },
                'style': {
                    'background': '#F6F6F6',
                    'display': 'list',
                    'column': 2,
                    'show': [
                        'goodsName',
                        'goodsPrice',
                        'linePrice',
                        'sellingPoint',
                        'goodsSales'
                    ]
                },
                'defaultData': [
                    {
                        'goods_name': '此处显示商品名称',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'goods_price_min': '99.00',
                        'line_price_min': '139.00',
                        'selling_point': '此款商品美观大方 不容错过',
                        'goods_sales': 100
                    },
                    {
                        'goods_name': '此处显示商品名称',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'goods_price_min': '99.00',
                        'line_price_min': '139.00',
                        'selling_point': '此款商品美观大方 不容错过',
                        'goods_sales': 100
                    },
                    {
                        'goods_name': '此处显示商品名称',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'goods_price_min': '99.00',
                        'line_price_min': '139.00',
                        'selling_point': '此款商品美观大方 不容错过',
                        'goods_sales': 100
                    },
                    {
                        'goods_name': '此处显示商品名称',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'goods_price_min': '99.00',
                        'line_price_min': '139.00',
                        'selling_point': '此款商品美观大方 不容错过',
                        'goods_sales': 100
                    }
                ],
                'data': [
                    {
                        'goods_name': '此处显示商品名称',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'goods_price_min': '99.00',
                        'line_price_min': '139.00',
                        'selling_point': '此款商品美观大方 不容错过',
                        'goods_sales': 100
                    },
                    {
                        'goods_name': '此处显示商品名称',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'goods_price_min': '99.00',
                        'line_price_min': '139.00',
                        'selling_point': '此款商品美观大方 不容错过',
                        'goods_sales': 100
                    }
                ]
            },
            'service': {
                'name': '在线客服',
                'type': 'service',
                'params': {
                    'type': 'chat',
                    'image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/service.png',
                    'tel': ''
                },
                'style': {
                    'right': 1,
                    'bottom': 10,
                    'opacity': 100
                }
            },
            'officialAccount': {
                'name': '关注公众号',
                'type': 'officialAccount',
                'params': [],
                'style': []
            },
            'shop': {
                'name': '线下门店',
                'type': 'shop',
                'params': {
                    'source': 'auto',
                    'auto': {
                        'showNum': 6
                    }
                },
                'style': {
                    'show': [
                        'logo',
                        'address',
                        'phone'
                    ],
                    'background': '#ffffff'
                },
                'defaultData': [
                    {
                        'shop_name': '此处显示门店名称',
                        'logo_url': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/circular.png',
                        'phone': '010-6666666',
                        'region': {
                            'province': 'xxx省',
                            'city': 'xxx市',
                            'region': 'xxx区'
                        },
                        'address': 'xxx街道'
                    },
                    {
                        'shop_name': '此处显示门店名称',
                        'logo_url': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/circular.png',
                        'phone': '010-6666666',
                        'region': {
                            'province': 'xxx省',
                            'city': 'xxx市',
                            'region': 'xxx区'
                        },
                        'address': 'xxx街道'
                    }
                ],
                'data': [
                    {
                        'shop_name': '此处显示门店名称',
                        'logo_url': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/circular.png',
                        'phone': '010-6666666',
                        'region': {
                            'province': 'xxx省',
                            'city': 'xxx市',
                            'region': 'xxx区'
                        },
                        'address': 'xxx街道'
                    }
                ]
            },
            'bargain': {
                'name': '砍价商品组',
                'type': 'bargain',
                'params': {
                    'source': 'auto',
                    'auto': {
                        'goodsSort': 'all',
                        'showNum': 6
                    }
                },
                'style': {
                    'background': '#F6F6F6',
                    'show': [
                        'goodsName',
                        'peoples',
                        'floorPrice',
                        'originalPrice'
                    ]
                },
                'demo': {
                    'helpsCount': 2,
                    'helpList': [
                        {
                            'user': {
                                'avatar_url': 'http:\/\/tva1.sinaimg.cn\/large\/0060lm7Tly1g4c7zrytvvj30dw0dwwes.jpg'
                            }
                        },
                        {
                            'user': {
                                'avatar_url': 'http:\/\/tva1.sinaimg.cn\/large\/0060lm7Tly1g4c7zs2u5ej30b40b4dfx.jpg'
                            }
                        }
                    ]
                },
                'defaultData': [
                    {
                        'goods_name': '此处是砍价商品',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'floor_price': '0.01',
                        'original_price': '139.00'
                    },
                    {
                        'goods_name': '此处是砍价商品',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'floor_price': '0.01',
                        'original_price': '139.00'
                    }
                ],
                'data': [
                    {
                        'goods_name': '此处是砍价商品',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'floor_price': '0.01',
                        'original_price': '139.00'
                    },
                    {
                        'goods_name': '此处是砍价商品',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'floor_price': '0.01',
                        'original_price': '139.00'
                    }
                ]
            },
            'sharp': {
                'name': '整点秒杀',
                'type': 'sharp',
                'params': {
                    'showNum': 6
                },
                'style': {
                    'background': '#ffffff',
                    'column': 3,
                    'show': [
                        'goodsName',
                        'seckillPrice',
                        'originalPrice'
                    ]
                },
                'data': [
                    {
                        'goods_name': '此处是秒杀商品',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'seckill_price_min': '69.00',
                        'original_price': '139.00'
                    },
                    {
                        'goods_name': '此处是秒杀商品',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'seckill_price_min': '69.00',
                        'original_price': '139.00'
                    },
                    {
                        'goods_name': '此处是秒杀商品',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'seckill_price_min': '69.00',
                        'original_price': '139.00'
                    }
                ]
            },
            'groupon': {
                'name': '拼团商品组',
                'type': 'groupon',
                'params': {
                    'source': 'auto',
                    'auto': {
                        'goodsSort': 'all',
                        'showNum': 6
                    }
                },
                'style': {
                    'background': '#F5F5F8',
                    'paddingY': 12,
                    'paddingX': 12,
                    'display': 'card',
                    'itemBorderRadius': 'round',
                    'itemMargin': 10,
                    'show': [
                        'goodsName',
                        'button',
                        'peoples',
                        'activeSales',
                        'grouponPrice',
                        'originalPrice'
                    ]
                },
                'defaultData': [
                    {
                        'goods_name': '此处是拼团商品',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'show_people': '3',
                        'active_sales': '120',
                        'groupon_price': '99.00',
                        'original_price': '139.00'
                    },
                    {
                        'goods_name': '此处是拼团商品',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'show_people': '3',
                        'active_sales': '120',
                        'groupon_price': '99.00',
                        'original_price': '139.00'
                    }
                ],
                'data': [
                    {
                        'goods_name': '此处是拼团商品',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'show_people': '3',
                        'active_sales': '120',
                        'groupon_price': '99.00',
                        'original_price': '139.00'
                    },
                    {
                        'goods_name': '此处是拼团商品',
                        'goods_image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/goods\/01.png',
                        'show_people': '3',
                        'active_sales': '120',
                        'groupon_price': '99.00',
                        'original_price': '139.00'
                    }
                ]
            },
            'coupon': {
                'name': '优惠券组',
                'type': 'coupon',
                'style': {
                    'paddingTop': 10,
                    'background': '#ffffff',
                    'marginRight': 20,
                    'couponBgColor': '#ffa708',
                    'receiveBgColor': '#717070'
                },
                'params': {
                    'showNum': 5
                },
                'data': [
                    {
                        'reduce_price': '10',
                        'min_price': '100.00'
                    },
                    {
                        'reduce_price': '10',
                        'min_price': '100.00'
                    },
                    {
                        'reduce_price': '10',
                        'min_price': '100.00'
                    }
                ]
            },
            'special': {
                'name': '头条快报',
                'type': 'special',
                'params': {
                    'source': 'auto',
                    'auto': {
                        'category': -1,
                        'showNum': 6
                    },
                    'display': 1,
                    'image': 'https:\/\/pro2.yiovo.com\/assets\/store\/img\/diy\/special.png'
                },
                'style': {
                    'background': '#ffffff',
                    'textColor': '#141414',
                    'paddingTop': 0
                },
                'defaultData': [
                    {
                        'title': '张小龙4小时演讲：你和高手之间，隔着“简单”二字'
                    },
                    {
                        'title': '张小龙4小时演讲：你和高手之间，隔着“简单”二字'
                    }
                ],
                'data': []
            },
            'ICPLicense': {
                'name': '备案号',
                'type': 'ICPLicense',
                'params': {
                    'text': '网站备案号：粤ICP备10000000号-1',
                    'link': 'https:\/\/beian.miit.gov.cn\/'
                },
                'style': {
                    'fontSize': '13',
                    'textAlign': 'center',
                    'textColor': '#696969',
                    'paddingTop': 6,
                    'paddingLeft': 0,
                    'background': '#ffffff'
                }
            }
        }
    }
            resolve()
          // })
      })
    },

    /**
     * 新增Diy组件
     * @param type
     */
    onAddItem (type) {
      // 验证新增Diy组件
      if (!this.onCheckAddItem(type)) {
        return false
      }
      const { defaultData, data } = this
      // 复制默认diy组件数据
      const newItem = _.cloneDeep(defaultData.items[type])
      // 新增到diy列表数据
      data.items.push(newItem)
      // 编辑当前选中的元素
      this.onEditer(data.items.length - 1)
    },

    /**
     * 验证新增Diy组件
     * @param type
     */
    onCheckAddItem (type) {
      const { data } = this
      // 验证关注公众号组件只能存在一个
      if (type === 'officialAccount') {
        const itemsTypes = data.items.map(item => item.type)
        if (inArray(type, itemsTypes)) {
          this.$message.warning('该组件最多存在一个')
          return false
        }
      }
      return true
    },

    /**
     * 编辑当前选中的Diy元素
     * @param index
     */
    onEditer (index) {
      const { data } = this
      // 记录当前选中元素的索引
      this.selectedIndex = index
      // 当前选中的元素数据
      this.curItem = index === 'page' ? data.page
        : data.items[index]
    },

    /**
     * 删除diy元素
     * @param index
     */
    onDeleleItem (index) {
      const { data: { items } } = this
      items.splice(index, 1)
      this.selectedIndex = -1
    },

    /**
     * 编辑器：重置颜色
     * @param holder
     * @param attribute
     * @param color
     */
    onEditorResetColor (holder, attribute, color) {
      holder[attribute] = color
    },

    // 提交到后端api
    onFormSubmit () {
      this.isLoading = true
      const { data, $message } = this
      Api.add({ form: data })
        .then(result => {
          // 显示成功
          $message.success(result.message, 1.5)
          // 跳转到列表页
          setTimeout(() => this.$router.push('./index'), 1500)
        })
        .finally(() => setTimeout(() => this.isLoading = false, 1500))
    }

  }
}
</script>
<style lang="less" scoped>
@import './style.less';
</style>
