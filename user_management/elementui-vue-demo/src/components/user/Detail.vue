<template>
  <div class="detail">
    <el-input v-model="user.id" label="编号" :disabled="true" width="100"></el-input>
    <el-input v-model="user.date" label="日期" width="150"></el-input>
    <el-input v-model="user.name" label="姓名" width="120"></el-input>
    <el-input v-model="user.province" label="省份" width="120"></el-input>
    <el-input v-model="user.city" label="市区" width="120"></el-input>
    <el-input v-model="user.address" label="地址" width="300"></el-input>
    <el-input v-model="user.zip" label="邮编" width="120"></el-input>
    <router-link to="/users">返回</router-link>
  </div>
</template>

<script>
export default {
  name: "Detail",
  data() {
    return {
      user: {}
    };
  }
  ,
  methods:{
    fetchUserById(id){
      this.$http.get("http://localhost:3000/users/" + id).then(
        function(res){
          // console.log(res);
          this.user = res.body;
        },
        function(){
          console.log("获取数据失败");
        }
      )
    }
  }
  ,
  created(){
    this.fetchUserById(this.$route.params.id);
  }
};
</script>