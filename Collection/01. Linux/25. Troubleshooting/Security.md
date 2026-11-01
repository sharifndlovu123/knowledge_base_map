# 04. Security Troubleshooting

## SELinux Issues Resolution

### SELinux Status and Modes
```bash
# Check SELinux status
sestatus                       # Complete SELinux status
getenforce                     # Current enforcement mode
cat /etc/selinux/config        # SELinux configuration

# Change SELinux modes
setenforce 0                   # Set to permissive (temporary)
setenforce 1                   # Set to enforcing (temporary)
# Edit /etc/selinux/config for permanent changes

# Check SELinux denials
ausearch -m AVC -ts recent     # Recent AVC denials
tail -f /var/log/audit/audit.log | grep AVC
sealert -a /var/log/audit/audit.log  # Analyze denials
```

### SELinux Context Problems
```bash
# Check file contexts
ls -Z /path/to/file            # View file security context
ps -eZ | grep process_name     # View process context
id -Z                          # Current user context

# Fix file contexts
restorecon -R /path/to/directory     # Restore default contexts
restorecon -v /var/www/html/*        # Restore with verbose output
fixfiles relabel                     # Relabel entire filesystem

# Set custom contexts
semanage fcontext -a -t httpd_exec_t "/opt/myapp/bin(/.*)?"
restorecon -R /opt/myapp/bin
chcon -t httpd_exec_t /opt/myapp/bin/script
```

### SELinux Policy Management
```bash
# Generate policy from denials
ausearch -m AVC -ts recent | audit2allow -M mypolicy
semodule -i mypolicy.pp        # Install policy module

# SELinux booleans
getsebool -a | grep httpd      # Show HTTP-related booleans
setsebool httpd_can_network_connect on     # Enable boolean
setsebool -P httpd_can_network_connect on  # Make permanent

# Remove/disable policy modules
semodule -l                    # List installed modules
semodule -r mypolicy           # Remove policy module
```

### Common SELinux Fixes
```bash
# Web server context issues
setsebool -P httpd_can_network_connect 1
setsebool -P httpd_can_network_relay 1
semanage fcontext -a -t httpd_config_t "/etc/myapp(/.*)?"

# SSH context problems
setsebool -P ssh_sysadm_login 1
restorecon -R ~/.ssh/

# Database context issues
setsebool -P mysqld_can_network_connect 1
restorecon -R /var/lib/mysql/
```

## File Permission Problems

### Permission Diagnosis
```bash
# Check file permissions
ls -la /path/to/file           # Detailed permissions
stat /path/to/file             # Complete file statistics
namei -l /path/to/file         # Check permissions along path

# Find permission problems
find / -type f -perm 777 2>/dev/null    # World-writable files
find / -type d -perm 777 2>/dev/null    # World-writable directories
find / -perm -4000 -type f 2>/dev/null  # SUID files
find / -perm -2000 -type f 2>/dev/null  # SGID files
```

### Permission Repair
```bash
# Fix common permission issues
chmod 644 /path/to/file        # Standard file permissions
chmod 755 /path/to/directory   # Standard directory permissions
chmod -R 755 /var/www/html     # Recursive directory fix

# Ownership fixes
chown user:group /path/to/file
chown -R www-data:www-data /var/www/html
chgrp group /path/to/file      # Change group only

# Special permission fixes
chmod u+s /usr/bin/sudo        # Set SUID bit
chmod g+s /shared/directory    # Set SGID bit
chmod +t /tmp                  # Set sticky bit
```

### ACL Permission Issues
```bash
# Check and manage ACLs
getfacl /path/to/file          # View ACL permissions
setfacl -m u:username:rwx /path/to/file    # Set user ACL
setfacl -m g:groupname:rx /path/to/file    # Set group ACL
setfacl -x u:username /path/to/file        # Remove user ACL
setfacl -b /path/to/file       # Remove all ACLs

# Default ACLs for directories
setfacl -d -m u:username:rwx /path/to/directory
setfacl -R -m u:username:rwx /path/to/directory  # Recursive
```

### Common Permission Fixes
```bash
# Web server permissions
find /var/www -type d -exec chmod 755 {} \;
find /var/www -type f -exec chmod 644 {} \;
chown -R www-data:www-data /var/www/

# SSH key permissions
chmod 700 ~/.ssh/
chmod 600 ~/.ssh/id_rsa
chmod 644 ~/.ssh/id_rsa.pub
chmod 600 ~/.ssh/authorized_keys

# System file permissions
chmod 644 /etc/passwd
chmod 600 /etc/shadow
chmod 644 /etc/group
chmod 755 /usr/bin/*
```

## User and Group Issues

### User Account Problems
```bash
# Check user information
id username                    # User ID and groups
groups username                # User's groups
getent passwd username         # User account details
finger username                # User information

# Account status checks
passwd -S username             # Password status
chage -l username              # Password aging info
lastlog -u username            # Last login time
faillog -u username            # Failed login attempts

# Fix locked accounts
usermod -U username            # Unlock user account
passwd -u username             # Unlock password
pam_tally2 --user=username --reset  # Reset failed login count
```

### Group and Sudo Issues
```bash
# Group management
groups                         # Current user's groups
newgrp groupname               # Switch primary group
usermod -aG groupname username # Add user to group
gpasswd -d username groupname  # Remove user from group

# Sudo troubleshooting
visudo                         # Edit sudoers file safely
sudo -l                        # List sudo privileges
sudo -k                        # Clear sudo cache
cat /var/log/auth.log | grep sudo  # Sudo usage logs

# Fix sudo configuration
echo "username ALL=(ALL:ALL) ALL" >> /etc/sudoers.d/username
chmod 440 /etc/sudoers.d/username
```

