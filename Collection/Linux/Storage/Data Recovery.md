# Data Recovery in Linux: Complete Guide

## Overview

Data recovery in Linux involves recovering lost, corrupted, or accidentally deleted files from various storage media. Linux provides numerous tools and techniques for data recovery, ranging from simple file restoration to complex filesystem reconstruction.

## Types of Data Loss

### Common Data Loss Scenarios
```bash
# Accidental deletion
rm -rf important_directory/
rm critical_file.txt

# Filesystem corruption
# - Power failures during write operations
# - Hardware failures
# - Improper system shutdown
# - Bad sectors

# Partition table corruption
# - Accidental fdisk operations
# - Boot sector corruption
# - MBR/GPT damage

# Hardware failures
# - Hard drive mechanical failure
# - SSD wear and failure
# - Memory corruption
# - Controller failures
```

## Immediate Response to Data Loss

### Critical First Steps
```bash
# 1. STOP using the affected storage immediately
# - Unmount the filesystem
# - Don't write any new data
# - Work from a live USB/CD if system drive affected

# 2. Assess the situation
# - Determine type of data loss
# - Identify affected storage device
# - Check if backup exists

# 3. Create a disk image for safety
dd if=/dev/sda of=/path/to/backup/disk_image.dd bs=4M status=progress

# 4. Work on the copy, never the original
```

## File Recovery Tools

### TestDisk and PhotoRec
```bash
# Install TestDisk suite
sudo apt install testdisk        # Debian/Ubuntu
sudo yum install testdisk        # CentOS/RHEL

# TestDisk - Partition recovery
sudo testdisk
# Features:
# - Recover deleted partitions
# - Rebuild partition tables
# - Fix filesystem structures
# - Recover boot sectors

# PhotoRec - File recovery
sudo photorec
# Features:
# - Recover files by signature
# - Works on damaged filesystems
# - Supports 440+ file formats
# - Cross-platform recovery
```

### Extundelete (ext3/ext4 filesystems)
```bash
# Install extundelete
sudo apt install extundelete

# Basic file recovery
extundelete /dev/sda1 --restore-file path/to/deleted/file.txt

# Recover all deleted files
extundelete /dev/sda1 --restore-all

# Recover files deleted after specific date
extundelete /dev/sda1 --after 2024-01-01 --restore-all

# Recover files from specific directory
extundelete /dev/sda1 --restore-directory /home/user/Documents

# Check filesystem for recoverable files
extundelete /dev/sda1 --inode 2
```

### Foremost (File Carving)
```bash
# Install Foremost
sudo apt install foremost

# Basic file recovery
foremost -t all -i /dev/sda1 -o /recovery/output

# Recover specific file types
foremost -t jpg,png,pdf -i /dev/sda1 -o /recovery/images

# Custom configuration (/etc/foremost.conf)
# jpg	y	200000	\xff\xd8\xff\xe0\x00\x10	\xff\xd9
# png	y	200000	\x50\x4e\x47?	\xff\xfb

# Use custom config
foremost -c /path/to/custom.conf -i /dev/sda1 -o /recovery/output
```

### Scalpel (Advanced File Carving)
```bash
# Install Scalpel
sudo apt install scalpel

# Configure file types (/etc/scalpel/scalpel.conf)
# Uncomment file types to recover:
# pdf      y   5000000  %PDF        %EOF\x0d
# jpg      y   200000   \xff\xd8\xff\xe0\x00\x10  \xff\xd9

# Run Scalpel
scalpel -b -o /recovery/output /dev/sda1

# Preview mode (don't extract files)
scalpel -p -o /recovery/output /dev/sda1
```

## Filesystem-Specific Recovery

### ext2/ext3/ext4 Recovery
```bash
# Check filesystem integrity
fsck.ext4 -n /dev/sda1          # Read-only check
fsck.ext4 -p /dev/sda1          # Automatic repair
fsck.ext4 -f /dev/sda1          # Force check

# e2fsck with recovery
e2fsck -y /dev/sda1             # Answer yes to all questions
e2fsck -c /dev/sda1             # Check for bad blocks

# debugfs for advanced recovery
debugfs /dev/sda1
# debugfs commands:
# ls /                          # List root directory
# cd /path/to/directory         # Change directory
# undel                         # List deleted inodes
# dump <inode> /recovery/file   # Dump inode to file
```

### XFS Recovery
```bash
# XFS filesystem check
xfs_check /dev/sda1             # Check XFS filesystem

# XFS repair
xfs_repair -n /dev/sda1         # Dry run
xfs_repair /dev/sda1            # Repair filesystem

# XFS debugging
xfs_db -r /dev/sda1
# xfs_db commands:
# freesp                        # Show free space
# sb                            # Superblock info
# inode <number>                # Examine inode
```

