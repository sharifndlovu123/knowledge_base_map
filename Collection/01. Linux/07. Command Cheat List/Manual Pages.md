# 02. Manual Pages


> if you ever get lost or confused and you've fotgotten commands look at the man pages. Great for installed package manuals too.

# Linux Manual Pages Breakdown

Linux manual pages (or "man pages") are the primary documentation system in Linux and other Unix-like systems. They're organized into numbered sections, each covering different aspects of the system.
## Manual Page Sections

1. **Section 1: User Commands**
    - Programs and applications that users can run
    - Examples: ls, grep, find, cp

2. **Section 2: System Calls**
    - Direct kernel functions that programs can use
    - Examples: open(), read(), write(), fork()

3. **Section 3: Library Functions**
     - C library functions 
     - Examples: printf(), malloc(), random()

4. **Section 4: Special Files**
    - Device files and drivers
    - Examples: /dev/null, /dev/tty

5. **Section 5: File Formats**
     - Configuration file formats and conventions
     - Examples: passwd, fstab, hosts

6. **Section 6: Games**
     - Games and recreational programs
     - Not heavily used in most distributions

7. **Section 7: Miscellaneous**
      - Overviews, conventions, protocols
      - Examples: regex, ascii, ip

8. **Section 8: System Administration**
     - Commands requiring root/administrative privileges
     - Examples: mount, ifconfig, service

9. **Section 9: Kernel Routines** (not on all systems)
    - Internal kernel functions documentation


#### **More Than 8 Sections**  
- Depending on your Linux distribution, you might see additional sections beyond the standard 8.  
- Some distros add sections for **kernel internals (9), Tcl functions (n), or additional documentation (L, C, etc.)**.  
- However, all Linux distributions include **at least the main 8 sections**.  

---



## Using Man Pages

### **Man Pages in Linux: Overview & Usage**  

Man pages (manual pages) provide documentation for commands, system calls, configuration files, and other aspects of the Linux operating system. They serve as built-in reference guides.  

---

### **How to Use Man Pages**  

#### **1. Viewing a Man Page**  
```bash
man command_name
```
Example:  
```bash
man ls  # View documentation for the 'ls' command
```

#### **2. Searching Within a Man Page**  
- **`/keyword`** – Search for a specific term in the man page.  
- **`n`** – Jump to the next occurrence of the searched term.  
- **`q`** – Exit the man page.  

#### **3. Viewing Specific Sections**  
Man pages are divided into sections. To specify a section:  
```bash
man section_number command_name
```
Example:  
```bash
man 2 open  # View the system call 'open' in section 2
```

#### **4. Searching for Commands by Keyword**  
```bash
man -k keyword
```
Example:  
```bash
man -k copy  # Find all commands related to "copy"
```
Equivalent to:  
```bash
apropos copy
```

#### **5. Display a Short Description**  
```bash
whatis command_name
```
Example:  
```bash
whatis ls  # Show a brief summary of 'ls'
```


### **Additional Man Page Commands**  
```bash
man -f command_name  # Show relevant sections for a command  
man -a command_name  # View all available sections one by one  
man -P cat command   # Display the man page as plain text  
```

Man pages are an essential tool for understanding Linux commands and system functionality, making them crucial for troubleshooting and learning.


### **Accessing Web-Based Man Pages**  
Many distributions and organizations provide **online versions of man pages** for easier searching and sharing.  

> man pages can be used online but the best option is locally because the man files are stored directly in your directories. 

#### **Popular Web Man Page Repositories**  
| Website | Description |  
|---------|-------------|  
| [man7.org](https://man7.org/linux/man-pages/) | Extensive Linux man page collection, frequently updated. |  
| [die.net](https://linux.die.net/man/) | Classic Linux man pages with a clean interface. |  
| [Ubuntu Manpages](https://manpages.ubuntu.com/) | Ubuntu-specific man pages. |  
| [FreeBSD Man Pages](https://www.freebsd.org/cgi/man.cgi) | BSD-based system documentation. |  
| [man.cx](http://man.cx/) | Quick lookup for various Unix-based man pages. |  

---
