# File Systems

## What are File Systems?
A file system is a method and data structure that an operating system uses to control how data is stored, organized, and retrieved on storage devices. It defines how files are named, stored, and organized in directories, as well as metadata like permissions, timestamps, and file attributes.

**Key Functions:**
- **File Storage**: How data is written to and read from storage
- **Directory Structure**: Organizing files in hierarchical folders
- **Metadata Management**: File permissions, ownership, timestamps
- **Space Allocation**: Managing free and used disk space
- **Data Integrity**: Ensuring data consistency and preventing corruption

## ext4 (Fourth Extended File System)

**Overview:**
ext4 is the default file system for most Linux distributions, evolved from the earlier ext2 and ext3 file systems. It's mature, stable, and well-supported across all Linux systems.

**Key Features:**
- **Maximum File Size**: 16 TiB (terabytes)
- **Maximum File System Size**: 1 EiB (exabyte)
- **Journaling**: Metadata journaling for crash recovery
- **Extents**: Efficient storage of large files
- **Delayed Allocation**: Improved performance and reduced fragmentation
- **Backward Compatibility**: Can mount ext2/ext3 file systems

**Advantages:**
- Proven stability and reliability
- Excellent performance for general use
- Wide compatibility and support
- Fast file system checks (fsck)
- Good for most desktop and server applications

**Disadvantages:**
- No built-in snapshots
- Limited advanced features compared to newer file systems
- No built-in compression or deduplication
- Single-threaded fsck operations

**Best Use Cases:**
- General-purpose Linux systems
- Boot partitions
- Desktop and laptop systems
- Traditional server applications

## XFS (SGI's eXtensible File System)

**Overview:**
XFS is a high-performance 64-bit journaling file system originally developed by Silicon Graphics (SGI). It's designed for scalability and high performance, particularly with large files and file systems.

**Key Features:**
- **Maximum File Size**: 8 EiB
- **Maximum File System Size**: 8 EiB
- **Parallel I/O**: Multi-threaded operations
- **Advanced Allocation**: Extent-based allocation with allocation groups
- **Online Defragmentation**: Can defragment mounted file systems
- **Metadata Journaling**: Fast crash recovery

**Advantages:**
- Excellent performance with large files
- Superior scalability for enterprise workloads
- Parallel I/O operations
- Online resizing (growth only)
- Very fast directory operations

**Disadvantages:**
- Cannot shrink file systems (only grow)
- More complex than ext4
- Higher memory usage
- Less suitable for small file systems

**Best Use Cases:**
- Large file storage (video, databases)
- High-performance computing
- Enterprise storage systems
- Media servers and content delivery

## Btrfs (B-tree File System)

**Overview:**
Btrfs is a modern copy-on-write (CoW) file system for Linux that focuses on fault tolerance, repair, and easy administration. It aims to address the scalability problems of ext4 while adding advanced features.

**Key Features:**
- **Copy-on-Write**: Never overwrites data in place
- **Snapshots**: Instant, space-efficient snapshots
- **Subvolumes**: Mountable subtrees within a file system
- **Built-in RAID**: Software RAID 0, 1, 5, 6, 10
- **Compression**: Transparent compression (LZO, ZLIB, ZSTD)
- **Checksumming**: Data and metadata integrity checking
- **Online Resizing**: Both growing and shrinking

**Advantages:**
- Advanced snapshot capabilities
- Built-in RAID and volume management
- Self-healing with redundant copies
- Transparent compression
- Online deduplication
- Rolling back changes with snapshots

**Disadvantages:**
- Still considered "experimental" for some use cases
- RAID 5/6 implementation has known issues
- Higher CPU overhead due to features
- More complex administration

**Best Use Cases:**
- Desktop systems requiring snapshots
- Development environments
- Systems requiring easy backup/restore
- Storage with built-in redundancy needs

## ZFS (Zettabyte File System)

**Overview:**
ZFS is an advanced file system and volume manager originally developed by Sun Microsystems for Solaris. It's designed for maximum data integrity and includes features typically found in separate volume managers and RAID controllers.

**Key Features:**
- **128-bit Architecture**: Virtually unlimited capacity
- **End-to-End Checksumming**: Detects and corrects data corruption
- **Copy-on-Write**: Atomic transactions and snapshots
- **RAID-Z**: Software RAID with variable stripe width
- **Compression**: Multiple compression algorithms
- **Deduplication**: Block-level deduplication
- **ARC (Adaptive Replacement Cache)**: Intelligent caching

**Advantages:**
- Unmatched data integrity protection
- Excellent snapshot and cloning capabilities
- Built-in compression and deduplication
- Self-healing with redundant data
- No separate volume manager needed
- Enterprise-grade features

**Disadvantages:**
- High memory requirements (minimum 8GB recommended)
- Licensing issues on Linux (CDDL vs GPL)
- Complex administration
- Not included in Linux kernel (requires separate installation)

