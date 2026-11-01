# 16. Rust

### Breakdown of Rust Syntax

Rust is a systems programming language focused on safety, performance, and concurrency. It provides memory safety without needing a garbage collector. The syntax is influenced by C, but it introduces modern features like ownership, pattern matching, and more, making it both powerful and safe.

---

### **1. Basic Structure of a Rust Program**

```rust
fn main() {
    println!("Hello, World!");
}
```

- **`fn main()`**: Defines the main function, which is the entry point of the program.
- **`println!`**: A macro (not a function) used to print output to the console.
- **`{}`**: Code block, used to group statements.
- **`!`**: Indicates a macro, as opposed to a function. Rust macros allow for code generation and more complex behaviors.

---

### **2. Variables and Data Types**

Rust uses a **strongly-typed** system, and variables are immutable by default. To make them mutable, we use the `mut` keyword.

#### **Variables**

```rust
let x = 5;      // Immutable variable
let mut y = 10; // Mutable variable
y = 20;          // Reassigning a mutable variable
```

- **`let`**: Used to bind a value to a variable.
- **`mut`**: Allows mutation of the variable after initialization.
- Rust variables are **immutable by default** to ensure safety, but you can opt for mutability using `mut`.

#### **Data Types**

Rust has primitive types like integers, floating-point numbers, booleans, and characters, but the most significant feature is its ownership model.

```rust
let a: i32 = 10;     // Integer (32-bit)
let b: f64 = 10.5;   // Floating point (64-bit)
let c: char = 'A';   // Character
let d: bool = true;  // Boolean
```

- **`i32`**: Signed integer of 32 bits.
- **`f64`**: Floating-point number (64 bits).
- **`char`**: Represents a single Unicode character.
- **`bool`**: Represents true or false.

---

### **3. Ownership, Borrowing, and References**

One of the most defining features of Rust is its **ownership** system, which guarantees memory safety.

#### **Ownership**

```rust
let s1 = String::from("Hello");
let s2 = s1; // Ownership of s1 is moved to s2
```

- **Ownership**: When a variable goes out of scope, Rust automatically frees the memory, ensuring there are no memory leaks.
- **Move semantics**: When you assign one variable to another (like `s2 = s1`), the ownership is moved, meaning `s1` is no longer valid.

#### **Borrowing**

```rust
let s1 = String::from("Hello");
let s2 = &s1; // Borrowing s1 (reference)
println!("{}", s2); // This is valid since we are borrowing s1
```

- **Borrowing**: Allows multiple variables to reference the same data without taking ownership, ensuring no race conditions or memory safety issues.
- **References**: Using `&` to borrow a reference to a value.

---

### **4. Functions**

Rust functions are declared with the `fn` keyword, and parameters must have explicit types.

```rust
fn add(x: i32, y: i32) -> i32 {
    x + y
}

fn main() {
    let result = add(5, 10);
    println!("The sum is: {}", result);
}
```

- **`fn`**: Defines a function.
- **Return type**: The return type is declared after the `->`.
- **No implicit return**: In Rust, functions return the last expression in the block, but the semicolon is omitted.

---

### **5. Control Flow**

#### **Conditionals (`if`, `else`, `else if`)**

```rust
let x = 10;
if x > 5 {
    println!("Greater than 5");
} else if x == 5 {
    println!("Equal to 5");
} else {
    println!("Less than 5");
}
```

- **`if`**: Conditional statement.
- **`else if`**: Allows multiple condition checks.
- **`else`**: Defines the fallback option when none of the conditions match.

#### **Loops (`loop`, `while`, `for`)**

```rust
// Infinite loop
loop {
    println!("This is an infinite loop!");
    break;  // exit the loop
}

// While loop
let mut count = 0;
while count < 5 {
    println!("Count is {}", count);
    count += 1;
}

// For loop (iterating over a range)
for i in 0..5 {
    println!("i is {}", i);
}
```

- **`loop`**: Infinite loop.
- **`while`**: Executes as long as the condition is true.
- **`for`**: Iterates over a range, array, or collection.

