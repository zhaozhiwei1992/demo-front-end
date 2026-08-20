// 测试一个js被vue引入，并使用内部方法

let add = function(){
  alert('一个外部的新增方法');
}

let mod = function(){
  alert('一个外部的新增方法');
}

export{
  add, mod
}