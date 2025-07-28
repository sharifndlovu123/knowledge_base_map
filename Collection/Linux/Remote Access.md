# Remote Access Methods

## SSH (Secure Shell)
The most common and secure method for remote command-line access.

### Basic SSH Usage
```bash
# Connect to remote host
ssh username@hostname

# Connect with specific port
ssh -p 2222 username@hostname

# Connect with specific private key
ssh -i ~/.ssh/private_key username@hostname

# Execute single command remotely
ssh username@hostname 'ls -la /var/log'

# Connect with X11 forwarding (GUI apps)
ssh -X username@hostname
```

### SSH Key Authentication
More secure and convenient than passwords.

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy public key to remote server
ssh-copy-id username@hostname

# Or manually copy key
cat ~/.ssh/id_rsa.pub | ssh username@hostname 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'
```

### SSH Configuration
Simplify connections with config file (`~/.ssh/config`):

```bash
Host myserver
    HostName 192.168.1.100
    User admin
    Port 2222
    IdentityFile ~/.ssh/myserver_key

# Now just use: ssh myserver
```

## Remote Desktop Solutions

### VNC (Virtual Network Computing)
Cross-platform remote desktop protocol.

#### Server Setup (Ubuntu/Debian)
```bash
# Install VNC server
sudo apt install tightvncserver

# Start VNC server
vncserver :1 -geometry 1920x1080 -depth 24

# Set VNC password
vncpasswd
```

#### Client Connection
```bash
# Install VNC client
sudo apt install xtightvncviewer

# Connect to VNC server
vncviewer hostname:5901
```

### RDP (Remote Desktop Protocol)
Microsoft's remote desktop solution, also available on Linux.

#### Server Setup (xrdp)
```bash
# Install xrdp server
sudo apt install xrdp

# Start xrdp service
sudo systemctl enable xrdp
sudo systemctl start xrdp

# Allow through firewall
sudo ufw allow 3389
```

#### Client Connection
```bash
# Linux RDP client
rdesktop hostname:3389
# or
xfreerdp /v:hostname /u:username
```

### X2Go
High-performance remote desktop solution.

#### Server Setup
```bash
# Install X2Go server
sudo apt install x2goserver x2goserver-xsession

# No additional configuration needed
```

#### Client Usage
- Install X2Go client GUI application
- Connect using SSH credentials
- Choose desktop environment (XFCE, GNOME, etc.)

## Web-Based Access

### Apache Guacamole
Clientless remote desktop gateway accessed through web browser.

```bash
# Docker deployment
docker run --name guacamole-guacd -d guacamole/guacd
docker run --name guacamole-mysql -d \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=guacamole_db \
  mysql:5.7

# Web interface accessible at http://hostname:8080/guacamole
```

### Cockpit
Web-based server administration interface.

```bash
# Install Cockpit
sudo apt install cockpit

# Enable and start
sudo systemctl enable cockpit.socket
sudo systemctl start cockpit.socket

# Access at https://hostname:9090
```

## Terminal Multiplexers for Persistent Sessions

### tmux
Create persistent terminal sessions that survive disconnections.

```bash
# Start new session
tmux new-session -s mysession

# Detach from session (Ctrl+b, then d)
# Sessions continue running

# List sessions
tmux list-sessions

# Reattach to session
tmux attach-session -t mysession

# Kill session
tmux kill-session -t mysession
```

### screen
Alternative to tmux with similar functionality.

```bash
# Start new session
screen -S mysession

# Detach (Ctrl+a, then d)

# List sessions
screen -list

# Reattach
screen -r mysession
```

## Port Forwarding and Tunneling

### SSH Tunneling
Forward ports securely through SSH connections.

```bash
# Local port forwarding (access remote service locally)
ssh -L 8080:localhost:80 username@remote-host
# Now localhost:8080 connects to remote-host:80

# Remote port forwarding (expose local service remotely)
ssh -R 8080:localhost:80 username@remote-host
# Now remote-host:8080 connects to your localhost:80

# Dynamic port forwarding (SOCKS proxy)
ssh -D 1080 username@remote-host
# Configure browser to use localhost:1080 as SOCKS proxy
```

### Reverse SSH Tunnels
Access machines behind NAT/firewall.

```bash
# From machine behind firewall
ssh -R 2222:localhost:22 username@public-server

# From public server, access the hidden machine
ssh -p 2222 localhost
```

## Modern Remote Access Tools

### Tailscale/WireGuard
Modern VPN solutions for secure remote access.

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Connect to network
sudo tailscale up

# Access any device in your Tailscale network directly
ssh user@tailscale-hostname
```

### Mosh (Mobile Shell)
UDP-based remote terminal that handles intermittent connectivity.

```bash
# Install mosh
sudo apt install mosh

# Connect (works like SSH but more resilient)
mosh username@hostname
```

## Security Best Practices

### SSH Hardening
```bash
# Edit /etc/ssh/sshd_config
Port 2222                          # Change default port
PermitRootLogin no                  # Disable root login
PasswordAuthentication no           # Use keys only
MaxAuthTries 3                      # Limit login attempts
ClientAliveInterval 300             # Keep connections alive
ClientAliveCountMax 2               # Disconnect inactive clients

# Restart SSH service
sudo systemctl restart sshd
```

### Firewall Configuration
```bash
# Allow SSH on custom port
sudo ufw allow 2222/tcp

# Allow VNC
sudo ufw allow 5901/tcp

# Allow RDP
sudo ufw allow 3389/tcp

# Enable firewall
sudo ufw enable
```

### Fail2Ban
Protect against brute force attacks.

```bash
# Install fail2ban
sudo apt install fail2ban

# Configure for SSH (/etc/fail2ban/jail.local)
[sshd]
enabled = true
port = 2222
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
```

## Remote Access Comparison

| Method | Use Case | Security | Performance | Platform Support |
|--------|----------|----------|-------------|------------------|
| SSH | Command line, file transfer | Excellent | High | Universal |
| VNC | Desktop access | Good (with tunnel) | Medium | Universal |
| RDP | Windows desktop | Good | High | Windows/Linux |
| X2Go | Linux desktop | Excellent | High | Linux |
| Guacamole | Web-based access | Good | Medium | Any browser |
| Mosh | Mobile/unstable connections | Excellent | High | Unix-like |

## Quick Setup Example
Complete remote access setup for a Linux server:

```bash
# 1. Secure SSH
sudo sed -i 's/#Port 22/Port 2222/' /etc/ssh/sshd_config
sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# 2. Install tools
sudo apt update
sudo apt install tmux fail2ban ufw

# 3. Configure firewall
sudo ufw allow 2222/tcp
sudo ufw enable

# 4. Setup SSH keys (from client)
ssh-keygen -t rsa -b 4096
ssh-copy-id -p 2222 username@server

# 5. Connect with persistent session
ssh -p 2222 username@server
tmux new-session -s work
```

Now you have secure, persistent remote access to your server!
