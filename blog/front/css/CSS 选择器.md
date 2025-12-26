---
outline: deep
---

# CSS 选择器

## 基本选择器
* 类选择器 `.class`
* id 选择器 `#id`
* 标签选择器 `div`
* 通配符 `*`

## 关系选择器
* 并集选择器 `div, p, ul, li`
* 后代选择器 `ul li`  
选择`<ul>`元素内的所有`<li>`元素
  ```html{3,5,8,9}
  <ul>
    <li>
      这个li会被选中
      <ol>
        <li>这个li会被选中</li>
      </ol>
    </li>
    <li>这个li会被选中</li>
    <li>这个li会被选中</li>
  </ul>
  ```

### 子代选择器 `>`
`ul > li` 选择在`<ul>`元素内的第一层`<li>`元素
```html{3,8,9}
<ul>
  <li>
    这个li会被选中
    <ol>
      <li>这个li不会被选中</li>
    </ol>
  </li>
  <li>这个li会被选中</li>
  <li>这个li会被选中</li>
</ul>
```

### 相邻兄弟选择器 `+`
`div + p` 选择紧接在`<div>`后面第一个`<p>`元素
```html{2}
<div>div</div>
<p>第一个p会被选中</p>
<p>第二个p不会被选中</p>
```

### 一般兄弟选择器 `~`
`div ~ p` 选择与`<div>`同父元素的且在`<div>`元素之后的所有兄弟`<p>`元素
```html{5,6}
<p>在div上面的p不会被选中</p>
<div>
  <p>div里面的p不会被选中</p>
</div>
<p>第一个p会被选中</p>
<p>第二个p会被选中</p>
```

## 属性选择器
### [id]
`div[id]` 选择带有id属性的所有`<div>`元素
```html{1,2}
<div id="box">会被选中</div>
<div id>会被选中</div>
<div>不会被选中</div>
```

### [target="_blank"]
`a[target="_blank"]` 选择`target=_blank`的所有`<a>`元素
```html{1}
<a href="#" target="_blank">会被选中</a>
<a href="#" target>不会被选中</a>
<a href="#">不会被选中</a>
```

### [class|=box]
`div[class|=box]` 选择`class`值为`box`的或者以`box-`开头的所有`<div>`元素
```html{1,2}
<div class="box">会被选中</div>
<div class="box-one">会被选中</div>
<div class="boxtwo">不会被选中</div>
<div class="three-box">不会被选中</div>
<div class="four box">不会被选中</div>
```

### [title~="hello"]
`div[title~="hello"]` 选择`title="hello"`或者是包含`hello`完整单词的所有`<div>`元素
```html{1,2}
<div title="hello">会被选中</div>
<div title="one hello">会被选中</div>
<div title="hellotwo">不会被选中</div>
<div title="three-hello">不会被选中</div>
```

### [href^="http"]
`a[href^="http"]` 选择`href`值以`http`开头的所有的`<a>`元素
```html{1}
<a href="http://www.">会被选中</a>
<a href="#http://www.">不会被选中</a>
<a href="www.">不会被选中</a>
```

### [scr$=".png"]
`img[scr$=".png"]` 选择`src`值以`.png`结尾的所有`<img>`元素
```html{1}
<img src="01.png" alt="会被选中">
<img src="01.jpg" alt="不会被选中">
<img src="01.pngj" alt="不会被选中">
```

### [class*="text"]
`p[class*="text"]` 选择`class`值中包含`text`的所有`<p>`元素
```html{1,2,3}
<div class="text">会被选中</div>
<div class="one-text">会被选中</div>
<div class="two text">会被选中</div>
<div class="tthreeext">不会被选中</div>
```

## 伪类选择器
> 选择该父元素内的元素
### :first-child
`h1:first-child` 选择`h1`的父元素下的第一个标签，并且是`<h1>`
```html{2,5}
<div>
  <h1>会被选中</h1>
  <h1>不会被选中</h1>
  <div>
    <h1>会被选中</h1>
    <h1>不会被选中</h1>
  </div>
  <div>
    <h3>不会被选中</h3>
    <h1>不会被选中</h1>
  </div>
</div>
```

### :last-child
`h1:last-child` 选择`h1`的父元素下的最后一个标签，并且是`<h1>`
```html{6,10}
<div>
  <h1>不会被选中</h1>
  <h1>不会被选中</h1>
  <div>
    <h1>不会被选中</h1>
    <h1>会被选中</h1>
  </div>
  <div>
    <h3>不会被选中</h3>
    <h1>会被选中</h1>
  </div>
</div>
```

### :first-of-type
`h3:first-of-type` 选择`h3`父元素下第一个出现的`<h3>`
```html{2,7}
<div>
  <h3>会被选中</h3>
  <h3>不会被选中</h3>
  <h1>不会被选中</h1>
  <div>
    <h1>不会被选中</h1>
    <h3>会被选中</h3>
    <h1>不会被选中</h1>
  </div>
</div>
```

