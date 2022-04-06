var http = require("http");
var url = require("url");


exports.start = function(router){
    http.createServer(function(request, response){
        var path = url.parse(request.url).pathname;
        // router.route(path);



        // resp head
        response.writeHead(200, {"Content-Type": "text/plain"});
        // resp body
        response.write("module response");

        // response request paam
        var param = url.parse(request.url, true).query;
        response.write("姓名: " + param.name);

        response.end();
    }).listen(8888);
    console.log(" a server started 127.0.0.1:8888");
};

var server = require("./moduleserver");
server.start();
