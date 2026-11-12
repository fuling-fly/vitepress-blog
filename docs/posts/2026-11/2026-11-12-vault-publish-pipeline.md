---
title: 把 Obsidian 笔记接到 VitePress
date: 2026-11-12
tags:
  - 思考
summary: 
draft: false
---
今天把 Obsidian 里的笔记接到了 VitePress 站点上，链路是单向的：只从 vault 的 publish/ 复制出去。

# 把 Obsidian 笔记接到 VitePress

## 做法

1. 笔记在 Obsidian 里写完，先在 10-笔记 里放着；
2. 确认可以公开，再挪进 publish/；
3. 站点项目里跑 npm run publish，脚本会自动转双链、复制附件、补 frontmatter。

这里引用两篇做测试：[附件与图片的发布演示](/posts/2026-11/2026-11-10-attachment-demo)，以及一篇内部笔记 提词器原则。

## 结论

双链在站点上必须是标准 markdown 链接，否则渲染出来全是方括号。
