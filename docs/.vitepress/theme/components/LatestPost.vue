<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../../data/posts.data'

// 首页只展示最近 3 篇，第一张卡片打上「最新」标记
const latest = computed(() => posts.slice(0, 3))
</script>

<template>
  <div class="latest">
    <div v-for="(post, index) in latest" :key="post.url" class="latest-card">
      <div class="latest-head">
        <span v-if="index === 0" class="badge">最新一篇</span>
        <time class="date">{{ post.date }}</time>
        <span v-if="post.aiModel" class="model">{{ post.aiModel }}</span>
      </div>
      <a class="title" :href="withBase(post.url)">{{ post.title }}</a>
      <p class="summary">{{ post.summary }}</p>
      <div class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.latest {
  display: grid;
  gap: 16px;
  margin: 24px 0 8px;
}

.latest-card {
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s;
}

.latest-card:hover {
  border-color: var(--vp-c-brand-1);
}

.latest-head {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.badge {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 12px;
}

.title {
  display: block;
  margin-top: 8px;
  font-size: 17px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.title:hover {
  color: var(--vp-c-brand-1);
}

.summary {
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.tag {
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 12px;
}
</style>
