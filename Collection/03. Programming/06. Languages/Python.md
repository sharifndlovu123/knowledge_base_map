# 13. Python


Great for
- 1. Django Concepts
- Flask
# Python Syntax Breakdown

> Still under heavy construction, this is my favorite language so it will have more information than the others. 
> For a universal approach for static programmers Java is used often for examples.

## Basic Structure

```python
# This is a comment
print("Hello, World!")  # Basic output

"""
This is a multi-line comment
or docstring
"""
```

---
## Variables and Data Types

```python
# Variables (no type declaration needed)
name = "Alice"      # String
age = 30            # Integer
height = 5.7        # Float
is_student = True   # Boolean

# Multiple assignment
x, y, z = 1, 2, 3

# Complex data types
my_list = [1, 2, 3, "four"]                  # List (mutable)
my_tuple = (1, 2, 3, "four")                 # Tuple (immutable)
my_dict = {"name": "Alice", "age": 30}       # Dictionary
my_set = {1, 2, 3, 4}                        # Set (unique values)
```

---
## Operators

```python
# Arithmetic operators
sum_result = 10 + 5
difference = 10 - 5
product = 10 * 5
quotient = 10 / 5    # Returns float: 2.0
int_quotient = 10 // 5  # Integer division: 2
remainder = 10 % 3   # Modulus: 1
power = 2 ** 3       # Exponentiation: 8

# Comparison operators
equals = (x == y)
not_equals = (x != y)
greater_than = (x > y)
less_or_equal = (x <= y)

# Logical operators
and_result = (x > 0 and y > 0)
or_result = (x > 0 or y > 0)
not_result = not x > 0

# Membership operators
contains = 1 in my_list
not_contains = 5 not in my_list
```

---
## Control Flow

### Conditionals

```python
# If statement
if age < 18:
    print("Minor")
elif age < 65:
    print("Adult")
else:
    print("Senior")

# Ternary operator (conditional expression)
status = "Adult" if age >= 18 else "Minor"

# Match statement (Python 3.10+)
match day:
    case "Monday":
        print("Start of week")
    case "Friday":
        print("Almost weekend")
    case _:  # Default case
        print("Some other day")
```

### Loops

```python
# For loop
for i in range(5):  # 0, 1, 2, 3, 4
    print(i)

# Looping through collections
for item in my_list:
    print(item)

for key, value in my_dict.items():
    print(f"{key}: {value}")

# List comprehension
squares = [x**2 for x in range(10)]

# While loop
count = 0
while count < 5:
    print(count)
    count += 1

# Loop control
for i in range(10):
    if i == 3:
        continue  # Skip this iteration
    if i == 7:
        break  # Exit the loop
```

---
## Functions

```python
# Basic function
def greet(name):
    return f"Hello, {name}!"

# Function with default parameter
def greet_with_title(name, title="Mr."):
    return f"Hello, {title} {name}!"

# Arbitrary arguments
def sum_all(*args):
    return sum(args)

# Keyword arguments
def build_profile(**kwargs):
    return kwargs

# Lambda functions (anonymous)
square = lambda x: x**2
```

---
## Classes and Objects

```python
# Class definition
class Person:
    # Class variable
    species = "Homo sapiens"
    
    # Constructor
    def __init__(self, name, age):
        # Instance variables
        self.name = name
        self.age = age
    
    # Method
    def greet(self):
        return f"Hello, my name is {self.name}"
    
    # Static method
    @staticmethod
    def is_adult(age):
        return age >= 18
    
    # Class method
    @classmethod
    def create_anonymous(cls):
        return cls("Anonymous", 0)

# Creating an object
person = Person("Alice", 30)
greeting = person.greet()

# Inheritance
class Student(Person):
    def __init__(self, name, age, student_id):
        super().__init__(name, age)
        self.student_id = student_id
```


```python
class Car:
    engine_cls = Engine
    def __init__(self):
        self.engine = self.engine_cls()  # Has-A Engine
    def start(self):
        print(
            f"Starting {self.engine.__class__.__name__} for "
            f"{self.__class__.__name__}... Wroom, wroom!"
        )
        self.engine.start()
    def stop(self):
        self.engine.stop()
        
class RaceCar(Car):  # Is-A Car
    engine_cls = V8Engine
class CityCar(Car):  # Is-A Car
    engine_cls = ElectricEngine
class F1Car(RaceCar):  # Is-A RaceCar and also Is-A Car
    pass  # engine_cls same as parent
    
car = Car()
racecar = RaceCar()
citycar = CityCar()
f1car = F1Car()
cars = [car, racecar, citycar, f1car]
for car in cars:
    car.start()

```

Sharing info to base

```python
# oop/super.explicit.py
class Book:
    def __init__(self, title, publisher, pages):
        self.title = title
        self.publisher = publisher
        self.pages = pages
        
class Ebook(Book):
    def __init__(self, title, publisher, pages, format_):
        Book.__init__(self, title, publisher, pages)
        self.format_ = format_
ebook = Ebook(
    "Learn Python Programming", "Packt Publishing", 500, "PDF"
)
print(ebook.title)  # Learn Python Programming
print(ebook.publisher)  # Packt Publishing
print(ebook.pages)  # 500
print(ebook.format_)  # PDF

```

### Class methods

Class methods are slightly different from static methods in that, like instance methods, they also receive a special first argument. In their case, it is the class object itself, rather than the instance. A very common use case for class methods is to provide factory capability to a class, which means having alternative ways to create instances of the class.


```python
# oop/class.methods.factory.py
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    @classmethod
    def from_tuple(cls, coords):  # cls is Point
        return cls(*coords)
    @classmethod
    def from_point(cls, point):  # cls is Point
        return cls(point.x, point.y)
        
p = Point.from_tuple((3, 7))
print(p.x, p.y)  # 3 7
q = Point.from_point(p)
print(q.x, q.y)  # 3 7

```

Private methods "mangling"
In Python, there is no such thing. Everything is public; therefore, we rely on conventions and, for privacy, on a mechanism called **name mangling**.

