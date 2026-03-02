## Class
```ts
// Account: Subclasses this class
class User extends Account implements Updatable, Serializable {
  id: string;                       // 属性 
  displayName?: boolean;            // 可选属性
  name!: string;                    // 确定的属性
  #attributes: Map<any, any>;       // 私有属性
  roles = ["user"];                 // 带默认值的属性
  readonly createdAt = new Date();  // 只读属性

  constructor (id: string, public email: string) {
    super(id);
    this.id = id;
    this.email = email;
    this.#attributes = new Map();
  };

  setName (name: string) { this.name = name }
  verifyName = (name: string) => { }

  sync (): Promise<{ }>
  sync (cb: ((result: string) => void)): void
  sync (cb ?: ((result: string) => void)): void | Promise < {   } > {   }

  get accountID () {
    return this.id;
  }
  set accountID(value: string) {
    this.id = value;
  }

  private makeRequest () { }
  protected handleRequest () { }


  static #userCount = 0;
  static registerUser(user: User) { }

  static { this.#userCount = -1 }
}
```

### 泛型 class
```ts
class Box<Type> {
  contents: Type
  constructor (value: Type) {
    this.contents = value;
  }
}

const stringBox = new Box<string>('hello');
// const stringBox: Box<string>
```

### 参数属性
```ts
class Loc {
  constructor(public x: number, public y: number) {}
}

const loc = new Loc(1, 2);
loc.x; // 1
loc.y; // 2
```

### 抽象类
```ts
abstract class Animal {
  abstract getName(): string;
  printName(): void {
    console.log(this.getName());
  }
}

class Dog extends Animal {
  getName(): string {
    return 'Dog';
  }
}
```

### 装饰器
```ts
import { Syncable, triggersSync, preferCache, required } from 'mylib';

@Syncable
class User {
  @triggersSync()
  save () {}

  @preferCache(false)
  get displayName () {
    return '';
  }

  @required
  update(info: Partial<User>) {}
}
```

## Interface
内置类型  
boolean, string, number, undefined, null, any, unknown, never, void, bigint, symbol

常见内置对象  
Date, Error, Array, Map, Set, Regexp, Promise

* Object: `{ field: string }`
* Function: `(arg: number) => string`
* Arrays: `string[]` or `Array<string>`
* Tuple: `[string, number]`

```ts
interface JSONResponse extends Response, HTTPAble {
  version: number;

  /** In bytes */
  payloadSize: number;

  outOfStock?: boolean;

  update: (retryTimes: number) => void;
  update(retryTimes: number): void;

  (): JSONResponse

  new(s: string): JSONResponse;

  [key: string]: number;

  readonly body: string;
}
```

### 重载
```ts
interface Expect {
  (matcher: boolean): string;
  (matcher: string): boolean;
}
```

### Get & Set
```ts
interface Ruler {
  get size(): number;
  set size(value: number | string);
}
```

### 声明合并
```ts
interface APICall {
  data: Response
}
interface APICall {
  error?: Error
}
```

### 约束(implements) & 继承(extends)
```ts
interface Animal {
  name: string;
  age: number;
}

interface Pet extends Animal {
  owner: string;
  play(): void;
}

class Dog implements Pet {
  name: string;
  age: number;
  owner: string;

  constructor(name: string, age: number, owner: string) {
    this.name = name;
    this.age = age;
    this.owner = owner;
  }

  play() {
    console.log(`${this.name} is playing`);
  }
}
```

## Type
```ts
type JSONResponse = {
  version: number;
  /** In bytes */
  payloadSize: number;
  outOfStock?: boolean;
  update: (retryTimes: number) => void;
  update(retryTimes: number): void;
  (): JSONResponse
  [key: string]: number;
  new (s: string): JSONResponse;
  readonly body: string;
}
```

### 原始类型
```ts
type SanitizedInput = string;
type MissingNo = 404;
```

### 对象类型
```ts
type Location = {
  x: number;
  y: number;
};
```

### 元组(Tuple)
```ts
type Data = [location: Location, timestamp: string];
```

### 联合类型(Union)
```ts
type Size = "small" | "medium" | "large";
```

