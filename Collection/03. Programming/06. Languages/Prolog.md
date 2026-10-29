

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
- **;** (Or, disjunction) X
- **not** (Negation) X

### **Examples**: `:-`

#### **Implies (IF)**: `,`

```prolog
grandparent(X, Y) :- parent(X, Z), parent(Z, Y).
```
X is a grandparent of Y if X is a parent of Z, and Z is a parent of Y.

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

Here are examples in Prolog for `member`, `append`, and `reverse`:

#### **Member**
The `member` predicate checks if an element is a member of a list.

```prolog
% member(Element, List)
member(X, [X|_]).  % If X is the head of the list, it's a member.
member(X, [_|T]) :- member(X, T).  % Recursively check the tail of the list.
```

##### Example Usage:
```prolog
?- member(3, [1, 2, 3, 4]).
true.

?- member(5, [1, 2, 3, 4]).
false.
```

#### **Append**
The `append` predicate concatenates two lists.

```prolog
% append(List1, List2, Result)
append([], L, L).  % If the first list is empty, the result is the second list.
append([H|T], L, [H|R]) :- append(T, L, R).  % Add the head to the result and recursively append the tail.
```

##### Example Usage:
```prolog
?- append([1, 2], [3, 4], Result).
Result = [1, 2, 3, 4].

?- append([], [3, 4], Result).
Result = [3, 4].
```

#### **Reverse**
The `reverse` predicate reverses a list.

```prolog
% reverse(List, ReversedList)
reverse([], []).  % The reverse of an empty list is an empty list.
reverse([H|T], R) :- reverse(T, RevT), append(RevT, [H], R).  % Reverse the tail and append the head at the end.
```

##### Example Usage:
```prolog
?- reverse([1, 2, 3], R).
R = [3, 2, 1].

?- reverse([], R).
R = [].
```

#### **Absolute**
```prolog
my_abs(N, N) :- N >= 0.
my_abs(N, Abs) :- N < 0, Abs is -N.
```
These are basic implementations. Each of these predicates demonstrates typical recursive patterns commonly used in Prolog.

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

- `X =:= Y` → Equal (numbers only)
- `X \= Y` → Not Equal (non-numeric)
- `X =\= Y` → Not equal (numbers only)
- `X > Y` → Greater than
- `X < Y` → Less than
- `X >= Y` → Greater than or equal
- `X =< Y` → Less than or equal
- `X =.. Y` → Convert Structure to List (vice versa)

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
    


### ** Builting Custom Predicates**

#### ** Custom Member **

```prolog
% Base case: If X is the head of the list, it is a member.
cmember(X, [X|_]).

% Recursive case: If X is not the head, check the tail of the list.
cmember(X, [_|Tail]) :-
    cmember(X, Tail).
```

Send a query after compilation
```prolog
cmember(3,[1,2,3])
```

#### ** Custom Append **


```prolog
cappend([], L, L).           % Concatenating an empty list with L gives L.
cappend([H|T], L, [H|L1]) :- % If the first list is not empty, add the head to the result.
    cappend(T, L, L1).       % Recursively append the tail.
```

- First Clause: If the first list is empty ([]), the result is just the second list L. This handles the case when you've finished going through the first list and only need to return the second list.
- Second Clause: If the first list is not empty ([H|T]), the head H is added to the result list. Then, you recursively append the tail of the first list (T) with the second list (L) to get the rest of the result (L1).

---

## **7. Recursion**

- Prolog heavily uses **recursion** to process lists or perform tasks that require repeated reasoning.

### **Example (List Count)**:

```prolog
clength([], 0).               % Base case: An empty list has length 0.

clength([_|T], N) :-          % Recursive case: A non-empty list.
    clength(T, N1),          % Recursively get the length of the tail.
    N is N1 + 1.             % Add 1 for the head element.
```


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
## **11. Debug And Trace**

To remove the trace (i.e., stop tracing) in SWI-Prolog, you can use the following command:

### **To turn off tracing:**
```prolog
?- notrace.
```

This will disable tracing, so Prolog will no longer show the details of the execution steps.

### **To stop the trace and disable all debugging features:**
If you are done debugging and want to make sure everything is clean, you can also use:

```prolog
?- nodebug.
```

### **To turn tracing on again (if needed):**
If you want to re-enable tracing, you can use:

```prolog
?- trace.
```

### **Summary of Commands:**
- `notrace.` – Turns off tracing.
- `nodebug.` – Disables all debugging features.
- `trace.` – Enables tracing again.


---
### **Conclusion**

Prolog’s syntax is deeply rooted in **logic and relationships**. It leverages **facts** and **rules** to infer new information and **answers queries** based on its knowledge base. It’s very different from traditional programming languages, with a focus on **what to solve** instead of **how to solve it**.



