---
title: Godot 4 GDScript：格式字符串
date: 2026-11-15
tags:
  - 工具
summary: 转载 Godot 官方文档《GDScript 格式字符串》，完整保留原文的占位符说明、示例表格与出处，便于随时对照查阅。
draft: false
---

# Godot 4 GDScript：格式字符串

> 来源：https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/gdscript_format_string.html
> 许可：© 版权所有 2014-present Juan Linietsky, Ariel Manzur and the Godot community（CC BY 3.0）。
> 抓取日期：2026-11-15

## GDScript 格式字符串

Godot 提供了多种动态修改字符串内容的方式：

- 格式化字符串：`var string = "我有 %s 只猫。" % "3"`
- `String.format()` 方法：`var string = "我有 {0} 只猫。".format([3])`
- 字符串连接：`var string = "我有 " + str(3) + " 只猫。"`

本页面将解释如何使用格式化字符串，并简要介绍 `format()` 方法以及字符串连接。

### 格式字符串

*格式字符串*是一种复用文本模板的方法，可以很方便地创建不同但类似的字符串。

格式字符串与普通字符串一样，只不过会包含 `%s` 之类的占位字符序列。这些占位符可以被替换为传递给格式字符串的参数。

可以看一下这个具体的 GDScript 示例：

```gdscript
# Define a format string with placeholder '%s'
var format_string = "We're waiting for %s."

# Using the '%' operator, the placeholder is replaced with the desired value
var actual_string = format_string % "Godot"

print(actual_string)
# Output: "We're waiting for Godot."
```

占位符始终以 `%` 开头，而后面的字符，即*格式说明符*，将决定如何将给定值转换为字符串。

