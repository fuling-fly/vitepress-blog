---
title: Godot 4 GDScript：文档注释
date: 2026-11-15
tags:
  - 工作流
summary: 转载 Godot 官方文档《GDScript 文档注释》，逐字保留脚本文档、标记与 BBCode 的原文，并注明出处。
draft: false
---

# Godot 4 GDScript：文档注释

> 来源：https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/gdscript_documentation_comments.html（实际抓取地址：https://docs.godotengine.org/zh-cn/stable/tutorials/scripting/gdscript/gdscript_documentation_comments.html）
> 许可：© 版权所有 2014-present Juan Linietsky, Ariel Manzur and the Godot community（CC BY 3.0）。
> 抓取日期：2026-11-15

### GDScript 文档注释

GDScript 文档注释也可以用来为你的代码中的成员提供文档说明。普通注释和文档注释有两点区别，其一：文档注释均以 `##` 开头；其二：文档注释必须写在成员声明之前，亦或写于脚本顶部来为脚本提供基本说明。若使用文档注释注释了导出变量，则可在编辑器中通过悬停窗来查看该导出变量的文档注释。文档注释也可以由编辑器生成为 XML 文档。

#### 为脚本编写文档

使用文档注释编写脚本文档时，必须写于成员声明之前。这里推荐大家将脚本文档分为以下三块编写。

- 脚本类概述。
- 脚本类详细描述。
- 教程与特殊标记——弃用标记/实验性标记。

为了将这些部分区分开来，文档注释采用了一些特殊标记。特殊标记须写于文本行开头（忽略其之前的空格），且需要以 `@` 符号开头，后接标记名。

##### 标记

| 概述 | 无标记，仅位于文档开头部分。 |
| --- | --- |
| 描述 | 无标记，用一行空的文档注释行来与文档概述隔开。 |
| 文字教程 | `@tutorial: https://example.com` `@tutorial(标题写在此处): https://example.com` |
| 已弃用 | `@deprecated` `@deprecated: 请改用 [AnotherClass]。` |
| 实验性 | `@experimental` `@experimental: 该类不稳定` |

例如：

```gdscript
extends Node2D
## A brief description of the class's role and functionality.
##
## The description of the script, what it can do,
## and any further detail.
##
## @tutorial:             https://example.com/tutorial_1
## @tutorial(Tutorial 2): https://example.com/tutorial_2
## @experimental
```

> **警告**
>
> 若标记名和冒号中间存在空格，如 `@tutorial :`，则不会将该标记视为有效标记，该无效标记将会被引擎忽略。

> **备注**
>
> 文档注释若描述超过一行，则改行文档注释文本的末尾空格与下一行文档注释文本的开头空格将会在显示时自动缩合成一个空格，且不会换行。若必须换行，请使用换行符 `[br]`。也可见下方的 BBCode and class reference 。

#### 为脚本类成员编写文档

脚本类成员也可以使用文档注释来生成对应文档说明：

- 信号
- 枚举
- 枚举值
- 常量
- 变量
- 函数
- 内部类

对于脚本类成员，为其编写文档注释时应写在该成员及修饰该成员的注解（若存在注解）之前。在编写脚本类成员的文档注释时也可以进行多行编写，但每行均须以双井号 `##` 开头，以保证这几行的内容均为该成员的文档注释。

##### 标记

| 描述 | 无标记。 |
| --- | --- |
| 已弃用 | `@deprecated` `@deprecated: 请改用 [member another]。` |
| 实验性 | `@experimental` `@experimental: 该方法尚未完善。` |

例如：

```gdscript
## The description of the variable.
## @deprecated: Use [member other_var] instead.
var my_var
```

或者你也可以使用内联的文档注释：

```gdscript
signal my_signal ## My signal.

enum MyEnum { ## My enum.
    VALUE_A = 0, ## Value A.
    VALUE_B = 1, ## Value B.
}

const MY_CONST = 1 ## My constant.

var my_var ## My variable.

func my_func(): ## My func.
    pass

class MyClass: ## My class.
    pass
```

只要脚本内容发生变化，该脚本的类文档便会自动更新。若存在以下划线开头的变量或函数，则该变量/函数就会视为私有变量/私有函数，不会显示在该脚本的脚本类文档当中。

#### 完整脚本示例

```gdscript
extends Node2D
## A brief description of the class's role and functionality.
##
## The description of the script, what it can do,
## and any further detail.
##
## @tutorial:             https://example.com/tutorial_1
## @tutorial(Tutorial 2): https://example.com/tutorial_2
## @experimental

## The description of a signal.
signal my_signal

## This is a description of the below enum.
enum Direction {
    ## Direction up.
    UP = 0,
    ## Direction down.
    DOWN = 1,
    ## Direction left.
    LEFT = 2,
    ## Direction right.
    RIGHT = 3,
}

## The description of a constant.
const GRAVITY = 9.8

## The description of the variable v1.
var v1

## This is a multiline description of the variable v2.[br]
## The type information below will be extracted for the documentation.
var v2: int

## If the member has any annotation, the annotation should
## immediately precede it.
@export
var v3 := some_func()

## As the following function is documented, even though its name starts with
## an underscore, it will appear in the help window.
func _fn(p1: int, p2: String) -> int:
    return 0

# The below function isn't documented and its name starts with an underscore
# so it will treated as private and will not be shown in the help window.
func _internal() -> void:
    pass

## Documenting an inner class.
##
## The same rules apply here. The documentation must
## immediately precede the class definition.
##
## @tutorial: https://example.com/tutorial
## @experimental
class Inner:

    ## Inner class variable v4.
    var v4

    ## Inner class function fn.
    func fn(): pass
```

#### 文档注释标记 `@deprecated` 和 `@experimental`

