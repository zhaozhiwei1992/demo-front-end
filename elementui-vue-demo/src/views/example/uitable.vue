<template>
  <div>
    <el-table :data="tableData" class="table_bsm">
      <el-table-column
        v-for="(col, index) in cols"
        :key="index"
        :prop="col.prop"
        :label="col.label"
      >
        <template slot-scope="scope">
          <i-cell :prop="col.prop" :row="scope.row"></i-cell>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import iCell from "./iCell";
export default {
  components: {
    iCell,
  },
  data() {
    return {
      cols: [
        { prop: "name", label: "姓名" },
        { prop: "sex", label: "性别" },
        { prop: "age", label: "年龄" },
        { prop: "operate", label: "操作" },
      ],
      tableData: [
        {
          name: "张三",
          sex: "男",
          age: "18",
          operate: [
            { name: "新增", type: "primary", size: "mini", click: "add" },
            { name: "编辑", type: "danger", size: "mini", click: "edit" },
            { name: "删除", type: "primary", size: "mini", click: "delete" },
          ],
        },
        {
          name: "李四",
          sex: "女",
          age: "16",
          operate: [
            { name: "新增", type: "primary", size: "mini", click: "add" },
            { name: "编辑", type: "danger", size: "mini", click: "edit" },
            { name: "删除", type: "primary", size: "mini", click: "delete" },
          ],
        },
        {
          name: "王五",
          sex: "女",
          age: "20",
          operate: [
            { name: "新增", type: "primary", size: "mini", click: "add" },
            { name: "编辑", type: "danger", size: "mini", click: "edit" },
            { name: "删除", type: "primary", size: "mini", click: "delete" },
          ],
        },
      ],
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.table_bsm {
  width: 98%;
  margin: auto;
}
</style>