import { filterModules } from '@/core/app'

// 链接类型 - 指定的页面
export const LINK_TYPE_PAGE = 'PAGE'

// 链接类型 - 自定义路径
export const LINK_TYPE_CUSTOM = 'CUSTOM'

// 链接类型 - 跳转微信小程序
export const LINK_TYPE_MP_WEIXIN = 'MP-WEIXIN'

// 链接类型 - H5外链
export const LINK_TYPE_URL = 'URL'

// 基础页面
const basics = {
  title: '基础页面',
  key: 'basics',
  data: [
    {
      id: 'cb344ba',
      title: '商城首页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/index/index'
      }
    },
    {
      id: 'c37c2ee',
      title: '分类页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/category/index'
      }
    },
    {
      id: 'bb2f7f1',
      title: '购物车',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/cart/index'
      }
    },
    {
      id: 'a013c9e',
      title: '个人中心',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/user/index'
      }
    },
    {
      id: '593fe1f',
      title: '会员登录页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/login/index'
      }
    }
  ]
}

// 商城页面
const store = {
  title: '商城页面',
  key: 'store',
  data: [
    {
      id: '995bf1c',
      title: '商品列表页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/goods/list',
        query: {}
      },
      form: [
        {
          key: 'query.categoryId',
          lable: '分类ID',
          tips: '商品管理 -> 商品分类'
        },
        {
          key: 'query.search',
          lable: '关键词',
          tips: '搜索的关键词，用于匹配商品名称'
        }
      ]
    },
    {
      id: '6wawb10',
      title: '商品详情页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/goods/detail',
        query: {}
      },
      form: [
        {
          key: 'query.goodsId',
          lable: '商品ID',
          required: true,
          tips: '商品管理 -> 商品列表' // 字段提示
        }
      ]
    },
    {
      id: '88lxeey',
      title: '商品搜索页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/search/index'
      }
    },
    {
      title: '门店详情页',
      type: LINK_TYPE_PAGE,
      // moduleKey: 'store-shop',
      param: {
        path: 'pages/shop/detail/index',
        query: {}
      },
      form: [
        {
          key: 'query.shopId',
          lable: '门店ID',
          required: true,
          tips: '店铺管理 -> 门店列表'
        }
      ]
    },
    {
      id: '56sswhq',
      title: '领券中心',
      type: LINK_TYPE_PAGE,
      moduleKey: 'market-coupon',
      param: {
        path: 'pages/coupon/index'
      }
    },
    {
      id: '73e646c',
      title: '分销中心页',
      type: LINK_TYPE_PAGE,
      moduleKey: 'apps-dealer',
      param: {
        path: 'pages/dealer/index'
      }
    },
    {
      id: '8cc27f3',
      title: '砍价专区页',
      type: LINK_TYPE_PAGE,
      moduleKey: 'apps-bargain',
      param: {
        path: 'pages/bargain/index'
      }
    },
    {
      id: '0f3cb6e',
      title: '砍价商品详情页',
      moduleKey: 'apps-bargain',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/bargain/goods/index',
        query: {}
      },
      form: [
        {
          key: 'query.activeId',
          lable: '砍价活动ID',
          required: true,
          tips: '应用中心 -> 砍价活动 -> 活动列表' // 字段提示
        },
        {
          key: 'query.goodsId',
          lable: '商品ID',
          required: true,
          tips: '商品管理 -> 商品列表' // 字段提示
        }
      ]
    },
    {
      id: '88ef95a',
      title: '拼团活动页',
      type: LINK_TYPE_PAGE,
      moduleKey: 'apps-groupon',
      param: {
        path: 'pages/groupon/index'
      }
    },
    {
      id: 'a4cb960',
      title: '拼团商品详情页',
      type: LINK_TYPE_PAGE,
      moduleKey: 'apps-groupon',
      param: {
        path: 'pages/groupon/goods/index',
        query: {}
      },
      form: [
        {
          key: 'query.grouponGoodsId',
          lable: '拼团商品ID',
          required: true,
          tips: '应用中心 -> 多人拼团 -> 拼团商品' // 字段提示
        }
      ]
    },
    {
      id: '14c6032',
      title: '秒杀会场页',
      type: LINK_TYPE_PAGE,
      moduleKey: 'apps-sharp',
      param: {
        path: 'pages/sharp/index'
      }
    },
    {
      id: '1e28cbd',
      title: '小程序直播列表页',
      type: LINK_TYPE_PAGE,
      moduleKey: 'apps-live',
      param: {
        path: 'pages/live/index'
      }
    }
  ]
}

