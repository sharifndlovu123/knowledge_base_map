# 08. Swap Partitions and Swap Space

## What is Swap?
Swap is a space on a disk that is used when the amount of physical RAM memory is full. When a Linux system runs out of RAM, inactive pages are moved to the swap space, freeing up RAM for active processes. This allows the system to handle more applications than would fit in physical memory alone.

**How Swap Works:**
- **Paging Out**: Moving inactive memory pages from RAM to swap
- **Paging In**: Moving pages back from swap to RAM when needed
- **Virtual Memory**: Combination of RAM and swap creates virtual memory space
- **Memory Management**: Kernel manages which pages to swap based on usage patterns

**Types of Swap:**
- **Swap Partition**: Dedicated disk partition for swap
- **Swap File**: Regular file used as swap space
- **Compressed Swap**: RAM-based compressed swap (zswap, zram)

## Why Use Swap?

**Benefits:**
- **Memory Overcommit**: Run more applications than physical RAM allows
- **System Stability**: Prevents out-of-memory crashes
- **Hibernation Support**: Required for suspend-to-disk functionality
- **Memory Pressure Relief**: Handles temporary memory spikes
- **Performance Optimization**: Allows kernel to optimize memory usage

**Considerations:**
- **Performance Impact**: Swap is much slower than RAM
- **SSD Wear**: Frequent swapping can reduce SSD lifespan
- **Disk Space**: Takes up storage space that could be used for data
- **Not Always Necessary**: Systems with abundant RAM may not need swap

## Swap Sizing Guidelines

**Traditional Rules:**
- **2x RAM**: For systems with less than 2GB RAM
- **1x RAM**: For systems with 2-8GB RAM
- **0.5x RAM**: For systems with more than 8GB RAM

**Modern Recommendations:**
- **Desktop Systems**: 2-4GB swap (regardless of RAM size)
- **Servers**: Depends on workload, often minimal or none
- **Laptops**: Equal to RAM size if hibernation is needed
- **Virtual Machines**: Usually minimal swap space

**Hibernation Requirements:**
- Swap must be at least equal to RAM size
- Some recommend RAM + 10% for safety margin

## Creating and Managing Swap Partitions

### Creating Swap Partition
```bash
# Create partition using fdisk
sudo fdisk /dev/sdb
# Use 'n' to create new partition
# Use 't' to change type to 82 (Linux swap)
# Use 'w' to write changes

# Create partition using parted
sudo parted /dev/sdb mkpart primary linux-swap 1GB 5GB

# Format partition as swap
sudo mkswap /dev/sdb1

# Add label to swap partition
sudo mkswap -L "swap1" /dev/sdb1

# Enable swap partition
sudo swapon /dev/sdb1

# Make swap permanent (add to /etc/fstab)
echo '/dev/sdb1 none swap sw 0 0' | sudo tee -a /etc/fstab

# Or use UUID (recommended)
sudo blkid /dev/sdb1  # Get UUID
echo 'UUID=12345678-1234-1234-1234-123456789012 none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Creating Swap File
```bash
# Create swap file (4GB example)
sudo fallocate -l 4G /swapfile

# Alternative method using dd
sudo dd if=/dev/zero of=/swapfile bs=1M count=4096

# Set correct permissions
sudo chmod 600 /swapfile

# Make it a swap file
sudo mkswap /swapfile

# Enable swap file
sudo swapon /swapfile

# Make permanent in /etc/fstab
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify swap is active
sudo swapon --show
free -h
```

### Managing Existing Swap
```bash
# View current swap usage
free -h
cat /proc/swaps
sudo swapon --show

# View swap statistics
cat /proc/meminfo | grep -i swap

# Disable specific swap
sudo swapoff /dev/sdb1
sudo swapoff /swapfile

# Disable all swap
sudo swapoff -a

# Enable all swap from /etc/fstab
sudo swapon -a

