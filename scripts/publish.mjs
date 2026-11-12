#!/usr/bin/env node
// Obsidian vault -> VitePress 站点 的单向发布脚本。
//
// 用法：
//   node scripts/publish.mjs             # 实际发布
//   node scripts/publish.mjs --dry-run   # 只预览，不写任何文件
//   node scripts/publish.mjs --force     # 覆盖已存在的目标文件（默认跳过）
//   node scripts/publish.mjs --vault <路径>
//
// 只读取 vault 的 publish/ 目录，站点永远不会回写 vault。

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const docsDir = path.join(projectRoot, 'docs')
const postsDir = path.join(docsDir, 'posts')
const assetsOutDir = path.join(docsDir, 'public', 'publish-assets')

// vault 路径的兜底默认值；正常应通过 publish.config.json 配置
const DEFAULT_VAULT = 'H:\\code\\vuepresshopelocalll\\2026-11-12\\knowledge-base'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const force = args.includes('--force')
const vaultArgIndex = args.indexOf('--vault')

/** 读取项目根目录的 publish.config.json */
function readConfigVault() {
  const configPath = path.join(projectRoot, 'publish.config.json')
  if (!fs.existsSync(configPath)) return null
  try {
    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    return parsed.vaultPath ? String(parsed.vaultPath) : null
  } catch (error) {
    console.error(`publish.config.json 解析失败：${error.message}`)
    console.error('请检查该文件是否为合法 JSON，例如 { "vaultPath": "E:\\\\vitepre-base\\\\knowledge-base" }')
    process.exit(1)
  }
}

/** 优先级：--vault > BLOG_VAULT 环境变量 > publish.config.json > 内置默认值 */
function resolveVault() {
  const fromArg = vaultArgIndex !== -1 ? args[vaultArgIndex + 1] : null
  if (fromArg) return { dir: path.resolve(fromArg), from: '--vault 参数' }

  if (process.env.BLOG_VAULT) {
    return { dir: path.resolve(process.env.BLOG_VAULT), from: '环境变量 BLOG_VAULT' }
  }

  const fromConfig = readConfigVault()
  if (fromConfig) return { dir: path.resolve(fromConfig), from: 'publish.config.json' }

  return { dir: path.resolve(DEFAULT_VAULT), from: '脚本内置默认值' }
}

const { dir: vaultDir, from: vaultSource } = resolveVault()
const publishDir = path.join(vaultDir, 'publish')

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.avif'])

// 敏感内容规则：命中任意一条就拒绝整篇发布
const SENSITIVE_RULES = [
  { name: 'OpenAI 风格密钥', re: /\bsk-[A-Za-z0-9_-]{16,}/g },
  { name: 'GitHub token', re: /\b(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/g },
  { name: 'AWS Access Key', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: '私钥文件', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { name: '疑似凭据赋值', re: /\b(api[_-]?key|apikey|secret|token|passwd|password|access[_-]?key)\b\s*[:=]\s*["']?[A-Za-z0-9_\-]{8,}/gi },
  { name: '内网 IP', re: /\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g }
]

function log(msg) {
  console.log(msg)
}

function walk(dir, filter) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full, filter))
    else if (!filter || filter(full)) out.push(full)
  }
  return out
}

/** 极简 frontmatter 解析：只支持 key: value 与 `- ` 列表，够覆盖模板字段 */
function splitFrontmatter(text) {
  const matched = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!matched) return { data: {}, body: text }
  const data = {}
  let currentKey = null
  for (const line of matched[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const listItem = line.match(/^\s+-\s+(.*)$/)
    if (listItem && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = []
      data[currentKey].push(listItem[1].trim())
      continue
    }
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!kv) continue
    currentKey = kv[1]
    const value = kv[2].trim().replace(/^['"]|['"]$/g, '')
    data[currentKey] = value === '' ? [] : value
  }
  return { data, body: text.slice(matched[0].length) }
}

function serializeFrontmatter(data) {
  const lines = ['---']
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      if (value.length === 0) continue
      lines.push(`${key}:`)
      for (const item of value) lines.push(`  - ${item}`)
    } else if (value === '') {
      // 保留空字段（如 summary: ），方便发布后手动补
      lines.push(`${key}: `)
    } else {
      lines.push(`${key}: ${value}`)
    }
  }
  lines.push('---', '')
  return lines.join('\n')
}

