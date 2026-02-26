import type { Equal, Expect } from '@type-challenges/utils'


// 参考资料：
// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html

// typeof 是个类型运算符
// typeof 运算符可以在类型上下文中使用，用于引用变量或属性的类型
// 记住值和类型不是一回事。要引用值的类型，我们使用 typeof
// 限制：只能使用 typeof 来获取变量或属性的类型，不能直接使用 typeof 来获取类型别名或接口的类型
// 限制：typeof 只能在类型上下文中使用，不能在值上下文中使用
// 限制
// 1. 获取变量的类型
let s = "hello";
type S = typeof s;
type T1 = Expect<Equal<S, string>>

// 2. 获取函数的类型
function add(a: number, b: number): number {
  return a + b;
}
type Add = typeof add;
type T2 = Expect<Equal<Add, (a: number, b: number) => number>>

// 3. 获取类的类型
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
type PersonType = typeof Person;
type T3 = Expect<Equal<PersonType, typeof Person>>
