<template>
  <div class="add container">
      <h1 class="page-header">添加用户</h1>
    <div class="row clearfix">
      <div class="col-md-12 column">
        <form role="form" v-on:submit="addUser">
          <div class="form-group">
            <label for="userid">id</label>
            <input type="text" class="form-control" id="userid" v-model="user.id"/>
          </div>
          <div class="form-group">
            <label for="username">name</label>
            <input type="text" class="form-control" placeholder="username" id="username" v-model="user.name"/>
          </div>
          <div class="form-group">
            <label for="userage">age</label>
            <input type="text" class="form-control" placeholder="age" id="userage" v-model="user.age"/>
          </div>
          <div class="form-group">
            <label for="userpassword">password</label>
            <input type="password" class="form-control" placeholder="password" id="userpassword" v-model="user.password"/>
          </div>
          <!-- form制定submit -->
          <button type="submit" class="btn btn-default">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "useradd",
    // 这里初始化对象不能少，否则一片红
    data(){
        return{
            user:{}
        }
    },
    methods:{
        // 传入e, 阻止默认事件
        addUser(e){
            // console.log(123);
            this.$http.post("http://localhost:3000/users", this.user).then(
                function(res){
                    console.log(res);
                    // 增加成功后跳转列表页面, 给list页面传入alert参数
                    this.$router.push({path:"/users", query:{alert: "添加成功!"}});
                },
                function(){
                    console.log("添加用户失败");
                }
            )
            e.preventDefault();
        }
    }
}
</script>