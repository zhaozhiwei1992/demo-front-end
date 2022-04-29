<template>
  <div class="add container">
    <h1 class="page-header">修改用户</h1>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-select v-model="form.region" placeholder="地址">
          <el-option label="北京" value="beijing"></el-option>
          <el-option label="上海" value="shanghai"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册日期">
        <el-col :span="11">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form.date1"
            style="width: 100%"
          ></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateUser()">提交</el-button>
        <el-button @click="toUserList()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
      },
    };
  },
  methods: {
    // 传入e, 阻止默认事件
    updateUser() {
      // console.log(123);
      //根据id进行put更新
      // this.$http.put("http://localhost:3000/users/" + this.$route.params.id, this.user).then(
      //   function(res) {
      //     console.log(res);
      //     this.$router.push({ path: "/users", query: { alert: "修改成功" } });
      //   },
      //   function() {
      //     console.log("修改用户失败");
      //   }
      // );

       this.$router.push({ path: "/users", query: { alert: "修改成功" } });
      // e.preventDefault();
    },
    fetchUserById(id) {
      // this.$http.get("http://localhost:3000/users/" + id).then(
      //   function(res) {
      //     console.log(res);
      //     this.user = res.body;
      //   },
      //   function() {
      //     console.log("根据id获取用户失败");
      //   }
      // );
    },
    toUserList(){
      this.$router.go(-1);
    }
  },
  created() {
    // 修改进入页面就填充数据
    this.fetchUserById(this.$route.query.id);
  }
};
</script>
