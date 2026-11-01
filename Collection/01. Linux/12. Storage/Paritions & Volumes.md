# 05. Partitions and Volumes

## What are Partitions?
A partition is a logical division of a physical disk drive that creates separate sections, each appearing to the operating system as a distinct storage device. Partitions allow you to organize data, install multiple operating systems, or separate system files from user data.

**Key Concepts:**
- **Physical Drive**: The actual hardware storage device (HDD, SSD)
- **Partition**: A logical section of the physical drive
- **File System**: The method used to organize and store files within a partition
- **Mount Point**: The directory where a partition is made accessible in Linux

**Types of Partitions:**
- **Primary Partition**: Main partitions that can contain an operating system
- **Extended Partition**: Container that can hold multiple logical partitions
- **Logical Partition**: Partitions created within an extended partition

## What are Volumes?
A volume is a storage area with a single file system that can span one or more partitions or physical drives. Volumes provide a more flexible approach to storage management compared to traditional partitions.

**Volume Types:**
- **Simple Volume**: Uses space from a single disk
- **Spanned Volume**: Combines space from multiple disks
- **Striped Volume**: Similar to RAID 0, data striped across multiple disks
- **Mirrored Volume**: Similar to RAID 1, data duplicated across disks
- **RAID-5 Volume**: Distributed parity across multiple disks

**Volume Management Systems:**
- **LVM (Logical Volume Manager)**: Linux volume management
- **Windows Dynamic Disks**: Microsoft's volume management
- **ZFS**: Advanced filesystem with built-in volume management
- **Btrfs**: Linux filesystem with integrated volume features

## Partition Tables

### GPT (GUID Partition Table)

**Overview:**
GPT is a modern partitioning standard that's part of the UEFI specification, replacing the older MBR system. It uses Globally Unique Identifiers (GUIDs) to identify partition types and individual partitions.

**Key Features:**
- **Disk Size Support**: Up to 9.4 ZB (zettabytes) - virtually unlimited
- **Partition Count**: Up to 128 partitions (can be extended)
- **Reliability**: Redundant partition tables with CRC32 checksums
- **Compatibility**: Works with UEFI and legacy BIOS (with hybrid mode)
- **No Primary/Extended Limitation**: All partitions are equivalent

**Advantages:**
- Much larger disk and partition size limits
- Better data integrity with checksums
- Backup partition table for recovery
- More flexible partition management
- Required for UEFI boot on disks >2TB

**Structure:**
```
[Protective MBR][GPT Header][Partition Array][Partitions...][Backup Partition Array][Backup GPT Header]
```

### MBR (Master Boot Record)

**Overview:**
MBR is the traditional partitioning scheme used since the early days of PC computing. It stores partition information in the first 512 bytes of the disk.

**Key Features:**
- **Disk Size Limit**: 2TB maximum
- **Partition Limit**: 4 primary partitions (or 3 primary + 1 extended)
- **Boot Code**: Contains bootloader code in first 446 bytes
- **Compatibility**: Works with all BIOS systems

**Limitations:**
- 2TB disk size limitation
- Only 4 primary partitions without extended partitions
- No redundancy - single point of failure
- Limited metadata and error detection

**Structure:**
```
[Boot Code (446 bytes)][Partition Table (64 bytes)][Boot Signature (2 bytes)]
```

### Other Partition Schemes

**APM (Apple Partition Map)**
- Used by older Apple Macintosh computers
- Supports up to 62 partitions
- Variable-sized partition entries
- Largely replaced by GPT on modern Macs

**BSD Disklabel**
- Used by BSD Unix systems (FreeBSD, OpenBSD, NetBSD)
- Supports up to 16 partitions (a-p)
- Integrated with BSD filesystem organization
- Can coexist with MBR as a sub-partitioning scheme

**Sun VTOC (Volume Table of Contents)**
- Used by Sun Solaris systems on SPARC hardware
- Supports up to 8 partitions
- Integrated with Solaris disk management
- Being replaced by EFI/GPT on modern systems

**SGI Volume Header**
- Used by Silicon Graphics IRIX systems
- Custom partition scheme for SGI workstations
- Supports boot partitions and volume directories
- Largely obsolete with IRIX end-of-life

