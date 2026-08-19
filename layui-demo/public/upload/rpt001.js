layui.use(['layer', 'table','upload'], function () {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table,
        upload = layui.upload;

    var rptTable = table.render({
        elem: '#rptList',
        url: "/api/rpt001",
        request: {
            pageName: 'page'
            , limitName: 'size'
        },
        cellMinWidth: 95,
        page: true,
        height: "full-118",
        limits: [50, 100, 200, 500, 1000, 5000],
        limit: 100,
        // 禁止前端排序
        autoSort: false,
        id: "rptListTable",
        cols: [[
            { type: "checkbox", fixed: "left", width: 50 },
            { field: 'create_date', title: '日期 ', minWidth: 100, align: "center" },
            { field: 'dept_code', title: '部门代码 ', minWidth: 100, align: "center" },
            { field: 'dept_name', title: '部门名称 ', minWidth: 100, align: "center" },
            { field: 'agency_code', title: '单位代码 ', minWidth: 100, align: "center" },
            { field: 'agency_name', title: '单位名称 ', minWidth: 100, align: "center" },
            { field: 'exp_func_code', title: '预算科目 ', minWidth: 100, align: "center" },
            { field: 'exp_func_name', title: '科目名称 ', minWidth: 100, align: "center" },
            { field: 'pro_code', title: '项目编码 ', minWidth: 100, align: "center" },
            { field: 'pro_name', title: '项目名称 ', minWidth: 100, align: "center" },
            { field: 'pro_cat_code', title: '支出结构 ', minWidth: 100, align: "center" },
            { field: 'source_type_name', title: '预算来源 ', minWidth: 100, align: "center" },
            { field: 'manage_mof_dep_name', title: '主管处室 ', minWidth: 100, align: "center" },
            { field: 'amt', title: '金额', minWidth: 100, align: "center" }
        ]]
        ,
        done: function (res, curr, count) {
            console.log(res);
            console.log(curr);
            console.log(count);
        }
    });

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click", function () {
        table.reload("rptListTable", {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: {
                //搜索的关键字
                key: () => {
                    return $("#searchForm").serialize();
                }
            }
        })
    });

    //批量导出
    $(".export_btn").click(function () {
        var checkStatus = table.checkStatus('rptListTable'),
            data = checkStatus.data,
            idList = [];
        if (data.length > 0) {
            for (var i in data) {
                idList.push(data[i].id);
            }
        } else {
            layer.msg("导出全部?");
        }
    })

    // xml文件导入
    upload.render({
        elem: '.import_xml_btn' //绑定元素
        ,url: '/report/importXml?num=001' //上传接口
        ,accept: 'file'
        ,size: 5000 // kb
        ,done: function(res){
            layer.msg("导入成功");
            //只重载数据
            rptTable.reload();
        },error: function(){
          //请求异常回调
            layer.msg("导入失败");
        }
      });
})
