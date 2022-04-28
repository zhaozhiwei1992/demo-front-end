<template>
  <div id="app">
    <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav> -->

    <!-- header -->
    <navbar></navbar>
    <!-- router-link的东西会渲染到router-view部分 -->
    <router-view/>
    <!-- footer -->
    <footer></footer>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'


@Component({
  components: {
  'navbar': Navbar,
  'footer': Footer,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