**Best Use Cases:**
- Enterprise storage systems
- Data centers requiring maximum integrity
- Backup and archival systems
- Virtualization environments
- High-value data storage

## Other Notable File Systems

**NTFS (New Technology File System)**
- Microsoft's file system for Windows
- Supports large files and advanced permissions
- Used for Windows boot drives and data storage

**FAT32 (File Allocation Table 32)**
- Legacy Microsoft file system
- Maximum file size: 4GB
- Widely compatible across operating systems
- Common for USB drives and SD cards

**exFAT (Extended File Allocation Table)**
- Microsoft's replacement for FAT32
- No 4GB file size limit
- Good for external storage and cross-platform use

**APFS (Apple File System)**
- Apple's modern file system for macOS, iOS
- Copy-on-write with snapshots
- Optimized for SSD storage

**F2FS (Flash-Friendly File System)**
- Designed specifically for NAND flash storage
- Optimized for SSDs and eMMC storage
- Reduces write amplification

**ReiserFS**
- Early journaling file system for Linux
- Good performance with small files
- Largely superseded by ext4 and other modern file systems

## Creating File Systems

### ext4 File System
```bash
# Create ext4 file system
sudo mkfs.ext4 /dev/sdb1

# Create with custom options
sudo mkfs.ext4 -L "DataDrive" -b 4096 /dev/sdb1

# Create with journal on external device
sudo mkfs.ext4 -J device=/dev/sdc1 /dev/sdb1

# Create with specific inode count
sudo mkfs.ext4 -N 1000000 /dev/sdb1

# Check ext4 file system
sudo fsck.ext4 /dev/sdb1

# Tune ext4 parameters
sudo tune2fs -L "NewLabel" /dev/sdb1
sudo tune2fs -c 30 /dev/sdb1  # Set max mount count
```

### XFS File System
```bash
# Create XFS file system
sudo mkfs.xfs /dev/sdb1

# Create with custom options
sudo mkfs.xfs -L "DataDrive" -b size=4096 /dev/sdb1

# Create with specific allocation group size
sudo mkfs.xfs -d agcount=4 /dev/sdb1

# Force creation (overwrite existing)
sudo mkfs.xfs -f /dev/sdb1

# Check XFS file system
sudo xfs_repair /dev/sdb1

# Grow XFS file system (online)
sudo xfs_growfs /mount/point

# Get XFS information
sudo xfs_info /dev/sdb1
```

### Btrfs File System
```bash
# Create Btrfs file system
sudo mkfs.btrfs /dev/sdb1

# Create with label
sudo mkfs.btrfs -L "DataDrive" /dev/sdb1

# Create Btrfs RAID 1 (mirroring)
sudo mkfs.btrfs -d raid1 -m raid1 /dev/sdb1 /dev/sdc1

# Create Btrfs with compression
sudo mkfs.btrfs -O compress-force=zstd /dev/sdb1

# Create subvolume
sudo btrfs subvolume create /mnt/btrfs/subvol1

# Create snapshot
sudo btrfs subvolume snapshot /mnt/btrfs/subvol1 /mnt/btrfs/snapshot1

# Show Btrfs information
sudo btrfs filesystem show
sudo btrfs filesystem usage /mnt/btrfs

# Balance Btrfs file system
sudo btrfs balance start /mnt/btrfs
```

### ZFS File System
```bash
# Install ZFS (Ubuntu/Debian)
sudo apt install zfsutils-linux

# Create ZFS pool
sudo zpool create mypool /dev/sdb

# Create ZFS pool with mirror
sudo zpool create mypool mirror /dev/sdb /dev/sdc

# Create ZFS pool with RAID-Z
sudo zpool create mypool raidz /dev/sdb /dev/sdc /dev/sdd

# Create ZFS dataset
sudo zfs create mypool/dataset1

# Create ZFS dataset with compression
sudo zfs create -o compression=lz4 mypool/compressed

# Create ZFS snapshot
sudo zfs snapshot mypool/dataset1@snapshot1

# Clone ZFS snapshot
sudo zfs clone mypool/dataset1@snapshot1 mypool/clone1

# Set ZFS properties
sudo zfs set compression=gzip mypool/dataset1
sudo zfs set recordsize=1M mypool/dataset1

# Show ZFS status
sudo zpool status
sudo zfs list
sudo zfs get all mypool/dataset1

# Import/export pools
sudo zpool export mypool
sudo zpool import mypool
```

## File System Comparison

| Feature | ext4 | XFS | Btrfs | ZFS |
|---------|------|-----|-------|-----|
| **Snapshots** | No | No | Yes | Yes |
| **Compression** | No | No | Yes | Yes |
| **RAID** | No | No | Yes | Yes |
| **Checksumming** | No | No | Yes | Yes |
| **Online Resize** | Grow only | Grow only | Both | Both |
| **Deduplication** | No | No | Limited | Yes |
| **Maturity** | Very High | High | Medium | High |
| **Performance** | Good | Excellent | Good | Good |
| **Memory Usage** | Low | Medium | Medium | High |
