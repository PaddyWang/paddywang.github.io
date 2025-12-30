---
outline: deep
---

# 初识 React hooks

> 第一次听到 React hooks 是20年 winter 和尤大的一次对话中得知的，当时只是听他们说hooks解决了代码分离的问题，之后也没去了解  
> 了解了React Fiber之后(基于上一篇[《React 新人眼中的Fiber》](../React新手眼中的Fiber/))，开始践行 React hooks  
> 刚开始用的时候感受：什么鬼，怎么改了之后不生效？没改这里怎么这里变了？？？  
> React 组件有函数式组件和类组件  
> React 受到函数式编程的影响，但它进入了由面向对象库主导的领域  
> 本篇不涉及任何代码，将会在下一篇(《践行 Toy React Hook》)补上  

## 在代码复用上 React 践行过哪些方案？
### mixins

* 这个是来自 React 官方博客对 mixins 的介绍([链接](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html))：   
* mixins 解决了组合式代码复用，而不是继承式的复用   
* 缺点：隐式依赖、命名冲突、滚雪球般的复杂性   
* mixins 最终会被拍平合并混入，难以维护  

### HOC
* HOC 是 React 中用于复用组件逻辑的一种高级技巧，HOC 是纯函数，没有副作用 
* HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式（装饰器） 
* 用于解决横切关注点问题，同时避免了 mixins 的缺点 
* 缺点： 阻断 ref 传递(为了解决这个问题 出来了 React.forwardRef)、wrapper hell 

### Render props
* 解决了 HOC 的缺点，数据流向比较清晰 
* 缺点：Render props 采用闭包的形式实现，当应用复杂时大量的使用就会造成 callback hell 


## 为什么要有 hooks？ 
下面是来自 React 官方文档的解释(链接)：  
* 很难在组件之间复用状态逻辑 
* 复杂的组件变得难以理解 
* 很难理解的 class 

**hooks 可以带来哪些好处？**
* 可以更好的复用状态逻辑(自定义 hook) 
* 使函数组件有了状态管理(useState, useReducer) 
* 很好的解决了横切关注点的问题(useEffect, useLayoutEffect, useMemo, useCallback) 

### Algebraic Effects(代数效应) 
* React hooks 就是 React 在践行“代数效应” 
* 代数效应：是函数编程的思想，就是将副作用从函数中剥离出去 
* 例如：请求一个列表数据，函数本身不去获取列表数据，而是由一个单独的获取列表数据的副作用函数 
*(下一篇会给出一个伪代码示例)*  

### 有哪些hooks？ 
**基础 hooks：**  
* **useState**    “钩入” react state 的钩子，可以调用多次，可以改变状态 
* **useEffect**    声明周期钩子  
可以看作是 componentDidMount、componentDidUpdate、componentWillUnmount 三个生命周期的组合 
* **useContext**    “钩入” context 并订阅 context 的变化 

**额外 hooks：**   
* **useReducer**    同 useState，处理更复杂的状态 
* **useMemo**    用于优化高开销的计算 
在优化上：class组件中有 PureComponent，也可以在 shouldComponentUpdate 中进行控制；在函数式组件中有 React.memo 和新增的 useMemo。区别在于 React.memo 是以组件为单位进行的优化，而 useMemo 具有更细的颗粒度，可以根据 state 去控制 
* **useCallback**    同 useMemo 
useCallback(fn, deps) 相当于 useMemo(() => fn, deps) 
* **useRef**    返回一个可变的 ref 对象，在组件的整个生命周期内保持不变 
* **useImperativeHandle**    可以让你在使用 ref 时自定义暴露给父组件的实例值，应当与 forwardRef 一起使用 
* **useLayoutEffect**    同 useEffect ，区别在于 useEffect 在 componentDidMount、componentDidUpdate 后异步执行，而 useLayoutEffect 同步执行，用于一些和 DOM 相关的操作 

**使用 hooks 的注意点**  
* 只能在函数的最顶层使用(不能在循环、条件判断、或嵌套函数中使用 hooks) 
* 只在函数组件中使用 hooks、或者在自定义 hook 中调用 

**参考文档：** 
* [React官方文档](https://reactjs.org/)
* [写给那些搞不懂代数效应的我们（翻译）](https://zhuanlan.zhihu.com/p/76158581) 
* [React技术揭秘](https://react.iamkasong.com/) 