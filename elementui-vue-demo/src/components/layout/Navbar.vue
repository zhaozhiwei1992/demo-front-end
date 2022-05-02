<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal"  router @select="handleSelect">
  <el-menu-item index="/">首页</el-menu-item>
  <el-submenu index="/users">
    <template slot="title">用户列表</template>
    <el-menu-item index="/users">用户列表</el-menu-item>
    <el-menu-item index="/user/add">新增用户</el-menu-item>
    <el-menu-item index="/user/update">用户修改</el-menu-item>
    <el-menu-item index="/user/detail">用户详情</el-menu-item>
  </el-submenu>
  <el-submenu index="/examples">
    <template slot="title">界面组件demo</template>
    <el-menu-item index="/example/ui/toolbutton">按钮区</el-menu-item>
    <el-menu-item index="/example/ui/table">列表区</el-menu-item>
    <el-menu-item index="/example/ui/editform">编辑区</el-menu-item>
    <el-menu-item index="/example/ui/lefttree">左侧树</el-menu-item>
    <el-menu-item index="/example/ui/full">完整界面</el-menu-item>
  </el-submenu>
  <el-menu-item index="/about">关于</el-menu-item>
  <el-menu-item index="/login">登录</el-menu-item>
</el-menu>
</template>

<script>
export default {
    data() {
      return {
        activeIndex: '/',
        activeIndex2: '/users'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
