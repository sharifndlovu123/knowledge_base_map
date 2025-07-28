
# Linux Filesystem Hierarchy Standard (FHS)

## What is the Filesystem Hierarchy Standard?
The Filesystem Hierarchy Standard (FHS) defines the directory structure and directory contents in Linux distributions. It's maintained by the Linux Foundation and provides a common layout that ensures consistency across different Linux systems, making it easier for users, administrators, and software developers to locate files and understand system organization.

**Purpose of FHS:**
- **Consistency**: Uniform directory structure across distributions
- **Predictability**: Users and software know where to find files
- **Compatibility**: Applications work across different Linux systems
- **Administration**: Simplified system management and troubleshooting

## Root Directory (/)
The root directory is the top-level directory from which all other directories branch. Everything in a Linux system is located under this directory.

```
/ (root)
├── bin/          # Essential user command binaries
├── boot/         # Boot loader files
├── dev/          # Device files
├── etc/          # System configuration files
├── home/         # User home directories
├── lib/          # Essential shared libraries
├── media/        # Mount points for removable media
├── mnt/          # Temporary mount points
├── opt/          # Optional software packages
├── proc/         # Virtual filesystem (process information)
├── root/         # Root user's home directory
├── run/          # Runtime data
├── sbin/         # Essential system binaries
├── srv/          # Service data
├── sys/          # Virtual filesystem (system information)
├── tmp/          # Temporary files
├── usr/          # User programs and data
└── var/          # Variable data files
```

## Essential Directories

### /bin (Essential User Binaries)
Contains essential command binaries that need to be available in single-user mode and for all users.

**Contents:**
- Basic commands: `ls`, `cp`, `mv`, `rm`, `cat`, `grep`
- Shell programs: `bash`, `sh`
- System utilities: `ps`, `kill`, `mount`, `umount`

```bash
# View contents
ls -la /bin

# Common binaries
/bin/bash         # Bash shell
/bin/ls           # List directory contents
/bin/cp           # Copy files
/bin/mv           # Move/rename files
/bin/rm           # Remove files
```

### /sbin (Essential System Binaries)
Contains essential system administration binaries, typically used by the system administrator.

**Contents:**
- System management tools: `fdisk`, `fsck`, `mkfs`
- Network configuration: `ifconfig`, `route`
- System control: `init`, `shutdown`, `reboot`

```bash
# View contents (may require root)
ls -la /sbin

# Common system binaries
/sbin/fdisk       # Disk partitioning
/sbin/fsck        # Filesystem check
/sbin/iptables    # Firewall configuration
/sbin/init        # System initialization
```

### /etc (Configuration Files)
Contains system-wide configuration files and shell scripts used during boot.

**Important subdirectories and files:**
```bash
/etc/passwd       # User account information
/etc/shadow       # Encrypted passwords
/etc/group        # Group information
/etc/fstab        # Filesystem mount information
/etc/hosts        # Static hostname to IP mappings
/etc/hostname     # System hostname
/etc/resolv.conf  # DNS resolver configuration
/etc/crontab      # System cron jobs
/etc/ssh/         # SSH server configuration
/etc/nginx/       # Nginx web server configuration
/etc/apache2/     # Apache web server configuration
```

### /usr (User Programs)
Contains user programs and data. This is often the largest directory on the system.

**Structure:**
```bash
/usr/bin/         # Non-essential user binaries
/usr/sbin/        # Non-essential system binaries
/usr/lib/         # Libraries for /usr/bin and /usr/sbin
/usr/local/       # Locally installed software
/usr/share/       # Architecture-independent data
/usr/include/     # Header files for C programming
/usr/src/         # Source code
```

### /var (Variable Data)
Contains variable data files that change during system operation.

**Subdirectories:**
```bash
/var/log/         # Log files
/var/cache/       # Application cache data
/var/lib/         # State information for applications
/var/spool/       # Spool directories (mail, print queues)
/var/tmp/         # Temporary files preserved between reboots
/var/www/         # Web server document root (common)
/var/mail/        # User mailboxes
```

### /home (User Home Directories)
Contains home directories for regular users.

```bash
/home/username/   # Individual user directories
/home/john/       # John's home directory
/home/jane/       # Jane's home directory

# User subdirectories (common)
~/Documents/      # User documents
~/Downloads/      # Downloaded files
~/Desktop/        # Desktop files
~/Pictures/       # Images
~/Videos/         # Video files
```

### /tmp (Temporary Files)
Contains temporary files created by applications and users. Files here may be deleted on reboot.

```bash
# Temporary files
/tmp/             # World-writable temporary directory
# Often mounted as tmpfs (RAM-based filesystem)
```

### /dev (Device Files)
Contains device files that represent hardware devices and special files.

**Common device files:**
```bash
/dev/sda          # First SATA drive
/dev/sda1         # First partition of first SATA drive
/dev/null         # Null device (discards all data)
/dev/zero         # Produces null characters
/dev/random       # Random number generator
/dev/urandom      # Pseudo-random number generator
/dev/tty          # Current terminal
```

### /proc (Process Information)
Virtual filesystem that provides information about running processes and kernel parameters.

**Important files and directories:**
```bash
/proc/cpuinfo     # CPU information
/proc/meminfo     # Memory information
/proc/version     # Kernel version
/proc/uptime      # System uptime
/proc/loadavg     # System load average
/proc/[PID]/      # Process-specific information
```

