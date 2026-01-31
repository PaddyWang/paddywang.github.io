import { join } from 'path'
import { defineConfig } from 'vitepress'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import markmapPlugin from '@vitepress-plugin/markmap'
import mermaidPlugin from '@vitepress-plugin/mermaid'
import codeviewPlugin from '@vitepress-plugin/codeview'

import outdoorData from '../outdoor/data'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: ' ',
  description: `Paddy' 技术博客 学习随笔 户外分享 开源贡献`,
  titleTemplate: ':title - Paddy',
  ignoreDeadLinks: true,
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    externalLinkIcon: true,
    // 
    nav: [
      { text: '技术博客', items: [
        { text: '前端专题', link: '/blog/front/index' },
        { text: 'Git', link: '/blog/git/git基本使用' },
      ]},
      { text: '开源贡献', items: [
        { text: 'vitepress图表(mermaid)插件', link: 'https://paddywang.github.io/vitepress-plugin/mermaid/' },
        { text: 'vitepress脑图(markmap)插件', link: 'https://paddywang.github.io/vitepress-plugin/markmap/' },
        { text: 'vitepress代码显示(codeview)插件', link: 'https://paddywang.github.io/vitepress-plugin/codeview/' },
        { text: 'Chrome插件通信模型', link: 'https://www.npmjs.com/package/crx-message' },
      ]},
      { text: '终身成长', items: [
        { text: '人生伴侣', link: '/learning/mate/人生伴侣' },
        { text: '随笔', link: '/learning/essay/' },
      ]},
      { text: '户外分享', items: outdoorData},
    ],

    sidebar: {
      '/blog/front': [
        // { text: '前端专题' },
        { text: '超级小编译器', link: '/blog/front/the-super-tiny-compiler/' },
        {
          text: 'React 系列',
          base: '/blog/front/react/',
          items: [
            { text: '践行 Toy React Hooks', link: '践行ToyReactHooks/' },
            { text: '初识 React hooks', link: '初识Reacthooks/' },
            { text: 'React新手眼中的Fiber', link: 'React新手眼中的Fiber/' },
          ],
        },
        {
          text: 'Demo',
          base: '/blog/front/demo/',
          items: [
            { text: '视频帧渲染', link: 'video-frame/' },
          ],
        },
        {
          text: 'JavaScript',
          base: '/blog/front/js/',
          items: [
            { text: '编码的前世今生', link: '编码的前世今生/' },
            { text: 'JS 中为什么 0.1 + 0.2 != 0.3 ?', link: 'JS中为什么0.1+0.2!=0.3/' },
            { text: '原码、反码、补码的探索', link: '原码反码补码的探索/' },
            { text: 'JavaScript语言精粹-随笔', link: 'JavaScript语言精粹-随笔' },
            { text: 'JS 函数调用模式', link: 'JS函数调用模式' },
            { text: 'JS 中的闭包', link: 'JS中的闭包' },
            { text: 'JS 中的递归', link: 'JS中的递归' },
            { text: 'JS 中的[原型]', link: 'JS中的原型/' },
            { text: 'JS 中的[作用域]与[作用域链]', link: 'JS中的作用域与作用域链' }
          ]
        },
        {
          text: 'CSS',
          base: '/blog/front/css/',
          items: [
            { text: 'CSS 汇总', link: 'CSS汇总' },
            { text: 'CSS 选择器', link: 'CSS选择器' },
            { text: '强大的CSS动画', link: '强大的CSS动画' },
            { text: '[译]A Complete Guide to Flexbox', link: '[译]A-Complete-Guide-to-Flexbox/' },
            { text: '揭开 baseline & line-height & vertical-align 的面纱', link: '揭开baseline&line-height&vertical-align的面纱/' },
            { text: '盒模型', link: '盒模型' },
            { text: '深入了解定位', link: '深入了解定位' },
            { text: '有趣的线性渐变', link: '有趣的线性渐变' },
            { text: '背景裁剪', link: '背景裁剪' },
            { text: '操蛋的BFC', link: '操蛋的BFC' },
            { text: '走进浮动', link: '走进浮动' },
            { text: 'Table', link: 'table/' },
          ]
        },
        {
          text: '历史博客',
          base: '/blog/front/old/',
          collapsed: true,
          items: [
            { text: 'HTML5-的设计原理', link: 'HTML5-的设计原理' },
            {
              text: 'Angular 系列',
              items: [
                { text: 'What Angular init-before', link: '/angular/What-Angular-init-before' },
                { text: 'Angular 之 $q 实现 promise 源码解读(01)', link: '/angular/Angular之$q实现promise源码解读(01)' },
                { text: 'Angular 之 $http 服务 源码解读(02)', link: '/angular/Angular之$http服务源码解读(02)' },
                { text: 'Angular 之 $inject 实现原理(03)', link: '/angular/Angular之$inject实现原理(03)' },
              ],
            },
            { text: 'JS 之 Electron 实现跨平台客户端开发', link: 'JS之Electron实现跨平台客户端开发' },
            { text: '移动Web开发', link: '移动Web开发' },
            { text: '移动端开发总结', link: '移动端开发总结' },
            { text: '响应式布局', link: '响应式布局' },
            { text: '前端模块化思想', link: '前端模块化思想' },
            { text: '前端兼容性问题', link: '前端兼容性问题' },
            { text: '20190302-随笔-前端系统开发月报', link: '20190302-随笔-前端系统开发月报' },
            { text: 'JS 总结-01', link: 'JS总结-01' },
          ]
        }
      ],
      '/learning': [
        {
          base: '/learning/mate/',
          items: [
            { text: '人生伴侣', link: '人生伴侣' },
            { text: '如何选择人生伴侣?', link: '如何选择人生伴侣' },
          ]
        }
      ],
      '/learning/essay': [
        {
          text: '随笔',
          base: '/learning/essay/',
          link: '/',
          items: [
            { text: '知识模型', link: '知识模型' },
            { text: '人生三次祛魅', link: '祛魅' },
            { text: '纽约时间', link: '纽约时间' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/PaddyWang' }
    ],

    footer: {
      message: '终身成长',
      copyright: 'Copyright © 2025 PaddyWang'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '页面导航'
    },
    lastUpdated: {
      text: '最后更新于'
    },
    notFound: {
      title: '页面未找到',
      quote:
        '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
      linkLabel: '前往首页',
      linkText: '带我回首页'
    },
    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容',
  },

  markdown: {
    config: (md) => {
    }
  },

  vite: {
    plugins: [
      codeviewPlugin({
        lang: 'md',
        text: 'code',
        activeText: '收起',
      }),
      markmapPlugin(),
      mermaidPlugin(),
      tailwindcss(),
      Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dirs: ['.vitepress/components'],
      }),
    ],
    css: {
      postcss: {},
      preprocessorOptions: {
        scss: {
          // 如果不需要自定义 SCSS 变量，可以移除这个配置
          charset: false
        }
      },
    },
    resolve: {
      alias: {
        '@': join(process.cwd(), '/'),
      },
    },
    assetsInclude: ['**/*.html']
  }
})

/* Paddy'知识库 */