<template>
  <div class="add container">
    <h1 class="page-header">用户详情</h1>
    <router-link to="/users" class="btn btn-default">返回</router-link>
    <div class="row clearfix">
      <div class="col-md-12 column">
        <UserForm mode="detail" :initial-user="user" />
      </div>
    </div>
  </div>
</template>

<script>
import UserForm from '@/components/UserForm'
import { USER_API } from '@/api'

export default {
  name: 'UserDetail',
  components: { UserForm },
  data() {
    return {
      user: { id: '', name: '', age: '', password: '' }
    }
  },
  methods: {
    fetchUserById(id) {
      this.$http.get(USER_API.detail(id)).then(
        res => {
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
