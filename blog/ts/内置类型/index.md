---
outline: deep
---

## `Awaited<Type>`
此类型用于模拟 await 函数中的 async 操作，或在 .then() 上 Promise 的方法 - 具体来说，是它们递归地解包 Promise 的方式。

:::details Example
```ts
type A = Awaited<Promise<string>>;
// type A = string
 
type B = Awaited<Promise<Promise<number>>>; 
// type B = number
 
type C = Awaited<boolean | Promise<number>>;
// type C = number | boolean
```
:::


## `Partial<Type>`
重新生成一个全部可选项类型。

:::details Example
```ts
interface Todo {
  title: string;
  description: string;
}
 
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}
 
const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};
 
const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```
:::


## `Required<Type>`
和 `Partial` 相反，重新生成一个全部必选类型。

:::details Example
```ts
interface Props {
  a?: number;
  b?: string;
}
 
const obj: Props = { a: 5 };
 
const obj2: Required<Props> = { a: 5 };
// Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.  // [!code error] 
```
:::


## `Readonly<Type>`
构建一个所有属性都设置为 readonly 的类型

:::details Example
```ts
interface Todo {
  title: string;
}
 
const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};
 
todo.title = "Hello";
// Cannot assign to 'title' because it is a read-only property. // [!code error] 
```
:::


## `Record<Keys, Type>`
构建一个对象类型，其属性键为 Keys ，属性值为 Type。

:::details Example
```ts
type CatName = "miffy" | "boris" | "mordred";
 
interface CatInfo {
  age: number;
  breed: string;
}
 
const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};
 
cats.boris;
// const cats: Record<CatName, CatInfo>
```
:::


## `Pick<Type, Keys>`
通过从 Type 中选择一组属性 Keys （字符串字面量或字符串字面量的联合）来构建一个类型。

:::details Example
```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}
 
type TodoPreview = Pick<Todo, "title" | "completed">;
/*
type TodoPreview = {
  title: string;
  completed: boolean;
}
*/
```
:::


## `Omit<Type, Keys>`
通过从 Type 中挑选所有属性，然后移除 Keys （字面量字符串或字面量字符串的联合）。与 Pick 相反。

:::details Example
```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}
 
type TodoPreview = Omit<Todo, "description">;
/*
type TodoPreview {
  title: string;
  completed: boolean;
  createdAt: number;
}
*/
```
:::


## `Exclude<UnionType, ExcludedMembers>`
通过从 UnionType 中排除所有可赋值给 ExcludedMembers 的联合成员来构造一个类型。

:::details Example
```ts
type T0 = Exclude<"a" | "b" | "c", "a">;
// type T0 = "b" | "c"

type T1 = Exclude<"a" | "b" | "c", "a" | "b">;     
// type T1 = "c"

type T2 = Exclude<string | number | (() => void), Function>;     
// type T2 = string | number
 
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
type T3 = Exclude<Shape, { kind: "circle" }>
/*
type T3 = {
  kind: "square";
  x: number;
} | {
  kind: "triangle";
  x: number;
  y: number;
}
*/
```
:::

## `Extract<Type, Union>`
通过从 Type 中提取所有可分配给 Union 的联合成员来构建一个类型。

:::details Example
```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
// type T0 = "a"

type T1 = Extract<string | number | (() => void), Function>;     
// type T1 = () => void
 
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; x: number }
  | { kind: "triangle"; x: number; y: number };
type T2 = Extract<Shape, { kind: "circle" }>
/*
type T2 = {
  kind: "circle";
  radius: number;
}
*/
```
:::


## `NonNullable<Type>`
通过从 Type 中排除 null 和 undefined 来构造一个类型。

:::details Example
```ts
type T0 = NonNullable<string | number | undefined>;
// type T0 = string | number

type T1 = NonNullable<string[] | null | undefined>;     
// type T1 = string[]
```
:::


## `Parameters<Type>`
从函数类型 Type 的参数中使用的类型构造一个元组类型。

对于重载函数，这将是指最后一种签名中的参数。

