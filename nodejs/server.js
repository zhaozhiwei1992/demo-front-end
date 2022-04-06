var http = require("http");
var url = require("url");

http.createServer(function(request, response){
    //response head
    response.writeHead(200, {"Content-Type": "text/plain"});

    //resp body
    response.end("hello node js");
}).listen(8888);

console.log("server started 127.0.0.1:8888");