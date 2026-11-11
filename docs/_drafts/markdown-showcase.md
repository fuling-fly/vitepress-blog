---
title: 【草稿示例】Markdown 排版速查
date: 2026-11-02
tags:
  - 工具
summary: 从公开文章迁到草稿目录的排版参考，演示「写一半就先放 _drafts」的用法。
draft: true
---

# Markdown 排版速查（草稿示例）

这个文件放在 `docs/_drafts/` 下，被 `srcExclude` 排除，**不会**出现在构建产物里。
它同时演示了草稿文件的写法：保留 `draft: true`，写完再挪到 `docs/posts/YYYY-MM/`。

## 代码块

```js
const posts = await createContentLoader('posts/**/*.md').load()
console.log(`共 ${posts.length} 篇文章`)
```

## 表格

| 语法 | 效果 |
| --- | --- |
| `**粗体**` | **粗体** |
| `` `代码` `` | `代码` |

## 提示容器

::: info 信息
用 `::: info` 包裹的内容会渲染成提示框。
:::

::: warning 注意
`::: warning` 用来提醒容易踩的坑。
:::

## 图片

图片放到 `docs/public/images/`，引用时以 `/` 开头，不带 `public`：

```md
![图片说明](/images/cover-markdown.svg)
```