# Check which processes are using swap
for file in /proc/*/status ; do awk '/VmSwap|Name/{printf $2 " " $3}END{ print ""}' $file; done | sort -k 2 -n

# Resize swap file
sudo swapoff /swapfile
sudo fallocate -l 8G /swapfile  # Resize to 8GB
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Advanced Swap Configuration

### Swap Priority
```bash
# Set swap priority (higher numbers = higher priority)
sudo swapon -p 10 /dev/sdb1

# Add priority to /etc/fstab
echo '/dev/sdb1 none swap sw,pri=10 0 0' | sudo tee -a /etc/fstab

# Multiple swap devices with different priorities
/dev/sdb1 none swap sw,pri=10 0 0
/dev/sdc1 none swap sw,pri=5 0 0
/swapfile none swap sw,pri=1 0 0
```

### Swappiness Configuration
```bash
# Check current swappiness value (0-100)
cat /proc/sys/vm/swappiness

# Temporarily change swappiness
sudo sysctl vm.swappiness=10

# Permanently change swappiness
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf

# Swappiness values:
# 0   = Avoid swapping as much as possible
# 1   = Minimum swappiness without disabling it entirely
# 10  = Recommended for desktop systems
# 60  = Default value
# 100 = Aggressive swapping
```

### Encrypted Swap
```bash
# Create encrypted swap partition
sudo cryptsetup luksFormat /dev/sdb1
sudo cryptsetup luksOpen /dev/sdb1 encrypted_swap
sudo mkswap /dev/mapper/encrypted_swap

# Add to /etc/fstab
echo '/dev/mapper/encrypted_swap none swap sw 0 0' | sudo tee -a /etc/fstab

# Configure automatic unlock in /etc/crypttab
echo 'encrypted_swap /dev/sdb1 none luks' | sudo tee -a /etc/crypttab

# Random key encrypted swap (recreated on each boot)
echo 'swap /dev/sdb1 /dev/urandom swap,cipher=aes-xts-plain64,size=256' | sudo tee -a /etc/crypttab
```

## Compressed Swap Solutions

### zram (Compressed RAM-based swap)
```bash
# Install zram tools
sudo apt install zram-config

# Manual zram setup
sudo modprobe zram num_devices=1

# Set compression algorithm
echo lz4 | sudo tee /sys/block/zram0/comp_algorithm

# Set zram size (compressed)
echo 2G | sudo tee /sys/block/zram0/disksize

# Initialize zram device
sudo mkswap /dev/zram0
sudo swapon /dev/zram0

# Check zram statistics
cat /sys/block/zram0/mm_stat
zramctl
```

### zswap (Compressed swap cache)
```bash
# Enable zswap at boot (add to kernel parameters)
# Edit /etc/default/grub
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash zswap.enabled=1"

# Update grub
sudo update-grub

# Check zswap status
cat /sys/module/zswap/parameters/enabled

# Configure zswap parameters
echo 20 | sudo tee /sys/module/zswap/parameters/max_pool_percent
echo lz4 | sudo tee /sys/module/zswap/parameters/compressor
echo z3fold | sudo tee /sys/module/zswap/parameters/zpool
```

## Monitoring and Troubleshooting Swap

### Monitoring Swap Usage
```bash
# Real-time swap monitoring
watch -n 1 'free -h && echo "---" && cat /proc/swaps'

# Detailed memory information
cat /proc/meminfo

# Process-specific swap usage
for pid in $(ps -eo pid --no-headers); do
    if [ -r /proc/$pid/smaps ]; then
        swap=$(awk '/^Swap:/ { sum += $2 } END { print sum }' /proc/$pid/smaps 2>/dev/null)
        if [ "$swap" -gt 0 ]; then
            comm=$(cat /proc/$pid/comm 2>/dev/null)
            printf "%s\t%d\t%s\n" "$pid" "$swap" "$comm"
        fi
    fi
done | sort -k2 -n

# Using smem for swap analysis
sudo apt install smem
sudo smem -s swap
```

### Performance Analysis
```bash
# Monitor swap I/O
iostat -x 1 | grep -E "(Device|sda|sdb|dm-)"

# Check swap performance with iotop
sudo iotop -o

# Swap activity monitoring
vmstat 1

# Page fault statistics
sar -B 1

# Memory pressure indicators
dmesg | grep -i "killed process"  # OOM killer activity
```

### Troubleshooting Common Issues
```bash
# Cannot create swap - check partition type
sudo fdisk -l /dev/sdb
# Ensure partition type is 82 (Linux swap)

# Swap not mounting at boot
sudo mount -a  # Test fstab entries
systemctl status systemd-remount-fs.service

# High swap usage investigation
# 1. Check swappiness setting
cat /proc/sys/vm/swappiness

# 2. Identify memory-hungry processes
ps aux --sort=-%mem | head -10

# 3. Check for memory leaks
valgrind --tool=memcheck --leak-check=full program_name

# Force clear swap (move everything back to RAM)
sudo swapoff -a && sudo swapon -a
```

## Swap Best Practices

### Desktop Systems
```bash
# Recommended configuration for desktop
vm.swappiness=10                    # Low swappiness
vm.vfs_cache_pressure=50           # Balanced cache pressure
vm.dirty_background_ratio=5        # Start background writeback early
vm.dirty_ratio=10                  # Force synchronous writeback

# Add to /etc/sysctl.conf
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
```

### Server Systems
```bash
# Server configuration (minimal swap)
vm.swappiness=1                     # Almost no swapping
vm.overcommit_memory=2             # Don't overcommit memory
vm.overcommit_ratio=80             # Allow 80% overcommit

# For servers with large RAM, consider no swap
# except for emergency situations
```

### SSD Optimization
```bash
# Reduce swap usage on SSDs
vm.swappiness=1                     # Minimize swapping
vm.page-cluster=0                  # Reduce swap readahead

# Use zram instead of disk swap for SSDs
sudo apt install zram-config
```

## Swap File vs Swap Partition

| Feature | Swap Partition | Swap File |
|---------|----------------|-----------|
| **Performance** | Slightly better | Very close |
| **Flexibility** | Fixed size | Easy to resize |
| **Setup** | More complex | Simple |
| **Hibernation** | Full support | Requires special setup |
| **Fragmentation** | None | Possible |
| **Administration** | Partition tools | File operations |
| **Space efficiency** | Dedicated | Shares filesystem |

**When to use Swap Partition:**
- Hibernation is required
- Maximum performance is critical
- Dedicated swap disk available
- Traditional server environments

**When to use Swap File:**
- Flexibility in sizing needed
- Easy administration preferred
- Single disk systems
- Cloud/virtual environments
