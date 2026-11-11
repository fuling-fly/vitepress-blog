---
title: 用 VitePress 重搭一个「每日 AI 精选」博客
date: 2026-11-12
tags:
  - 工具
  - 工作流
summary: 从 VuePress 迁到 VitePress，按月归档、自动侧边栏和本地搜索一次配好，顺便记下 base 这个坑。
aiModel: Claude Sonnet 4.5
---

# 用 VitePress 重搭一个「每日 AI 精选」博客

![VitePress 示例封面](/images/cover-vitepress.svg)

原来的博客跑在 VuePress 2 + theme-hope 上，能写但每次冷启动都要等。既然内容是「每天和 AI 的精彩内容」这种小颗粒记录，站点要的是**快**：打开快、构建快、加一篇新文章的手续少。

## 为什么换 VitePress

| 维度 | VuePress 2 | VitePress 1.x |
| --- | --- | --- |
| 构建工具 | webpack | Vite |
| 冷启动 | 十几秒起 | 通常 1～2 秒 |
| 主题扩展 | theme-hope 全家桶 | 默认主题 + 少量组件 |
| 内容模型 | 插件/主题约定较多 | Markdown 目录即路由 |

日常节奏是「一天一篇」，所以启动快和零配置新增比主题丰富更重要。

## 目录约定

```text
docs/
├─ index.md                       # 首页
├─ posts/
│  ├─ index.md                    # 归档页（自动扫描生成列表）
│  └─ 2026-11/
│     └─ 2026-11-12-vitepress-daily-blog.md
└─ _drafts/                       # 草稿，不参与构建
```

月份目录只影响 URL 的层级，比如 `/posts/2026-11/2026-11-12-vitepress-daily-blog`。

## frontmatter 统一字段

```yaml
---
title: 用 VitePress 重搭一个「每日 AI 精选」博客
date: 2026-11-12
tags:
  - 工具
  - 工作流
summary: 一句话说明这篇讲了什么，会显示在归档页。
aiModel: Claude Sonnet 4.5   # 可选：涉及哪个模型/工具
draft: false                 # 可选：true 时不出现在归档
---
```

归档页和首页的「最新一篇」都从这些字段读数据，所以 `date` 必须写成 `YYYY-MM-DD`，否则排序会错。

## 自动侧边栏

侧边栏在 `config.mts` 里构建时扫描 `docs/posts`：

```ts
const months = readdirSync(postsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d{4}-\d{2}$/.test(d.name))
  .map((d) => d.name)
  .sort()
  .reverse()
```

新增文章只放文件、不改配置，侧边栏和归档都会自动更新。最新月份默认展开，历史月份折叠。

## base 这个坑

`base` 在构建期写进所有资源 URL。部署到 GitHub 项目站点：

```ts
export default defineConfig({
  base: '/vitepress-blog/' // 改成 '/<仓库名>/'
})
```

::: warning 改 base 后必须重新 build
只重启 dev server 是不够的——产物里的 JS/CSS 路径还是旧值，部署后整站白屏或 404。
:::

## 小结

- 内容模型：一天一个 md，按月归档；
- 自动化：归档列表与侧边栏都在构建期扫描生成；
- 草稿：`_drafts/` 被 `srcExclude` 排除，不会再误发布。
