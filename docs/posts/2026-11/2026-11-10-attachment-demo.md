---
title: 附件与图片的发布演示
date: 2026-11-10
tags:
  - 工作流
  - 工具
summary: 演示 Obsidian 的 ![[附件]] 语法如何被转成站点图片，并把文件复制到 publish-assets。
aiModel: Claude Sonnet 4.5
draft: false
---

# 附件与图片的发布演示

Obsidian 里嵌入图片用 `![[文件]]`，站点不认这个语法，发布脚本会把它改写成标准 markdown 图片。

下面是示例附件：

![demo-image.svg](/publish-assets/demo-image.svg)

发布后图片会被复制到站点的 `docs/public/publish-assets/`，引用路径变成 `/publish-assets/demo-image.svg`。

## 小结

- 附件放在 `publish/assets/` 下，脚本会递归复制；
- 同名附件以 `publish/` 里的最新内容为准。
