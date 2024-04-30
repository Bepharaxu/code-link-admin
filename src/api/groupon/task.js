import { axios } from '@/utils/request'

// api接口列表
const api = {
  list: '/groupon.task/list',
  users: '/groupon.task/users'
}

// 列表记录
export function list (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

// 拼单成员列表
export function users (taskId, params) {
  return axios({
    url: api.users,
    method: 'get',
    params: { taskId, ...params }
  })
}
