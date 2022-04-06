// var server = require("./moduleserver");
// var router = require("./router");
// server.start(router);

// time timeend 时间统计
// console.time("label");
// console.log(__filename);
// console.log(__dirname);
// console.timeEnd("label");

console.log("当前目录: " + process.cwd());
console.log("当前版本: " + process.version);

console.log("内存使用情况: " + JSON.stringify(process.memoryUsage()));