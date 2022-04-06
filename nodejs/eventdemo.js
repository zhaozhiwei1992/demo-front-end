var events = require("events");

var eventEmitter = new events.EventEmitter();

// 监听事件
eventEmitter.on("testevent", function(args){
    console.log("observer1: --> " + args);
});

eventEmitter.on("testevent", function(args){
    console.log("observer2: -- > " + args);
});

// 
var listen1 = function(args){
    console.log("listen1执行");
};
eventEmitter.on("testevent", listen1);

console.log("触发前: " + eventEmitter.listenerCount("testevent"));
// 触发事件
eventEmitter.emit("testevent", [1, 2]);
eventEmitter.removeListener("testevent", listen1);
console.log("触发后: " + eventEmitter.listenerCount("testevent"));