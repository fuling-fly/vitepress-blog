---
title: Godot 4 GDScript：动态语言入门
date: 2026-11-15
tags:
  - 工具
summary: 转载 Godot 官方文档《GDScript：动态语言入门》，逐字保留动态类型、数组、字典与鸭子类型的原文，并注明出处。
draft: false
---

# Godot 4 GDScript：动态语言入门

> 来源：https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/gdscript/gdscript_advanced.html（实际抓取地址：https://docs.godotengine.org/zh-cn/stable/tutorials/scripting/gdscript/gdscript_advanced.html）
> 许可：© 版权所有 2014-present Juan Linietsky, Ariel Manzur and the Godot community（CC BY 3.0）。
> 抓取日期：2026-11-15

### GDScript：动态语言入门

#### 关于

本教程旨在粗略介绍使用GDScript更有效的方法，且只关注该语言的常见情况，同时也会涉及许多动态类型语言相关的信息。

对于完全或几乎没有动态类型语言编程经验的程序员而言，本教程将会十分有用。

#### 动态性

##### 动态类型的优缺点

GDScript 是一种动态类型语言，其主要优点为：

- 语言简单易学。
- 大部分代码均可进行快速编写与更改，无任何麻烦。
- 代码简单易读（但可能会有些许杂乱）。
- 无需编译，即用即测。
- 运行时较小。
- 从骨子上就注定了会有鸭子类型和多态这两个特性。

主要缺点有：

- 性能要低于静态类型语言。
- 重构会更加困难（无法追踪符号）。
- 由于表达式解析更为严格，一些通常会在静态类型语言编译时可以检测到的错误只会在运行代码时出现。
- 代码补全的灵活性较低（某些变量的类型只能在运行时确定）。

其实，这也说明了 Godot 旨在通过 GDScript 来快速高效地创建游戏，而对于计算量巨大且无法从引擎内置工具（如向量类型、物理引擎、数学库等）中获得性能提升的游戏，Godot 也提供了使用 C++ 进行代码编写的渠道，依旧允许你使用 GDScript 创建游戏的绝大部分代码，只是在需要性能的地方添加少量 C++ 代码而已。

##### 变量与赋值

动态类型语言中的所有变量都可以是“变体”类型的变量，即这些变量的类型不是固定的，只能通过赋值修改。例如：

静态类型编写示例：

```cpp
int a; // Value uninitialized.
a = 5; // This is valid.
a = "Hi!"; // This is invalid.
```

动态类型编写示例：

```gdscript
var a # 'null' by default.
a = 5 # Valid, 'a' becomes an integer.
a = "Hi!" # Valid, 'a' changed to a string.
```

##### 函数参数的动态类型化：

函数也是动态类型的，即这些函数可以用不同类型的参数调用，例如：

静态类型编写示例：

```cpp
void print_value(int value) {

    printf("value is %i\n", value);
}

[..]

print_value(55); // Valid.
print_value("Hello"); // Invalid.
```

动态类型编写示例：

```gdscript
func print_value(value):
    print(value)

[..]

print_value(55) # Valid.
print_value("Hello") # Valid.
```

##### 指针与引用：

在 C、C++ 等静态语言中（Java 和 C# 某种程度上也是）存在变量和变量的指针/引用的区别，而指针/引用的作用是：如果传的是对原始对象的引用，那么其他函数就可以修改这个对象。

在 C# 或 Java 中，非内置类型（int、float 以及某些情况下 String）的任何类型都要依靠指针或引用，而引用会被自动垃圾回收，也就是这些类型的数据会在不再被使用时删除掉。动态类型的语言也倾向于使用这种内存模型，如：

- C++：

```cpp
void use_class(SomeClass *instance) {

    instance->use();
}

void do_something() {

    SomeClass *instance = new SomeClass; // Created as pointer.
    use_class(instance); // Passed as pointer.
    delete instance; // Otherwise it will leak memory.
}
```

- Java：

```java
@Override
public final void use_class(SomeClass instance) {

    instance.use();
}

public final void do_something() {

    SomeClass instance = new SomeClass(); // Created as reference.
    use_class(instance); // Passed as reference.
    // Garbage collector will get rid of it when not in
    // use and freeze your game randomly for a second.
}
```

- GDScript：

```gdscript
func use_class(instance): # Does not care about class type
    instance.use() # Will work with any class that has a ".use()" method.

func do_something():
    var instance = SomeClass.new() # Created as reference.
    use_class(instance) # Passed as reference.
    # Will be unreferenced and deleted.
```

在 GDScript 中，只有基础类型（int、float、string 和向量类型）会按值传递给函数（通过复制值来传递），而其他所有类型（对象实例、数组、字典等）都会按引用进行传递。继承自 RefCounted 的类（未指定父类时会默认继承该类）的实例在不被使用时释放，而对于继承自 Object 的类则需要手动管理内存。

