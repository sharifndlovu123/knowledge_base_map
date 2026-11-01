# 03. Performance Troubleshooting and Optimization

## CPU Performance Analysis

### CPU Monitoring and Diagnosis
```bash
# Real-time CPU monitoring
top                            # Classic process monitor
htop                           # Enhanced interactive monitor
atop                           # Advanced system monitor
btop                           # Modern resource monitor

# CPU utilization metrics
vmstat 1                       # Virtual memory statistics
iostat -c 1                    # CPU statistics only
sar -u 1 10                    # CPU utilization over time
mpstat 1                       # Multi-processor statistics

# Identify CPU-intensive processes
ps aux --sort=-%cpu | head -10 # Top CPU consumers
ps -eo pid,ppid,cmd,%mem,%cpu --sort=-%cpu | head
pidstat -u 1                   # Per-process CPU usage
```

### CPU Performance Issues
```bash
# Check CPU frequency and scaling
cat /proc/cpuinfo | grep MHz
cpufreq-info                   # CPU frequency information
cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Fix CPU performance governor
echo performance > /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
cpufreq-set -g performance     # Set performance governor

# Check CPU load average
uptime                         # Load averages
cat /proc/loadavg              # Load average file
sar -q 1 10                    # Queue length and load average

# Identify runaway processes
ps aux | awk '$3 > 50'         # Processes using >50% CPU
pkill -f process_name          # Kill problematic process
renice -10 -p PID              # Change process priority
```

### CPU Optimization
```bash
# Process priority management
nice -n 19 command             # Start with low priority
renice 10 -p PID               # Reduce process priority
ionice -c 3 -p PID             # Set idle I/O class

# CPU affinity settings
taskset -c 0,1 command         # Bind to specific CPUs
taskset -cp 0-3 PID            # Set CPU affinity for running process

# Kernel thread optimization
echo 0 > /proc/sys/kernel/watchdog  # Disable watchdog if not needed
```

## Memory Performance Analysis

### Memory Monitoring
```bash
# Memory usage overview
free -h                        # Human-readable memory info
cat /proc/meminfo              # Detailed memory information
vmstat 1                       # Memory statistics
sar -r 1 10                    # Memory utilization over time

# Per-process memory usage
ps aux --sort=-%mem | head -10 # Top memory consumers
pmap -x PID                    # Process memory mapping
smem -tk                       # Advanced memory reporting
pidstat -r 1                   # Per-process memory stats
```

### Memory Issues Diagnosis
```bash
# Check for memory leaks
valgrind --tool=memcheck --leak-check=full ./program
ps -o pid,vsz,rss,comm | sort -k 2 -n  # Sort by virtual memory

# Out of Memory (OOM) analysis
dmesg | grep -i "killed process"  # OOM killer messages
journalctl -k | grep -i oom      # OOM kernel messages
cat /proc/sys/vm/oom_score_adj   # OOM adjustment

# Swap usage analysis
swapon --show                  # Show swap devices
cat /proc/swaps                # Swap usage
sar -S 1 10                    # Swap statistics
```

### Memory Optimization
```bash
# Tune swappiness
echo 10 > /proc/sys/vm/swappiness     # Reduce swap usage
echo 'vm.swappiness=10' >> /etc/sysctl.conf  # Permanent setting

# Clear caches (emergency only)
sync                           # Flush file system buffers
echo 1 > /proc/sys/vm/drop_caches     # Clear page cache
echo 2 > /proc/sys/vm/drop_caches     # Clear dentries/inodes
echo 3 > /proc/sys/vm/drop_caches     # Clear all caches

# Memory optimization settings
echo 'vm.dirty_ratio=5' >> /etc/sysctl.conf
echo 'vm.dirty_background_ratio=2' >> /etc/sysctl.conf
sysctl -p                      # Apply settings

# Huge pages configuration
echo 1024 > /proc/sys/vm/nr_hugepages
mount -t hugetlbfs none /mnt/hugepages
```

## I/O Performance Analysis

### Disk I/O Monitoring
```bash
# I/O statistics
iostat -x 1                    # Extended I/O statistics
iotop                          # I/O usage by process
iotop -o                       # Only active I/O processes
atop -d                        # Disk statistics in atop

# Per-process I/O
pidstat -d 1                   # Per-process disk statistics
sar -d 1 10                    # Device utilization
cat /proc/diskstats            # Disk statistics

# Check I/O wait
vmstat 1                       # Look at 'wa' column
sar -u 1 10                    # CPU with I/O wait
```

### I/O Performance Issues
```bash
# Identify I/O bottlenecks
iostat -x 1 | grep -E "(Device|sd|nvme)"  # High utilization devices
lsof | grep deleted            # Deleted files still open
fuser -v /mount/point          # Processes using filesystem

# Check filesystem performance
hdparm -tT /dev/sda            # Disk read performance
dd if=/dev/zero of=testfile bs=1G count=1 oflag=direct  # Write test
sync; time sh -c "dd if=/dev/zero of=testfile bs=1M count=1024; sync"

# Disk health check
smartctl -a /dev/sda           # SMART attributes
badblocks -v /dev/sda          # Check for bad blocks
```

