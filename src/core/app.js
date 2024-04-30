import store from '@/store'
import { inArray, isEmpty } from '@/utils/util'

/**
 * 获取开启的插件列表
 * @returns {*}
 */
export function getYoShopPlugins () {
    // 站点配置文件
    // window.publicConfig => public/config.js
    const publicConfig = store.getters.publicConfig
    // 开启的插件列表
    return publicConfig.plugins ? publicConfig.plugins : []
}

/**
 * 判断指定插件是否开启
 * @param {string} name 插件名称
 * @returns {*}
 */
export function checkYoShopPlugin (name) {
    return inArray(name, getYoShopPlugins())
}

/**
 * 验证是否开启功能模块权限
 * @param {string} moduleKey 功能模块key
 * @returns {*}
 */
export function checkModuleKey (moduleKey) {
    return inArray(moduleKey, store.getters.modules)
}

/**
 * 验证指定的功能模块是否开启（批量）
 * @param {string} moduleKeys 功能模块key
 * @returns {*}
 */
export const checkModules = moduleKeys => {
    if (isEmpty(moduleKeys)) {
        return true
    }
    return moduleKeys.filter(val => checkModuleKey(val)).length > 0
}

/**
 * 过滤开启的功能模块（批量）
 */
export const filterModules = array => {
    return array.filter(item => !item.moduleKey || checkModuleKey(item.moduleKey))
}
