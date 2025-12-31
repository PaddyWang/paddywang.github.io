---
outline: deep
---

# [译]The Super Tiny Compiler
今天我们将一起编写一个编译器。但不是所有的编译器  
一个超级超级微型编译器！编译器是如此之小，只有~200行实际代码  

我们将把类似lisp的函数调用 编译成类似c(和JS也一样)的函数调用函数调用  

如果你对其中一个不熟悉。我给你们简单介绍一下

如果我们有两个函数“加”和“减”，它们就会这样写：

|      | LISP | C
|:----:|:-----:|:------
| 2 + 2 | (add 2 2) | add(2, 2)
| 4 - 2 | (subtract 4 2) | subtract(4, 2)
| 2 + (4 - 2) | (add 2 (subtract 4 2)) | add(2, subtract(4, 2))

很简单，对吧？

很好，因为这正是我们要编译的。虽然这既不是一个完整的LISP或C语法，这将是足够的语法来演示现代编译器的许多主要部分

大多数编译器分为三个主要阶段：解析、转换、和代码生成
1. **解析** 是将原始代码转换为更抽象的代码的表示 (抽象语法树)
2. **转换** 采用这种抽象表示并进行操作 编译器希望它做的任何事情
3. **代码生成** 采用转换后的代码表示形式 将其转换为新代码

## 解析(Parsing)
解析通常分为两个阶段：词法解析和句法解析
1. **词法解析** 采用原始代码，并通过一个称为词法分析器的东西将其分解为这些称为标记的东西
    令牌(token)是一组微小的对象，用于描述语法的一个独立部分。它们可以是数字、标签、标点符号、运算符等等
2. **句法解析** 获取标记并将其重新格式化为描述语法各部分及其相互关系的表示形式。这被称为抽象语法树
    抽象语法树（Abstract Syntax Tree，简称AST）是一个深度嵌套的对象，它以一种既易于使用又能告诉我们大量信息的方式表示代码

对于以下语法：  

`(add 2 (subtract 4 2))`

令牌(Tokens)可能看起来像这样： 
```js
[
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'add'      },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: '('        },
  { type: 'name',   value: 'subtract' },
  { type: 'number', value: '4'        },
  { type: 'number', value: '2'        },
  { type: 'paren',  value: ')'        },
  { type: 'paren',  value: ')'        },
]
```

抽象语法树（AST）可能是这样的：
```js
{
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2',
    }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '4',
      }, {
        type: 'NumberLiteral',
        value: '2',
      }]
    }]
  }]
}
```

## 理论讲解
### 转换(Transformation)
编译器的下一个阶段是转换。同样，这只是从最后一步提取AST并对其进行更改。它可以用相同的语言操作AST，也可以将其翻译成一种全新的语言

让我们看看如何变换AST

您可能会注意到AST中的元素看起来非常相似。这些对象具有 `type` 属性  
其中每一个都被称为AST节点。这些节点定义了描述树的部分的属性

我们可以为 `NumberLiteral` 创建一个节点：
```js
{
  type: 'NumberLiteral',
  value: '2',
}
```

或者是一个 `CallExpression` 的节点：
```js
{
  type: 'CallExpression',
  name: 'subtract',
  params: [...nested nodes go here...],
}
```

在转换AST时，我们可以通过添加/删除/替换属性来操作节点，我们可以添加新节点，删除节点，或者我们可以保留现有的AST并基于它创建一个全新的AST

由于我们的目标是一种新语言，所以我们将重点放在创建一个特定于目标语言的全新AST上  

#### Traversal
为了浏览所有这些节点，我们需要能够遍历它们。这个遍历过程以深度优先的方式遍历AST中的每个节点

```js
{
  type: 'Program',
  body: [{
    type: 'CallExpression',
    name: 'add',
    params: [{
      type: 'NumberLiteral',
      value: '2'
    }, {
      type: 'CallExpression',
      name: 'subtract',
      params: [{
        type: 'NumberLiteral',
        value: '4'
      }, {
        type: 'NumberLiteral',
        value: '2'
      }]
    }]
  }]
}
```