#### 数组

动态类型语言中的数组，其内部可包含许多混合在一起的不同类型的数据，且始终动态（可以随时调整大小）。 拿静态类型语言中的数组示例作个比较:

```cpp
int *array = new int[4]; // Create array.
array[0] = 10; // Initialize manually.
array[1] = 20; // Can't mix types.
array[2] = 40;
array[3] = 60;
// Can't resize.
use_array(array); // Passed as pointer.
delete[] array; // Must be freed.

// or

std::vector<int> array;
array.resize(4);
array[0] = 10; // Initialize manually.
array[1] = 20; // Can't mix types.
array[2] = 40;
array[3] = 60;
array.resize(3); // Can be resized.
use_array(array); // Passed reference or value.
// Freed when stack ends.
```

而在 GDScript 中：

```gdscript
var array = [10, "hello", 40, 60] # You can mix types.
array.resize(3) # Can be resized.
use_array(array) # Passed as reference.
# Freed when no longer in use.
```

在动态类型语言中，数组还可兼作其他数据类型使用，比如列表：

```gdscript
var array = []
array.append(4)
array.append(5)
array.pop_front()
```

或无序集合：

```gdscript
var a = 20
if a in [10, 20, 30]:
    print("We have a winner!")
```

#### 字典

字典是动态类型语言中的强大工具。许多静态类型语言倾向于使用单独数据结构的情况，在 GDScript 中使用非类型化字典即可。

字典可以完全忽略键或值的数据类型，从而将任意一个值映射到其他值上。由于这些映射可以通过哈希表实现，因此字典十分高效，这一点与目前流行的观点相反。事实上，由于字典的高效性，在一些编程语言里甚至可以用数组的方式来实现字典。

字典示例：

```gdscript
var d = {"name": "John", "age": 22}
print("Name: ", d["name"], " Age: ", d["age"])
```

字典也是动态的，可随时添加或删除一个键，但性能开销很低：

```gdscript
d["mother"] = "Rebecca" # Addition.
d["age"] = 11 # Modification.
d.erase("name") # Removal.
```

大多数情况下，使用字典可以更容易地实现二维数组。这里以一个简单的战舰游戏为例：

```gdscript
# Battleship Game

const SHIP = 0
const SHIP_HIT = 1
const WATER_HIT = 2

var board = {}

func initialize():
    board[Vector2(1, 1)] = SHIP
    board[Vector2(1, 2)] = SHIP
    board[Vector2(1, 3)] = SHIP

func missile(pos):
    if pos in board: # Something at that position.
        if board[pos] == SHIP: # There was a ship! hit it.
            board[pos] = SHIP_HIT
        else:
            print("Already hit here!") # Hey dude you already hit here.
    else: # Nothing, mark as water.
        board[pos] = WATER_HIT

func game():
    initialize()
    missile(Vector2(1, 1))
    missile(Vector2(5, 8))
    missile(Vector2(2, 3))
```

字典还可以用作数据标记或快速结构。GDScript 的字典虽然跟 Python 的字典比较相似，却也支持Lua风格的语法和索引，这一点使得字典对于编写初始状态和快速结构而言非常有用：

```gdscript
# Same example, lua-style support.
# This syntax is a lot more readable and usable.
# Like any GDScript identifier, keys written in this form cannot start
# with a digit.

var d = {
    name = "John",
    age = 22
}

print("Name: ", d.name, " Age: ", d.age) # Used "." based indexing.

# Indexing

d["mother"] = "Rebecca"
d.mother = "Caroline" # This would work too to create a new key.
```

#### For 循环与 while 循环

在一些静态类型的语言中，循环迭代可能会写得非常复杂：

```cpp
const char** strings = new const char*[50];

[..]

for (int i = 0; i < 50; i++) {
    printf("Value: %c Index: %d\n", strings[i], i);
}

// Even in STL:
std::list<std::string> strings;

[..]

for (std::string::const_iterator it = strings.begin(); it != strings.end(); it++) {
    std::cout << *it << std::endl;
}
```

因此，GDScript 做出了大胆的决定——在可迭代项上使用 for 循环，配合 in 关键字来指定迭代范围：

```gdscript
for s in strings:
    print(s)
```

容器数据类型（数组和字典）是可迭代的，其中，字典允许通过键来进行迭代：

```gdscript
for key in dict:
    print(key, " -> ", dict[key])
```

迭代索引也是可以的：

```gdscript
for i in range(strings.size()):
    print(strings[i])
```

range() 函数可包含 3 个参数：

```gdscript
range(n) # Will count from 0 to n in steps of 1. The parameter n is exclusive.
range(b, n) # Will count from b to n in steps of 1. The parameters b is inclusive. The parameter n is exclusive.
range(b, n, s) # Will count from b to n, in steps of s. The parameters b is inclusive. The parameter n is exclusive.
```

