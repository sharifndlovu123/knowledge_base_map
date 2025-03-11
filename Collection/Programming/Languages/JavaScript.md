JavaScript is a versatile, high-level programming language commonly used for web development. It supports multiple programming paradigms, including **procedural**, **object-oriented**, and **functional programming**. Below is a **complete breakdown of JavaScript syntax**, covering its core components and features.

---

### 1. **Basic Syntax Rules**
   - **Case Sensitivity:** JavaScript is case-sensitive (`myVar` and `myvar` are different).
   - **Statements:** End with a semicolon (`;`), though they are optional in most cases.
   - **Whitespace:** Spaces, tabs, and newlines are ignored except as separators.
   - **Comments:**
     - Single-line: `// This is a comment`
     - Multi-line: `/* This is a multi-line comment */`

---

### 2. **Data Types**
   JavaScript is dynamically typed, meaning variables can hold values of any type.

   #### a. **Primitive Types**
   - **Number:** `42`, `3.14`, `NaN`, `Infinity`
   - **String:** `"Hello"`, `'World'`, `` `Template ${literal}` ``
   - **Boolean:** `true`, `false`
   - **Undefined:** `undefined` (a variable that has not been assigned a value)
   - **Null:** `null` (intentional absence of a value)
   - **BigInt:** `123n` (for large integers)
   - **Symbol:** `Symbol('description')` (unique and immutable)

   #### b. **Object Types**
   - **Object:** `{ key: 'value' }`
   - **Array:** `[1, 2, 3]`
   - **Function:** `function() {}`
   - **Date:** `new Date()`
   - **RegExp:** `/pattern/`

---

### 3. **Variables and Constants**
   - **`var`:** Declares a variable (function-scoped).
     ```javascript
     var x = 10;
     ```
   - **`let`:** Declares a block-scoped variable.
     ```javascript
     let y = 20;
     ```
   - **`const`:** Declares a block-scoped constant.
     ```javascript
     const z = 30;
     ```

---

### 4. **Operators**
   JavaScript supports a wide range of operators.

   #### a. **Arithmetic Operators**
   - `+`, `-`, `*`, `/`, `%`, `**` (exponentiation), `++`, `--`

   #### b. **Comparison Operators**
   - `==`, `!=`, `===`, `!==`, `>`, `<`, `>=`, `<=`

   #### c. **Logical Operators**
   - `&&` (and), `||` (or), `!` (not)

   #### d. **Assignment Operators**
   - `=`, `+=`, `-=`, `*=`, `/=`, `%=`

   #### e. **Ternary Operator**
   - `condition ? expr1 : expr2`

---

### 5. **Control Structures**
   - **Conditionals:**
     - **`if`:** Executes a block if a condition is true.
       ```javascript
       if (x > 10) {
         console.log("x is greater than 10");
       }
       ```
     - **`else`:** Executes a block if the `if` condition is false.
       ```javascript
       if (x > 10) {
         console.log("x is greater than 10");
       } else {
         console.log("x is 10 or less");
       }
       ```
     - **`else if`:** Adds additional conditions.
       ```javascript
       if (x > 10) {
         console.log("x is greater than 10");
       } else if (x === 10) {
         console.log("x is 10");
       } else {
         console.log("x is less than 10");
       }
       ```
     - **`switch`:** Multi-branch conditional.
       ```javascript
       switch (x) {
         case 1:
           console.log("x is 1");
           break;
         case 2:
           console.log("x is 2");
           break;
         default:
           console.log("x is something else");
       }
       ```

   - **Loops:**
     - **`for`:** Iterates a block of code.
       ```javascript
       for (let i = 0; i < 5; i++) {
         console.log(i);
       }
       ```
     - **`while`:** Executes a block while a condition is true.
       ```javascript
       let i = 0;
       while (i < 5) {
         console.log(i);
         i++;
       }
       ```
     - **`do...while`:** Executes a block at least once.
       ```javascript
       let i = 0;
       do {
         console.log(i);
         i++;
       } while (i < 5);
       ```
     - **`for...in`:** Iterates over object properties.
       ```javascript
       const obj = { a: 1, b: 2 };
       for (let key in obj) {
         console.log(key, obj[key]);
       }
       ```
     - **`for...of`:** Iterates over iterable objects (e.g., arrays).
       ```javascript
       const arr = [1, 2, 3];
       for (let value of arr) {
         console.log(value);
       }
       ```

---

### 6. **Functions**
   - **Function Declaration:**
     ```javascript
     function add(a, b) {
       return a + b;
     }
     ```
   - **Function Expression:**
     ```javascript
     const add = function(a, b) {
       return a + b;
     };
     ```
   - **Arrow Function:**
     ```javascript
     const add = (a, b) => a + b;
     ```
   - **Immediately Invoked Function Expression (IIFE):**
     ```javascript
     (function() {
       console.log("IIFE");
     })();
     ```

---

### 7. **Objects**
   - **Object Literal:**
     ```javascript
     const person = {
       name: "Alice",
       age: 25,
       greet: function() {
         console.log("Hello, " + this.name);
       }
     };
     ```
   - **Constructor Function:**
     ```javascript
     function Person(name, age) {
       this.name = name;
       this.age = age;
     }
     const alice = new Person("Alice", 25);
     ```
   - **Class (ES6):**
     ```javascript
     class Person {
       constructor(name, age) {
         this.name = name;
         this.age = age;
       }
       greet() {
         console.log("Hello, " + this.name);
       }
     }
     const alice = new Person("Alice", 25);
     ```

---

### 8. **Arrays**
   - **Array Literal:**
     ```javascript
     const arr = [1, 2, 3];
     ```
   - **Array Methods:**
     - `push()`, `pop()`, `shift()`, `unshift()`
     - `map()`, `filter()`, `reduce()`, `forEach()`
     ```javascript
     const doubled = arr.map(x => x * 2);
     ```

---

### 9. **Asynchronous Programming**
   - **Callbacks:**
     ```javascript
     setTimeout(() => {
       console.log("Hello after 1 second");
     }, 1000);
     ```
   - **Promises:**
     ```javascript
     const promise = new Promise((resolve, reject) => {
       setTimeout(() => resolve("Done"), 1000);
     });
     promise.then(result => console.log(result));
     ```
   - **Async/Await:**
     ```javascript
     async function fetchData() {
       const result = await promise;
       console.log(result);
     }
     ```

---

### 10. **Modules**
   - **Export:**
     ```javascript
     // math.js
     export function add(a, b) {
       return a + b;
     }
     ```
   - **Import:**
     ```javascript
     import { add } from './math.js';
     console.log(add(2, 3));
     ```

---

### Summary of JavaScript Syntax
| Feature              | Example                          |
|----------------------|----------------------------------|
| **Variables**        | `let x = 10;`                   |
| **Functions**        | `function add(a, b) { ... }`    |
| **Objects**          | `const obj = { key: 'value' };` |
| **Arrays**           | `const arr = [1, 2, 3];`        |
| **Conditionals**     | `if (x > 10) { ... }`           |
| **Loops**            | `for (let i = 0; i < 5; i++)`   |
| **Promises**         | `promise.then(result => ...)`    |
| **Classes**          | `class Person { ... }`          |
| **Modules**          | `export function add() { ... }` |

---
