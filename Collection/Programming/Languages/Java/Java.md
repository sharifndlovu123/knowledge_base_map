# Java Syntax Breakdown

## Basic Program Structure

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

## Data Types

### Primitive Types

```java
// Integers
byte b = 127;           // 8-bit, -128 to 127
short s = 32767;        // 16-bit, -32,768 to 32,767
int i = 2147483647;     // 32-bit, ~-2 billion to ~2 billion
long l = 9223372036854775807L; // 64-bit, very large range

// Floating Point
float f = 3.14f;        // 32-bit floating point
double d = 3.14159265;  // 64-bit floating point (default)

// Other
char c = 'A';           // 16-bit Unicode character
boolean bool = true;    // true or false
```

### Reference Types

```java
String text = "Hello";
int[] numbers = {1, 2, 3, 4, 5};
ArrayList<String> list = new ArrayList<>();
```

## Variables and Constants

```java
// Variable declaration
int number;
number = 42;

// Declaration with initialization
int age = 25;

// Constants (final)
final double PI = 3.14159;
```

## Operators

```java
// Arithmetic operators
int sum = a + b;
int difference = a - b;
int product = a * b;
int quotient = a / b;
int remainder = a % b;

// Increment/decrement
int x = 10;
x++;  // x is now 11
x--;  // x is now 10

// Comparison operators
boolean isEqual = (a == b);
boolean notEqual = (a != b);
boolean greaterThan = (a > b);
boolean lessThanOrEqual = (a <= b);

// Logical operators
boolean andResult = (a > 0) && (b > 0);
boolean orResult = (a > 0) || (b > 0);
boolean notResult = !(a > 0);

// Assignment operators
x += 5;  // Equivalent to: x = x + 5
```

## Control Flow

### Conditional Statements

```java
// If statement
if (age >= 18) {
    System.out.println("Adult");
} else if (age >= 13) {
    System.out.println("Teenager");
} else {
    System.out.println("Child");
}

// Switch statement
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    default:
        System.out.println("Other day");
}

// Ternary operator
String status = (age >= 18) ? "Adult" : "Minor";
```

### Loops

```java
// For loop
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

// Enhanced for loop (for-each)
for (String name : names) {
    System.out.println(name);
}

// While loop
while (count < 10) {
    System.out.println(count);
    count++;
}

// Do-while loop
do {
    System.out.println(count);
    count++;
} while (count < 10);
```

## Methods

```java
// Method definition
public int add(int a, int b) {
    return a + b;
}

// Method with no return value
public void printMessage(String message) {
    System.out.println(message);
}

// Method overloading
public double add(double a, double b) {
    return a + b;
}
```

## Classes and Objects

```java
// Class definition
public class Person {
    // Instance variables
    private String name;
    private int age;
    
    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Getter methods
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    // Method
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age + " years old.");
    }
}

// Creating objects
Person person1 = new Person("John", 25);
person1.introduce();
```

## Exception Handling

```java
try {
    int result = 10 / 0;  // This will cause an exception
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
} finally {
    System.out.println("This always executes");
}

// Throwing exceptions
if (age < 0) {
    throw new IllegalArgumentException("Age cannot be negative");
}
```

## Interfaces and Inheritance

```java
// Interface
public interface Drawable {
    void draw();
}

// Class implementing interface
public class Circle implements Drawable {
    @Override
    public void draw() {
        System.out.println("Drawing a circle");
    }
}

// Inheritance
public class Animal {
    public void eat() {
        System.out.println("This animal eats food");
    }
}

public class Dog extends Animal {
    @Override
    public void eat() {
        System.out.println("Dog eats dog food");
    }
    
    public void bark() {
        System.out.println("Woof!");
    }
}
```

## Collections

```java
// ArrayList
ArrayList<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
System.out.println(names.get(0));  // Alice

// HashMap
HashMap<String, Integer> ages = new HashMap<>();
ages.put("Alice", 25);
ages.put("Bob", 30);
System.out.println(ages.get("Alice"));  // 25
```


## Enums

``` java
public enum Methods {
	GET,POST,PUT,DELETE,PATCH
}
```

```java
public enum Arithmetics {
        ADD("+"), SUBTRACT("-"), DIVIDE("/"), MULTIPLY("*");
        private final String symbol;
        Arithmetics(String symbol) {
            this.symbol = symbol;
        }
        public String getSymbol() {
            return symbol;
        }
    }
```
---
# Java Collections: HashMaps and More

## HashMap

```java
// Creating a HashMap
HashMap<String, Integer> userScores = new HashMap<>();

// Adding key-value pairs
userScores.put("Alice", 95);
userScores.put("Bob", 87);
userScores.put("Charlie", 92);

// Retrieving values
int aliceScore = userScores.get("Alice");  // Returns 95
Integer davidScore = userScores.get("David");  // Returns null (key doesn't exist)

// Checking if key exists
boolean hasAlice = userScores.containsKey("Alice");  // true
boolean hasValue87 = userScores.containsValue(87);   // true

// Removing entries
userScores.remove("Bob");  // Removes Bob's entry

// Iterating through a HashMap
for (String name : userScores.keySet()) {
    System.out.println(name + ": " + userScores.get(name));
}

// Using entrySet for more efficient iteration
for (Map.Entry<String, Integer> entry : userScores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// Size and emptiness
int size = userScores.size();  // Number of entries
boolean isEmpty = userScores.isEmpty();  // Check if empty

// Clearing all entries
userScores.clear();
```