### I/O Optimization
```bash
# I/O scheduler optimization
echo deadline > /sys/block/sda/queue/scheduler    # For HDDs
echo noop > /sys/block/sda/queue/scheduler         # For SSDs
echo mq-deadline > /sys/block/nvme0n1/queue/scheduler  # For NVMe

# Filesystem mount options
mount -o noatime,nodiratime /dev/sda1 /mnt  # Disable access time updates
# Add to /etc/fstab: /dev/sda1 /mnt ext4 defaults,noatime,nodiratime 0 2

# Read-ahead optimization
blockdev --setra 4096 /dev/sda     # Set read-ahead to 2MB
echo 4096 > /sys/block/sda/queue/read_ahead_kb

# File system optimization
tune2fs -o journal_data_writeback /dev/sda1  # Faster journaling
```

## Network Performance Analysis

### Network Monitoring
```bash
# Network throughput monitoring
iftop                          # Interface bandwidth usage
nethogs                        # Network usage by process
vnstat                         # Network traffic statistics
ss -i                          # Socket information with metrics

# Network performance testing
iperf3 -s                      # Start iperf server
iperf3 -c server_ip            # Test throughput
ping -c 100 server_ip          # Latency testing
traceroute server_ip           # Route analysis
```

### Network Optimization
```bash
# TCP buffer tuning
echo 'net.core.rmem_max = 134217728' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 134217728' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_rmem = 4096 87380 134217728' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_wmem = 4096 65536 134217728' >> /etc/sysctl.conf

# Network queue optimization
echo 'net.core.netdev_max_backlog = 5000' >> /etc/sysctl.conf
echo 'net.ipv4.tcp_congestion_control = bbr' >> /etc/sysctl.conf
sysctl -p                      # Apply settings

# Interface optimization
ethtool -K eth0 tso on         # TCP segmentation offload
ethtool -K eth0 gso on         # Generic segmentation offload
```

## System-wide Performance Analysis

### Comprehensive Monitoring
```bash
# System performance overview
dstat                          # Versatile system stats
glances                        # Cross-platform monitoring
nmon                           # Performance monitoring tool
collectl                       # Comprehensive data collector

# Historical performance data
sar -A                         # All available statistics
sar -f /var/log/sysstat/saXX   # Historical data
```

### Performance Profiling
```bash
# CPU profiling with perf
perf record -g ./program       # Record with call graphs
perf report                    # Analyze recorded data
perf top                       # Real-time profiling

# System call tracing
strace -c ./program            # System call summary
strace -p PID                  # Trace running process
ltrace ./program               # Library call tracing
```

### Automated Performance Monitoring
```bash
#!/bin/bash
# Performance monitoring script

LOG_FILE="/var/log/performance-$(date +%Y%m%d).log"
ALERT_EMAIL="admin@example.com"

echo "Performance Check - $(date)" >> "$LOG_FILE"

# Check CPU load
LOAD=$(uptime | awk '{print $(NF-2)}' | sed 's/,//')
if (( $(echo "$LOAD > 5.0" | bc -l) )); then
    echo "High CPU load: $LOAD" >> "$LOG_FILE"
    echo "High system load detected: $LOAD" | \
    mail -s "Performance Alert: CPU Load" "$ALERT_EMAIL"
fi

# Check memory usage
MEM_USAGE=$(free | awk '/^Mem:/ {printf "%.1f", $3/$2 * 100}')
if (( $(echo "$MEM_USAGE > 90" | bc -l) )); then
    echo "High memory usage: ${MEM_USAGE}%" >> "$LOG_FILE"
    echo "High memory usage: ${MEM_USAGE}%" | \
    mail -s "Performance Alert: Memory" "$ALERT_EMAIL"
fi

# Check disk I/O wait
IO_WAIT=$(vmstat 1 2 | tail -1 | awk '{print $16}')
if [ "$IO_WAIT" -gt 20 ]; then
    echo "High I/O wait: ${IO_WAIT}%" >> "$LOG_FILE"
    echo "High I/O wait detected: ${IO_WAIT}%" | \
    mail -s "Performance Alert: I/O Wait" "$ALERT_EMAIL"
fi

# Top resource consumers
echo "Top CPU processes:" >> "$LOG_FILE"
ps aux --sort=-%cpu | head -5 >> "$LOG_FILE"
echo "Top Memory processes:" >> "$LOG_FILE"
ps aux --sort=-%mem | head -5 >> "$LOG_FILE"
```

### Performance Optimization Checklist
```bash
# Quick performance fixes
# 1. Update system packages
apt update && apt upgrade

# 2. Clean unnecessary files
apt autoremove
apt autoclean
journalctl --vacuum-time=7d

# 3. Optimize boot services
systemctl list-unit-files --type=service | grep enabled
systemctl disable unnecessary_service

# 4. Tune kernel parameters
echo 'kernel.sched_migration_cost_ns = 5000000' >> /etc/sysctl.conf
echo 'kernel.sched_autogroup_enabled = 0' >> /etc/sysctl.conf

# 5. Enable performance governor
echo performance | tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# 6. Optimize storage
fstrim -v /                    # SSD trim
tune2fs -o journal_data_writeback /dev/sda1
```

This performance troubleshooting guide provides comprehensive tools and techniques for analyzing and optimizing CPU, memory, I/O, and network performance, enabling identification of bottlenecks and implementation of targeted optimizations.