所以对于上面的AST，我们可以这样做：

1. **Program** - 从AST的顶层开始
2. **CallExpression (add)** - 移动到程序体的第一个元素
3. **NumberLiteral (2)** - 移动到CallExpression参数的第一个元素
4. **CallExpression (subtract)** - 移动到CallExpression参数的第二个元素
5. **NumberLiteral (4)** - 移动到CallExpression参数的第一个元素
6. **NumberLiteral (2)** - 移动到CallExpression参数的第二个元素

如果我们直接操作这个AST，而不是创建一个单独的AST，我们可能会在这里引入各种抽象树。但是仅仅访问树中的每个节点对于我们要做的已经足够了

我之所以使用**访问(visiting)**这个词，是因为存在一种 如何表示对象结构元素上的操作的模式

这里的基本思想是，我们将创建一个**访问者(visitor)**对象，该对象具有接受不同节点类型的方法  
```js
var visitor = {
  NumberLiteral() {},
  CallExpression() {},
};
```

当遍历AST时，只要**输入(enter)**匹配类型的节点，就调用该访问器的方法

为了使其有用，我们还将传递节点和对父节点的引用
```js
var visitor = {
  NumberLiteral(node, parent) {},
  CallExpression(node, parent) {},
};
```

然而，也存在**退出(exit)**的可能性。想象一下我们之前的树结构以列表的形式出现：
```
- Program
  - CallExpression
    - NumberLiteral
    - CallExpression
      - NumberLiteral
      - NumberLiteral
```
我们往下走的时候，会碰到叶子节点  
当我们完成树的每个分支时，我们**退出(exit)**它  
所以往下走，我们**进入(enter)**每个节点，再往上走，我们**退出(exit)**  

```
-> Program (enter)
  -> CallExpression (enter)
    -> Number Literal (enter)
    <- Number Literal (exit)
    -> Call Expression (enter)
       -> Number Literal (enter)
       <- Number Literal (exit)
       -> Number Literal (enter)
       <- Number Literal (exit)
    <- CallExpression (exit)
  <- CallExpression (exit)
<- Program (exit)
```

为了支持这一点，访问者(visitor)的最终形式是这样的：
```js
var visitor = {
  NumberLiteral: {
    enter(node, parent) {},
    exit(node, parent) {},
  }
};
```

### 代码生成(Code Generation)
编译器的最后一个阶段是代码生成(Code Generation)  
有时编译器会做一些与转换重叠的事情，但在大多数情况下，代码生成只是把AST和字符串化代码输出出来

代码生成器以几种不同的方式工作，一些编译器将重用前面的令牌(Tokens)，*其他编译器将单独创建代码的表示，以便它们可以线性打印节点，*但据我所述，大多数将使用我们刚刚创建的相同AST，这是我们将重点关注的  

实际上，我们的代码生成器将知道如何“打印(print)”AST的所有不同节点类型，并且它将递归地调用自己来打印嵌套节点，直到所有内容都被打印成一长串代码

就是这样！这是编译器的所有不同部分

这并不是说每个编译器看起来都像我在这里描述的那样  
编译器有许多不同的用途，它们可能需要比我详细描述的更多的步骤  

但是现在您应该对大多数编译器有了一个大致的概念

既然我已经解释了所有这些，您就可以开始编写自己的编译器了，对吗？  

开个玩笑，这就是我要帮你的

让我们开始…


## 实现部分
### tokenizer
我们将从解析的第一阶段开始: 词法解析，用标记器  

我们将把我们的代码字符串分解成一个令牌数组  
`(add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]`

