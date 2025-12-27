import { join } from 'path'
import { defineConfig } from 'vitepress'
import Components from 'unplugin-vue-components/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: ' ',
  description: `Paddy' 技术博客 学习随笔 户外分享`,
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
        { text: 'Git', link: '/blog/git/git 基本使用' },
      ]},
      { text: '终身成长', items: [
        { text: 'TODO', link: '/learning/TODO' },
      ]},
      { text: '户外分享', items: [
        { text: 'TODO', link: '/outdoor/TODO' },
      ]},
    ],

    sidebar: {
      '/blog/front': [
        { text: '前端专题' },
        {
          text: 'JavaScript',
          base: '/blog/front/js/',
          items: [
            { text: 'JS 函数调用模式', link: 'JS 函数调用模式' },
            { text: 'JS 中的闭包', link: 'JS 中的闭包' },
            { text: 'JS 中的递归', link: 'JS 中的递归' },
            { text: 'JS 中的[原型]', link: 'JS 中的原型/' },
            { text: 'JS 中的[作用域]与[作用域链]', link: 'JS 中的作用域与作用域链' }
          ]
        },
        {
          text: 'CSS',
          base: '/blog/front/css/',
          items: [
            { text: '操蛋的BFC', link: '操蛋的BFC' },
            { text: '走进浮动', link: '走进浮动' },
            { text: 'CSS 汇总', link: 'CSS 汇总' },
            { text: 'CSS 选择器', link: 'CSS 选择器' },
            { text: 'Table', link: 'table/' },
          ]
        },
      ],
      '/learning': [
        {
          text: '终身成长',
          items: []
        }
      ],
      '/outdoor': [
        {
          text: '户外分享',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/PaddyWang' }
    ],

    footer: {
      message: '打怪升级',
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

  vite: {
    plugins: [
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