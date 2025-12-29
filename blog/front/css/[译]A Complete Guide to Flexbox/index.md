---
outline: deep
---

# [译]A Complete Guide to Flexbox

> 这份完整的指南解释了有关 flexbox 的所有内容，重点介绍父元素（flex容器）和子元素（flex项）的所有不同可能属性  
> 它还包括历史记录，演示，模式和浏览器支持图表  


## 背景
> Flexbox布局（Flexible Box）模块（截至2017年10月为W3C候选建议书）旨在提供一种更有效的方式来布局、对齐和分配容器中各项目(items)之间的空间，即使它们的大小未知、动态（这也是“flex”一词的由来）  
> flex布局的主要思想是使容器能够更改其各项的宽度/高度（和顺序），以最好地填充可用空间（主要是适应所有类型的显示设备和屏幕尺寸）  
> flex容器会扩展项目以填充可用的可用空间，或收缩它们以防止溢出  
> 最重要的是，与常规布局（基于垂直的块和基于水平的内联块）相比，flexbox布局与方向无关  
> 虽然这些网页很不错，但是它们缺乏灵活性（没有双关语）来支持大型或复杂的应用程序（尤其是在方向更改，调整大小，拉伸，缩小等方面）  

## 基础与术语
> 由于flexbox是一个完整的模块，而不是单个属性，因此它涉及很多东西，包括其整个属性集  
> 其中一些作用于容器上（父元素，称为“弹性容器”），而其他一些则作用于孩子上（称为“弹性项”）  
> 如果“常规”布局是基于块和内联流方向，则弹性布局是基于“弹性流向”  
> 请查看规范中的该图，解释flex布局背后的主要思想  

