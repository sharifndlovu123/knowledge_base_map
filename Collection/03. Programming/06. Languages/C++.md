# 02. C++

### Breakdown of C++ Syntax

C++ is a high-level, object-oriented programming language that builds upon C, adding support for classes, objects, templates, and advanced features like exception handling, overloading, and more. It’s widely used for system and application software, game development, real-time systems, and large-scale applications.

---

### **1. Basic Structure of a C++ Program**

```cpp
#include <iostream>  // Preprocessor directive

using namespace std; // Standard namespace for simplifying code

int main()           // Main function - entry point
{
    cout << "Hello, World!" << endl;  // Output statement
    return 0;        // Return statement
}
```

- **`#include <iostream>`**: This preprocessor directive includes the input/output stream library needed for `cout` and `cin` for input and output operations.
- **`using namespace std;`**: Allows the use of standard library functions without prefixing them with `std::`.
- **`int main()`**: Main function, the entry point of a C++ program.
- **`cout`**: Used to display output to the console.
- **`return 0;`**: Indicates successful execution of the program.

---

### **2. Variables and Data Types**

```cpp
int age = 25;          // Integer type
float price = 19.99;   // Floating-point type
char grade = 'A';      // Character type
double weight = 75.5;  // Double precision floating-point
bool isActive = true;  // Boolean type
```

- **`int`**: Integer type.
- **`float`**: Single precision floating-point.
- **`double`**: Double precision floating-point.
- **`char`**: Character type, single character enclosed in single quotes.
- **`bool`**: Boolean type (true or false).

---

### **3. Constants and Macros**

```cpp
#define PI 3.14159   // Macro definition
const int MAX = 100; // Constant variable
```

- **`#define`**: Macro definitions, used for creating constants or expressions that will be replaced by the preprocessor.
- **`const`**: Constant variables that cannot be modified after initialization.

---

### **4. Control Structures**

#### **Conditionals (`if`, `else`, `switch`)**

```cpp
int x = 10;
if (x > 5)
{
    cout << "x is greater than 5" << endl;
}
else
{
    cout << "x is less than or equal to 5" << endl;
}
```

```cpp
switch(x)
{
    case 1:
        cout << "x is 1" << endl;
        break;
    case 10:
        cout << "x is 10" << endl;
        break;
    default:
        cout << "x is something else" << endl;
        break;
}
```

- **`if`**: Executes the block of code if the condition evaluates to true.
- **`switch`**: Evaluates a variable's value and executes corresponding code based on matching case labels.

#### **Loops (`for`, `while`, `do-while`)**

```cpp
for (int i = 0; i < 5; i++)
{
    cout << i << endl;
}
```

```cpp
int j = 0;
while (j < 5)
{
    cout << j << endl;
    j++;
}
```

- **`for`**: Executes the block of code a specific number of times.
- **`while`**: Repeats the block as long as the condition is true.
- **`do-while`**: Similar to `while`, but ensures the loop runs at least once since the condition is checked after each iteration.

---

### **5. Functions**

```cpp
#include <iostream>
using namespace std;

int add(int a, int b)  // Function declaration
{
    return a + b;
}

int main()
{
    int sum = add(3, 4);  // Function call
    cout << "Sum: " << sum << endl;
    return 0;
}
```

- **Function Declaration**: Specifies the function's return type, name, and parameters.
- **Function Call**: Invokes the function by name, passing the necessary arguments.

---

### **6. Object-Oriented Concepts**

#### **Classes and Objects**

```cpp
#include <iostream>
using namespace std;

class Person {
public:
    string name;
    int age;
    
    void introduce() {
        cout << "Hi, I'm " << name << " and I'm " << age << " years old." << endl;
    }
};

int main()
{
    Person p1;
    p1.name = "John";
    p1.age = 30;
    
    p1.introduce();
    
    return 0;
}
```

- **`class`**: A blueprint for creating objects. It contains data members (variables) and member functions (methods).
- **`public`**: Accessibility modifier indicating that the member is accessible from outside the class.
- **`void`**: A return type indicating the function does not return any value.

