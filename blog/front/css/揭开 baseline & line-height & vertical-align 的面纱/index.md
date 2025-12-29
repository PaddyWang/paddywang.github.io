---
outline: deep
---

# 揭开 baseline & line-height & vertical-align 的面纱
## 背景 & 概念
先看一张来自维基百科的图，上面都是字体排印学的术语

<div>
  <svg width="361" height="97">
    <use xlink:href="#wikipedia-baseline"></use>
  </svg>
  <p><i>来自维基百科</i></p>
</div>

### baseline(基线)
在字体排印学(CSS中的字体同样遵循字体排印学)中，基线指的是多数字母排列的基准线。  
东亚字体(包括中文)没有基线，每个字符坐落在一个方形盒子中，既无升部也无降部。当它与具有低基线的字体混合使用时，东亚字符应当被调整，使其字符底部在低基线字体的基线和降部高度之间。  
基线是存在于字体中的一条基准线，和字体有关。  

### x-height
在西文字体排印学中，x字高(英语：x-height或corpus size)是指字母的基本高度，精确地说，就是基线(baseline)和主线之间的距离，即小写字母x的高度。  
在西文的具体字体以及排版术语中，x字高通常被称为一个ex，这和把大写字母M的宽度称为一个em的习惯类似。 (终于知道CSS中的em单位的含义了)  

### em
em 是字体排印学的计量单位，相当于当前指定的点数。  
em最初表示的是字体中大写M的宽度及所用的尺寸。  
在CSS中，单位em是字体点数或英寸数在名义上的高度。  

### em框
em框在字体中定义(也称为字符框(character box))。  
实际字形可能比em框更高或更矮(所有例子中的“p”字母)， font-size的值确定了各个em框的高度。  
下面用边框模拟了em框，虚线代表了各个字符的em框  
下面的文字中的“p”解释了“实际字形可能比em框更高或更矮”  
<style>
  .example {
    font-family: Microsoft Sans Serif;
    box-sizing: initial !important;
  }
  .example * {
    box-sizing: initial !important;
  }
  .example img {
    display: inline-block;
    background-color: #dadada;
  }
  .em-border {
    border-top: 1px solid red;
    border-bottom: 1px solid red;
  }
  .em-border span {
    border: 1px dashed;
    font-size: 60px;
    height: 60px;
    line-height: 1;
    display: inline-block;
  }
</style>
<div style="margin: 6px 30px" class="example em-border">
    <i>font-size: 60px</i>
    <span>中</span>
    <span>文</span>
    <span>S</span>
    <span>p</span>
    <span>h</span>
    <span>i</span>
    <span>n</span>
    <span>x</span>
</div>
<p></p>
<div class="example">
  <div style="background: #ff000085; line-height: 1; font-size: 60px;">Sphinx</div>
</div>

### 内容区
在非替换元素中，内容区域是元素中各字符的 em 框串在一起构成的框，即顶线和底线所包裹的区域。  
在替换元素中，内容区域是元素的固有高度再加上可能有的外边距、边框或内边距。  
下面灰色的背景模拟了内容区：  
<style>
  .em-box {
    display: inline-block;
    background-color: #dadada;
  }
</style>
<div style="margin: 6px 30px" class="example em-border">
  <div style="display: inline-block;">
    <i>font-size: 60px</i>
    <br>
    <i>line-height: 60px</i>
  </div>
  <div class="em-box">
    <span>中</span>
    <span>文</span>
    <span>S</span>
    <span>p</span>
    <span>h</span>
    <span>i</span>
    <span>n</span>
    <span>x</span>
  </div>
  <img style="padding: 2px; border: 2px solid; margin: 1px;" width="40" src="/code.png">
</div>

### 行间距
`行间距 = line-height - font-size` 这个差值实际上要分为两半，分别应用到内容区域的顶部和底部。  
行间距只应用于非替换元素  
下面的灰色区域模拟了内容区域，黄色区域分别模拟半个行间距：  
<style>
  .em-border.line-height {
  }
  .em-border.line-height span {
      border: none;
      line-height: inherit;
      position: relative;
      z-index: 1;
  }
  .em-border.line-height .em-box {
      height: 80px;
      line-height: 80px;
      position: relative;
  }
  .em-border.line-height .em-box::before,
  .em-border.line-height .em-box::after {
      content: "";
      width: 100%;
      height: 10px;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #ffeb3b;
      z-index: 0;
  }
  .em-border.line-height .em-box::after { top: auto; bottom: 0; }