### /sys (System Information)
Virtual filesystem that exposes kernel objects, their attributes, and relationships.

```bash
/sys/class/       # Device classes
/sys/devices/     # Device hierarchy
/sys/kernel/      # Kernel information
/sys/module/      # Loaded kernel modules
```

## Optional Directories

### /opt (Optional Software)
Contains optional software packages, typically commercial software or large software suites.

```bash
/opt/google/      # Google software
/opt/teamviewer/  # TeamViewer installation
/opt/sublime/     # Sublime Text editor
```

### /srv (Service Data)
Contains data for services provided by the system.

```bash
/srv/www/         # Web server data
/srv/ftp/         # FTP server data
/srv/git/         # Git repositories
```

### /media (Removable Media)
Mount points for removable media devices.

```bash
/media/username/  # User-specific removable media
/media/usb/       # USB drives
/media/cdrom/     # CD/DVD drives
```

### /mnt (Mount Points)
Temporary mount points for administrators to mount filesystems.

```bash
/mnt/backup/      # Backup drive mount point
/mnt/nfs/         # Network filesystem mount
/mnt/windows/     # Windows partition mount
```

## Special Directories

### /root (Root Home)
Home directory for the root user (system administrator).

```bash
/root/            # Root user's home directory
/root/.bashrc     # Root's bash configuration
/root/.ssh/       # Root's SSH keys
```

### /boot (Boot Files)
Contains files needed for system boot process.

```bash
/boot/vmlinuz     # Linux kernel
/boot/initrd.img  # Initial RAM disk
/boot/grub/       # GRUB bootloader configuration
```

### /lib (Essential Libraries)
Contains essential shared libraries needed by binaries in /bin and /sbin.

```bash
/lib/modules/     # Kernel modules
/lib/firmware/    # Firmware files
/lib64/           # 64-bit libraries (on 64-bit systems)
```

### /run (Runtime Data)
Contains runtime data for system services, only valid until next reboot.

```bash
/run/user/        # User runtime directories
/run/systemd/     # systemd runtime data
/run/lock/        # Lock files
```

## Navigation Commands

### Basic Navigation
```bash
# Show current directory
pwd

# Change to different directories
cd /                    # Root directory
cd /home/username       # User home
cd /etc                 # Configuration files
cd /var/log            # Log files
cd ~                   # Home directory (shortcut)
cd -                   # Previous directory

# List directory contents
ls /                   # Root directory contents
ls -la /etc           # Detailed listing of /etc
ls -la /home          # List home directories

# Find files in the hierarchy
find / -name "filename" 2>/dev/null
locate filename
which command          # Find command location
whereis command        # Find binary, source, manual
```

### Directory Information
```bash
# Show directory sizes
du -sh /var/log        # Size of log directory
du -sh /home/*         # Size of each user directory
du -sh /*              # Size of root-level directories

# Show filesystem usage
df -h                  # Disk space usage
df -i                  # Inode usage

# Show directory tree structure
tree /etc -L 2         # Show /etc tree, 2 levels deep
tree /home -d          # Show only directories
```

### File System Information
```bash
# Show mounted filesystems
mount | column -t
findmnt

# Show filesystem hierarchy
lsblk                  # Block device tree
lsblk -f               # With filesystem info

# Show file types
file /bin/ls           # File type information
file /etc/passwd       # Check file type
```

## Directory Permissions and Ownership

### Standard Permissions
```bash
# View permissions
ls -ld /tmp            # Sticky bit directory
ls -ld /etc            # Configuration directory
ls -ld /home           # Home directories

# Common permission patterns
drwxr-xr-x  /home      # 755 - directories
-rw-r--r--  /etc/passwd # 644 - readable config files
-rw-------  /etc/shadow # 600 - sensitive files
drwxrwxrwt  /tmp       # 1777 - sticky bit temp directory
```

### Special Directory Permissions
```bash
# Sticky bit (typically on /tmp)
ls -ld /tmp            # Shows 't' at end: drwxrwxrwt

# SGID on directories (group inheritance)
chmod g+s /shared/dir  # New files inherit group ownership

# Check special permissions
find /usr/bin -perm -4000  # SUID binaries
find /usr/bin -perm -2000  # SGID binaries
```

## Modern Additions to FHS

### systemd Directories
```bash
/etc/systemd/          # systemd configuration
/usr/lib/systemd/      # systemd unit files
/run/systemd/          # systemd runtime data
/var/lib/systemd/      # systemd state data
```

### Container and Virtualization
```bash
/var/lib/docker/       # Docker data
/var/lib/libvirt/      # Libvirt virtual machines
/etc/containers/       # Container configuration
```

### Snap and Flatpak
```bash
/snap/                 # Snap packages
/var/lib/snapd/        # Snap daemon data
/var/lib/flatpak/      # Flatpak applications
```

## Best Practices

### For System Administrators
- Keep user data in `/home`
- Store logs in `/var/log`
- Mount external storage under `/mnt` or `/media`
- Install optional software in `/opt`
- Use `/srv` for service-specific data

### For Developers
- Install from source in `/usr/local`
- Store application data in `/var/lib/appname`
- Create logs in `/var/log/appname`
- Use `/etc/appname` for configuration files

### For Users
- Keep personal files in home directory (`~`)
- Use subdirectories like `~/Documents`, `~/Downloads`
- Don't modify system directories without proper permissions
- Understand the purpose of each directory before making changes
