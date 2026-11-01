# 04. COBOL

### Breakdown of COBOL Syntax

**COBOL** (Common Business-Oriented Language) is one of the oldest programming languages, developed in the 1950s, primarily for business, finance, and administrative systems. It has a very verbose and readable syntax, designed to be close to natural language. It’s still used today in legacy systems, especially in banking, government, and insurance sectors.

---

### **1. Structure of a COBOL Program**

A COBOL program is typically divided into **four divisions**:

1. **Identification Division**: Provides metadata about the program.
2. **Environment Division**: Defines the environment in which the program will run (e.g., file handling).
3. **Data Division**: Describes the data structures and variables used by the program.
4. **Procedure Division**: Contains the executable logic of the program.

#### Example of a basic COBOL program:

```cobol
IDENTIFICATION DIVISION.
PROGRAM-ID. HelloWorld.

ENVIRONMENT DIVISION.

DATA DIVISION.

PROCEDURE DIVISION.
    DISPLAY "Hello, World!".
    STOP RUN.
```

---

### **2. Identification Division**

The **Identification Division** contains the program’s name and other metadata. It’s mostly used for documentation and metadata purposes.

```cobol
IDENTIFICATION DIVISION.
PROGRAM-ID. HelloWorld.
AUTHOR. John Doe.
DATE-WRITTEN. 2025-03-01.
```

- **PROGRAM-ID**: Specifies the name of the program (required).
- **AUTHOR**: Provides the name of the author.
- **DATE-WRITTEN**: Specifies when the program was written.

---

### **3. Environment Division**

The **Environment Division** defines the environment the program will operate in, such as file handling.

```cobol
ENVIRONMENT DIVISION.
INPUT-OUTPUT SECTION.
FILE-CONTROL.
    SELECT inputFile ASSIGN TO 'INPUT.TXT'.
```

- **INPUT-OUTPUT SECTION**: Used for defining input and output files or devices.
- **FILE-CONTROL**: Defines how files are handled in the program.

---

### **4. Data Division**

The **Data Division** describes all the variables, file formats, and data structures used in the program. It is divided into sections like **File Section**, **Working-Storage Section**, and **Local-Storage Section**.

#### Example of declaring variables:

```cobol
DATA DIVISION.
WORKING-STORAGE SECTION.
01 user-name        PIC X(20).
01 user-age         PIC 99.
01 user-salary      PIC 9(5)V99.
```

- **WORKING-STORAGE SECTION**: This section is used to define variables that will be used during program execution.
- **PIC**: Specifies the data type and size.
    - **`PIC X(n)`**: String of length `n`.
    - **`PIC 9(n)`**: Numeric value with `n` digits.
    - **`PIC 9(n)V99`**: Numeric value with an implied decimal point.

---

### **5. Procedure Division**

The **Procedure Division** is where the logic of the program resides. This is where computations, decisions, and data manipulations take place. It uses a declarative and verbose syntax.

#### Example of displaying a message:

```cobol
PROCEDURE DIVISION.
    DISPLAY "Enter your name: ".
    ACCEPT user-name.
    DISPLAY "Hello, " user-name.
    STOP RUN.
```

- **DISPLAY**: Outputs a message or value to the screen.
- **ACCEPT**: Reads input from the user or from a file.

#### Example of a simple calculation:

```cobol
PROCEDURE DIVISION.
    ADD 10 TO user-age.
    DISPLAY "User's new age: " user-age.
    STOP RUN.
```

- **ADD**: Adds a value to a variable.
- **DISPLAY**: Outputs the result to the screen.

---

### **6. Control Structures**

COBOL has standard control flow mechanisms like **IF-ELSE**, **PERFORM** (loops), and **EVALUATE** (similar to switch-case).

#### **IF-ELSE Statement**

```cobol
IF user-age > 18
    DISPLAY "Adult".
ELSE
    DISPLAY "Minor".
END-IF.
```