</style>
<div style="margin: 6px 30px" class="example em-border line-height">
  <div style="display: inline-block;">
    <i>font-size: 60px</i>
    <br>
    <i>line-height: 80px</i>
  </div>
  <div class="em-box">
    <span>中</span>
    <span>文</span>
    <span>S</span>
    <span>p</span>
    <span>h</span>
    <span>i</span>
    <span>n</span>
    <span>x</span>
  </div>
</div>

### 行内框
`行内框 = line-height`  
这个框通过向内容区域增加行间距来描述  
对于替换元素行内框刚好等于内容区的高度  
下面两条红线之间描述了行内框：  
<div style="margin: 6px 30px" class="example em-border line-height">
  <div style="display: inline-block;">
    <i>font-size: 60px</i>
    <br>
    <i>line-height: 80px</i>
  </div>
  <div class="em-box">
    <span>中</span>
    <span>文</span>
    <span>S</span>
    <span>p</span>
    <span>h</span>
    <span>i</span>
    <span>n</span>
    <span>x</span>
  </div>
</div>

### 行框
包含该行中出现的行内框的最高点和最低点的最小框  
即：行框的上边界要位于最高行内框的上边界，而行框的底边位于最低行内框的下边界  
当将“内容区”示例中的图片放大时，两条红线的距离变大了  
这两条红线模拟了行框的区域，如下例所示：  
<div style="margin: 6px 30px" class="example em-border">
  <div style="display: inline-block;">
    <i>font-size: 60px</i>
  </div>
  <div class="em-box">
    <span>中</span>
    <span>文</span>
    <span>S</span>
    <span>p</span>
    <span>h</span>
    <span>i</span>
    <span>n</span>
    <span>x</span>
  </div>
  <img style="padding: 2px; border: 2px solid;" width="50" src="/code.png">
</div>

为什么文本上面会留有空隙，图片下面会留有空隙，正常来说完全可以将两个空隙压缩掉？  
原因在于垂直的默认对齐方式是基于基线对齐的(`vertical-align: baseline;`)，而替换元素的基线位于元素的下边缘  


## 示例
:::info 行内元素的边框边界由 `font-size` 而不是 `line-height` 控制。 换句话说，如果一个 `<span>` 的 `font-size: 12px; line-height: 36px;` 其内容区就是 `12px` 高，边框将包围该内容区域
```html
<style>
    .inner-line {
      background-color: pink;
    }
    .inner-line span {
      border: 1px dashed;
      line-height: 36px;
      font-size: 12px;
    }
</style>
<div class="inner-line">
  <span>This is text, Good moring, fdf dsf sad f sdf sd fs dfs df sdf ds f sd fsdfsdfs dfsd fs adfasd ds sfs sdf dsfas df asdf sad fas df sad f asdf sadf asdf asd f asdfas df sdf sd fasdfasdf sdf sad fs adf asdfasdfasd fasd f</span>
</div>
```
<style>
    .inner-line {
      background-color: pink;
    }
    .inner-line span {
      border: 1px dashed;
      line-height: 36px;
      font-size: 12px;
    }
</style>
<div class="inner-line">
  <span>This is text, Good moring, fdf dsf sad f sdf sd fs dfs df sdf ds f sd fsdfsdfs dfsd fs adfasd ds sfs sdf dsfas df asdf sad fas df sad f asdf sadf asdf asd f asdfas df sdf sd fasdfasdf sdf sad fs adf asdfasdfasd fasd f</span>
</div>
:::

