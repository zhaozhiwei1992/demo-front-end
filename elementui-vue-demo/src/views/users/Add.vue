<template>
  <div class="add container">
    <h1 class="page-header">添加用户</h1>
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
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
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
    onSubmit() {
      console.log("submit!");
      this.$router.push({ path: "/users", query: { alert: "添加成功!" } });
    },
    toUserList(){
      this.$router.go(-1);
    }
  },
};
</script>