### :last-of-type
`h3:last-of-type` 选择`h3`父元素下最后一个出现的`<h3>`
```html{3,7}
<div>
  <h3>不会被选中</h3>
  <h3>会被选中</h3>
  <h1>不会被选中</h1>
  <div>
    <h1>不会被选中</h1>
    <h3>会被选中</h3>
    <h1>不会被选中</h1>
  </div>
</div>
```

### :only-of-type
`h3:only-of-type` 选择`h3`父元素下仅仅只有一个`<h3>`元素（可以含有其他标签）
```html{7}
<div>
  <h3>不会被选中</h3>
  <h3>不会被选中</h3>
  <h1>不会被选中</h1>
  <div>
    <h1>不会被选中</h1>
    <h3>会被选中</h3>
    <h1>不会被选中</h1>
  </div>
</div>
```

### :only-child
`h3:only-child` 选择没有兄弟元素的`<h3>`元素
```html{10}
<div>
  <h3>不会被选中</h3>
  <h3>不会被选中</h3>
  <h1>不会被选中</h1>
  <div>
    <h1>不会被选中</h1>
    <h3>不会被选中</h3>
  </div>
  <div>
    <h3>会被选中</h3>
  </div>
</div>
```

### :nth-child(n)
`p:nth-child(3)`选择`p`父元素下第三个元素是`<p>`  
参数支持：`an+b` 形式 即`2n+1`  
其中`a`可正可负  `b`必须为正  
当`a`为负时，`-n+3` 选择倒数三个   
下例：`p:nth-child(2n+1)`
```html{2,4,6,8}
<div>
  <p>会被选中</p>
  <p>不会被选中</p>
  <p>会被选中</p>
  <p>不会被选中</p>
  <p>会被选中</p>
  <p>不会被选中</p>
  <p>会被选中</p>
</div>
```

### :nth-last-child(n)
`p:nth-last-child(3)`
选择`p`父元素下倒数第三个是`<p>`
```html{5,7}
<div>
  <p>不会被选中</p>
  <p>不会被选中</p>
  <p>不会被选中</p>
  <p>会被选中</p>
  <div>
    <p>会被选中</p>
    <p>不会被选中</p>
    <p>不会被选中</p>
  </div>
  <div>
    <div>不会被选中</div>
    <p>不会被选中</p>
    <p>不会被选中</p>
  </div>
</div>
```

### :nth-of-type(n)
`p:nth-of-type(3)` 选择`p`父元素下第三个`<p>`
```html{5,9,15}
<div>
  <div>不会被选中</div>
  <p>不会被选中</p>
  <p>不会被选中</p>
  <p>会被选中</p>
  <div>
    <p>不会被选中</p>
    <p>不会被选中</p>
    <p>会被选中</p>
  </div>
  <div>
    <p>不会被选中</p>
    <div>不会被选中</div>
    <p>不会被选中</p>
    <p>会被选中</p>
  </div>
</div>
```

### :nth-last-of-type(n)
`p:nth-last-of-type(3)` 选择`p`父元素下倒数第三个`<p>`
```html{3,7,12}
<div>
  <div>不会被选中</div>
  <p>会被选中</p>
  <p>不会被选中</p>
  <p>不会被选中</p>
  <div>
    <p>会被选中</p>
    <p>不会被选中</p>
    <p>不会被选中</p>
  </div>
  <div>
    <p>会被选中</p>
    <div>不会被选中</div>
    <p>不会被选中</p>
    <p>不会被选中</p>
  </div>
</div>
```

* `a:link`  未被访问的`a`链接
* `a:visited`  已被访问的`a`链接
* `a:active`  `a`链接被激活状态
* `a:hover`  鼠标经过`a`链接
* `input:focus` 选择获取焦点的`<input>`元素
* `:root`  选择文档根元素即`<html>`元素
* `div:empty`  选择空的`div`元素（也不可以有文本）
* `p:target`  选择当前活动的`<p>`元素 (一般用于锚链接)
* `input:enabled`  选择激活的`<input>`元素
* `input:disabled`  选择禁用的`<input>`元素
* `:not(p)`  选择非`p`的元素 **(`p`要设置相应的样式，否则也会调用`:not(p)`里的样式)**


## 伪元素选择器
* `p::first-letter`  
选择所有`<p>`元素的第一个字符
* `p::first-line`  
选择所有`<p>`元素的第一行字符
* `div::before`  
在每个`div`之前插入的内容`content`及样式
* `div::after`  
在每个`div`之后插入的内容`content`及样式
* `p::selection`  
选择所有`<p>`元素被用户选取的内容样式  
**只能设置`color`、`background`、`cursor` 以及 `outline`**
