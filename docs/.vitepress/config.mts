import { defineConfig } from 'vitepress'
import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// 文章根目录：docs/posts
const postsDir = fileURLToPath(new URL('../posts', import.meta.url))

/** 从 md 文件的 frontmatter 里取 title；取不到就退回文件名 */
function readTitle(file: string) {
  const raw = readFileSync(file, 'utf-8')
  const matched = raw.match(/^title:\s*(.+)$/m)
  if (!matched) return path.basename(file, '.md')
  return matched[1].trim().replace(/^['"]|['"]$/g, '')
}

/** 2026-11 -> 2026 年 11 月 */
function formatMonth(month: string) {
  const [year, mon] = month.split('-')
  return `${year} 年 ${Number(mon)} 月`
}

/**
 * 侧边栏按 docs/posts 下的月份目录自动生成：
 * 新增文章只要放进 YYYY-MM 目录，不用再改配置。
 * 最新月份默认展开，历史月份默认折叠。
 */
function buildPostSidebar() {
  const months = readdirSync(postsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{4}-\d{2}$/.test(d.name))
    .map((d) => d.name)
    .sort()
    .reverse()

  return [
    {
      text: '每日 AI 精选',
      items: [{ text: '文章归档', link: '/posts/' }]
    },
    ...months.map((month, index) => ({
      text: formatMonth(month),
      collapsed: index !== 0,
      items: readdirSync(path.join(postsDir, month))
        .filter((f) => f.endsWith('.md'))
        .sort()
        .reverse()
        .map((file) => ({
          text: readTitle(path.join(postsDir, month, file)),
          link: `/posts/${month}/${file.replace(/\.md$/, '')}`
        }))
    }))
  ]
}

export default defineConfig({
  lang: 'zh-CN',
  title: '浮灵的博客',
  description: '每天和 AI 的精彩内容：提示词、工作流、工具与踩坑记录',

  // GitHub 项目站点：https://fuling-fly.github.io/vitepress-blog/
  // 换成自定义域名或根路径部署时改回 '/'，改完必须重新 build。
  base: '/vitepress-blog/',

  cleanUrls: true,
  lastUpdated: true,

  // 草稿目录不参与构建，写了一半的文章放这里不会出现在产物里
  srcExclude: ['_drafts/**'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#3451b2' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '浮灵的博客',

    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/', activeMatch: '^/posts/' },
      { text: '关于', link: '/about', activeMatch: '^/about' }
    ],

    // 只在文章区显示侧边栏，首页保持干净的 hero 布局
    sidebar: {
      '/posts/': buildPostSidebar(),
      '/about': [
        {
          text: '关于',
          items: [{ text: '关于我', link: '/about' }]
        }
      ]
    },

    // 本地搜索，不依赖任何外部服务
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '没有找到相关内容',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    outline: {
      level: [2, 3],
      label: '本页目录'
    },

    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdatedText: '最后更新于',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '外观',
    langMenuLabel: '切换语言',

    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2026 浮灵'
    }
  }
})
