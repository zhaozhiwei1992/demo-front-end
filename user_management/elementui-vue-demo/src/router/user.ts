import UserList from "../views/users/List.vue";
import UserUpdate from "../views/users/Update.vue";
import UserDetail from "../views/users/Detail.vue";

export default [
  {
    path: "/users",
    name: "users",
    component: UserList,
  },
  {
    path: "/user/add",
    name: "addUser",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/users/Add.vue"),
  },
  {
    path: "/user/update",
    name: "updateUser",
    component: UserUpdate,
  },
  {
    path: "/user/detail",
    name: "userDetail",
    component: UserDetail,
  },
];