## LinkedHashMap & TreeMap
```java
// LinkedHashMap - maintains insertion order
LinkedHashMap<String, Integer> orderedMap = new LinkedHashMap<>();
orderedMap.put("One", 1);
orderedMap.put("Two", 2);
// Elements will be retrieved in insertion order

// TreeMap - sorts keys according to natural ordering or Comparator
TreeMap<String, Integer> sortedMap = new TreeMap<>();
sortedMap.put("C", 3);
sortedMap.put("A", 1);
sortedMap.put("B", 2);
// Keys will be in alphabetical order when iterated: A, B, C
```

## Other Important Collections

```java
// HashSet - unordered collection of unique elements
HashSet<String> uniqueNames = new HashSet<>();
uniqueNames.add("Alice");
uniqueNames.add("Bob");
uniqueNames.add("Alice");  // Duplicate, won't be added
// uniqueNames contains ["Alice", "Bob"]

// LinkedHashSet - maintains insertion order with unique elements
LinkedHashSet<String> orderedUniqueNames = new LinkedHashSet<>();

// TreeSet - sorted set of unique elements
TreeSet<String> sortedUniqueNames = new TreeSet<>();

// LinkedList - doubly-linked list implementation
LinkedList<String> linkedList = new LinkedList<>();
linkedList.add("First");
linkedList.addFirst("New First");  // Adds to the beginning
linkedList.addLast("Last");        // Adds to the end

// Queue operations with LinkedList
linkedList.offer("Next");  // Adds to the queue
String first = linkedList.poll();  // Retrieves and removes the head
```

---


# Java Input and Output

### **Breakdown of Java Input and Output via Command Line (CMD)**

When running a Java program via the **Command Prompt (CMD)**, input and output (I/O) operations involve interacting with **System.in**, **System.out**, and **System.err**.

---

## **1. Java Output (`System.out`)**

Java uses **`System.out`** to display text in the command line. It is an instance of `PrintStream`.

### **Basic Output Methods**

```java
public class OutputExample {
    public static void main(String[] args) {
        System.out.println("Hello, World!");  // Prints with a newline
        System.out.print("This is a message ");  // Prints without a newline
        System.out.printf("Number: %d%n", 10);  // Formatted output
    }
}
```

#### **Explanation:**

- `System.out.println(...)` → Prints text **with a newline**.
- `System.out.print(...)` → Prints **without a newline**.
- `System.out.printf(...)` → Formats and prints output **like C’s `printf()`**.

#### **CMD Execution:**

1. **Compile**: `javac OutputExample.java`
2. **Run**: `java OutputExample`
3. **Expected Output:**
    
    ```
    Hello, World!
    This is a message Number: 10
    ```
    

---

## **2. Java Input (`System.in`)**

Java reads input from the keyboard using **`System.in`**, which is an instance of `InputStream`.

### **Reading Input via Scanner**

```java
import java.util.Scanner;

public class InputExample {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in); // Create Scanner object

        System.out.print("Enter your name: ");
        String name = scanner.nextLine(); // Read user input

        System.out.print("Enter your age: ");
        int age = scanner.nextInt(); // Read an integer

        System.out.println("Hello, " + name + "! You are " + age + " years old.");

        scanner.close(); // Close Scanner to prevent memory leaks
    }
}
```

#### **Explanation:**

- `Scanner scanner = new Scanner(System.in);` → Reads input from CMD.
- `scanner.nextLine();` → Reads a **full line**.
- `scanner.nextInt();` → Reads an **integer**.

#### **CMD Execution:**

1. **Compile**: `javac InputExample.java`
2. **Run**: `java InputExample`
3. **User Interaction Example:**
    
    ```
    Enter your name: John
    Enter your age: 25
    Hello, John! You are 25 years old.
    ```
    

---

## **3. Java Error Output (`System.err`)**

Errors and warnings can be printed using **`System.err`**.

### **Example**

```java
public class ErrorExample {
    public static void main(String[] args) {
        System.err.println("This is an error message!");
    }
}
```

#### **CMD Execution & Output**

- Run: `java ErrorExample`
- The error message **may appear in red** on some terminals.

---

## **4. Redirecting Input and Output in CMD**

### **Redirecting Output to a File**

Instead of displaying output on the screen, you can save it to a file.

```sh
java OutputExample > output.txt
```

- The `>` operator **redirects output** to `output.txt`.

### **Reading Input from a File**

If you have a text file (`input.txt`) with content:

```
John
25
```

You can run:

```sh
java InputExample < input.txt
```

- The `<` operator **feeds the file's content** as input to the program.

---

## **5. Advanced: Reading Input via BufferedReader**

If `Scanner` is slow for large inputs, you can use `BufferedReader`:

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

public class BufferedReaderExample {
    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

        System.out.print("Enter your favorite color: ");
        String color = reader.readLine(); // Read a full line

        System.out.println("Your favorite color is " + color);
    }
}
```

#### **Why Use `BufferedReader`?**

- **Faster** than `Scanner` for large inputs.
- **Less memory overhead**.

---

## **Final Notes**

- `System.out` → Standard output (prints messages).
- `System.in` → Reads input (via `Scanner` or `BufferedReader`).
- `System.err` → Prints error messages.
- CMD supports **input redirection (`<`), output redirection (`>`), and appending (`>>`)**.

Would you like a specific example or further breakdown? 🚀

---

[[Java Features]] [[Gradle]] [[Maven]] [[Acronyms]]