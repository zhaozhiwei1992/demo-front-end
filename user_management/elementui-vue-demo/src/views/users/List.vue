<template>
  <div>
    <!-- 通过bind方式读取当前vue中alert -->
    <Alert v-if="alert" v-bind:message="alert"/>
    <!-- <el-alert v-bind:title="alter" type="success"> </el-alert> -->
  <!-- <el-alert
    v-bind:title="message"
    type="success">
  </el-alert> -->
    <h1 class="page-header">用户列表</h1>

    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      @current-change="handleCurrentChange"
      style="width: 100%"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column property="date" label="日期" width="120">
      </el-table-column>
      <el-table-column property="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column property="address" label="地址"> </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <!-- <el-button @click="setCurrent(tableData[1])">选中第二行</el-button>
    <el-button @click="setCurrent()">取消选择</el-button> -->
      <el-button @click="add()">增加用户</el-button>
      <el-button @click="update()">修改用户</el-button>
      <el-button @click="del()">删除用户</el-button>
      <el-button @click="detail()">详细信息</el-button>
    </div>
  </div>
</template>

<script>
import Alert from "../../components/Alert.vue";

export default {
  components: {
    Alert,
  },
  data() {
    return {
      tableData: null,
      currentRow: null,
      alert: "",
      // message: "hello"
    };
  },

  methods: {
    fetchUsers() {
      this.tableData = [
        {
          date: "2016-05-02",
          name: "张三",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "李四",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王五",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "赵六",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ];

      // 如果路由中有弹框则弹出提示
      if (!this.alert && this.$route.query.alert) {
        this.alert = this.$route.query.alert;
      }
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    add() {
      console.log("点击了新增按钮");
      // 要跟路由里配置的path属性匹配, name也可以
      this.$router.push({ path: "/user/add" });
    },
    update() {
      // 获取当前选中行
      // var curRow = this.$refs.singleTable.selection;
      // console.log("点击了update, 更新数据id为" + curRow);
      // this.$router.push({ path: "updateUser", params:{id: 1} });
      this.$router.push({ path: "/user/update" });
    },
    del() {
      // alert("请选择删除行");
      this.$alert('请选择删除行!', '标题名称', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
      });
    },
    detail() {
      console.log("查看明细");
      this.$router.push({ path: "/user/detail", query:{id: 1} });
    },
  },
  created() {
    // 进入页面刷新数据
    this.fetchUsers();
  },
};
</script>