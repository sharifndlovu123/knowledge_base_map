# Linux Files & Directories: Permissions, Links, and Special Files

## Overview

Linux file and directory management involves understanding permissions, ownership, various file types, linking mechanisms, and special files. This comprehensive guide covers all aspects of file system operations and security.

## File Types in Linux

### File Type Identification
```bash
# Check file types
file filename.txt               # Determine file type
file -b filename.txt           # Brief output
file *                         # Check all files in directory
ls -la                         # Show file types with permissions

# File type indicators in ls -la:
# -  Regular file
# d  Directory
# l  Symbolic link
# c  Character device file
# b  Block device file
# p  Named pipe (FIFO)
# s  Socket file
```

### Special File Types
```bash
# Character devices (unbuffered I/O)
ls -la /dev/tty*               # Terminal devices
ls -la /dev/null               # Null device
ls -la /dev/random             # Random number generator

# Block devices (buffered I/O)
ls -la /dev/sd*                # SCSI/SATA disks
ls -la /dev/nvme*              # NVMe devices

# Named pipes (FIFOs)
mkfifo mypipe                  # Create named pipe
ls -la mypipe                  # Shows 'p' type

# Socket files
ls -la /var/run/*.sock         # Unix domain sockets
```

## File and Directory Permissions

### Permission Structure
```bash
# Permission format: type + owner + group + others
# Example: -rwxr-xr--
#          │└─┬─┘└─┬─┘└─┬─┘
#          │  │   │   └─ Others permissions
#          │  │   └─ Group permissions  
#          │  └─ Owner permissions
#          └─ File type

# Permission bits:
# r (read)    = 4
# w (write)   = 2  
# x (execute) = 1
```

### Basic Permission Commands
```bash
# View permissions
ls -l filename                 # Long format showing permissions
ls -ld directory/              # Directory permissions
stat filename                  # Detailed file information

# Change permissions (chmod)
chmod 755 filename             # Octal notation
chmod u+x filename             # Add execute for user
chmod g-w filename             # Remove write for group
chmod o=r filename             # Set others to read-only
chmod a+r filename             # Add read for all (user, group, others)

# Change ownership
chown user:group filename      # Change user and group
chown user filename            # Change user only
chgrp group filename           # Change group only
chown -R user:group directory/ # Recursive ownership change
```

### Advanced Permission Examples
```bash
# Multiple permission changes
chmod u+rwx,g+rx,o+r filename  # Detailed permissions
chmod 644 *.txt                # Set all .txt files to rw-r--r--
chmod +x script.sh             # Make script executable for all

# Recursive permission changes
chmod -R 755 /path/to/directory     # Directories and files
find /path -type d -exec chmod 755 {} \;  # Directories only
find /path -type f -exec chmod 644 {} \;  # Files only

# Permission copying
chmod --reference=file1 file2   # Copy permissions from file1 to file2
```

## Special Permissions

### SUID (Set User ID)
```bash
# SUID bit allows file to run with owner's privileges
chmod u+s filename             # Set SUID bit
chmod 4755 filename            # Octal with SUID (4000 + 755)

# Examples of SUID files
ls -la /usr/bin/passwd         # -rwsr-xr-x (note the 's')
ls -la /usr/bin/sudo           # -rwsr-xr-x

# Find SUID files
find / -perm -4000 -type f 2>/dev/null
```

### SGID (Set Group ID)
```bash
# SGID on files: run with group privileges
chmod g+s filename             # Set SGID on file
chmod 2755 filename            # Octal with SGID (2000 + 755)

# SGID on directories: new files inherit group
chmod g+s directory/           # Set SGID on directory
mkdir -p /shared/project
chgrp developers /shared/project
chmod 2775 /shared/project     # New files inherit 'developers' group

# Find SGID files
find / -perm -2000 -type f 2>/dev/null
```

### Sticky Bit
```bash
# Sticky bit on directories: only owner can delete files
chmod +t directory/            # Set sticky bit
chmod 1755 directory/          # Octal with sticky bit (1000 + 755)

# Common example: /tmp directory
ls -ld /tmp                    # drwxrwxrwt (note the 't')

# Find directories with sticky bit
find / -perm -1000 -type d 2>/dev/null
```

