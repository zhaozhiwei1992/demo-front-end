<template>
  <div class="container">
    <!-- 通过 bind 方式读取当前 vue 中 alert -->
    <Alert v-if="alert" :message="alert" />
    <h1 class="page-header">用户列表</h1>
    <table class="table">
      <thead>
        <tr>
          <th>编号</th>
          <th>name</th>
          <th>age</th>
          <th>password</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="info" v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.age }}</td>
          <td>{{ user.password }}</td>
          <td>
            <ul class="nav navbar-nav">
              <li>
                <router-link to="/useradd" class="btn btn-default">增</router-link>
              </li>
              <li>
                <button class="btn btn-default" @click="userdel(user.id)">删</button>
              </li>
              <li>
                <router-link :to="'/userupdate/' + user.id" class="btn btn-default">改</router-link>
              </li>
              <li>
                <router-link :to="'/userdetail/' + user.id" class="btn btn-default">查</router-link>
              </li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    <div id="box">
      <input type="button" @click="fetchUsers" value="点我异步获取用户数据" />
      <input type="button" @click="extJs" value="点我测试外部引入" />
    </div>
  </div>
</template>

<script>
import Alert from '@/components/Alert'
import { USER_API } from '@/api'

export default {
  name: 'UserList',
  components: { Alert },
  data() {
    return {
      users: [],
      alert: ''
    }
  },
  methods: {
    extJs() {
      // 后端接口获取动态加载的 js, js 中应暴露一些方法
      import('./userList.js').then(res => {
        // 动态引入 userList.js, 增加一些通用方法
        res.add()
      })
    },
    fetchUsers() {
      // 用箭头函数保持 this 指向组件，避免响应式失效
      this.$http.get(USER_API.list).then(
        res => {
          this.users = res.body
          if (!this.alert && this.$route.query.alert) {
            this.alert = this.$route.query.alert
          }
        },
        () => {
          console.log('请求失败')
        }
      )
    },
    userdel(id) {
      this.$http.delete(USER_API.remove(id)).then(
        res => {
          console.log(res)
          this.alert = '删除成功, id: ' + id
          this.fetchUsers()
        },
        () => {
          console.log('删除失败')
          this.alert = '删除失败'
        }
      )
    }
  },
  created() {
    // 进入页面刷新数据
    this.fetchUsers()
  }
}
</script>
