# RAID (Redundant Array of Independent Disks)

## What is RAID?
RAID is a data storage virtualization technology that combines multiple physical disk drive components into one or more logical units for the purposes of data redundancy, performance improvement, or both. RAID distributes data across multiple drives using various techniques called "RAID levels."

**Key Benefits:**
- **Redundancy**: Protection against disk failures
- **Performance**: Improved read/write speeds
- **Capacity**: Combining multiple drives into larger storage pools
- **Availability**: System can continue operating even with drive failures

**RAID Types:**
- **Hardware RAID**: Managed by dedicated RAID controller cards
- **Software RAID**: Managed by the operating system
- **Hybrid RAID**: Combination of hardware and software approaches

## RAID 0 (Striping)

### How it Works
RAID 0 splits data evenly across two or more drives with no parity, redundancy, or fault tolerance. Data is written in "stripes" across all drives simultaneously.

**Configuration:**
- **Minimum drives**: 2
- **Capacity**: Sum of all drives (100% utilization)
- **Redundancy**: None - if any drive fails, all data is lost

### Characteristics
```
Drive 1: [A1] [A3] [A5] [A7]
Drive 2: [A2] [A4] [A6] [A8]
```

**Advantages:**
- Maximum performance improvement (both read and write)
- 100% storage efficiency - no space lost to redundancy
- Simple implementation
- Cost-effective for performance gains

**Disadvantages:**
- No fault tolerance - single drive failure destroys entire array
- Higher risk of data loss (failure rate multiplies with each added drive)
- Not suitable for critical data

**Best Use Cases:**
- Video editing and rendering
- Gaming systems
- Temporary high-performance storage
- Applications where performance matters more than data safety

## RAID 1 (Mirroring)

### How it Works
RAID 1 creates an exact copy (mirror) of data on two or more drives. Every write operation is performed on all drives simultaneously, maintaining identical copies.

**Configuration:**
- **Minimum drives**: 2
- **Capacity**: 50% of total drive space (half used for mirroring)
- **Redundancy**: Can survive failure of all but one drive

### Characteristics
```
Drive 1: [A] [B] [C] [D]
Drive 2: [A] [B] [C] [D] (exact copy)
```

**Advantages:**
- Excellent fault tolerance - can lose multiple drives (as long as one remains)
- Fast read performance (can read from multiple drives)
- Simple recovery - remaining drive contains complete data
- No complex calculations needed

**Disadvantages:**
- 50% storage efficiency - half the space is "wasted" on redundancy
- Write performance can be slightly slower
- More expensive per usable gigabyte

**Best Use Cases:**
- Critical system drives (OS, databases)
- Important documents and files
- Servers requiring high availability
- Boot drives for servers

## RAID 5 (Distributed Parity)

### How it Works
RAID 5 uses block-level striping with distributed parity across all drives. Parity information is spread across all drives, allowing the array to continue operating with one drive failure.