C 语言风格的一些 for 循环示例：

```cpp
for (int i = 0; i < 10; i++) {}

for (int i = 5; i < 10; i++) {}

for (int i = 5; i < 10; i += 2) {}
```

用动态类型语言翻译一下：

```gdscript
for i in range(10):
    pass

for i in range(5, 10):
    pass

for i in range(5, 10, 2):
    pass
```

通过指定一个负数来进行反向的循环迭代计数:

```gdscript
for (int i = 10; i > 0; i--) {}
```

用动态类型语言就可以写成：

```gdscript
for i in range(10, 0, -1):
    pass
```

#### While 循环

while() 循环的用法在任何地方都是相同的：

```gdscript
var i = 0

while i < strings.size():
    print(strings[i])
    i += 1
```

#### 自定义迭代器

如果默认的迭代器不太符合你的需求，你可以通过在脚本中重写（override） `_iter_init()` 、 `_iter_next()` 和 `_iter_get()` 这几个函数，来创建属于你自己的自定义迭代器。下面就是一个实现正向迭代器的示例代码：

```gdscript
class ForwardIterator:
    var _start
    var _end
    var _increment

    func _init(start, end, increment):
        _start = start
        _end = end
        _increment = increment

    func _should_continue(current):
        return current < _end

    func _iter_init(iter):
        # Initialize the state to store the current value.
        iter[0] = _start
        return _should_continue(iter[0])

    func _iter_next(iter):
        iter[0] += _increment
        return _should_continue(iter[0])

    func _iter_get(iter):
        # The state is not wrapped in an array for `_iter_get()`.
        # The iteration value is the same as the state.
        return iter
```

可以像其他迭代器一样使用：

```gdscript
var itr = ForwardIterator.new(0, 6, 2)
for i in itr:
    print(i) # Will print 0, 2, and 4.
```

虽然可以将状态存储在成员变量中，但这并不被推荐。在某些情况下（比如嵌套循环，即同一个迭代器实例被同时多次使用），必须维护多个独立的状态。`_iter_init()` 和 `_iter_next()` 中的 `iter` 参数是一个单元素数组，这样状态的更新才能持久保存。而在 `_iter_get()` 中，状态不需要被包裹（成数组），因为它应该是只读的。

从 `_iter_init()` 和 `_iter_next()` 返回 `true`，表示当前迭代器是有效的（还有数据可以继续）。如果返回 `false`，循环就会终止。

更多详情请参见 _iter_init(), _iter_next(), 和 _iter_get().

#### 鸭子类型

从静态类型语言编程迁移到动态类型语言编程，最难掌握的一个概念便是鸭子类型。鸭子类型让整个代码设计更加简单直接，然而其工作方式却并不明显。

举个例子，想象一块大石头从隧道顶上掉下来，把路上的所有东西都砸得粉碎。在静态类型语言中，石头的代码有点像：

```cpp
void BigRollingRock::on_object_hit(Smashable *entity) {

    entity->smash();
}
```

这样，任何能被岩石砸碎的东西都必须继承 Smashable。如果角色、敌人、家具、小石块都易被大石块砸得粉碎，那么这些类均需要继承 Smashable 类，甚至可能还需要多重继承。如果不希望进行多重继承，那么这些类就必须继承类似 Entity 这样的公共类。可是，如果只有区区几个 Entity 能被砸碎的话，在 Entity 中添加一个虚方法 `smash()` 并不是十分优雅的写法。

用动态类型的语言来写这段代码，问题也就迎刃而解了。 在鸭子类型的编程环境下，只需确保在需要的地方定义一个 `smash()` 函数就行了，无需考虑继承、基类等问题。

```gdscript
func _on_object_hit(object):
    object.smash()
```

就是这样，如果被大石块击中的对象有 smash() 方法，那么就会调用该方法，就不需要考虑继承、多态。动态类型语言只在意实例是否具有所需方法或成员，而不在意该实例继承自什么类及该实例的对象类型。鸭子类型的定义会使这一点更加清晰明了：

*“当我看到一只鸟像鸭子一样走路、像鸭子一样游泳、像鸭子一样呱呱叫时，我就管这只鸟叫鸭子”*

在这种情况下，这句话就可以翻译成：

*“如果物体可以被砸碎，那就不要在意这个物体是啥了，只管把这个物体砸碎就完事儿了。”*

没错，称它为绿巨人类型适乎更合适。

不过，被击中的对象可能并没有 smash() 函数。虽然一些动态类型语言在被调用方法不存在时会直接忽略该方法的调用，但GDScript在这方面更为严格，因此有必要检查目标函数是否存在：

```gdscript
func _on_object_hit(object):
    if object.has_method("smash"):
        object.smash()
```

接下来定义下这个方法，大石块所触碰的任何东西就都可以被大石块砸碎了。
