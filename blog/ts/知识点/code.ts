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