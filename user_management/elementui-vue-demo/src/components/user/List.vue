<template>
  <div class="list">
    <!-- 通过bind方式读取当前vue中alert -->
    <Alert v-if="alert" v-bind:message="alert" />

    <el-row>
      <el-button type="primary" @click="addUser">新增用户</el-button>
    </el-row>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="编号" width="100"></el-table-column>
      <el-table-column prop="date" label="日期" width="150"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="province" label="省份" width="120"></el-table-column>
      <el-table-column prop="city" label="市区" width="120"></el-table-column>
      <el-table-column prop="address" label="地址" width="300"></el-table-column>
      <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="viewUser(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="updateUser(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteUser(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Alert from "../Alert";

export default {
  name: "List",
  components: {
    Alert
  },
  methods: {
    addUser() {
      this.$router.push("/useradd/");
    },
    viewUser(row) {
      this.$router.push({ path: "/userdetail/" + row.id });
    },
    updateUser(row) {
      this.$router.push({ path: "/userupdate/" + row.id });
    },
    deleteUser(row) {
      this.$http
        .delete("http://localhost:3000/users/" + row.id)
        .then(function() {
          console.log("删除成功");
          this.allUser();
        });
    },
    allUser() {
      if (this.$route.query.alert) {
        this.alert = this.$route.query.alert;
      }
      this.$http.get("http://localhost:3000/users").then(
        function(res) {
          console.log(res);
          this.tableData = res.body;
        },
        function() {
          console.log("获取用户信息失败");
        }
      );
    }
  },

  data() {
    return {
      tableData: [],
      alert: ""
    };
  },

  created() {
    this.allUser();
  }
};
</script>