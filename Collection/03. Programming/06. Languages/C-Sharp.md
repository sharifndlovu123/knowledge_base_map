# 03. C-Sharp

### Breakdown of C# Syntax

C# (pronounced C-sharp) is a high-level, object-oriented programming language developed by Microsoft. It is part of the .NET framework and shares many features with C, C++, and Java. Below is a breakdown of its key syntax elements:

---

### **1. Basic Structure of a C# Program**

```csharp
using System; // Importing namespaces

namespace MyApp
{
    class Program
    {
        static void Main(string[] args)
        {
            // Code goes here
            Console.WriteLine("Hello, World!");
        }
    }
}
```

- **`using` Directive**: Allows access to classes and namespaces (e.g., `System` provides basic functionality like console input/output).
- **Namespace**: Organizes code and avoids naming conflicts.
- **Class**: Defines the blueprint for objects.
- **Main Method**: Entry point of the program. The program starts executing here.

---

### **2. Variables and Data Types**

```csharp
int age = 25;                  // Integer
double price = 19.99;          // Double-precision floating-point
char grade = 'A';              // Single character
string name = "John Doe";      // String (sequence of characters)
bool isStudent = true;         // Boolean value (true/false)
```

- **Primitive Data Types**: `int`, `double`, `char`, `string`, `bool`.
- **`string`** is a reference type that represents a sequence of characters.

---

### **3. Control Structures**

#### **Conditionals (if, else, switch)**

```csharp
if (age >= 18)
{
    Console.WriteLine("Adult");
}
else
{
    Console.WriteLine("Minor");
}
```

```csharp
switch (grade)
{
    case 'A':
        Console.WriteLine("Excellent");
        break;
    case 'B':
        Console.WriteLine("Good");
        break;
    default:
        Console.WriteLine("Invalid grade");
        break;
}
```

- **`if` Statement**: Executes code based on a condition.
- **`switch` Statement**: A cleaner alternative to multiple `if`-`else if` statements for matching values.

#### **Loops (for, while, do-while)**

```csharp
for (int i = 0; i < 5; i++)
{
    Console.WriteLine(i);
}
```

```csharp
int j = 0;
while (j < 5)
{
    Console.WriteLine(j);
    j++;
}
```

- **`for` Loop**: Initializes, evaluates a condition, and updates a variable.
- **`while` Loop**: Continues as long as the condition remains `true`.
- **`do-while` Loop**: Ensures the loop runs at least once.

---

### **4. Methods**

```csharp
public class Program
{
    static void Main(string[] args)
    {
        int result = Add(5, 3);
        Console.WriteLine(result);
    }

    static int Add(int a, int b)   // Method declaration with parameters
    {
        return a + b;               // Return value
    }
}
```

- **Method Declaration**:
    - **Return Type**: `int` indicates the method returns an integer.
    - **Method Name**: `Add`.
    - **Parameters**: `(int a, int b)` are the inputs to the method.
    - **Return Statement**: Returns a value from the method.

---

### **5. Object-Oriented Concepts (Classes, Objects, Inheritance)**

#### **Class Definition**

```csharp
public class Animal
{
    public string Name { get; set; }
    public void Speak()
    {
        Console.WriteLine("Animal speaks");
    }
}

public class Dog : Animal  // Inheritance
{
    public void Bark()
    {
        Console.WriteLine("Woof!");
    }
}
```

- **Class**: Defines properties and methods.
- **Inheritance**: `Dog` inherits from `Animal`, meaning `Dog` has all properties and methods of `Animal`.

#### **Creating Objects**

```csharp
Dog dog = new Dog();
dog.Name = "Buddy";   // Set property
dog.Speak();          // Call inherited method
dog.Bark();           // Call method from Dog class
```

- **Object Creation**: `new Dog()` creates an instance of the `Dog` class.

---

### **6. Access Modifiers**

```csharp
public class MyClass
{
    public int PublicField;      // Can be accessed from anywhere
    private int PrivateField;    // Accessible only within this class
    protected int ProtectedField; // Accessible in this class and derived classes
}
```

- **`public`**: Accessible everywhere.
- **`private`**: Accessible only within the defining class.
- **`protected`**: Accessible within the class and derived classes.

---

### **7. Arrays**

```csharp
int[] numbers = { 1, 2, 3, 4, 5 };    // Array initialization
Console.WriteLine(numbers[2]);        // Accessing array element at index 2
```

- **Array**: A collection of elements of the same type, indexed from 0.

---

### **8. Collections**

#### **List**

```csharp
using System.Collections.Generic;

List<int> numbersList = new List<int>();
numbersList.Add(1);
numbersList.Add(2);
numbersList.Add(3);
Console.WriteLine(numbersList[1]);    // Output: 2
```

- **List**: A generic collection that can dynamically grow or shrink.

#### **Dictionary**

```csharp
Dictionary<string, int> dict = new Dictionary<string, int>();
dict.Add("apple", 5);
dict.Add("banana", 2);
Console.WriteLine(dict["apple"]);  // Output: 5
```

- **Dictionary**: Stores key-value pairs.

---

### **9. Exception Handling**

```csharp
try
{
    int result = 10 / 0;
}
catch (DivideByZeroException ex)
{
    Console.WriteLine("Error: " + ex.Message);
}
finally
{
    Console.WriteLine("This is always executed.");
}
```

- **`try`**: The block of code that may throw an exception.
- **`catch`**: Handles exceptions that occur in the `try` block.
- **`finally`**: Code that is always executed, regardless of whether an exception occurred.

---

### **10. Lambda Expressions and Delegates**

#### **Lambda Expression**

```csharp
Func<int, int, int> add = (a, b) => a + b;
Console.WriteLine(add(3, 4));    // Output: 7
```

- **Lambda Expression**: A concise way to define anonymous methods.
- **`Func`**: A delegate type representing a function that takes parameters and returns a value.

#### **Delegate**

```csharp
public delegate void MyDelegate(string message);

MyDelegate del = message => Console.WriteLine(message);
del("Hello, Delegate!");    // Output: Hello, Delegate!
```

- **Delegate**: A type-safe function pointer used to reference methods.

---

### **Summary of Key Points:**

- C# is an object-oriented, statically-typed language with a clean, consistent syntax.
- It supports object-oriented programming principles like **inheritance**, **polymorphism**, **encapsulation**, and **abstraction**.
- It has **strong type safety**, meaning you must declare the type of every variable.
- Supports modern programming features like **LINQ**, **async/await** for asynchronous programming, and **delegates** for event-driven programming.

This breakdown covers the essentials, but C# offers much more, including advanced topics like **generics**, **LINQ**, **async programming**, **events**, **attributes**, and more.