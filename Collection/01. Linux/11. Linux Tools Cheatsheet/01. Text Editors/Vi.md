# 04. Vi

### **VI / Vim Quick Start Guide**  
*(VI is the predecessor to Vim - most commands work in both)*  

---

## **1. Starting & Exiting**
| Command | Action |
|---------|--------|
| `vi file.txt` | Open file |
| `:q` | Quit (if no changes) |
| `:q!` | Force quit (discard changes) |
| `:w` | Save |
| `:wq` or `ZZ` | Save and quit |

---

## **2. Basic Movement**  
*(Normal Mode - press ESC to return here)*  

| Key | Moves |
|-----|-------|
| `h` | Left |
| `j` | Down |
| `k` | Up |
| `l` | Right |
| `w` | Next word |
| `b` | Previous word |
| `0` | Start of line |
| `$` | End of line |
| `gg` | Top of file |
| `G` | Bottom of file |
| `:5` | Jump to line 5 |

---

## **3. Editing Text**  

### **Enter Insert Mode**  
| Key | Inserts At... |
|-----|--------------|
| `i` | Cursor position |
| `a` | After cursor |
| `I` | Start of line |
| `A` | End of line |
| `o` | New line below |
| `O` | New line above |

### **Deleting**  
| Command | Deletes |
|---------|---------|
| `x` | Character at cursor |
| `dw` | Word |
| `dd` | Entire line |
| `D` | To end of line |

### **Copy/Paste**  
| Command | Action |
|---------|--------|
| `yy` | Copy line |
| `yw` | Copy word |
| `p` | Paste after |
| `P` | Paste before |

---

## **4. Search & Replace**  
| Command | Action |
|---------|--------|
| `/term` | Search forward |
| `?term` | Search backward |
| `n` | Next match |
| `N` | Previous match |
| `:%s/old/new/g` | Replace all |
| `:%s/old/new/gc` | Replace with confirm |

---

## **5. Undo/Redo**  
| Command | Action |
|---------|--------|
| `u` | Undo |
| `Ctrl+r` | Redo |

---

## **6. Visual Mode (For Selecting Text)**  
| Command | Action |
|---------|--------|
| `v` | Character-wise select |
| `V` | Line-wise select |
| `Ctrl+v` | Block select |
| `y` | Yank (copy) selection |
| `d` | Delete selection |

---

## **7. Advanced Tips**  
- **Multiple files**:  
  `vi file1 file2` → `:n` (next), `:N` (previous)  
- **Split screen**:  
  `:split file` (horizontal), `:vsplit file` (vertical)  
- **Show line numbers**: `:set number`  
- **Syntax highlighting**: `:syntax on`  

---

### **VI vs Nano Cheat Sheet**  
```text
Movement:  VI(hjkl)   Nano(Arrow Keys)  
Editing:   VI(i→ESC)  Nano(direct typing)  
Undo:      VI(u)      Nano(Alt+U)  
Save/Quit: VI(:wq)    Nano(Ctrl+O, Ctrl+X)  
```

🚀 **Practice with `vimtutor` (terminal command) to master VI!**  
💡 **Remember:** VI has modes (Normal/Insert/Visual), while Nano doesn't.  

This covers 90% of daily VI usage. Stick with it - the learning curve pays off!