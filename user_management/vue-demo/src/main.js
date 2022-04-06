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
import VueResource from 'vue-resource'
import UserAdd from './components/users/Add'
import UserUpdate from './components/users/Update'
import UserDetail from './components/users/Detail'


Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(VueResource)

//路由配置
const router = new VueRouter({
  mode:'history',
  base: __dirname,
  routes:[
    {path:'/', component: Home}, //默认主页面
    {path:'/about', component: About},
    {path:'/users', component: UsersList},
    {path:'/useradd', component: UserAdd},
    {path:'/userupdate/:id', component: UserUpdate},
    {path:'/userdetail/:id', component: UserDetail}
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