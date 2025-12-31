---
outline: deep
---

# Angular 之 $q 实现 promise 源码解读(01)

全面解读 angular 的 $q 机制  

> AngularJS v1.4.8
> 
> 该代码块基于源码进行了删减  
> 该代码块仅用于学习 分享 交流  
> 为了代码的清晰，修改了部分非核心代码，并且删除了所有的异常处理  
> 以下为 angular $q 的核心代码  

```js
var $q = {};
var defer = function() { return new Deferred(); };

function Promise() {
  // 一共四种状态:
  // 0: 等待
  // 1: 通过
  // 2: 拒绝
  // -1: 处理 promise 对象
  this.$$state = { status: 0 };
}

extend(Promise.prototype, {
  // then 函数主要功能是 新创建 deferred 对象 并 往队列里面添加 回调函数
  then: function(onFulfilled, onRejected, progressBack) {
    // 没有任何回调直接返回
    if (!onFulfilled && !onRejected && !progressBack) return this;
    // 每执行一次 then 都会创建一个新的 Deferred 对象
    var result = new Deferred();
    this.$$state.pending = this.$$state.pending || [];
    // 往队列里面添加 回调函数
    this.$$state.pending.push([
      result, 
      onFulfilled, 
      onRejected, 
      progressBack
    ]);
    // 如果先执行了 状态方法 resolve 或 reject 再执行 then 时会直接执行对应的回调函数
    // 即异步变成了同步 依然不影响程序的正常执行
    if (this.$$state.status > 0) scheduleProcessQueue(this.$$state);
    // 最后返回 Promise 对象 实现链式编程
    return result.promise;
  },
  "catch": function(callback) {
    // 相当于直接 reject 的回调 返回一个 promise 对象
    return this.then(null, callback);
  },
  "finally": function(callback, progressBack) {
    // 通过与拒绝都会执行 返回一个 promise 对象
    return this.then(function(value) {
      return handleCallback(value, true, callback);
    }, function(error) {
      return handleCallback(error, false, callback);
    }, progressBack);
  }
});
// 绑定上下文
function simpleBind(context, fn) {
  return function(value) {
    fn.call(context, value);
  };
}

// $q 最核心的方法
// processQueue 用于执行回调函数
function processQueue(state) {
  var fn, deferred, pending;
  pending = state.pending;
  state.processScheduled = false;
  // 执行完毕之后 置空 队列里的所有回调函数
  state.pending = undefined;
  for (var i = 0, ii = pending.length; i < ii; ++i) {
    deferred = pending[i][0];
    // 巧妙的运用状态来控制回调函数
    fn = pending[i][state.status];
    if (isFunction(fn)) {
      // fn(state.value) 回调函数
      // 同时把回调函数的返回值传给 deferred.resolve()
      // 这样就可以实现返回值的链式传递 .then().then().then()
      // 第一个 then 是 最外层的 deferred 对象的 promise 对象的方法
      // 第二个 then 是 在第一个 then 内部重新创建的 deferred 的 promise 对象的方法 每个 then 都会返回一个 result.promise 对象
      // 也就是每执行调一次 then 方法就会嵌套一层 deferred 对象  (这个应该不是实现 promise 的最优解)
      // 前面 pending 已经置空了  就保证了 在 执行 deferred.resolve 时 只会把回调函数的返回值传过去而不会继续执行
      deferred.resolve(fn(state.value));
    } else if (state.status === 1) {
      deferred.resolve(state.value);
    } else {
      deferred.reject(state.value);
    }
  }
}

// 节流函数  阻止后续执行
function scheduleProcessQueue(state) {
  if (state.processScheduled || !state.pending) return;
  state.processScheduled = true;
  processQueue(state);
}
// Deferred 构造函数
function Deferred() {
  this.promise = new Promise();
  this.resolve = simpleBind(this, this.resolve);  // 实际上是调用的 原型的方法
  this.reject = simpleBind(this, this.reject);
  this.notify = simpleBind(this, this.notify);
}

extend(Deferred.prototype, {
  // 节流函数  有状态直接返回
  resolve: function(val) {
    if (this.promise.$$state.status) return;
    this.$$resolve(val);
  },
  // $$resolve 主要用于 改变状态 并 触发回调函数
  $$resolve: function(val) {
    var then, fns;
    // callOnce 绑定this 返回 [this.$$resolve, this.$$reject]
    // 这步操作应该放到下面
    fns = callOnce(this, this.$$resolve, this.$$reject);
    // 如果传过来的对象是 promise 对象
    // 则把状态变为 -1 同时 执行 promise.then 并且 传递 this.$$resolve, this.$$reject 回调
    // 这样就保证了对 传过来的 promise 对象的执行监听 同时也兼容了 原生 promise 对象
    if ((isObject(val) || isFunction(val))) then = val && val.then;
    if (isFunction(then)) {
      this.promise.$$state.status = -1;
      then.call(val, fns[0], fns[1], this.notify);
    } else {
      // 常规执行： 存储 val 值  更新状态 并 执行回调函数
      this.promise.$$state.value = val;
      this.promise.$$state.status = 1;
      scheduleProcessQueue(this.promise.$$state);
    }
  },
  reject: function(reason) {
    if (this.promise.$$state.status) return;
    this.$$reject(reason);
  },
  // 同 $$resolve 常规执行
  $$reject: function(reason) {
    this.promise.$$state.value = reason;
    this.promise.$$state.status = 2;
    scheduleProcessQueue(this.promise.$$state);
  },
  notify: function(progress) {
    var callbacks = this.promise.$$state.pending;
    if (
      (this.promise.$$state.status <= 0) && 
      callbacks && 
      callbacks.length
    ) {
      var callback, result;
      for (var i = 0, ii = callbacks.length; i < ii; i++) {
        result = callbacks[i][0];
        // 执行传递给 then 的第三个回调函数 并把值传递给该回调
        callback = callbacks[i][3];
        result.notify(
          isFunction(callback) ? 
          callback(progress) : 
          progress
        );
      }
    }
  }
});

// 对外的静态方法 用于 拒绝 promise 的执行
// 当在一个 promise 通过时 返回一个 reject(...) 则会继续拒绝通过
// 下面这个例子中 第二个then 的回调函数不会执行 直接走到 catch 回调中
/* e.g: 
var deferred = $q.defer();
setTimeout(function(){
    deferred.resolve('SUCCESS');
}, 1000);
deferred.promise.then(function(r){
    return $q.reject('ERROR');
}).then(function(r){
    console.log('success >>> ', r);
}).catch(function(r){
    console.log('error >>> ', r);
});
*/
var reject = function(reason) {
  var result = new Deferred();
  result.reject(reason);
  return result.promise;
};

// 同上 reject  执行 通过完成的回调
var resolve = function(value, callback, errback, progressBack) {
  var result = new Deferred();
  result.resolve(value);
  return result.promise.then(callback, errback, progressBack);
};

// 最有意思的是 all 方法
// 巧妙的通过 resolve 方法 将 新创建的 内部的 deferred 的 $$resolve 和 $$reject 传给 循环中 promise 的 then 作为回调
// all 方法 内创建的 deferred 对象 控制着全局
// 计数器控制着所有的成功之后 执行 deferred.resolve(results)
// 当有一个失败则执行 deferred.reject(reason)
function all(promises) {
  var deferred = new Deferred(),
  // 对每个 promise 添加计数器
  counter = 0,
  results = isArray(promises) ? [] : {};

  promises.forEach(function(promise, key) {
    counter++;
    resolve(promise).then(function(value) {
      if (results.hasOwnProperty(key)) return;
      results[key] = value;
      if (!(--counter)) deferred.resolve(results);
    }, function(reason) {
      if (results.hasOwnProperty(key)) return;
      deferred.reject(reason);
    });
  });

  // 如果 promises 为空 直接 通过
  if (counter === 0) {
    deferred.resolve(results);
  }

  return deferred.promise;
}

// 改变函数调用 this 指向
function callOnce(self, resolveFn, rejectFn) {
  var called = false;
  function wrap(fn) {
    return function(value) {
      if (called) return;
      called = true;
      fn.call(self, value);
    };
  }
  return [wrap(resolveFn), wrap(rejectFn)];
}

var makePromise = function makePromise(value, resolved) {
  var result = new Deferred();
  if (resolved) {
    result.resolve(value);
  } else {
    result.reject(value);
  }
  return result.promise;
};

var handleCallback = function handleCallback(value, isResolved, callback) {
  var callbackOutput = null;
  if (isFunction(callback)) callbackOutput = callback();
  if (isPromiseLike(callbackOutput)) {
    return callbackOutput.then(function() {
      return makePromise(value, isResolved);
    }, function(error) {
      return makePromise(error, false);
    });
  } else {
    return makePromise(value, isResolved);
  }
};


// 以下为 模拟方法
function isFunction(fn){ return typeof fn === 'function'; }
function isObject(obj){ return typeof obj === 'object'; }
function isArray(array){ return Array.isArray(array); }
function isPromiseLike(obj) { return obj && isFunction(obj.then); }
function extend(obj, _proto){
  Object.keys(_proto).forEach(function(key){
    obj[key] = _proto[key];
  });
}

$q.defer = defer;
$q.reject = reject;
$q.resolve = resolve;
$q.all = all;
```