#### **Constructor and Destructor**

```cpp
class Person {
public:
    string name;
    int age;
    
    Person(string n, int a) {  // Constructor
        name = n;
        age = a;
    }
    
    ~Person() {  // Destructor
        cout << "Object destroyed" << endl;
    }
};

int main()
{
    Person p1("John", 30);  // Constructor call
    return 0;  // Destructor will be called here
}
```

- **Constructor**: A special function that is called when an object is created, used for initializing object attributes.
- **Destructor**: A special function that is called when an object goes out of scope (or is explicitly deleted).

---

### **7. Pointers and References**

```cpp
int num = 10;
int *ptr = &num;  // Pointer to an integer
cout << *ptr << endl;  // Dereferencing the pointer to get value
```

```cpp
int num = 20;
int &ref = num;   // Reference to the integer
ref = 30;         // Modify the value through the reference
cout << num << endl;  // Output: 30
```

- **Pointers**: Variables that store the memory address of another variable.
- **References**: Aliases for existing variables. A reference is not a new object but a synonym for an existing object.

---

### **8. Templates**

```cpp
#include <iostream>
using namespace std;

template <typename T>
T add(T a, T b) {
    return a + b;
}

int main() {
    cout << add(3, 4) << endl;  // Calls add for integers
    cout << add(3.5, 4.5) << endl;  // Calls add for floating-point numbers
    return 0;
}
```

- **Templates**: A feature in C++ that allows functions or classes to work with any data type.

---

### **9. Exception Handling**

```cpp
#include <iostream>
using namespace std;

int divide(int a, int b) {
    if (b == 0) {
        throw "Division by zero exception!";
    }
    return a / b;
}

int main() {
    try {
        cout << divide(10, 0) << endl;
    }
    catch (const char* msg) {
        cout << "Error: " << msg << endl;
    }
    return 0;
}
```

- **`throw`**: Used to throw exceptions (errors).
- **`try-catch`**: Encloses code that might throw an exception and catches it in case an error occurs.

---

### **10. Standard Template Library (STL)**

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> vec = {1, 2, 3, 4, 5};
    
    for (int val : vec) {
        cout << val << " ";
    }
    cout << endl;
    return 0;
}
```

- **STL**: A collection of template classes and functions that implement common data structures and algorithms (e.g., vectors, stacks, queues, maps).

---

### **11. File Handling**

```cpp
#include <iostream>
#include <fstream>
using namespace std;

int main() {
    ofstream outFile("example.txt"); // Open file for writing
    
    if (outFile.is_open()) {
        outFile << "Hello, C++ File!" << endl;
        outFile.close(); // Close the file after writing
    }
    
    return 0;
}
```

- **`ofstream`**: Output file stream, used for writing to files.
- **`ifstream`**: Input file stream, used for reading from files.
- **`fstream`**: A general file stream for both reading and writing.

---

### **12. Operator Overloading**

```cpp
#include <iostream>
using namespace std;

class Complex {
public:
    int real, imag;
    
    Complex operator + (Complex const &other) {
        Complex temp;
        temp.real = real + other.real;
        temp.imag = imag + other.imag;
        return temp;
    }
};

int main() {
    Complex c1, c2, result;
    c1.real = 1; c1.imag = 2;
    c2.real = 3; c2.imag = 4;
    
    result = c1 + c2;  // Using overloaded + operator
    
    cout << "Result: " << result.real << " + " << result.imag << "i" << endl;
    return 0;
}
```

- **Operator Overloading**: Allows you to redefine the functionality of operators for user-defined types.

---

### **Summary of Key Points:**

- C++ is an **object-oriented** language that extends C with classes, inheritance, polymorphism, and encapsulation.
- It supports **low-level memory management** with pointers, while also providing high-level abstractions like **templates** and the **Standard Template Library (STL)**.
- **Exception handling** helps manage errors, while **operator overloading** allows for custom behavior of standard operators.
- C++ supports **multiple paradigms** (procedural, object-oriented, and generic programming), making it versatile for various types of applications.