<style>
  ._img {
    max-width: 500px;
    width: 100%;
    height: 310px;
  }
  .flex-example {
    position: relative;
    display: flex;
    border: 1px solid #000;
    padding: 10px;
    margin: 10px 0 20px;
    border-radius: 4px;
    background-color: rgba(156, 39, 176, .53);
  }
  .flex-example > span {
    width: 100px;
    height: 52px;
    margin: 2px;
    border: 1px solid #000;
    border-radius: 4px;
    background-color: rgba(247, 148, 31, .54);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .flex-example.align-items {
    height: 200px;
    box-sizing: initial;
  }
  .flex-example.align-items span {
    height: inherit;
  }
  .flex-example.align-content {
    height: 240px;
    flex-wrap: wrap;
  }
  .flex-example.stretch {
    height: inherit;
  }
</style>
<htmlview :src="import('./svg.html?raw')" />

<svg class="_img">
  <use xlink:href="#00-basic-terminology"></use>
</svg>

各项目将沿主轴（main-start -> main-end）或交叉轴（cross-start -> cross-end）的顺序布局  
* **main axis(主轴)**：可伸缩容器的主轴是可伸缩项目沿其布局的主轴。它不一定是水平的。它取决于 `flex-direction` 属性（请参见下文）  
* **main-start | main-end(主轴起点|主轴终点)**：flex 项目从 main-start 到 main-end 放置在容器中  
* **main size**：弹性项目的主要尺寸属性是“宽度”或“高度”属性，取决于主轴方向  
* **cross axis(交叉轴)**：垂直于主轴的轴称为交叉轴。其方向取决于主轴方向  
* **cross-start | cross-end**：在交叉轴上，从交叉轴的起点向终点布局  
* **cross size**：交叉轴的大小，同 main size

## 父元素属性（弹性容器）
<div align="center">
  <svg class="_img">
    <use xlink:href="#01-container"></use>
  </svg>
</div>

### display
> 这定义了一个伸缩容器；内联或块取决于给定的值。它为其所有直接子元素启用flex上下文  
```css{2}
.container {
  display: flex; /* or inline-flex */
}
```

### flex-direction
<div align="center">
  <svg class="_img">
    <use xlink:href="#03-flex-direction"></use>
  </svg>
</div>

> 这样便建立了主轴，从而确定了将弹性项放置在弹性容器中的方向  
> 除了可选包装外，Flexbox是单向布局概念  
> 可以将弹性项目想像为主要分布在水平行或垂直列中  
```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```
* **row (默认)**: 在ltr(字体的排版顺序)中从左到右；在rtl中从右到左，即水平布局
* **row-reverse**: 刚好和row相反
* **column**: 和row相似，从上到下排列，即垂直布局
* **column-reverse**: 刚好和column相反

### flex-wrap
<div align="center">
  <svg class="_img">
    <use xlink:href="#04-flex-wrap"></use>
  </svg>
</div>

> 默认情况下，所有弹性项目都将尝试放入一行(主轴上)  
> 该属性定义，如果一条主轴上排不下，如何换行  
```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

<ul>
  <li><b>nowrap (默认): </b>不换行。
    <div class="flex-example">
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
      <span>5</span>
      <span>6</span>
      <span>7</span>
      <span>8</span>
    </div>
  </li>
  <li><b>wrap:</b>换行，从上往下排列。
    <div class="flex-example" style="flex-wrap: wrap;">
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
      <span>5</span>
      <span>6</span>
      <span>7</span>
      <span>8</span>
    </div>
  </li>
  <li><b>wrap-reverse:</b>换行，从下往上排列。
    <div class="flex-example" style="flex-wrap: wrap-reverse;">
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
      <span>5</span>
      <span>6</span>
      <span>7</span>
      <span>8</span>
    </div>
  </li>
</ul>

### flex-flow
> `flex-direction` 和 `flex-wrap` 属性的简写  
> 默认值为 `flex-flow: row nowrap`  
```css
.container {
  flex-flow: column wrap;
}
```

### justify-content
> 定义了沿主轴的对齐方式  
> 当一行上的所有弹性项目都已达到最大大小时，它有助于分配剩余的可用自由空间  
> 当溢出时，它还对项目的对齐方式施加一些控制  
```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly | start | end | left | right ... + safe | unsafe;
}
```
<ul>
  <li><b>flex-start (默认)</b>: 沿着主轴的方向依次排列
    <div class="flex-example" style="justify-content: flex-start;">
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
  </li>
  <li><b>flex-end</b>: 沿着主轴的反方向依次排列
    <div class="flex-example" style="justify-content: flex-end;">
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
  </li>
  <li><i><b>start / end / left / right</b>: Chrome暂不支持，没有实验出来，暂不翻译。</i></li>
  <li><b>center</b>: 居中对齐。
    <div class="flex-example" style="justify-content: center;">
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
  </li>
  <li><b>space-between</b>: 两端对齐，项目间隔相同
    <div class="flex-example" style="justify-content: space-between;">
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
  </li>
  <li><b>space-around</b>: 两端对齐，项目间隔对齐，两端项目距弹性容器的距离为项目间距的一半，即每个项目所分配的空隙相同
    <div class="flex-example" style="justify-content: space-around;">
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
  </li>
  <li><b>space-evenly</b>: 两端对齐，所有空隙等距，即项目之间和两端项目到弹性容器的距离都相同
    <div class="flex-example" style="justify-content: space-evenly;">
      <span>1</span>
      <span>2</span>
      <span>3</span>
    </div>
  </li>
</ul>

### align-items
> 定义了弹性项目如何沿交叉轴的对齐方式  
```css
.container {
  align-items: stretch | flex-start | flex-end | center | baseline | first baseline | last baseline | start | end | self-start | self-end + ... safe | unsafe;
}
```

<ul>
  <li><b>stretch (默认):</b>在交叉轴上拉伸以填充容器（仍然遵守最小宽度/最大宽度）
    <div class="flex-example align-items">
        <span>1</span>
        <span>2</span>
        <span>3</span>
    </div>
  </li>
  <li><b>flex-start:</b>交叉轴的起点对齐
    <div class="flex-example align-items" style="align-items: flex-start;">
        <span style="height: 100px">1</span>
        <span style="height: 120px">2</span>
        <span style="height: 50px">3</span>
    </div>
  </li>
  <li><b>flex-end:</b>交叉轴的终点对齐
    <div class="flex-example align-items" style="align-items: flex-end;">
        <span style="height: 100px">1</span>
        <span style="height: 120px">2</span>
        <span style="height: 50px">3</span>
    </div>
  </li>
  <li><i><b>start / end / self-start / self-end</b>: Chrome暂不支持，没有实验出来，暂不翻译。</i></li>
  <li><b>center:</b>交叉轴的居中对齐
    <div class="flex-example align-items" style="align-items: center;">
        <span style="height: 100px">1</span>
        <span style="height: 120px">2</span>
        <span style="height: 50px">3</span>
    </div>
  </li>
  <li><b>baseline:</b>基线对齐
    <div class="flex-example align-items" style="align-items: baseline;">
        <span style="height: 100px; display: inline;">1 x</span>
        <span style="height: 120px; font-size: 20px;">2 x</span>
        <span style="height: 50px; display: inline;">3 x</span>
        <div style="position: absolute; width: 100%; height: 1px; color: yellow; background: yellow; top: 80px; left: 0; text-align: right;">baseline</div>
    </div>
  </li>
</ul>

### align-content
> 定义了多根主轴时的对齐方式，一根时不起作用  

```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around | space-evenly | stretch | start | end | baseline | first baseline | last baseline + ... safe | unsafe;
}
```

<ul>
  <li><b>normal (默认):</b> 从第二个轴线开始等距对齐（类似于把space-evenly对齐时的第一根轴线的开始空隙去掉）
    <div class="flex-example align-content">
      <span style="width: 80px">1</span>
      <span style="width: 120px">2</span>
      <span style="width: 200px">3</span>
      <span style="width: 80px">4</span>
      <span style="width: 120px">5</span>
      <span style="width: 200px">6</span>
      <span style="width: 80px">7</span>
      <span style="width: 120px">8</span>
      <span style="width: 200px">9</span>
    </div>
  </li>
  <li><b>flex-start:</b> 与交叉轴的起点对齐
    <div class="flex-example align-content" style="align-content: flex-start;">
      <span style="width: 80px">1</span>
      <span style="width: 120px">2</span>
      <span style="width: 200px">3</span>
      <span style="width: 80px">4</span>
      <span style="width: 120px">5</span>
      <span style="width: 200px">6</span>
      <span style="width: 80px">7</span>
      <span style="width: 120px">8</span>
      <span style="width: 200px">9</span>
    </div>
  </li>
  <li><b>flex-end:</b> 与交叉轴的终点对齐
    <div class="flex-example align-content" style="align-content: flex-end;">
      <span style="width: 80px">1</span>
      <span style="width: 120px">2</span>
      <span style="width: 200px">3</span>
      <span style="width: 80px">4</span>
      <span style="width: 120px">5</span>
      <span style="width: 200px">6</span>
      <span style="width: 80px">7</span>
      <span style="width: 120px">8</span>
      <span style="width: 200px">9</span>
    </div>
  </li>
  <li><b>center:</b> 与交叉轴的中点对齐
    <div class="flex-example align-content" style="align-content: center;">
      <span style="width: 80px">1</span>
      <span style="width: 120px">2</span>
      <span style="width: 200px">3</span>
      <span style="width: 80px">4</span>
      <span style="width: 120px">5</span>
      <span style="width: 200px">6</span>
      <span style="width: 80px">7</span>
      <span style="width: 120px">8</span>
      <span style="width: 200px">9</span>
    </div>
  </li>
  <li><b>space-between:</b> 沿交叉轴两端对齐，轴线间隔相同
    <div class="flex-example align-content" style="align-content: space-between;">
      <span style="width: 80px">1</span>
      <span style="width: 120px">2</span>
      <span style="width: 200px">3</span>
      <span style="width: 80px">4</span>
      <span style="width: 120px">5</span>
      <span style="width: 200px">6</span>
      <span style="width: 80px">7</span>
      <span style="width: 120px">8</span>
      <span style="width: 200px">9</span>
    </div>
  </li>
  <li><b>space-around:</b> 沿交叉轴两端对齐，轴线间隔对齐，两端轴线距弹性容器的距离为轴线间距的一半，即每个轴线所分配的空隙相同
    <div class="flex-example align-content" style="align-content: space-around;">
      <span style="width: 80px">1</span>
      <span style="width: 120px">2</span>
      <span style="width: 200px">3</span>
      <span style="width: 80px">4</span>
      <span style="width: 120px">5</span>
      <span style="width: 200px">6</span>
      <span style="width: 80px">7</span>
      <span style="width: 120px">8</span>
      <span style="width: 200px">9</span>
    </div>
  </li>
  <li><b>space-evenly:</b> 沿交叉轴两端对齐，所有空隙等距，即轴线之间和两端轴线到弹性容器的距离都相同
    <div class="flex-example align-content" style="align-content: space-evenly;">
      <span style="width: 80px">1</span>
      <span style="width: 120px">2</span>
      <span style="width: 200px">3</span>
      <span style="width: 80px">4</span>
      <span style="width: 120px">5</span>
      <span style="width: 200px">6</span>
      <span style="width: 80px">7</span>
      <span style="width: 120px">8</span>
      <span style="width: 200px">9</span>
    </div>
  </li>
  <li><b>stretch:</b> 轴线占满整个交叉轴
    <div class="flex-example align-content stretch" style="align-content: stretch;">
      <span style="width: 80px">1</span>
      <span style="width: 120px">2</span>
      <span style="width: 200px">3</span>
      <span style="width: 80px">4</span>
      <span style="width: 120px">5</span>
      <span style="width: 200px">6</span>
      <span style="width: 80px">7</span>
      <span style="width: 120px">8</span>
      <span style="width: 200px">9</span>
    </div>
  </li>
</ul>


## 子元素属性（弹性项）
<div align="center">
  <svg class="_img">
    <use xlink:href="#02-items"></use>
  </svg>
</div>

### order
> 默认情况下，弹性项目按源顺序排列  
> 但是，order属性控制它们在flex容器中出现的顺序  
```css
.item {
  order: 5; /* default is 0 */
}
```

<div class="flex-example">
  <span style="order: 5">5</span>
  <span style="order: 1">1</span>
  <span style="order: 4">4</span>
  <span style="order: 2">2</span>
  <span style="order: 3">3</span>
</div>

### flex-grow
> 定义了弹性项目增长的能力  
> 它接受作为比例的无单位值  
> 它决定了项目应在弹性容器内部占用的可用空间的比例  
> 负数无效  
> 默认为0，即如果存在剩余空间，也不放大  
```css
.item {
  flex-grow: 4; /* default 0 */
}
```
<div class="flex-example">
  <span style="flex-grow: 1">1</span>
  <span style="flex-grow: 1">1</span>
  <span style="flex-grow: 1">1</span>
</div>
<div class="flex-example">
  <span style="flex-grow: 0; width: initial;">0</span>
  <span style="flex-grow: 2">2</span>
  <span style="flex-grow: 3">3</span>
</div>

### flex-shrink
> 这定义了弹性项目的收缩的能力  
> 负数无效  
> 默认为1，即如果空间不足，该项目将缩小  
> 0的时候不进行缩小  
```css
.item {
  flex-shrink: 3; /* default 1 */
}
```
<div class="flex-example" style="width: 500px;">
    <span style="flex-shrink: 1;">1</span>
    <span style="flex-shrink: 0;">0</span>
    <span style="flex-shrink: 1;">1</span>
    <span style="flex-shrink: 3;">3</span>
    <span style="flex-shrink: 1;">1</span>
    <span style="flex-shrink: 1;">1</span>
    <span style="flex-shrink: 1;">1</span>
</div>

### flex-basis
> `flex-basis` 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）  
> 浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 `auto`，即项目的本来大小  
> 如果设置为 `0`，则不考虑内容周围的多余空间  
> 如果设置为 `auto`，则多余的空间将根据其 `flex-grow` 值进行分配  
> 可以设置为长度（例如 `20％`，`5rem` 等）或关键字（ `auto`， 还有其他的，暂不翻译）  
```css
.item {
  flex-basis: <length> | auto; /* default auto */
}
```
`flex-grow: 1; flex-basis: 0;`
<div class="flex-example">
  <span style="flex-grow: 1; flex-basis: 0;">short</span>
  <span style="flex-grow: 1; flex-basis: 0;">looooooong</span>
  <span style="flex-grow: 2; flex-basis: 0;">short</span>
</div>

`flex-grow: 1; flex-basis: auto;`

<div class="flex-example">
  <span style="flex-grow: 1; flex-basis: 0;">short</span>
  <span style="flex-grow: 1; flex-basis: auto;">looooooong</span>
  <span style="flex-grow: 2; flex-basis: 0;">short</span>
</div>
<div align="center">
  <svg class="_img">
    <use xlink:href="#05-flex-basis"></use>
  </svg>
</div>

### flex
> `flex` 属性是 `flex-grow`、`flex-shrink` 和 `flex-basis` 的简写  
> 默认值为 `0 1 auto`  后两个属性可选  
> 该属性有两个快捷值：`auto = 1 1 auto` 和 `none = 0 0 auto`  
> 建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值  
```css
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

### align-self
> 允许为单个弹性项目覆盖默认对齐方式（或由 `align-items` 指定的对齐方式）  
> 可用值同 `align-items`  
```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```
<div class="flex-example" style="height: 200px">
  <span></span>
  <span style="align-self: flex-end;">flex-end</span>
  <span style="align-self: center;">center</span>
</div>

--- 

* 原文：[A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
* 参考：[Flex 布局教程：语法篇](https://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)