// 个人中心
const personal = {
  title: '个人中心',
  key: 'personal',
  data: [
    {
      id: '7b345f6',
      title: '我的订单',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/order/index',
        query: {}
      },
      form: [
        {
          key: 'query.dataType',
          lable: '订单类型',
          required: true,
          value: 'all', // 默认值
          tips: 'all 全部<br>payment 待支付<br>delivery 待发货<br>received 待收货' // 字段提示
        }
      ]
    },
    {
      id: 'c4f630d',
      title: '我的钱包页',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/wallet/index'
      }
    },
    {
      id: '792db19',
      title: '充值中心页',
      type: LINK_TYPE_PAGE,
      moduleKey: 'market-recharge',
      param: {
        path: 'pages/wallet/recharge/index'
      }
    },
    {
      id: '03b9290',
      title: '我的优惠券',
      type: LINK_TYPE_PAGE,
      moduleKey: 'market-coupon',
      param: {
        path: 'pages/my-coupon/index'
      }
    },
    {
      id: '569b0b0',
      title: '会员积分明细',
      type: LINK_TYPE_PAGE,
      moduleKey: 'market-points',
      param: {
        path: 'pages/points/log'
      }
    },
    {
      id: '0c25051',
      title: '收货地址',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/address/index'
      }
    },
    {
      id: '3558c27',
      title: '帮助中心',
      type: LINK_TYPE_PAGE,
      moduleKey: 'content-help',
      param: {
        path: 'pages/help/index'
      }
    },
    {
      id: 'dc5df5b',
      title: '我的拼团',
      type: LINK_TYPE_PAGE,
      moduleKey: 'apps-groupon',
      param: {
        path: 'pages/groupon/index',
        query: { tab: 1 }
      }
    },
    {
      id: '1ecfad0',
      title: '我的砍价',
      type: LINK_TYPE_PAGE,
      moduleKey: 'apps-bargain',
      param: {
        path: 'pages/bargain/index',
        query: { tab: 1 }
      }
    }
  ]
}

// 其他页面
const other = {
  title: '其他页面',
  key: 'other',
  data: [
    {
      id: '91th4ss',
      title: '店铺页面',
      type: LINK_TYPE_PAGE,
      param: {
        path: 'pages/custom/index',
        query: {}
      },
      form: [
        {
          key: 'query.pageId',
          lable: '页面ID',
          required: true,
          tips: '店铺管理 -> 店铺页面'
        }
      ]
    },
    {
      id: 'ugrauzv',
      title: '资讯列表页',
      type: LINK_TYPE_PAGE,
      moduleKey: 'content-article',
      param: {
        path: 'pages/article/index',
        query: {}
      },
      form: [
        {
          key: 'query.categoryId',
          lable: '分类ID',
          tips: '内容管理 -> 文章分类',
          value: ''
        }
      ]
    },
    {
      id: 'u1v6aux',
      title: '资讯详情页',
      type: LINK_TYPE_PAGE,
      moduleKey: 'content-article',
      param: {
        path: 'pages/article/detail',
        query: {}
      },
      form: [
        {
          key: 'query.articleId',
          lable: '文章ID',
          required: true,
          tips: '内容管理 -> 文章列表'
        }
      ]
    },
    {
      id: '0b0147a',
      title: '自定义路径',
      type: LINK_TYPE_CUSTOM,
      alert: '仅支持跳转内部页面路径，例如: pages/index/index',
      param: {
        path: '',
        queryStr: {}
      },
      form: [
        {
          key: 'path',
          lable: '页面路径',
          required: true,
          tips: '请输入以pages开头的路径'
        },
        {
          key: 'queryStr',
          lable: 'query参数',
          required: false
        }
      ]
    },
    {
      id: 'e234986',
      title: '跳转微信小程序',
      type: LINK_TYPE_MP_WEIXIN,
      alert: '仅支持在微信小程序之间跳转，不支持从其他客户端跳转小程序',
      param: {
        appId: '',
        path: ''
      },
      form: [
        {
          key: 'appId',
          lable: '小程序AppID',
          required: true,
          tips: '填写要跳转的微信小程序AppID'
        },
        {
          key: 'path',
          lable: '小程序路径',
          // required: true,
          tips: '填写要跳转的微信小程序路径'
        }
      ]
    },
    {
      id: '4e99fde',
      title: 'H5外部链接',
      type: LINK_TYPE_URL,
      alert: '仅支持在H5端和APP端跳转链接，不支持小程序端',
      param: { url: '' },
      form: [
        {
          key: 'url',
          lable: '链接地址',
          required: true,
          tips: '请输入以https://或http://开头的链接'
        }
      ]
    },
  ]
}

// // 门店 - 拨打电话 - 暂未实现
// const callPhone = {
//   id: 'cb344ba',
//   title: '拨打电话',
//   type: 'callPhone',
//   param: {
//     phoneNumber: '13212341234'
//   },
//   form: [
//     {
//       key: 'phoneNumber',
//       lable: '电话号码',
//       tips: ''
//     }
//   ]
// }

// 过滤开启的功能模块
export const linkList = [basics, store, personal, other].map(item => {
  item.data = filterModules(item.data)
  return item
})
