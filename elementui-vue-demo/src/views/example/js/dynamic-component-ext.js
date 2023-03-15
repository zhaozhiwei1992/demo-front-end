import common from './common.js'

export default {
  data() {
    return {
      xx: "test",
      tabDatas: null,
    };
  },
  mounted() {
    this.initTableData();
    // 这种方式引入的, 貌似调用不到
    // var scripts = [
    //   "js/js1.js",
    //   "js/js2.js"
    // ];
    // scripts.forEach(script => {
    //   let tag = document.createElement("script");
    //   tag.setAttribute("src", script);
    //   document.head.appendChild(tag);
    // });
  },
  created() {
    // this.$refs.mainRef.toolbutton.$on('buttonClick', this.myDefine)
    this.$bus.$off("buttonClick").$on("buttonClick", (item) => {
          return this[item.click](item)
        });  
  },
  methods: {
    // 方法只能在这里展开, 否则无法覆盖
    // 引入common所有方法, 业务可进行覆盖
    ...common.methods,
    // 自定义加载数据填充列表
    initTableData() {
      this.tabDatas = [
        {
          name: "张三",
          sex: "男",
          age: "18",
        },
        {
          name: "李四",
          sex: "女",
          age: "16",
        },
        {
          name: "王五",
          sex: "女",
          age: "20",
        },
      ];

      this.$refs.mainRef.setTableDatas("singleTable", this.tabDatas);
    },
    setCurrent() {
      // 操作表格选中一行
      this.$refs.mainRef.setTableCurrentRow("singleTable", this.tabDatas[1]);
      // this.$refs.singleTable.setCurrentRow(this.tabDatas[1]);
    },
    //新增, 按钮需要组件使用者实现
    add(item) {
      console.log('按钮组件信息', item);
      alert('这是js2中的add方法'); 
      // 获取组件列表中信息
      // alert("父页面实现新增");
      // 动态调用其它js方法
      // 这种动态引进的方式，会返回一个Promise
      // 根据后端返回js集合, 如 /common/common.js, /xx/xx.js, 遍历import, 请求业务js实现统一模板
      // 弊端: 有一个统一js需要写入到所有方法签名, 后边可能乱套
      // 优势: 只需要写一个vue文件
        // import('./业务.js').then(res => {
        //   this.shareData = res.default
        //   this.shareData.add(this)
        // })

    },
  },
};