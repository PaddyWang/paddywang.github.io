---
outline: deep
---

# 强大的CSS动画

> 在CSS3引入 transition 之前，CSS是没有时间轴的，所有的状态都是瞬间完成的

## transition
transition用于将一个状态由瞬间完成转换成一段时间完成  
如下面的对照:  
:::codeview
---
lang: html
shadow: true
---
<style>
  .transition-01 {
    width: 200px;
    height: 50px;
    border: 1px dashed #999;
    margin: 10px;
  }
  .transition-01:hover {
    width: 300px;
    height: 80px;
  }
</style>
<div class="transition-01">鼠标移过来看效果</div>
<div class="transition-01" style="transition: 1s;">鼠标移过来看效果(动画)</div>
:::


### transition-delay
延时 `transition` 的第二个参数  
:::codeview
---
lang: html
shadow: true
---
<style>
  .transition-01 {
    width: 200px;
    height: 50px;
    border: 1px dashed #999;
    margin: 10px;
  }
  .transition-01:hover {
    width: 300px;
    height: 80px;
  }
  .transition-02 {
    transition: 1s width, 1s 1s height;
  }
</style>
<div class="transition-01 transition-02">
  <div>鼠标移过来看效果(动画)</div>
  <div>先变宽再变高</div>
</div>
:::


### transition-timing-function
时间变换函数  
:::codeview
---
lang: html
shadow: true
---
<style>
  .transition-03 {
    display: flex;
    flex-wrap: wrap;
  }
  .transition-03 > div {
    width: 150px;
    height: 150px;
    border: 1px solid #333;
    margin: 8px;
    position: relative;
  }
  .transition-03 > div > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    background-color: pink;
    transition: 2s;
    z-index: -1;
  }
  .transition-03:hover > div > div {
    width: 50px;
    height: 50px;
    top: 100px;
    left: 100px;
  }
</style>
<div class="transition-03">
  <div>ease<div style="transition-timing-function: ease"></div></div>
  <div>ease-in<div style="transition-timing-function: ease-in"></div></div>
  <div>ease-out<div style="transition-timing-function: ease-out"></div></div>
  <div>ease-in-out<div style="transition-timing-function: ease-in-out"></div></div>
  <div>linear<div style="transition-timing-function: linear"></div></div>
  <div>step-start<div style="transition-timing-function: step-start"></div></div>
  <div>step-end<div style="transition-timing-function: step-end"></div></div>
  <div>steps(4, end)<div style="transition-timing-function: steps(4, end)"></div></div>
  <div>cubic-bezier(0.1, 0.7, 1.0, 0.1)<div style="transition-timing-function: cubic-bezier(0.1, 0.7, 1.0, 0.1)"></div></div>
</div>
:::


### 汇总
**属性分解**  
`transition-property: height;`  
`transition-duration: 1s;`  
`transition-delay: 1s;`  
`transition-timing-function: ease;`  

**`transition` 存在的问题**  
需要触发条件  
一次执行，不可重复  
只有开始和结束状态，没有中间态  

## animation
`animation` 定义了如何用关键帧来随时间推移对CSS属性的值进行动画处理。关键帧动画的行为可以通过指定它们的持续时间，它们的重复次数以及它们如何重复来控制  
`animation-timing-function` & `animation-delay` 同 `transition`  

下面是 animation 的公共样式
```html
<style>
  [class|=animation] {
    height: 10px;
    background-color: #eee;
  }
  [class|=animation] > div {
    height: 100%;
    background-color: pink;
    transform: scaleX(0);
    transform-origin: left;
  }
  @keyframes animation {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
</style>
```


