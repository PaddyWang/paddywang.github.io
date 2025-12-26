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
    ],

    sidebar: {
      '/blog/front': [
        {
          text: '前端',
          items: [
            { text: 'CSS 选择器', link: 'blog/front/css/CSS 选择器' },
            { text: 'JS 函数调用模式', link: '/blog/front/js/JS 函数调用模式' },
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' },
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
})



/**/