```js
// 我们首先接受一个输入字符串，我们将干两件事…
function tokenizer(input) {
  // 一个 current 变量，用于跟踪我们在代码中的位置，就像光标一样
  let current = 0;

  // 还有一个用于添加 Token 的数组
  let tokens = [];

  // 我们首先创建一个 while 循环，在这个循环中，我们将 current 变量设置为我们希望在循环内增加多少
  // 这样做是因为我们可能希望在一个循环中多次增加 current ，因为我们的令牌可以是任意长度
  while (current < input.length) {

    // 我们通过 char 来存储 input 的当前值
    let char = input[current];

    // 首先要检查的是 左括号( 这稍后将用于 CallExpression ，但现在我们只关心 char
    // 我们检查是否有一个左括号：
    if (char === '(') {

      // 如果这样做，则推入一个带有 paren 类型的新标记，并将值设置为 (
      tokens.push({
        type: 'paren',
        value: '(',
      });

      // 然后我们增加 current
      current++;

      // 然后我们 继续 进入下一个循环
      continue;
    }

    // 接下来我们要检查是否有右括号。我们做和之前完全一样的事情：检查右括号，添加一个新标记，增加 current 和 continue
    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')',
      });
      current++;
      continue;
    }

    // 接下来，我们将检查空格。这很有趣，因为我们关心空格的存在是为了分隔字符，但对于我们来说，将其存储为令牌实际上并不重要。我们要过滤掉它
    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // 下一种类型的令牌是数字。这与我们之前看到的不同，因为数字可以是任意数量的字符，我们希望将整个字符序列捕获为一个标记
    // 
    //   (add 123 456)
    //        ^^^ ^^^
    //        这是两个单独的 tokens
    //
    // 当我们遇到第一个数字时，我们就开始了
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {

      // 我们会创建一个 value 字符串 我们会把字符添加上去
      let value = '';

      // 然后我们将循环遍历序列中的每个字符，直到遇到一个非数字的字符，将每个数字字符添加到 value 上，并在此过程中增加 current
      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // 之后，我们将 number 标记添加到 tokens 数组
      tokens.push({ type: 'number', value });

      // 我们继续
      continue;
    }

    // 我们还将在我们的语言中添加对字符串的支持，即任何被双引号 (") 包围的文本。
    //
    //   (concat "foo" "bar")
    //            ^^^   ^^^ string tokens
    //
    // 我们将从双引号(") 开始:
    if (char === '"') {
      // 保留一个 value 变量来构建我们的字符串标记
      let value = '';

      // 我们将跳过开头的双引号
      char = input[++current];

      // 然后我们将遍历每个字符，直到到达另一个双引号
      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      // 跳过结束双引号
      char = input[++current];

      // 并将我们的 string  token 添加到 tokens 数组。
      tokens.push({ type: 'string', value });

      continue;
    }

    // 最后一种类型的令牌将是 `name` token。这是一个字母序列，而不是数字，它们是lisp语法中的函数名
    //
    //   (add 2 4)
    //    ^^^
    //    Name token
    //
    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';

      // 同样，我们要循环遍历所有的字母，将它们压入一个值
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      // 将 name 类型 添加到 tokens 数组中 并 继续
      tokens.push({ type: 'name', value });

      continue;
    }

    // 最后，如果到目前为止还没有匹配到一个字符，我们将抛出一个错误并完全退出
    throw new TypeError('I dont know what this character is: ' + char);
  }

  // 然后在 tokenizer 的末尾，我们简单地返回 tokens 数组
  return tokens;
}
```

### parser
对于解析器，我们将获取 Token 数组并将其转换为 AST  
`[{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }`