### Combined Special Permissions
```bash
# All special permissions combined
chmod 7755 filename            # SUID + SGID + Sticky + 755
chmod u+s,g+s,+t filename      # Same using symbolic notation

# View special permissions
ls -la filename
stat filename | grep Access    # Detailed permission info
```

## Access Control Lists (ACLs)

### Basic ACL Operations
```bash
# Check if filesystem supports ACLs
mount | grep acl               # Look for 'acl' mount option
tune2fs -l /dev/sda1 | grep acl # Check ext filesystem ACL support

# View ACLs
getfacl filename               # Show file ACLs
getfacl directory/             # Show directory ACLs

# Set ACLs
setfacl -m u:username:rwx filename        # User permissions
setfacl -m g:groupname:rx filename        # Group permissions
setfacl -m o::r filename                  # Others permissions
setfacl -m m::rwx filename                # Mask permissions
```

### Advanced ACL Usage
```bash
# Default ACLs for directories
setfacl -d -m u:username:rwx directory/   # Default user ACL
setfacl -d -m g:groupname:rx directory/   # Default group ACL

# Multiple ACL entries
setfacl -m u:user1:rwx,u:user2:rx,g:group1:rw filename

# Remove ACLs
setfacl -x u:username filename            # Remove specific user ACL
setfacl -b filename                       # Remove all ACLs

# Copy ACLs
getfacl file1 | setfacl --set-file=- file2  # Copy ACLs from file1 to file2

# Recursive ACL operations
setfacl -R -m u:username:rwx directory/   # Apply to all files/subdirs
```

### ACL Examples
```bash
# Project directory with multiple user access
mkdir /project
setfacl -m u:alice:rwx /project           # Alice: full access
setfacl -m u:bob:rx /project              # Bob: read and execute
setfacl -m u:charlie:--- /project         # Charlie: no access
setfacl -d -m u:alice:rwx /project        # Default for new files

# Shared directory with group collaboration
setfacl -m g:developers:rwx /shared
setfacl -m g:testers:rx /shared
setfacl -d -m g:developers:rwx /shared
```

## File and Directory Links

### Hard Links
```bash
# Create hard links
ln source_file hard_link       # Create hard link
ln file1 file2 file3 link_name # Multiple files to one link

# Hard link characteristics:
# - Same inode number as original file
# - Cannot cross filesystem boundaries
# - Cannot link to directories (usually)
# - File exists until all hard links are removed

# Check hard links
ls -li filename                # Show inode number (-i flag)
find / -inum inode_number 2>/dev/null  # Find all hard links to inode
stat filename                  # Shows number of links
```

### Symbolic (Soft) Links
```bash
# Create symbolic links
ln -s source_file symlink      # Create symbolic link
ln -s /path/to/file /path/to/link  # Absolute path link
ln -s ../relative/path link    # Relative path link
ln -s directory/ dir_link      # Link to directory

# Symbolic link characteristics:
# - Different inode from target
# - Can cross filesystem boundaries
# - Can link to directories
# - Can link to non-existent files (broken links)

# Check symbolic links
ls -la symlink                 # Shows link target
readlink symlink               # Print link target
readlink -f symlink            # Follow all links to final target
file symlink                   # Shows it's a symbolic link
```

### Link Management
```bash
# Find broken symbolic links
find /path -type l -exec test ! -e {} \; -print
find /path -xtype l            # Using xtype

# Find all symbolic links
find /path -type l

# Update symbolic links
ln -sf new_target old_link     # Force update symbolic link
unlink linkname                # Remove link (alternative to rm)

# Link safety
ln -i source target            # Interactive mode (prompt before overwrite)
ln -b source target            # Backup existing target
```

## File Attributes

### Extended Attributes
```bash
# View extended attributes
lsattr filename                # List attributes
lsattr -d directory/           # Directory attributes
lsattr -R directory/           # Recursive listing

# Set attributes
chattr +i filename             # Immutable (cannot be modified/deleted)
chattr +a filename             # Append-only
chattr +u filename             # Undeletable (when deleted, can be recovered)
chattr +c filename             # Compressed
chattr +s filename             # Secure deletion
chattr +A filename             # No access time updates

# Remove attributes  
chattr -i filename             # Remove immutable
chattr -a filename             # Remove append-only
chattr = filename              # Clear all attributes
```

