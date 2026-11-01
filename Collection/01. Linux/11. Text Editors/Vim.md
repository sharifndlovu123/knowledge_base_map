# 05. Vim

### **Vim Quick Starter Guide**  

Vim is a powerful, keyboard-driven text editor available on almost all Unix-based systems. It has a steep learning curve but becomes extremely efficient with practice.  

---

## **1. Launching & Exiting Vim**  

| Command | Action |
|---------|--------|
| `vim filename` | Open a file in Vim |
| `:q` | Quit (if no changes) |
| `:q!` | Quit **without saving** (discard changes) |
| `:w` | Save changes |
| `:wq` or `:x` | Save and quit |
| `ZZ` (Shift+zz) | Save and quit (faster) |

---

## **2. Modes in Vim**  
Vim has **three main modes**:  

1. **Normal Mode** (Default) – Navigate, delete, copy, paste.  
   - Press `Esc` to return to Normal Mode.  
2. **Insert Mode** – Edit text (like a normal editor).  
   - Press `i` (insert) or `a` (append) to enter.  
3. **Command Mode** – Run commands (save, quit, search).  
   - Press `:` to enter.  

---

## **3. Basic Navigation (Normal Mode)**  

| Command | Action |
|---------|--------|
| `h` | Move **left** |
| `j` | Move **down** |
| `k` | Move **up** |
| `l` | Move **right** |
| `w` | Jump to next **word** |
| `b` | Jump to previous **word** |
| `0` | Start of line |
| `$` | End of line |
| `gg` | Go to **first line** |
| `G` | Go to **last line** |
| `:10` | Go to **line 10** |

---

## **4. Editing Text**  

### **Entering Insert Mode**  
| Command | Action |
|---------|--------|
| `i` | Insert **before** cursor |
| `a` | Insert **after** cursor |
| `I` | Insert at **start of line** |
| `A` | Insert at **end of line** |
| `o` | Insert new line **below** |
| `O` | Insert new line **above** |

### **Deleting Text**  
| Command | Action |
|---------|--------|
| `x` | Delete **character under cursor** |
| `dw` | Delete **word** |
| `dd` | Delete **entire line** |
| `D` | Delete from cursor to **end of line** |

### **Copy & Paste (Yank & Put)**  
| Command | Action |
|---------|--------|
| `yy` | Copy (**yank**) entire line |
| `yw` | Copy word |
| `p` | Paste (**put**) after cursor |
| `P` | Paste before cursor |

---

## **5. Searching & Replacing**  

| Command | Action |
|---------|--------|
| `/word` | Search **forward** for "word" |
| `?word` | Search **backward** for "word" |
| `n` | Go to **next** match |
| `N` | Go to **previous** match |
| `:%s/old/new/g` | Replace **all** "old" with "new" |
| `:%s/old/new/gc` | Replace with **confirmation** |

---

## **6. Undo & Redo**  

| Command | Action |
|---------|--------|
| `u` | Undo last change |
| `Ctrl + r` | Redo last undo |

---

## **7. Saving & Exiting**  

| Command | Action |
|---------|--------|
| `:w` | Save file |
| `:w filename` | Save as new file |
| `:q` | Quit (if no changes) |
| `:q!` | Quit **without saving** |
| `:wq` or `:x` | Save and quit |
| `ZZ` | Save and quit (shortcut) |

---

## **8. Bonus Tips**  
- **Open multiple files**: `vim file1 file2` → `:n` (next file), `:N` (previous file).  
- **Split screen**: `:split filename` (horizontal), `:vsplit filename` (vertical).  
- **Line numbers**: `:set number` (show), `:set nonumber` (hide).  
- **Syntax highlighting**: `:syntax on`.  

---

### **Quick Reference Cheat Sheet**  
```
i → Insert | Esc → Normal Mode  
h j k l → Move  
yy → Copy | p → Paste  
dd → Delete line | u → Undo  
:w → Save | :q → Quit | :wq → Save & Quit  
```

🚀 **Practice Vim with `vimtutor` (run in terminal)!**  

This guide covers the basics—mastering Vim takes time, but it’s worth it! 🎯