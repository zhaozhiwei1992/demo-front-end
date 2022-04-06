var util = require("util");

// 面向对象, 实现person和其子对象
function Person(){
    this.name = "zhangsan";
    this.age = 18;

    // 定义在内部相当于私有方法，不能被继承
    this.sayHello = function(){
        console.log("hello my name is: " + this.name + " my age is: " + this.age);
    };
}

Person.prototype.proSayHello = function(){
        console.log("加强版 my name is: " + this.name + " my age is: " + this.age);
};

function PersonImpl(){
    this.name = "ligoudan";
    this.age = 19;
}

util.inherits(PersonImpl, Person);
var personsuper = new Person();
personsuper.sayHello();
personsuper.proSayHello();

var personImpl = new PersonImpl();
// personImpl.sayHello();
personImpl.proSayHello();

console.log("对象信息: " + util.inspect(personImpl));
console.log("内存使用情况: " + util.inspect(process.memoryUsage, true));