### 交叉类型(&)
```ts
type Loaction = { x: number } & { y: number };
// type Location = { x: number; y: number }
```

### 类型索引
```ts
type Response = { data: {  } }

type Data = Response['data']
```

### 值类型
```ts
const data = {}
type Data = typeof data
```

### 函数返回
```ts
const createFixtures = () => {}
type Fixtures = ReturnType<typeof createFixtures>

function test(fixture: Fixtures) {}
```

### 类型中的模块
```ts
const data: import("./data").data
```

### 映射类型
```ts
type Artist = {
  name: string;
  bio: string;
}

type Subscriber<Type> = {
  [Property in keyof Type]: (newValue: Type[Property]) => void;
}

type ArtistSub = Subscriber<Artist>;
/*
type ArtistSub = {
  name: (newValue: string) => void;
  bio: (newValue: string) => void;
}
*/
```

### 条件类型
```ts
type HasFourLegs<Animal> =
  Animal extends { legs: 4 } ? Animal
    : never;
type Bird = { legs: 2 };
type Dog = { legs: 4 };
type Ant = { legs: 6 };
type Wolf = { legs: 4 };
type Animals = Bird | Dog | Ant | Wolf;
type FourLegs = HasFourLegs<Animals>;
// type FourLegs = Dog | Wolf
```

### 模板联合类型
```ts
type SupportedLangs = "en" | "pt" | "zh";
type FooterLocaleIDs = "header" | "footer";

type AllLocaleIDs = `${SupportedLangs}_${FooterLocaleIDs}_id`;
// type AllLocaleIDs = "en_header_id" | "en_footer_id" | "pt_header_id" | "pt_footer_id" | "zh_header_id" | "zh_footer_id"
```


## Control Flow Analysis(控制流分析)
核心：类型收窄

### 类型守卫
#### `typeof` 守卫
```ts
const input = getUserInput();
// input: string | number

if (typeof input === 'string') {
  // input: string
}
```

#### `instanceof` 守卫
```ts
const input  = getUserInput()
// input: number | number[]

if (input instanceof Array) {
  // input: numberp[]
}
```

#### `in` 守卫
```ts
const input = getUserInput()
// input: string | { error: .... }

if ('error' in input) {
  // input: { error: ... }
}
```

#### 自定义类型守卫 (用户定义的类型守卫)
```ts
const input = getUserInput()
// input: number | number[]

if (Array.isArray(input)) {
  // input: number[]
}
```

### 可辨别联合(Discriminated Unions)
这是一种非常强大的模式，通常与字面量类型和 switch 语句结合使用。

```ts
type Responses =
  | { status: 200, data: any }
  | { status: 301, to: string }
  | { status: 400, error: Error }

const response = getResponse()
// response: Responses

switch (response.status) {
  case 200: return response.data
  case 301: return redirect(response.to)
  case 400: return response.error
}
```

### 类型守卫函数(Type Guards)
```ts
function isErrorResponse(obj: Response): obj is APIErrorResponse {
  return obj instanceof APIErrorResponse
}


const response = getResponse()
response // 此时类型是 Response | APIErrorResponse

if (isErrorResponse(response)) {
  response // 在 if 代码块内，类型被收窄为 APIErrorResponse
}
```

### 断言函数(Assertion Functions)
```ts
function assertResponse(obj: any): asserts obj is SuccessResponse {
  if (!(obj instanceof SuccessResponse)) {
    throw new Error("Not a success!")
  }
}

const res = getResponse()
// res: SuccessResponse | ErrorResponse

assertResponse(res)
// res: SuccessResponse
```

### 赋值(Assignment)
#### `as const` 窄化
```ts
const data1 = {  
  name: "Zagreus"
}  
/*
typeof data1 = {  
  name: string  // 注意：这里是 string，不是 "Zagreus"
}
*/

const data2 = {  
  name: "Zagreus"
} as const  
/*
typeof data2 = {  
  name: "Zagreus"  // 字面量类型，不是 string
}
*/
```

#### 变量间的类型跟踪(Tracks through related variables)
```ts
const response = getResponse();
const isSuccessResponse = res instanceof SuccessResponse;

if (isSuccessResponse) {
  // res.data // TypeScript 知道这里是 SuccessResponse
}
```