Fortran 2008 is a modern version of the Fortran programming language, building upon Fortran 2003 with additional features for parallel computing, interoperability, and cleaner syntax.

---

### **1. Program Structure**
```fortran
program my_program
  implicit none
  ! declarations
  ...
end program my_program
```

- `implicit none` forces explicit variable declaration (recommended).
- `program`...`end program` marks the main entry.

---

### **2. Variable Declaration**
```fortran
integer :: i
real :: x
character(len=20) :: name
logical :: flag
complex :: z
```

---

### **3. Constants and Parameters**
```fortran
real, parameter :: pi = 3.14159
```

---

### **4. Control Structures**

#### **If/Else**
```fortran
if (x > 0.0) then
  ...
else if (x == 0.0) then
  ...
else
  ...
end if
```

#### **Select Case**
```fortran
select case (i)
case (1)
  ...
case (2:5)
  ...
case default
  ...
end select
```

#### **Do Loop**
```fortran
do i = 1, 10
  ...
end do
```

#### **Do While**
```fortran
do while (x < 100)
  ...
end do
```

---

### **5. Procedures (Functions and Subroutines)**

#### **Function**
```fortran
function square(x) result(res)
  real, intent(in) :: x
  real :: res
  res = x * x
end function square
```

#### **Subroutine**
```fortran
subroutine swap(a, b)
  integer, intent(inout) :: a, b
  integer :: temp
  temp = a
  a = b
  b = temp
end subroutine swap
```

---

### **6. Modules**
```fortran
module my_utils
  contains
    function double(x)
      real :: x, double
      double = 2.0 * x
    end function double
end module my_utils

program use_utils
  use my_utils
  ...
end program use_utils
```

---

### **7. Arrays**
```fortran
integer, dimension(10) :: a
real, dimension(:), allocatable :: b
allocate(b(100))
b = 1.0  ! vectorized assignment
```

---

### **8. Derived Types (like structs)**
```fortran
type :: person
  character(len=50) :: name
  integer :: age
end type person

type(person) :: p
p%name = "Alice"
```

---

### **9. File I/O**
```fortran
open(unit=10, file='data.txt', status='old')
read(10, *) x
write(10, *) y
close(10)
```

---

### **10. Fortran 2008 Specific Features**

- **Submodules**: Allow better separation of interface and implementation.
- **DO CONCURRENT**: Parallel loop construct.
  ```fortran
  do concurrent (i = 1:100)
    a(i) = i * 2
  end do
  ```
- **BLOCK construct**:
  ```fortran
  block
    integer :: temp
    ...
  end block
  ```
- **CONTIGUOUS attribute**: For arrays that must be stored without gaps in memory.
- **EXECUTE_COMMAND_LINE**: Run shell commands directly.

---


In **Fortran**, a **module** is a container for **reusable code**—think of it as a way to **organize functions, subroutines, variables, types, interfaces**, and more in a single place.

### 🔧 What modules do:
- **Encapsulate code** into logical units.
- **Share variables and procedures** across multiple program units.
- Enable **interface checking** and **code reuse**.
- Support **modular design**, **data hiding**, and **compile-time consistency**.

---

### 🔩 Basic Syntax:

```fortran
module math_utils
  implicit none
  real, parameter :: pi = 3.14159

contains

  function square(x) result(res)
    real, intent(in) :: x
    real :: res
    res = x * x
  end function square

end module math_utils
```

### 🔗 Using a Module:

```fortran
program main
  use math_utils
  implicit none
  real :: r
  r = square(5.0)
  print *, "5 squared =", r
  print *, "Pi =", pi
end program main
```

---

### ✅ Key Features of Modules:

1. **Encapsulation**  
   - Group related procedures/types/constants.
   - Example: a `geometry` module could contain all shape-related functions.

2. **Scope control**
   - You can **hide** internals using `private` and **expose** with `public`.
     ```fortran
     module secure
       implicit none
       private
       public :: allowed_func
       contains
         subroutine allowed_func()
           ...
         end subroutine
         subroutine hidden()
           ...
         end subroutine
     end module
     ```

3. **Avoid redundancy**
   - No need to rewrite interfaces for procedures.
   - The compiler checks for **argument correctness**.

4. **Can include types and global variables**
   ```fortran
   module config
     integer :: buffer_size = 1024
     character(len=20) :: app_name = "MyApp"
   end module
   ```

