var fs = require("fs");

// 会自动创建文件
var writeStream = fs.createWriteStream("output.txt");
var data = "hello my name is jim";
writeStream.write(data, "utf8");
//标记文件末尾
writeStream.end();

writeStream.on("finish", function(args){
    console.log("写入完成");
});

writeStream.on("error", function(data){
    console.log("写入有误: ", data);
});

console.log("程序执行结束");