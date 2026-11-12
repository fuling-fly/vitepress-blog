# 发布流程：Obsidian vault → VitePress 站点

单向链路：**只从 vault 的 `publish/` 读取**，站点永远不往 vault 写。

- vault 路径：`H:\code\vuepresshopelocalll\2026-11-12\knowledge-base`
  （环境策略禁止写入仓库外路径，故放在工作区内；父仓库 `.gitignore` 已排除整个目录）
- 站点仓库：`H:\code\vuepresshopelocalll\2026-11-12\vitepress-blog`
- 脚本：`scripts/publish.mjs`

## 1. 在 Obsidian 里写到什么程度

| 阶段 | 目录 | 说明 |
| --- | --- | --- |
| 随手记 | `00-收件箱/` | 想到什么写什么，不用管格式 |
| 整理 | `10-笔记/` | 一条笔记一个主题，补标题和结论 |
| 日记 | `20-日记/YYYY-MM-DD.md` | 用 `_模板/日记模板.md`，Daily notes 已指向它 |
| 发布 | `publish/` | **整理完、确认可公开**才挪进来 |
| 过期 | `90-归档/` | 不再维护但想留着 |

判断标准很简单：**这篇内容如果出现在公开互联网上，你能接受吗？**不能，就别进 `publish/`。

## 2. 什么时候挪进 `publish/`

同时满足三条才挪：

1. 有明确结论，不是半截思考；
2. 双链指向的笔记**也在** `publish/` 里（否则会被降级成纯文本）；
3. 跑一遍下面的敏感自查，确认没有凭据、内网信息、他人隐私。

## 3. 跑脚本

```powershell
cd H:\code\vuepresshopelocalll\2026-11-12\vitepress-blog

npm run publish:dry     # 预览：只列出会发布什么，不写任何文件
npm run publish         # 实际发布：写入 docs/posts/YYYY-MM/、复制附件
```

可选参数（直接调 node）：

```powershell
node scripts/publish.mjs --dry-run
node scripts/publish.mjs --force          # 覆盖已存在的目标文件
node scripts/publish.mjs --vault "D:\其他\vault"
```

### 脚本做了什么

| 环节 | 行为 |
| --- | --- |
| 扫描范围 | 仅 `publish/**/*.md` 与 `publish/` 内的图片附件；其他目录一律不读 |
| 双链 | `[[笔记]]` → `[笔记](/posts/YYYY-MM/YYYY-MM-DD-slug)`；`[[笔记|别名]]` → `[别名](...)`；目标不在 `publish/` 时**降级为纯文本**并打印警告 |
| 嵌入图片 | `![[图.png]]` → `![图.png](/publish-assets/图.png)`，文件复制到 `docs/public/publish-assets/` |
| 代码块保护 | 代码块与行内代码里的 `[[...]]` 原样保留，不会被误转 |
| 默认 frontmatter | `title`：frontmatter → H1 → 文件名；`date`：frontmatter → 文件名日期 → 文件 mtime；`tags`：缺省 `思考`；`summary`：缺省留空并警告；`draft`：缺省 `false` |
| 目标路径 | `docs/posts/YYYY-MM/YYYY-MM-DD-slug.md`，slug 取文件名去掉日期前缀 |
| 已存在 | **默认跳过**，加 `--force` 才覆盖 |
| 敏感扫描 | 命中 API key / token / 私钥 / 内网 IP / `password=` 等模式时**拒绝该文件**，列出命中原因，不写入任何内容，脚本退出码 1 |
| 附件冲突 | 同名附件以 `publish/` 里的最新内容为准（内容相同则不重复写入） |

敏感规则（`scripts/publish.mjs` 顶部 `SENSITIVE_RULES`）：`sk-xxxx`、`ghp_`/`github_pat_`、`AKIA...`、`BEGIN ... PRIVATE KEY`、`apiKey/token/password/secret...=值`、`10.x` / `192.168.x` / `172.16-31.x` 内网地址。

> 扫描是兜底，不是免责。误报时不要绕过脚本，先确认内容，或者把该笔记留在 `10-笔记/`。

## 4. 构建与部署

```powershell
npm run docs:build      # 产物 docs/.vitepress/dist
npm run docs:dev        # 本地预览 http://localhost:5173/vitepress-blog/
```

推送 `main` 分支后，GitHub Actions（`.github/workflows/deploy.yml`）会自动构建并发布到
<https://fuling-fly.github.io/vitepress-blog/>。

## 5. 绝对不能放 `publish/` 的内容

- API key、access token、私钥、`.env` 内容、数据库连接串；
- 内网 IP、内网域名、服务器账号、堡垒机地址；
- 他人隐私：聊天记录、真实姓名与联系方式、客户数据；
- 未公开的商业信息：合同、报价、未发布产品细节；
- 有版权的原文摘录（只写自己的话）。

## 6. 常见问题

| 现象 | 原因 / 处理 |
| --- | --- |
| 日志出现「双链目标不在 publish/，降级为纯文本」 | 正常保护行为；需要链接就把目标笔记也挪进 `publish/` |
| 日志出现「附件未找到，保留原样」 | 附件不在 `publish/` 内；把图片放入 `publish/assets/` |
| 日志出现「缺少 summary」 | 已置空，补上 60 字摘要后可读性更好 |
| 脚本退出码 1 | 有文件被敏感规则拒绝，看日志里的文件名与命中原因 |
| 改了 vault 但站点没变 | 先 `npm run publish`，再 `npm run docs:dev` 或在构建后再推送 |
| 想换 vault 位置 | `--vault <路径>` 或环境变量 `OBSIDIAN_VAULT` |
