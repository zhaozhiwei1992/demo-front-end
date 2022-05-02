<template>

  <div class="add container">
    <h1 class="page-header">用户详情</h1>
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
        <el-button @click="toUserList()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  // 这里初始化对象不能少，否则一片红
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
    fetchUserById(id) {
      console.log("传入id为:" + id)
        this.form = {name: "zhangsan", region:"北京"};
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