```js
// 我们定义了一个 parser 函数 它接受我们的 tokens 数组
function parser(tokens) {

  // 同样，我们保留了一个 `current` 变量，我们将其用作光标
  let current = 0;

  // 但是这次我们将使用递归而不是 while 循环。所以我们定义了一个 `walk` 函数
  function walk() {

    // 在 walk 函数中，我们首先获取 `current` token
    let token = tokens[current];

    // 我们将把每种类型的 token 分成不同的代码路径，从 `number` token 开始。
    //
    // 我们检测是否是 `number` token.
    if (token.type === 'number') {

      // 如果是 增加 `current`
      current++;

      // 我们将返回一个名为 `NumberLiteral` 的新 AST 节点并将其值设置为 token 的值
      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    // 如果是一个字符串，我们将做与 number 相同的事情并创建一个 `StringLiteral` 节点
    if (token.type === 'string') {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    // 接下来，我们将寻找 callexpressiones 当遇到右括号时，我们就开始这样做
    if (
      token.type === 'paren' &&
      token.value === '('
    ) {

      // 我们将增加 `current` 以跳过括号，因为我们在AST中不关心它
      token = tokens[++current];

      // 我们用 `CallExpression` 类型创建一个基本节点，我们将把名称设置为当前 token 的值，因为右括号的下一个 token 是函数的名称
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };

      // 我们再次增加 `current` 以跳过 Name token
      token = tokens[++current];

      // 现在我们要循环遍历每个标记，这些标记将成为我们的 `CallExpression` 的“参数”，直到我们遇到左括号
      //
      // 这就是递归的由来。而不是试图解析一个可能无限嵌套的节点集合，我们将依靠递归来解决问题
      //
      // 为了解释这一点，让我们以Lisp代码为例。你可以看到 `add` 的参数是一个数字和一个嵌套的 `CallExpression` ，其中包括它它本身的数字
      //
      //   (add 2 (subtract 4 2))
      //
      // 您还会注意到，在我们的 token 数组中有多个右括号
      //
      //   [
      //     { type: 'paren',  value: '('        },
      //     { type: 'name',   value: 'add'      },
      //     { type: 'number', value: '2'        },
      //     { type: 'paren',  value: '('        },
      //     { type: 'name',   value: 'subtract' },
      //     { type: 'number', value: '4'        },
      //     { type: 'number', value: '2'        },
      //     { type: 'paren',  value: ')'        }, <<< 右括号
      //     { type: 'paren',  value: ')'        }, <<< 右括号
      //   ]
      //
      // 我们将依靠嵌套的 `walk` 函数来增加 `current` 变量来遍历嵌套的 `CallExpression`

      // 因此，我们创建了一个 `while` 循环，直到它遇到一个“类型”为 `parenn`、“值”为 右括号 的 token
      while (
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== ')')
      ) {
        // 我们将调用 `walk` 函数，它将返回一个 `node` ，并将其推入 `node.params`
        node.params.push(walk());
        token = tokens[current];
      }

      // 最后，增加 `current` 以跳过右括号
      current++;

      // 返回 node 节点
      return node;
    }

    // 同样，如果我们现在还没有识别出 token 类型，我们将抛出一个错误
    throw new TypeError(token.type);
  }

  // 现在，我们要创建 AST， AST 的根节点是 `Program` 节点
  let ast = {
    type: 'Program',
    body: [],
  };

  // 我们将启动我们的 `walk` 函数，将节点添加到我们的 `ast.body` 的数组
  //
  // 我们在循环中这样做的原因是因为我们的程序可以在另一个之后还有 `CallExpression` 而不是嵌套结构
  //
  //   (add 2 2)
  //   (subtract 4 2)
  //
  while (current < tokens.length) {
    ast.body.push(walk());
  }

  // 在解析器的最后，我们将返回 AST
  return ast;
}
```

### traverse
现在我们有了AST，我们希望能够用访问者访问不同的节点  
我们需要能够在遇到具有匹配类型的节点时调用访问器上的方法

```JS
traverse(ast, {
  Program: {
    enter(node, parent) {
      // ...
    },
    exit(node, parent) {
      // ...
    },
  },
  CallExpression: {
    enter(node, parent) {
      // ...
    },
    exit(node, parent) {
      // ...
    },
  },
  NumberLiteral: {
    enter(node, parent) {
      // ...
    },
    exit(node, parent) {
      // ...
    },
  },
});
```

