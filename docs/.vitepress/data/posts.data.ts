// 构建期扫描 docs/posts 下所有文章，输出按日期倒序的列表。
// 归档页与首页「最新一篇」都复用这份数据，新增文章无需手工登记。
import { createContentLoader } from 'vitepress'

export interface Post {
  url: string
  title: string
  date: string
  month: string
  tags: string[]
  summary: string
  aiModel?: string
}

declare const data: Post[]
export { data }

export default createContentLoader('posts/**/*.md', {
  transform(raw): Post[] {
    return raw
      // 排除归档页本身
      .filter((page) => !/\/posts\/(index\.html)?$/.test(page.url))
      // 带 draft: true 的文章不进归档
      .filter((page) => page.frontmatter.draft !== true)
      .map((page) => {
        const date = new Date(page.frontmatter.date)
        const iso = Number.isNaN(date.getTime())
          ? ''
          : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

        return {
          url: page.url,
          title: page.frontmatter.title ?? page.url,
          date: iso,
          month: iso.slice(0, 7),
          tags: page.frontmatter.tags ?? [],
          summary: page.frontmatter.summary ?? '',
          aiModel: page.frontmatter.aiModel
        }
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }
})