:::details Example
```ts
declare function f1(arg: { a: number; b: string }): void;
 
type T0 = Parameters<() => string>;     
// type T0 = []

type T1 = Parameters<(s: string) => void>;     
// type T1 = [s: string]

type T2 = Parameters<<T>(arg: T) => T>;     
// type T2 = [arg: unknown]

type T3 = Parameters<typeof f1>;
/*    
type T3 = [arg: {
    a: number;
    b: string;
}]
*/

type T4 = Parameters<any>;     
// type T4 = unknown[]

type T5 = Parameters<never>;
// type T5 = never
```
:::

## `ConstructorParameters<Type>`
从构造函数类型的类型构建元组或数组类型。它产生一个包含所有参数类型（或如果 Type 不是函数，则产生类型 never ）的元组类型。

:::details Example
```ts
type T0 = ConstructorParameters<ErrorConstructor>;
// type T0 = [message?: string]

type T1 = ConstructorParameters<FunctionConstructor>;  
// type T1 = string[]

type T2 = ConstructorParameters<RegExpConstructor>;  
// type T2 = [pattern: string | RegExp, flags?: string]

class C {
  constructor(a: number, b: string) {}
}
type T3 = ConstructorParameters<typeof C>;     
// type T3 = [a: number, b: string]

type T4 = ConstructorParameters<any>;     
// type T4 = unknown[]
```
:::

## `ReturnType<Type>`
构造一个类型，该类型由函数 Type 的返回类型组成。

:::details Example
```ts
declare function f1(): { a: number; b: string };
 
type T0 = ReturnType<() => string>;
// type T0 = string

type T1 = ReturnType<(s: string) => void>;     
// type T1 = void

type T2 = ReturnType<<T>() => T>;     
// type T2 = unknown

type T3 = ReturnType<<T extends U, U extends number[]>() => T>;     
// type T3 = number[]

type T4 = ReturnType<typeof f1>;
/*     
type T4 = {
    a: number;
    b: string;
}
*/

type T5 = ReturnType<any>;     
// type T5 = any

type T6 = ReturnType<never>;     
// type T6 = never
```
:::


## `InstanceType<Type>`
构建一个由 Type 中的构造函数的实例类型组成的类型。

:::details Example
```ts
class C {
  x = 0;
  y = 0;
}
 
type T0 = InstanceType<typeof C>;
// type T0 = C

type T1 = InstanceType<any>;
// type T1 = any

type T2 = InstanceType<never>;
// type T2 = never
```
:::


## `NoInfer<Type>`
阻止对包含类型的推断。除了阻止推断之外， `NoInfer<Type>` 与 Type 完全相同。

:::details Example
```ts
function createStreetLight<C extends string>(
  colors: C[],
  defaultColor?: NoInfer<C>,
) {
  // ...
}
createStreetLight(["red", "yellow", "green"], "red");  // OK
createStreetLight(["red", "yellow", "green"], "blue");  // Error [!code error]
```
:::


## `ThisParameterType<Type>`
提取函数类型中 this 参数的类型，如果函数类型没有 this 参数，则为 unknown。

:::details Example
```ts
function toHex(this: Number) {
  return this.toString(16);
}
 
function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```
:::


## *`OmitThisParameter<Type>`*
移除 this 参数中的 Type 参数。如果 Type 没有明确声明的 this 参数，结果就是 Type 。  
否则，会从 Type 创建一个新的不带 this 参数的函数类型。泛型会被擦除，只有最后一个重载签名会被传播到新的函数类型中。

:::details Example
```ts
function toHex(this: Number) {
  return this.toString(16);
}
 
const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);
 
console.log(fiveToHex());
```
:::


## *`ThisType<Type>`*
这个工具不会返回转换后的类型。相反，它作为上下文中的 this 类型的标记。请注意，必须启用 noImplicitThis 标志才能使用这个工具。

:::details Example
```ts
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};
 
function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}
 
let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});
 
obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```
:::


## 内建字符串操作类型
### `Uppercase<StringType>`
转大写。
```ts
type T = Uppercase<'hello'>;  // type T = "HELLO"
```


### `Lowercase<StringType>`
转小写。
```ts
type K = Lowercase<'WORLD'>; // type K = "world"
```


### `Capitalize<StringType>`
首字母转大写。
```ts
type C = Capitalize<'hello'>; // type C = "Hello"
```


### `Uncapitalize<StringType>`
首字母转小写。
```ts
type U = Uncapitalize<'WORLD'>; // type U = "wORLD"
```
