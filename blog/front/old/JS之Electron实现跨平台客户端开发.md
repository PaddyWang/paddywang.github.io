---
outline: deep
---

# JS 之 Electron 实现跨平台客户端开发

强大的 JS 再次放大招了，构建跨平台桌面应用  

> 该文档为填坑+实现  
> 涉及到基础应用的搭建、打包、版本增量更新  
> 不涉及深入的技术(毕竟也是刚接触)  
> 不涉及 Linux 系统  
> 不涉及代码签名  
> 不涉及应用分发  

### 关于 electron
Electron是由Github开发，用HTML，CSS和JavaScript来构建跨平台桌面应用程序的一个开源库。   Electron通过将Chromium和Node.js合并到同一个运行时环境中，并将其打包为Mac，Windows和Linux系统下的应用来实现这一目的。  
Electron于2013年作为构建Github上可编程的文本编辑器Atom的框架而被开发出来。这两个项目在2014春季开源。  
目前它已成为开源开发者、初创企业和老牌公司常用的开发工具。  

[官方文档](https://electronjs.org/docs)

### 开发环境搭建
- 首先需要 node 环境(node 和 npm 的版本不能太低)
- 安装构建环境 `npm i electron --save-dev` (或者安装全局依赖) 
- 安装打包环境 `npm i electron-packager --save-dev` (或者安装全局依赖) 
- 安装依赖环境的时候建议使用淘宝镜像或者直接使用 `cnpm`

这里有一个官方给的快速启动项目  
https://github.com/electron/electron-quick-start

```bash
# clone 项目
git clone https://github.com/electron/electron-quick-start

cd electron-quick-start

# 安装依赖项
npm i  # 或者 cnpm i

# 运行
npm start
```

### 生命周期
首先 electron 会读取 `package.json` 文件，根据该文件的相关配置，来运行程序  
package.json 参数说明：  
```js
{
  "name": "electron-quick-start",  // 应用的名称
  "version": "1.0.0",  // 应用的版本号
  "description": "A minimal Electron application",  // 描述(暂不知道在哪用到来)
  "main": "main.js",  // 入口文件(主进程)
  "scripts": {
    "start": "electron ."
  },
  "author": "GitHub",
  "license": "CC0-1.0",
  "devDependencies": {
    "electron": "^5.0.8",
    "electron-packager": "^14.0.4"
  }
}
```

接下来就是在 main.js 去创建渲染进程  
```js
// electron 绝大多少API(就当全部，没有进行详细研究)需要在主进程初始化之后才可以用  
// electron 的 API 是区分主进程和渲染进程的  
// nodejs 的 API 可以任意用  

/* ... */
// 主进程初始化完成时触发
app.on('ready', createWindow);
function createWindow () {
  // 创建一个窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // 加载 渲染进程 preload.js
      // 该 js 可以操作 DOM  可以使用 electron API 也可以使用 nodejs API (这样编程太爽了)
      // 在使用 主进程的 API 时，需要 `remote` 作为桥梁
      preload: path.join(__dirname, 'preload.js')
    }
  });
  // 主窗口渲染的页面  可以使用本地项目页面 也可以用远程页面
  // 即可以对远程页面的任意的操作(随心所欲)
  // webview 也同样可以 有点像 app 内嵌网页一样
  mainWindow.loadFile('index.html');
  // 打开窗口的开发者工具
  mainWindow.webContents.openDevTools();

  // 窗口关闭时触发
  mainWindow.on('closed', function () {
    // 释放窗口内存
    mainWindow = null;
  });
}

// 所有的窗口关闭时触发
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// 当应用被激活时触发
app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
```

我的理解大概是这样回事：  
- 有个配置文件 `package.json`
- 每个 js 文件都在自己的进程中执行
- 主进程有且只有一个，渲染进程可以有多个
- 主进程可以创建窗口
- 每个窗口对应单独的渲染进程

### 开发随笔
- 主进程不可以操作页面相关的内容 如 DOM、BOM 等
- 数据共享
    + 进程间通信
    + 浏览器数据缓存对象(渲染进程)
    + global 对象
- 在渲染进程中不需要授权可以直接用浏览器相关的 API
- 默认情况下会有很多操作菜单，可以重置掉
- 在开发模式下应用的名称和图标不会变成 `package.json` 里面对应的，等到打包之后就正常了(这个真是个很大的坑，研究了半天啊)
- Mac 上打包 Mac 版的，如果设置了图标但是还是显示的 electron 的，copy 一下程序，粘贴到其他地方就好了(又是一个坑)
- about(关于)选项也是，打包之后就变成真正项目的了

### 打包
开始进入打包环节了，离成功只差一步了  
`electron-packager` 已经安装就绪  
通过`electron-packager`直接打包出来的为绿色免安装的应用程序(Windows的dll文件不能删)  
在 Mac 上可以打包 Mac 和 Windows 的 安装程序  
Windows 上貌似只可以打包 Windows 的安装程序  
在 Mac 上打包 Windows 程序的时候需要先安装 [wine](https://www.winehq.org/) `brew install wine`， 这是一个 Windows 的运行兼容层   
目前只在 Mac 上打包成功了 Windows 的 64 位的安装程序 32 位的怎么都没成功(有打包成功的可以分享交流一下)  
在 Windows 上打包时 用的是当前操作系统的 Microsoft .NET Framework 框架  
网上看了很多其他版本的打包参数，结果不起作用或者报错，可能是因为 版本不同原因  在此不做过多研究  
第一次打包可能会比较慢一点  再次打包基本不到1分钟就搞定  
第一次打包的时候不要强制结束进程，不然可能会把没下载完的依赖缓存起来，再次就会报错，需要清空缓存才可以(虽然没遇到过，看网上有遇到的)  

来看一下打包参数：  
```bash
electron-packager . --overwrite --platform=darwin --arch=x64 --out=out --ignore=node_modules --ignore=out --ignore=imgs/icons/icon.ico --ignore=README.md --icon=imgs/icons/icon.icns

# --overwrite  每次打包先删除之前的再打包
# --platform   打包程序的运行平台
# --arch       操作系统的架构体系
# --out        打包之后的输出路径
# --ignore     打包时忽略的文件/文件夹  支持多个 支持模糊匹配
# --icon       打包时生成的应用图标
```

**关于应用图标**  
Mac 上使用 `.icns`  
win 上使用 `.ico`  
推荐一个图标生成神器[electron-icon-maker](https://www.npmjs.com/package/electron-icon-maker) 会自动生成需要的图标，生成的 `.icns` 和 `.ico` 为合成图标，同时也会生成一堆不同尺寸的 `.png`   
推荐 `1024px x 1024px` 或者 更大尺寸的 并且需要 1:1 原始 `.png` 图标    

### 自动增量更新
没有用官方提供的 `autoUpdater` 也没有用 [electron-build](https://www.electron.build/) 提供的，而是借鉴了 [张鑫旭](https://www.zhangxinxu.com/life/about/) 大牛的更新原理[我是如何实现electron的在线升级热更新功能的？](https://www.zhangxinxu.com/wordpress/2017/06/how-electron-online-update-hot-fix/)  

最终实现思路如下：  
- 通过本地 `package.json` 中的 version 和远端的进行对比
- 如果本地版本小于远端版本，则获取更新日志文件 `update.log.json`
- 通过更新日志文件获取到更新的文件列表和日志列表
- 创建一个临时文件夹(以最新版本号命名)用于存储更新文件
- 从远端获取到所有需要更新的文件，并按照相同的路径存储在临时文件中
- 待所有更新文件下载完成，一次性进行批量替换
- 远端只需要一个静态服务即可
- 现在只需要打包一次，剩下的事情都交给自动更新吧
- 渲染进程可以刷新后立即生效，主进程需要重启程序才能生效
- 该更新的实现得益于 `nodejs` 强大的 `fs` 模块

更新日志文件`update.log.json`  
```json
[{
  "version": "0.0.0",
  "files": ["js/home.js", "deleted|css/style.css"],
  "logs": [
    "更新/新增 home.js",
    "删除 style.css",
    "如果 logs: false 则不显示更新日志",
    "如果logs: [] 为空 则提示默认的更新信息"
  ]
}]
```