```python
class MyClass:
    def __init__(self):
        self.__private_var = 42  # Private variable
    
    def get_private_var(self):
        return self.__private_var
    
    def set_private_var(self, value):
        if value >= 0:
            self.__private_var = value
        else:
            print("Invalid value")

# Create an instance of MyClass
obj = MyClass()

# Access the private variable via getter
print(obj.get_private_var())  # Output: 42

# Modify the private variable via setter
obj.set_private_var(100)
print(obj.get_private_var())  # Output: 100

# Attempt to access the private variable directly (will raise an AttributeError)
# print(obj.__private_var)  # Uncommenting this will raise an error

# Accessing the mangled variable name (not recommended)
print(obj._MyClass__private_var)  # Output: 100

```

use for getters and setters Property decorator

```python
# oop/property.py

class PersonPythonic:
    def __init__(self, age):
        self._age = age
    @property
    def age(self):
        return self._age
    @age.setter
    def age(self, age):
        if 18 <= age <= 99:
            self._age = age
        else:
            raise ValueError("Age must be within [18, 99]")
person = PersonPythonic(39)
print(person.age)  # 39 - Notice we access as data attribute
person.age = 42  # Notice we access as data attribute
print(person.age)  # 42
person.age = 100  # ValueError: Age must be within [18, 99]

```




---
## Exception Handling

```python
try:
    result = 10 / 0  # Will cause ZeroDivisionError
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    print(f"Some other error occurred: {e}")
else:
    print("No exception occurred")
finally:
    print("This always executes")

# Raising exceptions
if age < 0:
    raise ValueError("Age cannot be negative")

# Custom exceptions
class CustomError(Exception):
    pass
```

---
## Modules and Imports

```python
# Importing a module
import math
result = math.sqrt(16)

# Importing specific items
from math import sqrt, pi
result = sqrt(16)

# Import with alias
import numpy as np
arr = np.array([1, 2, 3])

# Import all (not recommended)
from math import *
```

---
## File Operations

```python
# Reading a file
with open("file.txt", "r") as file:
    content = file.read()

# Writing to a file
with open("output.txt", "w") as file:
    file.write("Hello, World!")

# Working with JSON
import json
data = {"name": "Alice", "age": 30}
json_str = json.dumps(data)
parsed_data = json.loads(json_str)
```