:::info 内边距和边框不改变行高 <br/> 外边距不会应用到行内非替换元素的顶端和低端，不过会作用于左右两端
```html
<style>
  .inner-line-02 {
    background-color: pink;
  }
  .inner-line-02 span {
    border: 1px dashed;
    line-height: 36px;
    font-size: 12px;
  }
</style>
<div class="inner-line-02">
  <span style="padding: 20px; margin: 16px;">This is text, Good moring,</span>
  <span>fdf dsf sad f sdf sd fs dfs df sdf ds f sd fsdfsdfs dfsd fs adfasd ds sfs sdf dsfas df asdf sad fas df sad f asdf sadf asdf asd f asdfas df sdf sd fasdfasdf sdf sad fs adf asdfasdfasd fasd f</span>
</div>
```
<style>
  .inner-line-02 {
    background-color: pink;
  }
  .inner-line-02 span {
    border: 1px dashed;
    line-height: 36px;
    font-size: 12px;
  }
</style>
<div class="inner-line-02">
  <span style="padding: 20px; margin: 16px;">This is text, Good moring,</span>
  <span>fdf dsf sad f sdf sd fs dfs df sdf ds f sd fsdfsdfs dfsd fs adfasd ds sfs sdf dsfas df asdf sad fas df sad f asdf sadf asdf asd f asdfas df sdf sd fasdfasdf sdf sad fs adf asdfasdfasd fasd f</span>
</div>
:::

**line-height中 1em 、100% 和 1 的不同**
:::info 当 `line-height` 的值有单位时，继承的是父元素计算之后的值，即在父元素上计算
```html{2}
<div style="font-size: 10px;">
  <div style="line-height: 1em;">
    <span style="font-size: 20px">This is text, Good moring, fdf dsf sad f sdf sd fs dfs df sdf ds f sd fsdfsdfs dfsd fs adfasd ds sfs sdf dsfas df asdf sad fas df sad f asdf sadf asdf asd f asdfas df sdf sd fasdfasdf sdf sad fs adf asdfasdfasd fasd f</span>
  </div>
</div>
```
<div style="font-size: 10px;">
  <div style="line-height: 1em;">
    <span style="font-size: 20px">This is text, Good moring, fdf dsf sad f sdf sd fs dfs df sdf ds f sd fsdfsdfs dfsd fs adfasd ds sfs sdf dsfas df asdf sad fas df sad f asdf sadf asdf asd f asdfas df sdf sd fasdfasdf sdf sad fs adf asdfasdfasd fasd f</span>
  </div>
</div>
:::

:::info 同上面的 `1em`，继承的是父元素计算之后的值，即在父元素上计算
```html{2}
<div style="font-size: 10px;">
  <div style="line-height: 100%;">
    <span style="font-size: 20px">This is text, Good moring, fdf dsf sad f sdf sd fs dfs df sdf ds f sd fsdfsdfs dfsd fs adfasd ds sfs sdf dsfas df asdf sad fas df sad f asdf sadf asdf asd f asdfas df sdf sd fasdfasdf sdf sad fs adf asdfasdfasd fasd f</span>
  </div>
</div>
```
<div style="font-size: 10px;">
  <div style="line-height: 100%;">
    <span style="font-size: 20px">This is text, Good moring, fdf dsf sad f sdf sd fs dfs df sdf ds f sd fsdfsdfs dfsd fs adfasd ds sfs sdf dsfas df asdf sad fas df sad f asdf sadf asdf asd f asdfas df sdf sd fasdfasdf sdf sad fs adf asdfasdfasd fasd f</span>
  </div>
</div>
:::

:::info 当 `line-height` 的值无单位时，是继承值(缩放因子)而不是计算值，即在当前子元素上计算
```html{2}
<div style="font-size: 10px;">
  <div style="line-height: 1;">
    <span style="font-size: 20px">This is text, Good moring, fdf dsf sad f sdf sd fs dfs df sdf ds f sd fsdfsdfs dfsd fs adfasd ds sfs sdf dsfas df asdf sad fas df sad f asdf sadf asdf asd f asdfas df sdf sd fasdfasdf sdf sad fs adf asdfasdfasd fasd f</span>
  </div>
</div>
```
<div style="font-size: 10px;">
  <div style="line-height: 1;">
    <span style="font-size: 20px">This is text, Good moring, fdf dsf sad f sdf sd fs dfs df sdf ds f sd fsdfsdfs dfsd fs adfasd ds sfs sdf dsfas df asdf sad fas df sad f asdf sadf asdf asd f asdfas df sdf sd fasdfasdf sdf sad fs adf asdfasdfasd fasd f</span>
  </div>
