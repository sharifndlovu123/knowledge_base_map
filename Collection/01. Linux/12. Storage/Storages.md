# 07. Block and Object Storage

## Block Storage
Block storage divides data into fixed-size blocks, each with a unique identifier. The operating system treats block storage as raw, unformatted storage that can be mounted and formatted with any file system.

**Characteristics:**
- Low-latency, high IOPS performance
- Direct access to storage blocks
- Ideal for databases, file systems, and boot volumes
- Can be mounted as drives to servers
- Supports various file systems (ext4, NTFS, etc.)

**Examples:**
- Amazon EBS (Elastic Block Store)
- Azure Disk Storage
- Google Persistent Disks
- Physical hard drives, SSDs

## Object Storage
Object storage manages data as objects within containers (buckets). Each object contains the data, metadata, and a unique identifier. Data is accessed via REST APIs rather than traditional file system operations.

**Characteristics:**
- Highly scalable and distributed
- Accessed via HTTP/HTTPS APIs
- Flat namespace structure
- Built-in redundancy and durability
- Ideal for unstructured data, backups, and web content
- Metadata-rich storage

**Examples:**
- Amazon S3
- Azure Blob Storage
- Google Cloud Storage
- MinIO (self-hosted)

## FUSE (Filesystem in Userspace)
FUSE allows non-privileged users to create their own file systems without editing kernel code. It provides a bridge between user-space programs and the kernel's VFS (Virtual File System) interface.

**How FUSE Works:**
- Runs filesystem code in user space rather than kernel space
- Uses a kernel module to communicate between user-space filesystem and kernel
- Allows mounting of various storage types as regular filesystems
- Provides standard file operations (read, write, open, etc.)

**Common FUSE-based Filesystems:**
- s3fs - Mount S3 buckets as filesystems
- sshfs - Mount remote directories over SSH
- encfs - Encrypted filesystem
- ntfs-3g - NTFS support for Linux
- curlftpfs - Mount FTP servers as filesystems

## Usage in Linux

### Block Storage in Linux

**Mounting Block Storage:**
```bash
# List available block devices
lsblk

# Check disk partitions
fdisk -l

# Create a partition on block device
sudo fdisk /dev/sdb

# Format with ext4 filesystem
sudo mkfs.ext4 /dev/sdb1

# Create mount point
sudo mkdir /mnt/myvolume

# Mount the block storage
sudo mount /dev/sdb1 /mnt/myvolume

# Make mount permanent (add to /etc/fstab)
echo '/dev/sdb1 /mnt/myvolume ext4 defaults 0 2' | sudo tee -a /etc/fstab

# Check mounted filesystems
df -h

# Unmount when done
sudo umount /mnt/myvolume
```