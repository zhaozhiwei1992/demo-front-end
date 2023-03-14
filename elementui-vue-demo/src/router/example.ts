import UITable from "../views/example/TableExample.vue";
import UIEditform from "../views/example/FormExample.vue";
import UILefttree from "../views/example/MenuExample.vue";
import UIToolbutton from "../views/example/ButtonExample.vue";
import UIFull from "../views/example/DynamicComponentSample.vue";
import DynamicJSView from "../views/example/DynamicComponentExtJS.vue";

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
  },
  {
    path: "/example/ui/full/2",
    name: "uiFull2",
    component: DynamicJSView
  }
];
