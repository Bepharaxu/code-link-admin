import { axios } from '@/utils/request'

// api接口列表
const api = {
  list: '/live.room/list',
  sync: '/live.room/sync',
  setTop: '/live.room/setTop'
}

// 列表记录
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

/**
 * 同步刷新直播间列表
 * @param {*} data
 */
export function sync (data) {
  return axios({
    url: api.sync,
    method: 'post',
    data
  })
}

/**
 * 修改直播间置顶状态
 * @param {*} id 直播间ID
 * @param {*} isTop 是否置顶(1置顶 0取消)
 */
export function setTop (id, isTop) {
  return axios({
    url: api.setTop,
    method: 'post',
    data: { id, isTop }
  })
}
