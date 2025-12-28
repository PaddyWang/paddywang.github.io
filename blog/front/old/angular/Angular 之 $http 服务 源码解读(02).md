---
outline: deep
---

# Angular 之 $http 服务 源码解读(02)

$http 服务的实现细节解读

> AngularJS v1.4.8
> 
> 该代码块基于源码进行了删减  
> 该代码块仅用于学习 分享 交流  

```js
// :9337
var APPLICATION_JSON = 'application/json';
var CONTENT_TYPE_APPLICATION_JSON = {'Content-Type': APPLICATION_JSON + ';charset=utf-8'};
var JSON_START = /^\[|^\{(?!\{)/;  // 用于 isJsonLike 判断是否为 JSON 格式的数据
var JSON_ENDS = {
  '[': /]$/,
  '{': /}$/
};
var JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;  // 处理后端返回数据中 JSON 的安全漏洞 (新版本浏览器已经修复)

// $http 的构造函数
function $HttpProvider(){
  // 默认配置参数  作用于整个构造函数的生命周期
  var defaults = this.defaults = {
    // 处理响应和请求数据  通过数组存放处理函数
    transformResponse: [defaultHttpResponseTransform],
    transformRequest: [function(d) {
      return isObject(d) && !isFile(d) && !isBlob(d) && !isFormData(d) ? toJson(d) : d;
    }],
    // 默认的请求头  分为公共的和私有的
    headers: {
      common: {'Accept': 'application/json, text/plain, */*'},
      post:   {'Content-Type': APPLICATION_JSON + ';charset=utf-8'},
      put:    {'Content-Type': APPLICATION_JSON + ';charset=utf-8'},
      patch:  {'Content-Type': APPLICATION_JSON + ';charset=utf-8'}
    },
    // 跨站域请求伪造 令牌
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    // 序列化参数
    paramSerializer: $injector.get('$httpParamSerializer')
  };

  // 拦截器  目前没找到相关的处理函数
  var interceptorFactories = this.interceptors = [];
  // 依赖注入
  this.$get = ['$httpBackend', '$$cookieReader', '$cacheFactory', '$rootScope', '$q', '$injector',
      function($httpBackend, $$cookieReader, $cacheFactory, $rootScope, $q, $injector) {
    // 默认的请求缓存
    var defaultCache = $cacheFactory('$http');

    // 主方法
    function $http(requestConfig){
      // 请求配置  合并传过来的配置参数
      var config = extend({
        method: 'get',
        transformRequest: defaults.transformRequest,
        transformResponse: defaults.transformResponse,
        paramSerializer: defaults.paramSerializer,
      }, requestConfig);
      // 合并请求头  这块为了清晰简化了源代码
      // 在拓展的 hreder 里面支持函数处理(代码被省略了，参见源码 executeHeaderFns ) 例如：headers: {'Content-Type': function(val){return val}}
      config.headers = extend({}, defaults.headers.common, defaults.headers[lowercase(config.method)], requestConfig.headers);

      // 处理请求  主要处理请求参数
      function serverRequest(config){
        var headers = config.headers;
        // 处理请求数据
        var reqData = transformData(config.data, headersGetter(headers), undefined, config.transformRequest);

        // 调用发送请求函数  成功/失败 之后 执行 transformResponse
        return sendReq(config, reqData).then(transformResponse, transformResponse);
      }

      var promise = $q.when(config);  // 等同于 $q.resolve(config)

      // ...
      // 拦截器处理被省略了
      // 最终通过 promise.then 调用
      // ...
      // serverRequest -> promise  直接执行 serverRequest 回调
      // 此时的 promise 实际变成了 serverRequest 返回的 promise 对象
      promise = promise.then(serverRequest);
      // 沿用之前的 promise 处理方法，现在已被弃用
      promise.success = function(fn) {
        promise.then(function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return promise;
      };
      promise.error = function(fn) {
        promise.then(null, function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return promise;
      };

      // $http 最终返回一个 promise 对象  可以进行链式调用
      return promise;

      // 处理响应数据
      function transformResponse(response) {
        // make a copy since the response must be cacheable
        var resp = extend({}, response);
        resp.data = transformData(response.data, response.headers, response.status,
                                  config.transformResponse);
        return (isSuccess(response.status))  // 如果状态码错误直接 执行 拒绝操作
          ? resp
          : $q.reject(resp);
      }
    }

    $http.pendingRequests = [];
    $http.defaults = defaults;

    // 对外暴露 $http 方法
    return $http;


    function sendReq(config, reqData){
      var deferred = $q.defer(),  // 创建一个异步对象 deferred 伴随一个完成的 http 请求周期
          promise = deferred.promise,
          cache,  // 是否缓存
          cachedResp,
          reqHeaders = config.headers,
          // 处理 URL 主要用于添加查询参数
          url = buildUrl(config.url, config.paramSerializer(config.params));
      // 存储请求参数 请求成功之后移除  目前没发现用处
      $http.pendingRequests.push(config);
      promise.then(removePendingReq, removePendingReq);

      // 处理缓存
      if ((config.cache || defaults.cache) && config.cache !== false &&
          (config.method === 'GET' || config.method === 'JSONP')) {
        cache = isObject(config.cache) ? config.cache
              : isObject(defaults.cache) ? defaults.cache
              : defaultCache;
      }
      if(cache){
        // ...
      }

      // 添加 跨站域请求伪造 令牌
      var xsrfValue = urlIsSameOrigin(config.url)  // 判断是否跨域
          ? $$cookieReader()[config.xsrfCookieName || defaults.xsrfCookieName]
          : undefined;
      if (xsrfValue) {
        reqHeaders[(config.xsrfHeaderName || defaults.xsrfHeaderName)] = xsrfValue;
      }

      // 真正 ajax 处理函数 并传递 done 作为成功/失败回调
      $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout,
          config.withCredentials, config.responseType);

      // 返回 promise 对象 进行链式调用
      return promise;

      // ajax 成功/失败的处理函数
      function done(status, response, headersString, statusText) {
        // 缓存处理
        if (cache) {
          if (isSuccess(status)) {
            // 成功之后将缓存所有的数据
            cache.put(url, [status, response, parseHeaders(headersString), statusText]);
          } else {
            // remove promise from the cache
            // 失败的请求移除缓存里面对应的 url
            cache.remove(url);
          }
        }

        // promise 的处理函数
        resolvePromise(response, status, headersString, statusText);
      }

      // 根据状态执行 promise 的不同的处理函数
      function resolvePromise(response, status, headers, statusText) {
        //status: HTTP response status code, 0, -1 (aborted by timeout / promise)
        status = status >= -1 ? status : 0;

        // status: 200 ~ 299  ->  成功   最后通过 deferred.resolve/reject 结束 本次 http 请求
        (isSuccess(status) ? deferred.resolve : deferred.reject)({
          data: response,
          status: status,
          headers: headersGetter(headers),
          config: config,
          statusText: statusText
        });
      }
    }

    // 移除 $http.pendingRequests 中的请求配置  目前还发现 pendingRequests 的实际作用 ?
    function removePendingReq() {
      var idx = $http.pendingRequests.indexOf(config);
      if (idx !== -1) $http.pendingRequests.splice(idx, 1);
    }
  }];
}

// $httpBackend = $HttpBackendProvider
function $HttpBackendProvider() {
  this.$get = ['$browser', '$window', '$document', '$xhrFactory', function($browser, $window, $document, $xhrFactory) {
    return createHttpBackend($browser, $xhrFactory, $browser.defer, $window.angular.callbacks, $document[0]);
  }];
}
function createHttpBackend($browser, createXhr, $browserDefer, callbacks, rawDocument) {
  // TODO(vojta): fix the signature
  return function (method, url, post, callback, headers, timeout, withCredentials, responseType) {
    url = url;

    // 处理 jsonp
    if (lowercase(method) == 'jsonp') {
      // 生成一个回调 ID 并 挂载到全局的 angular.callbacks 上
      var callbackId = '_' + (callbacks.counter++).toString(36);
      // 添加回调执行函数  用于服务端执行
      callbacks[callbackId] = function(data) {
        callbacks[callbackId].data = data;
        callbacks[callbackId].called = true;
      };

      // jsonp 回调 JSON_CALLBACK
      var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'angular.callbacks.' + callbackId),
          callbackId, function(status, text) {
        // 完成之后执行 done 回调
        completeRequest(callback, status, callbacks[callbackId].data, "", text);
        callbacks[callbackId] = noop;
      });
    } else {
      // 创建一个 xhr 对象
      var xhr = createXhr(method, url);

      xhr.open(method, url, true);
      // 添加请求头
      forEach(headers, function(value, key) {
        if (isDefined(value)) {
            xhr.setRequestHeader(key, value);
        }
      });
      // 监听 ajax 请求
      xhr.onload = function requestLoaded() {
        var statusText = xhr.statusText || '';

        // responseText is the old-school way of retrieving response (supported by IE9)
        // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
        // 兼容处理 IE9: responseText  IE10: response/responseType
        var response = ('response' in xhr) ? xhr.response : xhr.responseText;

        // normalize IE9 bug (http://bugs.jquery.com/ticket/1450)
        // 在 IE9 中会 返回 204 会被浏览器转成 1223
        var status = xhr.status === 1223 ? 204 : xhr.status;

        // fix status code when it is 0 (0 status is undocumented).
        // Occurs when accessing file resources or on Android 4.1 stock browser
        // while retrieving files from application cache.
        if (status === 0) {
          status = response ? 200 : urlResolve(url).protocol == 'file' ? 404 : 0;
        }

        // 完成请求 回调
        completeRequest(callback,
            status,
            response,
            xhr.getAllResponseHeaders(),
            statusText);
      };

      // 请求出错或者取消的 状态返回 -1
      var requestError = function() {
        // The response is always empty
        // See https://xhr.spec.whatwg.org/#request-error-steps and https://fetch.spec.whatwg.org/#concept-network-error
        completeRequest(callback, -1, null, null, '');
      };

      xhr.onerror = requestError;
      xhr.onabort = requestError;
      // 设置响应类型
      if (responseType) {
        try {
          xhr.responseType = responseType;
        } catch (e) {
          // WebKit added support for the json responseType value on 09/03/2013
          // https://bugs.webkit.org/show_bug.cgi?id=73648. Versions of Safari prior to 7 are
          // known to throw when setting the value "json" as the response type. Other older
          // browsers implementing the responseType
          //
          // The json response type can be ignored if not supported, because JSON payloads are
          // parsed on the client-side regardless.
          if (responseType !== 'json') {
            throw e;
          }
        }
      }

      xhr.send(isUndefined(post) ? null : post);
    }

    // 设置 timeout  同时 timeout 支持 promise
    if (timeout > 0) {
      var timeoutId = $browserDefer(timeoutRequest, timeout);
    } else if (isPromiseLike(timeout)) {
      timeout.then(timeoutRequest);
    }
    // 超时处理
    function timeoutRequest() {
      jsonpDone && jsonpDone();
      xhr && xhr.abort();
    }

    function completeRequest(callback, status, response, headersString, statusText) {
      // cancel timeout and subsequent timeout promise resolution
      if (isDefined(timeoutId)) {
        $browserDefer.cancel(timeoutId);
      }
      jsonpDone = xhr = null;

      // 执行 done 处理函数
      callback(status, response, headersString, statusText);
      $browser.$$completeOutstandingRequest(noop);
    }
  };

  // 处理 jsonp 请求
  // jsonp 和 ajax 请求，对外统一，包括：请求方式 和 响应数据
  function jsonpReq(url, callbackId, done) {
    // we can't use jQuery/jqLite here because jQuery does crazy stuff with script elements, e.g.:
    // - fetches local scripts via XHR and evals them
    // - adds and immediately removes script elements from the document
    // 先创建一个脚本
    var script = rawDocument.createElement('script'), callback = null;
    script.type = "text/javascript";
    script.src = url;
    script.async = true;

    callback = function(event) {
      removeEventListenerFn(script, "load", callback);
      removeEventListenerFn(script, "error", callback);
      rawDocument.body.removeChild(script);
      script = null;
      var status = -1;  // 默认状态为 -1  请求超时和错误 返回默认状态
      var text = "unknown";

      if (event) {
        if (event.type === "load" && !callbacks[callbackId].called) {
          event = { type: "error" };
        }
        text = event.type;
        status = event.type === "error" ? 404 : 200;  // 设置成功的状态 -> 200
      }

      if (done) {
        done(status, text);
      }
    };
    // 监听脚本的响应
    addEventListenerFn(script, "load", callback);
    addEventListenerFn(script, "error", callback);
    rawDocument.body.appendChild(script);
    return callback;
  }
}
```
