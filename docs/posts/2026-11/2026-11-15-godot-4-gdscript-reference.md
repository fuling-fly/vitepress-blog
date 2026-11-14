---
title: Godot 4 GDScript：语言参考
date: 2026-11-15
tags:
  - 工具
summary: 转载 Godot 官方文档《GDScript 参考》，逐字保留语言语法、内置类型、控制流与类的原文，并注明出处。
draft: false
---

# Godot 4 GDScript：语言参考

> 来源：https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/gdscript_basics.html（实际抓取地址：https://docs.godotengine.org/zh-cn/stable/tutorials/scripting/gdscript/gdscript_basics.html）
> 许可：© 版权所有 2014-present Juan Linietsky, Ariel Manzur and the Godot community（CC BY 3.0）。
> 抓取日期：2026-11-15

### GDScript 参考

GDScript 是一种[面向对象](https://zh.wikipedia.org/wiki/%E9%9D%A2%E5%90%91%E5%AF%B9%E8%B1%A1%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1)的高级[指令式](https://zh.wikipedia.org/wiki/%E6%8C%87%E4%BB%A4%E5%BC%8F%E7%B7%A8%E7%A8%8B)[渐进类型](https://en.wikipedia.org/wiki/Gradual_typing)编程语言，专为 Godot 构建，以与 [Python](https://zh.wikipedia.org/wiki/Python) 等语言类似的缩进结构为其基本语句结构。设计 GDScript 这门语言旨在与 Godot 引擎紧密集成，对 Godot 引擎进行优化，从而为程序内容的创建与继承提供灵活的手段。

GDScript 与 Python 无关，并不是基于 Python 开发的。

#### 历史

> **备注**
>
> 关于 GDScript 历史的文档已移至常见问题。

#### GDScript 示例

考虑到部分开发者了解过编程语法，学起GDScript来会较为上手，这里给出一个简单的 GDScript 示例供参考学习。

```gdscript
# Everything after "#" is a comment.
# A file is a class!

# (optional) icon to show in the editor dialogs:
@icon("res://path/to/optional/icon.svg")

# (optional) class definition:
class_name MyClass

# Inheritance:
extends BaseClass

# Member variables.
var a = 5
var s = "Hello"
var arr = [1, 2, 3]
var dict = {"key": "value", 2: 3}
var other_dict = {key = "value", other_key = 2}
var typed_var: int
var inferred_type := "String"

# Constants.
const ANSWER = 42
const THE_NAME = "Charly"

# Enums.
enum {UNIT_NEUTRAL, UNIT_ENEMY, UNIT_ALLY}
enum Named {THING_1, THING_2, ANOTHER_THING = -1}

# Built-in vector types.
var v2 = Vector2(1, 2)
var v3 = Vector3(1, 2, 3)

# Function, with a default value for the last parameter.
func some_function(param1, param2, param3 = 123):
    const local_const = 5

    if param1 < local_const:
        print(param1)
    elif param2 > 5:
        print(param2)
    else:
        print("Fail!")

    for i in range(20):
        print(i)

    while param2 != 0:
        param2 -= 1

    match param3:
        3:
            print("param3 is 3!")
        _:
            print("param3 is not 3!")

    var local_var = param1 + 3
    return local_var

# Functions override functions with the same name on the base/super class.
# If you still want to call them, use "super":
func something(p1, p2):
    super(p1, p2)

# It's also possible to call another function in the super class:
func other_something(p1, p2):
    super.something(p1, p2)

# Inner class
class Something:
    var a = 10

# Constructor
func _init():
    print("Constructed!")
    var lv = Something.new()
    print(lv.a)
```

如果你以前有过使用 C、C++、C# 等静态类型语言的编程经验，却从未使用过动态类型编程语言，建议阅读此教程：GDScript：动态语言入门。

#### 标识符

标识符仅限于含字母字符（ `a` 到 `z` 和 `A` 到 `Z` ）、 数字（ `0` 到 `9` ）和下划线 `_` 的字符串，不能以数字开头，且大小写敏感（如 `foo` 和 `FOO` 就是两个不同的标识符）。

标识符现在也允许包含 [UAX#31](https://www.unicode.org/reports/tr31/) 所提供的部分 Unicode 字符，即现在也可将非英文字符作为标识符使用，而 Unicode 字符中易与 ASCII 字符混淆的字符以及颜文字则无法作为标识符使用。

#### 关键字

下表为该语言所支持的关键字列表。由于关键字是保留字（词法单元），因此不能用作标识符。运算符（如 `in`、`not`、`and`、`or`）及后文中出现的内置类型名称亦为保留字。

若想深入了解关键字，可在 [GDScript 词法分析器](https://github.com/godotengine/godot/blob/master/modules/gdscript/gdscript_tokenizer.cpp)中找到对于关键字的定义。

| 关键字 | 描述 |
| --- | --- |
| if | 见 if/else/elif。 |
| elif | 见 if/else/elif。 |
| else | 见 if/else/elif。 |
| for | 见 for。 |
| while | 见 while。 |
| match | 见 match。 |
| when | 用于 `match` 语句中的模式防护。 |
| break | 退出当前 `for` 或 `while` 循环的执行。 |
| continue | 立即跳到 `for` 或 `while` 循环的下一个迭代。 |
| pass | 语法上要求在不希望执行代码的语句中使用，例如在空函数中使用。 |
| return | 从函数当中返回一个值。 |
| class | 定义内部类。见内部类。 |
| class_name | 将脚本定义为具有指定名称的全局可访问类。见注册具名类。 |
| extends | 定义当前类的父类。 |
| is | 检测变量是否继承自给定的类，或检测该变量是否为给定的内置类型。 |
| in | 通常情况下用来检测字符串、列表、范围、字典、节点中是否存在某个值，而和 `for` 关键字连用时，则用于遍历字符串、列表、范围、字典、节点中的内容。 |
| as | 尝试将值转换为给定类型的值。 |
| self | 引用当前类实例。见 self。 |
| super | 解析父类作用域内的方法。见继承。 |
| signal | 定义信号。见信号。 |
| func | 定义函数。见函数。 |
| static | 将一个函数声明为静态函数，或将一个成员变量声明为静态成员变量。 |
| const | 定义常量。见常量。 |
| enum | 定义枚举。见枚举。 |
| var | 定义变量。见变量。 |
| breakpoint | 用来设置脚本编辑器辅助调试断点的关键字。与在脚本编辑器每行最左侧点击红点所创建的断点不同，`breakpoint` 关键字可以储存在脚本内部。在不同设备上使用版本工具进行调试时，由该关键字创建的断点仍旧有效。 |
| preload | 预加载类或变量。见类作为资源。 |
| await | 等待信号或协程完成。见等待信号和协程。 |
| yield | 以前的版本中用于协程，现保留为关键字，以便旧版本迁移至新版本。 |
| assert | 断言条件，若断言失败则记录错误。非调试版本中会忽略断言语法。见 Assert 关键字。 |
| void | 用于代表函数不返回任何值。 |
| PI | PI（π）常数。 |
| TAU | TAU（τ）常数。 |
| INF | 无穷常量，用于比较和计算结果。 |
| NAN | NAN（非数）常量，用作计算后不可能得到的结果。 |

#### 运算符

下列是受支持的运算符及其运算优先级。所有二元运算符均为[左结合运算符](https://en.wikipedia.org/wiki/Operator_associativity)，包括 `**` 运算符。这意味着 `2 ** 2 ** 3` 等价于 `(2 ** 2) ** 3`。请使用括号来明确指定你需要的优先级，例如 `2 ** (2 ** 3)`。三元 `if/else` 运算符是右结合的。

| **运算符** | **描述** |
| --- | --- |
| `(` `)` | 分组（优先级最高） 括号其实不是运算符，但是能够让你显式指定运算的优先级。 |
| `x[index]` | 下标 |
| `x.attribute` | 属性引用 |
| `foo()` | 函数调用 |
| `await x` | 等待信号或协程 |
| `x is Node` `x is not Node` | 类型检查 另见 is_instance_of() 函数。 |
| `x ** y` | 幂（乘方） 将 `x` 与其自身相乘 `y` 次，类似于调用 pow() 函数。 |
| `~x` | 按位取反 |
| `+x` `-x` | 取同 / 取负（相反数） |
| `x * y` `x / y` `x % y` | 乘法/除法/余数 `%` 运算符也用于字符串的格式化。 **注意：**这些运算符的运算机制与其在 C++ 中的运算机制一致，而对于使用 Python、JavaScript 等语言的用户则可能会存在在其意料之外的运算机制，详情见表后。 |
| `x + y` `x - y` | 加法（或连接）/减法 |
| `x << y` `x >> y` | 位移位 |
| `x & y` | 按位与 |
| `x ^ y` | 按位异或 |
| `x \| y` | 按位或 |
| `x == y` `x != y` `x < y` `x > y` `x <= y` `x >= y` | 比较 详情见表后。 |
| `x in y` `x not in y` | 检查包含关系 `in` 也在 for 关键字的语法中使用。 |
| `not x` `!x` | 布尔“非”及其不推荐使用的形式 |
| `x and y` `x && y` | 布尔“与”及其不推荐使用的形式 |
| `x or y` `x \|\| y` | 布尔“或”及其不推荐使用的形式 |
| `真表达式 if 条件 else 假表达式` | 三元（目）运算符 if/else |
| `x as Node` | 类型转换 |
| `x = y` `x += y` `x -= y` `x *= y` `x /= y` `x **= y` `x %= y` `x &= y` `x \|= y` `x ^= y` `x <<= y` `x >>= y` | 赋值（优先级最低） 表达式中不能使用赋值运算符。 |

> **备注**
>
> 一些运算符的运算机制可能会与你所预期的运算机制有所不同：
>
> 1. 若运算符 `/` 两端的数值均为 int，则进行整数除法而非浮点数除法。例如：`5 / 2 == 2` 而非 `2.5`。若希望进行浮点数运算，请至少使用一个 float 字面量（`x / 2.0`）、转换类型（`float(x) / y`）或者乘以 `1.0`（`x * 1.0 / y`）。
> 2. 运算符 `%` 仅适用于整型数值的取余运算，对于小数的取余运算，请使用 fmod() 方法。
> 3. 对于负值，`%` 运算符和 `fmod()` 函数会使用 [截断算法](https://en.wikipedia.org/wiki/Truncation) 进行运算，而非向负无穷大舍入，此时余数会带有符号（即余数可能为负）。如果你需要数学意义上的余数，请改用 posmod() 和 fposmod() 函数。
> 4. `==` 和 `!=` 运算符在有些情况下允许比较不同类型的值（例如 `1 == 1.0` 的结果为真），但在其他情况下可能会发生运行时错误。若你不能确定操作数的类型，可使用 is_same() 函数来进行安全比较（但请注意，该函数对类型和引用更加严格）。要比较浮点数，请改用 is_equal_approx() 和 is_zero_approx() 函数。

#### 字面量

| **示例** | **描述** |
| --- | --- |
| `null` | 空值 |
| `false`、`true` | 布尔值 |
| `45` | 十进制整数 |
| `0x8f51` | 十六进制整数 |
| `0b101010` | 二进制整数 |
| `3.14`、`58.1e-10` | 浮点数（实数） |
| `"Hello"`、`"Hi"` | 常规字符串 |
| `"""Hello"""`、`'''Hi'''` | 常规字符串（用三对引号括住） |
| `r"Hello"`、`r'Hi'` | 原始字符串 |
| `r"""Hello"""`、`r'''Hi'''` | 原始字符串（用三对引号括住） |
| `&"name"` | StringName |
| `^"Node/Label"` | NodePath |

也有两种长得像字面量，但实际上不是字面量的量：

| **示例** | **描述** |
| --- | --- |
| `$NodePath` | `get_node("NodePath")` 的简写 |
| `%UniqueNode` | `get_node("%UniqueNode")` 的简写 |

整数和浮点数中的数字可用 `_` 分隔，方便阅读。以下表示数字的方法均有效：

```gdscript
12_345_678  # Equal to 12345678.
3.141_592_7  # Equal to 3.1415927.
0x8080_0000_ffff  # Equal to 0x80800000ffff.
0b11_00_11_00  # Equal to 0b11001100.
```

**常规字符串字面量**内可包含以下转义序列：

| **转义序列** | **转义为** |
| --- | --- |
| `\n` | 换行符 |
| `\t` | 水平制表符 |
| `\r` | 回车符 |
| `\a` | 警报（蜂鸣/响铃） |
| `\b` | 退格键 |
| `\f` | 换页符 |
| `\v` | 垂直制表符 |
| `\"` | 双引号 |
| `\'` | 单引号 |
| `\\` | 反斜杠 |
| `\uXXXX` | Unicode UTF-16 码位 `XXXX`（16进制，不区分大小写） |
| `\UXXXXXX` | Unicode UTF-32 码位 `XXXXXX`（16进制，不区分大小写） |

有两种方法可以表示 `0xFFFF` 以上的转义 Unicode 字符：

- 使用 [UTF-16 代理对](https://en.wikipedia.org/wiki/UTF-16#Code_points_from_U+010000_to_U+10FFFF) `\uXXXX\uXXXX` 表示。
- 使用单个 UTF-32 码位 `\UXXXXXX` 表示。

此外，在字符串中使用 `\` 后换行可以让斜杠后的文字自动换行，而无需在字符串中插入换行符。

使用某一种引号（如 `"`）构成的字符串，无需转义即可包含另一种引号（如 `'`），而三引号字符串在与其他字符串边缘不相邻的情况下，最多可避免连续两个同种引号的转义。

**原始字符串字面量**始终按照源代码中出现的方式对字符串进行编码，特别适用于正则表达式当中。原始字符串虽不处理转义序列，但可以识别 `\\` 和 `\"` （ `\'` ）等字符，并将其替换为其自身。一个字符串内可以含有一对相匹配的引号，但这些引号前面必须有一个反斜杠才可以让字符串包含它们。

```gdscript
print("\tchar=\"\\t\"")  # Prints `    char="\t"`.
print(r"\tchar=\"\\t\"") # Prints `\tchar=\"\\t\"`.
```

> **备注**
>
> 而有些字符串却不能使用原始字符串字面量来表示：不能在字符串末尾有奇数个反斜杠，不能在字符串内部有未转义的开引号。但在实际应用中，这些问题并不重要，因为你可以通过使用不同类型的引号，或者与普通字符串字面量进行拼接，来解决这个问题。

GDScript 也支持格式字符串。

#### 注解

注解是 GDScript 中的一类特殊标记，用来修饰整个脚本，亦或是修饰声明、语句，亦或是修饰源代码中的某个位置。注解会影响 Godot 编辑器与 GDScript 编译器对该脚本所产生的效果。

注解均以 `@` 符号开头，加以注解名称而构成。有关注解的详细说明及其使用范例见 GDScript 类参考。

例如可以用来将值导出到编辑器：

```gdscript
@export_range(1, 100, 1, "or_greater")
var ranged_var: int = 50
```

更多关于导出属性的信息见 GDScript 导出属性。

只要与所需参数类型兼容，就可以将常量表达式用作注解的参数值：

```gdscript
const MAX_SPEED = 120.0

@export_range(0.0, 0.5 * MAX_SPEED)
var initial_speed: float = 0.25 * MAX_SPEED
```

注解既可单行修饰，也可多行修饰，修饰离该注解最近的非注解语句。注解可携带参数，每个参数均在注解名后的括号内，彼此之间用逗号隔开。

这两种写法是一样的：

```gdscript
@annotation_a
@annotation_b
var variable

@annotation_a @annotation_b var variable
```

##### `@onready` 注解

使用节点时，经常会需要将场景中某一部分的引用存放在变量中。由于场景只有在进入活动场景树时才会进行正确配置，故而仅在调用 `Node._ready()` 时才能获得子节点。

```gdscript
var my_label

func _ready():
    my_label = get_node("MyLabel")
```

这样可能很麻烦，尤其是在节点和外部引用越来越多的时候。为了解决这个问题，GDScript 提供了 `@onready` 注解，能够将成员变量的初始化推迟到调用 `_ready()` 时。上面的代码可以替换为一行：

```gdscript
@onready var my_label = get_node("MyLabel")
```

> **警告**
>
> 使用 `@onready` 和 `@export` 去注解同一个变量并不会如你所愿。`@onready` 注解会让默认值在 `@export` 生效之后设置，导致发生覆盖：
>
> ```gdscript
> @export var a = "init_value_a"
> @onready @export var b = "init_value_b"
>
> func _init():
>     prints(a, b) # init_value_a <null>
>
> func _notification(what):
>     if what == NOTIFICATION_SCENE_INSTANTIATED:
>         prints(a, b) # exported_value_a exported_value_b
>
> func _ready():
>     prints(a, b) # exported_value_a init_value_b
> ```
>
> 为此，本引擎提供了 `ONREADY_WITH_EXPORT` 警告选项，默认将该操作作为编辑器错误进行处理。我们并不推荐关闭或忽略该警告选项。

#### 注释

从 `#` 到行尾的内容都会被忽略，视为注释。

```gdscript
# This is a comment.
```

> **小技巧**
>
> Godot 的脚本编辑器会高亮显示注释中的一些特殊关键字，提醒用户注意某些注释：
>
> - **关键提示***（标红）*：`ALERT`、`ATTENTION`、`CAUTION`、`CRITICAL`、`DANGER`、`SECURITY`
> - **警告提示***（标黄）*：`BUG`、`DEPRECATED`、`FIXME`、`HACK`、`TASK`、`TBD`、`TODO`、`WARNING`
> - **一般提示***（标绿）*：`INFO`、`NOTE`、`NOTICE`、`TEST`、`TESTING`
>
> 这些关键字大小写敏感，需要全大写才能保证能被引擎识别：
>
> ```gdscript
> # In the example below, "TODO" will appear in yellow by default.
> # The `:` symbol after the keyword is not required, but it's often used.
>
> # TODO: Add more items for the player to choose from.
> ```
>
> 可以在编辑器设置的 **文本编辑器 > 主题 > 注释标记** 部分中更改突出显示的关键字列表及其颜色。

把一个井号（`#`）换成两个（`##`）可以添加*文档注释*，文档注释会在脚本文档和变量的检查器描述中显示。文档注释必须放在可编写文档内容（例如成员变量）的正*上方*或放在文件的开头。还可以使用专门的格式化选项，详见 GDScript 文档注释。

```gdscript
## This comment will appear in the script documentation.
var value

## This comment will appear in the inspector tooltip, and in the documentation.
@export var exported_value
```

#### 代码区块

代码区块是一种特殊类型的注释，脚本编辑器将其理解为*可折叠区块*，即在编写代码区块注释后，可以通过点击注释左侧出现的箭头来折叠和展开该区块。该箭头用一个紫色方块包围起来，以区别于标准的代码折叠。

语法如下：

```gdscript
# Important: There must be *no* space between the `#` and `region` or `endregion`.

# Region without a description:
#region
...
#endregion

# Region with a description:
#region Some description that is displayed even when collapsed
...
#endregion
```

> **小技巧**
>
> 要快速创建代码区块，请在脚本编辑器中选择若干行，右键点击选区，然后选择**创建代码区块**即可。系统将自动选中区块描述以对其进行编辑。
>
> 可将代码区块嵌套在其他代码区块内。

以下为代码区块的具体使用示例：

```gdscript
# This comment is outside the code region. It will be visible when collapsed.
#region Terrain generation
# This comment is inside the code region. It won't be visible when collapsed.
func generate_lakes():
    pass

func generate_hills():
    pass
#endregion

#region Terrain population
func place_vegetation():
    pass

func place_roads():
    pass
#endregion
```

代码区块可将大块代码组织成更容易理解的部分。但请注意，外部编辑器通常不支持该特性。因此即便不依赖代码区块，也要确保你的代码易于理解。

> **备注**
>
> 单独的函数与被缩进的部分（如 `if` 和 `for`）*始终*可以在脚本编辑器中折叠，此时应避免使用代码区块来包含这些可始终折叠起来的部分，执意使用亦可，但也并不会带来太多好处。若要将多个元素分组在一起，使用代码区块效果最佳。

#### 行间语句接续

在 GDScript 中，一行语句可通过反斜杠（`\`）接续到下一行。将反斜杠加在一行语句末尾可将该行代码与下一行代码相衔接。如：

```gdscript
var a = 1 + \
2
```

可按以下方式对单个语句行进行多行接续：

```gdscript
var a = 1 + \
4 + \
10 + \
4
```

#### 内置类型

内置类型分配在栈上、按值传递，即每次赋值或将其作为参数传递给函数时均会复制其值。例外是对象 `Object`、数组 `Array`、字典 `Dictionary` 以及紧缩数组（如`PackedByteArray`），这些类型的值按引用传递，实例的值相互共享。数组、字典 `Dictionary` 以及部分对象（`Node`、`Resource`）均有 `duplicate()` 方法，能够用来制作副本。

##### 基本内置类型

GDScript 中的变量可赋以不同内置类型的值。

###### null

`null` 为空数据类型，既不包含任何信息，也不能赋值为其他任何值。

只有继承自 Object 的类型才能具有 `null` 值（因此 Object 被称为“可空”类型）。Variant 类型的值必须始终有效，因此不能具有 `null` 值。

###### bool

“boolean”（布尔）的缩写，只能包含 `true` 或 `false`。

###### int

英文“integer”（整数）的缩写，存储整数（正整数和负整数）。存储的是 64 位值，等效于 C++ 中的 `int64_t`。

###### float

使用浮点值存储实数，包括小数。存储的是 64 位值，等效于 C++ 中的 `double`。注意：目前 `Vector2`、`Vector3`、`PackedFloat32Array` 等数据结构存储的是 32 位单精度 `float` 值。

###### String

[Unicode 格式](https://zh.wikipedia.org/zh-cn/Unicode)的字符序列。

###### StringName

不可变字符串，一个实例仅允许拥有一个名称。该类型的实例创建起来较慢，在多线程环境下可能会导致锁等待。不过，该类型的实例比较起来比字符串快，非常适合在字典中作为键名使用。

###### NodePath

节点或节点属性的预解析路径，可以轻松地赋值成字符串，亦或从字符串中转换为节点路径。节点路径可用于与节点树交互以获取节点，亦或通过诸如 Tween等方式来影响属性。

##### 内置向量类型

###### Vector2

2D 向量类型，包含 `x` 和 `y` 两个字段，也可像访问数组元素一样访问这两个字段。

###### Vector2i

同 Vector2，但其分量均为整型数值，非常适用于制作 2D 网格显示物品功能。

###### Rect2

2D 矩形类型，包含两个向量字段：`position` 和 `size`。还包含一个 `end` 字段，即 `position + size`。

###### Vector3

3D 向量类型，包含 `x`、`y`、`z` 三个字段，也可以像访问数组元素一样访问这些字段。

###### Vector3i

同 Vector3 ，但其分量均为整型数值，可用于为 3D 网格中的每个物品编制索引。

###### Transform2D

用于 2D 变换的 3×2 矩阵。

###### Plane

3D 平面类型的标准形式，包含一个向量字段 `normal` 以及一个 标量距离 `d`。

###### Quaternion

四元数是一种用于表示 3D 旋转的数据类型，对于内插旋转十分有用。

###### AABB

轴对齐边界框（或 3D 框），包含 2 个向量字段：`position` 和 `size`。还包含一个 `end` 字段，即 `position + size`。

###### Basis

用于 3D 旋转和缩放的 3×3 矩阵，包含 3 个向量字段（`x`、`y`、`z`），可以以 3D 向量数组的形式访问。

###### Transform3D

3D 线性变换，包含一个 Basis（基）字段 `basis` 和一个 Vector3 字段 `origin`。

##### 引擎内置类型

###### Color

颜色数据类型包含 `r`、`g`、`b`、`a` 四个字段，也可以用 `h`、`s`、`v` 这三个字段来分别访问色相、饱和度、明度。

###### RID

资源 ID（RID）。服务器使用通用的 RID 来引用不透明的数据。

###### Object

所有非内置类型的基类型。

##### 容器内置类型

###### Array

任意对象类型的泛型序列，包括其他数组或字典（见下文）。数组可以动态调整大小，其索引从 `0` 开始，索引为负整数时则表示从数组尾部开始计数。

```gdscript
var arr = []
arr = [1, 2, 3]
var b = arr[1] # This is 2.
var c = arr[arr.size() - 1] # This is 3.
var d = arr[-1] # Same as the previous line, but shorter.
arr[0] = "Hi!" # Replacing value 1 with "Hi!".
arr.append(4) # Array is now ["Hi!", 2, 3, 4].
```

###### 类型化数组

Godot 同样支持类型化数组。向类型化数组中写入数据时，Godot 会检查每个元素是否与该数组所指定的类型相匹配，因此类型化数组不能含有无效数据。而诸如 `front()` 和 `back()` 等方法，虽然 GDScript 静态分析器会将类型化数组考虑在内，却仍会返回 `Variant` 类型的数值。

类型化数组通过 `Array[Type]` 指定，其中类型 `Type` 可以是 `Variant` 类型、内置类型，也可以是用户自定义类型、枚举类型等。不支持类型化数组嵌套（如 `Array[Array[int]]`）。

```gdscript
var a: Array[int]
var b: Array[Node]
var c: Array[MyClass]
var d: Array[MyEnum]
var e: Array[Variant]
```

`Array` 等价于 `Array[Varaint]`。

> **备注**
>
> 数组是按引用传递的，因此数组元素类型也是运行时变量引用的内存结构的一个属性。变量的静态类型限制了它可以引用的结构。因此，你**不能**为数组内的元素赋予不同的元素类型的值，即使该类型是数组所接受类型的子类型。
>
> 若需要对类型化数组进行*转换*，可以创建一个新数组并使用 Array.assign() 方法：
>
> ```gdscript
> var a: Array[Node2D] = [Node2D.new()]
>
> # (OK) You can add the value to the array because `Node2D` extends `Node`.
> var b: Array[Node] = [a[0]]
>
> # (Error) You cannot assign an `Array[Node2D]` to an `Array[Node]` variable.
> b = a
>
> # (OK) But you can use the `assign()` method instead. Unlike the `=` operator,
> # the `assign()` method copies the contents of the array, not the reference.
> b.assign(a)
> ```
>
> `Array` （ `Array[Variant]` ）则是例外，这样做可以保证用户使用的便捷性与与旧版本代码的兼容性。不过，非类型化的数组是不安全的。

###### 紧缩数组

与相同类型的类型化数组 Array 相比，紧缩数组的遍历和修改速度通常更快（例如 PackedInt64Array 与 Array[int] 比较）。即便是最坏的情况，这两种数组也不会比无类型的 Array 慢。不过非紧缩数组（无论是否类型化）都会额外包含类似 Array.map 的便捷方法，紧缩数组则不提供。具体有哪些方法可用见类参考。类型化数组的遍历和修改速度通常比无类型数组更快。

只要足够大，任何 Array 都可能导致内存的碎片化。如果你需要在意内存占用和性能（迭代速度和修改速度），并且存储的数据类型与某种 `Packed` 数组类型兼容，那么使用这些类型有可能带来改进。当然如果你没有这些顾虑（比如数组中的元素达不到数万个），那么使用常规的 Array 或类型化的 Array 可能更方便，因为它们提供了便捷的方法，可以使你的代码更易于编写和维护（如果你的数据需要大量此类操作，也许还能提升速度）。如果你知道要存储什么类型的数据（包括你自己定义的类），那么建议使用类型化数组，因为与无类型数组相比，类型化数组在迭代和修改时可以提供更好的性能。

- PackedByteArray：字节（从 0 到 255 的整数）数组。
- PackedInt32Array：32位整数数组。
- PackedInt64Array：64位整数数组。
- PackedFloat32Array：32位浮点数数组。
- PackedFloat64Array：64位浮点数数组。
- PackedStringArray：字符串数组。
- PackedVector2Array：Vector2 类型的数组。
- PackedVector3Array：Vector3 类型的数组。
- PackedVector4Array：Vector4 类型的数组。
- PackedColorArray：Color 类型的数组。

###### Dictionary

关联容器，其内部数值通过与之对应的唯一的键进行引用。

```gdscript
var d = {4: 5, "A key": "A value", 28: [1, 2, 3]}
d["Hi!"] = 0
d = {
    22: "value",
    "some_key": 2,
    "other_key": [2, 3, 4],
    "more_key": "Hello"
}
```

字典也支持 Lua 风格的 table 语法。Lua 风格的 GDScript 字典语法在标记字符串键时，使用的是 `=` 而非 `:`，且不使用引号（这样要写的东西会稍微少一些）。但请注意，以这种形式编写的键和 GDScript 标识符一样不能以数字开头，且必须为字面量。

```gdscript
var d = {
    test22 = "value",
    some_key = 2,
    other_key = [2, 3, 4],
    more_key = "Hello"
}
```

要向现有字典添加键，可以像访问现有键一样访问要添加的键，并给其赋值：

```gdscript
var d = {} # Create an empty Dictionary.
d.waiting = 14 # Add String "waiting" as a key and assign the value 14 to it.
d[4] = "hello" # Add integer 4 as a key and assign the String "hello" as its value.
d["Godot"] = 3.01 # Add String "Godot" as a key and assign the value 3.01 to it.

var test = 4
# Prints "hello" by indexing the dictionary with a dynamic key.
# This is not the same as `d.test`. The bracket syntax equivalent to
# `d.test` is `d["test"]`.
print(d[test])
```

> **备注**
>
> 方括号语法不仅可以用在 Dictionary 上，而且还可以用来存取任何 Object 的属性。不过要注意：尝试读取不存在的属性会引发脚本错误。要避免这一点，可换用 Object.get() 和 Object.set() 方法。

###### 类型化字典

Godot 4.4 添加了对类型化字典的支持。写入时，Godot 会检查元素的键、值是否与指定的类型匹配，这样字典中就不会包含无效的键、值了。GDScript 静态分析器也会考虑类型化字典。不过字典中能够将值返回的方法返回的仍然是 `Variant` 类型。

类型化字典的语法为 `Dictionary[键类型, 值类型]`，其中 `键类型` 和 `值类型` 可以是任意 `Variant` 类型、原生类和用户类、枚举。键和值的类型**必须**同时指定，不过两者都可以用 `Variant` 来忽略类型。不支持嵌套的类型化合集（例如 `Dictionary[String, Dictionary[String, int]]`）。

```gdscript
var a: Dictionary[String, int]
var b: Dictionary[String, Node]
var c: Dictionary[Vector2i, MyClass]
var d: Dictionary[MyEnum, float]
# String keys, values can be any type.
var e: Dictionary[String, Variant]
# Keys can be any type, boolean values.
var f: Dictionary[Variant, bool]
```

`Dictionary` 和 `Dictionary[Variant, Variant]` 是一样的。

###### Signal

信号由对象发出，并由对象所监听。Signal 类型可以用于将信号广播者作为参数进行传递。

信号可以直接从对象实例中进行引用，如 `$Button.button_up`。

###### Callable

可调用体包含一个对象及其某个函数，适用于将函数作为数值传递（例如：将可调用体用于信号连接）。

像获取类成员一样获取方法就会返回可调用体。`var x = $Sprite2D.rotate` 就会将 `x` 赋值为一个可调用体，该可调用体含有 `$Sprite2D` 对象及其方法 `rotate`。

可以调用 `call` 方法来调用可调体所指向的方法，如： `x.call(PI)`。

#### 变量

变量可以作为类成员存在，也可以作为函数的局部变量存在，用 `var` 关键字创建，可以在初始化时指定一个值。

```gdscript
var a # Data type is 'null' by default.
var b = 5
var c = 3.8
var d = b + c # Variables are always initialized in direct order (see below).
```

变量可进行类型指定。指定类型时，将强制该变量始终容纳与被指定类型相同类型的数据。试图分配与该类型不兼容的值将触发报错。

在变量声明中，在变量名后面使用 `:`（冒号）+ 类型名 来指定类型。

```gdscript
var my_vector2: Vector2
var my_node: Node = Sprite2D.new()
```

如果在声明中初始化变量，则可以推断变量类型，在此情况下可省略类型名称：

```gdscript
var my_vector2 := Vector2() # 'my_vector2' is of type 'Vector2'.
var my_node := Sprite2D.new() # 'my_node' is of type 'Sprite2D'.
```

类型推断只有在指定的值具有定义的类型时才能通过检查，否则将触发报错。

有效的类型有：

- 内置类型（如 Array 、 Vector2、 int、 String 等）。
- 引擎类（Node、Resource、RefCounted 等）。
- 包含脚本资源的常量名（如 `MyScript` ，前提是声明了 `const MyScript = preload("res://my_script.gd")` ）。
- 在同一个脚本中的其他内部类，此时需要注意作用域（比如：在相同作用域内，在 `class InnerClass` 中声明 `class NestedClass` 则会得到 `InnerClass.NestedClass` ）。
- 通过 `class_name` 关键字声明的脚本类。
- 自动加载的节点——单例节点。

> **备注**
>
> 虽然 `Variant` 类型被引擎视作有效类型，但其并不是一个确切的类型，只是一个“没有固定类型”的代名词。使用 `Variant` 类型很有可能会导致报错，因此引擎默认不会对该类型进行推断。
>
> 你可以在项目设置中将该检查关闭，或将其设为警告。详见 GDScript 警告系统。

##### 初始化顺序

成员变量的初始化顺序如下：

1. 变量根据其静态类型，取值为 `null`（无类型变量和对象）或类型的默认值（`int`为 `0`、`bool`为`false`等）。
2. 根据脚本中变量的声明顺序，由上至下进行指定值的赋值。

   - （仅适用于派生自 `Node` 的类）如果变量由 `@onready` 注解修饰，则会推迟到第 5 步再初始化。
3. 如被定义，`_init()` 方法将被调用。
4. 初始化场景和资源时，赋导出的值。
5. （仅适用于派生自 `Node` 的类）初始化 `@onready` 变量。
6. （仅适用于派生自 `Node` 的类）如果定义了 `_ready()` 方法，则会对其进行调用。

> **警告**
>
> 复杂表达式也能够作为变量的初始化器，其中也包括函数调用。请确保初始化变量时变量的声明顺序正确，否则对应的值可能会被覆盖。例如：
>
> ```gdscript
> var a: int = proxy("a", 1)
> var b: int = proxy("b", 2)
> var _data: Dictionary = {}
>
> func proxy(key: String, value: int):
>     _data[key] = value
>     print(_data)
>     return value
>
> func _init() -> void:
>     print(_data)
> ```
>
> 会在控制台中打印出：
>
> ```gdscript
> { "a": 1 }
> { "a": 1, "b": 2 }
> {  }
> ```
>
> 解决这个问题只需将 `_data` 变量的定义移动到 `a` 的定义之前，或者移除空字典的赋值（`={}`）。

##### 静态变量

成员变量可以声明为静态成员变量：

```gdscript
static var a
```

静态变量直属于类而非类的实例，即静态变量可以在多个类实例之间共享数据，这一点与一般的成员变量有所区别。

在类内，静态函数和非静态函数都可以访问静态变量。在类外，可以通过使用类名或类的实例来访问静态变量（后者并不推荐，因为可读性较低）。

> **备注**
>
> `@export` 注解和 `@onready` 注解不能修饰静态成员变量。局部变量不能声明为静态局部变量。

下面的例子中定义了一个 `Person` 类，其中有一个静态变量 `max_id`。我们在 `_init()` 函数中为 `max_id` 加一。这样就能够很方便地记录游戏中 `Person` 实例的数量。

```gdscript
# person.gd
class_name Person

static var max_id = 0

var id
var name

func _init(p_name):
    max_id += 1
    id = max_id
    name = p_name
```

下面我们创建两个 `Person` 类的实例，会发现类和实例具有相同的 `max_id` 值，这是因为该成员变量是静态成员变量，能够在每个实例中访问。

```gdscript
# test.gd
extends Node

func _ready():
    var person1 = Person.new("John Doe")
    var person2 = Person.new("Jane Doe")

    print(person1.id) # 1
    print(person2.id) # 2

    print(Person.max_id)  # 2
    print(person1.max_id) # 2
    print(person2.max_id) # 2
```

静态变量可以指定类型、设置 setter 函数和 getter 函数：

```gdscript
static var balance: int = 0

static var debt: int:
    get:
        return -balance
    set(value):
        balance = -value
```

父类的静态成员变量也可以在子类中访问：

```gdscript
class A:
    static var x = 1

class B extends A:
    pass

func _ready():
    prints(A.x, B.x) # 1 1
    A.x = 2
    prints(A.x, B.x) # 2 2
    B.x = 3
    prints(A.x, B.x) # 3 3
```

> **备注**
>
> 工具脚本引用静态变量时，包含该静态变量的脚本**必须**同为工具脚本。详见《在编辑器中运行代码》。

##### `@static_unload` 注解

GDScript 的类均为资源，而静态变量会阻止脚本资源卸载，即便该脚本所对应的类的实例以及对该实例引用并不存在，静态变量依旧会阻止该脚本资源卸载。在静态变量存储大量数据，同时还含有对其他对象的引用（比如场景）的情况下，更需要引起格外重视。你需要手动清理掉这些数据，亦或是使用 @static_unload 注解，让静态变量在不存储重要数据时得到重置。

> **警告**
>
> 目前由于某个漏洞导致含静态成员变量的脚本实例即使使用了 `@static_unload` 注解也无法被清除的问题。

请注意，`@static_unload` 注解修饰的是整个脚本（包括内部类），必须置于脚本最开头，位于 `class_name` 和 `extends` 关键字之前：

```gdscript
@static_unload
class_name MyNode
extends Node
```

亦可见 静态函数 和 静态构造函数 。

##### 类型转换

赋予给指定了类型的变量的值必须具有与其类型相兼容的类型。若需要将值强制转换为特定类型，特别是对于对象类型而言要进行转型，则可以使用强制转型运算符 `as`。

如果值是对象类型，且为与目标类型相同的类型，亦或为目标类型的子类型，则进行转型后会得到同一个对象。

```gdscript
var my_node2D: Node2D
my_node2D = $Sprite2D as Node2D # Works since Sprite2D is a subtype of Node2D.
```

如果该值的类型不是目标类型的子类型，则强制转型操作将产生 `null` 值。

```gdscript
var my_node2D: Node2D
my_node2D = $Button as Node2D # Results in 'null' since a Button is not a subtype of Node2D.
```

对于内置类型，如果允许，则将对其进行强制转型，否则将触发报错。

```gdscript
var my_int: int
my_int = "123" as int # The string can be converted to int.
my_int = Vector2() as int # A Vector2 can't be converted to int, this will cause an error.
```

与场景树进行交互时，在获取节点这方面，强制转型也更加类型安全，十分有用：

```gdscript
# Will infer the variable to be of type Sprite2D.
var my_sprite := $Character as Sprite2D

# Will fail if $AnimPlayer is not an AnimationPlayer, even if it has the method 'play()'.
($AnimPlayer as AnimationPlayer).play("walk")
```

#### 常量

常量是游戏运行时不可更改的量，其值在编译时必须已知，可使用 `const` 关键字为常量值赋予名称。尝试为常量重新赋值将会触发报错。

建议使用常量来储存不应更改的值。

```gdscript
const A = 5
const B = Vector2(20, 20)
const C = 10 + 20 # Constant expression.
const D = Vector2(20, 30).x # Constant expression: 20.
const E = [1, 2, 3, 4][0] # Constant expression: 1.
const F = sin(20) # 'sin()' can be used in constant expressions.
const G = x + 20 # Invalid; this is not a constant expression!
const H = A + 20 # Constant expression: 25 (`A` is a constant).
```

常量的类型虽然可以从赋予的值中推断出来，但也可以通过显式添加类型来指定：

```gdscript
const A: int = 5
const B: Vector2 = Vector2()
```

赋予与指定的类型不相容的值将触发报错。

也可以在函数内使用常量来声明一些局部魔法值。

##### 枚举

枚举实质上是常量的简写，适用于为某些常量连续赋整数值。

```gdscript
enum {TILE_BRICK, TILE_FLOOR, TILE_SPIKE, TILE_TELEPORT}

# Is the same as:
const TILE_BRICK = 0
const TILE_FLOOR = 1
const TILE_SPIKE = 2
const TILE_TELEPORT = 3
```

如果你给枚举（enum）起了一个名字，它就会把枚举里的所有键（keys）都放进一个以该名字命名的常量 Dictionary 中。这意味着，所有字典（Dictionary）自带的常量方法，也都可以直接在这个命名枚举上使用。不过要注意，这只对 GDScript 自己定义的枚举有效，内置类（built-in classes）里的枚举是不支持这个特性的。

> **重要**
>
> 从 Godot 3.1 开始，不会再将具名枚举的键注册为全局常量，此后，应在枚举常量前缀以枚举名的形式来访问枚举内的枚举常量（ `Name.KEY` ）；见后面的例子。

```gdscript
enum State {STATE_IDLE, STATE_JUMP = 5, STATE_SHOOT}

# Is the same as:
const State = {STATE_IDLE = 0, STATE_JUMP = 5, STATE_SHOOT = 6}
# Access values with State.STATE_IDLE, etc.

func _ready():
    # Access values with Name.KEY, prints '5'
    print(State.STATE_JUMP)
    # Use dictionary methods:
    # prints '["STATE_IDLE", "STATE_JUMP", "STATE_SHOOT"]'
    print(State.keys())
    # prints '{ "STATE_IDLE": 0, "STATE_JUMP": 5, "STATE_SHOOT": 6 }'
    print(State)
    # prints '[0, 5, 6]'
    print(State.values())
```

如果没有为枚举中的键赋值，就会自动赋值为前一个值加一，如果是枚举中的第一个条目则赋值为 `0`。不同的键可以具有相同的值。

#### 函数

函数始终属于某个类。查找变量时，作用域的查找顺序是：局部→类成员→全局。`self` 变量始终可用，它提供了一种访问类成员的方式（见 self），但这不是必须的（与 Python 不同，*不应该*将其作为函数的第一个参数传递）。

```gdscript
func my_function(a, b):
    print(a)
    print(b)
    return a + b  # Return is optional; without it 'null' is returned.
```

函数可以在任何时候用 `return` 返回，默认的返回值为 `null`。

默认情况下，所有函数参数都是必需的。你可以通过为一个或多个参数指定默认值，使它们成为可选参数：

```gdscript
# Since the last two parameters are optional, all these calls are valid:
# - my_function(1)
# - my_function(1, 20)
# - my_function(1, 20, 100)
func my_function(a_required, b_optional = 10, c_optional = 42):
    print(a_required)
    print(b_optional)
    print(c_optional)
```

如果函数中仅包含一行代码，就可以写成一行：

```gdscript
func square(a): return a * a

func hello_world(): print("Hello World")

func empty_function(): pass
```

函数的参数以及返回值也都可以指定类型。参数类型的添加方式与变量类似：

```gdscript
func my_function(a: int, b: String):
    pass
```

如果函数参数有默认值，就可以对该参数的类型进行推断：

```gdscript
func my_function(int_arg := 42, String_arg := "string"):
    pass
```

函数的返回类型可以在参数列表后使用箭头标记（`->`）指定：

```gdscript
func my_int_function() -> int:
    return 0
```

有返回类型的函数**必须**返回与返回值类型相匹配的值。将返回值类型设置为 `void` 表示该函数不返回任何东西。这种函数称为 void 函数，可以使用 `return` 关键字提前返回，但不能返回任何值。

```gdscript
func void_function() -> void:
    return # Can't return a value.
```

> **备注**
>
> 非 void 函数 **必须** 返回一个值，如果你的代码具有分支语句（例如 `if`/`else` 构造），则所有可能的路径都必须有返回值。例如，如果在 `if` 块内有一个 `return`，但在其后没有，则编辑器将抛出一个错误，因为如果该代码块未执行，那么该函数将没有值进行有效返回。

##### 引用函数

就 Callable 对象而言，函数是其第一类值。如果通过名称来引用函数但不调用，那么就会自动生成对应的可调用体。可以将这种可调用体作为函数的参数传递。

```gdscript
func map(arr: Array, function: Callable) -> Array:
    var result = []
    for item in arr:
        result.push_back(function.call(item))
    return result

func add1(value: int) -> int:
    return value + 1;

func _ready() -> void:
    var my_array = [1, 2, 3]
    var plus_one = map(my_array, add1)
    print(plus_one) # Prints `[2, 3, 4]`.
```

> **备注**
>
> 可调用体**必须**使用 call() 方法进行调用，不能直接使用 `()` 运算符。实现这种行为是为了避免影响直接调用函数的性能问题。

##### Lambda 函数

Lambda 函数允许声明不属于类的函数，会直接创建 Callable 对象并将其赋值给变量。Lambda 函数可以创建可传递的可调用体，同时又不会污染该类的作用范围，非常有用。

```gdscript
var lambda = func (x):
    print(x)
```

要调用所创建出来的 Lambda 函数，你可以调用其 call() 方法：

```gdscript
lambda.call(42) # Prints `42`.
```

Lambda 函数还可用于代码调试（其名称会显示在调试器上）：

```gdscript
var lambda = func my_lambda(x):
    print(x)
```

你也可以像普通函数那样为 Lambda 函数添加类型提示：

```gdscript
var lambda := func (x: int) -> void:
    print(x)
```

注意，若想要在 Lambda 函数中返回值，必须显式使用 `return` 关键字进行返回（即无法省略 `return`）：

```gdscript
var lambda = func (x): return x ** 2
print(lambda.call(2)) # Prints `4`.
```

Lambda 函数可以捕获局部环境：

```gdscript
var x = 42
var lambda = func ():
    print(x) # Prints `42`.
lambda.call()
```

> **警告**
>
> 创建 Lambda 函数时，Lambda 函数只会捕获一次局部变量的值，如果在 Lambda 函数外重新为该局部变量赋值，则其值不会在 Lambda 函数内更新：
>
> ```gdscript
> var x = 42
> var lambda = func (): print(x)
> lambda.call() # Prints `42`.
> x = "Hello"
> lambda.call() # Prints `42`.
> ```
>
> 此外，Lambda 函数也无法给外部的局部变量重新赋值。退出 Lambda 函数体后该变量不会发生改变，因为 Lambda 函数中捕获的版本隐式覆盖了该变量：
>
> ```gdscript
> var x = 42
> var lambda = func ():
>     print(x) # Prints `42`.
>     x = "Hello" # Produces the `CONFUSABLE_CAPTURE_REASSIGNMENT` warning.
>     print(x) # Prints `Hello`.
> lambda.call()
> print(x) # Prints `42`.
> ```
>
> 不过，如果你使用的是通过引用传递的数据类型（如数组、字典、对象等）的话，那么在你为这些变量重新赋值之前，这些变量会共享其内容更改：
>
> ```gdscript
> var a = []
> var lambda = func ():
>     a.append(1)
>     print(a) # Prints `[1]`.
>     a = [2] # Produces the `CONFUSABLE_CAPTURE_REASSIGNMENT` warning.
>     print(a) # Prints `[2]`.
> lambda.call()
> print(a) # Prints `[1]`.
> ```

##### 静态函数

函数可以声明为静态函数。静态函数无法通过`self`关键字访问实例的成员变量，但可以访问静态变量，非常适用于创建辅助函数库：

```gdscript
static func sum2(a, b):
    return a + b
```

Lambda 函数不可声明为静态函数。

见静态变量和静态构造函数。

##### 可变参数函数

可变参数函数（Variadic function）是一种可以接受任意数量参数的函数。从 Godot 4.5 版本开始，GDScript 正式支持可变参数函数。要声明一个可变参数函数，你需要使用 *rest 参数（rest parameter）* ，它会将所有多余的参数统一收集到一个数组（Array）里。

```gdscript
func my_func(a, b = 0, ...args):
    prints(a, b, args)

func _ready():
    my_func(1)             # 1 0 []
    my_func(1, 2)          # 1 2 []
    my_func(1, 2, 3)       # 1 2 [3]
    my_func(1, 2, 3, 4)    # 1 2 [3, 4]
    my_func(1, 2, 3, 4, 5) # 1 2 [3, 4, 5]
```

一个函数最多可拥有一个剩余参数，且剩余参数必须位于参数列表的最后一位。剩余参数不可赋予默认值。静态函数和Lambda函数均可变为可变参数函数。

静态类型也适用于可变参数函数，但类型化数组目前不能作为剩余参数的类型使用：

```gdscript
# You cannot specify `...values: Array[int]`.
func sum(...values: Array) -> int:
    var result := 0
    for value in values:
        assert(value is int)
        result += value
    return result
```

> **备注**
>
> 虽然可以用剩余参数定义可变参数函数，但GDScript目前不支持用某些语言（如JavaScript、PHP等）中的*展开语法*来调用可变参数函数，不过你可以通过调用 `callv()` 函数来调用可变参数函数，调用时需要传入实际参数所组成的数组：
>
> ```gdscript
> func test_func(...args):
>     #log_data(...args) # This won't work.
>     log_data.callv(args) # This will work.
>
> func log_data(...values):
>     # You should use `callv()` if you want to pass `values` as the argument list,
>     # rather than passing the array as the first argument.
>     prints.callv(values)
>     # You can use array concatenation to prepend/append the argument list.
>     write_data.callv(["user://log.txt"] + values)
>
> func write_data(path, ...values):
>     # ...
> ```

##### 抽象函数

参见 抽象类与抽象方法.

#### 语句与流程控制

标准的语句可以是赋值、函数调用以及流程控制结构等（见下方）。`;` 为语句分隔符，在使用时可写可略。

##### 表达式

表达式是运算符和操作数的有序排列，尽管表达式本身可以构成一个语句，但仅函数调用才适合作为语句使用，因为其他类型的表达式通常不会产生副作用。

表达式返回的数值可赋值给有效目标，而某些运算符的操作数也可以变成一条表达式。赋值语句因无返回值而不能作为表达式使用。

以下是一些表达式的示例：

```gdscript
2 + 2 # Binary operation.
-5 # Unary operation.
"okay" if x > 4 else "not okay" # Ternary operation.
x # Identifier representing variable or constant.
x.a # Attribute access.
x[4] # Subscript access.
x > 2 or x < 5 # Comparisons and logic operators.
x == y + 2 # Equality test.
do_something() # Function call.
[1, 2, 3] # Array definition.
{A = 1, B = 2} # Dictionary definition.
preload("res://icon.svg") # Preload builtin function.
self # Reference to current instance.
```

标识符、对象属性和下标均可视为表达式有效的赋值目标，而在赋值语句中，表达式不能位于赋值等号左侧。

###### self

`self` 可用于引用当前实例，通常等同于直接引用当前脚本中的可用符号。不过你还可以通过 `self` 访问动态定义的属性、方法和其他名称（即应当在当前类的子类中定义，或使用 _set() 和/或 _get() 提供）。

```gdscript
extends Node

func _ready():
    # Compile time error, as `my_var` is not defined in the current class or its ancestors.
    print(my_var)
    # Checked at runtime, thus may work for dynamic properties or descendant classes.
    print(self.my_var)

    # Compile time error, as `my_func()` is not defined in the current class or its ancestors.
    my_func()
    # Checked at runtime, thus may work for descendant classes.
    self.my_func()
```

> **警告**
>
> 请注意，通常认为在基类中访问子类的成员是一种不良实践，因为这会使所有代码的责任范围都变得模糊，让游戏中各部分之间的整体关系变得更加难以判断。除此之外，人们还可能会忘记父类对其子类存在这些要求。

##### if/else/elif

条件句通过使用 `if`/`else`/`elif` 语法创建。条件中的括号可写可不写。考虑到基于制表符缩进的性质，可以使用 `elif` 而非 `else`/`if` 来保持缩进级别相同。

```gdscript
if (expression):
    statement(s)
elif (expression):
    statement(s)
else:
    statement(s)
```

短的语句可以与条件句写在同一行内：

```gdscript
if 1 + 1 == 2: return 2 + 2
else:
    var x = 3 + 3
    return x
```

有时你可能希望基于布尔表达式来赋予不同的初始值，为此，三元表达式将派上用场：

```gdscript
var x = (value) if (expression) else (value)
y += 3 if y < 10 else -1
```

可以通过嵌套三元表达式来处理的超过两种可能性的情况。嵌套时，推荐把三元 if 表达式拆分为多行以保证代码的可读性：

```gdscript
var count = 0

var fruit = (
        "apple" if count == 2
        else "pear" if count == 1
        else "banana" if count == 0
        else "orange"
)
print(fruit)  # banana

# Alternative syntax with backslashes instead of parentheses (for multi-line expressions).
# Less lines required, but harder to refactor.
var fruit_alt = \
        "apple" if count == 2 \
        else "pear" if count == 1 \
        else "banana" if count == 0 \
        else "orange"
print(fruit_alt)  # banana
```

你可能还想要检查某个值是否包含在某些容器之中，可以通过 `if` 语句与 `in` 运算符组合来实现：

```gdscript
# Check if a letter is in a string.
var text = "abc"
if 'b' in text: print("The string contains b")

# Check if a variable is contained within a node.
if "varName" in get_parent(): print("varName is defined in parent!")
```

##### while

一般的循环通过 `while` 语法创建，可以使用 `break` 来跳出整个循环，或者使用 `continue` 来跳出当前批次的循环并进入下一轮的循环当中（但会将该关键字下方所有在该循环体内的语句全部跳过）：

```gdscript
while (expression):
    statement(s)
```

##### for

要迭代一个范围，例如数组或表，请使用 *for* 循环。迭代数组时，当前数组元素被存储在循环变量中。迭代字典时，*键* 被存储在循环变量中。

```gdscript
for x in [5, 7, 11]:
    statement # Loop iterates 3 times with 'x' as 5, then 7 and finally 11.

var names = ["John", "Marta", "Samantha", "Jimmy"]
for name: String in names: # Typed loop variable.
    print(name) # Prints name's content.

var dict = {"a": 0, "b": 1, "c": 2}
for i in dict:
    print(dict[i]) # Prints 0, then 1, then 2.

for i in range(3):
    statement # Similar to [0, 1, 2] but does not allocate an array.

for i in range(1, 3):
    statement # Similar to [1, 2] but does not allocate an array.

for i in range(2, 8, 2):
    statement # Similar to [2, 4, 6] but does not allocate an array.

for i in range(8, 2, -2):
    statement # Similar to [8, 6, 4] but does not allocate an array.

for c in "Hello":
    print(c) # Iterate through all characters in a String, print every letter on new line.

for i in 3:
    statement # Similar to range(3).

for i in 2.2:
    statement # Similar to range(ceil(2.2)).
```

若需要在数组迭代时对数组进行赋值操作，则推荐使用 `for i in array.size()` 来进行该操作。

```gdscript
for i in array.size():
    array[i] = "Hello World"
```

循环变量只属于该循环，为其赋值并不会更改数组的值。如果循环变量是通过引用传递的对象（如节点），则仍可通过调用其方法来操作所指向的对象。

```gdscript
for string in string_array:
    string = "Hello World" # This has no effect

for node in node_array:
    node.add_to_group("Cool_Group") # This has an effect
```

##### match

`match` 语句用于分支流程的执行，相当于在许多其他语言中出现的 `switch` 语句，但提供了一些附加功能。

> **警告**
>
> `match` 对类型的要求比 `==` 运算符更严格。例如 `1` 和 `1.0` 是**不匹配**的。唯一的例外是 `String` 和 `StringName` 的匹配：例如会认为字符串 `"hello"` 和 StringName `&"hello"` 相等。

###### 基本语法

```gdscript
match <test value>:
    <pattern(s)>:
        <block>
    <pattern(s)> when <pattern guard>:
        <block>
    <...>
```

###### 给熟悉 switch 语句的人提供的速成课程

1. 将 `switch` 替换为 `match`。
2. 删除 `case`。
3. 删除 `break`。
4. 将 `default` 替换为单个下划线。

###### 流程控制

按照从上到下的顺序进行模式匹配。匹配成功时，会执行第一个对应的代码块。执行完成后，会继续执行 `match` 语句后的内容。

> **备注**
>
> 3.x 版本支持在 `match` 中使用 `continue` 执行特殊行为，此行为已在 Godot 4.0 中移除。

可以使用以下模式类型：

- **字面量模式**

  匹配字面量：

  ```gdscript
  match x:
      1:
          print("We are number one!")
      2:
          print("Two are better than one!")
      "test":
          print("Oh snap! It's a string!")
  ```
- **表达式模式**

  匹配表达式常量、标识符或属性访问（`A.B`）：

  ```gdscript
  match typeof(x):
      TYPE_FLOAT:
          print("float")
      TYPE_STRING:
          print("text")
      TYPE_ARRAY:
          print("array")
  ```
- **通配符模式**

  匹配所有内容，用一个下划线来表示通配内容。

  可以与其他语言的 `switch` 语句中的 `default` 等效：

  ```gdscript
  match x:
      1:
          print("It's one!")
      2:
          print("It's one times two!")
      _:
          print("It's not 1 or 2. I don't care to be honest.")
  ```
- **绑定模式**

  绑定模式引入一个新的变量，与通配符模式类似匹配所有内容，并将值赋给这个新的变量，在数组和字典模式中特别有用：

  ```gdscript
  match x:
      1:
          print("It's one!")
      2:
          print("It's one times two!")
      var new_var:
          print("It's not 1 or 2, it's ", new_var)
  ```
- **数组模式**

  匹配一个数组，数组模式的每个元素本身都可以是一个模式，因此可以对其进行嵌套。

  首先检测数组的长度，其长度必须与语句块条件的数组长度相同，否则不匹配。

  **开放式数组**：将最后一个子模式写成 `..` 就可以允许匹配长度超过模式中数组长度的数组。

  每个子模式都必须用逗号分隔开来。

  ```gdscript
  match x:
      []:
          print("Empty array")
      [1, 3, "test", null]:
          print("Very specific array")
      [var start, _, "test"]:
          print("First element is ", start, ", and the last is \"test\"")
      [42, ..]:
          print("Open ended array")
  ```
- **字典模式**

  作用方式同数组模式，且每个键必须为一个常量模式。

  首先检测字典的大小，其大小必须与语句块条件的字典大小相同，否则不匹配。

  **开放式字典**：将最后一个子模式写成 `..` 就可以允许匹配大小超过模式中字典大小的字典。

  每个子模式都必须用逗号分隔开。

  若不指定键的值，则仅检查键的存在。

  值模式与键模式之间以 `:` 分隔。

  ```gdscript
  match x:
      {}:
          print("Empty dict")
      {"name": "Dennis"}:
          print("The name is Dennis")
      {"name": "Dennis", "age": var age}:
          print("Dennis is ", age, " years old.")
      {"name", "age"}:
          print("Has a name and an age, but it's not Dennis :(")
      {"key": "godotisawesome", ..}:
          print("I only checked for one entry and ignored the rest")
  ```
- **多重模式**

  你还可以用逗号来分隔同一语句块条件里的多个模式，这些模式不允许包含任何绑定。

  ```gdscript
  match x:
      1, 2, 3:
          print("It's 1 - 3")
      "Sword", "Splash potion", "Fist":
          print("Yep, you've taken damage")
  ```

###### 模式防护

*模式防护*（Pattern Guard）是一个跟在模式列表后面的可选条件，可以用来在选择 `match` 分支之前进行额外的检查。与模式不同，模式防护可以是任意表达式。

一个 `match` 只会执行一个分支。选中某个分支后就不会再检查其他分支。如果希望让多个分支使用同一个模式，或者想要防止选中某个模式过于宽泛的分支，你可以在模式列表后用 `when` 关键字指定防护表达式：

```gdscript
match point:
    [0, 0]:
        print("Origin")
    [_, 0]:
        print("Point on X-axis")
    [0, _]:
        print("Point on Y-axis")
    [var x, var y] when y == x:
        print("Point on line y = x")
    [var x, var y] when y == -x:
        print("Point on line y = -x")
    [var x, var y]:
        print("Point (%s, %s)" % [x, y])
```

- 如果没有匹配当前分支的模式，就**不会**对防护表达式求值，程序将检查下一个分支的模式。
- 如果识别到匹配的模式，就会对防护表达式求值。

  - 值为 true 时，就会执行分支的内容，然后结束 `match`。
  - 值为 false 时，就会继续检查下一个分支的模式。

#### 类

默认情况下，所有脚本文件都是未命名的类，这时只能使用文件的路径来引用这些无名类（相对路径或绝对路径）。如果你将脚本文件命名为 `character.gd`的话：

```gdscript
# Inherit from 'character.gd'.

extends "res://path/to/character.gd"

# Load character.gd and create a new node instance from it.

var Character = load("res://path/to/character.gd")
var character_node = Character.new()
```

##### 注册具名类

你也可以使用 `class_name` 关键字来为你的类起名，将其注册为 Godot 编辑器中的新类型。你还可以配合使用 `@icon` 注解，向其括号中输入图片的路径，将该图片作为该类的图标使用。这样，你的类就会和新的图标一起显示在编辑器中：

```gdscript
# item.gd

@icon("res://interface/icons/item.png")
class_name Item
extends Node
```

> **小技巧**
>
> SVG 图片在用作自定义节点图标时，需要在该图片的 导入选项 中将 **编辑器 > 依照编辑器比例缩放** 与 **编辑器 > 依照编辑器主题转换颜色** 勾选，这样才能让有跟 Godot 图标色调相同的图标在编辑器中能够同步其缩放、同步其主题设置。

这是一个类文件示例：

```gdscript
# Saved as a file named 'character.gd'.

class_name Character

var health = 5

func print_health():
    print(health)

func print_this_script_three_times():
    print(get_script())
    print(ResourceLoader.load("res://character.gd"))
    print(Character)
```

如果你还想要用 `extends`，就可以将这两个关键字写在同一行：

```gdscript
class_name MyNode extends Node
```

具名类会注册到全局空间当中，这样其他脚本就可以直接引用这些具名类，无需通过`load`或`preload`来加载它们。

```gdscript
var player

func _ready():
    player = Character.new()
```

> **备注**
>
> 由于脚本可以在用户不知情的情况下在单独的线程中初始化，出于线程安全考虑，Godot 在每次创建实例时，引擎都会初始化非静态变量，其中就包括数组和字典。

> **警告**
>
> Godot 编辑器会在“新建节点”和“新建场景”对话框窗口中隐藏名称以“Editor”开头的自定义类。这些类可以在运行时通过类名进行实例化，但会与 Godot 编辑器使用的内置编辑器节点一起被编辑器窗口自动隐藏。

##### 抽象类与抽象方法

从 Godot 4.5 版本起，你可以通过`@abstract`注解来定义抽象类和抽象方法。

抽象类是一种无法直接实例化的类，主要功能是被其他类继承。尝试实例化抽象类会报错。

抽象方法是一种没有实现的方法，因此函数头之后应当为换行或分号。抽象方法定义的是派生类所必须遵守的契约，覆盖方法时签名必须兼容。

派生类必须为所有抽象方法都提供实现，否则就必须将它标记为抽象类。如果类中至少存在一个抽象方法（可以是自己定义的，也可以是继承但没实现的），那么也必须标记为抽象类。反之则不然：抽象类可以不包含抽象方法。

> **小技巧**
>
> 如果要声明一个可选择重写的方法，应使用非抽象方法并提供其默认实现。

例如：你可以有一个叫`Shape`的抽象类，其中定义了一个叫`draw()`的抽象方法，然后你可以再创建几个子类（如`Circle`、`Square`）来实现其各自的`draw()`方法，这样就可以给所有形状定义一个通用的*接口*，无需在抽象类里实现其细节。

```gdscript
@abstract class Shape:
    @abstract func draw()

# This is a concrete (non-abstract) subclass of Shape.
# You **must** implement all abstract methods in concrete classes.
class Circle extends Shape:
    func draw():
        print("Drawing a circle.")

class Square extends Shape:
    func draw():
        print("Drawing a square.")
```

内部类和通过`class_name`声明的类都可以是抽象类，下例创建了两个抽象类，其中一个类为另一个抽象类的子类。

```gdscript
@abstract
class_name AbstractClass
extends Node

@abstract class AbstractInnerClass:
    func _ready():
        pass

# This is an example of a concrete subclass of `AbstractInnerClass`.
# This class can be instantiated using `AbstractClass.ConcreteInnerClass.new()`
# in other scripts, even though it's part of an abstract `class_name` script.
class ConcreteInnerClass extends AbstractInnerClass:
    func _ready():
        print("Concrete class ready.")
```

> **警告**
>
> 由于抽象类无法被实例化，因此无法将抽象类所在的脚本附加到节点上。如果你尝试这样做，引擎将会在运行场景时将打印报错：
>
> ```
> Cannot set object script. Script '<path to script>' should not be abstract.
> ```

未具名类也可以定义为抽象类，但`@abstract`注解必须附加在`extends`关键字之前。

```gdscript
@abstract
extends Node
```

##### 继承

类（以文件形式保存）可以继承自：

- 全局类。
- 另一个类文件。
- 另一个类文件中的内部类。

不允许多重继承。

继承使用 `extends` 关键字：

```gdscript
# Inherit/extend a globally available class.
extends SomeClass

# Inherit/extend a named class file.
extends "somefile.gd"

# Inherit/extend an inner class in another file.
extends "somefile.gd".SomeInnerClass
```

> **备注**
>
> 如果没有显式指定继承的类，则默认该类继承自 RefCounted。

要检查给定的实例是否继承自给定的类，可以使用 `is` 关键字：

```gdscript
# Cache the enemy class.
const Enemy = preload("enemy.gd")

# [...]

# Use 'is' to check inheritance.
if entity is Enemy:
    entity.apply_damage()
```

要调用*基类*（即当前类的 `extends` 关键字后的类）中的函数，请使用 `super` 关键字：

```gdscript
super(args)
```

由于子类中的函数会替换基类中同名的函数，因此若仍然想调用在基类中的该函数，则可以使用 `super` 关键字：

```gdscript
func some_func(x):
    super(x) # Calls the same function on the super class.
```

如果需要调用父类中的其他方法，可以用属性运算符指定函数名称：

```gdscript
func overriding():
    return 0 # This overrides the method in the base class.

func dont_override():
    return super.overriding() # This calls the method as defined in the base class.
```

> **警告**
>
> 开发者通常会误以为可以覆写引擎内的*非虚*方法，如 `get_class()`、`queue_free()` 等。出于技术性原因，暂不支持这种操作。
>
> 在 Godot 3 中，你可以在 GDScript 中*隐藏*引擎方法，在 GDScript 中调用时执行的就是你所定义的版本。然而如果是引擎内部需要调用该方法，那么引擎所执行的就**不是**你所定义的版本。
>
> Godot 4 的 GDScript 对内置方法的调用机制进行了优化，很多时候都无法再使用同名方法来隐藏了。鉴于此，我们增添了 `NATIVE_METHOD_OVERRIDE` 警告选项，默认会对这种情况报错。我们强烈建议保持该选项开启，不要作为警告而忽略之。
>
> 请注意，`_ready()`、`_process()` 等（在文档中标为 `virtual` 且以下划线开头的）虚方法不受此限制。这些方法是专门用于自定义引擎行为的方法，可在 GDScript 中覆盖。信号、通知也可用于自定义引擎行为。

##### 类的构造函数

类的构造函数名为 `_init`，会在类进行初始化时调用 。若想要在构造函数中调用父类的构造函数，同样可以使用 `super` 语法。请注意，每个类都有一个隐式构造函数，始终由引擎调用（用来定义类变量的默认值）。`super` 则用于调用显式构造函数：

```gdscript
func _init(arg):
   super("some_default", arg) # Call the custom base constructor.
```

通过示例可以更好地说明这一点。考虑一下这种情况：

```gdscript
# state.gd (inherited class).
var entity = null
var message = null

func _init(e = null):
    entity = e

func enter(m):
    message = m

# idle.gd (inheriting class).
extends "state.gd"

func _init(e = null, m = null):
    super(e)
    # Do something with 'e'.
    message = m
```

这里有几点需要牢记：

1. 如果被继承的类（`state.gd`）定义了一个带有参数（此处的 `e`）的 `_init` 构造函数，那么继承的类（`idle.gd`）也*必须*定义 `_init`，并且要将适当的参数传递给 `state.gd` 的 `_init`。
2. `Idle.gd` 的构造函数的参数数量可以与基类 `State.gd` 的构造函数的参数数量有所不同。
3. 在上面的示例中，传递给 `State.gd` 构造函数的 `e` 与传递给 `Idle.gd` 的 `e` 是相同的。
4. 如果 `idle.gd` 的 `_init` 构造函数不接受任何参数，即便该构造函数即便什么也不做，也仍然需要将一些值传递给 `state.gd` 父类。因此我们除了可以给基类构造函数传变量之外，还可以传表达式，例如：

```gdscript
# idle.gd

func _init():
    super(5)
```

##### 静态构造函数

静态构造函数是名为 `_static_init` 的静态函数。载入类时，静态变量初始化后会自动调用该函数：

```gdscript
static var my_static_var = 1

static func _static_init():
    my_static_var = 2
```

静态构造函数不能含有任何参数，不能返回值。

##### 内部类

类文件可以包含内部类。内部类使用 `class` 关键字定义，用 `类名.new()` 函数来进行实例化。

```gdscript
# Inside a class file.

# An inner class in this class file.
class SomeInnerClass:
    var a = 5

    func print_value_of_a():
        print(a)

# This is the constructor of the class file's main class.
func _init():
    var c = SomeInnerClass.new()
    c.print_value_of_a()
```

##### 类作为资源

以文件形式存储的类会作为 GDScript 处理。这些类必须先从磁盘加载，然后才能在其他类中访问。加载可以通过调用 `load` 或 `preload` 函数来完成（见下文）。对已加载的类资源进行实例化则是通过调用类对象上的 `new` 函数来完成的：

```gdscript
# Load the class resource when calling load().
var MyClass = load("myclass.gd")

# Preload the class only once at compile time.
const MyClass = preload("myclass.gd")

func _init():
    var a = MyClass.new()
    a.some_function()
```

#### 导出

> **备注**
>
> 有关导出的文档已移至 GDScript 导出属性。

#### 属性（setter 与 getter）

有时，你可能不止希望对类成员进行数据存储操作，甚至想要在更改成员值的时候对其进行有效性检查操作或运算操作。你也可能希望以某种方式对该类成员的访问进行封装。

鉴于此，GDScript 提供了一套特别的语法，可以在变量声明后使用 `set`、`get` 关键字定义属性。关键字后你可以用一个语句块定义变量被读写时被执行的代码。

示例：

```gdscript
var milliseconds: int = 0
var seconds: int:
    get:
        return milliseconds / 1000
    set(value):
        milliseconds = value * 1000
```

> **备注**
>
> 与之前的 Godot 版本中的 `setget` 不同，即使在同一个类中进行访问（不管是否添加 `self.` 前缀），也**始终**会调用属性的 `set` 方法和 `get` 方法（例外见下文） 。这样访问属性时的行为就一致了。如果你需要直接访问实际的值，请再添加一个变量用于直接访问，然后在属性相关的代码中使用这个变量的变量名。

##### 替代语法

如果你想要拆分实现代码和变量声明，或者需要让多个属性共用相同的代码（此时无法区分调用的是哪个属性的 setter/getter），也有另一种写法：

```gdscript
var my_prop:
    get = get_my_prop, set = set_my_prop
```

也可以将这个写法缩在同一行内写：

```gdscript
var my_prop: get = get_my_prop, set = set_my_prop
```

Setter 函数和 Getter 函数在给一个变量定义时必须使用相同的定义格式，不允许混合使用这两种定义格式。

> **备注**
>
> 不允许对 *匿名*setter 函数和 getter 函数进行类型指定，以减少代码的重复抄写量。若变量含有指定的类型，则其 setter 函数的参数会自动转换到相同的类型，同时其 getter 函数的返回值类型也必须与该类型相配。具名 setter/getter 函数允许指定类型提示，但这些函数的设值/返回类型必须与该属性的类型或该类型的广义类型相配。

##### Setter/getter 函数不会被调用的情况

变量在进行初始化时，其初始值会直接赋予给该变量，包括 `@onready` 注解所修饰的变量也是如此。

在一个变量的 setter 函数和 getter 函数内访问该变量的变量名，会直接访问该变量所代表的成员属性，不会导致 setter 函数和 getter 函数被无限次迭代调用，同时避免了显式声明另一个变量：

```gdscript
signal changed(new_value)
var warns_when_changed = "some value":
    get:
        return warns_when_changed
    set(value):
        changed.emit(value)
        warns_when_changed = value
```

这种情况也同样适用于替代语法：

```gdscript
var my_prop: set = set_my_prop

func set_my_prop(value):
    my_prop = value # No infinite recursion.
```

> **警告**
>
> 这种例外**不适用**于 setter/getter 中调用的其他函数。下面的示例代码**会**造成无限递归：

```gdscript
var my_prop:
    set(value):
        set_my_prop(value)

func set_my_prop(value):
    my_prop = value # Infinite recursion, since `set_my_prop()` is not the setter.
```

#### 工具模式

默认情况下，脚本不会在编辑器内运行，只有更改导出的属性这一操作会在编辑器内运行。在某些情况下，我们确实希望这些代码能在编辑器中运行（只要这些代码不执行游戏逻辑，也可以手动避免之）。为此可以用 `@tool` 注解，必须将其写在文件的顶部：

```gdscript
@tool
extends Button

func _ready():
    print("Hello")
```

详情见 在编辑器中运行代码。

> **警告**
>
> 由于工具脚本是在编辑器中运行代码的，故在工具脚本中使用 `queue_free()` 或 `free()` 释放节点时需要谨慎（尤其是对脚本所有者本身使用的时候更是如此）。对工具脚本滥用释放节点代码可能会导致编辑器崩溃。

#### 内存管理

Godot 实现了引用计数来释放某些不再使用的实例，而非通过垃圾收集器，或者需要纯手动管理。RefCounted 类（或继承该类的任何类，例如 Resource）的任何实例在不再使用时将自动释放。对于非 RefCounted 类（例如 Node 或基本 Object 类型）的实例，它将保留在内存中，直到使用 `free()` （对于节点则使用 `queue_free()`）删除。

> **备注**
>
> 如果通过 `free()` 或 `queue_free()` 删除 Node，则它的所有子节点也将会被递归删除。

为了避免造成无法释放的循环引用，Godot 提供了用于创建弱引用的 WeakRef 类，可以访问到对象，但是不会阻止 RefCounted 的释放。见下例：

```gdscript
extends Node

var my_file_ref

func _ready():
    var f = FileAccess.open("user://example_file.json", FileAccess.READ)
    my_file_ref = weakref(f)
    # the FileAccess class inherits RefCounted, so it will be freed when not in use

    # the WeakRef will not prevent f from being freed when other_node is finished
    other_node.use_file(f)

func _this_is_called_later():
    var my_file = my_file_ref.get_ref()
    if my_file:
        my_file.close()
```

在没有使用引用的情况下，也可以用 `is_instance_valid(instance)` 来检查对象是否已被释放。

#### 信号

信号是从对象中发出消息的工具，其他对象可以对该信号做出反应。要为一个类创建自定义信号，请使用 `signal` 关键字。

```gdscript
extends Node

# A signal named health_depleted.
signal health_depleted
```

> **备注**
>
> 信号是一种[回调](https://zh.wikipedia.org/zh-cn/%E5%9B%9E%E8%B0%83%E5%87%BD%E6%95%B0)机制，同时还充当观察者的角色，这是一种常见的编程模式。有关更多信息，请阅读《游戏编程模式》电子书中的[观察者教程](https://gameprogrammingpatterns.com/observer.html)。

你可以将这些信号连接到方法，就像连接 Button 或 RigidBody3D 等节点的内置信号一样。

在下面的示例中，我们将 `Character` 节点的 `health_depleted` 信号连接到 `Game` 节点上。当 `Character` 节点发出信号时，Game 节点的 `_on_character_health_depleted` 就会被调用：

```gdscript
# game.gd

func _ready():
    var character_node = get_node('Character')
    character_node.health_depleted.connect(_on_character_health_depleted)

func _on_character_health_depleted():
    get_tree().reload_current_scene()
```

可以在发出一个信号时给该信号附带任意数量的参数。

下面这个示例就是该特性的一个不错的实现。假设我们希望屏幕上的生命条能够通过动画对生命值做出反应，但我们希望在场景树中让用户界面与游戏角色保持独立。

在我们的 `character.gd` 脚本中，我们定义了一个 `health_changed` 信号并使用 Signal.emit() 发出它，并从我们场景树中更高的 `Game` 节点发出，我们使用 Signal.connect() 方法将其连接到 `Lifebar`：

```gdscript
# character.gd

...
signal health_changed

func take_damage(amount):
    var old_health = health
    health -= amount

    # We emit the health_changed signal every time the
    # character takes damage.
    health_changed.emit(old_health, health)
...
```

```gdscript
# lifebar.gd

# Here, we define a function to use as a callback when the
# character's health_changed signal is emitted.

...
func _on_Character_health_changed(old_value, new_value):
    if old_value > new_value:
        progress_bar.modulate = Color.RED
    else:
        progress_bar.modulate = Color.GREEN

    # Imagine that `animate` is a user-defined function that animates the
    # bar filling up or emptying itself.
    progress_bar.animate(old_value, new_value)
...
```

在 `Game` 节点中，我们同时获得 `Character` 和 `Lifebar` 节点，然后将发出信号的角色连接到接收者节点上，在本例中 `Lifebar` 为这一接收者节点。

```gdscript
# game.gd

func _ready():
    var character_node = get_node('Character')
    var lifebar_node = get_node('UserInterface/Lifebar')

    character_node.health_changed.connect(lifebar_node._on_Character_health_changed)
```

这样 `Lifebar` 就能够对生命值的变化做出反应，无需将其耦合到 `Character` 节点内。

可以在信号的定义后面添加括号，并在该括号内写入可选的参数名称：

```gdscript
# Defining a signal that forwards two arguments.
signal health_changed(old_value, new_value)
```

这些参数会直接显示在编辑器的信号面板（Signals dock）里，Godot 还能利用它们自动为你生成对应的回调函数。不过，当你在代码里实际发射（emit）信号时，依然可以传递任意数量的参数；至于发射出去的参数值对不对，就全看你自己把控啦。

你还可以通过 Callable.bind() 制作 GDScript 的 Callable 对象的副本，接受额外的参数。如果发出的信号没有提供你所需要的所有数据，就可以通过这种方法为连接添加额外的信息。

信号触发时，回调方法除接收信号参数外，还会收到绑定的值。

接着上面的示例，我们要在屏幕上显示每个角色受到的伤害，例如 `Player1 遭受了 22 伤害。`。然而 `health_changed` 信号并没有给我们提供受到伤害的角色的名称。因此，在我们将信号连接到游戏终端上时，可以在绑定参数这组数据中添加该角色的名称：

```gdscript
# game.gd

func _ready():
    var character_node = get_node('Character')
    var battle_log_node = get_node('UserInterface/BattleLog')

    character_node.health_changed.connect(battle_log_node._on_Character_health_changed.bind(character_node.name))
```

我们的 `BattleLog` 节点会收到绑定的元素，每个元素都是额外的参数：

```gdscript
# battle_log.gd

func _on_Character_health_changed(old_value, new_value, character_name):
    if not new_value <= old_value:
        return

    var damage = old_value - new_value
    label.text += character_name + " took " + str(damage) + " damage."
```

##### 等待信号或协程函数

`await` 关键字可以用来创建[协程](https://zh.wikipedia.org/wiki/%E5%8D%8F%E7%A8%8B)，会等待某个信号发出之后再继续执行下面的代码。对信号或者对同为协程的函数调用使用 `await` 关键字会立即将控制权返回给调用方。发出信号时（或者调用的协程函数完成时），就会从停止的地方继续往下执行代码。

例如，要暂停代码执行，直到到用户按下某个按钮后才能继续往下执行剩余代码，你就可以这样写：

```gdscript
func wait_confirmation():
    print("Prompting user")
    await $Button.button_up # Waits for the button_up signal from Button node.
    print("User confirmed")
    return true
```

此时 `wait_confirmation` 就会变成协程函数，调用方也需要对它进行等待操作：

```gdscript
func request_confirmation():
    print("Will ask the user")
    var confirmed = await wait_confirmation()
    if confirmed:
        print("User confirmed")
    else:
        print("User cancelled")
```

请注意，不使用 `await` 直接请求协程的返回值会触发报错：

```gdscript
func wrong():
    var confirmed = wait_confirmation() # Will give an error.
```

不过如果你不需要结果，那么直接异步调用即可，这样既不会阻止运行，也不会让当前函数变为协程：

```gdscript
func okay():
    wait_confirmation()
    print("This will be printed immediately, before the user press the button.")
```

如果对既不是信号也不是协程的表达式使用 await，则会立即返回对应的值，函数也不会将控制权转交回调用方：

```gdscript
func no_wait():
    var x = await get_five()
    print("This doesn't make this function a coroutine.")

func get_five():
    return 5
```

也就是说，如果从非协程函数中返回信号，那么调用方就会等待那个信号：

```gdscript
func get_signal():
    return $Button.button_up

func wait_button():
    await get_signal()
    print("Button was pressed")
```

> **备注**
>
> 与之前版本 Godot 中的 `yield` 不同，出于类型安全的考虑，现版本无法获取函数状态对象。实现了这种类型安全之后，就不能说函数在返回 `int` 的同时还可能在运行时返回函数状态对象了。

你可以把传递给信号参数的数据给存下来。如果信号里只有一个参数，那么等待（await）获取到的值，将会和这个参数的类型保持一致。

```gdscript
func toggled():
    var signal_args = await $Button.toggled
    assert(typeof(signal_args) == TYPE_BOOL)
```

如果有多个参数，那么等待（await）获取到的值将会是一个 `Array` （数组）类型。

```gdscript
func request_completed():
    var signal_args = await $HTTPRequest.request_completed
    assert(typeof(signal_args) == TYPE_ARRAY)
```

否则（如果没有参数），等待获取到的值将会是 `null` （空值）。

```gdscript
func button_up():
    var signal_args = await $Button.button_up
    assert(signal_args == null)
```

#### Assert 关键字

`assert` 关键字可用于在调试版本中检查断言条件，而在非调试版本中则会忽略掉这些断言，意味着在发布模式下导出的项目中断言语法不会评估作为参数传递的表达式。因此，断言 **决不能** 包含具有副作用的表达式，否则，脚本的行为将取决于该项目是否在调试版本中运行。

```gdscript
# Check that 'i' is 0. If 'i' is not 0, an assertion error will occur.
assert(i == 0)
```

在编辑器中运行项目时，如果发生断言错误，则会暂停该项目的运行。

你还可以传入自定义错误消息，这些消息会在断言失败时显示：

```gdscript
assert(enemy_power < 256, "Enemy is too powerful!")
```
