var buf = Buffer.from("hello", "ascii");
console.log("tohex: " + buf.toString("hex"));
console.log("tobase64: " + buf.toString("base64"));

buf = Buffer.alloc(256);
var len = buf.write(" hello world!");
console.log("写入字节数: " + len);

// 26个字母
buf = Buffer.alloc(26);
for(var i=0; i < buf.length; i++){
    buf[i] = i + 97;
}
console.log(buf.toString("ascii"));
console.log(buf.toString("hex"));
console.log(buf.toString("base64"));

//json
buf = Buffer.from([1, 2, 3, 4]);
var json = JSON.stringify(buf);
console.log(json);

//对象复制
var copy = JSON.parse(json, function(key, value){
    return value && value.type === "Buffer"? Buffer.from(value.data): value;
});
console.log(copy);