**Configuration:**
- **Minimum drives**: 3
- **Capacity**: (N-1) × drive size (one drive's worth of space used for parity)
- **Redundancy**: Can survive failure of exactly one drive

### Characteristics
```
Drive 1: [A1] [B2] [C3] [Dp]
Drive 2: [A2] [Bp] [C1] [D3]
Drive 3: [Ap] [B1] [C2] [D1]
```
*(p = parity data)*

**Advantages:**
- Good balance of performance, storage efficiency, and redundancy
- Better storage efficiency than RAID 1 (typically 67-80% depending on drive count)
- Can reconstruct data from any single drive failure
- Good read performance

**Disadvantages:**
- Poor write performance due to parity calculations
- Complex rebuild process - system vulnerable during rebuild
- Cannot survive multiple simultaneous drive failures
- "Write hole" vulnerability during unexpected power loss

**Best Use Cases:**
- File servers
- General-purpose storage with moderate reliability needs
- Backup systems
- Applications requiring balanced performance and redundancy

## RAID Comparison Summary

| RAID Level | Min Drives | Capacity | Fault Tolerance | Read Performance | Write Performance | Cost |
|------------|------------|----------|-----------------|------------------|-------------------|------|
| RAID 0     | 2          | 100%     | None            | Excellent        | Excellent         | Low  |
| RAID 1     | 2          | 50%      | High            | Good             | Fair              | High |
| RAID 5     | 3          | 67-89%   | Moderate        | Good             | Poor              | Medium |

## Hardware RAID vs Software RAID

### Hardware RAID

**What is Hardware RAID?**
Hardware RAID uses a dedicated RAID controller card or chipset to manage the RAID array. The controller has its own processor, memory, and sometimes battery backup to handle all RAID operations independently of the host system's CPU.

**Components:**
- **RAID Controller Card**: PCIe card with dedicated processor and RAM
- **Onboard RAID**: Built into motherboard chipset (Intel RST, AMD RAIDXpert)
- **Battery Backup Unit (BBU)**: Protects write cache during power outages
- **Write Cache**: High-speed memory for improved write performance

**Advantages:**
- **Superior Performance**: Dedicated processor handles all RAID calculations
- **CPU Offloading**: No impact on system CPU resources
- **Advanced Features**: Write-back caching, battery backup, hot-swap support
- **Boot Support**: Can boot from RAID arrays without OS support
- **Management Tools**: Sophisticated monitoring and configuration utilities
- **Consistency**: Works across different operating systems
- **Better Write Performance**: Especially for RAID 5/6 due to hardware XOR calculations

**Disadvantages:**
- **Higher Cost**: Controller cards range from $100-$1000+
- **Vendor Lock-in**: Arrays tied to specific controller models
- **Single Point of Failure**: Controller failure can make entire array inaccessible
- **Complexity**: More complex setup and troubleshooting
- **Driver Dependencies**: Requires proper drivers for OS support

**Popular Hardware RAID Controllers:**
- LSI MegaRAID (now Broadcom)
- Adaptec (Microsemi)
- Intel RAID controllers
- HP Smart Array
- Dell PERC controllers

### Software RAID

**What is Software RAID?**
Software RAID is implemented entirely in software, using the operating system's drivers and the main system CPU to manage RAID operations. No dedicated hardware is required beyond the disk drives.

**Implementation Methods:**
- **Linux mdadm**: Native Linux software RAID
- **Windows Storage Spaces**: Microsoft's software RAID solution
- **ZFS RAID**: Part of the ZFS filesystem
- **Btrfs RAID**: Built into Btrfs filesystem

**Advantages:**
- **Cost Effective**: No additional hardware required
- **Flexibility**: Not tied to specific hardware
- **Portability**: Arrays can move between systems easily
- **Open Source**: Transparent implementation, community support
- **No Vendor Lock-in**: Uses standard disk interfaces
- **Advanced Features**: Modern implementations offer sophisticated features
- **Easy Replacement**: Any compatible system can take over the array

**Disadvantages:**
- **CPU Overhead**: Uses system CPU for RAID calculations
- **OS Dependency**: Requires OS support to access arrays
- **Boot Limitations**: Complex setup for boot drives
- **Performance Impact**: Can affect overall system performance
- **Memory Usage**: Uses system RAM for caching operations

### Hardware vs Software RAID Comparison

| Feature | Hardware RAID | Software RAID |
|---------|---------------|---------------|
| **Cost** | High ($100-1000+) | Low (free) |
| **Performance** | Superior | Good (depends on CPU) |
| **CPU Usage** | None | Moderate |
| **Flexibility** | Limited | High |
| **Vendor Lock-in** | Yes | No |
| **Boot Support** | Excellent | Limited |
| **Management** | Advanced GUIs | Command-line tools |
| **Portability** | Poor | Excellent |
| **Reliability** | High | High |
| **Feature Set** | Rich | Varies |

### When to Choose Hardware RAID
- **High-performance servers** requiring maximum throughput
- **Database servers** with intensive I/O operations
- **Enterprise environments** with budget for dedicated hardware
- **Systems requiring hot-swap** drive replacement
- **Boot drive protection** with minimal OS complexity
- **24/7 operations** where CPU overhead matters

### When to Choose Software RAID
- **Budget-conscious** implementations
- **Home servers** and small business systems
- **Development and testing** environments
- **Systems requiring flexibility** and portability
- **Modern filesystems** like ZFS or Btrfs integration
- **Cloud environments** where hardware RAID isn't available

## Linux RAID Management

### Software RAID (mdadm)
```bash
# Install mdadm
sudo apt install mdadm

# Create RAID 0 array
sudo mdadm --create --verbose /dev/md0 --level=0 --raid-devices=2 /dev/sdb /dev/sdc

# Create RAID 1 array
sudo mdadm --create --verbose /dev/md0 --level=1 --raid-devices=2 /dev/sdb /dev/sdc

# Create RAID 5 array
sudo mdadm --create --verbose /dev/md0 --level=5 --raid-devices=3 /dev/sdb /dev/sdc /dev/sdd

# Check RAID status
cat /proc/mdstat
sudo mdadm --detail /dev/md0

# Monitor RAID array
sudo mdadm --monitor /dev/md0

# Stop RAID array
sudo mdadm --stop /dev/md0

# Remove RAID array
sudo mdadm --remove /dev/md0

# Add spare drive
sudo mdadm --add /dev/md0 /dev/sde

# Remove failed drive
sudo mdadm --fail /dev/md0 /dev/sdb
sudo mdadm --remove /dev/md0 /dev/sdb

# Save RAID configuration
sudo mdadm --detail --scan >> /etc/mdadm/mdadm.conf

# Assemble existing array
sudo mdadm --assemble /dev/md0 /dev/sdb /dev/sdc
```

### Hardware RAID Management
```bash
# Check for hardware RAID controllers
lspci | grep -i raid
lsmod | grep -i raid

# LSI MegaRAID (MegaCLI / storcli)
sudo megacli -AdpAllInfo -aAll                    # Controller info
sudo megacli -LDInfo -Lall -aAll                  # Logical drive info
sudo megacli -PDList -aAll                        # Physical drive list
sudo megacli -AdpBbuCmd -GetBbuStatus -aAll       # Battery status
sudo storcli /c0 show                             # Modern storcli tool

# HP Smart Array (hpacucli / ssacli)
sudo hpacucli ctrl all show config                # Show configuration
sudo hpacucli ctrl slot=0 show status             # Controller status
sudo hpacucli ctrl slot=0 logicaldrive all show   # Logical drives
sudo ssacli ctrl all show config                  # Newer ssacli tool

# Adaptec RAID (arcconf)
sudo arcconf getconfig 1                          # Show controller 1 config
sudo arcconf getlogs 1 events                     # Show event logs
sudo arcconf gettasks 1                           # Show background tasks

# Dell PERC (perccli)
sudo perccli /c0 show all                         # Show controller info
sudo perccli /c0/v0 show                          # Show virtual drive 0

# Intel RAID (intel-rst)
sudo mdadm --detail-platform                      # Show platform info
```

### Monitoring Hardware RAID
```bash
# Create monitoring script for LSI controllers
#!/bin/bash
megacli -AdpEventLog -GetEvents -f /var/log/megacli.log -aAll

# Monitor HP Smart Array
sudo hpacucli ctrl all show config | grep -i "status\|error"

# Set up SNMP monitoring (varies by controller)
# Check controller documentation for MIB files

# Use monitoring tools
sudo apt install nagios-plugins-basic
sudo /usr/lib/nagios/plugins/check_raid
```
