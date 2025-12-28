---
outline: deep
---

# Angular 之 $inject 实现原理(03)

> AngularJS v1.4.8  
> 本次没有涉及到源码  
> 只是对源码的梳理

Angular 实现依赖注入的基本思路是这样的:  
- 首先有个用于存依赖项和依赖值的映射表  
- 有个专门获取函数参数的方法 `annotate`  
- 统一处理依赖注入的多种方式  
  + 1. 从函数的参数中提取依赖项 `function MyController($scope, $route){}`
  + 2. 通过 `$inject` 注入 `MyController.$inject = ['$scope', '$route'];`
  + 3. 数组内联注入式 `['$scope', '$route', function($scope, $route){}]`
- 最后进行依赖注入，同时改了函数的 this 指向 `fn.apply(self, args); `

### 核心方法
- `createInjector`  
- 有两个映射表
  + `providerCache` 主要用于缓存原始服务对象  名字结尾默认会加 `Provide`
  + `instanceCache` 主要用于缓存服务实例对象
- 核心方法 `createInternalInjector`
  + `getService` 用于获取服务实例对象
  + `invoke` 调用执行函数并进行依赖项注入
  + `annotate` 获取依赖项
  + `instantiate` 实例化服务对象

### 从函数的参数中提取依赖项
这种依赖注入方式，是通过 `annotate` 方法直接获取依赖注入项  
该方式只能用在演示不能用代码压缩混淆

### 通过 `$inject` 注入
这种方式比较直观，将依赖注入单独分开处理  
该方式不能使用匿名函数

### 数组内联注入式
这种依赖注入方式将依赖注入项和执行函数写在了同一数组中，操作便捷，可直接使用匿名函数  
这种方式也是 Angular 官方推荐的