/** 转换双链前先把代码块和行内代码摘出来，避免把示例语法当成真的嵌入 */
function protectCode(text) {
  const store = []
  const stash = (segment) => {
    store.push(segment)
    return `\u0000CODE${store.length - 1}\u0000`
  }
  let output = text.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, stash)
  output = output.replace(/`[^`\n]*`/g, stash)
  return {
    text: output,
    restore: (value) => value.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => store[Number(index)])
  }
}

function scanSensitive(text) {
  const hits = []
  for (const rule of SENSITIVE_RULES) {
    rule.re.lastIndex = 0
    const found = text.match(rule.re)
    if (found) hits.push(`${rule.name}（${found[0].slice(0, 40)}）`)
  }
  return hits
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function resolveDate(frontmatterDate, file) {
  if (frontmatterDate) {
    const parsed = new Date(String(frontmatterDate))
    if (!Number.isNaN(parsed.getTime())) return formatDate(parsed)
  }
  const fromName = path.basename(file).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (fromName) return `${fromName[1]}-${fromName[2]}-${fromName[3]}`
  return formatDate(fs.statSync(file).mtime)
}

function resolveTitle(frontmatterTitle, body, file) {
  if (frontmatterTitle) return String(frontmatterTitle)
  const h1 = body.match(/^#\s+(.+)$/m)
  if (h1) return h1[1].trim()
  return path.basename(file, '.md').replace(/^\d{4}-\d{2}-\d{2}-?/, '')
}

function resolveSlug(file, title, date) {
  const base = path.basename(file, '.md')
  const withoutDate = base.replace(/^\d{4}-\d{2}-\d{2}-?/, '')
  if (withoutDate) return withoutDate
  // 文件名里没有日期时，用标题兜底
  const slug = title
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || date
}

/** 解析 vault 内所有 md，供双链查找使用 */
function buildNoteIndex() {
  const index = new Map()
  const add = (file) => {
    const rel = path.relative(vaultDir, file).replace(/\\/g, '/')
    index.set(rel.replace(/\.md$/i, ''), file)
    index.set(path.basename(rel, '.md'), file)
  }
  // 先索引非 publish，再用 publish 覆盖，保证同名时优先发布目录
  walk(vaultDir, (f) => f.toLowerCase().endsWith('.md') && !path.relative(vaultDir, f).startsWith('publish'))
    .forEach(add)
  walk(publishDir, (f) => f.toLowerCase().endsWith('.md')).forEach(add)
  return index
}

function buildAssetIndex() {
  const index = new Map()
  const files = walk(publishDir, (f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
  for (const file of files) {
    const name = path.basename(file)
    if (!index.has(name)) index.set(name, [])
    index.get(name).push(file)
  }
  return index
}

function isInsidePublish(file) {
  return path.relative(publishDir, file).split(path.sep)[0] !== '..'
}

function main() {
  if (!fs.existsSync(vaultDir)) {
    console.error(`找不到 vault 目录：${vaultDir}`)
    console.error(`路径来源：${vaultSource}`)
    if (vaultSource === 'publish.config.json') {
      console.error('请检查 publish.config.json 的 vaultPath 是否正确（例如搬迁后忘了改这一行）')
    } else {
      console.error('请检查 --vault 参数、环境变量 BLOG_VAULT，或 publish.config.json 的 vaultPath')
    }
    process.exit(1)
  }

  if (!fs.existsSync(publishDir)) {
    console.error(`vault 存在，但缺少 publish 目录：${publishDir}`)
    console.error('请确认该路径确实是 Obsidian vault，且其中包含 publish/ 子目录')
    process.exit(1)
  }

  log(`vault:  ${vaultDir}`)
  log(`来源:   ${vaultSource}`)
  log(`模式:   ${dryRun ? 'dry-run（不写文件）' : '正式发布'}${force ? '，覆盖已有文件' : '，已存在则跳过'}`)
  log('')

  const noteIndex = buildNoteIndex()
  const assetIndex = buildAssetIndex()
  const noteFiles = walk(publishDir, (f) => f.toLowerCase().endsWith('.md')).sort()

  const planned = []
  const rejected = []
  const skipped = []
  const attachmentsToCopy = new Map()

  // 第一遍：确定每篇的输出路径，供双链解析
  const outOf = new Map()
  for (const file of noteFiles) {
    const raw = fs.readFileSync(file, 'utf-8')
    const { data, body } = splitFrontmatter(raw)
    const date = resolveDate(data.date, file)
    const title = resolveTitle(data.title, body, file)
    const slug = resolveSlug(file, title, date)
    const outPath = path.join(postsDir, date.slice(0, 7), `${date}-${slug}.md`)
    outOf.set(file, { date, title, slug, outPath, url: `/posts/${date.slice(0, 7)}/${date}-${slug}` })
  }

  for (const file of noteFiles) {
    const raw = fs.readFileSync(file, 'utf-8')
    const relVault = path.relative(vaultDir, file).replace(/\\/g, '/')
    const hits = scanSensitive(raw)
    if (hits.length > 0) {
      rejected.push({ file: relVault, reasons: hits })
      continue
    }

    const { data, body } = splitFrontmatter(raw)
    if (data.draft === 'true' || data.draft === true) {
      skipped.push({ file: relVault, reason: 'frontmatter 标记 draft: true' })
      continue
    }

    const target = outOf.get(file)

    // 双链与附件转换（先摘出代码块与行内代码，避免把示例语法当成真实链接）
    const guarded = protectCode(body)
    let markdown = guarded.text

    // ![[图片]] -> ![alt](/publish-assets/xxx)
    markdown = markdown.replace(/!\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g, (whole, name, alt) => {
      const cleanName = name.trim()
      const candidates = assetIndex.get(path.basename(cleanName)) || []
      if (candidates.length === 0) {
        log(`  ! 附件未找到，保留原样：${relVault} -> ${cleanName}`)
        return whole
      }
      const source = candidates[0]
      const fileName = path.basename(source)
      attachmentsToCopy.set(fileName, source)
      return `![${alt ? alt.trim() : fileName}](/publish-assets/${fileName})`
    })

    // [[笔记]] / [[笔记|别名]] -> [文本](相对路径)
    markdown = markdown.replace(/\[\[([^\]|#]+)(?:#([^\]|]*))?(?:\|([^\]]*))?\]\]/g, (whole, name, heading, alias) => {
      const cleanName = name.trim()
      const resolved = noteIndex.get(cleanName) || noteIndex.get(path.basename(cleanName, '.md'))
      const text = alias ? alias.trim() : cleanName.replace(/\.md$/i, '')

      if (!resolved || !isInsidePublish(resolved)) {
        // 目标不在 publish/：绝不外链，也绝不复制内容，降级成纯文本
        log(`  ! 双链目标不在 publish/，降级为纯文本：${relVault} -> [[${cleanName}]]`)
        return text
      }
      const targetOut = outOf.get(resolved)
      if (!targetOut) return text
      const anchor = heading ? `#${heading.trim().replace(/\s+/g, '-')}` : ''
      return `[${text}](${targetOut.url}${anchor})`
    })

    // 还原代码块与行内代码
    markdown = guarded.restore(markdown)

    const title = data.title || target.title
    const frontmatter = {
      title,
      date: target.date,
      tags: Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : ['思考'],
      summary: data.summary || '',
      ...(data.aiModel ? { aiModel: data.aiModel } : {}),
      draft: false
    }
    if (!frontmatter.summary) {
      log(`  ! 缺少 summary，已置空待补：${relVault}`)
    }

    const content = serializeFrontmatter(frontmatter) + markdown
    const exists = fs.existsSync(target.outPath)
    const action = exists ? (force ? '覆盖' : '跳过') : '新增'

    planned.push({ file: relVault, out: path.relative(projectRoot, target.outPath), action, content, exists })
  }

  for (const item of planned) {
    if (item.action === '跳过') {
      log(`  - 跳过（已存在）：${item.out}`)
      continue
    }
    log(`  + ${item.action}：${item.out}`)
    if (dryRun) continue
    fs.mkdirSync(path.dirname(item.out), { recursive: true })
    fs.writeFileSync(item.out, item.content, 'utf-8')
  }

  // 复制附件（仅 publish/ 内）
  for (const [fileName, source] of attachmentsToCopy) {
    const dest = path.join(assetsOutDir, fileName)
    log(`  ${dryRun ? '·' : '+'} 附件：${path.relative(vaultDir, source).replace(/\\/g, '/')} -> docs/public/publish-assets/${fileName}`)
    if (dryRun) continue
    fs.mkdirSync(assetsOutDir, { recursive: true })
    const sameContent =
      fs.existsSync(dest) &&
      crypto.createHash('md5').update(fs.readFileSync(dest)).digest('hex') ===
        crypto.createHash('md5').update(fs.readFileSync(source)).digest('hex')
    if (!sameContent) fs.copyFileSync(source, dest)
  }

  log('')
  if (rejected.length > 0) {
    log('已拒绝（含敏感内容，未写入站点）：')
    for (const item of rejected) {
      log(`  x ${item.file}`)
      for (const reason of item.reasons) log(`      - ${reason}`)
    }
    log('')
  }
  if (skipped.length > 0) {
    log('未发布（草稿）：')
    for (const item of skipped) log(`  - ${item.file}：${item.reason}`)
    log('')
  }

  const written = planned.filter((p) => p.action !== '跳过').length
  log(`合计：发布 ${written} 篇，跳过 ${planned.length - written} 篇，拒绝 ${rejected.length} 篇，附件 ${attachmentsToCopy.size} 个`)
  if (dryRun) log('（dry-run，未写入任何文件）')

  // 有文件被拒绝时返回非 0，方便在 CI / 编辑器里立刻发现
  if (rejected.length > 0) process.exit(1)
}

main()
