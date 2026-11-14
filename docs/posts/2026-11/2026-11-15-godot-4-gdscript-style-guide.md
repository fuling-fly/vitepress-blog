---
title: Godot 4 GDScript：编写风格指南
date: 2026-11-15
tags:
  - 工作流
summary: 转载 Godot 官方文档《GDScript 编写风格指南》，完整保留原文的规范条目、代码示例与出处，便于随时对照查阅。
draft: false
---

# Godot 4 GDScript：编写风格指南

> 来源：https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/gdscript_styleguide.html
> 许可：© 版权所有 2014-present Juan Linietsky, Ariel Manzur and the Godot community（CC BY 3.0）。
> 抓取日期：2026-11-15

## GDScript 编写风格指南

本编写风格指南列出了几条规定，能够让用户将 GDScript 代码编写得更加优雅。本指南旨在让用户编写更为整洁、可读的代码，促进项目、讨论和教程之间的一致性。本教程也希望能够因此鼓励开发者们能够开发出来代码自动格式化工具。

由于 GDScript 与 Python 非常接近，因此本指南的灵感来自 Python 的 [PEP 8](https://www.python.org/dev/peps/pep-0008/) 编程风格指南。

风格指南并不是硬性的规则教条，有些情况下，你可能无法施行下面的一些规范。如果这种情况发生在你身上，最好自行进行选择，并询问其他开发人员的见解。

一般来说，在项目和团队中保持代码风格的一致性，比一板一眼地遵循本指南更为重要。

> **备注**
>
> Godot的内置脚本编辑器默认使用了很多这些规范，那么就让这内置脚本编辑器来帮助你吧。

下面是基于这些规范的完整的类的示例：

```gdscript
class_name StateMachine
extends Node
## Hierarchical State machine for the player.
##
## Initializes states and delegates engine callbacks ([method Node._physics_process],
## [method Node._unhandled_input]) to the state.

signal state_changed(previous, new)

@export var initial_state: Node
var is_active = true:
    set = set_is_active

@onready var _state = initial_state:
    set = set_state
@onready var _state_name = _state.name

func _init():
    add_to_group("state_machine")

func _enter_tree():
    print("this happens before the ready method!")

func _ready():
    state_changed.connect(_on_state_changed)
    _state.enter()

func _unhandled_input(event):
    _state.unhandled_input(event)

func _physics_process(delta):
    _state.physics_process(delta)

func transition_to(target_state_path, msg={}):
    if not has_node(target_state_path):
        return

    var target_state = get_node(target_state_path)
    assert(target_state.is_composite == false)

    _state.exit()
    self._state = target_state
    _state.enter(msg)
    Events.player_state_changed.emit(_state.name)

func set_is_active(value):
    is_active = value
    set_physics_process(value)
    set_process_unhandled_input(value)
    set_block_signals(not value)

func set_state(value):
    _state = value
    _state_name = _state.name

func _on_state_changed(previous, new):
    print("state changed")
    state_changed.emit()

class State:
    var foo = 0

    func _init():
        print("Hello!")
```

### 格式

#### 编码与特殊字符

- 使用换行符（**LF**）换行，而非 CRLF 或 CR。*（编辑器默认）*
- 在每个文件的末尾使用一个换行符。*（编辑器默认）*
- 使用不带[字节顺序标记](https://zh.wikipedia.org/zh-cn/%E4%BD%8D%E5%85%83%E7%B5%84%E9%A0%86%E5%BA%8F%E8%A8%98%E8%99%9F)的 **UTF-8** 编码。*（编辑器默认）*
- 使用**制表符**代替空格进行缩进。*（编辑器默认）*

#### 缩进

每个缩进的缩进级别必须大于包含该缩进的代码块的缩进级别。

**规范示例** :

```gdscript
for i in range(10):
    print("hello")
```

**不规范示例** :

```gdscript
for i in range(10):
  print("hello")

for i in range(10):
        print("hello")
```

使用2个缩进级别来区分续行代码块与常规代码块。

**规范示例** :

```gdscript
effect.interpolate_property(sprite, "transform/scale",
        sprite.get_scale(), Vector2(2.0, 2.0), 0.3,
        Tween.TRANS_QUAD, Tween.EASE_OUT)
```

**不规范示例** :

```gdscript
effect.interpolate_property(sprite, "transform/scale",
    sprite.get_scale(), Vector2(2.0, 2.0), 0.3,
    Tween.TRANS_QUAD, Tween.EASE_OUT)
```

此规则的例外：数组、字典和枚举。使用单个缩进级别来区分续行代码块：

**规范示例** :

```gdscript
var party = [
    "Godot",
    "Godette",
    "Steve",
]

var character_dict = {
    "Name": "Bob",
    "Age": 27,
    "Job": "Mechanic",
}

enum Tile {
    BRICK,
    FLOOR,
    SPIKE,
    TELEPORT,
}
```

**不规范示例** :

```gdscript
var party = [
        "Godot",
        "Godette",
        "Steve",
]

var character_dict = {
        "Name": "Bob",
        "Age": 27,
        "Job": "Mechanic",
}

enum Tile {
        BRICK,
        FLOOR,
        SPIKE,
        TELEPORT,
}
```

#### 行尾逗号

请在数组、字典和枚举的最后一行使用逗号，这样，在添加新元素时就不需要修改最后一行了，既能让版本控制中的重构更容易，也会让 Diff 也更美观。

**规范示例** :

```gdscript
var array = [
    1,
    2,
    3,
]
```

**不规范示例** :

```gdscript
var array = [
    1,
    2,
    3
]
```

单行列表中不需要行尾逗号，故在此情况下不要添加逗号。

**规范示例** :

```gdscript
var array = [1, 2, 3]
```

**不规范示例** :

```gdscript
var array = [1, 2, 3,]
```

#### 空白行

用两个空行来包围函数和类定义：

```gdscript
func heal(amount):
    health += amount
    health = min(health, max_health)
    health_changed.emit(health)

func take_damage(amount, effect=null):
    health -= amount
    health = max(0, health)
    health_changed.emit(health)
```

函数内部使用一个空行来分隔每个逻辑片段。

> **备注**
>
> 在类参考和本文档的短代码片段中，我们会在类和函数定义之间使用单个空行。

#### 行的长度

把每行代码控制在100个字符以内。

如果可以的话，尽量把行控制在80个字符以下，既有助于在小屏幕上阅读代码，也有利于在外部文本编辑器中并排打开两个脚本。例如，在查看差异修订时。

#### 一条语句一行

要避免将多个语句放在一行当中，包括条件语句，以遵守 GDScript 的可读性风格指南。

**规范示例** :

```gdscript
if position.x > width:
    position.x = 0

if flag:
    print("flagged")
```

**不规范示例** :

```gdscript
if position.x > width: position.x = 0

if flag: print("flagged")
```

该规则的唯一例外便是三元运算符：

```gdscript
next_state = "idle" if is_on_floor() else "fall"
```

#### 对多行语句进行排版以提高可读性

如果你的 `if` 语句特别长，亦或如果一条语句是嵌套的三元表达式，把它们拆分成多行可以提高可读性。由于这几行连续的代码仍属于同一个表达式，故应该缩进两级而非一级。

GDScript 允许使用括号或反斜杠将语句拆成多行，本指南倾向于使用括号，重构起来更简单。使用反斜杠的话，必须保证最后一行的末尾没有反斜杠；而如果是括号，则不必担心最后一行的反斜杠问题。

把条件表达式拆分成多行时，`and` 和 `or` 关键字应当放在下一行的开头，而非上一行的结尾。

**规范示例** :

```gdscript
var angle_degrees = 135
var quadrant = (
        "northeast" if angle_degrees <= 90
        else "southeast" if angle_degrees <= 180
        else "southwest" if angle_degrees <= 270
        else "northwest"
)

var position = Vector2(250, 350)
if (
        position.x > 200 and position.x < 400
        and position.y > 300 and position.y < 400
):
    pass
```

**不规范示例** :

```gdscript
var angle_degrees = 135
var quadrant = "northeast" if angle_degrees <= 90 else "southeast" if angle_degrees <= 180 else "southwest" if angle_degrees <= 270 else "northwest"

var position = Vector2(250, 350)
if position.x > 200 and position.x < 400 and position.y > 300 and position.y < 400:
    pass
```

#### 避免冗余的圆括号

避免在表达式和条件语句中使用括号，除非需要修改操作顺序或者将语句拆分多行编写，否则只会降低可读性。

**规范示例** :

```gdscript
if is_colliding():
    queue_free()
```

**不规范示例** :

```gdscript
if (is_colliding()):
    queue_free()
```

#### 布尔运算

推荐使用英文布尔运算符，简单易懂：

- 用 `and` 代替 `&&`。
- 用 `or` 代替 `||`。
- 用 `not` 代替 `!`。

也可以在布尔运算符周围使用括号来消除歧义，这样还可以使长表达式更有可读性。

**规范示例** :

```gdscript
if (foo and bar) or not baz:
    print("condition is true")
```

**不规范示例** :

```gdscript
if foo && bar || !baz:
    print("condition is true")
```

#### 注释间距

普通注释（ `#` ）与文档注释（ `##` ）均应与注释正文保持一个空格的距离，而被注释掉的代码开头则不需要空格间隙。需要注意：代码区域注释（ `#region` / `#endregion` ）为保持其作用需要，不可以在井号后使用空格。

普通注释开头应该留一个空格，但如果是为了停用代码而将其注释掉则不需要留，以此区分文本注释和停用的代码。

**规范示例** :

```gdscript
# This is a comment.
#print("This is disabled code")
```

**不规范示例** :

```gdscript
#This is a comment.
# print("This is disabled code")
```

> **备注**
>
> 在脚本编辑器中，要切换已注释的选定代码，请按 Ctrl + K。此功能会在选定行的开头添加/删除一个 `#` 注释符号。

最好把注释单独写在一行里，而不是写成行内注释（也就是把注释和代码挤在同一行）。行内注释最适合用来写那种非常简短的说明，通常顶多也就几个字：

**规范示例** :

```gdscript
# This is a long comment that would make the line below too long if written inline.
print("Example") # Short comment.
```

**不规范示例** :

```gdscript
print("Example") # This is a long comment that would make this line too long if written inline.
```

#### 空格

保持在运算符前后以及逗号之后用一个空格隔开的习惯。同时，避免在字典引用和函数调用中使用多余的空格。对于单行字典声明，在左大括号之后、右大括号之前应该添加一个空格，这是上述规范的例外情况，这样做可以使字典在视觉上更容易与数组区分，因为大多数字体中，`[]` 字符看起来与 `{}` 非常相似。

**规范示例** :

```gdscript
position.x = 5
position.y = target_position.y + 10
dict["key"] = 5
my_array = [4, 5, 6]
my_dictionary = { key = "value" }
print("foo")
```

**不规范示例** :

```gdscript
position.x=5
position.y = mpos.y+10
dict ["key"] = 5
myarray = [4,5,6]
my_dictionary = {key = "value"}
print ("foo")
```

不要用空格去垂直对齐表达式：

```gdscript
x        = 100
y        = 100
velocity = 500
```

#### 引号

尽量使用双引号，除非单引号可以让字符串中需要转义的字符变少。见如下示例：

```gdscript
# Normal string.
print("hello world")

# Use double quotes as usual to avoid escapes.
print("hello 'world'")

# Use single quotes as an exception to the rule to avoid escapes.
print('hello "world"')

# Both quote styles would require 2 escapes; prefer double quotes if it's a tie.
print("'hello' \"world\"")
```

#### 数字

不要忽略浮点数中的前导和后缀零，否则会降低这些数字的可读性，很难一眼与整数区分开。

**规范示例** :

```gdscript
var float_number = 0.234
var other_float_number = 13.0
```

**不规范示例** :

```gdscript
var float_number = .234
var other_float_number = 13.
```

对于十六进制数字，请使用小写字母。小写字母较矮，使数字更易读。

**规范示例** :

```gdscript
var hex_number = 0xfb8c0b
```

**不规范示例** :

```gdscript
var hex_number = 0xFB8C0B
```

利用 GDScript 的文字下划线，让大数字更易读。

**规范示例** :

```gdscript
var large_number = 1_234_567_890
var large_hex_number = 0xffff_f8f8_0000
var large_bin_number = 0b1101_0010_1010
# Numbers lower than 1000000 generally don't need separators.
var small_number = 12345
```

**不规范示例** :

```gdscript
var large_number = 1234567890
var large_hex_number = 0xfffff8f80000
var large_bin_number = 0b110100101010
# Numbers lower than 1000000 generally don't need separators.
var small_number = 12_345
```

### 命名规定

这些命名规定遵循 Godot 引擎风格，不遵循这些规定会使你的代码与内置的命名规定相冲突，导致代码风格不一致。

| 类型 | 约定 | 示例 |
| --- | --- | --- |
| 文件名 | snake_case | `yaml_parser.gd` |
| 类名 | PascalCase | `class_name YAMLParser` |
| 节点名称 | PascalCase | `Camera3D`、`Player` |
| 函数 | snake_case | `func load_level():` |
| 变量 | snake_case | `var particle_effect` |
| 信号 | snake_case | `signal door_opened` |
| 常量 | CONSTANT_CASE | `const MAX_SPEED = 200` |
| 枚举名称 | PascalCase | `enum Element` |
| 枚举成员 | CONSTANT_CASE | `{EARTH, WATER, AIR, FIRE}` |

#### 文件名

文件名请使用蛇形命名法（snake_case）。对于有具体名称的类，请将帕斯卡命名法（PascalCase）的类名转换成蛇形命名法：

```gdscript
# This file should be saved as `weapon.gd`.
class_name Weapon
extends Node
```

```gdscript
# This file should be saved as `yaml_parser.gd`.
class_name YAMLParser
extends Object
```

这种命名与 Godot 源码中的 C++ 文件命名保持一致，也避免了由 Windows 导出到其他大小写敏感平台时所发生的问题。

#### 类与节点

类名和节点名称使用 PascalCase：

```gdscript
extends CharacterBody3D
```

将类加载到常量和变量中时也使用 PascalCase：

```gdscript
const Weapon = preload("res://weapon.gd")
```

#### 函数与变量

函数与变量使用 snake_case 命名：

```gdscript
var particle_effect
func load_level():
```

在用户必须覆盖的虚方法、私有函数、私有变量的名称前加一个下划线（_）：

```gdscript
var _counter = 0
func _recalculate_path():
```

#### 信号

用过去时态（英文）来命名信号：

```gdscript
signal door_opened
signal score_changed
```

#### 常量与枚举

使用 CONSTANT_CASE，全部大写，并用下划线（_）来分隔单词：

```gdscript
const MAX_SPEED = 200
```

枚举的 *名称* 请使用帕斯卡命名法（PascalCase），并且保持单数形式，因为它们代表的是一种“类型”。而枚举的成员请使用全大写的常量命名法（CONSTANT_CASE），因为它们本质上是常量：

```gdscript
enum Element {
    EARTH,
    WATER,
    AIR,
    FIRE,
}
```

每个枚举值占一行。这样可以更方便地在每个值上方添加文档注释，添加删除枚举值的时候版本控制中的差异也更清晰。

**规范示例** :

```gdscript
enum Element {
    EARTH,
    WATER,
    AIR,
    FIRE,
}
```

**不规范示例** :

```gdscript
enum Element { EARTH, WATER, AIR, FIRE }
```

### 代码顺序

第一节主要讨论代码顺序。格式相关的内容见 格式。命名规范相关的内容见 命名规定。

我们建议按以下方式来组织 GDScript 代码：

```gdscript
01. @tool, @icon, @static_unload
02. class_name
03. extends
04. ## doc comment

05. signals
06. enums
07. constants
08. static variables
09. @export variables
10. remaining regular variables
11. @onready variables

12. _static_init()
13. remaining static methods
14. overridden built-in virtual methods:
    1. _init()
    2. _enter_tree()
    3. _ready()
    4. _process()
    5. _physics_process()
    6. remaining virtual methods
15. overridden custom methods
16. remaining methods
17. inner classes
```

按以下顺序排列类方法和变量，具体取决于访问修饰符：

```gdscript
1. public
2. private
```

我们优化了代码顺序，从上往下阅读代码更加容易，帮助第一次阅读代码的开发人员了解代码的工作原理，同时避免与变量声明顺序相关的错误。

此代码顺序遵循四个经验法则：

1. 先写信号和属性，然后再写方法。
2. 先写公共成员，然后再写私有成员。
3. 先写虚函数回调，然后再写类的接口。
4. 先写对象的构造函数和初始化函数 `_init` 和 `_ready`，然后再写运行时修改对象的函数。

#### 类声明

如果代码要在编辑器中运行，请将 `@tool` 注解写在脚本的第一行。

接着，如果需要的话，可以加上可选的 `@icon` 注解，然后写上 `class_name` 。你可以通过 `class_name` 将一个 GDScript 文件变成项目中的全局类型。想了解更多信息，可以查看 [注册具名类](https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/gdscript_basics.html#doc-gdscript-basics-class-name) 。如果这个类打算作为一个 [abstract class](https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/gdscript_basics.html#doc-gdscript-basics-abstract-class) ，那么需要在 `class_name` 关键字 *之前* 加上 `@abstract` 。

然后，如果该类扩展了内置类型，请添加 `extends` 关键字。

接下来，你应该有该类的可选[文档注释](https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/gdscript_documentation_comments.html#doc-gdscript-documentation-comments)。例如，你可以用它来向你的队友解释你的类的作用、它是如何工作的、以及其他开发人员应该如何使用它。

```gdscript
@abstract
class_name MyNode
extends Node
## A brief description of the class's role and functionality.
##
## The description of the script, what it can do,
## and any further detail.
```

内部类采用单行形式声明：

```gdscript
## A brief description of the class's role and functionality.
##
## The description of the script, what it can do,
## and any further detail.
@abstract class MyNode extends Node:
    pass
```

#### 信号和属性

先声明信号，然后声明属性（即成员变量），这些都写在文档注释（docstring）之后。

在信号之后声明枚举，枚举可以用作其他属性的导出提示。

然后，按该顺序依次写入常量、导出变量、公共变量、私有变量和就绪加载（onready）变量。

```gdscript
signal player_spawned(position)

enum Job {
    KNIGHT,
    WIZARD,
    ROGUE,
    HEALER,
    SHAMAN,
}

const MAX_LIVES = 3

@export var job: Job = Job.KNIGHT
@export var max_health = 50
@export var attack = 5

var health = max_health:
    set(new_health):
        health = new_health

var _speed = 300.0

@onready var sword = get_node("Sword")
@onready var gun = get_node("Gun")
```

> **备注**
>
> GDScript 在 `_ready` 回调之前评估 `@onready` 变量。你可以使用它来缓存节点依赖项，也就是说，获取你的类所依赖的场景中的子节点。这就是上面的例子所展示的。

#### 成员变量

如果变量只在方法中使用，请勿将该变量声明为成员变量，因为难以定位在何处使用了该变量。相反，你应该将这些变量在方法内部定义为局部变量。

#### 局部变量

局部变量的声明位置离首次使用该局部变量的位置越近越好，让人更容易跟上代码的思路，而不需要上翻下找该变量的声明位置。

#### 方法和静态函数

先声明类的属性，再声明类的方法。

从 `_init()` 回调方法开始，引擎将在内存创建对象时调用该方法，然后是 `_ready()` 回调，Godot 在向场景树添加一个节点时会调用该回调。

这些函数应声明在脚本最前面，以便显示该对象的初始化方式。

`_unhandling_input()` 和 `_physics_process` 等其他内置的虚回调则应该放在后面，控制对象的主循环和与游戏引擎的交互。

类的其余接口、公共和私有方法，均按照这个顺序呈现。

```gdscript
func _init():
    add_to_group("state_machine")

func _ready():
    state_changed.connect(_on_state_changed)
    _state.enter()

func _unhandled_input(event):
    _state.unhandled_input(event)

func transition_to(target_state_path, msg={}):
    if not has_node(target_state_path):
        return

    var target_state = get_node(target_state_path)
    assert(target_state.is_composite == false)

    _state.exit()
    self._state = target_state
    _state.enter(msg)
    Events.player_state_changed.emit(_state.name)

func _on_state_changed(previous, new):
    print("state changed")
    state_changed.emit()
```

### 静态类型

GDScript 支持[可选的静态类型](https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/static_typing.html#doc-gdscript-static-typing)。

#### 声明类型

要声明变量的类型，请使用 `<variable>: <type>` ：

```gdscript
var health: int = 0
```

要声明函数的返回类型，请使用 `-> <type>` ：

```gdscript
func heal(amount: int) -> void:
```

#### 推断类型

大部分情况下可以用 `:=` 让编译器自行推断变量类型。类型和赋值出现在同一行时请优先使用 `:=`，否则请优先显式写出类型。

**规范示例** :

```gdscript
# The type can be int or float, and thus should be stated explicitly.
var health: int = 0

# The type is clearly inferred as Vector3.
var direction := Vector3(1, 2, 3)
```

在类型不明确时指定类型，在类型提示多余时省略类型指定。

**不规范示例** :

```gdscript
# Typed as int, but it could be that float was intended.
var health := 0

# The type hint has redundant information.
var direction: Vector3 = Vector3(1, 2, 3)

# What type is this? It's not immediately clear to the reader, so it's bad.
var value := complex_function()
```

但在少数情况下，上下文缺失时，编译器会回退到函数的返回类型。例如，在节点的场景或文件被加载到内存中之前，`get_node()` 无法自动推断类型。在这种情况下，应明确指定类型。

**规范示例** :

```gdscript
@onready var health_bar: ProgressBar = get_node("UI/LifeBar")
```

**不规范示例** :

```gdscript
# The compiler can't infer the exact type and will use Node
# instead of ProgressBar.
@onready var health_bar := get_node("UI/LifeBar")
```

也可以使用 `as` 关键字来转换返回类型，该类型会用于推导变量类型。

```gdscript
@onready var health_bar := get_node("UI/LifeBar") as ProgressBar
# health_bar will be typed as ProgressBar
```

> **备注**
>
> 这种做法比类型提示更[类型安全](https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/static_typing.html#doc-gdscript-static-typing-safe-lines)，但空值安全性较低，因为运行时出现类型不匹配的情况时会静默将变量转为 `null`，而不报错或报警告。
