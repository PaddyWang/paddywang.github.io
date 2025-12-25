import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // title: `/* Paddy'知识库 */`,
  title: ' ',
  description: `Paddy'技术博客、生活随笔、学习笔记、户外分享`,
  titleTemplate: ':title - Paddy',
  ignoreDeadLinks: true,
  head: [['link', { rel: 'icon', href: '/favicon.ico' }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    externalLinkIcon: true,
    // 
    nav: [
      { text: 'Blog', items: [
        { text: '前端', link: '/blog/front/index' },
        { text: 'Git', link: '/blog/git/git 基本使用' },
      ]},
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: {
      '/blog/front': [
        {
          text: '前端',
          items: [
            { text: '【CSS】常用选择器', link: 'blog/front/css/CSS 选择器' },
            { text: 'JS 的四种【函数调用模式】', link: '/blog/front/js/JS 函数调用模式' },
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        },
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
  },
})



/**/