### Attribute Examples
```bash
# Protect important files
chattr +i /etc/passwd          # Make passwd file immutable
chattr +i /boot/grub/grub.cfg  # Protect GRUB configuration

# Log files (append-only)
chattr +a /var/log/secure      # Can only append to log file

# Performance optimization
chattr +A /var/lib/mysql/      # No access time updates for database
```

## Special File Operations

### Device Files
```bash
# Create device files
mknod /dev/mydevice c 10 200   # Character device (major 10, minor 200)
mknod /dev/myblock b 8 1       # Block device (major 8, minor 1)

# Device file information
ls -la /dev/sda                # Block device
ls -la /dev/tty0               # Character device
cat /proc/devices              # List device numbers
```

### Named Pipes (FIFOs)
```bash
# Create named pipe
mkfifo pipe1                   # Create named pipe
mkfifo -m 644 pipe2            # Create with specific permissions

# Using named pipes
echo "Hello" > pipe1 &         # Write to pipe (background)
cat < pipe1                    # Read from pipe

# Real-world example: log monitoring
mkfifo /tmp/logpipe
tail -f /var/log/syslog > /tmp/logpipe &
grep "error" < /tmp/logpipe
```

### Temporary Files and Directories
```bash
# Create temporary files
tmpfile=$(mktemp)              # Create temporary file
tmpdir=$(mktemp -d)            # Create temporary directory
mktemp -t prefix.XXXXXX        # Template with prefix

# Secure temporary files
(umask 077; mktemp)            # Restrictive permissions
mktemp --tmpdir=/secure/path   # Specific directory

# Cleanup temporary files
trap 'rm -f "$tmpfile"' EXIT   # Automatic cleanup on script exit
```

## Directory Operations

### Directory Creation and Management
```bash
# Create directories
mkdir directory                # Single directory
mkdir -p path/to/deep/dir      # Create parent directories
mkdir -m 755 directory         # Create with specific permissions
mkdir {dir1,dir2,dir3}         # Multiple directories

# Directory navigation
cd directory                   # Change directory
cd -                          # Previous directory
cd ~                          # Home directory
cd                            # Home directory (default)
pushd /path                   # Push directory to stack
popd                          # Pop directory from stack
dirs                          # Show directory stack
```

### Directory Permissions
```bash
# Directory permission meanings:
# r (read)    - List directory contents
# w (write)   - Create/delete files in directory
# x (execute) - Enter directory

# Common directory permissions
chmod 755 directory/           # rwxr-xr-x (standard)
chmod 750 directory/           # rwxr-x--- (group access)
chmod 700 directory/           # rwx------ (private)
chmod 1777 directory/          # rwxrwxrwt (public with sticky)
```

## File System Navigation

### Finding Files and Directories
```bash
# find command
find /path -name "filename"    # Find by name
find /path -type f -name "*.txt"  # Find text files
find /path -type d -name "dir*"   # Find directories
find /path -perm 644           # Find by permissions
find /path -user username      # Find by owner
find /path -group groupname    # Find by group
find /path -size +100M         # Find large files
find /path -mtime -7           # Modified in last 7 days

# locate command (faster, uses database)
locate filename                # Find files by name
updatedb                       # Update locate database
locate -i filename             # Case-insensitive search
```

### File Content Operations
```bash
# View file contents
cat filename                   # Display entire file
less filename                  # View file page by page
head -n 10 filename           # First 10 lines
tail -n 10 filename           # Last 10 lines
tail -f filename              # Follow file (live updates)

# File comparison
diff file1 file2              # Compare files
cmp file1 file2               # Binary comparison
comm file1 file2              # Compare sorted files
```

## Advanced File Management