### Btrfs Recovery
```bash
# Btrfs check
btrfs check /dev/sda1           # Check filesystem
btrfs check --repair /dev/sda1  # Repair filesystem

# Btrfs rescue
btrfs rescue super-recover /dev/sda1    # Recover superblock
btrfs rescue zero-log /dev/sda1         # Clear log

# Btrfs restore
btrfs restore /dev/sda1 /recovery/path  # Restore files
```

### NTFS Recovery (for dual-boot systems)
```bash
# Install NTFS tools
sudo apt install ntfs-3g ntfsprogs

# NTFS check and repair
ntfsfix /dev/sda1               # Quick NTFS repair
ntfsck /dev/sda1                # Check NTFS filesystem

# NTFS undelete
ntfsundelete /dev/sda1          # List deleted files
ntfsundelete /dev/sda1 -u -i 12345  # Recover by inode
ntfsundelete /dev/sda1 -u -m "*.doc" # Recover by pattern
```

## Advanced Recovery Techniques

### DD Rescue and Ddrescue
```bash
# Install ddrescue
sudo apt install gddrescue

# Basic disk imaging with error handling
ddrescue /dev/sda /recovery/disk_image.dd /recovery/rescue.log

# Resume interrupted recovery
ddrescue /dev/sda /recovery/disk_image.dd /recovery/rescue.log

# ddrescue with options
ddrescue -n -v /dev/sda /recovery/disk_image.dd /recovery/rescue.log
# -n : Skip the initial copy phase
# -v : Verbose output

# dd_rescue (alternative)
dd_rescue /dev/sda /recovery/disk_image.dd
```

### SafeCopy (for damaged media)
```bash
# Install safecopy
sudo apt install safecopy

# Basic recovery with error handling
safecopy /dev/sda /recovery/disk_image.dd

# Low-level recovery
safecopy --stage1 /dev/sda /recovery/disk_image.dd
safecopy --stage2 /dev/sda /recovery/disk_image.dd
safecopy --stage3 /dev/sda /recovery/disk_image.dd
```

### R-Studio (Commercial alternative)
```bash
# R-Studio for Linux (commercial)
# Features:
# - Advanced filesystem recovery
# - RAID reconstruction
# - Network recovery
# - Raw disk search
```

## RAID Recovery

### Software RAID Recovery
```bash
# Check RAID status
cat /proc/mdstat
mdadm --detail /dev/md0

# Recover failed RAID
mdadm --assemble --scan          # Auto-assemble arrays
mdadm --assemble /dev/md0 /dev/sda1 /dev/sdb1  # Manual assembly

# Force assembly with missing drives
mdadm --assemble --force /dev/md0 /dev/sda1

# Recover RAID metadata
mdadm --examine /dev/sda1        # Examine RAID superblock
```

### Hardware RAID Recovery
```bash
# LSI MegaRAID
storcli64 /c0 show              # Show controller info
storcli64 /c0/v0 show           # Show virtual drive

# Adaptec RAID
arcconf getconfig 1             # Get configuration
```

## LVM Recovery

### LVM Volume Recovery
```bash
# Scan for LVM volumes
pvscan                          # Scan physical volumes
vgscan                          # Scan volume groups
lvscan                          # Scan logical volumes

# Activate LVM volumes
vgchange -ay                    # Activate all volume groups
lvchange -ay /dev/vg0/lv0      # Activate specific logical volume

# LVM metadata recovery
vgcfgrestore vg0               # Restore VG metadata from backup
vgcfgrestore --list vg0        # List available backups

# Manual LVM recovery
dd if=/dev/sda of=pv_backup bs=1M count=1  # Backup PV header
```

## Network-Based Recovery

### Remote Recovery
```bash
# SSH-based recovery
ssh user@remote_host dd if=/dev/sda | dd of=/local/backup.dd

# Network block device recovery
nbd-client remote_host 10809 /dev/nbd0
dd if=/dev/nbd0 of=/recovery/disk_image.dd

# rsync for file recovery
rsync -avz user@remote:/path/to/files/ /recovery/
```

## Memory and Swap Recovery

### Swap File Recovery
```bash
# Examine swap for recoverable data
strings /swapfile | grep "search_term"

# Mount swap as regular file (if ext4-formatted)
file -s /dev/sda2               # Check if swap contains filesystem

# Recover from hibernation
# Hibernation files may contain recoverable data
```

### Memory Dump Analysis
```bash
# Analyze crash dumps
crash vmlinux vmcore            # Kernel crash analysis
volatility -f memory.dump imageinfo  # Memory forensics
```

## Deleted File Recovery

### Recently Deleted Files
```bash
# Check trash directories
ls ~/.local/share/Trash/files/
ls ~/.Trash/

# Command history recovery
history | grep "rm "            # Find delete commands
cat ~/.bash_history | grep "rm "

# Recover from editor backups
find /home -name "*~" -type f   # Backup files
find /home -name ".#*" -type f  # Emacs lock files
find /home -name "*.swp" -type f # Vim swap files
```

