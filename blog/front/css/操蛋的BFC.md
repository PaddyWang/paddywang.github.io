---
outline: deep
---

# 操蛋的BFC


## 建立条件
BFC([Block formatting contexts](https://www.w3.org/TR/CSS2/visuren.html#block-formatting))即块级格式化上下文

目前在CSS规范中没找到官方给出的定义，只给出了相关的建立条件和渲染规则:  
> Floats, absolutely positioned elements, block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes, and block boxes with 'overflow' other than 'visible' (except when that value has been propagated to the viewport) establish new block formatting contexts for their contents.

即建立 BFC 的条件可以归纳下面五点:
1. 浮动的元素(不为 `none`)
2. 绝对定位元素(开启绝对模式的元素: `absolute` 和 `fixed`)
3. `display: inline-blocks | table-cells | table-captions;` 的块盒
4. `overflow` 不为 `visible` 的块盒
5. 根元素 *(except when that value has been propagated to the viewport)*


## 渲染规则
> In a block formatting context, boxes are laid out one after the other, vertically, beginning at the top of a containing block. The vertical distance between two sibling boxes is determined by the 'margin' properties. Vertical margins between adjacent block-level boxes in a block formatting context collapse.

即:
* 在 BFC 中子元素的框盒会从包含块的顶部开始，垂直的一个接一个排列  
* 两个兄弟元素的框盒的垂直距离由 ‘margin’ 值决定  
* 两个相邻块级框垂直边距折叠(盒子塌陷)  


> In a block formatting context, each box's left outer edge touches the left edge of the containing block (for right-to-left formatting, right edges touch). This is true even in the presence of floats (although a box's line boxes may shrink due to the floats), unless the box establishes a new block formatting context (in which case the box itself may become narrower due to the floats).

即:
* 在BFC框内的子元素的左外边缘都与包含块的左边缘相接触(从右向左的则与右边缘相接触)
* 浮动的元素同样遵循此规则(浮动的元素可能会使包含块的盒子变得更窄)
* 除非子元素创建了新的BFC

总结: **BFC 会创建一个隔离的渲染区域，并且有自己一套渲染规则**


## BFC 的用处

### 避免外边距折叠(塌陷)
处于同一个 BFC 中的框盒外边距折叠，而处于不同的 BFC 中就可以避免折叠的现象  
```html{17}
<style>
  .bfc-box-1 {
    overflow: hidden;
    border: 1px solid;
  }
  .bfc-box-1 .item {
    height: 20px;
    border: 1px solid red;
    margin: 20px;
  }
</style>
<div>
  <div class="bfc-box-1">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div> <!-- [!code --] -->
    <div style="overflow: hidden;"> <!-- [!code ++] -->
      <div class="item">3</div> <!-- [!code ++] -->
    </div> <!-- [!code ++] -->
  </div>
</div>
```
<style>
  .bfc-box-1 {
    overflow: hidden;
    border: 1px solid;
  }
  .bfc-box-1 .item {
    height: 20px;
    border: 1px solid red;
    margin: 20px;
  }
</style>
<div>
  <div class="bfc-box-1">
    <div class="item">1</div>
    <div class="item">2</div>
    <!-- 避免盒子折叠(塌陷) -->
    <div style="overflow: hidden;">
      <div class="item">3</div>
    </div>
  </div>
</div>

### 避免文字包围
在浮动中文字和图片会出现包围现象  
```html{3}
<div style="border: 1px solid;">
  <div style="float: left; height: 50px; background: pink;">float: left</div>
  <p>  <!-- [!code --] -->
  <p style="overflow: hidden;">  <!-- [!code ++] -->
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
  </p>
</div>
```
<div style="border: 1px solid;">
  <div style="float: left; height: 50px; background: pink;">float: left</div>
  <p>
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
  </p>
</div>
<div style="border: 1px solid; margin-top: 12px;">
  <div style="float: left; height: 50px; background: pink;">float: left</div>
  <p style="overflow: hidden;">
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
    这是环绕的文字这是环绕的文字这是环绕的文字这是环绕的文字
  </p>
</div>

### 多列布局
可以利用 BFC 创建新的渲染区域来进行多列分割  
固定+自适应布局  
其中自适应的盒子需要放在包含块最底部  
```html
<style>
  .bfc-box-2 {
    width: 50px;
    height: 100px;
    background: pink;
  }
  .bfc-box-overflow {
    height: 100px;
    overflow: hidden;
    background: skyblue;
  }
  .left { float: left; }
  .right { float: right; }
  .m-l-12 { margin-left: 12px; }
  .m-r-12 { margin-right: 12px; }
  .m-t-12 { margin-top: 12px; }
  .border { border: 1px solid; }
</style>
<div>
  <div class="border">
    <div class="bfc-box-2 left">left 1 </div>
    <div class="bfc-box-overflow m-l-12">自适应盒子 2</div>
  </div>
  <div class="border m-t-12">
    <div class="bfc-box-2 left m-r-12">left 1 </div>
    <div class="bfc-box-overflow">自适应盒子 2</div>
  </div>
  <div class="border m-t-12">
    <div class="bfc-box-2 left m-r-12">left 1 </div>
    <div class="bfc-box-2 right m-l-12">right 3 </div>
    <div class="bfc-box-overflow">自适应盒子 2</div>
  </div>
  <div class="border m-t-12">
    <div class="bfc-box-2 left m-r-12">left 1 </div>
    <div class="bfc-box-overflow">自适应盒子 2 <br>
      当自适应的盒子放在没有出现在包含块最后时，渲染就会按顺序，把自适应的盒子渲染完毕再去渲染 right 3 盒子，所以就会把 right 3 挤下去
    </div>
    <div class="bfc-box-2 right m-l-12">right 3 </div>
  </div>
</div>
```
<style>
  .bfc-box-2 {
    width: 50px;
    height: 100px;
    background: pink;
  }
  .bfc-box-overflow {
    height: 100px;
    overflow: hidden;
    background: skyblue;
  }
  .left { float: left; }
  .right { float: right; }
  .m-l-12 { margin-left: 12px; }
  .m-r-12 { margin-right: 12px; }
  .m-t-12 { margin-top: 12px; }
  .border { border: 1px solid; }
</style>
<div>
  <div class="border">
    <div class="bfc-box-2 left">left 1 </div>
    <div class="bfc-box-overflow m-l-12">自适应盒子 2</div>
  </div>
  <div class="border m-t-12">
    <div class="bfc-box-2 left m-r-12">left 1 </div>
    <div class="bfc-box-overflow">自适应盒子 2</div>
  </div>
  <div class="border m-t-12">
    <div class="bfc-box-2 left m-r-12">left 1 </div>
    <div class="bfc-box-2 right m-l-12">right 3 </div>
    <div class="bfc-box-overflow">自适应盒子 2</div>
  </div>
  <div class="border m-t-12">
    <div class="bfc-box-2 left m-r-12">left 1 </div>
    <div class="bfc-box-overflow">自适应盒子 2 <br>
      当自适应的盒子放在没有出现在包含块最后时，渲染就会按顺序，把自适应的盒子渲染完毕再去渲染 right 3 盒子，所以就会把 right 3 挤下去
    </div>
    <div class="bfc-box-2 right m-l-12">right 3 </div>
  </div>
</div>