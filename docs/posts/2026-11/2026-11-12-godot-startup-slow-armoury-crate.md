---
title: Godot 启动慢40秒：Armoury 服务
date: 2026-11-12
tags:
  - 工具
  - 踩坑
summary: Godot 启动卡 40 秒，CPU 和磁盘却都闲着；靠对照计时和 --verbose 日志，定位到 Armoury Crate 服务与 NVAPI 互锁。
aiModel: DeepSeek-V4.1-Flash
draft: false
---

# Godot 启动慢40秒：Armoury 服务

双击 Godot 编辑器，窗口白屏、标题栏「未响应」，要等三四十秒才进项目管理器。重装、删缓存、换渲染驱动都试过没用，最后发现问题根本不在 Godot。

## 场景

Godot 4.7.1 mono 版，Windows 11，RTX 3080 + 驱动 616.92，项目放在 NVMe 盘上，一个项目才 10~26 MB，`.godot` 缓存只有 3~11 MB。

两个最直觉的怀疑先被排掉了：项目太大导致导入慢（缓存才几 MB），硬盘慢（实测连续读 650 MB/s）。

## 过程

### 先量，再说慢

用一段脚本只测「从启动到窗口真正出现」的时间，连跑四次：

```powershell
$exe = "H:\godot47C\Godot_v4.7.1-stable_mono_win64\Godot_v4.7.1-stable_mono_win64.exe"
$sw  = [Diagnostics.Stopwatch]::StartNew()
$p   = Start-Process -FilePath $exe -PassThru
while ($sw.Elapsed.TotalSeconds -lt 75) {
    Start-Sleep -Milliseconds 200
    $p.Refresh()
    if ($p.MainWindowHandle -ne 0 -and $p.MainWindowTitle -ne "") { break }
}
"窗口出现耗时: {0:N2}s" -f $sw.Elapsed.TotalSeconds
```

结果很诡异：`43.50s / 1.30s / 43.66s / 1.29s`，**慢、快、慢、快**严格交替。这说明不是机器不够快，而是某个状态被反复切换。

### 卡住时到底在等什么

启动过程中持续采样进程状态，四项指标指向同一个方向：

| 指标 | 观测结果 | 含义 |
| --- | --- | --- |
| CPU 时间 | 全程约 1.0 秒 | 没在做计算 |
| 磁盘读操作 | 几乎不增长 | 不是 I/O 瓶颈 |
| TCP 连接 | 0 条 | 不是网络超时 |
| 主线程等待状态 | `Wait / Executive` | 卡在内核对象或驱动调用上 |

再用 `--verbose` 启动，日志的空白处直接给出了答案：

```text
0.55s  NVAPI: Init OK!
3.79s  NVAPI: Error saving settings: NVAPI_ACCESS_DENIED(code -175)
4.50s  EditorTheme: Generating new styles.
46.78s Loaded system CA certificates
```

中间空了 42 秒，全落在「窗口和显示初始化」这一段；而 **NVAPI 返回 ACCESS_DENIED** 说明显卡驱动接口没正常回包。NVAPI 是 NVIDIA 的官方接口，嫌疑基本锁定在显卡驱动栈。

顺手排掉的几个干扰项：`--tablet-driver dummy`、`--accessibility-driver dummy` 都没有改善；系统证书库枚举只要 4 ms；Defender 实时防护本来就是关的。

### 环境里多了什么

列进程时答案浮出来：`ArmouryCrateService`、`asus_framework` ×7、`LightingService`、`AsusFanControlService`、`ROG Live Service`，另外还有 Razer Synapse、Logitech G HUB 和 NVIDIA Overlay。

搜同样的症状，命中一条帖子：Godot 4.5.1 在同一位置（`NVAPI: Disabled G-SYNC for windowed mode`）固定卡 30 秒，发帖人最后发现关掉 Armoury Crate Service 就好了。

### 根因

Armoury Crate 服务会持续插手显卡模式和显示配置（GPU 模式切换、AURA、风扇曲线），而 Godot 启动时要通过 NVAPI 关掉窗口模式的 G-SYNC、关掉 OpenGL 线程优化。两边争用同一套显示状态，Godot 的 NVAPI 调用拿不到结果，主线程就在内核对象上死等，直到驱动超时——表现出来的就是「未响应 40 秒」。

### 顺手把这次排查落成笔记

排查完顺手要把过程写成可发布的笔记，没手写 frontmatter，而是走仓库里的流水线：

```powershell
npm run note:new -- --template "...\_模板\发布模板.md" --from <成稿.md>
```

第一次直接被打回，两处不合规：

```text
x 非法标签：排查；只能取 提示词 / 工作流 / 工具 / 踩坑 / 思考。
! 标题长度 35 字，建议 12–24 字。
```

把标签换成 `踩坑`、标题压到 23 字后通过，落点是 `publish/2026-11-12-godot-startup-slow-armoury-crate.md`。站点文章由 `npm run publish` 从 vault 生成，不直接写 `docs/posts/`，正文只留一份。

这两个报错挺说明问题：拦下来的都不是内容，而是「标题写太长」「标签自己发明一个」这种作者注意不到的细节，模板当契约确实比在提示词里反复叮嘱靠谱。

## 结论

修复只要停一个服务，先验证再长期禁用：

```bat
:: 只停这一次，验证用
sc.exe stop ArmouryCrateService

:: 确认有效后，保留程序但不自动启动
sc.exe config ArmouryCrateService start= disabled

:: 需要风扇、灯效控制时恢复
sc.exe config ArmouryCrateService start= auto
sc.exe start  ArmouryCrateService
```

几点经验：

- **先量化再归因**：43 秒和 1.3 秒的对照数据，比「感觉很慢」有用得多；
- **看等待状态，不看 CPU**：CPU 不涨、磁盘不读、没有网络连接，就该往驱动和内核等待上想；
- **`--verbose` 的空白处就是答案**：两条日志之间空了 42 秒，缺口本身比日志内容更有信息量；
- **同类症状优先搜社区**：Godot 官方文档和论坛早把这个坑写清楚了，能省掉大半时间。

如果停服务后还慢，按这个顺序继续：把 Godot 和项目目录加进 360 主动防御的信任区 → 关掉 NVIDIA Overlay 叠加 → 逐个退出 G HUB / Razer Synapse 等外设软件（Godot 官方记录过「特定 USB 外设导致启动极慢」的已知问题，issue #20566）→ 最后用 `msconfig` 隐藏微软服务后全部禁用，再逐个开回来定位。
