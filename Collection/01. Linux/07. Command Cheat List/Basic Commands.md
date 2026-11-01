# 01. Basic Commands

## **Essential Linux Commands for Ubuntu**  

> Linux shares alot of commands with other distros but package managers will be different based on distro groups, meaning different syntax.

#### **User Management**  
```bash 
sudo adduser username         # Create a new user  
sudo passwd username          # Set or change user password  
sudo userdel -r username      # Delete a user and remove home directory  
sudo usermod -aG groupname username  # Add user to a group  
groups username              # Show groups of a user  
id username                  # Show user ID and group IDs
whoami                       # Show current username
who                          # Show logged-in users
w                           # Show who is logged on and what they're doing
last                        # Show recent login history
finger username             # Display user information
sudo passwd -l username     # Lock a user account
sudo passwd -u username     # Unlock a user account
sudo chage -l username      # View password aging information
sudo chage -M 90 username   # Set password to expire in 90 day
```

#### **Group Management**
```
sudo groupadd groupname     # Create a new group
sudo groupdel groupname     # Delete a group
sudo gpasswd -a username groupname  # Add user to group
sudo gpasswd -d username groupname  # Remove user from group
getent group                # List all groups
getent passwd               # List all users
sudo usermod -l newname oldname     # Rename a user
sudo usermod -d /new/home username  # Change user home directory
sudo usermod -s /bin/bash username  # Change user shell
sudo usermod -e 2024-12-31 username # Set account expiry date
newgrp groupname            # Switch to a group temporarily
```

#### **File & Directory Management**  
```bash
ls -la                      # List files (detailed view)  
cd /path/to/directory       # Change directory  
mkdir new_directory         # Create a new directory  
rm -rf directory_or_file    # Remove files or directories  
cp file1 file2              # Copy a file  
mv file1 new_location/      # Move or rename a file  
find / -name filename       # Search for a file  
locate filename             # Find files by name (faster than find)
which command               # Show path of a command
whereis command             # Show binary, source, manual paths
tree                        # Display directory structure as tree
ln -s /path/to/file linkname # Create symbolic link
ln /path/to/file linkname   # Create hard link
```

#### **Viewing & Editing Files**  
```bash
cat filename                # Display file content  
less filename               # View file one page at a time (scroll up/down)  
more filename               # Similar to less, but can't scroll up  
head -n 10 filename         # Show first 10 lines of a file  
tail -n 10 filename         # Show last 10 lines of a file  
tail -f logfile.log         # Live monitor a log file  
nano filename               # Edit a file with the Nano text editor  
vim filename                # Edit a file with the Vim text editor  
grep "pattern" filename     # Search for text in files
grep -r "pattern" directory # Recursively search in directory
diff file1 file2            # Compare two files  
```

#### **Permissions & Ownership**  
```bash
chmod 755 filename          # Change file permissions  
chown user:group filename   # Change file owner  
sudo chown -R user:group /path  # Change owner recursively  
```

#### **Package Management (APT)**  
```bash
sudo apt update             # Update package lists  
sudo apt upgrade            # Upgrade installed packages  
sudo apt install package    # Install a package  
sudo apt remove package     # Remove a package  
dpkg -l | grep package      # Check if a package is installed  
apt search keyword          # Search for packages
apt show package            # Show package information
sudo apt autoremove         # Remove unused packages
sudo apt autoclean          # Clean package cache
dpkg -i package.deb         # Install .deb package
```

#### **Process Management**  
```bash
ps aux                      # Show running processes  
top                         # Display system resource usage  
kill -9 PID                 # Kill a process by PID  
pkill process_name          # Kill process by name  
killall process_name        # Kill all processes with name
jobs                        # Show background jobs
fg %1                       # Bring job 1 to foreground
bg %1                       # Send job 1 to background
nohup command &             # Run command immune to hangups
screen                      # Terminal multiplexer
tmux                        # Another terminal multiplexer
```

#### **Networking**  
```bash
ip a                        # Show network interfaces  
ping google.com             # Test connectivity  
netstat -tulnp              # Show open ports  
curl -I example.com         # Get HTTP headers of a site  
wget https://example.com/file.zip  # Download files
scp file user@host:/path    # Secure copy over SSH
rsync -av source/ dest/     # Synchronize directories
ssh user@hostname           # Connect via SSH
```

#### **System Monitoring & Logs**  
```bash
df -h                       # Show disk space usage  
du -sh folder/              # Show folder size  
free -m                     # Show memory usage  
uptime                      # Show system uptime  
dmesg | tail                # View latest system messages  
journalctl -xe              # View system logs  
journalctl -f               # Follow system logs
tail -f /var/log/syslog     # Monitor system log
grep ERROR /var/log/syslog  # Search for errors in logs
```

#### **System Management**  
```bash
sudo reboot                 # Reboot system  
sudo shutdown -h now        # Shutdown system  
sudo systemctl start service   # Start a service  
sudo systemctl stop service    # Stop a service  
sudo systemctl restart service # Restart a service  
sudo systemctl status service  # Check service status  
sudo systemctl enable service  # Enable service at boot
sudo systemctl disable service # Disable service at boot
systemctl list-units --type=service  # List all services
```

