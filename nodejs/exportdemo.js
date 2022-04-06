function Person(){
    var name;
    this.setName = function(name){
        this.name = name;
    };

    this.sayHello = function(){
        console.log("hello, my name is " + this.name);
    };
}
module.exports = Person;