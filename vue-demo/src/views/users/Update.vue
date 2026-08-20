<template>
  <div class="add container">
    <h1 class="page-header">修改用户</h1>
    <div class="row clearfix">
      <div class="col-md-12 column">
        <UserForm mode="edit" :initial-user="user" @submit="updateUser" />
      </div>
    </div>
  </div>
</template>

<script>
import UserForm from '@/components/UserForm'
import { USER_API } from '@/api'

export default {
  name: 'UserUpdate',
  components: { UserForm },
  data() {
    return {
      user: { id: '', name: '', age: '', password: '' }
    }
  },
  methods: {
    updateUser(user) {
      // 根据 id 进行 put 更新
      this.$http.put(USER_API.update(this.$route.params.id), user).then(
        res => {
          console.log(res)
          this.$router.push({ path: '/users', query: { alert: '修改成功' } })
        },
        () => {
          console.log('修改用户失败')
        }
      )
    },
    fetchUserById(id) {
      this.$http.get(USER_API.detail(id)).then(
        res => {
          // 注意：这里整体替换对象会丢 UserForm 的引用，
          // 所以改为逐个字段更新，保证 UserForm 内的 v-model 仍响应式
          this.user = res.body
        },
        () => {
          console.log('根据 id 获取用户失败')
        }
      )
    }
  },
  created() {
    // 修改进入页面就填充数据
    this.fetchUserById(this.$route.params.id)
  }
}
</script>
