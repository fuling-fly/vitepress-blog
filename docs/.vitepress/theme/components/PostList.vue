<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../../data/posts.data'
import type { Post } from '../../data/posts.data'

interface Group {
  month: string
  label: string
  items: Post[]
}

// 按月份分组：数据本身已按日期倒序，所以分组顺序天然是新月份在前
const groups = computed<Group[]>(() => {
  const buckets = new Map<string, Post[]>()
  for (const post of posts) {
    const key = post.month || '未分类'
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key)!.push(post)
  }
  return [...buckets.entries()].map(([month, items]) => ({
    month,
    label: month === '未分类' ? month : `${month.slice(0, 4)} 年 ${Number(month.slice(5))} 月`,
    items
  }))
})

const total = computed(() => posts.length)
</script>

<template>
  <div class="post-list">
    <p class="post-count">
      共 {{ total }} 篇 · 按月份归档
    </p>

    <section v-for="group in groups" :key="group.month" class="post-month">
      <h2 :id="group.month" class="month-title">
        {{ group.label }}
        <span class="month-count">{{ group.items.length }} 篇</span>
      </h2>

      <article v-for="post in group.items" :key="post.url" class="post-item">
        <div class="post-meta">
          <time>{{ post.date }}</time>
          <span v-if="post.aiModel" class="post-model">{{ post.aiModel }}</span>
        </div>
        <h3 class="post-title">
          <a :href="withBase(post.url)">{{ post.title }}</a>
        </h3>
        <p class="post-summary">{{ post.summary }}</p>
        <p class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
        </p>
      </article>
    </section>
  </div>
</template>

<style scoped>
.post-count {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin-bottom: 8px;
}

.post-month {
  margin-top: 32px;
}

.month-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 20px;
}

.month-count {
  font-size: 13px;
  font-weight: 400;
  color: var(--vp-c-text-3);
}

.post-item {
  padding: 16px 0;
  border-bottom: 1px dashed var(--vp-c-divider);
}

.post-item:last-child {
  border-bottom: none;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.post-model {
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.post-title {
  margin: 6px 0 4px;
  padding: 0;
  border: none;
  font-size: 17px;
  line-height: 1.5;
}

.post-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.post-title a:hover {
  color: var(--vp-c-brand-1);
}

.post-summary {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.post-tags {
  margin: 8px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 12px;
}
</style>
