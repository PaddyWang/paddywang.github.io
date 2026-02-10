import type { Equal, Expect } from '@type-challenges/utils'


// 参考资料：
// https://www.typescriptlang.org/docs/handbook/2/keyof-types.html#handbook-content

// keyof 是个类型运算符
// 1. keyof 运算符接受一个对象类型，并生成其键的字符串或数字字面量联合
type Point = { x: number; y: number, 1: string, '2': number };
type P = keyof Point;
type T1 = Expect<Equal<P, 'x' | 'y' | 1 | '2'>>

// 2. 如果类型具有 string 或 number 索引签名， keyof 将返回这些类型：
type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish;

type T2 = Expect<Equal<A, number>>

type Mapish = { [k: string]: boolean };
type M = keyof Mapish;

type T3 = Expect<Equal<M, string | number>> 
// 注意在这个例子中， M 是 string | number 
// — 这是因为 JavaScript 对象的键总是被强制转换为字符串，所以 obj[0] 总是与 obj["0"] 相同


// 示例：
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
}
type cases = [
  Expect<Equal<Expected1, MyPick<Todo, 'title'>>>,
  Expect<Equal<Expected2, MyPick<Todo, 'title' | 'completed'>>>,
  // @ts-expect-error
  MyPick<Todo, 'title' | 'completed' | 'invalid'>,
]
interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Expected1 {
  title: string
}

interface Expected2 {
  title: string
  completed: boolean
}