// 这里只写个新增方法
import View from "@/components/ui/view.vue"

export default {

  components: {
    "ui-view": View
  },
  methods: {
    //新增, 按钮需要组件使用者实现
    add() {
      alert('这是js2中的add方法'); 
      // 获取组件列表中信息
      // alert("父页面实现新增");
      // 动态调用其它js方法
      // 这种动态引进的方式，会返回一个Promise
        // import('./share.js').then(res => {
        //   // share.js是默认导出，所以通过res.default拿到数据
        //   this.shareData = res.default
        //   this.shareData.getSetDaiJiaData(this)
        // })

    },
    //编辑
    edit() {
      alert("父页面实现编辑, common.js edit");
    },
    //删除
    delete() {
      alert("父页面实现删除, common.js delete");
    },
  },
};