### Lsof for Open Files
```bash
# Find processes with deleted files still open
lsof +L1                        # Files with link count 0
lsof | grep "(deleted)"         # Deleted but open files

# Recover open deleted file
cp /proc/PID/fd/FD /recovery/recovered_file
```

## Database Recovery

### MySQL/MariaDB Recovery
```bash
# InnoDB recovery
mysqld --innodb-force-recovery=1    # Conservative recovery
mysqld --innodb-force-recovery=6    # Aggressive recovery

# MyISAM recovery
myisamchk --recover /var/lib/mysql/database/table.MYI
myisamchk --safe-recover /var/lib/mysql/database/table.MYI
```

### PostgreSQL Recovery
```bash
# PostgreSQL recovery
pg_resetwal /var/lib/postgresql/data    # Reset WAL
postgres --single -D /var/lib/postgresql/data database_name
```

## Forensic Recovery Tools

### Autopsy (Digital Forensics)
```bash
# Install Autopsy
sudo apt install autopsy

# Start Autopsy web interface
autopsy &
# Access via http://localhost:9999/autopsy
```

### Sleuth Kit
```bash
# Install Sleuth Kit
sudo apt install sleuthkit

# Analyze filesystem
fls /dev/sda1                   # List files and directories
icat /dev/sda1 inode_number     # Extract file by inode
ils /dev/sda1                   # List inodes
```

## Data Recovery Best Practices

### Prevention Strategies
```bash
# 1. Regular backups
rsync -avz /home/ /backup/home/
tar -czf backup.tar.gz /important/data/
rsnapshot hourly               # Automated snapshots

# 2. Filesystem snapshots
btrfs subvolume snapshot /home /home/.snapshots/$(date +%Y%m%d)
lvcreate -L 1G -s -n snap1 /dev/vg0/lv0  # LVM snapshot

# 3. RAID configuration
mdadm --create /dev/md0 --level=1 --raid-devices=2 /dev/sda1 /dev/sdb1

# 4. File system monitoring
smartctl -a /dev/sda           # Monitor disk health
```

### Recovery Environment Setup
```bash
# Create recovery USB
dd if=ubuntu-live.iso of=/dev/sdX bs=4M status=progress

# Essential recovery tools on live system
sudo apt update
sudo apt install testdisk gddrescue extundelete foremost scalpel
```

## Specialized Recovery Scenarios

### SSD Recovery Considerations
```bash
# SSD-specific challenges:
# - TRIM command may permanently delete data
# - Wear leveling complicates recovery
# - Controller encryption

# Disable TRIM temporarily
echo noop > /sys/block/sda/queue/scheduler
# Check TRIM support
lsblk -D
```

### Encrypted Filesystem Recovery
```bash
# LUKS recovery
cryptsetup luksHeaderBackup /dev/sda1 --header-backup-file header.backup
cryptsetup luksHeaderRestore /dev/sda1 --header-backup-file header.backup

# Recovery with damaged header
cryptsetup repair /dev/sda1
```

### Virtual Machine Recovery
```bash
# VMDK recovery
qemu-img convert -f vmdk -O raw vm.vmdk recovered.img

# VDI recovery
VBoxManage clonehd vm.vdi recovered.vdi --format RAW
```

## Recovery Workflow Checklist

### Step-by-Step Recovery Process
```bash
# 1. Assessment
# - Stop using affected storage
# - Identify type of data loss
# - Check for existing backups

# 2. Preparation
# - Create disk image
# - Prepare recovery environment
# - Install necessary tools

# 3. Recovery attempt
# - Start with safest methods
# - Try filesystem-specific tools
# - Use file carving as last resort

# 4. Verification
# - Check recovered files
# - Verify file integrity
# - Test applications with recovered data

# 5. Prevention
# - Implement backup strategy
# - Monitor disk health
# - Document recovery procedures
```

### Recovery Success Rates
| Recovery Method | Success Rate | Data Integrity |
|-----------------|--------------|----------------|
| **Recent deletion** | 95% | High |
| **Filesystem corruption** | 70-90% | Medium-High |
| **Partition loss** | 60-80% | Medium |
| **Hardware failure** | 30-70% | Variable |
| **Overwritten data** | 10-30% | Low |

## Professional Recovery Options

### When to Seek Professional Help
```bash
# Physical damage signs:
# - Clicking or grinding sounds
# - Drive not recognized by BIOS
# - Burning smell
# - Visible damage

# Professional services provide:
# - Clean room facilities
# - Specialized hardware
# - Advanced techniques
# - Higher success rates for physical damage
```

Data recovery in Linux requires understanding both the tools available and the underlying filesystem structures. Quick action and proper technique selection significantly improve recovery success rates.
