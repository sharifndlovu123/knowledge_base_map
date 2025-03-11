UCBLogo (University of California, Berkeley Logo) uses a simple, Lisp-like syntax with a focus on **turtle graphics** and **recursion**. Below is an overview of its syntax and key features.

# Syntax

---

### **1. Basic Commands**

```logo
FORWARD 100    ; Move forward by 100 units
BACK 50        ; Move backward by 50 units
RIGHT 90       ; Turn right by 90 degrees
LEFT 45        ; Turn left by 45 degrees
```

---

### **2. Drawing Shapes**

#### **Draw a Square**

```logo
REPEAT 4 [ FORWARD 100 RIGHT 90 ]
```

- `REPEAT 4 [...]` repeats the commands inside the brackets **4 times**.

#### **Draw a Triangle**

```logo
REPEAT 3 [ FORWARD 100 RIGHT 120 ]
```

---

### **3. Variables & Math**

#### **Set a Variable**

```logo
MAKE "x 50  ; Create variable x with value 50
PRINT :x    ; Print value of x
```

#### **Basic Arithmetic**

```logo
PRINT 2 + 3
PRINT 10 * 5
PRINT 100 / 4
PRINT 10 - 3
```

---

### **4. Procedures (Functions)**

#### **Defining and Using a Procedure**

```logo
TO SQUARE :SIZE
    REPEAT 4 [ FORWARD :SIZE RIGHT 90 ]
END

SQUARE 50  ; Call the function with SIZE=50
SQUARE 100 ; Call the function with SIZE=100
```

- `TO` starts a function definition.
- `:SIZE` is a **parameter**.
- `END` marks the function’s end.

---

### **5. Recursion (Fractals & Trees)**

#### **Recursive Tree**

```logo
TO TREE :SIZE
    IF :SIZE < 5 [ STOP ]
    FORWARD :SIZE
    RIGHT 30
    TREE :SIZE * 0.7
    LEFT 60
    TREE :SIZE * 0.7
    RIGHT 30
    BACK :SIZE
END

TREE 100
```

- Uses recursion to create a branching tree.

---

### **6. Looping (Alternative to REPEAT)**

#### **While Loop with Conditional**

```logo
MAKE "count 0
WHILE :count < 5 [
    PRINT :count
    MAKE "count :count + 1
]
```

---

### **7. Conditional Statements**

#### **If-Else Condition**

```logo
TO CHECK :NUM
    IF :NUM > 10 [ PRINT "Greater than 10" ]
    IF :NUM <= 10 [ PRINT "Less or equal to 10" ]
END

CHECK 15
CHECK 8
```

---

### **8. User Input**

```logo
PRINT [Enter a number:]
MAKE "num READ
PRINT [You entered:] PRINT :num
```

---

### **9. Turtle Control**

#### **Pen Up / Down**

```logo
PENUP    ; Stop drawing
FORWARD 50
PENDOWN  ; Resume drawing
```

#### **Change Pen Color**

```logo
SETPC [255 0 0]  ; Red color (RGB)
```

#### **Change Background Color**

```logo
SETBG 3  ; Set background color (number varies per system)
```

---

### **10. Clearing and Resetting**

```logo
CLEARSCREEN   ; Clear the screen
HIDETURTLE    ; Hide the turtle
SHOWTURTLE    ; Show the turtle
```

---

### **Final Notes**

- UCBLogo is case-insensitive.
- Commands can be shortened (`FD` for `FORWARD`, `RT` for `RIGHT`, `LT` for `LEFT`).
- Comments are written with `;`.

Would you like examples of something specific? 🚀

# Circle

In **UCBLogo**, you can draw a **circle** using the `REPEAT` command with small movements and turns. Since Logo does not have a built-in `CIRCLE` command, you approximate a circle by making small steps in a loop.

### **Method 1: Using REPEAT**

```logo
REPEAT 360 [ FORWARD 1 RIGHT 1 ]
```

- This makes the turtle move forward **1 unit** and turn **1 degree**, completing a full 360-degree circle.

### **Method 2: Adjusting Size**

To make a larger circle, increase the forward movement:

```logo
REPEAT 360 [ FORWARD 2 RIGHT 1 ]
```

- This creates a larger circle by moving **2 units per step**.

### **Method 3: Using a Procedure**

You can create a function to draw circles of different sizes:

```logo
TO CIRCLE :RADIUS
    REPEAT 360 [ FORWARD :RADIUS * 0.017 RIGHT 1 ]
END

CIRCLE 10   ; Small circle
CIRCLE 50   ; Large circle
```

- The `:RADIUS * 0.017` scales the movement to maintain a circular shape.

### **Method 4: Using ARC (If Available)**

Some **Logo implementations** support an `ARC` command:

```logo
ARC 360 50  ; 360-degree arc with radius 50
```

- Not all UCBLogo versions have this feature.

Would you like a more complex shape, like a spiral or a flower pattern? 🚀

# Pen

In **UCBLogo**, you can move the turtle without drawing by using **PENUP** (`PU`) before moving and **PENDOWN** (`PD`) to resume drawing.

### **Example: Move Without Drawing**

```logo
PENUP    ; Lift the pen (no drawing)
FORWARD 100  ; Move forward without drawing
PENDOWN  ; Put the pen down (resume drawing)
FORWARD 50   ; This part will be drawn
```

### **Alternative Short Commands**

- `PU` = `PENUP`
- `PD` = `PENDOWN`

### **Example: Move to a Specific Position**

```logo
PENUP
BACK 50
RIGHT 90
FORWARD 50
LEFT 90
PENDOWN
```

- Moves the turtle **back and to the right** without drawing.
- **Resumes drawing** at the new position.

Would you like a way to teleport the turtle instantly to a position? 🚀

# Clear

In **UCBLogo**, you can clear the page using the following commands:

### **1. CLEARSCREEN (CS)**

```logo
CLEARSCREEN
```

or the shorthand:

```logo
CS
```

- Clears the screen and moves the turtle back to the center (home position).

---

### **2. ERASING WITHOUT MOVING THE TURTLE**

```logo
CLEAN
```

- Erases all drawings but **keeps the turtle in its current position**.

---

### **3. RESET EVERYTHING**

```logo
CLEARALL
```

- Clears the screen, resets all variables, and **completely restarts the environment**.

Would you like to clear only specific parts of the screen instead? 🚀




```logo
TO CIRCLE :RADIUS
	REPEAT 360 [ FORWARD :RADIUS * 0.017 RIGHT 1 ]
	END
```