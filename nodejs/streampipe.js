var fs = require("fs");

var readerStream = fs.createReadStream("test.txt");

var writeStream = fs.createWriteStream("output.txt");

readerStream.pipe(writeStream);

console.log("执行结束");