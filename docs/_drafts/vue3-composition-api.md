---
title: 【草稿示例】Vue 3 组合式 API 笔记
date: 2026-11-08
tags:
  - 工具
summary: 从公开文章迁到草稿目录的技术笔记，保留下来当写作素材。
draft: true
---

# Vue 3 组合式 API 笔记（草稿示例）

`ref` 适合基本类型，读取时要 `.value`；`reactive` 适合对象。

```ts
import { ref, reactive, computed } from 'vue'

const count = ref(0)
const state = reactive({ name: '浮灵', posts: 3 })
const summary = computed(() => `${state.name} 一共写了 ${state.posts} 篇文章`)
```

## 生命周期对照

| 选项式 | 组合式 |
| --- | --- |
| `mounted` | `onMounted` |
| `unmounted` | `onUnmounted` |

## 什么时候抽 composable

一个状态组合被第二个组件复用时，抽成 `useXxx()`。