---
## List/Dictionary Comprehensions
[[Python#Advanced Comprehensions]]

```python
# List comprehension
even_numbers = [x for x in range(10) if x % 2 == 0]

# Dictionary comprehension
squares_dict = {x: x**2 for x in range(5)}

# Set comprehension
unique_letters = {letter for letter in "mississippi"}
```

---
## Context Managers

```python
# Using with statement for resource management
with open("file.txt") as file:
    data = file.read()
# File is automatically closed after this block
```
Custom context manager:

```python
from contextlib import contextmanager

@contextmanager
def my_manager():
    print("Start")
    yield
    print("End")

with my_manager():
    print("Inside block")
```

---

## Decorators

```python
# Function decorator
def timer(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        print(f"Function took {time.time() - start} seconds")
        return result
    return wrapper

@timer
def slow_function():
    import time
    time.sleep(1)
```


- Modify function behavior dynamically.

```python
def decorator(func):
    def wrapper(*args, **kwargs):
        print("Before function call")
        result = func(*args, **kwargs)
        print("After function call")
        return result
    return wrapper

@decorator
def say_hello():
    print("Hello!")

say_hello()
```


```python
# decorators/time.measure.arguments.py
from time import sleep, time

def f(sleep_time=0.1):
    sleep(sleep_time)
    
def measure(func, *args, **kwargs):
    t = time()
    func(*args, **kwargs)
    print(func.__name__, "took:", time() - t)
    
measure(f, sleep_time=0.3)  # f took: 0.30092811584472656
measure(f, 0.2)  # f took: 0.20505475997924805

```

Advanced Approach

```python
# decorators/time.measure.deco1.py
from time import sleep, time
def f(sleep_time=0.1):
    sleep(sleep_time)
    
def measure(func):
    def wrapper(*args, **kwargs):
        t = time()
        func(*args, **kwargs)
        print(func.__name__, "took:", time() - t)
    return wrapper
    
f = measure(f)  # decoration point
f(0.2)  # f took: 0.20128178596496582
f(sleep_time=0.3)  # f took: 0.30509519577026367
print(f.__name__)  # wrapper  <- ouch!

```


We don’t want to lose the original function’s name and docstring when we decorate with a wrapper, notice how the name changed to wrapper, it should have been measure

```python
# decorators/time.measure.deco2.py
from time import sleep, time
from functools import wraps
def measure(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        t = time()
        func(*args, **kwargs)
        print(func.__name__, "took:", time() - t)
    return wrapper
@measure
def f(sleep_time=0.1):
    """I'm a cat. I love to sleep!"""
    sleep(sleep_time)
f(sleep_time=0.3)  # f took: 0.30042004585266113
print(f.__name__)  # f
print(f.__doc__ )  # I'm a cat. I love to sleep!

```


## A decorator factory

Some decorators can take arguments. This technique is generally used to produce another decorator (in which case, the object could be called a **decorator factory**). Let us look at the syntax, and then we will see an example of it:


```python
# decorators/syntax.py
def func(arg1, arg2, ...):
    pass
func = decoarg(arg_a, arg_b)(func)
# is equivalent to the following:
@decoarg(arg_a, arg_b)
def func(arg1, arg2, ...):
    pass

```

First, `decoarg()` is called with the given arguments, and then its return value (the actual decorator) is called with `func()`.


Cached_property Decorator
```python
# oop/cached.property.py
from functools import cached_property
class CachedPropertyManager:
    @cached_property
    def client(self):
        return Client()
    def perform_query(self, **kwargs):
        return self.client.query(**kwargs)
manager = CachedPropertyManager()
manager.perform_query(object_id=42)
manager.perform_query(name_ilike="%Python%")
del manager.client  # This causes a new Client on next call
manager.perform_query(age_gte=18)

```



---
## Type Hints (Python 3.5+)

```python
def calculate_area(radius: float) -> float:
    """Calculate the area of a circle."""
    import math
    return math.pi * radius ** 2

# With complex types
from typing import List, Dict, Optional

def process_users(users: List[Dict[str, str]]) -> Optional[str]:
    if not users:
        return None
    return users[0]["name"]
```

---
Since you already know the basics, let’s break down **advanced Python syntax** into key concepts with examples:

## Advanced Python
## Unpacking & Extended Unpacking (`*`, `**`)**

- Extract elements from iterables or dictionaries dynamically.

```python
a, *b, c = [1, 2, 3, 4, 5]
print(a, b, c)  # Output: 1 [2, 3, 4] 5
```

For dictionaries:

```python
d1 = {'x': 1, 'y': 2}
d2 = {'z': 3, **d1}
print(d2)  # Output: {'z': 3, 'x': 1, 'y': 2}
```

---

## **Walrus Operator (`:=`)**

- Assign and use a value in an expression.

```python
if (n := len([1, 2, 3])) > 2:
    print(n)  # Output: 3
```

---

## **Lambda with Sorting & Custom Key Functions**

- One-liners for sorting or mapping.

```python
data = [{'name': 'John', 'age': 30}, {'name': 'Jane', 'age': 25}]
data.sort(key=lambda x: x['age'])  # Sorts by age
print(data)
```

---
## **Generator Expressions & Yield**

- Efficient iteration without storing all data in memory.

```python
gen = (x**2 for x in range(5))  # Generator expression
print(next(gen))  # Output: 0
print(next(gen))  # Output: 1

def countdown(n):
    while n > 0:
        yield n
        n -= 1

cd = countdown(3)
print(next(cd))  # Output: 3
print(next(cd))  # Output: 2
```

---

## **Metaclasses (Class of a Class)**

- Modify class behavior dynamically.

```python
class Meta(type):
    def __new__(cls, name, bases, dct):
        dct['created_at'] = '2025'
        return super().__new__(cls, name, bases, dct)

class MyClass(metaclass=Meta):
    pass

print(MyClass.created_at)  # Output: 2025
```

---

## **Coroutines & `asyncio` (Async Programming)**

- Handle multiple tasks concurrently.

```python
import asyncio

async def fetch_data():
    await asyncio.sleep(2)
    return "Data fetched"

async def main():
    result = await fetch_data()
    print(result)

asyncio.run(main())
```

---

## **Pattern Matching (`match-case`)**

- Similar to switch-case in other languages.

```python
def process(value):
    match value:
        case 1:
            return "One"
        case 2:
            return "Two"
        case _:
            return "Something else"

print(process(1))  # Output: One
```

---

## **Function Overloading with `singledispatch`**

- Allows type-specific implementations.

```python
from functools import singledispatch

@singledispatch
def process(val):
    print("Default:", val)

@process.register
def _(val: int):
    print("Integer:", val)

@process.register
def _(val: list):
    print("List:", val)

process(42)    # Integer: 42
process([1, 2, 3])  # List: [1, 2, 3]
process("Hello")    # Default: Hello
```

---

## Iterations
### Permutations
If a set has _N_ elements, then the number of permutations of them is _N!_ (_N_ factorial). For example, the string `ABC` has _3! = 3 * 2 * 1 = 6_ permutations. Let us see this in Python:

```python
# permutations.py
from itertools import permutations
print(list(permutations("ABC")))

```
result = array of : `ABC`: `ABC`, `ACB`, `BAC`, `BCA`, `CAB`, and `CBA`.

---
### Infinite Iterators
Infinite iterators allow you to use a `for` loop as an infinite loop, iterating over a sequence that never ends:

```python
# infinite.py
from itertools import count
for n in count(5, 3):
    if n > 20:
        break
    print(n, end=", ") # instead of newline, comma and space


$ python infinite.py
5, 8, 11, 14, 17, 20,

```

### Iterators terminating on the shortest input sequence

`compress()`. This iterator takes a sequence of _data_ and a sequence of _selectors_, yielding only those values from the data sequence that correspond to `True` values in the selectors sequence. 

For example, `compress("ABC", (1, 0, 1))` would give back `"A"` and `"C"` because they correspond to `1`. Let us see a simple example:

```python
# compress.py
from itertools import compress
data = range(10)
even_selector = [1, 0] * 10
odd_selector = [0, 1] * 10
even_numbers = list(compress(data, even_selector))
odd_numbers = list(compress(data, odd_selector))
print(odd_selector)
print(list(data))
print(even_numbers)
print(odd_numbers)

```

output
```python
$ python compress.py 
[0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1] 
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9] 
[0, 2, 4, 6, 8] 
[1, 3, 5, 7, 9]
```

---

## Parameters
### Variable **Positional** Parameters

Sometimes you may prefer not to specify the exact number of positional parameters to a function; Python provides you with the ability to do this by using **variable positional parameters**

```python
# parameters.variable.positional.py
def minimum(*n):
    # print(type(n))  # n is a tuple
    if n:  # explained after the code
        mn = n[0]
        for value in n[1:]:
            if value < mn:
                mn = value
        print(mn)
minimum(1, 3, -7, 9)  # n = (1, 3, -7, 9) - prints: -7
minimum()  # n = () - prints: nothing

```

---

### Variable keyword parameters

```python
# parameters.variable.keyword.py
def func(**kwargs):
    print(kwargs)
func(a=1, b=42)  # prints {'a': 1, 'b': 42}
func()  # prints {}
func(a=1, b=46, c=99)  # prints {'a': 1, 'b': 46, 'c': 99}

```

Function that connects to a database: we want to connect to a default database by simply calling this function with no parameters.

Realistic Example
```python
# parameters.variable.db.py
def connect(**options):
    conn_params = {
        "host": options.get("host", "127.0.0.1"),
        "port": options.get("port", 5432),
        "user": options.get("user", ""),
        "pwd": options.get("pwd", ""),
    }
    print(conn_params)
    # we then connect to the db (commented out)
    # db.connect(**conn_params)
connect()
connect(host="127.0.0.42", port=5433)
connect(port=5431, user="fab", pwd="gandalf")

```

Result
```python
$ python parameters.variable.db.py
{'host': '127.0.0.1', 'port': 5432, 'user': '', 'pwd': ''}
{'host': '127.0.0.42', 'port': 5433, 'user': '', 'pwd': ''}
{'host': '127.0.0.1', 'port': 5431, 'user': 'fab', 'pwd': 'gandalf'}

```


---
### Positional-only parameters

There is a new function parameter syntax, `/`, indicating that a set of the function parameters must be specified positionally and _cannot_ be passed as keyword arguments. Let us see a simple example:

```python
# parameters.positional.only.py
def func(a, b, /, c):
    print(a, b, c)
func(1, 2, 3)  # prints: 1 2 3
func(1, 2, c=3)  # prints 1 2 3
func(1, b=2, c=3) # error

```

can still be optional
```python
# parameters.positional.only.optional.py
def func(a, b=2, /):
    print(a, b)
func(4, 5)  # prints 4 5
func(3)  # prints 3 2

```

```python
def func_name(name, /, **kwargs):
    print(name)
    print(kwargs)
func_name("Positional-only name", name="Name in **kwargs")
# Prints:
# Positional-only name
# {'name': 'Name in **kwargs'}

```

---
### Keyword-only parameters

```python
# parameters.keyword.only.py
def kwo(*a, c):
    print(a, c)
kwo(1, 2, 3, c=7)  # prints: (1, 2, 3) 7
kwo(c=4)  # prints: () 4
# kwo(1, 2)  # breaks, invalid syntax, with the following error
# TypeError: kwo() missing 1 required keyword-only argument: 'c'

def kwo2(a, b=42, *, c):
    print(a, b, c)
kwo2(3, b=7, c=99)  # prints: 3 7 99
kwo2(3, c=13)  # prints: 3 42 13
# kwo2(3, 23)  # breaks, invalid syntax, with the following error
# TypeError: kwo2() missing 1 required keyword-only argument: 'c'

```

---
### Combining input parameters

Restrictions when ordering: 
- Positional-only parameters come first, followed by a `/`.
- Normal parameters go after any positional-only parameters.
- Variable positional parameters go after normal parameters.
- Keyword-only parameters go after variable positional parameters.
- Variable keyword parameters always go last.
- For positional-only and normal parameters, any required parameters must be defined before any optional parameters. This means that if you have an optional positional-only parameter, all your normal parameters must be optional too. This rule does not affect keyword-only parameters.

samples 
```python
# parameters.all.py
def func(a, b, c=7, *args, **kwargs):
    print("a, b, c:", a, b, c)
    print("args:", args)
    print("kwargs:", kwargs)
func(1, 2, 3, 5, 7, 9, A="a", B="b")

```

Note the order of the parameters in the function definition. The execution of this yields the following:

```python
$ python parameters.all.py
a, b, c: 1 2 3
args: (5, 7, 9)
kwargs: {'A': 'a', 'B': 'b'}

```

Key word sample
```python
# parameters.all.pkwonly.py
def allparams(a, /, b, c=42, *args, d=256, e, **kwargs):
    print("a, b, c:", a, b, c)
    print("d, e:", d, e)
    print("args:", args)
    print("kwargs:", kwargs)
allparams(1, 2, 3, 4, 5, 6, e=7, f=9, g=10)

```

result

```python
$ python parameters.all.pkwonly.py
a, b, c: 1 2 3
d, e: 256 7
args: (4, 5, 6)
kwargs: {'f': 9, 'g': 10}

```

Signature examples

```python
def func_name(positional_only_parameters, /,
    positional_or_keyword_parameters, *,
    keyword_only_parameters):

```
First, we have positional-only, then positional or keyword parameters, and finally keyword-only ones.

Some other valid signatures are presented below:

```python
def func_name(p1, p2, /, p_or_kw, *, kw):
def func_name(p1, p2=None, /, p_or_kw=None, *, kw):
def func_name(p1, p2=None, /, *, kw):
def func_name(p1, p2=None, /):
def func_name(p1, p2, /, p_or_kw):
def func_name(p1, p2, /):

```

Invalid signatures
```python
def func_name(p1, p2=None, /, p_or_kw, *, kw):
def func_name(p1=None, p2, /, p_or_kw=None, *, kw):
def func_name(p1=None, p2, /):

```

---

## `reduce()` in Python

`reduce()` is a function from the `functools` module that applies a given function cumulatively to the elements of an iterable, reducing it to a single value.

#### Syntax:

```python
from functools import reduce
reduce(function, iterable[, initializer])
```

- `function`: A function that takes two arguments.
- `iterable`: The sequence to process.
- `initializer` (optional): A starting value.

#### Example:

```python
from functools import reduce

numbers = [1, 2, 3, 4, 5]
result = reduce(lambda x, y: x + y, numbers)
print(result)  # Output: 15
```

**Explanation**:  
`reduce()` applies `lambda x, y: x + y` like this:  
`(((1 + 2) + 3) + 4) + 5` → `15`

---

## `mul()` in Python

`mul()` (short for multiply) is a function from the `operator` module that performs multiplication on two numbers.

#### Syntax:

```python
from operator import mul
mul(a, b)
```

- `a` and `b` are the two numbers to multiply.

#### Example:

```python
from operator import mul

result = mul(3, 4)
print(result)  # Output: 12
```

#### Using `mul()` with `reduce()`

If you want to multiply all numbers in a list, you can use `reduce()` with `mul()`:

```python
from functools import reduce
from operator import mul

numbers = [1, 2, 3, 4, 5]
product = reduce(mul, numbers)
print(product)  # Output: 120
```

This computes `1 * 2 * 3 * 4 * 5 = 120`.

---

## Recursive method

Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. A recursive function typically has two key parts:

1. **Base Case** – The condition where the function stops calling itself.
2. **Recursive Case** – The part where the function calls itself with a modified argument.

``` python
def factorial(n):
    if n == 1:  # Base case
        return 1
    return n * factorial(n - 1)  # Recursive step

# Example usage
print(factorial(5))  # Output: 120

```

✅ **Good for problems with natural recursive structures**, like:
- Tree traversal
- Graph traversal (DFS)
- Divide and conquer algorithms (Merge Sort, Quick Sort)

### **Example: Factorial Using Recursion**

Factorial of `n` (`n!`) is `n * (n-1) * (n-2) ... * 1`. This can be written recursively as:

```python
def factorial(n):
    if n == 1:  # Base case
        return 1
    return n * factorial(n - 1)  # Recursive case

print(factorial(5))  # Output: 120

```

**How it works:**

```scss
factorial(5) → 5 * factorial(4)
factorial(4) → 4 * factorial(3)
factorial(3) → 3 * factorial(2)
factorial(2) → 2 * factorial(1)
factorial(1) → 1 (Base case)

```

result
```python
1 → 2 → 6 → 24 → 120

```

---

## Anonymous functions

One last type of function that we want to talk about is **anonymous** functions. These functions, which are called **lambdas** in Python, are usually used when a fully-fledged function with its own name would be overkill, and all we want is a quick, simple one-liner.

Here’s a simple example of a **lambda function** in Python:

```python
# Lambda function to add two numbers
add = lambda x, y: x + y

# Using the lambda function
result = add(3, 5)
print(result)  # Output: 8

```

### **Explanation:**

- `lambda x, y: x + y` is an **anonymous function** that takes two arguments (`x` and `y`) and returns their sum.
- The function is assigned to the variable `add`, so it can be used like a normal function.

---

### **More Lambda Examples**

####  Squaring a number:

```python
square = lambda x: x ** 2
print(square(4))  # Output: 16
```

#### Checking if a number is even:

```python
is_even = lambda x: x % 2 == 0
print(is_even(10))  # Output: True
print(is_even(7))   # Output: False
```

#### Using `lambda` inside `map()`:

```python
numbers = [1, 2, 3, 4]
squared_numbers = list(map(lambda x: x ** 2, numbers))
print(squared_numbers)  # Output: [1, 4, 9, 16]
```

#### Using `lambda` inside `filter()`:

```python
numbers = [1, 2, 3, 4, 5, 6]
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # Output: [2, 4, 6]

---

## Function attributes

Every function is a fully fledged object and, as such, it has several attributes. Some of them are special and can be used in an introspective way to inspect the function object at runtime. 

The following script is an example that shows a few of them and how to display their value for an example function:

```python

# func.attributes.py
def multiplication(a, b=1):
    """Return a multiplied by b."""
    return a * b
if __name__ == "__main__":
    special_attributes = [
        "__doc__",
        "__name__",
        "__qualname__",
        "__module__",
        "__defaults__",
        "__code__",
        "__globals__",
        "__dict__",
        "__closure__",
        "__annotations__",
        "__kwdefaults__",
    ]
    for attribute in special_attributes:
        print(attribute, "->", getattr(multiplication, attribute))

```

Output:
``` python
$ python func.attributes.py
__doc__ -> Return a multiplied by b.
__name__ -> multiplication
__qualname__ -> multiplication
__module__ -> __main__
__defaults__ -> (1,)
__code__ -> <code object multiplication at 0x102ce1550,
             file "func.attributes.py", line 2>
__globals__ -> {... omitted ...}
__dict__ -> {}
__closure__ -> None
__annotations__ -> {}
__kwdefaults__ -> None

```
We have omitted the value of the `__globals__` attribute, as it was too big.

NB
You can use the built-in `dir()` function to get a list of all the attributes of any object.

Notice this from the previous code?
```python
if __name__ == "__main__":
```

This line makes sure that whatever follows is only executed when the module is run directly. 
When you run a Python script, Python sets the `__name__` variable to `"__main__"` in that script. 

Conversely, when you import a Python script as a module into another script, the `__name__` variable is set to the name of the script/module being imported.

---

## Python Built-in functions

Python comes with a lot of built-in functions. They are available anywhere, and you can get a list of them by inspecting the `builtins` module with `dir(__builtins__)`, or by going to the official Python documentation

```python
dir(__builtins__)
```
few examples
	`any`, `bin`, `bool`, `divmod`, `filter`, `float`, `getattr`, `id`, `int`, `len`, `list`, `min`, `print`, `set`, `tuple`, `type`,  `help` and `zip`
	
The `help()` built-in function, which is intended for interactive use, creates a documentation page for an object using its docstring.


---

## Importing objects

```python
# imports.py
from datetime import datetime, timezone  # two imports, same line
from unittest.mock import patch  # single import
import pytest  # third party library
from core.models import (  # multiline import
    Exam,
    Exercise,
    Solution,
)
from mymodule import myfunc as better_named_func # identifier
```

Sample
Imagine that we have defined a couple of functions, `square(n)` and `cube(n)`, in a module, `funcdef.py`, which is in the `util` folder. We want to use them in a couple of modules that are at the same level as the `util` folder, called `func_import.py` and `func_from.py`. Showing the tree structure of that project produces something like this:

```dir
├── func_from.py
├── func_import.py
├── util
│   ├── __init__.py
│   └── funcdef.py

```

Before we show you the code of each module, please remember that in order to tell Python that it is actually a package, we need to put an `__init__.py` module in it.

```python
# util/funcdef.py
def square(n):
    return n**2
def cube(n):
    return n**3
    
# func_import.py
import util.funcdef
print(util.funcdef.square(10))
print(util.funcdef.cube(10))

# func_from.py
from util.funcdef import square, cube
print(square(10))
print(cube(10))

```

---

## Map, Zip and Filter

### **`map()` Function**

`map()` applies a function to every item in an iterable and returns a **map object** (which can be converted to a list, tuple, etc.).

#### **Syntax:**

```python
map(function, iterable)
```

#### **Example: Squaring a List**

```python
numbers = [1, 2, 3, 4]
squared = list(map(lambda x: x ** 2, numbers))
print(squared)  # Output: [1, 4, 9, 16]
```

**Explanation:**

- `lambda x: x ** 2` squares each number.
- `map()` applies this to each item in `numbers`.

To **decorate** an object means to transform it, either adding extra data to it or putting it into another object. Conversely, to **undecorate** an object means to revert the decorated object to its original form.

Advanced Map Example:

```python
# decorate.sort.undecorate.py
from pprint import pprint
students = [
    dict(id=0, credits=dict(math=9, physics=6, history=7)),
    dict(id=1, credits=dict(math=6, physics=7, latin=10)),
    dict(id=2, credits=dict(history=8, physics=9, chemistry=10)),
    dict(id=3, credits=dict(math=5, physics=5, geography=7)),
]

def decorate(student):
    # create a 2-tuple (sum of credits, student) from student dict
    return (sum(student["credits"].values()), student)
    
def undecorate(decorated_student):
    # discard sum of credits, return original student dict
    return decorated_student[1]
    
print(students[0])
print(decorate(students[0])

students = sorted(map(decorate, students), reverse=True)
students = list(map(undecorate, students))
pprint(students)

```

Output:
```python
{'id': 0, 'credits': {'math': 9, 'physics': 6, 'history': 7}}
(22, {'id': 0, 'credits': {'math': 9, 'physics': 6, 'history': 7}})

[{'credits': {'chemistry': 10, 'history': 8, 'physics': 9}, 'id': 2},
 {'credits': {'latin': 10, 'math': 6, 'physics': 7}, 'id': 1},
 {'credits': {'history': 7, 'math': 9, 'physics': 6}, 'id': 0},
 {'credits': {'geography': 7, 'math': 5, 'physics': 5}, 'id': 3}]

```

As you can see, the student objects have indeed been sorted by the sums of their credits.

---

### **`zip()` Function**

`zip()` pairs elements from multiple iterables into tuples.

#### **Syntax:**

```python
zip(iterable1, iterable2, ...)
```

#### **Example: Pairing Two Lists**

```python
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]

paired = list(zip(names, ages))
print(paired)  
# Output: [('Alice', 25), ('Bob', 30), ('Charlie', 35)]
```

**Explanation:**

- Combines corresponding elements from `names` and `ages` into tuples.

#### **Example: Unzipping**

```python
unzipped_names, unzipped_ages = zip(*paired)
print(unzipped_names)  # Output: ('Alice', 'Bob', 'Charlie')
print(unzipped_ages)   # Output: (25, 30, 35)
```


Sample:

```python
# zip.strict.txt
>>> students = ["Sophie", "Alex", "Charlie", "Alice"]
>>> grades = ["A", "C", "B"]
>>> dict(zip(students, grades))
{'Sophie': 'A', 'Alex': 'C', 'Charlie': 'B'}

```

Notice `alice` was left out
The `strict` keyword-only parameter was added in Python 3.10. If `zip()` receives `strict=True` as an argument, it raises an exception if the iterables do not all have the same length:

```python
>>> dict(zip(students, grades, strict=True))

Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ValueError: zip() argument 2 is shorter than argument 1

```

Note
The `itertools` module also provides a `zip_longest()` function. It behaves like `zip()` but stops only when the longest iterable is exhausted. Shorter iterables are padded with a value that can be specified as an argument, which defaults to `None`.

---
### **`filter()` Function**

`filter()` removes elements that don’t satisfy a condition (returns `True`).

#### **Syntax:**

```python
filter(function, iterable)
```

#### **Example: Filtering Even Numbers**

```python
numbers = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)  # Output: [2, 4, 6]
```

**Explanation:**

- The lambda function `x % 2 == 0` keeps only even numbers.

Sample 2:
```python
# filter.txt
>>> test = [2, 5, 8, 0, 0, 1, 0]
>>> list(filter(None, test))
[2, 5, 8, 1]
>>> list(filter(lambda x: x, test))  # equivalent to previous one
[2, 5, 8, 1]
>>> list(filter(lambda x: x > 4, test))  # keep only items > 4
[5, 8]

```

---

### **Key Differences**

|Function|Purpose|
|---|---|
|`map()`|Transforms each item in an iterable|
|`zip()`|Combines multiple iterables element-wise|
|`filter()`|Selects items based on a condition|

---

## Advanced Comprehensions

Standard approach
```python
# squares.map.txt
>>> squares = list(map(lambda n: n**2, range(10)))
>>> squares
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

```

Comprehension:
```python
# squares.comprehension.txt
>>> [n**2 for n in range(10)]
[0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

```

Sample 2:
```python
# even.squares.py
# using map and filter
sq1 = list(
    map(lambda n: n**2, filter(lambda n: not n % 2, range(10)))
)
# equivalent, but using list comprehensions
sq2 = [n**2 for n in range(10) if not n % 2]
print(sq1, sq1 == sq2)  # prints: [0, 4, 16, 36, 64] True

```

---
### Nested Comprehensions

Let us see the classical `for` loop equivalent:

```python
# pairs.for.loop.py
items = "ABCD"
pairs = []
for a in range(len(items)):
    for b in range(a, len(items)):
        pairs.append((items[a], items[b]))

```

Output:
```python
$ python pairs.for.loop.py
[('A', 'A'), ('A', 'B'), ('A', 'C'), ('A', 'D'), ('B', 'B'), ('B', 'C'), ('B', 'D'), ('C', 'C'), ('C', 'D'), ('D', 'D')]

```

Comprehension:
```python
# pairs.list.comprehension.py
items = "ABCD"
pairs = [
    (items[a], items[b])    
    for a in range(len(items))
    for b in range(a, len(items))
]

```

---
### Filtering a comprehension

We can also apply filtering to a comprehension. Let us first do it with `filter()`, and find all Pythagorean triples whose short sides are numbers smaller than 10.

Level 1:
```python
# pythagorean.triple.py
from math import sqrt
# this will generate all possible pairs
mx = 10
triples = [
    (a, b, sqrt(a**2 + b**2))
    for a in range(1, mx)
    for b in range(a, mx)
]
# this will filter out all non-Pythagorean triples
triples = list(
    filter(lambda triple: triple[2].is_integer(), triples)
)
print(triples)  # prints: [(3, 4, 5.0), (6, 8, 10.0)]

```

This is good, but we do not like the fact that the triple has two integer numbers and a float—they are all supposed to be integers. We can use `map()` to fix this:

Level 2:
```python
# pythagorean.triple.int.py
from math import sqrt
mx = 10
triples = [
    (a, b, sqrt(a**2 + b**2))
    for a in range(1, mx)
    for b in range(a, mx)
]
triples = filter(lambda triple: triple[2].is_integer(), triples)
# this will make the third number in the tuples integer
triples = list(
    map(lambda triple: triple[:2] + (int(triple[2]),), triples)
)
print(triples)  # prints: [(3, 4, 5), (6, 8, 10)]

```

Notice the step we added. We slice each element in `triples`, taking only the first two elements. Then, we concatenate the slice with a one-tuple, containing the integer version of that float number that we did not like. 

This code is getting quite complicated. We can achieve the same result with a much simpler list comprehension:

Level 3:
```python
# pythagorean.triple.comprehension.py
from math import sqrt
# this step is the same as before
mx = 10
triples = [
    (a, b, sqrt(a**2 + b**2))
    for a in range(1, mx)
    for b in range(a, mx)
]
# here we combine filter and map in one CLEAN list comprehension
triples = [
    (a, b, int(c)) for a, b, c in triples if c.is_integer()
]
print(triples)  # prints: [(3, 4, 5), (6, 8, 10)]

```

That is cleaner, easier to read, and shorter. There is still room for improvement, though. We are still wasting memory by constructing a list with many triples that we end up discarding. We can fix that by combining the two comprehensions into one:

Level 4:
```python
# pythagorean.triple.walrus.py
from math import sqrt
# this step is the same as before
mx = 10
# We can combine generating and filtering in one comprehension
triples = [
    (a, b, int(c))
    for a in range(1, mx)
    for b in range(a, mx)
    if (c := sqrt(a**2 + b**2)).is_integer()
]
print(triples)  # prints: [(3, 4, 5), (6, 8, 10)]

```

Now that is elegant. By generating the triples and filtering them in the same list comprehension, we avoid keeping any triple that does not pass the test in memory. Notice that we used an `assignment expression` to avoid needing to compute the value of `sqrt(a**2 + b**2)` twice.

---
### Dictionary comprehensions

Dictionary comprehensions work exactly like list comprehensions, but to construct dictionaries. There is only a slight difference in the syntax.

```python
# dictionary.comprehensions.py
from string import ascii_lowercase
lettermap = {c: k for k, c in enumerate(ascii_lowercase, 1)}

# same way
lettermap = dict((c, k) for k, c in enumerate(ascii_lowercase, 1))

```

Output :
```python
$ python dictionary.comprehensions.py
{'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8,
'i': 9, 'j': 10, 'k': 11, 'l': 12, 'm': 13, 'n': 14, 'o': 15,
'p': 16, 'q': 17, 'r': 18, 's': 19, 't': 20, 'u': 21, 'v': 22,
'w': 23, 'x': 24, 'y': 25, 'z': 26}

```

Dictionaries do not allow duplicate keys, as shown in the following example:
```python
# dictionary.comprehensions.duplicates.py
word = "Hello"
swaps = {c: c.swapcase() for c in word}
print(swaps)  # prints: {'H': 'h', 'e': 'E', 'l': 'L', 'o': 'O'}

```

## Set Comprehensions
basically removes duplicates
### **Example: Filtering Even Numbers**

```python
numbers = [1, 2, 3, 4, 5, 6, 2, 4, 6]
evens = {x for x in numbers if x % 2 == 0}
print(evens)  
# Output: {2, 4, 6}  (Duplicates removed)
```

**Explanation:**

- `{x for x in numbers if x % 2 == 0}` keeps only even numbers.
- Since it's a set, duplicates are removed automatically.

---

### **Example: Extract Unique Letters**

```python
word = "banana"
unique_letters = {letter for letter in word}
print(unique_letters)  
# Output: {'b', 'a', 'n'}
```

**Explanation:**

- `{letter for letter in word}` extracts unique characters from `"banana"`.

---

## Custom iterators

```python
class MyRange:
    def __init__(self, start, end):
        self.start = start
        self.end = end
        self.current = start

    def __iter__(self):
        # The __iter__ method returns the iterator object itself.
        return self

    def __next__(self):
        # The __next__ method returns the next value.
        if self.current >= self.end:
            raise StopIteration  # StopIteration signals the end of iteration
        else:
            self.current += 1
            return self.current - 1

# Create an instance of MyRange
my_range = MyRange(1, 5)

# Iterate through the MyRange object
for num in my_range:
    print(num)

```


---

## Exception Groups

When working with large collections of data, it can be inconvenient to immediately stop and raise an exception when an error occurs. It is often better to process all the data and report on all errors that occurred at the end. This allows the user to deal with all the errors at once, rather than having to rerun the process multiple times, fixing errors one by one.

```python
# exceptions/groups/util.py
def validate_age(age):
    if not isinstance(age, int):
        raise TypeError(f"Not an integer: {age}")
    if age < 0:
        raise ValueError(f"Negative age: {age}")
        
def validate_ages(ages):
    errors = []
    for age in ages:
        try:
            validate_age(age)
        except Exception as e:
            errors.append(e)
    if errors:
        raise ExceptionGroup("Validation errors", errors)

```

```output
# exceptions/groups/exc.group.txt
>>> from util import validate_ages
>>> validate_ages([24, -5, "ninety", 30, None])
  + Exception Group Traceback (most recent call last):
  |   File "<stdin>", line 1, in <module>
  |   File "exceptions/groups/util.py", line 20, in validate_ages
  |     raise ExceptionGroup("Validation errors", errors)
  | ExceptionGroup: Validation errors (3 sub-exceptions)
  
  +-+---------------- 1 ----------------
    | Traceback (most recent call last):
    |   File "exceptions/groups/util.py", line 15, in validate_ages
    |     validate_age(age)
    |   File "exceptions/groups/util.py", line 8, in validate_age
    |     raise ValueError(f"Negative age: {age}")
    | ValueError: Negative age: -5
    +---------------- 2 ----------------
    | Traceback (most recent call last):
    |   File "exceptions/groups/util.py", line 15, in validate_ages
    |     validate_age(age)
    |   File "exceptions/groups/util.py", line 6, in validate_age
    |     raise TypeError(f"Not an integer: {age}")
    | TypeError: Not an integer: ninety
    +---------------- 3 ----------------
    | Traceback (most recent call last):
    |   File "exceptions/groups/util.py", line 15, in validate_ages
    |     validate_age(age)
    |   File "exceptions/groups/util.py", line 6, in validate_age
    |     raise TypeError(f"Not an integer: {age}")
    | TypeError: Not an integer: None
    +------------------------------------

```


 Exceptions for stopping loops
 
```python
class StopLoopException(Exception):
    pass

try:
    for i in range(10):  # Looping from 0 to 9
        if i == 5:  # Condition to raise the exception
            raise StopLoopException(i)  # Raise exception with i as argument
        print(i)  # Print numbers from 0 to 4
except StopLoopException as e:
    print(f"Loop stopped at: {e.args[0]}")  # Print the value where the loop stopped

```

---

## Context Managers Deep

Context managers in Python are used to set up and tear down resources, like opening and closing files, acquiring and releasing locks, or managing database connections. They allow you to manage resources in a clean, concise, and reliable way, ensuring that certain actions are performed before and after a block of code runs, even if exceptions occur.

### How Context Managers Work

Under the hood, context managers rely on two special methods:

1. **`__enter__()`**: This method is executed when the `with` block is entered. It sets up the resource and can return any object that is needed for the block of code.
2. **`__exit__()`**: This method is executed when the `with` block is exited. It handles clean-up actions, such as releasing resources, closing files, or rolling back transactions. If an exception occurs within the `with` block, `__exit__()` can handle it or propagate it.

```python
class MyContextManager:
    def __enter__(self):
        print("Entering the context.")
        return self  # This can be any object you want to return and use inside the block.

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Exiting the context.")
        if exc_type:
            print(f"An error occurred: {exc_val}")
        return True  # Suppress exceptions (optional)

# Using the custom context manager
with MyContextManager() as cm:
    print("Inside the context.")
    # Uncomment the next line to see exception handling in action
    # raise ValueError("Something went wrong!")

```

output
```scss
Entering the context.
Inside the context.
Exiting the context.
```

Advanced
```python
# context/manager.class.py
ctx_mgr = MyContextManager()
print("About to enter 'with' context")

with ctx_mgr as mgr:
    print("Inside 'with' context")
    print(id(mgr))
    raise Exception("Exception inside 'with' context")
    print("This line will never be reached")
    
print("After 'with' context")
```

output
```python
$ python context/manager.class.py
MyContextManager init 140340228792272
About to enter 'with' context
Entering 'with' context
Inside 'with' context
140340228792272
exc_type=<class 'Exception'> exc_val=Exception("Exception inside
'with' context") exc_tb=<traceback object at 0x7fa3817c5340>
Exiting 'with' context
After 'with' context

```
### Class-Based Context Managers

Class-based context managers are implemented using the special methods `__enter__()` and `__exit__()`. These methods define how to acquire and release resources.

```python
class DatabaseConnection:
    def __enter__(self):
        print("Opening database connection...")
        self.connection = "Connected to database"  # Simulating a database connection
        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing database connection...")
        # Handle any exceptions that occurred within the block
        if exc_type:
            print(f"An error occurred: {exc_val}")
        return True  # Suppress exceptions if desired

# Using the context manager
with DatabaseConnection() as conn:
    print(conn)  # Use the simulated database connection
    # Uncomment the next line to simulate an exception
    # raise ValueError("Database error")

```

Output

```python
Opening database connection...
Connected to database
Closing database connection...
```


## Files and Directories

## Opening files

```python
# files/open_with.py
with open("fear.txt") as fh:
    for line in fh:
        print(line.strip())

```
## Checking for file and directory existence

If you want to make sure a file or directory exists (or does not), the `pathlib` module is what you need.

```python
# files/existence.py
from pathlib import Path

p = Path("fear.txt")
path = p.parent.absolute()

print(p.is_file())  # True
print(path)  # /Users/fab/code/lpp4ed/ch08/files
print(path.is_dir())  # True
q = Path("/Users/fab/code/lpp4ed/ch08/files")
print(q.is_dir())  # True

```


## Binary Files

### Reading and writing in binary mode

Notice that by opening a file and passing `t` in the options (or omitting it, as it is the default), we are opening the file in text mode. This means that the content of the file is treated and interpreted as text.

If you wish to write bytes to a file, you can open it in **binary mode**. This is a common requirement when you handle files that do not just contain raw text, such as images, audio/video, and, in general, any other proprietary format.

To handle files in binary mode, simply specify the `b` flag when opening them, as in the following example:
```python
# files/read_write_bin.py
with open("example.bin", "wb") as fw:
    fw.write(b"This is binary data...")
with open("example.bin", "rb") as f:
    print(f.read())  # prints: b'This is binary data...'

```


## Write to non existent file

```python
# files/write_not_exists.py
with open("write_x.txt", "x") as fw:  # this succeeds
    fw.write("Writing line 1")
with open("write_x.txt", "x") as fw:  # this fails
    fw.write("Writing line 2")

```


---

## Custom Json Encoding/Decoding

```python
# json_examples/json_cplx.py
import json
class ComplexEncoder(json.JSONEncoder):
    def default(self, obj):
        print(f"ComplexEncoder.default: {obj=}")
        if isinstance(obj, complex):
            return {
                "_meta": "complex",
                "num": [obj.real, obj.imag],
            }
        return super().default(obj)
data = {
    "an_int": 42,
    "a_float": 3.14159265,
    "a_complex": 3 + 4j,
}
json_data = json.dumps(data, cls=ComplexEncoder)
print(json_data)
def object_hook(obj):
    print(f"object_hook: {obj=}")
    try:
        if obj["_meta"] == "complex":
            return complex(*obj["num"])
    except KeyError:
        return obj
data_out = json.loads(json_data, object_hook=object_hook)
print(data_out)

```


output:
```python
$ python json_cplx.py
ComplexEncoder.default: obj=(3+4j)
{
    "an_int": 42, "a_float": 3.14159265,
    "a_complex": {"_meta": "complex", "num": [3.0, 4.0]}
}

```

Sample 2:
```python
# json_examples/json_datetime.py
import json
from datetime import datetime, timedelta, timezone
now = datetime.now()
now_tz = datetime.now(tz=timezone(timedelta(hours=1)))
class DatetimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            try:
                off = obj.utcoffset().seconds
            except AttributeError:
                off = None
            return {
                "_meta": "datetime",
                "data": obj.timetuple()[:6] + (obj.microsecond,),
                "utcoffset": off,
            }
        return super().default(obj)
data = {
    "an_int": 42,
    "a_float": 3.14159265,
    "a_datetime": now,
    "a_datetime_tz": now_tz,
}
json_data = json.dumps(data, cls=DatetimeEncoder)
print(json_data)

```


Output
```python
$ python json_datetime.py
{
    "an_int": 42,
    "a_float": 3.14159265,
    "a_datetime": {
        "_meta": "datetime",
        "data": [2024, 3, 29, 23, 24, 22, 232302],
        "utcoffset": null,
    },
    "a_datetime_tz": {
        "_meta": "datetime",
        "data": [2024, 3, 30, 0, 24, 22, 232316],
        "utcoffset": 3600,
    },
}

```