### File Archiving and Compression
```bash
# tar archives
tar -cvf archive.tar files/   # Create archive
tar -xvf archive.tar          # Extract archive
tar -tvf archive.tar          # List archive contents
tar -czf archive.tar.gz files/  # Create compressed archive
tar -xzf archive.tar.gz       # Extract compressed archive

# Other compression tools
gzip filename                 # Compress file
gunzip filename.gz            # Decompress file
zip archive.zip files/        # Create ZIP archive
unzip archive.zip             # Extract ZIP archive
```

### File Synchronization
```bash
# rsync - efficient file synchronization
rsync -av source/ destination/     # Archive mode, verbose
rsync -av --delete source/ dest/   # Delete extra files in destination
rsync -av user@host:/path/ local/  # Remote synchronization
rsync -av --exclude="*.tmp" src/ dst/  # Exclude patterns

# Local file copying with progress
cp -v source destination       # Verbose copy
cp -r source_dir/ dest_dir/   # Recursive copy
cp -p source destination      # Preserve attributes
```

## Security and Best Practices

### Secure File Operations
```bash
# Secure file deletion
shred -vfz -n 3 filename      # Overwrite file 3 times
wipe filename                 # Secure wipe (if available)
rm filename && sync           # Standard deletion + sync

# File integrity
md5sum filename               # MD5 checksum
sha256sum filename            # SHA-256 checksum
sha256sum -c checksums.txt    # Verify checksums

# File permissions audit
find / -perm -4000 -type f 2>/dev/null  # Find SUID files
find / -perm -2000 -type f 2>/dev/null  # Find SGID files
find / -perm -1000 -type d 2>/dev/null  # Find sticky directories
find / -type f -perm 777 2>/dev/null    # Find world-writable files
```

### Permission Best Practices
```bash
# Principle of least privilege
chmod 644 document.txt         # Read-only for group/others
chmod 750 script.sh           # Execute for user/group only
chmod 700 ~/.ssh/              # Private SSH directory
chmod 600 ~/.ssh/id_rsa       # Private key permissions

# Group collaboration
chgrp project /shared/project  # Set group ownership
chmod 2775 /shared/project     # SGID for group inheritance
setfacl -d -m g:project:rwx /shared/project  # Default group ACL
```

## Troubleshooting File Operations

### Common Permission Issues
```bash
# Permission denied errors
ls -la filename               # Check current permissions
namei -l /path/to/file        # Check permissions along path
sudo -u username ls -la file  # Test as different user

# Fix common permission problems
sudo chown -R user:group /home/user/    # Fix home directory ownership
sudo chmod -R u+rwX,go-w /home/user/    # Fix home directory permissions
find /path -type d -exec chmod 755 {} \;  # Fix directory permissions
find /path -type f -exec chmod 644 {} \;  # Fix file permissions
```

### File System Issues
```bash
# Disk space problems
df -h                         # Check disk usage
du -sh directory/             # Directory size
find / -size +100M 2>/dev/null  # Find large files

# Inode exhaustion
df -i                         # Check inode usage
find / -type f | wc -l        # Count files
```

## Scripting Examples

### Automated Permission Management
```bash
#!/bin/bash
# Set standard permissions for web content

# Web root permissions
find /var/www -type d -exec chmod 755 {} \;
find /var/www -type f -exec chmod 644 {} \;

# Make scripts executable
find /var/www -name "*.sh" -exec chmod 755 {} \;
find /var/www -name "*.pl" -exec chmod 755 {} \;

# Set ownership
chown -R www-data:www-data /var/www

echo "Web permissions updated successfully"
```

### Link Management Script
```bash
#!/bin/bash
# Create standardized symbolic links

INSTALL_DIR="/opt/myapp"
BIN_DIR="/usr/local/bin"

# Create symbolic links for executables
for binary in myapp myapp-admin myapp-tool; do
    if [ -f "$INSTALL_DIR/bin/$binary" ]; then
        ln -sf "$INSTALL_DIR/bin/$binary" "$BIN_DIR/$binary"
        echo "Created link: $BIN_DIR/$binary -> $INSTALL_DIR/bin/$binary"
    fi
done
```

Linux file and directory management provides powerful tools for controlling access, organizing data, and maintaining system security through proper permissions, linking mechanisms, and special file handling.
