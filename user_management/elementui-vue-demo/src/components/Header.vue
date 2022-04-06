<template>
<div id="header">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
        >
          <el-menu-item index="1">
            用户管理系统
            </el-menu-item>
          <el-submenu index="2">
            <template slot="title">Home</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项1</el-menu-item>
              <el-menu-item index="2-4-2">选项2</el-menu-item>
              <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="3">
            <router-link to="/users">用户列表</router-link>
            </el-menu-item>
          <el-menu-item index="4">
            <router-link to="/about">关于</router-link>
          </el-menu-item>
        </el-menu>
        <div class="line"></div>
      </el-header>
    </el-container>
</div>
</template>
<script>
    export default {
        name: "nav-header",
        data (){
            return {
            }
        }
    }
</script>