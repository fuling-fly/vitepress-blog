// 自定义主题入口：继承默认主题，注册归档/最新文章两个全局组件。
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PostList from './components/PostList.vue'
import LatestPost from './components/LatestPost.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册成全局组件后，Markdown 里直接写 <PostList /> 即可
    app.component('PostList', PostList)
    app.component('LatestPost', LatestPost)
  }
} satisfies Theme
