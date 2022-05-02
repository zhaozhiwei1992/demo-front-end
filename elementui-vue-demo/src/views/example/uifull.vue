<template>
  <div>
    <!-- TODO  这里还得自己写组件, 需要处理为动态 -->
    <!-- <ui-editform v-bind:menuid="xx"></ui-editform>
    <ui-toolbutton v-bind:menuid="xx"></ui-toolbutton>
    <ui-table
      v-bind:menuid="xx"
      v-bind:tableData="tabDatas"
      ref="singleTable"
    ></ui-table> -->

    <!-- 动态加载方式 -->
    <ui-view v-bind:menuid="xx" ref="mainRef"></ui-view>
  </div>
</template>

<script>
// 这里也得动态引入
// import Editform from "@/components/ui/editform.vue";
// import Table from "@/components/ui/table.vue";
// import Toolbutton from "@/components/ui/toolbutton.vue";
import View from "@/components/ui/view.vue"

export default {
  data() {
    return {
      xx: "test",
      tabDatas: null,
    };
  },
  components: {
    // "ui-editform": Editform,
    // "ui-table": Table,
    // "ui-toolbutton": Toolbutton,
    "ui-view": View
  },
  mounted() {
    this.initTableData();
  },
  methods: {
    // 自定义加载数据填充列表
    initTableData() {
      this.tabDatas = [
        {
          name: "张三",
          sex: "男",
          age: "18",
        },
        {
          name: "李四",
          sex: "女",
          age: "16",
        },
        {
          name: "王五",
          sex: "女",
          age: "20",
        },
      ];

      this.$refs.mainRef.setTableDatas("singleTable", this.tabDatas);
    },
    setCurrent() {
      // 操作表格选中一行
      this.$refs.mainRef.setTableCurrentRow("singleTable", this.tabDatas[1]);
      // this.$refs.singleTable.setCurrentRow(this.tabDatas[1]);
    },
    //新增, 按钮需要组件使用者实现
    add() {
      alert("父页面实现新增");
    },
    //编辑
    edit() {
      alert("父页面实现编辑");
    },
    //删除
    delete() {
      alert("父页面实现删除");
    },
  },
};
</script>