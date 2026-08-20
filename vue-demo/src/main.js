// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import Home from './components/Home'
import About from './components/About'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import UsersList from './components/users/List'
import HttpPlugin from './plugins/http'
import UserAdd from './components/users/Add'
import UserUpdate from './components/users/Update'
import UserDetail from './components/users/Detail'
import AiFormFlow from './components/AiFormFlow'


Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(HttpPlugin)

//路由配置
const router = new VueRouter({
  routes:[
    {path:'/', component: Home}, //默认主页面
    {path:'/about', component: About},
    {path:'/users', component: UsersList},
    {path:'/useradd', component: UserAdd},
    {path:'/userupdate/:id', component: UserUpdate},
    {path:'/userdetail/:id', component: UserDetail},
    {path:'/ai-fsm', component: AiFormFlow}
  ]
})

// 所有的页面请求都会刷到router-view中
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { 
    App,
    'navbar': Navbar,
    'footer': Footer
  },
  // template直接替换了app.vue中的template
  template: `
  <div id="app">
  <navbar></navbar>
  <router-view></router-view>
  <footer></footer>
  </div>
  `
})