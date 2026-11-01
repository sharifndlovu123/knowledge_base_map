# 01. Bash

Bash syntax is vast and flexible, so let's break it down into fundamental components and dig deep into each.

---

## **1. Shebang (`#!`)**

A script starts with a **shebang** to specify the interpreter:

```bash
#!/bin/bash
```

- `#!` tells the system which interpreter to use.
- `/bin/bash` is the path to the Bash shell.

**Alternate shebangs:**

- `#!/usr/bin/env bash` (More portable since it searches for `bash` in `$PATH`)
- `#!/bin/sh` (POSIX shell; may be linked to `dash` on some systems)

---

## **2. Variables & Expansion**

Bash allows variables that can hold strings, numbers, or command outputs.

### **2.1 Assigning Variables**

```bash
name="Alice"
age=25
```

- No spaces around `=`
- Strings don’t need quotes unless they contain spaces

### **2.2 Referencing Variables**

```bash
echo "Hello, $name!"
echo "Next year you will be $((age + 1))"
```

- `$var` expands the variable
- `$((expression))` does arithmetic expansion

### **2.3 Braces `{}` in Variable Expansion**

```bash
greeting="Hello"
echo "${greeting}, World!"
```

- `{}` prevents ambiguity (`${greeting}World` instead of `$greetingWorld`)

### **2.4 Command Substitution**

```bash
date_today=$(date)
echo "Today is: $date_today"
```

- `$(command)` executes and replaces output
- Legacy: `` `command` `` (backticks) but harder to nest

---

## **3. Quoting & Escaping**

Bash treats quotes differently:

|Quote Type|Effect|
|---|---|
|`" "`|Expands variables but keeps spaces|
|`' '`|Literal text, no expansion|
|`\`|Escapes a single character|

Example:

```bash
name="Alice"
echo "Hello, $name"  # Expands to "Hello, Alice"
echo 'Hello, $name'  # Prints "Hello, $name"
echo "File path: /home/\$USER"  # Escape `$` to prevent expansion
```

---

## **4. Arrays & Associative Arrays**

Bash supports indexed arrays and associative arrays.

### **4.1 Indexed Arrays**

```bash
fruits=("apple" "banana" "cherry")
echo "${fruits[0]}"  # apple
echo "${fruits[@]}"  # all elements
echo "${fruits[@]}" # length
```

- `[@]` expands all elements
- `#` before array gives the count

### **4.2 Associative Arrays (Bash 4+)**

```bash
declare -A capitals
capitals["France"]="Paris"
capitals["Germany"]="Berlin"

echo "${capitals["France"]}"  # Paris
```

---

## **5. Conditionals (`if`, `test` and `[ ]`)**

### **5.1 Basic If-Else**

```bash
if [ "$name" == "Alice" ]; then
    echo "Hello, Alice!"
else
    echo "Who are you?"
fi
```

- `[ "$name" == "Alice" ]` uses `test`
- `[[ "$name" == "Alice" ]]` is preferred (more features)
- `then` must be on a new line or after `;`

### **5.2 Numeric Comparisons**

```bash
if [ $age -gt 18 ]; then
    echo "You are an adult."
fi
```

- `-eq` (equal), `-ne` (not equal)
- `-gt` (greater than), `-lt` (less than)

### **5.3 File Checks**

```bash
if [ -f "/etc/passwd" ]; then echo "File exists"; fi
if [ -d "/home/user" ]; then echo "Directory exists"; fi
```

- `-f` (file exists)
- `-d` (directory exists)
- `-e` (any file exists)

---

## **6. Loops (`for`, `while`, `until`)**

### **6.1 For Loop**

```bash
for fruit in apple banana cherry; do
    echo "I like $fruit"
done
```

or using a numeric range:

```bash
for i in {1..5}; do
    echo "Number $i"
done
```

or using `seq`:

```bash
for i in $(seq 1 5); do echo $i; done
```

### **6.2 While Loop**

```bash
counter=1
while [ $counter -le 5 ]; do
    echo "Count: $counter"
    ((counter++))  # Arithmetic expansion
done
```

### **6.3 Until Loop (opposite of while)**

```bash
num=1
until [ $num -gt 5 ]; do
    echo "Number: $num"
    ((num++))
done
```

---

## **7. Functions**

```bash
greet() {
    echo "Hello, $1!"
}
greet "Alice"
```

- `$1`, `$2`, etc. are positional parameters

Returning values:

```bash
add() {
    echo $(( $1 + $2 ))
}
result=$(add 3 5)
echo "Sum: $result"
```

---

## **8. Special Variables**

|Variable|Description|
|---|---|
|`$0`|Script name|
|`$1, $2, ...`|Positional arguments|
|`$@`|All arguments (as separate words)|
|`$*`|All arguments (as a single word)|
|`$#`|Number of arguments|
|`$$`|PID of the script|
|`$?`|Exit status of the last command|
|`$!`|PID of the last background process|

Example:

```bash
echo "Script name: $0"
echo "First argument: $1"
echo "All args: $@"
```

---

## **9. Redirection & Pipes**

