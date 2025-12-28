---
outline: deep
---

# JavaScript 语言精粹随笔


> 不愧是大师 Douglas 的作品  
> 每读一遍都有不同的收获  
> 更加严谨而又有艺术的代码风格  

### 添加类型拓展方法
```javascript
Function.prototype.extend = function(name, func){
  if(!this.prototype[name] && typeof func === 'function'){
    return this.prototype[name] = func;
  }
};

Number.extend('padZero', function(){
  var num = parseInt(this);
  return num > 9 ? num : '0' + num;
});
```

### 递归记忆
```javascript
// 没有记忆的递归
function func1(n){
  return n === 1 || n === 0 ? 1 : func1(n -1) + n;
}
// 采用闭包进行递归记忆
function recursiveExt(arr, formula){
  return function(n){
    var res = arr[n];
    if(typeof res !== 'number'){
      res = formula(arguments.callee, n);
      arr[n] = res;
    }
    return res;
  };
}

var func2 = recursiveExt([0, 1], function(foo, n){
  return foo(n - 1) + n;
});
```

### 数组的判断
```javascript
// > 1
function isArray(arr){
  return arr && typeof arr === 'object' && arr.constructor === Array;
}

// > 2
function isArray(arr){
  return Object.prototype.toString.apply(arr) === '[object Array]';
}
```

### 构造一个单位矩阵
```javascript
Array.matrix = function(n, m, initial){
  var i, j, temp, res = [];
  for(i = 0; i < n; i++){
    temp = [];
    for(j = 0; j < m; j++){
      temp[j] = initial;
    }
    res[i] = temp;
  }
  return res;
};

Array.indentity = function(n){
  var i, res = Array.matrix(n, n, 0);
  for(i = 0; i < n; i++){
    res[i][i] = 1;
  }
  return res;
};
```

### Array

##### concat
- `array.concat(item...)`
- 返回一个新数组，不改变原数组
- 对 array 和 item 浅复制

#####  join
- `array.join(separator)`
- 把一个数组构造成一个字符串，不改变原数组， separator 默认是逗号 `,`
- （先把 array 中的每个元素都构造成一个字符串，然后再通过 separator 分隔符把它们连接起来）

##### push
- `array.push(item...)`
- 往数组尾部添加元素，返回新数组长度，改变原数组
- 把 item 当作一个元素添加数组
```javascript
// 模拟 push
// 原版
// > 1
Array.method('simPush', function(){
  this.splice.apply(this, [this.length, 0].concat(Array.prototype.slice.apply(arguments)));
  return this.length;
});

// > 2
Array.method('simPush', function(){
  var i, tLen = this.length, len = arguments.length;
  for(i = 0; i < len; i++){
    this[tLen + i] = arguments[i];
  }
  return this.length;
});
```

##### pop
- `array.pop()`
- 从数组的尾部删除一个元素，返回删除的元素，改变原数组
```javascript
// 模拟 pop
Array.method('simPop',  function(){
  return this.splice(this.length - 1, 1)[0];
});
```

##### unshift
- `array.unshift(item...)`
- 往数组头部添加元素，返回新数组长度，改变原数组
- 同 push

##### shift
- `array.shift()`
- 从数组的头部删除一个元素，返回删除的元素，改变原数组

##### reverse
- `array.reverse()`
- 反转数组，返回反转后的数组，改变原数组
- array 和返回值一样

##### sort
- `array.sort()`
- `array.sort(function)`
- 对数组进行排序，返回排序后的数组，改变原数组
- 如果直接使用不传参数，则按照 ASCII 进行逐个字符比较排序
```javascript
// 不同类型的数组排序
var newArr = arr.sort(function(a, b){
  if(a === b){
    return 0;
  }
  if(typeof a === typeof b){
    return a < b ? -1 : 1;
  }
  return typeof a < typeof b ? -1 : 1;
});

// 对象数组排序，指定排序字段
function by(name){
  return function(a, b){
    var x, y;
    if(typeof a === 'object' && typeof b === 'object' && a && b){
      x = a[name];
      y = b[name];
      if(x === y){
        return 0;
      }
      if(typeof x === typeof y){
        return x > y ? 1 : -1;
      }
      return typeof x > typeof y ? 1 : -1;
    }else {
      throw {
        name: 'Error',
        message: 'Expected an object when sorting by' + name
      };
    }
  };
}
// 在 arr 对象数组中按照 name 字段进行排序
var newArr = arr.sort(by('name'));
```

