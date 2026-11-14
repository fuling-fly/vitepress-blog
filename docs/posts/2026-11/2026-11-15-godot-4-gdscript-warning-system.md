---
title: Godot 4 GDScript：警告系统
date: 2026-11-15
tags:
  - 踩坑
summary: 转载 Godot 官方文档《GDScript 警告系统》，完整保留原文的警告配置说明、注解用法与出处，便于随时对照查阅。
draft: false
---

# Godot 4 GDScript：警告系统

> 来源：https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/warning_system.html
> 许可：© 版权所有 2014-present Juan Linietsky, Ariel Manzur and the Godot community（CC BY 3.0）。
> 抓取日期：2026-11-15

## GDScript 警告系统

GDScript 警告系统是对[静态类型](https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/static_typing.html#doc-gdscript-static-typing)的补充（也可以在没有静态类型的情况下工作），可以在开发过程中帮助避免因难以发现的错误而导致运行时错误。

可以在项目设置的 **GDScript** 部分配置警告：

![](https://docs.godotengine.org/zh-cn/4.x/_images/typed_gdscript_warning_system_settings.webp)

> **备注**
>
> 要在侧边栏中看到 GDScript 部分的设置，必须启用 **高级设置** 选项；如果该选项未开启，也可以搜索 "GDScript" 来进行查找。

可以在脚本编辑器的状态栏中找到当前 GDScript 文件的警告列表。下例中有 2 个警告：

![](https://docs.godotengine.org/zh-cn/4.x/_images/typed_gdscript_warning_example.webp)

要忽略一个文件中的特定警告，请使用 [@warning_ignore](https://docs.godotengine.org/zh-cn/4.x/classes/class_%40gdscript.html#class-gdscript-annotation-warning-ignore) 注解。你可以点击警告说明左侧的忽略链接。Godot 将在相应的行上方添加该注解，该代码将不再触发相应的警告：

![](https://docs.godotengine.org/zh-cn/4.x/_images/typed_gdscript_warning_system_ignore.webp)

如果想在文件的某个区域内忽略多个警告，可以使用 [@warning_ignore_start](https://docs.godotengine.org/zh-cn/4.x/classes/class_%40gdscript.html#class-gdscript-annotation-warning-ignore-start) 和 [@warning_ignore_restore](https://docs.godotengine.org/zh-cn/4.x/classes/class_%40gdscript.html#class-gdscript-annotation-warning-ignore-restore) 这两个注解。如果你希望忽略指定的警告类型直到文件末尾，那么可以省略 `@warning_ignore_restore` 。

要忽略的警告名称，与项目设置（Project Settings）里的名称是一一对应的。举个例子，如果你想忽略由 [debug/gdscript/warnings/unused_variable](https://docs.godotengine.org/zh-cn/4.x/classes/class_projectsettings.html#class-projectsettings-property-debug-gdscript-warnings-unused-variable) 这个项目设置所配置的警告，直接在你的代码里使用 `@warning_ignore("unused_variable")` 就行了。当你在这条注释里输入警告名称时，还会弹出一个自动补全的对话框，列出所有可供选择的警告选项。

警告不会阻止游戏的运行，但是你可以根据需要将其转换为错误，此时除非你修复所有警告，否则游戏无法编译。前往项目设置的 `GDScript` 部分打开此选项。这是与前一个示例相同的文件，在启用了 `unused_variable` 警告转成错误这个设置之后：

![](https://docs.godotengine.org/zh-cn/4.x/_images/typed_gdscript_warning_system_errors.webp)
