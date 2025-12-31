---
outline: deep
---

# 启动 angular 之前都做了什么 ?

> AngularJS v1.4.8
> 
> 该代码块基于源码进行了删减  
> 该代码块仅用于学习 分享 交流  
> 只梳理了代码的初始化，具体方法是干什么的等到后续说明  

在启动angular之前，会做一些初始化工作  
- 第一步 绑定 JQLite(JQuery)
- 第二步  初始化对外暴露的 angular 方法
- 第三步  初始化 angular.module 方法
- 第四步  初始化 ng 模块
- 第五步  初始化 ngLocale 模块
- 第六步  添加 ng 样式
- 最后是  启动 angular

**angular 在处理方法上采用了大量的闭包  对外只公开一个 angular 对象**

```js
// 直接定位到代码的最后
// 从这开始执行初始化 
/*** 第一步 绑定 JQLite(JQuery) ***/
bindJQuery();

// 植入 JQuery  ng-jq="newJquery"
var jq = function() {
  var el;
  var i, ii = ngAttrPrefixes.length, prefix, name;
  for (i = 0; i < ii; ++i) {
    prefix = ngAttrPrefixes[i];
    if(el = document.querySelector('[' + prefix.replace(':', '\\:') + 'jq]')){
      name = el.getAttribute(prefix + 'jq');
      break;
    }
  }

  return (jq.name_ = name);
};

// 节流字段 防止重复绑定
var bindJQueryFired = false;
function bindJQuery() {
  if (bindJQueryFired) {
    return;
  }

  var jqName = jq();
  // 是否植入了 JQuery  需要在 angular 之前加载
  //    是：用植入的  并对于手动植入的 JQuery 添加 angular 拓展
  //    否：用 angular 内置的
  jQuery = isUndefined(jqName) ? window.jQuery :  
           !jqName             ? undefined     : 
                                 window[jqName]; 

  if (jQuery && jQuery.fn.on) {
    jqLite = jQuery;
    // 添加的拓展具体什么作用暂不考虑
    extend(jQuery.fn, {
      scope: JQLitePrototype.scope,
      isolateScope: JQLitePrototype.isolateScope,
      controller: JQLitePrototype.controller,
      injector: JQLitePrototype.injector,
      inheritedData: JQLitePrototype.inheritedData
    });
  } else {
    jqLite = JQLite;
  }

  // 最终将 JQuery 挂载到 angular 对象上
  angular.element = jqLite;

  bindJQueryFired = true;
}

/*** 第二步  初始化对外暴露的 angular 方法 ***/
publishExternalAPI(angular);

var version = {
  full: '1.4.8', 
  major: 1, 
  minor: 4,
  dot: 8,
  codeName: 'ice-manipulation'
};
function publishExternalAPI(angular) {
    // 添加方法
  extend(angular, {
    'bootstrap': bootstrap,
    'element': jqLite,
    'injector': createInjector,
    'version': version,
    // ...
  });

/*** 第三步  初始化 angular.module 方法 ***/
  angularModule = setupModuleLoader(window);
     
/*** 第四步  初始化 ng 模块 ***/
  angularModule('ng', ['ngLocale'], ['$provide',
    function ngModule($provide) {
      // $$sanitizeUriProvider needs to be before $compileProvider as it is used by it.
      $provide.provider({
        $$sanitizeUri: $$SanitizeUriProvider
      });
      $provide.provider('$compile', $CompileProvider).
        directive({
            select: selectDirective,
            ngBind: ngBindDirective,
            ngHide: ngHideDirective,
            ngInit: ngInitDirective
            // ...
        }).
        directive({
          ngInclude: ngIncludeFillContentDirective
        }).
        directive(ngAttributeAliasDirectives).
        directive(ngEventDirectives);
      $provide.provider({
        $controller: $ControllerProvider,
        $filter: $FilterProvider,
        $http: $HttpProvider,
        $rootScope: $RootScopeProvider,
        $q: $QProvider
        // ...
      });
    }
  ]);
}

// 处理模块
function setupModuleLoader(window) {
  function ensure(obj, name, factory) {
    // 如果存在模块直接返回模块实例，否则添加到 modules 之后再返回模块实例
    return obj[name] || (obj[name] = factory());
  }

  var angular = ensure(window, 'angular', Object);
    // 初始化 angular.module 方法
  return ensure(angular, 'module', function() {
    // 通过闭包 用 modules 缓存模块实例
    var modules = {};
    // angular.module = module;
    return function module(name, requires, configFn) {
        // 重复定义模块  后面的会把前面的覆盖
      if (requires && modules.hasOwnProperty(name)) {
        modules[name] = null;
      }

      // 模块的定义和使用 巧妙的运用 ensure 的 短路 运算
      // 通过 modules[name] 和 requires 双重判断
      return ensure(modules, name, function() {
        if (!requires) {
          throw '抛出异常';
        }

        /** @type {!Array.<Array.<*>>} */
        var invokeQueue = [];

        /** @type {!Array.<Function>} */
        var configBlocks = [];

        /** @type {!Array.<Function>} */
        var runBlocks = [];

        var config = invokeLater('$injector', 'invoke', 'push', configBlocks);

        /** @type {angular.Module} */
        // 返回的 module 实例
        var moduleInstance = {
          // Private state
          _invokeQueue: invokeQueue,
          _configBlocks: configBlocks,
          _runBlocks: runBlocks,
          requires: requires,
          name: name,
          provider: invokeLaterAndSetModuleName('$provide', 'provider'),
          factory: invokeLaterAndSetModuleName('$provide', 'factory'),
          service: invokeLaterAndSetModuleName('$provide', 'service'),
          value: invokeLater('$provide', 'value'),
          constant: invokeLater('$provide', 'constant', 'unshift'),  // 追加到栈前
          decorator: invokeLaterAndSetModuleName('$provide', 'decorator'),
          animation: invokeLaterAndSetModuleName('$animateProvider', 'register'),
          filter: invokeLaterAndSetModuleName('$filterProvider', 'register'),
          controller: invokeLaterAndSetModuleName('$controllerProvider', 'register'),
          directive: invokeLaterAndSetModuleName('$compileProvider', 'directive'),
          config: config,
          run: function(block) {
            runBlocks.push(block);
            return this;
          }
        };

        if (configFn) {
          config(configFn);  
          // > configBlocks: [['$injector', 'invoke', configFn]]
        }

        return moduleInstance;
        // var config = invokeLater('$injector', 'invoke', 'push', configBlocks);
        function invokeLater(provider, method, insertMethod, queue) {
          if (!queue) queue = invokeQueue;
          return function() {
            // 添加到 栈/执行栈 中
            queue[insertMethod || 'push']([provider, method, arguments]);
            // 返回 模块实例 实现链式调用
            return moduleInstance;
          };
        }

        function invokeLaterAndSetModuleName(provider, method) {
          return function(recipeName, factoryFunction) {
            if (factoryFunction && isFunction(factoryFunction)) factoryFunction.$$moduleName = name;
            // 添加到执行栈中
            invokeQueue.push([provider, method, arguments]);
            return moduleInstance;
          };
        }
      });
    };
  });
}

/*** 第五步  初始化 ngLocale 模块 ***/
angular.module("ngLocale", [], ["$provide", function($provide) {
  // ...
  $provide.value("$locale", {
    "DATETIME_FORMATS": {
      "AMPMS": [
        "AM",
        "PM"
      ]
      // ...
    },
    "id": "en-us",
    "pluralCat": function(n, opt_precision) {});
}]);

/*** 第六步  添加 ng 样式 ***/
window.angular.element(document.head).prepend('<style>....</style>');

jqLite(document).ready(function() {
/*** 最后是  启动 angular 后续再讲 ***/ 
  angularInit(document, bootstrap);
});
```