</div>
:::

## vertical-align
`vertical-align` 不影响块级元素中内容的对齐，可以影响表格单元的垂直对齐方式  

:::info baseline
当前元素的基线与父元素的基线对齐  
如果该元素没有基线(例如 `img`、`input` )，则以该元素的底端与父元素的基线对齐  
<div class="baseline-container example" style="font-size: 60px; line-height: 1em;">
  <span>Sphinx</span>
  <span class="line baseline" style="top: 50px"></span>
  <span class="text horizon baseline" style="top: 50px; left: 400px">baseline</span>
  <span style="font-size: 20px">font-size: 20px</span>
  <img style="background: #eee" width="30" src="/code.png">
</div>

示例中： `font-size: 60px; line-height: 1em;` 两条虚线代表了行框，行框的高度大于了 `60px` ?  
原因在于 `font-size: 20px` 的行内框元素也继承了 `line-height` 的值，行框包含了最高元素和最低元素  
:::

:::info top/bottom
将元素行内框的顶端/底端和包含该元素的行框的顶端/底端对齐  
<div class="baseline-container example" style="font-size: 60px; line-height: 1em;">
  <span>Sphinx</span>
  <span style="font-size: 20px; vertical-align: top; line-height: 1;">line-height: 1 <span style="font-size: 12px">xxx</span></span>
  <img style="background: #eee; vertical-align: top;" width="30" src="/code.png">
</div>
:::

:::info text-top/text-bottom
将元素行内框的顶端/底端和父元素内容区的顶端/底端对齐  
<div class="baseline-container example" style="font-size: 60px; line-height: 1em;">
  <span>Sphinx</span>
  <span style="font-size: 20px; line-height: 1; border-top: 1px solid;">
    line-height: 1
    <span style="font-size: 12px; vertical-align: top;">top</span>
    <span style="font-size: 12px; vertical-align: text-top;">text-top</span>
  </span>
</div>
:::

:::info middle
将元素行内框的垂直中点与父元素基线上方0.5ex处对齐  
这也解释了为什么middle之后的元素并不位于行框的中间  
<div class="baseline-container example" style="font-size: 60px; line-height: 1em;">
  <span>Sphinx</span>
  <span class="line middle" style="top: 35px"></span>
  <span class="text horizon middle" style="top: 35px; left: 350px">middle</span>
  <span style="font-size: 20px; line-height: 1; vertical-align: middle;">xxx</span>
  <img style="background: #eee; vertical-align: middle;" width="30" src="/code.png">
</div>
:::

:::info 百分数
将元素上/下移一定的距离，这个距离由相对于元素的 `line-height` 值计算的  
<div class="baseline-container" style="font-size: 60px; line-height: 1em;">
  <span>Sphinx</span>
  <span style="font-size: 20px; vertical-align: 50%">xxx</span>
  <span class="line baseline" style="top: 37px"></span>
  <span class="line baseline" style="top: 67px"></span>
  <span class="text vertical line-horizon top" text="60px * 50% = 30px" style="top: 37px; left: 250px; width: 30px;"></span>
</div>
:::


## 一图总结

<htmlview :src="import('./base.html?raw')" />

## 参考
* 《CSS权威指南》
* [Baseline (typography)](https://en.wikipedia.org/wiki/Baseline_(typography))
* [x-height](https://en.wikipedia.org/wiki/X-height)
* [Em (typography)](https://en.wikipedia.org/wiki/Em_(typography))
* [升部（Ascenders）](https://www.fontke.com/article/710/)
* [降部（Descenders）](https://www.fontke.com/article/712/)
* [深入理解css基线与行高](https://blog.csdn.net/it_queen/article/details/54729949)
* [深度剖析Css Baseline](https://zhuanlan.zhihu.com/p/30169829)
* [深入理解CSS中的vertical-align属性和基线问题](https://www.jb51.net/css/718832.html)


