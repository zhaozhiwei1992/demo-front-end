import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 加载 element 组件库
import ElementUI from 'element-ui'
// 加载 element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'

// 全局注册 element 组件库
Vue.use(ElementUI)
// eventBus 用于无关系组件间的通信。
Vue.prototype.$bus = new Vue() 
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
