// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import VueResource from 'vue-resource';
import 'element-ui/lib/theme-chalk/index.css';
import Home from './components/Home';
import UserList from './components/user/List';
import UserDetail from './components/user/Detail';
import UserUpdate from './components/user/Update';
import UserAdd from './components/user/Add';


Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueRouter)
Vue.use(VueResource);

const router = new VueRouter(
  {
    mode: "history",
    base: __dirname,
    routes:[
      {
        path:"/",
        component: Home
      },
      {
        path:"/users",
        component: UserList
      }
      ,
      {
        path: "/userdetail/:id",
        component: UserDetail
      }
      ,
      {
        path: "/userupdate/:id",
        component: UserUpdate
      }
      ,
      {
        path:"/useradd",
        component: UserAdd
      }
    ]
  }
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { 
    App 
  },
  template: '<App/>'
})
