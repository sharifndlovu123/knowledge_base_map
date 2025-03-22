PowerShell is an object-oriented shell and scripting language designed for automation. It differs from Bash in that it works with objects rather than plain text. Here’s a deep dive into PowerShell syntax and concepts.

---

# **1. Shebang Equivalent**

Unlike Bash, PowerShell scripts (`.ps1` files) do not require a shebang. They are executed like this:

```powershell
powershell -ExecutionPolicy Bypass -File script.ps1
```

However, to execute PowerShell scripts, you may need to change execution policies:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

# **2. Variables & Expansion**

### **2.1 Assigning Variables**

```powershell
$name = "Alice"
$age = 25
```

- Variables always start with `$`
- No need to declare types, but PowerShell supports strong typing:

```powershell
[int]$number = 42
[string]$text = "Hello"
```

### **2.2 Referencing Variables**

```powershell
Write-Output "Hello, $name!"
Write-Output "Next year you will be $($age + 1)"
```

- `$(...)` is used for inline expressions inside double-quoted strings.

### **2.3 Command Substitution (Backticks in Bash)**

```powershell
$date = Get-Date
Write-Output "Today is: $date"
```

---

# **3. Quoting & Escaping**

PowerShell treats quotes differently:

|Quote Type|Effect|
|---|---|
|`" "`|Expands variables|
|`' '`|Literal text, no expansion|

Example:

```powershell
$name = "Alice"
Write-Output "Hello, $name"  # Expands
Write-Output 'Hello, $name'  # Prints "Hello, $name"
```

Escaping:

- Use **backtick (```)** for escaping:

```powershell
Write-Output "This is a new`nline"
```

- For special characters (`$`, `"`, `@`), use **backticks**:

```powershell
Write-Output "`$name is a variable"
```

---

# **4. Arrays & Hash Tables**

### **4.1 Indexed Arrays**

```powershell
$fruits = @("apple", "banana", "cherry")
Write-Output $fruits[0]   # apple
Write-Output $fruits[-1]  # Last element
Write-Output $fruits.Count
```

### **4.2 Hash Tables (Associative Arrays)**

```powershell
$capitals = @{
    "France" = "Paris"
    "Germany" = "Berlin"
}
Write-Output $capitals["France"]
```

---

# **5. Conditionals (`if`, `switch`)**

### **5.1 Basic If-Else**

```powershell
if ($name -eq "Alice") {
    Write-Output "Hello, Alice!"
} else {
    Write-Output "Who are you?"
}
```

- `-eq`, `-ne`, `-gt`, `-lt` are used for comparisons.

### **5.2 File Checks**

```powershell
if (Test-Path "C:\Windows") {
    Write-Output "Directory exists"
}
```

### **5.3 Switch Case**

```powershell
$color = "red"
switch ($color) {
    "red" { Write-Output "Stop!" }
    "yellow" { Write-Output "Slow down!" }
    "green" { Write-Output "Go!" }
}
```

---

# **6. Loops (`for`, `foreach`, `while`, `do`)**

### **6.1 For Loop**

```powershell
for ($i = 1; $i -le 5; $i++) {
    Write-Output "Number $i"
}
```

### **6.2 Foreach Loop**

```powershell
$fruits = @("apple", "banana", "cherry")
foreach ($fruit in $fruits) {
    Write-Output "I like $fruit"
}
```

### **6.3 While Loop**

```powershell
$counter = 1
while ($counter -le 5) {
    Write-Output "Count: $counter"
    $counter++
}
```

### **6.4 Do-While Loop**

```powershell
$num = 1
do {
    Write-Output "Number: $num"
    $num++
} while ($num -le 5)
```

---

# **7. Functions**

```powershell
function Greet {
    param($name)
    Write-Output "Hello, $name!"
}
Greet "Alice"
```

Returning values:

```powershell
function Add {
    param($a, $b)
    return $a + $b
}
$result = Add 3 5
Write-Output "Sum: $result"
```

---

# **8. Special Variables**

|Variable|Description|
|---|---|
|`$PSVersionTable.PSVersion`|PowerShell version|
|`$env:Path`|System environment variable|
|`$args`|Script arguments|
|`$?`|Last command success status|
|`$LASTEXITCODE`|Exit code of last external command|

Example:

```powershell
Write-Output "Last command succeeded: $?"
```

---

# **9. Redirection & Pipes**

### **9.1 Redirect Output**

```powershell
Get-Process > processes.txt   # Save stdout
Get-Process >> processes.txt  # Append stdout
Get-Process 2> errors.txt     # Save stderr
```

### **9.2 Piping**

```powershell
Get-Process | Where-Object { $_.CPU -gt 10 }
```

- `|` passes objects between commands.
- `{ $_.Property }` is used to reference object properties.

---

# **10. Process Management**

Run commands in the background:

```powershell
Start-Process -NoNewWindow -FilePath "notepad.exe"
```

- `Get-Process` → Lists running processes
- `Stop-Process -Id 1234` → Terminates a process

---

# **11. Wildcards & Expansion**

### **11.1 Wildcards**

|Pattern|Meaning|
|---|---|
|`*`|Matches anything|
|`?`|Matches a single character|
|`[a-c]`|Matches `a`, `b`, or `c`|

Example:

```powershell
Get-ChildItem C:\*.txt
```

---

### **Final Notes**

- Use `Get-Help Command` for documentation.
- Debug scripts with `Set-PSDebug -Trace 1`.
- PowerShell outputs **objects**, not plain text.

