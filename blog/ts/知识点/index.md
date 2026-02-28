# 知识点

## 调用签名
```ts
type Obj = {
  (): void;
  loading: boolean;
}

const obj: Obj = () => {
  console.log("Hello, World!");
}
obj.loading = true;

obj();
console.log(obj.loading);
```

## unknown
任何值，但不可操作  
`any` 任何值，可以操作

## 接口扩展 extends 和 交叉类型  
如果接口定义了相同的名称，TypeScript 将尝试合并它们，如果属性是兼容的。如果属性不兼容（即，它们有相同的属性名但类型不同），TypeScript 将会引发错误。

在交叉类型的情况下，不同类型的属性将自动合并。当使用该类型时，TypeScript 会期望属性同时满足两种类型，这可能会产生意想不到的结果。

```ts
// 抛出错误
interface Person {
  name: string;
}
interface Person {
  name: number;
}
```
```ts
// never
interface Person1 {
  name: string;
}
interface Person2 {
  name: number;
}
type Staff = Person1 & Person2
```

<<< ./code.ts