##### slice
- `array.slice(start, end)`
- 截取数组，返回截取的数组，不改变原数组
- slice 方法对 array 中的一段做浅复制
- end 可选，默认值为数组的长度
- 如果两个参数中的任何一个是负数，array.length 会和它们相加，试图让它们变为非负数
- 如果 start 大于 array.length ，得到一个空数组

##### splice
- `array.splice(start, deleteCount, item...)`
- 从 array 中移除一个或多个元素，并用新的 item 替换它们，返回改变后的数组，改变原数组

##### hasOwnProperty
- `object.hasOwnProperty(name)`
- 检索一个对象上是否包含 name 属性，返回 boolean
- 不会在原型链上检索

### String

##### replace
- `string.replace(searchValue, replaceValue)`
- 对 string 进行查找替换，返回替换后的字符串，不改变原字符串
- searchValue 可以是一个字符串 或是一个正则表达式
- replaceValue 可以是一个字符串 或是一个函数
    + 如果为函数，该函数返回的字符串会替换文本
    + 传递给这个函数的第一个参数是整个匹配的文本
    + 第二个参数是分组 1 捕获的文本，以此类推

##### split
- `string.split(separator, limit)`
- 把一个 string 分割成片断来创建一个字符串数组，返回新创建的数组，不改变原字符串
- separator 可以是一个字符串 或是一个正则表达式
- limit （number）可选，用于限制被分割的片断数量

##### charAt
- `string.charAt(pos)`
- 返回在 string 中的 pos 位置处的字符，不改变原字符串
- 如果 pos 小于 0 或大于 string.length  返回空字符串

##### charCodeAt
- `string.charCodeAt(pos)`
- 返回 pos 位置的 ASCII

##### concat
- `string.concat(string...)`

##### indexOf
- `string.indexOf(searchString, position)`
- 在 string 内查找另一个字符串 searchString
- 如果找到，返回第一个匹配字符的位置，否则返回 －1
- 可选参数 position 可设置从 string 的某个指定的位置开始查找

##### lastIndexOf
- `string.lastIndexOf(searchString, position)`
- 同上

##### *localeCompare*
- `string.localeCompare(that)`

##### match
- `string.match(regexp)`
- string 同正则去匹配，返回匹配项
- 它依据 g 标识来决定如何匹配
- 如果没有 g 标识 `string.match(regexp)` 和 `regexp.exec(string)` 结果相同
- 如果有 g 标识 那么返回一个包含所有匹配（除捕获分组之外）的所有数组
```javascript
var str = '<ghjhjk></fdsf>hjhj134hjk67</jkl>';
var reg = /[^<>]+|<(\/?)([A-Za-z]+)([^<>]*)>/g;
var res1 = reg.exec(str);
var res2 = str.match(reg);
console.log(res1);  // ["<ghjhjk>", "", "ghjhjk", "", index: 0, input: "<ghjhjk></fdsf>hjhj134hjk67</jkl>"]
console.log(res2);  // ["<ghjhjk>", "</fdsf>", "hjhj134hjk67", "</jkl>"]
```

##### search
- `string.search(regexp)`
- 和 indexOf 方法很相似
- 如果匹配成功，返回第一个匹配的首字符位置
- 如果不成功返回 －1
- 此方法忽略 g 标识

##### slice
- `string.slice(start, end)`
- 同 `array.slice(start, end)`

##### substring
- `string.substring(start, end)`
- 同 slice 

##### substr
- `string.substr(start, length)`
- 同 slice

##### toLowerCase
- `string.toLowerCase()`
- 转小写

##### toUpperCase
- `string.toUpperCase()`
- 转大写

##### toLocaleLowerCase
- `string.toLocaleLowerCase()`
- 本地化转小写

##### toLocaleUpperCase
- `string.toLocaleUpperCase()`
- 本地化转大写

##### fromCharCode
- `String.formCharCode(char...)`
- 根据一串数字编码返回一个字符串
```javascript
console.log(String.fromCharCode(1, 33, 55, 66));
// -> !7B
```