```js
// 每个 $q.defer()  实际 都会 new 一个 Deferred 对象
{  // Deferred 对象
  // 在 构造 Deferred 对象的同时会 new 一个 Promise 对象
  // 在 angular 看来只要有 then 方法的就是 Promise 对象
  promise: {  // Promise 对象
    // 每个 Promise 对象都有一个 $$state
    // 其中 status 记录 当前 Promise 对象的状态
      // 一共四种状态:  该状态同时也对应于 pending 中的回调函数
      // 0: 等待  初始状态
      // 1: 通过  对应于 pending 中的 onFulfilled 回调
      // 2: 拒绝  对应于 pending 中的 onRejected 回调
      // -1: 处理传递的 promise 对象  deferred.resolve(promise)
    // pending 会在 执行完 .then() 方法后动态添加上  用于存储： 成功、失败和 finally 的回调函数
    // value 用于存储 结果值 并传递给回调函数
    $$state: {
      status: 0,
      pending: [  // .then() 之后会添加回调函数
        [_deferred, onFulfilled, onRejected, progressBack]
      ],  
      value: undefined,  // deferred.resolve(value)
    },
    _proto_: {
      // then: Promise 对象的核心方法
      // 主要用于添加回调函数 和 执行回调(status > 0 时)
      then: f(){},
      catch: f(){},
      finally: f(){}
    }
  },
  resolve: f(){},
  reject: f(){},
  notify: f(){},
  _proto_: {
    resolve: f(){},
    $$resolve:f(){},
    reject: f(){},
    $$reject: f(){},
    notify: f(){}
  }
}
```

![](./imgs/angular-promise-01.jpg)
 
