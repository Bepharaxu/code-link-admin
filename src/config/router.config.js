// eslint-disable-next-line
import { UserLayout, BasicLayout, BlankLayout } from '@/layouts'
import * as Icons from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

/**
 * 路由配置说明：
 * 建议：sider menu 请不要超过三级菜单，若超过三级菜单，则应该设计为顶部主菜单 配合左侧次级菜单
// {
//   redirect: noredirect,  //重定向
//   name: 'router-name',   //路由名称
//   hidden: true,          //可以在菜单中不展示这个路由，包括子路由。效果可以查看 other 下的路由配置。
//   isHideChildren: true,  // 折叠三级子菜单
//   meta: {
//     title: 'title',      //菜单项名称
//     icon: 'a-icon',      //菜单项图标
//     keepAlive: true,     //缓存页面
//     permission：[string]   //用来配置这个路由的权限，如果配置了将会验证当前用户的权限，并决定是否展示 *（默认情况下）
//   }
// }
 **/
export const asyncRouterMap = [

  {
    path: '/',
    name: 'root',
    component: BasicLayout,
    children: [

      // 后台首页
      {
        path: '/index',
        name: 'index',
        component: () => import(/* webpackChunkName: "index" */ '@/views/index/Index'),
        meta: { title: '首页', keepAlive: true, icon: Icons.home, permission: ['/index'] }
      },

      // 管理员
      {
        path: '/manage',
        name: 'manage',
        component: RouteView,
        redirect: '/manage/user/index',
        meta: { title: '管理员', icon: Icons.manage, permission: ['/manage'] },
        children: [
          {
            path: '/manage/user/index',
            component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/user/Index'),
            meta: { title: '管理员列表', keepAlive: false, permission: ['/manage/user/index'] }
          },
          {
            path: '/manage/role/index',
            component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/role/Index'),
            meta: { title: '角色管理', keepAlive: false, permission: ['/manage/role/index'] }
          }
        ]
      },

      // 店铺管理
      {
        path: '/store',
        name: 'store',
        component: RouteView,
        redirect: '/store/setting',
        meta: { title: '店铺管理', icon: Icons.shop, permission: ['/store'] },
        children: [
          {
            path: '/store/setting',
            component: () => import(/* webpackChunkName: "store" */ '@/views/store/Setting'),
            meta: { title: '店铺设置', keepAlive: false, permission: ['/store/setting'] }
          },
          {
            path: '/store/address/index',
            component: () => import(/* webpackChunkName: "store" */ '@/views/store/address/Index'),
            meta: { title: '地址管理', keepAlive: false, permission: ['/store/address/index'] }
          },
          {
            path: '/store/shop',
            component: RouteView,
            redirect: '/store/shop/index',
            meta: { title: '门店管理', keepAlive: false, permission: ['/store/shop'] },
            // moduleKey: 'store-shop',
            children: [
              {
                path: '/store/shop/index',
                component: () => import(/* webpackChunkName: "store" */ '@/views/store/shop/Index'),
                meta: { title: '门店列表', keepAlive: false, permission: ['/store/shop/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/store/shop/create', '/store/shop/update']
              },
              {
                path: '/store/shop/create',
                component: () => import(/* webpackChunkName: "store" */ '@/views/store/shop/Create'),
                meta: { title: '新增门店', keepAlive: false, permission: ['/store/shop/create'] },
                hidden: true
              },
              {
                path: '/store/shop/update',
                component: () => import(/* webpackChunkName: "store" */ '@/views/store/shop/Update'),
                meta: { title: '编辑门店', keepAlive: false, permission: ['/store/shop/update'] },
                hidden: true
              },
              {
                path: '/store/shop/clerk/index',
                component: () => import(/* webpackChunkName: "store" */ '@/views/store/shop/clerk/Index'),
                meta: { title: '店员管理', keepAlive: false, permission: ['/store/shop/clerk/index'] }
              },
              {
                path: '/store/shop/order/index',
                component: () => import(/* webpackChunkName: "store" */ '@/views/store/shop/order/Index'),
                meta: { title: '核销记录', keepAlive: false, permission: ['/store/shop/order/index'] }
              }
            ]
          },
          {
            path: '/page',
            component: RouteView,
            redirect: '/page/index',
            meta: { title: '店铺页面', keepAlive: false, permission: ['/page'] },
            children: [
              {
                path: '/page/index',
                component: () => import(/* webpackChunkName: "page" */ '@/views/page/Index'),
                meta: { title: '页面设计', keepAlive: false, permission: ['/page/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/page/create', '/page/update']
              },
              {
                path: '/page/create',
                component: () => import(/* webpackChunkName: "page" */ '@/views/page/Create'),
                meta: { title: '新增页面', keepAlive: false, permission: ['/page/create'] },
                hidden: true
              },
              {
                path: '/page/update',
                component: () => import(/* webpackChunkName: "page" */ '@/views/page/Update'),
                meta: { title: '编辑页面', keepAlive: false, permission: ['/page/update'] },
                hidden: true
              },
              {
                path: '/page/category',
                component: () => import(/* webpackChunkName: "page" */ '@/views/page/category/Index'),
                meta: { title: '分类模板', keepAlive: false, permission: ['/page/category'] },
                moduleKey: 'store-page-category'
              }
            ]
          },
          {
            path: '/store/style',
            component: RouteView,
            redirect: '/store/style',
            meta: { title: '店铺风格', keepAlive: false, permission: ['/store/style'] },
            moduleKey: 'store-style-theme',
            children: [
              {
                path: '/store/style/theme',
                component: () => import(/* webpackChunkName: "store" */ '@/views/store/style/Theme'),
                meta: { title: '主题风格', keepAlive: false, permission: ['/store/style/theme'] }
              }
            ]
          }
        ]
      },

      // 商品管理
      {
        path: '/goods',
        name: 'goods',
        component: RouteView,
        redirect: '/goods/index',
        meta: { title: '商品管理', icon: Icons.goods, permission: ['/goods'] },
        children: [
          {
            path: '/goods/index',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Index'),
            meta: { title: '商品列表', keepAlive: false, permission: ['/goods/index'] },
            // 访问其他页面时激活该菜单(router-link-active)
            activePath: ['/goods/create', '/goods/update', '/goods/copy']
          },
          {
            path: '/goods/create',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Create'),
            meta: { title: '创建商品', keepAlive: false, permission: ['/goods/create'] },
            hidden: true
          },
          {
            path: '/goods/update',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Update'),
            meta: { title: '编辑商品', keepAlive: false, permission: ['/goods/update'] },
            hidden: true
          },
          {
            path: '/goods/copy',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/Copy'),
            meta: { title: '复制商品', keepAlive: false, permission: ['/goods/copy'] },
            hidden: true,
            moduleKey: 'goods-copy'
          },
          {
            path: '/goods/category/index',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/category/Index'),
            meta: { title: '商品分类', keepAlive: false, permission: ['/goods/category/index'] }
          },
          // {
          //   path: '/goods/spec-template/index',
          //   component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/service/Index'),
          //   meta: { title: '规格模板', keepAlive: false, permission: ['/goods/spec-template/index'] }
          // },
          {
            path: '/goods/service/index',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/service/Index'),
            meta: { title: '服务承诺', pageTitle: '服务与承诺', keepAlive: false, permission: ['/goods/service/index'] }
          },
          {
            path: '/goods/comment/index',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/comment/Index'),
            meta: { title: '商品评价', keepAlive: false, permission: ['/goods/comment/index'] }
          },
          {
            path: '/goods/import/list',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/import/List'),
            meta: { title: '商品导入', pageTitle: '商品导入记录', keepAlive: false, permission: ['/goods/import/list'] },
            moduleKey: 'goods-import',
            // 访问其他页面时激活该菜单(router-link-active)
            activePath: ['/goods/import/batch']
          },
          {
            path: '/goods/import/batch',
            component: () => import(/* webpackChunkName: "goods" */ '@/views/goods/import/Batch'),
            meta: { title: '商品导入', pageTitle: '商品批量导入', keepAlive: false, permission: ['/goods/import'] },
            hidden: true,
          },
        ]
      },

      // 订单管理
      {
        path: '/order',
        name: 'order',
        component: RouteView,
        redirect: '/order/list/all',
        meta: { title: '订单管理', icon: Icons.order, permission: ['/order'] },
        children: [
          {
            path: '/order/list/all',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '全部订单', keepAlive: false, permission: ['/order/list/all'] }
          },
          {
            path: '/order/list/delivery',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '待发货', keepAlive: false, permission: ['/order/list/all'] }
          },
          {
            path: '/order/list/receipt',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '待收货', keepAlive: false, permission: ['/order/list/all'] }
          },
          {
            path: '/order/list/pay',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '待付款', keepAlive: false, permission: ['/order/list/all'] }
          },
          {
            path: '/order/list/complete',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '已完成', keepAlive: false, permission: ['/order/list/all'] }
          },
          {
            path: '/order/list/apply-cancel',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '待取消', keepAlive: false, permission: ['/order/list/all'] }
          },
          {
            path: '/order/list/cancel',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Index'),
            meta: { title: '已取消', keepAlive: false, permission: ['/order/list/all'] }
          },
          {
            path: '/order/detail',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/Detail'),
            meta: { title: '订单详情', keepAlive: false, permission: ['/order/detail'] },
            hidden: true
          },
          {
            path: '/order/refund/index',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/refund/Index'),
            meta: { title: '售后管理', keepAlive: false, permission: ['/order/refund/index'] },
            activePath: ['/order/refund/detail']
          },
          {
            path: '/order/refund/detail',
            component: () => import(/* webpackChunkName: "order" */ '@/views/order/refund/Detail'),
            meta: { title: '售后单详情', keepAlive: false, permission: ['/order/refund/detail'] },
            hidden: true
          },
          {
            path: '/order/tools',
            component: RouteView,
            meta: { title: '订单处理', keepAlive: false, permission: ['/order/tools'] },
            children: [
              {
                path: '/order/tools/delivery',
                component: () => import(/* webpackChunkName: "order" */ '@/views/order/tools/delivery/Index'),
                meta: { title: '发货管理', keepAlive: false, permission: ['/order/tools/delivery'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/order/tools/delivery/record']
              },
              {
                path: '/order/tools/export',
                component: () => import(/* webpackChunkName: "order" */ '@/views/order/tools/Export'),
                meta: { title: '订单导出', keepAlive: false, permission: ['/order/tools/export'] },
                moduleKey: 'order-export'
              },
              {
                path: '/order/tools/delivery/batch',
                component: () => import(/* webpackChunkName: "order" */ '@/views/order/tools/delivery/Batch'),
                meta: { title: '批量发货', keepAlive: false, permission: ['/order/tools/delivery/batch'] },
                hidden: true
              },
              {
                path: '/order/tools/delivery/record',
                component: () => import(/* webpackChunkName: "order" */ '@/views/order/tools/delivery/Record'),
                meta: { title: '发货记录', keepAlive: false, permission: ['/order/tools/delivery/record'] },
                hidden: true
              }
            ]
          },
        ]
      },

      // 会员管理
      {
        path: '/user',
        name: 'user',
        component: RouteView,
        meta: { title: '会员管理', icon: Icons.user, permission: ['/user'] },
        children: [
          {
            path: '/user/index',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/Index'),
            meta: { title: '会员列表', keepAlive: false, permission: ['/user/index'] }
          },
          {
            path: '/user/grade/index',
            component: () => import(/* webpackChunkName: "user" */ '@/views/user/grade/Index'),
            meta: { title: '会员等级', keepAlive: false, permission: ['/user/grade/index'] },
            moduleKey: 'user-grade'
          },
          {
            path: '/user/balance',
            component: RouteView,
            redirect: '/user/balance/index',
            meta: { title: '余额记录', keepAlive: false, permission: ['/user/balance'] },
            moduleKey: 'user-balance',
            children: [
              {
                path: '/user/recharge/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/user/recharge/Index'),
                meta: { title: '充值记录', keepAlive: false, permission: ['/user/recharge/index'] }
              },
              {
                path: '/user/balance/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/user/balance/Index'),
                meta: { title: '余额明细', keepAlive: false, permission: ['/user/balance/index'] }
              }
            ]
          }
        ]
      },

      // 内容管理
      {
        path: '/content',
        name: 'content',
        component: RouteView,
        meta: { title: '内容管理', icon: Icons.content, permission: ['/content'] },
        children: [
          {
            path: '/content/article',
            component: RouteView,
            redirect: '/content/article/index',
            meta: { title: '文章管理', keepAlive: false, permission: ['/content/article'] },
            moduleKey: 'content-article',
            children: [
              {
                path: '/content/article/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/article/Index'),
                meta: { title: '文章列表', keepAlive: false, permission: ['/content/article/index'] }
              },
              {
                path: '/content/article/category/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/article/category/Index'),
                meta: { title: '文章分类', keepAlive: false, permission: ['/content/article/category/index'] }
              }
            ]
          },
          {
            path: '/content/files',
            component: RouteView,
            redirect: '/content/files/index',
            meta: { title: '文件库管理', keepAlive: false, permission: ['/content/files'] },
            children: [
              {
                path: '/content/files/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/files/Index'),
                meta: { title: '文件列表', keepAlive: false, permission: ['/content/files/index'] }
              },
              {
                path: '/content/files/group/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/files/group/Index'),
                meta: { title: '文件分组', keepAlive: false, permission: ['/content/files/group/index'] }
              }
            ]
          },
          {
            path: '/content/help/index',
            component: () => import(/* webpackChunkName: "content" */ '@/views/content/help/Index'),
            meta: { title: '帮助中心', keepAlive: false, permission: ['/content/help/index'] },
            moduleKey: 'content-help',
          }
        ]
      },

      // 营销管理
      {
        path: '/market',
        name: 'market',
        component: RouteView,
        meta: { title: '营销管理', icon: Icons.market, permission: ['/market'] },
        moduleKeys: ['market-coupon', 'market-recharge', 'market-points', 'market-recommended', 'market-fullFree'],
        children: [
          {
            path: '/market/coupon',
            component: RouteView,
            redirect: '/market/coupon/index',
            meta: { title: '优惠券', keepAlive: false, permission: ['/market/coupon'] },
            moduleKey: 'market-coupon',
            children: [
              {
                path: '/market/coupon/index',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Index'),
                meta: { title: '优惠券列表', keepAlive: false, permission: ['/market/coupon/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/market/coupon/create', '/market/coupon/update']
              },
              {
                path: '/market/coupon/create',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Create'),
                meta: { title: '创建优惠券', keepAlive: false, permission: ['/market/coupon/create'] },
                hidden: true
              },
              {
                path: '/market/coupon/update',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Update'),
                meta: { title: '编辑优惠券', keepAlive: false, permission: ['/market/coupon/update'] },
                hidden: true
              },
              {
                path: '/market/coupon/receive/index',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Receive'),
                meta: { title: '领券记录', keepAlive: false, permission: ['/market/coupon/receive/index'] }
              },
              {
                path: '/market/coupon/give',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/coupon/Give'),
                meta: { title: '手动发放', keepAlive: false, permission: ['/market/coupon/give'] }
              }
            ]
          },
          {
            path: '/market/recharge',
            component: RouteView,
            redirect: '/market/recharge/plan/index',
            meta: { title: '会员充值', keepAlive: false, permission: ['/market/recharge'] },
            moduleKey: 'market-recharge',
            children: [
              {
                path: '/market/recharge/plan/index',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/recharge/plan/Index'),
                meta: { title: '充值套餐', keepAlive: false, permission: ['/market/recharge/plan/index'] }
              },
              {
                path: '/market/recharge/setting',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/recharge/Setting'),
                meta: { title: '充值设置', keepAlive: false, permission: ['/market/recharge/setting'] }
              }
            ]
          },
          {
            path: '/market/points',
            component: RouteView,
            redirect: '/market/points/setting',
            meta: { title: '积分管理', keepAlive: false, permission: ['/market/points'] },
            moduleKey: 'market-points',
            children: [
              {
                path: '/market/points/setting',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/points/Setting'),
                meta: { title: '积分设置', keepAlive: false, permission: ['/market/points/setting'] }
              },
              {
                path: '/market/points/log',
                component: () => import(/* webpackChunkName: "market" */ '@/views/market/points/Log'),
                meta: { title: '积分明细', keepAlive: false, permission: ['/market/points/log'] }
              }
            ]
          },
          {
            path: '/market/recommended',
            component: () => import(/* webpackChunkName: "market" */ '@/views/market/Recommended'),
            meta: { title: '商品推荐', keepAlive: false, permission: ['/market/recommended'] },
            moduleKey: 'market-recommended'
          },
          {
            path: '/market/full-free',
            component: () => import(/* webpackChunkName: "market" */ '@/views/market/FullFree'),
            meta: { title: '满额包邮', keepAlive: false, permission: ['/market/full-free'] },
            moduleKey: 'market-fullFree'
          },
        ]
      },

      // 数据统计
      {
        path: '/statistics',
        name: 'statistics',
        component: () => import(/* webpackChunkName: "statistics" */ '@/views/statistics/Index'),
        meta: { title: '数据统计', keepAlive: true, icon: Icons.statistics, permission: ['/statistics'] },
        moduleKey: 'statistics-statistics'
      },

      // 客户端
      {
        path: '/client',
        name: 'client',
        component: RouteView,
        meta: { title: '客户端', keepAlive: true, icon: Icons.mpWeixin, iconStyle: { fontSize: '17.2px', color: '#36b313' }, permission: ['/client'] },
        children: [
          {
            path: '/client/register',
            component: () => import(/* webpackChunkName: "client" */ '@/views/client/Register'),
            meta: { title: '注册设置', keepAlive: false, permission: ['/client/register'] }
          },
          {
            path: '/client/wxapp',
            component: RouteView,
            redirect: '/client/wxapp/setting',
            meta: { title: '微信小程序', keepAlive: false, permission: ['/client/wxapp'] },
            moduleKey: 'client-mpWeixin',
            children: [
              {
                path: '/client/wxapp/setting',
                component: () => import(/* webpackChunkName: "client" */ '@/views/client/wxapp/Setting'),
                meta: { title: '小程序设置', keepAlive: false, permission: ['/client/wxapp/setting'] }
              }
            ]
          },
          {
            path: '/client/wxofficial',
            component: RouteView,
            redirect: '/client/wxofficial/setting',
            meta: { title: '微信公众号', keepAlive: false, permission: ['/client/wxofficial'] },
            moduleKey: 'client-wxofficial',
            children: [
              {
                path: '/client/wxofficial/setting',
                component: () => import(/* webpackChunkName: "client" */ '@/views/client/wxofficial/Setting'),
                meta: { title: '公众号设置', keepAlive: false, permission: ['/client/wxofficial/setting'] }
              },
              {
                path: '/client/wxofficial/share',
                component: () => import(/* webpackChunkName: "client" */ '@/views/client/wxofficial/Share'),
                meta: { title: '分享设置', keepAlive: false, permission: ['/client/wxofficial/share'] }
              }
            ]
          },
          {
            path: '/client/h5',
            component: RouteView,
            redirect: '/client/h5/setting',
            meta: { title: 'H5端', keepAlive: false, permission: ['/client/h5'] },
            moduleKey: 'client-h5',
            children: [
              {
                path: '/client/h5/setting',
                component: () => import(/* webpackChunkName: "client" */ '@/views/client/h5/Setting'),
                meta: { title: '站点设置', keepAlive: false, permission: ['/client/h5/setting'] }
              }
            ]
          },
          {
            path: '/client/mp/alipay',
            isPlugin: true,
            pluginName: 'mpAlipay',
            component: RouteView,
            redirect: '/client/mp/alipay/setting',
            meta: { title: '支付宝小程序', keepAlive: false, permission: ['/client/mp/alipay'] },
            moduleKey: 'client-mpAlipay',
            children: [
              {
                path: '/client/mp/alipay/setting',
                component: () => import(/* webpackChunkName: "client" */ '@/views/client/mp/alipay/Setting'),
                meta: { title: '小程序设置', keepAlive: false, permission: ['/client/mp/alipay/setting'] }
              },
              {
                path: '/client/mp/alipay/customer',
                component: () => import(/* webpackChunkName: "client" */ '@/views/client/mp/alipay/Customer'),
                meta: { title: '客服设置', keepAlive: false, permission: ['/client/mp/alipay/customer'] }
              }
            ]
          },
        ]
      },

      // 应用中心
      {
        path: '/apps',
        name: 'apps',
        component: RouteView,
        meta: { title: '应用中心', keepAlive: true, icon: Icons.apps, permission: ['/apps'] },
        moduleKeys: ['apps-dealer', 'apps-bargain', 'apps-groupon', 'apps-sharp', 'apps-live', 'apps-eorder', 'apps-collector'],
        children: [
          {
            path: '/apps/dealer',
            component: RouteView,
            redirect: '/apps/dealer/apply',
            meta: { title: '分销中心', keepAlive: false, permission: ['/apps/dealer'] },
            moduleKey: 'apps-dealer',
            isHideChildren: true,
            children: [
              {
                path: '/apps/dealer/apply',
                component: () => import(/* webpackChunkName: "dealer" */ '@/views/apps/dealer/apply/Index'),
                meta: { title: '入驻申请', keepAlive: false, permission: ['/apps/dealer/apply'] }
              },
              {
                path: '/apps/dealer/user',
                component: () => import(/* webpackChunkName: "dealer" */ '@/views/apps/dealer/user/Index'),
                meta: { title: '分销商用户', keepAlive: false, permission: ['/apps/dealer/user'] }
              },
              {
                path: '/apps/dealer/order',
                component: () => import(/* webpackChunkName: "dealer" */ '@/views/apps/dealer/order/Index'),
                meta: { title: '分销订单', keepAlive: false, permission: ['/apps/dealer/order'] }
              },
              {
                path: '/apps/dealer/withdraw',
                component: () => import(/* webpackChunkName: "dealer" */ '@/views/apps/dealer/withdraw/Index'),
                meta: { title: '提现申请', keepAlive: false, permission: ['/apps/dealer/withdraw'] }
              },
              {
                path: '/apps/dealer/poster',
                component: () => import(/* webpackChunkName: "dealer" */ '@/views/apps/dealer/poster/Index'),
                meta: { title: '分销海报', keepAlive: false, permission: ['/apps/dealer/poster'] }
              },
              {
                path: '/apps/dealer/setting',
                component: () => import(/* webpackChunkName: "dealer" */ '@/views/apps/dealer/setting/Index'),
                meta: { title: '分销设置', keepAlive: false, permission: ['/apps/dealer/setting'] }
              }
            ]
          },
          {
            path: '/apps/bargain',
            component: RouteView,
            redirect: '/apps/bargain/active/index',
            meta: { title: '砍价活动', keepAlive: false, permission: ['/apps/bargain'] },
            moduleKey: 'apps-bargain',
            isHideChildren: true,
            children: [
              {
                path: '/apps/bargain/active/index',
                component: () => import(/* webpackChunkName: "bargain" */ '@/views/apps/bargain/active/Index'),
                meta: { title: '活动列表', keepAlive: false, permission: ['/apps/bargain/active/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/apps/bargain/active/create', '/apps/bargain/active/update']
              },
              {
                path: '/apps/bargain/active/create',
                component: () => import(/* webpackChunkName: "bargain" */ '@/views/apps/bargain/active/Create'),
                meta: { title: '创建活动', keepAlive: false, permission: ['/apps/bargain/active/create'] },
                hidden: true
              },
              {
                path: '/apps/bargain/active/update',
                component: () => import(/* webpackChunkName: "bargain" */ '@/views/apps/bargain/active/Update'),
                meta: { title: '编辑活动', keepAlive: false, permission: ['/apps/bargain/active/update'] },
                hidden: true
              },
              {
                path: '/apps/bargain/task/index',
                component: () => import(/* webpackChunkName: "bargain" */ '@/views/apps/bargain/task/Index'),
                meta: { title: '砍价任务', keepAlive: false, permission: ['/apps/bargain/task/index'] }
              },
              {
                path: '/apps/bargain/setting',
                component: () => import(/* webpackChunkName: "bargain" */ '@/views/apps/bargain/Setting'),
                meta: { title: '砍价设置', keepAlive: false, permission: ['/apps/bargain/setting'] }
              }
            ]
          },
          {
            path: '/apps/groupon',
            component: RouteView,
            redirect: '/apps/groupon/goods/index',
            meta: { title: '多人拼团', keepAlive: false, permission: ['/apps/groupon'] },
            moduleKey: 'apps-groupon',
            isHideChildren: true,
            children: [
              {
                path: '/apps/groupon/goods/index',
                component: () => import(/* webpackChunkName: "groupon" */ '@/views/apps/groupon/goods/Index'),
                meta: { title: '拼团商品', keepAlive: false, permission: ['/apps/groupon/goods/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/apps/groupon/goods/create', '/apps/groupon/goods/update']
              },
              {
                path: '/apps/groupon/goods/create',
                component: () => import(/* webpackChunkName: "groupon" */ '@/views/apps/groupon/goods/Create'),
                meta: { title: '创建拼团商品', keepAlive: false, permission: ['/apps/groupon/goods/create'] },
                hidden: true
              },
              {
                path: '/apps/groupon/goods/update',
                component: () => import(/* webpackChunkName: "groupon" */ '@/views/apps/groupon/goods/Update'),
                meta: { title: '编辑拼团商品', keepAlive: false, permission: ['/apps/groupon/goods/update'] },
                hidden: true
              },
              {
                path: '/apps/groupon/task',
                component: () => import(/* webpackChunkName: "groupon" */ '@/views/apps/groupon/task/Index'),
                meta: { title: '拼单管理', keepAlive: false, permission: ['/apps/groupon/task'] }
              },
              {
                path: '/apps/groupon/robot',
                component: () => import(/* webpackChunkName: "groupon" */ '@/views/apps/groupon/robot/Index'),
                meta: { title: '拼团机器人', keepAlive: false, permission: ['/apps/groupon/robot'] }
              },
              {
                path: '/apps/groupon/setting',
                component: () => import(/* webpackChunkName: "groupon" */ '@/views/apps/groupon/Setting'),
                meta: { title: '拼团设置', keepAlive: false, permission: ['/apps/groupon/setting'] }
              }
            ]
          },
          {
            path: '/apps/sharp',
            component: RouteView,
            redirect: '/apps/sharp/goods/index',
            meta: { title: '整点秒杀', keepAlive: false, permission: ['/apps/sharp'] },
            moduleKey: 'apps-sharp',
            isHideChildren: true,
            children: [
              {
                path: '/apps/sharp/goods/index',
                component: () => import(/* webpackChunkName: "sharp" */ '@/views/apps/sharp/goods/Index'),
                meta: { title: '秒杀商品', keepAlive: false, permission: ['/apps/sharp/goods/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/apps/sharp/goods/create', '/apps/sharp/goods/update']
              },
              {
                path: '/apps/sharp/goods/create',
                component: () => import(/* webpackChunkName: "sharp" */ '@/views/apps/sharp/goods/Create'),
                meta: { title: '创建商品', keepAlive: false, permission: ['/apps/sharp/goods/create'] },
                hidden: true
              },
              {
                path: '/apps/sharp/goods/update',
                component: () => import(/* webpackChunkName: "sharp" */ '@/views/apps/sharp/goods/Update'),
                meta: { title: '编辑商品', keepAlive: false, permission: ['/apps/sharp/goods/update'] },
                hidden: true
              },
              {
                path: '/apps/sharp/active/index',
                component: () => import(/* webpackChunkName: "sharp" */ '@/views/apps/sharp/active/Index'),
                meta: { title: '秒杀会场', keepAlive: false, permission: ['/apps/sharp/active/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: [
                  '/apps/sharp/active/create',
                  '/apps/sharp/active/time/index',
                  '/apps/sharp/active/time/create',
                  '/apps/sharp/active/time/update'
                ]
              },
              {
                path: '/apps/sharp/active/create',
                component: () => import(/* webpackChunkName: "sharp" */ '@/views/apps/sharp/active/Create'),
                meta: { title: '新增会场', keepAlive: false, permission: ['/apps/sharp/active/create'] },
                hidden: true
              },
              {
                path: '/apps/sharp/active/time/index',
                component: () => import(/* webpackChunkName: "sharp" */ '@/views/apps/sharp/active/time/Index'),
                meta: { title: '活动会场-场次管理', keepAlive: false, permission: ['/apps/sharp/active/time/index'] },
                hidden: true
              },
              {
                path: '/apps/sharp/active/time/create',
                component: () => import(/* webpackChunkName: "sharp" */ '@/views/apps/sharp/active/time/Create'),
                meta: { title: '新增场次', keepAlive: false, permission: ['/apps/sharp/active/time/create'] },
                hidden: true
              },
              {
                path: '/apps/sharp/active/time/update',
                component: () => import(/* webpackChunkName: "sharp" */ '@/views/apps/sharp/active/time/Update'),
                meta: { title: '编辑场次', keepAlive: false, permission: ['/apps/sharp/active/time/update'] },
                hidden: true
              },
              {
                path: '/apps/sharp/setting',
                component: () => import(/* webpackChunkName: "sharp" */ '@/views/apps/sharp/Setting'),
                meta: { title: '秒杀设置', keepAlive: false, permission: ['/apps/sharp/setting'] }
              }
            ]
          },
          {
            path: '/apps/live',
            component: RouteView,
            redirect: '/apps/live/room/index',
            meta: { title: '小程序直播', keepAlive: false, permission: ['/apps/live'] },
            moduleKey: 'apps-live',
            isHideChildren: true,
            children: [
              {
                path: '/apps/live/room/index',
                component: () => import(/* webpackChunkName: "live" */ '@/views/apps/live/room/Index'),
                meta: { title: '直播间管理', keepAlive: false, permission: ['/apps/live/room/index'] }
              }
            ]
          },
          {
            path: '/apps/eorder',
            component: RouteView,
            redirect: '/apps/eorder/template/index',
            meta: { title: '电子面单', keepAlive: false, permission: ['/apps/eorder'] },
            moduleKey: 'apps-eorder',
            isHideChildren: true,
            children: [
              {
                path: '/apps/eorder/template/index',
                component: () => import(/* webpackChunkName: "eorder" */ '@/views/apps/eorder/template/Index'),
                meta: { title: '面单模板', keepAlive: false, permission: ['/apps/eorder/template/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/apps/eorder/template/create', '/apps/eorder/template/update']
              },
              {
                path: '/apps/eorder/template/create',
                component: () => import(/* webpackChunkName: "eorder" */ '@/views/apps/eorder/template/Create'),
                meta: { title: '创建面单模板', keepAlive: false, permission: ['/apps/eorder/template/create'] },
                hidden: true
              },
              {
                path: '/apps/eorder/template/update',
                component: () => import(/* webpackChunkName: "eorder" */ '@/views/apps/eorder/template/Update'),
                meta: { title: '编辑面单模板', keepAlive: false, permission: ['/apps/eorder/template/update'] },
                hidden: true
              },
              {
                path: '/apps/eorder/setting',
                component: () => import(/* webpackChunkName: "eorder" */ '@/views/apps/eorder/Setting'),
                meta: { title: '基础设置', keepAlive: false, permission: ['/apps/eorder/setting'] }
              }
            ]
          },
          {
            path: '/apps/collector',
            component: RouteView,
            redirect: '/apps/collector/index',
            meta: { title: '商品采集', keepAlive: false, permission: ['/apps/collector'] },
            moduleKey: 'apps-collector',
            isHideChildren: true,
            children: [
              {
                path: '/apps/collector/index',
                component: () => import(/* webpackChunkName: "collector" */ '@/views/apps/collector/Index'),
                meta: { title: '一键采集', keepAlive: false, permission: ['/apps/collector/index'] }
              },
              {
                path: '/apps/collector/setting',
                component: () => import(/* webpackChunkName: "collector" */ '@/views/apps/collector/Setting'),
                meta: { title: '接口配置', keepAlive: false, permission: ['/apps/collector/setting'] }
              }
            ]
          },
        ]
      },

      // 设置
      {
        path: '/setting',
        name: 'setting',
        component: RouteView,
        redirect: '/setting/store/basic',
        meta: { title: '设置', icon: Icons.setting, permission: ['/setting'] },
        children: [
          {
            path: '/setting/trade',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Trade'),
            meta: { title: '交易设置', keepAlive: false, permission: ['/setting/trade'] }
          },
          {
            path: '/setting/customer',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Customer'),
            meta: { title: '客服设置', keepAlive: false, permission: ['/setting/customer'] },
            moduleKey: 'setting-customer',
          },
          {
            path: '/setting/storage',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Storage'),
            meta: { title: '上传设置', keepAlive: false, permission: ['/setting/storage'] },
            moduleKey: 'setting-storage',
          },
          {
            path: '/setting/sms',
            component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/Sms'),
            meta: { title: '短信通知', keepAlive: false, permission: ['/setting/sms'] }
          },
          {
            path: '/setting/delivery',
            component: RouteView,
            redirect: '/setting/delivery/setting',
            meta: { title: '配送设置', keepAlive: false, permission: ['/setting/delivery'] },
            isHideChildren: true,
            children: [
              {
                path: '/setting/delivery/setting',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/delivery/Setting'),
                meta: { title: '配送方式', keepAlive: false, permission: ['/setting/delivery/setting'] }
              },
              {
                path: '/setting/delivery/template/index',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/delivery/template/Index'),
                meta: { title: '运费模板', keepAlive: false, permission: ['/setting/delivery/template/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/setting/delivery/template/create', '/setting/delivery/template/update']
              },
              {
                path: '/setting/delivery/template/create',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/delivery/template/Create'),
                meta: { title: '新增运费模板', keepAlive: false, permission: ['/setting/delivery/template/create'] },
                hidden: true
              },
              {
                path: '/setting/delivery/template/update',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/delivery/template/Update'),
                meta: { title: '编辑运费模板', keepAlive: false, permission: ['/setting/delivery/template/update'] },
                hidden: true
              },
              {
                path: '/setting/delivery/express/index',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/delivery/express/Index'),
                meta: { title: '物流公司', keepAlive: false, permission: ['/setting/delivery/express/index'] }
              }
            ]
          },
          {
            path: '/setting/payment',
            component: RouteView,
            redirect: '/setting/payment/setting',
            meta: { title: '支付管理', keepAlive: false, permission: ['/setting/payment'] },
            isHideChildren: true,
            children: [
              {
                path: '/setting/payment/setting',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/payment/Setting'),
                meta: { title: '支付设置', keepAlive: false, permission: ['/setting/payment/setting'] }
              },
              {
                path: '/setting/payment/template/index',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/payment/template/Index'),
                meta: { title: '支付模板', keepAlive: false, permission: ['/setting/payment/template/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/setting/payment/template/create', '/setting/payment/template/update']
              },
              {
                path: '/setting/payment/template/create',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/payment/template/Create'),
                meta: { title: '新增支付模板', keepAlive: false, permission: ['/setting/payment/template/create'] },
                hidden: true
              },
              {
                path: '/setting/payment/template/update',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/payment/template/Update'),
                meta: { title: '编辑支付模板', keepAlive: false, permission: ['/setting/payment/template/update'] },
                hidden: true
              },
              // {
              //   path: '/setting/payment/mchpay',
              //   component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/payment/Mchpay'),
              //   meta: { title: '打款设置', keepAlive: false, permission: ['/setting/payment/mchpay'] }
              // }
            ]
          },
          {
            path: '/setting/printer',
            component: RouteView,
            redirect: '/setting/printer/index',
            meta: { title: '小票打印机', keepAlive: false, permission: ['/setting/printer'] },
            moduleKey: 'setting-printer',
            isHideChildren: true,
            children: [
              {
                path: '/setting/printer/index',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/printer/Index'),
                meta: { title: '打印机管理', keepAlive: false, permission: ['/setting/printer/index'] }
              },
              {
                path: '/setting/printer/setting',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/printer/Setting'),
                meta: { title: '打印设置', keepAlive: false, permission: ['/setting/printer/setting'] }
              }
            ]
          },
          {
            path: '/setting/other',
            component: RouteView,
            redirect: '/setting/other/clear',
            meta: { title: '其他设置', keepAlive: false, permission: ['/setting/other'] },
            isHideChildren: true,
            children: [
              {
                path: '/setting/other/clear',
                component: () => import(/* webpackChunkName: "setting" */ '@/views/setting/other/Clear'),
                meta: { title: '清理缓存', keepAlive: false, permission: ['/setting/other/clear'] }
              }
            ]
          }
        ]
      }

    ]
  },

  // 更新账户信息
  {
    name: 'renew',
    path: '/manage',
    redirect: '/manage/renew',
    component: BasicLayout,
    hidden: true,
    meta: { title: '更新账户信息', keepAlive: false },
    children: [
      {
        path: 'renew',
        component: () => import(/* webpackChunkName: "manage" */ '@/views/manage/renew')
      }
    ]
  },

  {
    path: '*', redirect: '/404', hidden: true
  }

]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [

  // 用户登录页
  {
    path: '/passport',
    component: UserLayout,
    redirect: '/passport/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "passport" */ '@/views/passport/Login')
      }
    ]
  },

  // 404页
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "exception" */ '@/views/exception/404')
  },
  // {
  //   path: '/',
  //   name: 'root',
  //   // component: BasicLayout,
  //   children: [
      // 内容管理
      {
        path: '/',
        name: 'root',
        component: RouteView,
        meta: { title: '内容管理', icon: Icons.content, permission: ['/content'] },
        children: [
          {
            path: '/',
            component: RouteView,
            redirect: '/',
            meta: { title: '客户管理', keepAlive: false, permission: ['/content/article'] },
            moduleKey: 'content-article',
            children: [
              {
                path: '/',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/article/Index'),
                meta: { title: '客户列表', keepAlive: false, permission: ['/content/article/index'] }
              },
              {
                path: '/content/article/category/index',
                component: () => import(/* webpackChunkName: "content" */ '@/views/content/article/category/Index'),
                meta: { title: '文章分类', keepAlive: false, permission: ['/content/article/category/index'] }
              }
            ]
          }
        ]
      },
      {
        path: '/store',
        name: 'store',
        component: RouteView,
        redirect: '/store/setting',
        meta: { title: '店铺管理', icon: Icons.shop, permission: ['/store'] },
        children: [
          {
            path: '/store/setting',
            component: () => import(/* webpackChunkName: "store" */ '@/views/store/Setting'),
            meta: { title: '店铺设置', keepAlive: false, permission: ['/store/setting'] }
          },
          {
            path: '/store/address/index',
            component: () => import(/* webpackChunkName: "store" */ '@/views/store/address/Index'),
            meta: { title: '地址管理', keepAlive: false, permission: ['/store/address/index'] }
          },
          {
            path: '/page',
            component: RouteView,
            redirect: '/page/index',
            meta: { title: '店铺页面', keepAlive: false, permission: ['/page'] },
            children: [
              {
                path: '/page/index',
                component: () => import(/* webpackChunkName: "page" */ '@/views/page/Index'),
                meta: { title: '页面设计', keepAlive: false, permission: ['/page/index'] },
                // 访问其他页面时激活该菜单(router-link-active)
                activePath: ['/page/create', '/page/update']
              },
              {
                path: '/page/create',
                component: () => import(/* webpackChunkName: "page" */ '@/views/page/Create'),
                meta: { title: '新增页面', keepAlive: false, permission: ['/page/create'] },
                hidden: true
              },
              {
                path: '/page/update',
                component: () => import(/* webpackChunkName: "page" */ '@/views/page/Update'),
                meta: { title: '编辑页面', keepAlive: false, permission: ['/page/update'] },
                hidden: true
              },
              {
                path: '/page/category',
                component: () => import(/* webpackChunkName: "page" */ '@/views/page/category/Index'),
                meta: { title: '分类模板', keepAlive: false, permission: ['/page/category'] },
                moduleKey: 'store-page-category'
              }
            ]
          },
          {
            path: '/store/style',
            component: RouteView,
            redirect: '/store/style',
            meta: { title: '店铺风格', keepAlive: false, permission: ['/store/style'] },
            moduleKey: 'store-style-theme',
            children: [
              {
                path: '/store/style/theme',
                component: () => import(/* webpackChunkName: "store" */ '@/views/store/style/Theme'),
                meta: { title: '主题风格', keepAlive: false, permission: ['/store/style/theme'] }
              }
            ]
          }
        ]
      }
  //   ]
  // }
]
