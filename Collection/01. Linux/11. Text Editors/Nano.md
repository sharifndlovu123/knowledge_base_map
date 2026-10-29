### **Nano Quick Starter Guide**  

Nano is a simple, beginner-friendly terminal text editor for Linux/macOS. Unlike Vim, it doesn't have modes and uses intuitive keyboard shortcuts.  

---

## **1. Launching & Exiting Nano**  

| Command | Action |
|---------|--------|
| `nano` | Open Nano (new file) |
| `nano filename` | Open/edit a file |
| `Ctrl + X` | Exit Nano |
| `Ctrl + O` | Save file ("Write Out") |
| `Ctrl + G` | Open help menu |

---

## **2. Basic Navigation**  

| Shortcut | Action |
|----------|--------|
| `Arrow Keys` | Move cursor |
| `Ctrl + A` | Start of line |
| `Ctrl + E` | End of line |
| `Ctrl + Y` | Page up |
| `Ctrl + V` | Page down |
| `Ctrl + _` | Go to specific line |

---

## **3. Editing Text**  

| Shortcut | Action |
|----------|--------|
| `Backspace` / `Delete` | Delete characters |
| `Ctrl + K` | Cut entire line |
| `Ctrl + U` | Paste (uncut) |
| `Ctrl + W` | Search for text |
| `Ctrl + \` | Replace text |
| `Alt + A` | Start text selection |
| `Alt + 6` | Copy selected text |

---

## **4. Saving & Exiting**  

| Shortcut | Action |
|----------|--------|
| `Ctrl + O` | Save file (asks for filename) |
| `Enter` | Confirm save |
| `Ctrl + X` | Exit Nano |
| `Y` / `N` | Confirm save before quitting |

---

## **5. Help & Other Shortcuts**  

- **`Ctrl + G`** → Open help (all shortcuts are listed at the bottom).  
- **`Ctrl + C`** → Show current cursor position.  
- **`Alt + U`** → Undo last action.  

---

### **Nano vs Vim**  
| Feature | Nano | Vim |
|---------|------|-----|
| **Modes** | No modes | Normal/Insert/Command |
| **Learning Curve** | Easy | Steep |
| **Speed** | Slower for experts | Faster for pros |
| **Shortcuts** | `Ctrl`/`Alt` based | Modal (e.g., `i`, `Esc`, `:`) |

---

**Nano is best for beginners, while Vim is for advanced users.**  
**All Nano shortcuts are displayed at the bottom of the screen!**  

Try editing a file:  
```sh
nano test.txt
```  
(Press `Ctrl + X` to exit.)  
