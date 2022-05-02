<template>
  <el-row>
    <el-button type="primary" plain>保存</el-button>
    <el-button type="primary" plain>送审</el-button>
    <el-button type="primary" plain>审核</el-button>
    <el-button type="primary" plain>来源去向</el-button>

    <el-button
      :type="item.type"
      plain
      v-for="(item, i) in buttonArray"
      :key="i"
      v-on:[eventName]="handleClick(item.click)"
      :size="item.size"
      >{{ item.name }}</el-button>
  </el-row>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      // 按钮组
      buttonArray: [],
      eventName: "click",
    };
  },
  mounted() {
    this.getButtonData();
  },
  methods: {
    getButtonData() {
      // 获取动态表单数据
      axios.get("/json/uitoolbutton.json").then((data) => {
        let response = data.data.data;
        console.log(response);
        this.buttonArray = response;
      });
    },
    //动态绑定操作按钮的点击事件
    handleClick(i) {
      let onClick = i;
      this[onClick]();
    },
    //新增, 按钮需要组件使用者实现
    add() {
      alert("新增");
    },
    //编辑
    edit() {
      alert("编辑");
    },
    //删除
    delete() {
      alert("删除");
    },
  },
};
</script>

<style scoped>
</style>