# vitepress-blog

「每天和 AI 的精彩内容」——独立 VitePress 博客。

- 位置：`H:\code\vuepresshopelocalll\2026-11-12\vitepress-blog`
  - 原计划放在仓库外的 `H:\code\vitepress-blog`，但当前环境的文件写入策略会拒绝对该路径的写入（`EPERM`，Vite 写临时配置文件时即失败），因此放在工作区内，并已在该目录 `git init` 成独立仓库。
  - 父仓库（VuePress）的 `.gitignore` 里已追加 `2026-11-12/vitepress-blog/`，避免被误提交。
- 技术栈：VitePress 1.6.4 + Vue 3.5.45
- 包管理器：npm（`package-lock.json` 随仓库提交）
- 内容目录：`docs/`
- 内容来源：Obsidian vault（私密，默认 `H:\code\vuepresshopelocalll\2026-11-12\knowledge-base`），只通过 `publish/` 单向同步，详见 [PUBLISHING.md](PUBLISHING.md)

> 与旧 VuePress 站点的关系：两个项目各自有独立的 `package.json`、依赖目录、构建产物和 git 历史。本项目不读写 `vuepresshopelocalll` 的源文件，两者部署路径也不冲突。

## 目录结构

```
vitepress-blog/
├─ package.json
├─ package-lock.json
├─ README.md
├─ PUBLISHING.md                    # Obsidian vault → 站点 的发布流程
├─ .gitignore
├─ .github/workflows/deploy.yml     # GitHub Pages 部署
├─ scripts/publish.mjs              # 发布脚本（单向读取 vault 的 publish/）
└─ docs/                            # 站点根目录
   ├─ index.md                      # 首页：hero + 最新一篇
   ├─ about.md                      # 关于 / 写作约定
   ├─ posts/
   │  ├─ index.md                   # 归档页（组件自动按月分组）
   │  ├─ 2026-11/
   │  │  └─ 2026-11-12-vitepress-daily-blog.md
   │  └─ 2026-10/
   │     └─ 2026-10-28-prompt-three-layers.md
   ├─ _drafts/                      # 草稿，被 srcExclude 排除，不进构建
   │  ├─ _template.md               # 文章模板（复制它开始写）
   │  ├─ markdown-showcase.md       # 排版参考示例
   │  └─ vue3-composition-api.md    # 技术笔记示例
   ├─ public/                       # 原样拷贝到产物根目录
   │  ├─ favicon.svg
   │  ├─ logo.svg
   │  └─ images/                    # 封面占位图（SVG，可直接替换）
   └─ .vitepress/
      ├─ config.mts                 # 站点配置 + 自动侧边栏
      ├─ data/posts.data.ts         # 构建期扫描 posts，产出归档数据
      ├─ theme/
      │  ├─ index.ts                # 注册 PostList / LatestPost
      │  ├─ custom.css
      │  └─ components/
      │     ├─ PostList.vue         # 归档列表（按月分组）
      │     └─ LatestPost.vue       # 首页最新一篇卡片
      ├─ cache/                     # 构建缓存（git 忽略）
      └─ dist/                      # 构建产物（git 忽略）
```

## 常用命令

```bash
npm install          # 首次安装依赖
npm run docs:dev     # 本地开发，http://localhost:5173/vitepress-blog/
npm run docs:build   # 构建到 docs/.vitepress/dist
npm run docs:preview # 预览构建产物，http://localhost:4173/vitepress-blog/
npm run publish:dry  # 预览将从 Obsidian vault 发布哪些笔记
npm run publish      # 实际发布（转双链、复制附件、补 frontmatter、敏感拦截）
```

## 内容约定

### 路径与命名

- 正式文章：`docs/posts/YYYY-MM/YYYY-MM-DD-slug.md`，slug 用英文小写 + 连字符；
- 月份目录只影响 URL：`/posts/2026-11/2026-11-12-vitepress-daily-blog`；
- 草稿：`docs/_drafts/`，`srcExclude: ['_drafts/**']` 已排除，不会出现在构建产物里。

### frontmatter 字段

```yaml
---
title: 用 VitePress 重搭一个「每日 AI 精选」博客
date: 2026-11-12
tags:
  - 工具
  - 工作流
summary: 一句话摘要，会显示在归档页和首页卡片上。
aiModel: Claude Sonnet 4.5   # 可选
draft: false                 # 可选，true 时不出现在归档
---
```

- `date` 必须是 `YYYY-MM-DD`，归档排序依赖它；
- `tags` 使用固定五类：**提示词 / 工作流 / 工具 / 踩坑 / 思考**；
- `summary` 控制在 60 字以内。

### 新增一篇文章

1. 复制模板：

   ```powershell
   Copy-Item docs\_drafts\_template.md docs\posts\2026-11\2026-11-20-my-slug.md
   ```

2. 改 frontmatter 的 `date`、`title`、`summary`、`tags`、`aiModel`，删掉 `draft` 或改成 `false`；
3. 正文写完后 `npm run docs:dev` 预览，`npm run docs:build` 验证。

**不需要改任何配置**：归档页和侧边栏都会在构建期扫描 `docs/posts` 自动更新。放错月份目录只会让 URL 与归档分组对不上，不会构建失败。

图片放到 `docs/public/images/`，Markdown 里用 `/images/xxx.svg`（不带 `public`），有 `base` 前缀时 VitePress 会自动补全。

## 部署到 GitHub Pages

### base 取值

`docs/.vitepress/config.mts` 顶部的 `base` 决定资源路径：

| 部署形态 | URL | base |
| --- | --- | --- |
| GitHub 项目站点（当前） | `https://fuling-fly.github.io/vitepress-blog/` | `'/vitepress-blog/'` |
| GitHub 用户站点 | `https://fuling-fly.github.io/` | `'/'` |
| 自定义域名 / 根路径 | `https://blog.example.com/` | `'/'` |

**改完 base 必须重新 `npm run docs:build`**，否则产物里的 JS/CSS 路径仍是旧值。

### 自动化

`.github/workflows/deploy.yml`：

```text
npm ci → npm run docs:build → upload-pages-artifact(path: docs/.vitepress/dist) → deploy-pages@v4
```

权限为 `contents: read` / `pages: write` / `id-token: write`，带 `concurrency`，触发分支与仓库默认分支一致。

仓库 Settings → Pages 的 Source 需为 **GitHub Actions**（或用 API：`gh api --method POST repos/fuling-fly/vitepress-blog/pages -f build_type=workflow`）。

### 已知坑

- `github-pages` 环境的 deployment branch policy 默认只允许 `main`。若默认分支不是 `main`，deploy job 会失败且 steps 为空，需要把分支加入允许策略。
- 首次部署后自定义域名/DNS 未就绪时可能短暂 404，等几分钟重跑或直接重试即可。

## 环境备注

仓库外路径 `H:\code\vitepress-blog` 不可写时，`vitepress dev` 会报：

```
EPERM: operation not permitted, open '...\docs\.vitepress\config.mts.timestamp-*.mjs'
```

Vite 加载 `.mts` 配置需要在同级写临时 `.mjs`。这属于环境写入策略限制，与 Node 24 / 依赖版本无关。