### **9.1 Standard Streams**

- `0` = stdin
- `1` = stdout
- `2` = stderr

Redirect output:

```bash
ls > files.txt   # Save stdout to file
ls >> files.txt  # Append stdout to file
ls 2> errors.txt # Save stderr to file
ls 2>&1          # Merge stderr into stdout
```


Deep Dive

In Bash, standard streams are the primary way processes handle input and output. There are **three standard streams**, each with an associated file descriptor (FD):

|Stream|File Descriptor (FD)|Purpose|
|---|---|---|
|**Standard Input**|`0`|Input to a program (usually from the keyboard)|
|**Standard Output**|`1`|Normal output from a program (displayed on the terminal by default)|
|**Standard Error**|`2`|Error messages from a program (also displayed on the terminal by default)|

---

## **1. Standard Input (stdin) – FD 0**

- **Receives input for a program** (default: keyboard)
- Can be redirected from a file or piped from another command.

### **Example 1: Using stdin from a file**

```bash
cat < myfile.txt
```

Here, `<` redirects `myfile.txt` as input to `cat`.

### **Example 2: Using stdin with `read`**

```bash
read name
echo "Hello, $name!"
```

- This waits for user input and stores it in `$name`.

### **Example 3: Using `<<` (Heredoc) to feed input**

```bash
cat << EOF
This is
multiline input.
EOF
```

---

## **2. Standard Output (stdout) – FD 1**

- **Used for normal program output** (default: terminal)
- Can be redirected to a file or another command.

### **Example 1: Redirect stdout to a file (`>`)**

```bash
ls > output.txt
```

- Saves `ls` output to `output.txt`, **overwriting** it.

### **Example 2: Append stdout to a file (`>>`)**

```bash
ls >> output.txt
```

- Appends `ls` output to `output.txt` instead of overwriting.

### **Example 3: Pipe stdout to another command (`|`)**

```bash
ls | grep ".txt"
```

- Sends the output of `ls` to `grep`, filtering for `.txt` files.

---

## **3. Standard Error (stderr) – FD 2**

- **Used for error messages** (default: terminal)
- Can be redirected separately from stdout.

### **Example 1: Redirect stderr to a file (`2>`)**

```bash
ls non_existent_file 2> errors.log
```

- Captures error messages in `errors.log`.

### **Example 2: Redirect stderr and stdout to different files**

```bash
ls file.txt non_existent_file > output.txt 2> errors.txt
```

- Normal output goes to `output.txt`, errors go to `errors.txt`.

### **Example 3: Redirect stderr and stdout to the same file (`&>` or `2>&1`)**

```bash
ls file.txt non_existent_file &> all_output.txt
# Equivalent to:
ls file.txt non_existent_file > all_output.txt 2>&1
```

- Merges stdout and stderr into `all_output.txt`.

---

## **4. Combining and Suppressing Output**

### **Discarding output (send to `/dev/null`)**

```bash
ls non_existent_file 2> /dev/null  # Hide errors
ls file.txt > /dev/null 2>&1       # Hide all output
```

### **Using stderr in a pipeline**

```bash
find / -name "myfile" 2>/dev/null | grep "myfile"
```

- Suppresses errors and only passes valid results to `grep`.

---

### **Summary of Redirection Operators**

|Operator|Purpose|
|---|---|
|`>`|Redirect stdout (overwrite)|
|`>>`|Redirect stdout (append)|
|`2>`|Redirect stderr (overwrite)|
|`2>>`|Redirect stderr (append)|
|`&>` or `> file 2>&1`|Redirect both stdout and stderr|
|`<`|Redirect stdin|
|`<<`|Heredoc (inline multi-line input)|
|`|`|
|`/dev/null`|Discard output|

Would you like a deeper dive into any specific part?
### **9.2 Piping**

```bash
ls | grep "txt"
```

- `|` passes stdout of `ls` to `grep`

---

## **10. Process Management**

Run commands in the background:

```bash
sleep 60 &
echo "Background process PID: $!"
```

- `jobs` → Lists background jobs
- `fg %1` → Brings job 1 to foreground
- `kill 1234` → Terminates process with PID 1234

---

## **11. Brace Expansion & Globbing**

### **11.1 Brace Expansion**

```bash
echo {A,B,C}      # A B C
echo {1..5}       # 1 2 3 4 5
echo file{1..3}.txt  # file1.txt file2.txt file3.txt
```

### **11.2 Globbing (Wildcards)**

|Pattern|Meaning|
|---|---|
|`*`|Matches anything (`file*` matches `file1`, `file2`)|
|`?`|Matches a single character (`file?.txt` matches `file1.txt` but not `file10.txt`)|
|`[abc]`|Matches `a`, `b`, or `c`|

Example:

```bash
ls *.txt
ls file?.txt
ls file[1-3].txt
```

---

### **Final Notes**

- Bash has **built-in commands** (`echo`, `cd`, `pwd`, `test`) and **external commands** (`ls`, `grep`, `awk`).
- Use `man bash` or `help` for built-in documentation.
- Debug scripts with `bash -x script.sh`.