---

### **6. Pattern Matching**

Rust has a powerful **match** statement, which is similar to `switch` in other languages but more flexible.

```rust
let x = 2;
match x {
    1 => println!("One"),
    2 => println!("Two"),
    3 => println!("Three"),
    _ => println!("Other"),
}
```

- **`match`**: Pattern matching allows for comparing a value against patterns and executing corresponding code.
- **`_`**: A catch-all pattern that matches anything.

---

### **7. Structs and Enums (Data Structures)**

Rust has **structs** (similar to classes in other languages) and **enums** for creating custom data types.

#### **Structs**

```rust
struct Person {
    name: String,
    age: u32,
}

let person1 = Person {
    name: String::from("Alice"),
    age: 30,
};

println!("Name: {}, Age: {}", person1.name, person1.age);
```

- **`struct`**: Used to define a custom data type with named fields.
- **Initialization**: Create an instance by specifying field values.

#### **Enums**

```rust
enum Direction {
    Up,
    Down,
    Left,
    Right,
}

let move1 = Direction::Up;
```

- **`enum`**: Defines a type that can hold one of a set of possible values.
- Each variant of an enum can have data associated with it.

---

### **8. Error Handling**

Rust has a robust error handling mechanism, relying heavily on `Result` and `Option` types.

#### **`Result` Type**

```rust
fn divide(x: i32, y: i32) -> Result<i32, String> {
    if y == 0 {
        Err(String::from("Cannot divide by zero"))
    } else {
        Ok(x / y)
    }
}

fn main() {
    match divide(10, 0) {
        Ok(result) => println!("Result is {}", result),
        Err(e) => println!("Error: {}", e),
    }
}
```

- **`Result`**: Used for functions that can succeed or fail. It is an enum with two variants, `Ok` (success) and `Err` (failure).
- Rust encourages handling errors explicitly, reducing the likelihood of unexpected crashes.

#### **`Option` Type**

```rust
fn find_item(items: Vec<i32>, target: i32) -> Option<i32> {
    for &item in &items {
        if item == target {
            return Some(item);
        }
    }
    None
}
```

- **`Option`**: Represents an optional value (either `Some(value)` or `None`). Used for situations where a value might be absent.

---

### **9. Concurrency**

Rust's **ownership model** guarantees thread safety. It provides safe concurrency through **threads** and **channels**.

#### **Threads**

```rust
use std::thread;

let handle = thread::spawn(|| {
    println!("This is a new thread!");
});

handle.join().unwrap(); // Wait for the thread to finish
```

- **`thread::spawn`**: Starts a new thread.
- **`join()`**: Waits for the thread to finish execution.

#### **Channels (for Communication Between Threads)**

```rust
use std::sync::mpsc;

let (tx, rx) = mpsc::channel();
thread::spawn(move || {
    tx.send("Hello from the thread!").unwrap();
});
println!("{}", rx.recv().unwrap());
```

- **`mpsc::channel`**: Creates a channel for communication between threads. It stands for "multiple producers, single consumer."

---

### **10. Lifetimes**

Rust enforces **lifetime annotations** to prevent memory safety issues. Lifetimes specify how long references should be valid.

```rust
fn longest<'a>(s1: &'a str, s2: &'a str) -> &'a str {
    if s1.len() > s2.len() {
        s1
    } else {
        s2
    }
}
```

- **`'a`**: Lifetime annotation. Ensures that references are valid for the correct duration.

---

### **Summary of Key Points:**

- Rust is a **systems programming language** focused on performance, concurrency, and memory safety.
- **Ownership and borrowing** ensure memory safety without a garbage collector.
- **Pattern matching** and **enums** provide expressive ways to handle data.
- **Error handling** is done via the `Result` and `Option` types, encouraging explicit error checking.
- **Concurrency** is safe and efficient, using **threads** and **channels**.

Rust's emphasis on **zero-cost abstractions**, **concurrency**, and **memory safety** makes it an excellent choice for building high-performance systems and applications.