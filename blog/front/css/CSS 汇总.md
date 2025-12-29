---
outline: deep
---

# CSS 汇总

## CSS 计算 `calc`
`calc` 支持 `+ - * /`
```html{7}
<style>
  .calc-demo-box {
    height: 100px;
    background-color: pink;
  }
  .calc-demo {
    width: calc(100% - 40px);
    background-color: skyblue;
  }
</style>
<div class="calc-demo-box">
  <div class="calc-demo"></div>
</div>
```
<style>
  .calc-demo-box {
    height: 100px;
    background-color: pink;
  }
  .calc-demo {
    width: calc(100% - 40px);
    background-color: skyblue;
  }
</style>
<div class="calc-demo-box">
  <div class="calc-demo">calc</div>
</div>

## CSS 变量
CSS 以 `--` 作为命名前缀 , 用 `var()` 去引用  
一般通过 `:root` 伪类中声明变量  
注意: 声明的变量需要在同一个作用域内才能生效  
```html{3,6,11,12}
<style>
  :root {
    --pink: #ffd6e7;
  }
  .css-var {
    --red: #f5222d;
  }
</style>
<div>
  <div class="css-var">
    <div style="color: var(--pink);">var(--pink);</div>
    <div style="color: var(--red);">var(--red);</div>
  </div>
  <div style="color: var(--red);">var(--red);</div>
</div>
```
<style>
  :root {
    --pink: #ffd6e7;
  }
  .css-var {
    --red: #f5222d;
  }
</style>
<div>
  <div class="css-var">
    <div style="color: var(--pink);">var(--pink);</div>
    <div style="color: var(--red);">var(--red);</div>
  </div>
  <div style="color: var(--red);">var(--red);</div>
</div>

## attr 属性
```html{3,9}
<style>
  .attr-demo::before {
    content: attr(data-text);
    color: red;
  }
</style>
<div
  class="attr-demo"
  data-text="我是来自属性的文本"
>
  原始文本
</div>
```
<style>
  .attr-demo::before {
    content: attr(data-text);
    color: red;
  }
</style>
<div class="attr-demo" data-text="我是来自属性的文本">
  原始文本
</div>

## 通过 `padding-bottom` 设置宽高等比例缩放
让 `padding-bottom` 把盒子撑起来  
`padding-bottom` 的百分比 即为盒子宽度的百分比  
子盒子绝对定位 并 设置子盒子宽和高为 100%  
```html{4,8,9,10}
<style>
  .padding-bottom-demo {
    height: 0;
    padding-bottom: 20%;
    position: relative;
  }
  .padding-bottom-demo > div {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: pink;
  }
</style>
<div class="padding-bottom-demo">
  <div></div>
</div>
```
<style>
  .padding-bottom-demo {
    height: 0;
    padding-bottom: 20%;
    position: relative;
  }
  .padding-bottom-demo > div {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    background-color: pink;
  }
</style>
<div class="padding-bottom-demo">
  <div></div>
</div>