#### **Permissions**
```bash
chmod 755 filename          # Change file permissions  
chown user:group filename   # Change file owner  
sudo chown -R user:group /path  # Change owner recursively  
ls -l                       # View file permissions
chmod u+x filename          # Add execute permission for owner
chmod g-w filename          # Remove write permission for group
chmod o+r filename          # Add read permission for others
chmod a+x filename          # Add execute permission for all
```

#### **Advanced Permissions**
```bash
# Sticky Bit (t) - Only owner can delete files in directory
chmod +t /tmp               # Set sticky bit on directory
chmod 1755 /tmp             # Set sticky bit with octal notation
ls -ld /tmp                 # View sticky bit (shows 't' at end)

# SUID (Set User ID) - Run with owner's privileges
chmod u+s /usr/bin/passwd   # Set SUID bit
chmod 4755 filename         # Set SUID with octal notation

# SGID (Set Group ID) - Run with group's privileges or inherit group
chmod g+s directory         # Set SGID on directory
chmod 2755 directory        # Set SGID with octal notation

# View special permissions
ls -l filename              # Look for 's' or 't' in permissions
find /usr/bin -perm -4000   # Find files with SUID bit
find /usr/bin -perm -2000   # Find files with SGID bit
find /tmp -perm -1000       # Find files with sticky bit

# Access Control Lists (ACLs)
setfacl -m u:username:rw filename    # Set ACL for specific user
getfacl filename                     # View ACL permissions
setfacl -x u:username filename       # Remove ACL for user
setfacl -b filename                  # Remove all ACL entries
```

#### **Advanced Performance Management**
```bash
# Process Monitoring
top                         # Interactive process viewer
htop                        # Enhanced interactive process viewer
ps aux                      # Show all running processes
ps -ef                      # Show processes in full format
pstree                      # Show processes in tree format
pidof process_name          # Get PID of a process

# System Performance
vmstat 1                    # Virtual memory statistics every second
iostat 1                    # I/O statistics every second
sar 1                       # System activity reporter
nmon                        # Performance monitoring tool
dstat                       # Versatile system statistics
glances                     # Cross-platform monitoring tool

# Memory Analysis
free -h                     # Human-readable memory usage
cat /proc/meminfo           # Detailed memory information
smem -tk                    # Per-process memory usage
pmap PID                    # Memory map of a process

# CPU Monitoring
lscpu                       # CPU architecture information
cat /proc/cpuinfo           # Detailed CPU information
mpstat 1                    # CPU usage statistics
uptime                      # System uptime and load average

# Disk Performance
iotop                       # I/O usage by process
df -h                       # Disk space usage
du -sh /path/*              # Directory sizes
lsof                        # List open files
fuser /path/to/file         # Show processes using a file

# Network Performance
iftop                       # Network usage by connection
nethogs                     # Network usage by process
ss -tuln                    # Socket statistics
netstat -i                  # Network interface statistics
```

#### **Archive & Compression**
```bash
tar -czf archive.tar.gz files/     # Create compressed archive
tar -xzf archive.tar.gz            # Extract compressed archive
zip -r archive.zip directory/      # Create zip archive
unzip archive.zip                  # Extract zip archive
gzip filename                      # Compress file with gzip
gunzip filename.gz                 # Decompress gzip file
```

#### **Environment Variables**
```bash
env                         # Show all environment variables
echo $PATH                  # Show PATH variable
export VAR=value            # Set environment variable
unset VAR                   # Remove environment variable
source ~/.bashrc            # Reload bash configuration
alias ll='ls -la'           # Create command alias
which python3               # Show path of python3 command
```

#### Cron Job Commands Reference
```bash
# Basic Commands
crontab -e                    # Edit current user's crontab
crontab -l                    # List current user's cron jobs
crontab -r                    # Remove all cron jobs for current user
crontab -e -u username        # Edit crontab for specific user (as root)
crontab -l -u username        # List cron jobs for specific user (as root)

# Crontab Format: * * * * * command
# Fields: minute hour day-of-month month day-of-week

# Common Schedules
* * * * * /path/to/script                # Every minute
*/5 * * * * /path/to/script              # Every 5 minutes
0 * * * * /path/to/script                # Every hour
30 2 * * * /path/to/script               # Daily at 2:30 AM
0 0 * * 0 /path/to/script                # Weekly on Sunday at midnight
0 0 1 * * /path/to/script                # Monthly on 1st at midnight
0 9 * * 1-5 /path/to/script              # Weekdays at 9 AM
*/15 9-17 * * 1-5 /path/to/script        # Every 15 min, business hours, weekdays

# System Directories
ls /etc/cron.d/               # Custom system cron jobs
ls /etc/cron.daily/           # Daily scripts
ls /etc/cron.hourly/          # Hourly scripts
ls /etc/cron.weekly/          # Weekly scripts
ls /etc/cron.monthly/         # Monthly scripts

# Service Management
systemctl start cron         # Start cron service (or crond)
systemctl stop cron          # Stop cron service
systemctl restart cron       # Restart cron service
systemctl status cron        # Check cron service status
systemctl enable cron        # Enable cron at boot
systemctl disable cron       # Disable cron at boot

# Logging
tail -f /var/log/cron         # View cron logs (traditional)
journalctl -u cron -f         # View cron logs (systemd)
journalctl -u cron | grep user # View logs for specific user

# Output Redirection Examples
0 2 * * * script > /var/log/output.log 2>&1    # Redirect to file
0 2 * * * script > /dev/null 2>&1              # Discard output
0 2 * * * script                               # Email output (default)
```