**Amiga RDB (Rigid Disk Block)**
- Used by Commodore Amiga computers
- Flexible partition sizes and locations
- Supports custom filesystems
- Historical significance in personal computing

### **Logical Volume Management (LVM)**

LVM is a storage management system for Linux that provides a flexible layer of abstraction between physical storage devices and the file systems that use them.

**Key Components:**
- **Physical Volumes (PV)** - Raw storage devices like hard drives or partitions
- **Volume Groups (VG)** - Collections of physical volumes pooled together
- **Logical Volumes (LV)** - Virtual partitions carved out of volume groups

**How it Works:**
Instead of creating partitions directly on disk drives, you create physical volumes from your drives, group them into volume groups, and then create logical volumes from that pooled storage. Think of it like having multiple hard drives that you combine into one big storage pool, then slice up as needed.

**Main Benefits:**
- **Dynamic resizing** - Grow or shrink volumes without unmounting
- **Snapshots** - Create point-in-time copies for backups
- **Spanning** - Logical volumes can span multiple physical drives
- **Striping** - Improve performance by spreading data across drives
- **Easy migration** - Move data between drives without downtime

**Example Structure:**
```
/dev/sda1 (PV) ─┐
                ├─ Volume Group "system" ─┬─ LV "root" (mounted as /)
/dev/sdb1 (PV) ─┘                        └─ LV "home" (mounted as /home)
```

LVM is particularly useful for servers where storage needs change over time, as it eliminates many of the constraints of traditional fixed partitioning schemes.
## Linux Partition and Volume Management

### Viewing Partitions and Disks
```bash
# List all block devices
lsblk

# Show partition table information
sudo fdisk -l
sudo parted -l

# Display detailed disk information
sudo lshw -class disk
sudo hdparm -I /dev/sda

# Show disk usage by filesystem
df -h

# Show partition UUIDs and labels
sudo blkid
```

### Creating and Managing Partitions

**Using fdisk (MBR and GPT):**
```bash
# Open fdisk for a disk
sudo fdisk /dev/sdb

# Common fdisk commands:
# p - print partition table
# n - create new partition
# d - delete partition
# t - change partition type
# w - write changes and exit
# q - quit without saving

# Create GPT partition table
sudo fdisk /dev/sdb
# Then use 'g' command to create GPT table
```

**Using parted (Advanced partitioning):**
```bash
# Interactive mode
sudo parted /dev/sdb

# Non-interactive commands
sudo parted /dev/sdb mklabel gpt                           # Create GPT table
sudo parted /dev/sdb mkpart primary ext4 0% 50%           # Create partition
sudo parted /dev/sdb mkpart primary ext4 50% 100%         # Create second partition
sudo parted /dev/sdb print                                # Show partition table
```

**Using gdisk (GPT-specific):**
```bash
# GPT-focused partitioning tool
sudo gdisk /dev/sdb

# Commands similar to fdisk but GPT-optimized
# p - print partition table
# n - new partition
# d - delete partition
# w - write and exit
```

### LVM (Logical Volume Manager)
```bash
# Install LVM tools
sudo apt install lvm2

# Create physical volume
sudo pvcreate /dev/sdb1

# Create volume group
sudo vgcreate myvg /dev/sdb1

# Create logical volume
sudo lvcreate -L 10G -n mylv myvg

# Extend volume group
sudo vgextend myvg /dev/sdc1

# Extend logical volume
sudo lvextend -L +5G /dev/myvg/mylv
sudo resize2fs /dev/myvg/mylv

# View LVM information
sudo pvdisplay    # Physical volumes
sudo vgdisplay    # Volume groups
sudo lvdisplay    # Logical volumes

# Remove logical volume
sudo umount /dev/myvg/mylv
sudo lvremove /dev/myvg/mylv
```