你可以将一个类或其成员标记为已弃用成员或者实验性成员，标记后，引擎就会在文档查看器里自动添加上对应提示符号。你也可以选择性地提供一条对不再支持该 API 的原因解释。这些对插件和代码库的作者而言无疑是一大福音。

- **已弃用** 标记不推荐的 API，该 API 可能会在未来的主要版本中移除或进行不兼容的更改。保留 API 通常是为了向后兼容。
- **实验性** 标记了一个不稳定的新 API，该 API 可能会在当前主要分支中更改或移除。不建议在生产代码中使用该 API。

> **备注**
>
> 当然，技术上来说，你可以给同一个类/成员同时使用 `@deprecated` and `@experimental` 这两个标记，不过并不推荐这样做，会比较反直觉。

#### BBCode 与类参考

Godot 的类参考支持类似 BBCode 的标签。它们为文本添加了漂亮的格式，也可用于文档中。另请参阅类参考 bbcode。请注意，这与 `RichTextLabel` 的 BBCode 略有不同。

每从其他类里链接一个成员，你都要在成员名前面加上该类的类名。而链接类内成员时，类名可省略。

可用的标记如下：

| 描述 | 示例 | 结果 |
| --- | --- | --- |
| `[Class]` 链接类 | `移动 [Sprite]。` | 移动 Sprite2D。 |
| `[annotation Class.name]` 链接到注解 | `见 [annotation @GDScript.@rpc].` | 见 @GDScript.@rpc。 |
| `[constant Class.name]` 链接到常量 | `见 [constant Color.RED]。` | 见 Color.RED。 |
| `[enum Class.name]` 链接到枚举 | `见 [enum Mesh.ArrayType]。` | 见 Mesh.ArrayType。 |
| `[member Class.name]` 链接到成员（属性） | `获取 [member Node2D.scale]。` | 获取 Node2D.scale. |
| `[method Class.name]` 链接到方法 | `调用 [method Node3D.hide].` | 调用 Node3D.hide()。 |
| `[constructor Class.name]` 链接到内置构造函数 | `使用 [constructor Color.Color].` | 使用 Color.Color。 |
| `[operator Class.name]` 链接到内置运算符 | `使用 [operator Color.operator *].` | 使用 Color.operator *。 |
| `[signal Class.name]` 链接到信号 | `发送 [signal Node.renamed]。` | 发出 Node.renamed。 |
| `[theme_item Class.name]` 链接到主题项 | `见 [theme_item Label.font]。` | 见 Label.font。 |
| `[param name]` 参数名（用作代码） | `用 [param size] 来表示大小。` | 用 `size` 表示大小。 |
| `[br]` 换行 | `第 1 行。[br]` `第 2 行。` | 第 1 行。 第 2 行。 |
| `[lb]` `[rb]` 分别为 `[` 和 `]` | `[lb]b[rb]text[lb]/b[rb]` | [b]text[/b] |
| `[b]` `[/b]` 粗体 | `[b]请勿[/b]调用该方法。` | **请勿**调用该方法。 |
| `[i]` `[/i]` 斜体 | `返回[i]全局[/i]位置。` | 返回*全局*位置。 |
| `[u]` `[/u]` 下划线 | `[u]始终[/u]调用该方法。` | Always use this method. |
| `[s]` `[/s]` 删除线 | `[s]过期信息。[/s]` | Outdated information. |
| `[color]` `[/color]` Color | `[color=red]错误！[/color]` | Error! |
| `[font]` `[/font]` 字体 | `[font=res://mono.ttf]LICENSE[/font]` | LICENSE |
| `[img]` `[/img]` 插入图像 | `[img width=32]res://icon.svg[/img]` | ../../../_images/icon.svg |
| `[url]` `[/url]` 超链接 | `[url]https://example.com[/url]` `[url=https://example.com]网站[/url]` | [https://example.com](https://example.com) [网站](https://example.com) |
| `[center]` `[/center]` 水平居中 | `[center]2 + 2 = 4[/center]` | 2 + 2 = 4 |
| `[kbd]` `[/kbd]` 键盘和鼠标快捷键 | `按下 [kbd]Ctrl + C[/kbd] 组合键。` | 按下 Ctrl + C 组合键。 |
| `[code]` `[/code]` 嵌入式代码片段 | `返回[code]true[/code]。` | 返回 `true`。 |
| `[codeblock]` `[/codeblock]` 多行代码块 | *见下文.* | *见下文.* |

> **备注**
>
> 1. 目前只有 @GDScript 有注解。
> 2. `[kbd]` 与 `[/kbd]` 之间的 BBCode 代码均无效。
> 3. `[code]` 与 `[/code]` 之间的 BBCode 代码均无效。
> 4. `[codeblock]` 与 `[/codeblock]` 之间的 BBCode 代码均无效。

> **警告**
>
> 使用 `[codeblock]`来制作预格式化代码块。在 `[codeblock]` 区域中，请始终使用**四个空格**进行缩进，解析器会删除制表符。

```gdscript
## Do something for this plugin. Before using the method
## you first have to [method initialize] [MyPlugin].[br]
## [color=yellow]Warning:[/color] Always [method clean] after use.[br]
## Usage:
## [codeblock]
## func _ready():
##     the_plugin.initialize()
##     the_plugin.do_something()
##     the_plugin.clean()
## [/codeblock]
func do_something():
    pass
```

`[codeblock]` 默认会高亮 GDScript 语法，用 `lang` 修饰符即可对其语法高亮所用的语言进行修改。目前支持下列语言的高亮：

- `[codeblock lang=text]` 禁用语法高亮;
- `[codeblock lang=gdscript]` 高亮 GDScript 语法;
- `[codeblock lang=csharp]` 高亮 C# 语法（仅.NET版本有效）。