上面的示例中的 `%s` 是最简单的占位符，适用于大多数场合：对值进行转换的方法与使用隐式 String 转换或 [str()](https://docs.godotengine.org/zh-cn/4.x/classes/class_%40globalscope.html#class-globalscope-method-str) 转换相同。字符串不会改变，布尔值会转换成 `"True"` 或 `"False"`，而 `int` 和 `float` 则会表示为十进制数，其他类型的值则通常会返回表示对应数据的人类可读的字符串。

还有其他格式说明符。

### 多个占位符

格式字符串也可以包含多个占位符，在这种情况下，传入的值将以数组的形式进行处理，每个占位符为一个数组元素（除非使用带 `*` 的格式说明符，参见 动态填充）：

```gdscript
var format_string = "%s was reluctant to learn %s, but now he enjoys it."
var actual_string = format_string % ["Estragon", "GDScript"]

print(actual_string)
# Output: "Estragon was reluctant to learn GDScript, but now he enjoys it."
```

注意：这些值是按顺序插入的，切记必须同时替换所有占位符，故必须有适当数量的传入值。

### 格式说明符

除 `s` 之外，在占位符中还有其他格式说明符可以使用。这些格式说明符由一个或多个字符组成，其中一些可以像 `s` 一样独立起效，还有一些则出现在其他字符之前，还有一部分仅适用于特定的值或字符使用。

#### 占位符类型

下列格式说明符中，有且只有一个作为最后一个字符出现。除 `s` 外，其它格式说明符还需要特定类型的参数。

|  |  |
| --- | --- |
| `s` | 通过与隐式 String 转型的相同方法将传入的值**轻松**转换为 String。 |
| `c` | 单个 **Unicode 字符**。需要一个 Unicode 码位（整数）或者单字符的字符串。支持超过 255 的值。 |
| `d` | **十进制整数**。需要整数或实数（向下取整）。 |
| `o` | **八进制整数**。需要整数或实数（向下取整）。 |
| `x` | 字母**小写**的**十六进制整数**。需要整数或实数（向下取整）。 |
| `X` | 字母**大写**的**十六进制整数**。需要整数或实数（向下取整）。 |
| `f` | **十进制实数**。需要整数或实数。 |
| `v` | **向量**。需要任何浮点或基于整数的向量对象（`Vector2`、`Vector3`、`Vector4`、`Vector2i`、`Vector3i` 或 `Vector4i`）。将在括号中显示向量坐标，将每个坐标格式化为 `%f`，并使用相同的修饰符。 |

#### 占位符的修饰符

这些字符在上述占位符前出现. 其中一些只在特定情况下生效.

|  |  |
| --- | --- |
| `+` | 用在数字说明符中，如果为正数则**显示 + 号**。 |
| 整数 | 设置**填充**。用空格填充，如果整数或实数占位符的整数部分以 `0` 开头则用零填充。存在 `-` 时会忽略开头的 `0`。当在 `.` 后使用时，请参阅 `.`。 |
| `.` | 在 `f` 或 `v` 之前，将**精度**十进制位设置为 0。可以跟上要更改精度的数字。用零填充。 |
| `-` | **在右侧填充**而不是左侧。 |
| `*` | **动态填充**，需要存在额外的整数参数，用以设置填充或 `.` 后的精度，见动态填充。 |

### 填充

字符 `.` (*句号*), `*` (*星号*), `-` (*减号*)和数字(`0`-`9`)用于填充. 这允许竖直对齐打印几个值, 就像在一列中使用提供固定宽度的字体一样.

要使字符串满足一个最小长度, 需要在标识符前添加一个整数:

```gdscript
print("%10d" % 12345)
# output: "     12345"
# 5 leading spaces for a total length of 10
```

如果这个整数以 `0` 开头，那么整数值将用零代替空格进行填充：

```gdscript
print("%010d" % 12345)
# output: "0000012345"
```

可以通过添加 `.`（*点*）并后跟一个整数来指定实数的精度。`.` 后没整数时精度为 0，舍入为整数值。要用于填充的整数则必须出现在点之前。

```gdscript
# Pad to minimum length of 10, round to 3 decimal places
print("%10.3f" % 10000.5555)
# Output: " 10000.556"
# 1 leading space
```

`-` 字符将导致向右而不是向左填充, 对文本右对齐很有用:

```gdscript
print("%-10d" % 12345678)
# Output: "12345678  "
# 2 trailing spaces
```

#### 动态填充

通过使用 `*` ( *星号* )字符, 可以在不修改格式字符串的情况下设置填充或精度. 它用于代替格式说明符中的整数. 然后在格式化时传递填充和精度的值:

```gdscript
var format_string = "%*.*f"
# Pad to length of 7, round to 3 decimal places:
print(format_string % [7, 3, 8.8888])
# Output: "  8.889"
# 2 leading spaces
```

通过在 `*` 之前添加 `0` , 仍然可以在整数占位符中填充0:

```gdscript
print("%0*d" % [2, 3])
# Output: "03"
```

### 转义序列

要将文字 `%` 字符插入格式字符串中, 必须对其进行转义以避免将其读取为占位符. 这是通过将字符加倍来完成的:

```gdscript
var health = 56
print("Remaining health: %d%%" % health)
# Output: "Remaining health: 56%"
```

### 字符串格式化方法

在 GDScript 中还有另一种格式化文本的方式，那就是 [String.format()](https://docs.godotengine.org/zh-cn/4.x/classes/class_string.html#class-string-method-format) 方法。该方法将字符串中所有出现的键替换为相应的值，可以处理数组或键值对的字典。

数组可以用作键、索引或混合样式（参见以下示例），仅当使用数组的索引或混合样式时，其顺序才需要引起注意。

GDScript 的一个简单示例：

```gdscript
# Define a format string
var format_string = "We're waiting for {str}"

# Using the 'format' method, replace the 'str' placeholder
var actual_string = format_string.format({"str": "Godot"})

print(actual_string)
# Output: "We're waiting for Godot"
```

#### 格式方法示例

以下是使用 `String.format()` 方法的各种调用的示例。

| **类型** | **样式** | **示例** | **结果** |
| --- | --- | --- | --- |
| 字典 | 键 | `"Hi, {name} v{version}! ".format({ "name":"Godette", "version":"3.0" })` | Hi, Godette v3.0! |
| 字典 | 索引 | `"Hi, {0} v{1}! ".format({ "0":"Godette", "1":"3.0" })` | Hi, Godette v3.0! |
| 字典 | 混合 | `"Hi, {0} v{version}! ".format({ "0":"Godette", "version":"3.0" })` | Hi, Godette v3.0! |
| 数组 | 键 | `"Hi, {name} v{version}! ".format([["version","3.0"], ["name","Godette"]])` | Hi, Godette v3.0! |
| 数组 | 索引 | `"Hi, {0} v{1}! ".format(["Godette","3.0"])` | Hi, Godette v3.0! |
| 数组 | 混合 | `"Hi, {name} v{0}!".format(["3.0", ["name","Godette"]])` | Hi, Godette v3.0! |
| 数组 | 没有索引 | `"Hi, {} v{}!".format(["Godette", "3.0"], "{}")` | Hi, Godette v3.0! |

使用 `String.format` 时也可以自定义占位符，示例如下。

| **类型** | **示例** | **结果** |
| --- | --- | --- |
| 中缀（默认） | `"Hi, {0} v{1} ".format(["Godette", "3.0"], "{_}")` | Hi, Godette v3.0 |
| 后缀 | `"Hi, 0% v1% ".format(["Godette", "3.0"], "_%")` | Hi, Godette v3.0 |
| 前缀 | `"Hi, %0 v%1".format(["Godette", "3.0"], "%_")` | Hi, Godette v3.0 |

结合 `String.format` 方法和 `％` 运算符可能很有用, 因为 `String.format` 没有办法操纵数字的表示.

| **示例** | **结果** |
| --- | --- |
| `"Hi, {0} v{version} ".format({0:"Godette", "version":" %0.2f" % 3.114})` | Hi, Godette v3.11 |

### 字符串连接

你也可以通过使用 `+` 运算符将字符串*连接*起来进行组合。

```gdscript
# Define a base string
var base_string = "We're waiting for "

# Concatenate the string
var actual_string = base_string + "Godot"

print(actual_string)
# Output: "We're waiting for Godot"
```

使用字符串连接时，非字符串类型的值必须使用 `str()` 函数进行转换。无法指定转换值的字符串格式。

```gdscript
var name_string = "Godette"
var version = 3.0
var actual_string = "Hi, " + name_string + " v" + str(version) + "!"

print(actual_string)
# Output: "Hi, Godette v3!"
```

由于这些限制，格式化字符串和 `format()` 方法通常是更好的选择。在许多情况下，字符串连接的可读性也较差。

> **备注**
>
> 在 Godot 的 C++ 代码中，可以通过 [Variant](https://docs.godotengine.org/zh-cn/4.x/classes/class_variant.html#class-variant) 头文件中的 `vformat()` 辅助函数来访问 GDScript 格式字符串。
