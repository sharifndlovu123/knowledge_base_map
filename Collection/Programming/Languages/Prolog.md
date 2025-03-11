# **Prolog Syntax Breakdown**

Prolog is a **logic programming language** primarily used for **declarative problem solving** and artificial intelligence applications. It is quite different from procedural or object-oriented programming languages like C, Python, or Java. In Prolog, you express **relationships** and **facts**, and the system uses **logical inference** to answer queries.

---

## **1. Basic Prolog Syntax Elements**

### **a) Facts**

- A **fact** is a basic assertion about something that is **true**.
- Syntax:
    
    ```prolog
    fact_name(argument1, argument2, ..., argumentN).
    ```
    
- Example:
    
    ```prolog
    parent(john, mary).
    parent(mary, susan).
    ```
    
    This means:
    - John is a parent of Mary.
    - Mary is a parent of Susan.

### **b) Rules**

- A **rule** defines relationships or how new facts can be inferred from other facts.
- Syntax:
    
    ```prolog
    head :- body.
    ```
    
    - **Head**: the conclusion or the fact being inferred.
    - **Body**: the conditions that must be true for the rule to apply.
- Example:
    
    ```prolog
    grandparent(X, Y) :- parent(X, Z), parent(Z, Y).
    ```
    
    This means:  
    X is a grandparent of Y if X is a parent of Z and Z is a parent of Y.

### **c) Queries**

- A **query** is used to ask Prolog if a specific fact or rule is true.
- Syntax:
    
    ```prolog
    ?- query.
    ```
    
    - The `?-` is the prompt asking Prolog to answer a question.
- Example:
    
    ```prolog
    ?- parent(john, mary).
    ```
    
    This asks: "Is John a parent of Mary?"

---

## **2. Variables and Constants**

- **Variables** in Prolog start with an uppercase letter or an underscore.
- **Constants** start with a lowercase letter.

### **Examples:**

- **Variable**: `X`, `Person`, `_Name` (underscore means unused variable)
- **Constant**: `john`, `mary`, `susan`

### **Binding Variables**

- In Prolog, when a query is satisfied, **variables** are bound to the values that make the fact or rule true.

Example:

```prolog
?- parent(john, X).
```

This query asks "Who is a child of John?" Prolog will respond with `X = mary` because of the fact `parent(john, mary)`.

---

## **3. Operators**

Prolog has several built-in operators, such as:

- **:-** (If, implies)
- **,** (And, conjunction)
- **;** (Or, disjunction)
- **not** (Negation)

### **Examples:**

#### **Conjunction (AND)**: `,`

```prolog
parent(john, mary), parent(mary, susan).
```

This is interpreted as: "John is a parent of Mary **and** Mary is a parent of Susan."

#### **Disjunction (OR)**: `;`

```prolog
parent(john, mary); parent(mary, susan).
```

This means: "Either John is a parent of Mary **or** Mary is a parent of Susan."

#### **Negation**: `not`

```prolog
not(parent(john, susan)).
```

This means: "It is **not** true that John is a parent of Susan."

---

## **4. Lists**

- Lists in Prolog are written using square brackets, e.g., `[Head|Tail]`.
    - **Head** is the first element of the list.
    - **Tail** is the rest of the list (can be an empty list `[]`).

### **Example:**

```prolog
list_example([1, 2, 3]).
```

This is a fact that asserts `[1, 2, 3]` is a list.

### **Accessing List Elements:**

- You can decompose a list into its **head** and **tail** using the `|` operator.

```prolog
?- [Head|Tail] = [1, 2, 3].
```

This will return:

```prolog
Head = 1,
Tail = [2, 3].
```

---

## **5. Arithmetic in Prolog**

- Prolog has built-in predicates for arithmetic.
- Syntax:  
    `is/2` is used to evaluate arithmetic expressions.

### **Examples:**

```prolog
?- X is 3 + 4.
```

This will return `X = 7`.

You can also use comparison operators:

- `=:=` (equal to)
- `=..` (unifies an expression)

### **Example:**

```prolog
?- X is 5 * 3, X =:= 15.
```

This will return `true`.

---

## **6. Built-in Predicates**

Prolog provides many **built-in predicates** to perform common tasks:

- **member/2**: Checks if an element is in a list.
    
    ```prolog
    member(X, [1, 2, 3]).
    ```
    
- **length/2**: Finds the length of a list.
    
    ```prolog
    length([1, 2, 3], L).
    ```
    
- **append/3**: Appends two lists.
    
    ```prolog
    append([1, 2], [3, 4], Result).
    ```
    

---

## **7. Recursion**

- Prolog heavily uses **recursion** to process lists or perform tasks that require repeated reasoning.

### **Example (Factorial)**:

```prolog
factorial(0, 1).
factorial(N, F) :- N > 0, N1 is N - 1, factorial(N1, F1), F is N * F1.
```

This defines the factorial function:

- `factorial(0, 1)` is the base case.
- The recursive rule multiplies `N` by the factorial of `N-1`.

---

## **8. Facts and Rules in Action**

### **Fact**:

```prolog
parent(john, mary).
parent(mary, susan).
```

### **Rule**:

```prolog
grandparent(X, Y) :- parent(X, Z), parent(Z, Y).
```

### **Query**:

```prolog
?- grandparent(john, X).
```

This asks: "Who is a grandchild of John?"  
Prolog will answer `X = susan`, because John is a parent of Mary, and Mary is a parent of Susan.

---

## **9. Prolog Execution Flow**

1. **Prolog Database**: The knowledge base containing **facts** and **rules**.
2. **Query**: The system takes a **query** and attempts to match it with facts and rules.
3. **Backtracking**: If Prolog does not find an immediate solution, it **backtracks** and tries other possibilities.
4. **Solution**: Prolog binds variables and either **succeeds** with the solution or fails.

---

## **10. Key Differences Between Prolog and Other Languages**

- **Declarative**: Prolog doesn't tell the computer "how" to do something. It tells it "what" should be true.
- **Logical Inference**: Prolog answers queries through logical inference, rather than following an explicit sequence of steps (like in imperative languages).
- **Focus on Relationships**: Prolog is ideal for expressing **relationships** (e.g., family trees, knowledge graphs).

---

### **Conclusion**

Prolog’s syntax is deeply rooted in **logic and relationships**. It leverages **facts** and **rules** to infer new information and **answers queries** based on its knowledge base. It’s very different from traditional programming languages, with a focus on **what to solve** instead of **how to solve it**.