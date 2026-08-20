// $http 兼容插件：基于 axios（替代原 vue-resource，内网仓库无此包）
// 保持原调用形态：this.$http.get/post/put/delete(url, data).then(success, fail)
// 成功回调里 res.body 为数据体，与 vue-resource 一致，原有用户管理组件零改动
import axios from 'axios'

function adapt(promise) {
  // 转为 vue-resource 风格：then(successFn, failFn)，成功时传 {body}
  return {
    then(onOk, onErr) {
      return promise.then(
        (response) => onOk && onOk({ ok: true, status: response.status, body: response.data }),
        (error) => {
          if (onErr) onErr(error)
          else throw error
        }
      )
    }
  }
}

const http = {
  get: (url, config) => adapt(axios.get(url, config)),
  post: (url, data, config) => adapt(axios.post(url, data, config)),
  put: (url, data, config) => adapt(axios.put(url, data, config)),
  delete: (url, config) => adapt(axios.delete(url, config))
}

export default {
  install(Vue) {
    // 保留默认 $http，不覆盖用户自定义
    if (!Vue.prototype.$http) {
      Vue.prototype.$http = http
    }
  }
}
