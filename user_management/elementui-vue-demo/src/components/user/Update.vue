<template>
  <div class="update">
    <el-form ref="form" :model="user" label-width="80px">
      <el-form-item label="编号">
        <el-input v-model="user.id"></el-input>
      </el-form-item>
      <el-form-item label="日期">
        <el-input v-model="user.date"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="省份">
        <el-input v-model="user.province"></el-input>
      </el-form-item>
      <el-form-item label="市区">
        <el-input v-model="user.city"></el-input>
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="user.address"></el-input>
      </el-form-item>
      <el-form-item label="邮编">
        <el-input v-model="user.zip"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUser">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Update",
  data() {
    return {
      user: {}
    };
  },
  methods: {
    cancel(){
      this.$router.push("/users");
    },
    updateUser() {
      this.$http
        .put("http://localhost:3000/users/" + this.user.id, this.user)
        .then(
          function(res) {
            console.log("更新成功");
            // console.log(res);
            this.$router.push({path:"/users", query:{alert:"更新成功"}});
            // this.$router.push("/users");
          },
          function() {
            console.log("更新数据失败");
          }
        );
    },
    fetchUserById(id) {
      this.$http.get("http://localhost:3000/users/" + id).then(
        function(res) {
          // console.log(res);
          this.user = res.body;
        },
        function() {
          console.log("获取数据失败");
        }
      );
    }
  },
  created() {
    this.fetchUserById(this.$route.params.id);
  }
};
</script>