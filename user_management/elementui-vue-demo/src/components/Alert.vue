<template>
  <div class="alert">
    <!-- <el-alert
    v-bind:title="message"
    type="info">
    </el-alert>-->
  </div>
</template>

<script>
export default {
  name: "Alert",
  props: ["message"],
  data() {
    return {
      message: ""
    };
  },
  created() {
    if (this.message) {
      this.$message(this.message);
    }
  }
};
</script>
