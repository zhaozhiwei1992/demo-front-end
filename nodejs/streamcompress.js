var fs = require("fs");

var zlib = require("zlib");

// 压缩
fs.createReadStream("test.txt")
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream("out.tar.gz"));

console.log("压缩完毕");

//
fs.createReadStream("out.tar.gz")
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream("test2.txt"));
console.log("解压完毕");