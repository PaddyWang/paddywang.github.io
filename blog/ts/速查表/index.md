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

## Interface

## Type

## Control Flow Analysis(控制流分析)