```JS
// 因此，我们定义了一个遍历器函数，它接受AST和访问者。在里面，我们将定义两个函数
function traverser(ast, visitor) {

  // 一个 `traverseArray` 函数，它将允许我们迭代数组并调用我们将定义的下一个函数：`traverseNode`
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  // `traverseNode` 将接受 `node` 和 `parent` 节点。这样它就可以传递给我们的访问者方法
  function traverseNode(node, parent) {

    // 我们首先在具有匹配 `type` 的访问者上测试是否存在方法
    let methods = visitor[node.type];

    // 如果这个节点类型有一个 `enter` 方法，我们将使用 `node` 和 `parent` 来调用它
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    // 接下来，我们将根据当前节点类型进行拆分
    switch (node.type) {

      // 我们将从最顶层的 `Program` 开始。由于 Program 节点有一个名为 body 的属性，该属性包含一个节点数组，因此我们将调用 `traverseArray` 向下遍历这些节点
      //
      // （记住，`traverseArray` 将反过来调用 `traverseNode` ，所以我们导致树被递归遍历）
      case 'Program':
        traverseArray(node.body, node);
        break;

      // 接下来，我们对 `CallExpression` 做同样的事情，遍历它们的 `params`
      case 'CallExpression':
        traverseArray(node.params, node);
        break;

      // 在 `NumberLiteral` 和 `StringLiteral` 的情况下，我们没有任何要访问的子节点，所以我们会中断
      case 'NumberLiteral':
      case 'StringLiteral':
        break;

      // 同样，如果我们没有识别出节点类型，我们就会抛出一个错误
      default:
        throw new TypeError(node.type);
    }

    // 如果这个节点类型有一个 `exit` 方法，我们将传递 `node` 和 `parent` 来调用它
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  // 最后，我们通过调用 `traverseNode` 来启动遍历器，因为 ast 的顶层没有父节点，所以没有 `parent`
  traverseNode(ast, null);
}
```

### transformer
接下来是转换器。我们的转换器将接受我们构建的AST，并将其传递给带访问者的遍历器函数，并将创建一个新的AST

```
----------------------------------------------------------------------------
  Original AST                     |   Transformed AST
----------------------------------------------------------------------------
  {                                |   {
    type: 'Program',               |     type: 'Program',
    body: [{                       |     body: [{
      type: 'CallExpression',      |       type: 'ExpressionStatement',
      name: 'add',                 |       expression: {
      params: [{                   |         type: 'CallExpression',
        type: 'NumberLiteral',     |         callee: {
        value: '2'                 |           type: 'Identifier',
      }, {                         |           name: 'add'
        type: 'CallExpression',    |         },
        name: 'subtract',          |         arguments: [{
        params: [{                 |           type: 'NumberLiteral',
          type: 'NumberLiteral',   |           value: '2'
          value: '4'               |         }, {
        }, {                       |           type: 'CallExpression',
          type: 'NumberLiteral',   |           callee: {
          value: '2'               |             type: 'Identifier',
        }]                         |             name: 'subtract'
      }]                           |           },
    }]                             |           arguments: [{
  }                                |             type: 'NumberLiteral',
                                   |             value: '4'
---------------------------------- |           }, {
                                   |             type: 'NumberLiteral',
                                   |             value: '2'
                                   |           }]
 (sorry the other one is longer.)  |         }
                                   |       }
                                   |     }]
                                   |   }
----------------------------------------------------------------------------
```

