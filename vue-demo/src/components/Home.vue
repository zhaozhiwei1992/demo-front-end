<template>
  <div class="container">
    <div class="starter-template">
      <h1>Bootstrap starter template</h1>
      <p class="lead">
        Use this document as a way to quickly start any new project.
        <br />All you get is this text and a mostly barebones HTML document.
      </p>
      <h1>{{ msg }}</h1>
    </div>
  </div>
  <!-- /.container -->
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      msg: "This is Home Page",
    };
  },
};
</script>