:::codeview
---
lang: html
shadow: true
---
<style>
  [class|=animation] {
    height: 10px;
    background-color: #eee;
  }
  [class|=animation] > div {
    height: 100%;
    background-color: pink;
    transform: scaleX(0);
    transform-origin: left;
  }
  @keyframes animation {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
</style>
<style>
  .animation-01:hover > div {
    animation: 3s animation;
  }
</style>
<div>鼠标移动到下面↓↓</div>
<div class="animation-01"><div></div></div>
:::


### animation-iteration-count
定义动画在结束前运行的次数 可以是N次 无限循环  
:::codeview
---
lang: html
shadow: true
---
<style>
  [class|=animation] {
    height: 10px;
    background-color: #eee;
  }
  [class|=animation] > div {
    height: 100%;
    background-color: pink;
    transform: scaleX(0);
    transform-origin: left;
  }
  @keyframes animation {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
</style>
<style>
  .example-animation-iteration-count:hover .animation-iteration-count-infinite {
    animation: 3s animation infinite;
  }
  .example-animation-iteration-count:hover .animation-iteration-count-1-5 {
    animation: 3s animation 1.5;
  }
  .example-animation-iteration-count:hover .animation-iteration-count-2 {
    animation: 3s animation 2;
  }
</style>
<div>鼠标移动到下面↓↓</div>
<div class="example-animation-iteration-count">
  <div>无限次</div>
  <div class="animation">
    <div class="animation-iteration-count-infinite"></div>
  </div>
  <div>1.5次</div>
  <div class="animation">
    <div class="animation-iteration-count-1-5"></div>
  </div>
  <div>2次</div>
  <div class="animation">
    <div class="animation-iteration-count-2"></div>
  </div>
</div>
:::


### animation-fill-mode
动画结束以后，会立即从结束状态跳回到起始状态。如果想让动画保持在结束状态，需要使用 `animation-fill-mode` 属性  
:::codeview
---
lang: html
shadow: true
---
<style>
  [class|=animation] {
    height: 10px;
    background-color: #eee;
  }
  [class|=animation] > div {
    height: 100%;
    background-color: pink;
    transform: scaleX(0);
    transform-origin: left;
  }
  @keyframes animation {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
</style>
<style>
  .example-animation-fill-mode:hover .animation-fill-mode-forwards {
    animation: 2s animation 1 forwards;
  }
  .example-animation-fill-mode:hover .animation-fill-mode-backwards {
    animation: 2s animation 1 backwards;
  }
  .example-animation-fill-mode:hover .animation-fill-mode-both {
    animation: 2s animation 1 both;
  }
</style>
<div>鼠标移动到下面↓↓</div>
<div class="example-animation-fill-mode">
  <div>forwards</div>
  <div class="animation">
    <div class="animation-fill-mode-forwards"></div>
  </div>
  <div>backwards</div>
  <div class="animation">
    <div class="animation-fill-mode-backwards"></div>
  </div>
  <div>both</div>
  <div class="animation">
    <div class="animation-fill-mode-both"></div>
  </div>
</div>
:::


### animation-direction
描述了动画的播放时间轴方向  
:::codeview
---
lang: html
shadow: true
---
<style>
  [class|=animation] {
    height: 10px;
    background-color: #eee;
  }
  [class|=animation] > div {
    height: 100%;
    background-color: pink;
    transform: scaleX(0);
    transform-origin: left;
  }
  @keyframes animation {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
</style>
<style>
  [class|=bgc] {
    height: 10px;
    margin: 4px 0;
  }
  .bgc-normal {
    background-image: linear-gradient(to right, #eee 0, pink 25%, #eee 25%, pink 50%, #eee 50%, pink 75%, #eee 75%, pink);
  }
  .bgc-reverse {
    background-image: linear-gradient(to left, #eee 0, pink 25%, #eee 25%, pink 50%, #eee 50%, pink 75%, #eee 75%, pink);
  }
  .bgc-alternate {
    background-image: linear-gradient(to right, #eee 0, pink 25%, pink 25%, #eee 50%, #eee 50%, pink 75%, pink 75%,  #eee);
  }
  .bgc-alternate-reverse {
    background-image: linear-gradient(to right, pink 0, #eee 25%, #eee 25%, pink 50%, pink 50%, #eee 75%, #eee 75%,  pink);
  }
</style>
<style>
  .animation:hover .animation-direction-normal {
    animation: 2s animation infinite normal;
  }
  .animation:hover .animation-direction-reverse {
    animation: 2s animation infinite reverse;
  }
  .animation:hover .animation-direction-alternate {
    animation: 2s animation infinite alternate;
  }
  .animation:hover .animation-direction-alternate-reverse {
    animation: 2s animation infinite alternate-reverse;
  }
</style>
<div>鼠标移动到下面灰色线上↓↓</div>
<div class="example-animation-direction">
  <div>normal</div>
  <div class="bgc-normal"></div>
  <div class="animation">
    <div class="animation-direction-normal"></div>
  </div>
  <div>reverse</div>
  <div class="bgc-reverse"></div>
  <div class="animation">
    <div class="animation-direction-reverse"></div>
  </div>
  <div>alternate</div>
  <div class="bgc-alternate"></div>
  <div class="animation">
    <div class="animation-direction-alternate"></div>
  </div>
  <div>alternate-reverse</div>
  <div class="bgc-alternate-reverse"></div>
  <div class="animation">
    <div class="animation-direction-alternate-reverse"></div>
  </div>
</div>
:::


### animation-play-state
属性定义一个动画是否运行或者暂停。可以通过查询它来确定动画是否正在运行  
另外，它的值可以被设置为暂停和恢复的动画的重放  
:::codeview
---
lang: html
shadow: true
---
<style>
  [class|=animation] {
    height: 10px;
    background-color: #eee;
  }
  [class|=animation] > div {
    height: 100%;
    background-color: pink;
    transform: scaleX(0);
    transform-origin: left;
  }
  @keyframes animation {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
</style>
<style>
  .example-animation-play-state .animation-play-state {
    animation: 2s animation infinite;
    animation-play-state: paused;
  }
  .example-animation-play-state:hover .animation-play-state {
    animation-play-state: running;
  }
  .example-animation-play-state:hover .animation-play-state-normal {
    animation: 2s animation infinite;
  }
</style>
<div>鼠标移动到下面↓↓</div>
<div class="example-animation-play-state">
  <div>paused/running</div>
  <div class="animation">
    <div class="animation-play-state"></div>
  </div>
  <div>normal</div>
  <div class="animation">
    <div class="animation-play-state-normal"></div>
  </div>
</div>
:::


## 应用：步进输入文字效果
:::codeview
---
lang: html
shadow: true
---
<style>
  .demo-01 {
    font: bold 200% Consolas, Monaco, monospace;
    border-right: .1em solid;
    width: 16.5em; /* fallback */
    width: 30ch; /* # of chars */
    margin: 2em 1em;
    white-space: nowrap;
    overflow: hidden;
  }
  .demo-01-animation {
    animation:
        typing 20s steps(30, end), /* # of steps = # of chars */
        blink-caret .5s step-end infinite alternate;
  }
  @keyframes typing { from { width: 0; } }
  @keyframes blink-caret { 50% { border-color: transparent; } }
</style>
<div class="demo-01">Typing animation by Lea Verou.</div>
<div onclick="document.querySelector('.demo-01').className += ' demo-01-animation'">点击查看效果</div>
:::