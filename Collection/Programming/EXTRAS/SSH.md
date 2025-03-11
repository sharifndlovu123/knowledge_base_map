Here's a step-by-step guide to setting up SSH on your Ubuntu desktop:

---

### **Step 1: Install OpenSSH Server**

First, check if SSH is installed by running:

```bash
ssh -V
```

If it's not installed, install it using:

```bash
sudo apt update && sudo apt install -y openssh-server
```

After installation, verify that SSH is running:

```bash
sudo systemctl status ssh
```

If it's not active, start it:

```bash
sudo systemctl start ssh
```

To enable SSH on startup:

```bash
sudo systemctl enable ssh
```

---

### **Step 2: Configure SSH (Optional but Recommended)**

Edit the SSH configuration file:

```bash
sudo nano /etc/ssh/sshd_config
```

Some recommended changes:

- Change the default port (optional for security):
    
    ```
    Port 2222
    ```
    
- Disable root login:
    
    ```
    PermitRootLogin no
    ```
    
- Allow only specific users (replace `your_username` with your actual username):
    
    ```
    AllowUsers your_username
    ```
    
- Disable password authentication if you plan to use SSH keys:
    
    ```
    PasswordAuthentication no
    ```
    

After making changes, save and restart SSH:

```bash
sudo systemctl restart ssh
```

---

### **Step 3: Allow SSH Through Firewall**

If UFW is enabled, allow SSH:

```bash
sudo ufw allow OpenSSH
```

Or, if you changed the port:

```bash
sudo ufw allow 2222/tcp
```

Check the firewall status:

```bash
sudo ufw status
```

Enable UFW if it's not active:

```bash
sudo ufw enable
```

---

### **Step 4: Generate and Use SSH Keys (Recommended)**

On your local machine (the one you’ll use to connect):

```bash
ssh-keygen -t rsa -b 4096
```

Press Enter to save the key in the default location (`~/.ssh/id_rsa`).

Now, copy the public key to your Ubuntu desktop:

```bash
ssh-copy-id your_username@your_server_ip
```

Alternatively, manually copy the key:

```bash
cat ~/.ssh/id_rsa.pub | ssh your_username@your_server_ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

Set correct permissions:

```bash
ssh your_username@your_server_ip
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

### **Step 5: Connect to Your Ubuntu Desktop via SSH**

From your local machine:

```bash
ssh your_username@your_server_ip
```

If you changed the port:

```bash
ssh -p 2222 your_username@your_server_ip
```

---

### **Step 6: Troubleshooting**

- Check SSH service status:
    
    ```bash
    sudo systemctl status ssh
    ```
    
- Restart SSH if needed:
    
    ```bash
    sudo systemctl restart ssh
    ```
    
- Check firewall rules:
    
    ```bash
    sudo ufw status
    ```
    
- Check logs for issues:
    
    ```bash
    sudo journalctl -u ssh --no-pager | tail -20
    ```
    

Let me know if you run into any issues! 🚀