```js
// 初始化之后的结构如下
// 全局的 angular
angular: {
  $$csp: ƒ (),
  $$minErr: ƒ minErr(module, ErrorConstructor),
  $interpolateMinErr: ƒ (),
  bind: ƒ bind(self, fn),
  bootstrap: ƒ bootstrap(element, modules, config),
  callbacks: {counter: 0},
  copy: ƒ copy(source, destination),
  element: ƒ JQLite(element),
  equals: ƒ equals(o1, o2),
  extend: ƒ extend(dst),
  forEach: ƒ forEach(obj, iterator, context),
  fromJson: ƒ fromJson(json),
  getTestability: ƒ getTestability(rootElement),
  identity: ƒ identity($),
  injector: ƒ createInjector(modulesToLoad, strictDi),
  isArray: ƒ isArray(),
  isDate: ƒ isDate(value),
  isDefined: ƒ isDefined(value),
  isElement: ƒ isElement(node),
  isFunction: ƒ isFunction(value),
  isNumber: ƒ isNumber(value),
  isObject: ƒ isObject(value),
  isString: ƒ isString(value),
  isUndefined: ƒ isUndefined(value),
  lowercase: ƒ (string),
  merge: ƒ merge(dst),
  module: ƒ module(name, requires, configFn),
  noop: ƒ noop(),
  reloadWithDebugInfo: ƒ reloadWithDebugInfo(),
  toJson: ƒ toJson(obj, pretty),
  uppercase: ƒ (string),
  version: {full: "1.4.8", major: 1, minor: 4, dot: 8, codeName: "ice-manipulation"}
}
```

```js
// 闭包内的 modules
modules: {
  ng: {
    animation: ƒ (recipeName, factoryFunction),
    config: ƒ (),
    constant: ƒ (),
    controller: ƒ (recipeName, factoryFunction),
    decorator: ƒ (recipeName, factoryFunction),
    directive: ƒ (recipeName, factoryFunction),
    factory: ƒ (recipeName, factoryFunction),
    filter: ƒ (recipeName, factoryFunction),
    name: "ng",
    provider: ƒ (recipeName, factoryFunction),
    requires: ["ngLocale"],
    run: ƒ (block),
    service: ƒ (recipeName, factoryFunction),
    value: ƒ (),
    _configBlocks: [["$injector", "invoke", Arguments(1)]],
    _invokeQueue: [],
    _runBlocks: []
  },
  ngLocale: { /* ... */ }
}
```