---

### 🧱 Modules vs Include:

- `INCLUDE` is a preprocessor directive (just pastes code in).
- `MODULE` is **typed, checked, and structured**—way more powerful and modern.

---

Here’s the **no-bs breakdown** of the difference between a **function** and a **subroutine** in Fortran:

---

### 🔁 **Subroutine**
- **Performs actions**, possibly modifies multiple variables.
- **Doesn't return a value directly**—returns via arguments (`intent(out)` or `intent(inout)`).
- Call it with `call`.

#### **Example:**
```fortran
subroutine swap(a, b)
  integer, intent(inout) :: a, b
  integer :: temp
  temp = a
  a = b
  b = temp
end subroutine

! Usage
call swap(x, y)
```

---

### ➕ **Function**
- **Returns a single value** via the `result(...)`.
- Typically used for **calculations**.
- Called like an expression.

#### **Example:**
```fortran
function square(x) result(res)
  real, intent(in) :: x
  real :: res
  res = x * x
end function

! Usage
y = square(5.0)
```

---

### 🔍 Side-by-side Comparison

| Feature              | Subroutine              | Function                   |
|----------------------|-------------------------|----------------------------|
| Call style           | `call swap(a, b)`       | `y = square(x)`            |
| Return value         | None directly (via args) | Direct value via `result` |
| Return count         | Multiple (via args)     | One                        |
| Use in expressions   | No                      | Yes                        |
| Purpose              | Perform actions/tasks   | Calculate and return value |
| Syntax keyword       | `subroutine`            | `function`                 |

---

### 🧠 When to use:
- **Function**: When you need **one result** (e.g. `distance(x, y)`).
- **Subroutine**: When you need to **update multiple things**, **do side effects**, or **perform tasks** (e.g. `read_file(filename, lines)`).




---

To explicitly compile **Fortran 2008** code and enforce the standard, you need to pass the correct flag to your compiler. Here's how to do it with **GFortran**, **Intel Fortran**, and others.

---

### ✅ GFortran

#### **Command**
```bash
gfortran -std=f2008 your_file.f90 -o your_program
```

#### **Explanation**
- `-std=f2008`: Enforces **Fortran 2008 standard**. Compiler will warn on non-conforming code.
- `-Wall`: (Optional) Enables all warnings.
- `-O2` or `-O3`: (Optional) Optimization level.

#### **Example**
```bash
gfortran -std=f2008 -Wall -O2 test.f90 -o test
```

---

### ✅ Intel Fortran Compiler (ifort / ifx)

Intel compilers **automatically support** Fortran 2008 features (no flag needed), but to be safe:

#### **Command**
```bash
ifort -stand f08 your_file.f90 -o your_program
```
or
```bash
ifx -stand f08 your_file.f90 -o your_program
```

#### **Explanation**
- `-stand f08`: Check code for **Fortran 2008 standard** compliance (does not enforce, but warns).
- `-warn all`: Show all warnings.

---

### ❌ Don't Use `-std=f95` or `-std=f03`
Those will block 2008 features like `do concurrent`, submodules, and other enhancements.

---

### 💡 How to verify you're using 2008 features

Try compiling a simple 2008 feature like `do concurrent`:

```fortran
program test_concurrent
  implicit none
  integer :: i, a(5)
  do concurrent (i = 1:5)
    a(i) = i * 10
  end do
  print *, a
end program
```

Compile:
```bash
gfortran -std=f2008 test_concurrent.f90 -o test_concurrent
./test_concurrent
```

If that works without errors, you're compiling Fortran 2008 correctly.

---

Exactly. Here it is in plain, no-nonsense terms:

- **`intent(in)`**:  
  ✅ You can **read it** inside the procedure  
  ❌ You **cannot change** it  

- **`intent(out)`**:  
  ❌ You **can’t read** its value when it comes in  
  ✅ You **must assign** a value to it inside  
  ✅ That value gets **sent back** to the caller  

- **`intent(inout)`**:  
  ✅ You **can read** it when it comes in  
  ✅ You **can change** it  
  ✅ The **new value goes back** to the caller  

---

This is how Fortran tells the compiler (and the programmer) what the subroutine is supposed to do with each argument. It's about **clarity, correctness, and compiler checks**.
