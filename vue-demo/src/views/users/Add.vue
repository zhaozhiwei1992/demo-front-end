<template>
  <div class="add container">
    <h1 class="page-header">添加用户</h1>
    <div class="row clearfix">
      <div class="col-md-12 column">
        <UserForm mode="add" @submit="addUser" />
      </div>
    </div>
  </div>
</template>

<script>
import UserForm from '@/components/UserForm'
import { USER_API } from '@/api'

export default {
  name: 'UserAdd',
  components: { UserForm },
  methods: {
    addUser(user) {
      this.$http.post(USER_API.add, user).then(
        res => {
          console.log(res)
          // 增加成功后跳转列表页面, 给 list 页面传入 alert 参数
          this.$router.push({ path: '/users', query: { alert: '添加成功!' } })
        },
        () => {
          console.log('添加用户失败')
        }
      )
    }
  }
}
</script>
