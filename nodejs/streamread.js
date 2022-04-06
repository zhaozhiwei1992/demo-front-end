var fs = require("fs");

fs.stat("test.txt", function(error, stat){
    console.log("这是不是个文件? " + stat.isFile());
});
var data="";
var readerStream = fs.createReadStream("test.txt");

readerStream.setEncoding("utf8");
readerStream.on("data", function(temdata){
    console.log("数据准备好了: " + temdata);
    data += temdata;
});

readerStream.on("end", function(temdata){
    console.log("搞完了: " + temdata); //没有数据
});

readerStream.on("error", function(temdata){
    console.log("有问题: " + temdata);
});

console.log("执行完了");