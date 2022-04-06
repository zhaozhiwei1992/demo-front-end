<template>
  <div id="app">
    <nav-header></nav-header>
    <nav-navbar></nav-navbar>
    <router-view />
    <!-- <nav-footer></nav-footer> -->
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
export default {
  name: "app",
  data() {
    return {};
  },
  components: {
    //局部注册组件这里，可能会定义多个组件，所以component这个单词加上“s”
    "nav-header": Header,
    "nav-footer": Footer,
    "nav-navbar": Navbar
  }
};
</script>
