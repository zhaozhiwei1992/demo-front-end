import UITable from "../views/example/uitable.vue";
import UIEditform from "../views/example/uieditform.vue";
import UILefttree from "../views/example/uilefttree.vue";
import UIToolbutton from "../views/example/uitoolbutton.vue";
import UIFull from "../views/example/uifull.vue";

export default [
  {
    path: "/example/ui/table",
    name: "uitable",
    component: UITable,
  },
  {
    path: "/example/ui/editform",
    name: "uieditform",
    component: UIEditform,
  },
  {
    path: "/example/ui/lefttree",
    name: "uiLefttree",
    component: UILefttree,
  },
  {
    path: "/example/ui/toolbutton",
    name: "uiToolbutton",
    component: UIToolbutton,
  },
  {
    path: "/example/ui/full",
    name: "uiFull",
    component: UIFull
  }
];
