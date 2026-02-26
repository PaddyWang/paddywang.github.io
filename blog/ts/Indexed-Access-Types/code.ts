// https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html

type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"];


// 索引类型本身也是一种类型，因此我们可以使用联合类型、 keyof 或其他类型：
type I1 = Person["age" | "name"];
type I2 = Person[keyof Person];
type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName];


const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];
type Person2 = typeof MyArray[number];
type Age2 = typeof MyArray[number]["age"];
// Or
type Age3 = Person2["age"];