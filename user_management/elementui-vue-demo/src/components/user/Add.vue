<template>
  <div class="add">
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
        <el-button type="primary" @click="saveUser">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {}
    };
  },
  methods: {
    cancel(){
      this.$router.push("/users");
    },
    saveUser() {
      this.$http.post("http://localhost:3000/users/", this.user).then(
        function(res) {
          console.log("保存成功");
          // console.log(res);
          this.$router.push({path:"/users", query:{alert:"保存成功"}});
        },
        function() {
          console.log("保存数据失败");
        }
      );
    }
  }
};
</script>