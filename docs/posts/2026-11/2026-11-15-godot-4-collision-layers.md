---
title: Godot 4 碰撞层与掩码：32 个层怎么用
date: 2026-11-15
tags:
  - 工具
summary: 碰撞层决定物体在哪，掩码决定它扫描谁。默认都在第 1 层，改了层却忘了掩码，碰撞会静默失效。按官方文档整理位运算、命名和几个常见坑。
aiModel: DeepSeek-V4.1-Flash
draft: false
---

# Godot 4 碰撞层与掩码：32 个层怎么用

## 场景

我在给 Godot 4 项目加敌人和金币，墙、玩家、敌人、金币都挂了碰撞体。层一多，就分不清哪个该碰哪个：玩家要撞墙、要捡金币、要撞敌人，敌人和金币却要互相忽略。翻官方文档时发现，问题基本都出在 `collision_layer` 和 `collision_mask` 这两个属性上。

## 过程

先记住一句话：**Layer 是「我在哪」，Mask 是「我扫谁」**。每个 `CollisionObject2D` 有 32 个层，两个属性默认都是第 1 层。也就是说，只改 Layer 不改 Mask，对象仍然只扫描第 1 层，碰撞会静默失效。

文档给的例子很直观：1 至 4 层分别命名 walls、player、enemies、coins，把每类节点放进自己的层，再按需要勾 Mask。玩家勾 walls、enemies、coins；敌人只勾 walls、player；金币不勾敌人。先在「项目设置 > 层名称 > 2D 物理」里命名，过几天回来还知道第 5 层是什么。

代码里的层是位掩码，不是层号。启用第 1、3、4 层，二进制是 `0b1101`，十六进制是 `0xd`，十进制是 `1 + 4 + 8 = 13`。注意顺序：层 32 是最高位，层 1 是最低位。用 `(1 << (层号 - 1))` 拼更稳，文档示例写成 `(1 << 1 - 1) | (1 << 3 - 1) | (1 << 4 - 1)`。

不想手算就用 `set_collision_mask_value(3, true)` 这类方法逐个开关；要在检查器里导出，用 `@export_flags_2d_physics`。

几个当时没注意、后来返工的坑：

- 在编辑器里缩放 `CollisionShape2D`。检查器里的 Scale 应保持 `(1, 1)`，改大小用尺寸控制柄，不要用 `Node2D` 的缩放。
- `move_and_slide()` 已经包含时间步长，速度向量不能再乘 `delta`；但重力是加速度，仍然要乘 `delta`。
- 刚体要改物理属性，别在 `_physics_process()` 里改，放到 `_integrate_forces(state)` 里。
- 物理默认 60 Hz，和渲染帧率不是一回事，相关代码放 `_physics_process()`，别放 `_process()`。

另外文档开头就提醒：Godot 的物理模拟不是确定性的，同样输入不保证每次结果一致，别把回放或联机同步建立在「物理一定可复现」上。

## 结论

- 先命名层，再配 Layer/Mask；Layer 决定对象在哪，Mask 决定它扫描谁。
- 改层必须同步检查 Mask，否则碰撞会静默失效。
- 位掩码里层 1 是最低位；手算容易错，优先用 `set_collision_*_value()` 或 `@export_flags_2d_physics`。
- 碰撞形状保持 Scale 为 `(1, 1)`；`move_and_slide()` 的速度不要乘 `delta`。
- 这篇只是总览，角色控制器和刚体细节还要看对应文档页。
