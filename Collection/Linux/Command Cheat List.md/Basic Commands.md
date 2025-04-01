## **Essential Linux Commands for Ubuntu**  

> Linux shares alot of commands with other distros but package managers will be different based on distro groups, meaning different syntax.

#### **User Management**  
```bash
sudo adduser username         # Create a new user  
sudo passwd username          # Set or change user password  
sudo userdel -r username      # Delete a user and remove home directory  
sudo usermod -aG groupname username  # Add user to a group  
groups username              # Show groups of a user  
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
```

#### **Process Management**  
```bash
ps aux                      # Show running processes  
top                         # Display system resource usage  
kill -9 PID                 # Kill a process by PID  
pkill process_name          # Kill process by name  
```

#### **Networking**  
```bash
ip a                        # Show network interfaces  
ping google.com             # Test connectivity  
netstat -tulnp              # Show open ports  
curl -I example.com         # Get HTTP headers of a site  
```

#### **System Monitoring & Logs**  
```bash
df -h                       # Show disk space usage  
du -sh folder/              # Show folder size  
free -m                     # Show memory usage  
uptime                      # Show system uptime  
dmesg | tail                # View latest system messages  
journalctl -xe              # View system logs  
```

#### **System Management**  
```bash
sudo reboot                 # Reboot system  
sudo shutdown -h now        # Shutdown system  
sudo systemctl start service   # Start a service  
sudo systemctl stop service    # Stop a service  
sudo systemctl restart service # Restart a service  
sudo systemctl status service  # Check service status  
```
