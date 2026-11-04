# 03. NeoVim

### **Neovim Quick Start Guide**  
*(Modern fork of Vim with better defaults and Lua support)*  

---

## **1. Installation & Setup**
```sh
# Linux (Debian/Ubuntu)
sudo apt install neovim

# MacOS
brew install neovim

# Windows (Winget)
winget install Neovim.Neovim
```

**First Run:**  
```sh
nvim  # Launches Neovim
:checkhealth  # Checks system dependencies
```

---

## **2. Key Improvements Over Vim**
| Feature | Vim | Neovim |
|---------|-----|--------|
| **Default Config** | Minimal | Sane defaults |
| **Lua Support** | Limited | First-class |
| **Terminal** | Basic | Built-in `:terminal` |
| **Plugins** | Vimscript | Lua/Vimscript |
| **Async** | Limited | Native async |

---

## **3. Essential Workflow**  
*(Same as Vim but with enhancements)*

### **Navigation (Normal Mode)**
```text
Ctrl+o    Jump back
Ctrl+i    Jump forward
gd        Go to definition
gf        Go to file
```

### **LSP (Language Server Protocol)**
```text
:lua vim.lsp.buf.definition()  # Jump to definition
K          Hover documentation
<leader>ca # Code actions
```

### **Fuzzy Finding (Telescope)**
```lua
-- Install telescope.nvim first
:Telescope find_files  # Find files
:Telescope live_grep   # Search text
```

---

## **4. Configuration (init.lua)**
Example `~/.config/nvim/init.lua`:
```lua
-- Set options
vim.opt.number = true
vim.opt.tabstop = 4

-- Plugin manager (packer.nvim)
require('packer').startup(function()
  use 'wbthomason/packer.nvim'  -- Package manager
  use 'nvim-telescope/telescope.nvim'  -- Fuzzy finder
end)

-- Key mappings
vim.keymap.set('n', '<leader>ff', ':Telescope find_files<CR>')
```

---

## **5. Plugin Ecosystem**
| Plugin | Purpose |
|--------|---------|
| [packer.nvim](https://github.com/wbthomason/packer.nvim) | Package manager |
| [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim) | Fuzzy finder |
| [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) | LSP configurations |
| [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter) | Better syntax highlighting |

---

## **6. Modern Features**
1. **Built-in Terminal**  
   ```text
   :terminal  # Open terminal
   Ctrl+\ Ctrl+n  # Exit terminal mode
   ```

2. **Lua Configuration**  
   ```lua
   -- Example: Set theme
   vim.cmd('colorscheme gruvbox')
   ```

3. **Native LSP**  
   ```text
   :LspInstall python  # Install Python LSP
   ```

---

## **7. Cheat Sheet**
```text
<leader> = usually spacebar

Space+ff   Find files (Telescope)
Space+lg   Live grep (Telescope)
gd         Go to definition (LSP)
K          Show documentation (LSP)
:Format    Format file (LSP)
```

---

## **8. Getting Help**
```text
:help nvim  # Neovim docs
:checkhealth  # System check
:lua print(vim.inspect(vim.lsp.buf))  # Debug LSP
```

🚀 **Next Steps:**  
1. Install [kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim) for pre-configured setup  
2. Learn Lua for advanced configuration  
3. Explore plugin ecosystem  

Neovim combines Vim's efficiency with modern IDE features!