- **IF**: Begins a conditional block.
- **ELSE**: Executes an alternative block if the condition is false.

#### **PERFORM Loop (For Iteration)**

```cobol
PERFORM 10 TIMES
    DISPLAY "Iteration: " counter
    ADD 1 TO counter.
END-PERFORM.
```

- **PERFORM**: Repeats a section of code a specified number of times.
- **ADD**: Used to increment a counter or modify a variable.

#### **EVALUATE (Switch-Case Equivalent)**

```cobol
EVALUATE user-age
    WHEN 18
        DISPLAY "Just an adult."
    WHEN 19
        DISPLAY "Young adult."
    WHEN OTHER
        DISPLAY "Other age."
END-EVALUATE.
```

- **EVALUATE**: Acts as a **switch-case** or **if-else** statement, matching values to blocks of code.

---

### **7. File Handling**

COBOL has extensive support for file handling, typically in the **File Section** of the **Data Division**. It supports sequential, indexed, and relative files.

#### Example of reading a file:

```cobol
FILE-CONTROL.
    SELECT inputFile ASSIGN TO 'INPUT.TXT'
        ORGANIZATION IS LINE SEQUENTIAL.

DATA DIVISION.
FILE SECTION.
FD  inputFile.
01  inputFileRecord PIC X(100).

PROCEDURE DIVISION.
OPEN INPUT inputFile.
READ inputFile INTO inputFileRecord.
DISPLAY inputFileRecord.
CLOSE inputFile.
```

- **FD (File Description)**: Specifies the file’s format.
- **OPEN INPUT**: Opens a file for reading.
- **READ**: Reads data from the file into a variable.
- **CLOSE**: Closes the file when done.

---

### **8. Arrays (Tables)**

COBOL allows arrays, called **tables**, to hold multiple items of the same type.

```cobol
DATA DIVISION.
WORKING-STORAGE SECTION.
01  employee-table.
    05  employee-name OCCURS 10 TIMES PIC X(20).

PROCEDURE DIVISION.
    MOVE "John Doe" TO employee-name (1).
    DISPLAY employee-name (1).
```

- **OCCURS**: Defines the number of elements in the array.
- **INDEXING**: Arrays are accessed using indices, such as `(1)` for the first element.

---

### **9. Subroutines (Called Programs)**

COBOL allows calling other programs or subroutines within the same or other COBOL programs.

```cobol
PROCEDURE DIVISION.
    CALL "subprogram" USING employee-name.
    STOP RUN.
```

- **CALL**: Invokes another COBOL program or subroutine.

---

### **10. Error Handling (Declarative Section)**

COBOL supports error handling using **DECLARATIVES** and **USE**.

```cobol
DECLARATIVES.
   FILE-ERROR HANDLER.
   PROCEDURE DIVISION.
       IF file-status = "00"
           DISPLAY "File is open."
       ELSE
           DISPLAY "Error: " file-status.
       END-IF.
```

- **FILE-ERROR HANDLER**: A declarative part that handles file errors.

---

### **Summary of Key Points:**

- COBOL is designed for business data processing, with a focus on readability and verbosity.
- **Program Structure**: Divided into **Identification**, **Environment**, **Data**, and **Procedure** divisions.
- **Variables**: Declared in the **Data Division**, using `PIC` to define data types.
- **Control Flow**: Includes **IF-ELSE**, **PERFORM** loops, and **EVALUATE** for conditional logic.
- **File Handling**: Supports different file types like sequential and indexed files.
- **Procedures and Subroutines**: Programs are modular, and subroutines can be called using `CALL`.
- **Arrays (Tables)**: COBOL uses **OCCURS** to define arrays with fixed sizes.
- **Error Handling**: The **DECLARATIVES** section is used for error management.

COBOL's syntax may seem verbose, but it was designed for clarity and readability, making it highly suitable for business logic and handling large volumes of data processing.