### Formatting and Mounting
```bash
# Format partitions with different filesystems
sudo mkfs.ext4 /dev/sdb1
sudo mkfs.xfs /dev/sdb2
sudo mkfs.ntfs /dev/sdb3
sudo mkfs.btrfs /dev/sdb4
sudo mkfs.fat32 /dev/sdb5

# Format with specific options
sudo mkfs.ext4 -L "DataDrive" -b 4096 -E stride=32,stripe-width=64 /dev/sdb1
sudo mkfs.xfs -L "FastStorage" -b size=4096 -d agcount=4 /dev/sdb2
sudo mkfs.btrfs -L "FlexibleStorage" -d single -m dup /dev/sdb4

# Format with journal on external device (ext4)
sudo mkfs.ext4 -J device=/dev/sdc1 /dev/sdb1

# Format with specific cluster size (NTFS)
sudo mkfs.ntfs -C 4096 -L "WindowsData" /dev/sdb3

# Format with encryption support
sudo cryptsetup luksFormat /dev/sdb1
sudo cryptsetup luksOpen /dev/sdb1 encrypted_drive
sudo mkfs.ext4 /dev/mapper/encrypted_drive

# Create mount points
sudo mkdir /mnt/data1 /mnt/data2 /mnt/backup
sudo mkdir -p /media/usb/{drive1,drive2}
sudo mkdir -p /srv/{web,ftp,nfs}

# Create mount points with proper permissions
sudo mkdir /mnt/shared
sudo chmod 755 /mnt/shared
sudo chown user:group /mnt/shared

# Standard Linux mount point locations
# /mnt/          - Temporary mount points
# /media/        - Removable media (USB, CD/DVD)
# /srv/          - Service data
# /opt/          - Optional software
# /home/user/    - User-specific mount points


# Basic mounting
sudo mount /dev/sdb1 /mnt/data1
sudo mount /dev/sdb2 /mnt/data2

# Mount with specific filesystem type
sudo mount -t ext4 /dev/sdb1 /mnt/data1
sudo mount -t ntfs-3g /dev/sdb3 /mnt/windows

# Mount with options
sudo mount -o ro /dev/sdb1 /mnt/readonly        # Read-only
sudo mount -o rw,noatime /dev/sdb1 /mnt/data1   # Read-write, no access time updates

# Mount by UUID (recommended)
sudo mount UUID=12345678-1234-1234-1234-123456789012 /mnt/data1

# Mount by label
sudo mount LABEL=DataDrive /mnt/data1

# Basic unmounting
sudo umount /mnt/data1
sudo umount /dev/sdb1

# Force unmount (if device is busy)
sudo umount -f /mnt/data1

# Lazy unmount (detach when not busy)
sudo umount -l /mnt/data1

# Basic remounting
sudo mount -o remount,ro /mnt/data1     # Change to read-only
sudo mount -o remount,rw /mnt/data1     # Change to read-write

# Make mounts permanent in /etc/fstab
echo '/dev/sdb1 /mnt/data1 ext4 defaults 0 2' | sudo tee -a /etc/fstab

# Mount by UUID (recommended for fstab)
echo 'UUID=12345678-1234-1234-1234-123456789012 /mnt/data1 ext4 defaults 0 2' | sudo tee -a /etc/fstab

# Remount all fstab entries
sudo mount -a

# Check mounted filesystems
df -h
mount | grep /mnt
```

### Partition and Volume Monitoring
```bash
# Check filesystem integrity
sudo fsck /dev/sdb1
sudo fsck.ext4 /dev/sdb1

# Monitor disk I/O
iostat -x 1
iotop

# Check disk health
sudo smartctl -a /dev/sda
sudo badblocks -v /dev/sdb1

# View partition alignment
sudo parted /dev/sdb align-check optimal 1

# Check LVM health
sudo lvs -a -o +devices
sudo vgs -o +vg_free_count,vg_extent_count
```

### Advanced Volume Operations
```bash
# Create encrypted volume
sudo cryptsetup luksFormat /dev/sdb1
sudo cryptsetup luksOpen /dev/sdb1 encrypted_volume
sudo mkfs.ext4 /dev/mapper/encrypted_volume

# Create snapshot (LVM)
sudo lvcreate -L 1G -s -n snapshot_mylv /dev/myvg/mylv

# Resize operations
sudo resize2fs /dev/sdb1                    # Resize ext4 filesystem
sudo xfs_growfs /mount/point                # Resize XFS filesystem
sudo ntfsresize /dev/sdb1                   # Resize NTFS filesystem
```