## 省略显示文本溢出...
### 单行
```html{4,5,6}
<style>
  .omit {
    width: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
<div class="omit">这里有很多文字这里有很多文字这里有很多文字这里有很多文字</div>
```
<style>
  .omit {
    width: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
<div class="omit">这里有很多文字这里有很多文字这里有很多文字这里有很多文字</div>

### 多行(方案1)
```html
<style>
  .omit-1 {
    width: 200px;
    display: -webkit-box;
    -webkit-line-clamp: 3;  /* 控制隐藏的行数 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
<div class="omit-1">这里有很多文字这里有很多文字这里有很多文字这里有很多文字这里有很多文字这里有很多文字</div>
```
<style>
  .omit-1 {
    width: 200px;
    display: -webkit-box;
    -webkit-line-clamp: 3;  /* 控制隐藏的行数 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
<div class="omit-1">这里有很多文字这里有很多文字这里有很多文字这里有很多文字这里有很多文字这里有很多文字</div>

### 多行(方案2)
```html
<style>
  .omit-2 {
    width: 200px;
    position: relative;
    line-height: 20px;
    max-height: 40px;
    overflow: hidden;
  }
  .omit-2:after {
    content: "\02026";  /* ... */
    position: absolute;
    bottom: 0;
    right: 0;
    padding-left: 40px;
    background: linear-gradient(to right, transparent, #fff 55%);
  }
</style>
<div class="omit-2">这里有很多文字这里有很多文字这里有很多文字这里有很多文字这里有很多文字这里有很多文字</div>
```
<style>
  .omit-2 {
    width: 200px;
    position: relative;
    line-height: 20px;
    max-height: 40px;
    overflow: hidden;
  }
  .omit-2:after {
    content: "\02026";  /* ... */
    position: absolute;
    bottom: 0;
    right: 0;
    padding-left: 40px;
    background: linear-gradient(to right, transparent, #fff 55%);
  }
</style>
<div class="omit-2">这里有很多文字这里有很多文字这里有很多文字这里有很多文字这里有很多文字这里有很多文字</div>

## 垂直居中
### 文本居中
```html
<style>
  .v-text {
    height: 120px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .v-text:before {
    content: '';
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }
</style>
<div class="v-text">这是垂直居中的文字</div>
```
<style>
  .v-text {
    height: 120px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .v-text:before {
    content: '';
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }
</style>
<div class="v-text">这是垂直居中的文字</div>

### 图片居中
```html
<style>
  .v-img {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .v-img > div {
    height: 120px;
    display: table-cell;
    vertical-align: middle;
  }
  .v-img > div > img {
    background-color: skyblue;
  }
</style>
<div class="v-img">
  <div>
    <img width="48" height="48" src="/favicon.ico">
  </div>
</div>
```
<style>
  .v-img {
    background-color: rgba(0, 0, 0, 0.2);
  }
  .v-img > div {
    height: 120px;
    display: table-cell;
    vertical-align: middle;
  }
  .v-img > div > img {
    background-color: skyblue;
  }
</style>
<div class="v-img">
  <div>
    <img width="48" height="48" src="/favicon.ico">
  </div>
</div>

### flex
```html{3,4,5}
<style>
  .flex-demo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .flex-demo > div {
    width: 40px;
    height: 20px;
    background-color: pink;
  }
</style>
<div class="flex-demo">
  <div></div>
</div>
```
<style>
  .flex-demo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .flex-demo > div {
    width: 40px;
    height: 20px;
    background-color: pink;
  }
</style>
<div class="flex-demo">
  <div></div>
</div>

### 定位居中
```html{10,11,12,13,14,16}
<style>
  .position-demo {
    position: relative;
    height: 120px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .position-demo > div {
    width: 40px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -10px;
    margin-left: -20px;
    /* 或 通过 transform 来居中 */
    /* transform: translate(-50%, -50%); */
    background-color: pink;
  }
</style>
<div class="position-demo">
  <div></div>
</div>
```
<style>
  .position-demo {
    position: relative;
    height: 120px;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .position-demo > div {
    width: 40px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -10px;
    margin-left: -20px;
    /* 或 通过 transform 来居中 */
    /* transform: translate(-50%, -50%); */
    background-color: pink;
  }
</style>
<div class="position-demo">
  <div></div>
</div>

## 自定义滚动条
```html{8,12,13,16,21,22}
<style>
  .scroll-demo {
    height: 200px;
    border: 1px solid #999;
    overflow: auto;
  }
  /* 改变滚动条的样式 */
  .scroll-demo::-webkit-scrollbar {
    width: 8px;
    height: 10px;
  }
  .scroll-demo::-webkit-scrollbar-button {}
  .scroll-demo::-webkit-scrollbar-corner {
    display: block;
  }
  .scroll-demo::-webkit-scrollbar-thumb {
    -webkit-border-radius: 8px;
    border-radius: 8px;
    background-color: skyblue;
  }
  .scroll-demo::-webkit-scrollbar-track,
  .scroll-demo::-webkit-scrollbar-thumb {
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
  }
</style>
<div class="scroll-demo">
  这这这<br>这这这<br>这这这<br>
  里里里<br>里里里<br>里里里<br>
  是是是<br>是是是<br>是是是<br>
  滚滚滚<br>滚滚滚<br>滚滚滚<br>
  动动动<br>动动动<br>动动动<br>
  的的的<br>的的的<br>的的的<br>
  文文文<br>文文文<br>文文文<br>
  字字字<br>字字字<br>字字字<br>
</div>
```
<style>
  .scroll-demo {
    height: 200px;
    border: 1px solid #999;
    overflow: auto;
  }
  /* 改变滚动条的样式 */
  .scroll-demo::-webkit-scrollbar {
    width: 8px;
    height: 10px;
  }
  .scroll-demo::-webkit-scrollbar-button {}
  .scroll-demo::-webkit-scrollbar-corner {
    display: block;
  }
  .scroll-demo::-webkit-scrollbar-thumb {
    -webkit-border-radius: 8px;
    border-radius: 8px;
    background-color: skyblue;
  }
  .scroll-demo::-webkit-scrollbar-track,
  .scroll-demo::-webkit-scrollbar-thumb {
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
  }
</style>
<div class="scroll-demo">
  这这这<br>这这这<br>这这这<br>
  里里里<br>里里里<br>里里里<br>
  是是是<br>是是是<br>是是是<br>
  滚滚滚<br>滚滚滚<br>滚滚滚<br>
  动动动<br>动动动<br>动动动<br>
  的的的<br>的的的<br>的的的<br>
  文文文<br>文文文<br>文文文<br>
  字字字<br>字字字<br>字字字<br>
</div>

## 自适应的输入框
通过CSS来实现输入框的自适应  

大致思路：  
给输入框一个绝对定位，让其宽度继承父盒子的宽度，父盒子的宽度由占位子盒子的宽度撑起  
占位子盒子和输入框的文本格式和盒模型保持一致  
输入框的文本同步到占位子盒子内  
:::details code
```html
<style>
  .auto-input {
    height: 20px;
    min-width: 50px;
    position: relative;
    display: inline-block;
  }
  .auto-input > * {
    font-size: 14px;
  }
  .auto-input > .placeholder {
    visibility: hidden;
    padding: 3px;
    font-family: system-ui;
    white-space: break-spaces;
  }
  .auto-input > input {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
    border: 1px solid;
  }
</style>
<div class="auto-input">
  <div class="placeholder"></div>
  <input type="text" placeholder="输入" oninput="document.querySelector('.auto-input .placeholder').innerText = event.target.value">
</div>
```
:::
<style>
  .auto-input {
    height: 20px;
    min-width: 50px;
    position: relative;
    display: inline-block;
  }
  .auto-input > * {
    font-size: 14px;
  }
  .auto-input > .placeholder {
    visibility: hidden;
    padding: 3px;
    font-family: system-ui;
    white-space: break-spaces;
  }
  .auto-input > input {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
    border: 1px solid;
  }
</style>
<div class="auto-input">
  <div class="placeholder"></div>
  <input type="text" placeholder="输入" oninput="document.querySelector('.auto-input .placeholder').innerText = event.target.value">
</div>