## Vulnerability Assessment and Fixes

### System Vulnerability Scanning
```bash
# Update system packages
apt update && apt upgrade       # Debian/Ubuntu
yum update                     # CentOS/RHEL
dnf update                     # Fedora

# Check for security updates
apt list --upgradable | grep -i security
yum --security check-update
unattended-upgrades --dry-run  # Test automatic updates

# Vulnerability scanning with Lynis
lynis audit system             # Complete system audit
lynis show details TEST-ID     # Show specific test details
```

### Service Security Hardening
```bash
# Disable unnecessary services
systemctl list-units --type=service --state=running
systemctl disable telnet
systemctl stop telnet
systemctl mask telnet          # Prevent accidental start

# Secure SSH configuration
sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

# Firewall configuration
ufw enable
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
```

### Password Security Issues
```bash
# Check password policies
cat /etc/pam.d/common-password
cat /etc/security/pwquality.conf

# Enforce strong passwords
echo "minlen = 12" >> /etc/security/pwquality.conf
echo "dcredit = -1" >> /etc/security/pwquality.conf
echo "ucredit = -1" >> /etc/security/pwquality.conf

# Check weak passwords
john --wordlist=/usr/share/wordlists/rockyou.txt /etc/shadow
hashcat -m 1800 /etc/shadow wordlist.txt
```

### Network Security Fixes
```bash
# Disable unused network services
netstat -tuln                  # Check listening ports
nmap localhost                 # Port scan localhost
systemctl disable xinetd      # Disable super server

# Secure network configuration
echo "net.ipv4.ip_forward = 0" >> /etc/sysctl.conf
echo "net.ipv4.conf.all.send_redirects = 0" >> /etc/sysctl.conf
echo "net.ipv4.conf.all.accept_redirects = 0" >> /etc/sysctl.conf
sysctl -p                      # Apply settings

# Install fail2ban for brute force protection
apt install fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

## Malware and Intrusion Detection

### Malware Scanning
```bash
# Install and run ClamAV
apt install clamav clamav-daemon
freshclam                      # Update virus definitions
clamscan -r /home              # Scan home directories
clamscan -r --infected --remove /var/www  # Scan and remove

# Rootkit detection
apt install rkhunter chkrootkit
rkhunter --check              # Check for rootkits
chkrootkit                    # Alternative rootkit scanner
```

### Intrusion Detection
```bash
# Check for suspicious activity
last                          # Last logged in users
lastlog                       # Last login times
who                           # Currently logged in users
w                             # What users are doing

# Check process integrity
ps aux | grep -E "(sh|bash)" | grep -v grep
lsof -i                       # Network connections
netstat -tuln                 # Open ports

# File integrity monitoring
find / -name "*.sh" -mtime -1 2>/dev/null  # Recently modified scripts
find /etc -mtime -1 2>/dev/null             # Recently modified configs
```

### Automated Security Monitoring
```bash
#!/bin/bash
# Security monitoring script

ALERT_EMAIL="security@example.com"
LOG_FILE="/var/log/security-check.log"

echo "Security Check - $(date)" >> "$LOG_FILE"

# Check for failed login attempts
FAILED_LOGINS=$(grep "Failed password" /var/log/auth.log | grep "$(date +%b\ %e)" | wc -l)
if [ "$FAILED_LOGINS" -gt 10 ]; then
    echo "High number of failed logins: $FAILED_LOGINS" | \
    mail -s "Security Alert: Failed Logins" "$ALERT_EMAIL"
fi

# Check for new SUID files
find / -type f -perm -4000 2>/dev/null > /tmp/suid-current.txt
if [ -f /var/lib/suid-baseline.txt ]; then
    NEW_SUID=$(comm -13 /var/lib/suid-baseline.txt /tmp/suid-current.txt)
    if [ -n "$NEW_SUID" ]; then
        echo "New SUID files detected: $NEW_SUID" | \
        mail -s "Security Alert: New SUID Files" "$ALERT_EMAIL"
    fi
else
    cp /tmp/suid-current.txt /var/lib/suid-baseline.txt
fi

# Check system integrity
if command -v aide >/dev/null; then
    aide --check >> "$LOG_FILE" 2>&1
    if [ $? -eq 1 ]; then
        echo "File integrity violations detected" | \
        mail -s "Security Alert: File Integrity" "$ALERT_EMAIL"
    fi
fi

# Check for suspicious processes
ps aux | grep -E "(nc|netcat|nmap)" | grep -v grep >> "$LOG_FILE"
```

### Emergency Security Response
```bash
# Immediate threat response
# Isolate system from network
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -A INPUT -i lo -j ACCEPT  # Keep loopback

# Lock user accounts
usermod -L suspicious_user
pkill -u suspicious_user       # Kill user processes

# Preserve evidence
dd if=/dev/sda of=/evidence/disk_image.dd bs=4096
cp /var/log/auth.log /evidence/
cp /var/log/syslog /evidence/

# Change critical passwords
passwd root
passwd admin
```

This security troubleshooting guide provides systematic approaches to resolve SELinux issues, fix permission problems, address vulnerabilities, and respond to security incidents, ensuring system integrity and protection against threats.