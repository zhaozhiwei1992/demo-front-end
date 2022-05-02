<template>
  <div>
    <span v-if="prop != 'operate'">{{ row[prop] }}</span>
    <div v-if="prop == 'operate'">
      <el-button
        v-for="(item, i) in row.operate"
        :key="i"
        v-on:[eventName]="handleClick(item.click)"
        :type="item.type"
        :size="item.size"
        >{{ item.name }}</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "iCell",
  props: {
    prop: String,
    row: Object,
  },
  data() {
    return {
      eventName: "click",
    };
  },
  methods: {
    //动态绑定操作按钮的点击事件
    handleClick(i) {
      let onClick = i;
      this[onClick]();
    },

    //新增
    add() {
      alert("新增~");
    },
    //编辑
    edit() {
      alert("编辑~");
    },
    //删除
    delete() {
      alert("删除~");
    },
  },
};
</script>

<style scoped></style>