```js
// 因此，我们有一个转换器函数，它将接受 lisp ast
function transformer(ast) {

  // 我们将创建一个 `newAst` ，它将像前面的AST一样具有一个 Program 节点
  let newAst = {
    type: 'Program',
    body: [],
  };

  // 接下来我要做一点小改动，创建一个小 hack。我们会在父节点上使用一个名为 `context` 的属性我们会把节点推到它们父节点的 `context` 中。通常你会有一个比这更好的抽象，但对于我们的目的，这使事情变得简单
  //
  // 请注意，上下文是从旧 ast 到新 ast 的引用
  ast._context = newAst.body;

  // 我们首先用 ast 和 visitor 调用遍历器函数
  traverser(ast, {

    // 第一个 visitor 方法接受任何 `NumberLiteral`
    NumberLiteral: {
      // 我们将在 enter 时访问他们
      enter(node, parent) {
        // 我们将创建一个同样名为 `NumberLiteral` 的新节点，并将其推送到 父上下文
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value,
        });
      },
    },

    // 下一个是 `StringLiteral`
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value,
        });
      },
    },

    // 再下一个是 `CallExpression`
    CallExpression: {
      enter(node, parent) {

        // 我们开始用嵌套的 `Identifier` 创建一个新的节点 `CallExpression`
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        };

        // 接下来，我们将在原始的 `CallExpression` 节点上定义一个新的上下文，它将引用 `expression` 的参数，以便我们可以推入参数
        node._context = expression.arguments;

        // 然后我们将检查父节点是否是一个 `CallExpression`
        // 如果他不是...
        if (parent.type !== 'CallExpression') {

          // 我们将用一个 `ExpressionStatement` 来包装我们的 `CallExpression` 节点
          // 我们这样做是因为顶级 `CallExpression` 在 JavaScript 中是语句
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          };
        }

        // 最后，我们把 `CallExpression` 推到父级的上下文中
        parent._context.push(expression);
      },
    }
  });

  // 在 transformer 函数的最后，我们将返回刚刚创建的新 ast
  return newAst;
}
```

### codeGenerator
现在让我们进入最后一个阶段：代码生成器(Code Generator)

我们的代码生成器将递归地调用它自己，将树中的每个节点打印成一个巨大的字符串

```js
function codeGenerator(node) {

  // 我们将根据 `node` 的 `type` 进行分解
  switch (node.type) {

    // 如果我们有一个 `Program` 节点。我们将映射 `body` 中的每个节点，并通过代码生成器运行它们，并用换行符将它们连接起来
    case 'Program':
      return node.body.map(codeGenerator)
        .join('\n');

    // 对于 `ExpressionStatement` 我们将调用嵌套表达式上的代码生成器，并添加一个分号...
    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression) +
        ';' // <<
      );

    // 对于 `CallExpression` ，我们将打印 `callee` ，添加一个左括号，我们将映射 `arguments` 数组中的每个节点并通过代码生成器运行它们，用逗号将它们连接起来，然后我们将添加一个右括号
    case 'CallExpression':
      return (
        codeGenerator(node.callee) +
        '(' +
        node.arguments.map(codeGenerator)
          .join(', ') +
        ')'
      );

    // 对于 `Identifier` 我们将返回 `node` 节点的名字
    case 'Identifier':
      return node.name;

    // 对于 `NumberLiteral` 我们将返回 `node` 节点的值
    case 'NumberLiteral':
      return node.value;

    //  对于 `StringLiteral` 我们用双引号把 `node` 节点的值包裹起来并返回
    case 'StringLiteral':
      return '"' + node.value + '"';

    // 如果没有识别出节点，就会抛出错误
    default:
      throw new TypeError(node.type);
  }
}
```

### compiler
终于!我们将创建 `compiler` 函数。在这里，我们将把管道的每个部分连接在一起

1. input  => tokenizer   => tokens
2. tokens => parser      => ast
3. ast    => transformer => newAst
4. newAst => generator   => output

```js
function compiler(input) {
  let tokens = tokenizer(input);
  let ast    = parser(tokens);
  let newAst = transformer(ast);
  let output = codeGenerator(newAst);

  // 然后简单地返回输出
  return output;
}
```


**源码来源**：[The Super Tiny Compiler](https://github.com/jamiebuilds/the-super-tiny-compiler/tree/master)