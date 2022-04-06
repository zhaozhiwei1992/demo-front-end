var fs = require("fs");

// sync
var data = fs.readFileSync("test.txt");
 console.log(data.toString());
 console.log("finish sync!");

// no sync
var data = fs.readFile("test.txt", function(error, data){
    if(error){
        console.log(error);
    }
    console.log(" no sync: " + data.toString());
});
console.log("no sync finished!");