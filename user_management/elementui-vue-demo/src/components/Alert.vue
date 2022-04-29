<template>
  <el-alert
    v-bind:title="message"
    type="success">
  </el-alert>
</template>

<script>
export default {
  name: "Alert",
  //接收外部消息
  props: ["message"],
  data() {
    return {};
  },
};
</script>
