<template>
  <div id="app">
    <!-- el contaner可以嵌套 -->
    <el-container>
      <el-header class="el-header" style="background-color: black">
        <navbar></navbar>
      </el-header>
      <!-- <el-container> -->
      <!-- <el-aside width="200px"> -->
      <!--引入自定义左侧菜单栏-->
      <!-- <left-menu></left-menu> -->
      <!-- </el-aside> -->
      <el-main>
        <!--引入跳转路由-->
        <router-view></router-view>
      </el-main>
      <!-- </el-container> -->
      <el-footer>
        <Footer></Footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import Navbar from "./components/layout/Navbar.vue";
import Footer from "./components/layout/Footer.vue";

@Component({
  components: {
    navbar: Navbar,
    Footer,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
 .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /* line-height: 160px; */
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
