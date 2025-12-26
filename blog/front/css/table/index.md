---
outline: deep
---

# Table

## 圆角表格
以前总以为表格不可以做圆角效果，原因是因为设置`border-collapse: collapse;`后不可做圆角，这个属性：合并边框模型  

<shadow :src="import('/blog/front/css/table/table1.html?raw')" />
::: details code
<<< @/blog/front/css/table/table1.html
:::

## 表格顶部滚动固定(方案1)
通过设置 `tbody` 固定高度，和 `overflow` 来达到表格滚动顶部固定的效果  
这种方式对于固定宽度的单元格的表格可行，但是对于自适应的就不行了，会出现错位的现象，而且不支持横向滚动  
于是网上搜寻到了下面的一个方案  

<shadow :src="import('/blog/front/css/table/table2.html?raw')" />
::: details code
<<< @/blog/front/css/table/table2.html
:::

## 表格顶部滚动固定(方案2)
这个解决方案是通过`transform`来解决的  
大概思路是这样的：  
在表格外层嵌套一个盒子，通过监听盒子的滚动，动态设置`thead`的`transform: translateY(offsetTop)`从而达到头部固定的效果  
因为没改变表格的任何特性，所以表格头部和内容是自适应的，而且支持横向滚动  
这个是目前遇到的并且自我感觉对表格滚动头部固定的最完美的解决方案  

优点：  
代码轻量，只需要监听滚动，并设置`thead`的偏移量即可，不需要知道其高度，也不需要任何的动态计算  
不需要改变表格的原生特性  
有很好的回退机制，不设置外层嵌套盒子的高度，则和其它表格一样  

不过也发现了一个小小的问题：  
如果设置`border-collapse: collapse;`后，则会出现`thead`的边框消失(跟随内容上移)了  

<shadow :src="import('/blog/front/css/table/table3.html?raw')" />
::: details code
<<< @/blog/front/css/table/table3.html
:::
