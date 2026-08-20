// API 地址统一收拢
// 把分散在各组件里的硬编码接口地址集中到这里，方便统一修改 / 维护
// 真实的项目里通常还会结合 .env 环境变量（process.env.xxx）区分开发/生产

const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'http://127.0.0.1:3000'
  : 'http://127.0.0.1:3000'

export const USER_API = {
  list: `${BASE_URL}/users`,
  detail: id => `${BASE_URL}/users/${id}`,
  add: `${BASE_URL}/users`,
  update: id => `${BASE_URL}/users/${id}`,
  remove: id => `${BASE_URL}/users/${id}`
}
