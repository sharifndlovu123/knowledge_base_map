# Linux Hardware Components and Device Utilities

## Overview

Linux provides extensive tools and utilities for hardware detection, monitoring, and management. Understanding these components and utilities is essential for system administration, troubleshooting, and performance optimization.

## System Information Utilities

### General System Information
```bash
# Complete system overview
neofetch                    # Stylized system info
screenfetch                 # Alternative system info display
inxi -Fxz                   # Comprehensive hardware info
hwinfo --short              # Hardware detection summary
lshw                        # List hardware (detailed)
lshw -short                 # Concise hardware list
dmidecode                   # DMI/SMBIOS information

# Kernel and OS information
uname -a                    # Kernel version and system info
hostnamectl                 # System hostname and OS info
cat /etc/os-release         # OS distribution info
cat /proc/version           # Kernel version details
cat /proc/cmdline           # Kernel boot parameters
```

### Hardware Detection and Enumeration
```bash
# PCI devices
lspci                       # List PCI devices
lspci -v                    # Verbose PCI information
lspci -nn                   # Show vendor/device IDs
lspci -t                    # Tree view of PCI devices
lspci -s 00:1f.2 -v        # Specific device details

# USB devices
lsusb                       # List USB devices
lsusb -v                    # Verbose USB information
lsusb -t                    # USB device tree
usb-devices                 # Detailed USB device list

# Block devices
lsblk                       # List block devices
lsblk -f                    # Show filesystem information
blkid                       # Block device attributes
fdisk -l                    # Partition tables
parted -l                   # Partition information

# Other device types
lscpu                       # CPU information
lsmem                       # Memory ranges
lsinitrd                    # Initial ramdisk contents
```

## CPU Information and Monitoring

### CPU Details
```bash
# CPU architecture and features
lscpu                       # Detailed CPU information
cat /proc/cpuinfo           # Raw CPU data
nproc                       # Number of processing units
getconf _NPROCESSORS_ONLN   # Online processors

# CPU capabilities
cat /proc/cpuinfo | grep flags    # CPU feature flags
lscpu | grep Flags                # Feature summary
```

### CPU Monitoring
```bash
# Real-time CPU usage
top                         # Process and CPU monitor
htop                        # Enhanced process viewer
btop                        # Modern resource monitor
atop                        # Advanced system monitor

# CPU statistics
iostat                      # CPU and I/O statistics
vmstat 1                    # Virtual memory statistics
sar -u 1 10                 # CPU utilization report
mpstat 1                    # Multi-processor statistics

# CPU frequency and scaling
cpufreq-info                # CPU frequency information
cat /proc/cpuinfo | grep MHz
cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq

# CPU temperature monitoring
sensors                     # Hardware sensors
cat /sys/class/thermal/thermal_zone*/temp
```

### CPU Performance Tools
```bash
# CPU stress testing
stress --cpu 4 --timeout 60s    # CPU stress test
stress-ng --cpu 4 --timeout 60s # Advanced stress testing
sysbench cpu --threads=4 run    # CPU benchmark

# CPU profiling
perf top                    # Real-time profiling
perf record -g ./program    # Record with call graphs
perf report                 # Analyze recorded data
```

## Memory Information and Management

### Memory Details
```bash
# Memory overview
free -h                     # Memory usage (human readable)
cat /proc/meminfo           # Detailed memory information
lsmem                       # Memory range information
dmidecode -t memory         # Physical memory details

# Memory mapping
cat /proc/*/maps            # Process memory maps
pmap -x PID                 # Process memory map
cat /proc/*/smaps           # Detailed memory mapping
```

### Memory Monitoring
```bash
# Memory usage monitoring
vmstat 1                    # Virtual memory statistics
sar -r 1 10                 # Memory utilization
cat /proc/slabinfo          # Kernel slab allocator info
cat /proc/buddyinfo         # Memory fragmentation info
cat /proc/pagetypeinfo      # Page type information

# Memory pressure indicators
cat /proc/pressure/memory   # Memory pressure (if enabled)
dmesg | grep -i "killed"    # OOM killer messages
cat /proc/sys/vm/swappiness # Swappiness setting
```

### Memory Testing
```bash
# Memory testing tools
memtest86+                  # Boot-time memory test
memtester 1G                # Runtime memory test
stress --vm 2 --vm-bytes 1G # Memory stress test
```

## Storage Devices and Management

### Storage Device Information
```bash
# Block devices
lsblk -f                    # Filesystem info
blkid                       # Block device UUIDs
fdisk -l                    # Partition tables
parted -l                   # Partition information
cat /proc/partitions        # Kernel partition table

# SCSI/SATA devices
lsscsi                      # SCSI devices
cat /proc/scsi/scsi         # SCSI device info
ls /sys/block/              # Block device sys entries

# NVMe devices
nvme list                   # NVMe device list
nvme id-ctrl /dev/nvme0     # Controller information
nvme smart-log /dev/nvme0   # SMART data
```

### Disk Usage and Monitoring
```bash
# Disk usage
df -h                       # Filesystem usage
du -sh /path/*              # Directory sizes
ncdu /                      # Interactive disk usage
duf                         # Modern df alternative

# Disk I/O monitoring
iostat -x 1                 # Extended I/O statistics
iotop                       # I/O usage by process
iotop -o                    # Only active processes
atop                        # Advanced system monitor
```

### Storage Performance Testing
```bash
# Disk performance testing
hdparm -tT /dev/sda         # Read performance test
dd if=/dev/zero of=testfile bs=1G count=1 oflag=direct
fio --name=random-write --ioengine=posixaio --rw=randwrite --bs=4k --size=4g --numjobs=1 --iodepth=1 --runtime=60 --time_based --end_fsync=1

# SMART monitoring
smartctl -a /dev/sda        # SMART attributes
smartctl -t short /dev/sda  # Short self-test
smartctl -H /dev/sda        # Health status
```

## Network Hardware

### Network Interface Information
```bash
# Network interfaces
ip link show                # Network interfaces
ip addr show                # IP addresses
ifconfig                    # Interface configuration (deprecated)
cat /proc/net/dev           # Network device statistics

# Ethernet information
ethtool eth0                # Interface details
ethtool -i eth0             # Driver information
ethtool -k eth0             # Feature flags
ethtool -S eth0             # Statistics
mii-tool eth0               # Media information (deprecated)
```

### Wireless Information
```bash
# Wireless interfaces
iwconfig                    # Wireless configuration
iw dev                      # Wireless devices
iw list                     # Wireless capabilities
rfkill list                 # Radio frequency kill switches

# Wireless monitoring
iwlist scan                 # Scan for networks
wavemon                     # Wireless monitor
cat /proc/net/wireless      # Wireless statistics
```

### Network Hardware Monitoring
```bash
# Network traffic monitoring
iftop                       # Interface traffic
nethogs                     # Process network usage
vnstat                      # Network statistics
ss -tuln                    # Socket statistics
netstat -i                  # Interface statistics

# Network performance testing
iperf3 -s                   # Server mode
iperf3 -c server_ip         # Client mode
speedtest-cli               # Internet speed test
```

## Graphics and Display

### Graphics Hardware Information
```bash
# Graphics cards
lspci | grep -i vga         # VGA controllers
lspci | grep -i 3d          # 3D controllers
glxinfo | grep -i vendor    # OpenGL information
xrandr                      # Display information
cat /proc/fb                # Framebuffer devices

# GPU-specific tools
nvidia-smi                  # NVIDIA GPU information
radeontop                   # AMD GPU monitoring
intel_gpu_top               # Intel GPU monitoring
```

### Display Configuration
```bash
# X11 display information
xdpyinfo                    # Display information
xwininfo                    # Window information
xvinfo                      # X-Video extension info
xrandr --listmonitors       # Connected monitors

# Wayland display information (if applicable)
wayland-info                # Wayland protocol info
swaymsg -t get_outputs      # Sway outputs (if using Sway)
```

## Audio Hardware

### Audio Device Information
```bash
# Audio devices
lspci | grep -i audio       # Audio controllers
cat /proc/asound/cards      # Sound cards
aplay -l                    # Playback devices
arecord -l                  # Capture devices
cat /proc/asound/devices    # Audio devices

# ALSA information
amixer                      # Audio mixer
alsamixer                   # Interactive mixer
alsactl store               # Store ALSA settings
```

### Audio Monitoring
```bash
# Audio system status
pulseaudio --check -v       # PulseAudio status
pactl info                  # PulseAudio information
pactl list sinks            # Audio outputs
pactl list sources          # Audio inputs

# Audio performance
cat /proc/asound/card*/pcm*/info    # PCM information
```

## Input Devices

### Input Device Information
```bash
# Input devices
cat /proc/bus/input/devices # Input device list
ls /dev/input/              # Input device files
xinput list                 # X11 input devices
evtest                      # Event testing tool

# Keyboard and mouse
setleds -caps               # Keyboard LED status
xset q                      # X11 settings
xinput list-props device_id # Device properties
```

## Sensor Monitoring

### Hardware Sensors
```bash
# Temperature and fan sensors
sensors                     # Hardware sensors
sensors-detect              # Sensor detection
cat /sys/class/thermal/thermal_zone*/temp
cat /sys/class/hwmon/hwmon*/temp*_input

# Fan control
pwmconfig                   # PWM configuration
fancontrol                  # Automatic fan control
```

### Advanced Monitoring
```bash
# Comprehensive monitoring
htop                        # Process and system monitor
glances                     # Cross-platform monitor
collectd                    # System statistics collection
munin-node                  # System monitoring (node)
```

## Device Management Utilities

### udev (Device Manager)
```bash
# udev information
udevadm info --query=all --name=/dev/sda
udevadm monitor             # Monitor udev events
udevadm test /sys/block/sda # Test udev rules
udevadm trigger             # Trigger udev events

# udev rules
cat /etc/udev/rules.d/*     # Custom udev rules
cat /lib/udev/rules.d/*     # System udev rules
```

### Device Files and Special Filesystems
```bash
# Device files
ls -la /dev/                # Device files
cat /proc/devices           # Character and block devices
cat /proc/misc              # Miscellaneous devices

# Special filesystems
mount | grep -E "(proc|sys|dev)"
ls /sys/class/              # Device classes
ls /sys/bus/                # Bus types
ls /sys/devices/            # Device hierarchy
```

## Power Management

### Power Information
```bash
# Battery information
cat /proc/acpi/battery/BAT0/info
upower -i $(upower -e | grep 'BAT')
acpi -b                     # Battery status
acpi -t                     # Temperature
acpi -a                     # AC adapter status

# Power management
cat /sys/power/state        # Available sleep states
cat /proc/acpi/wakeup       # Wake-up devices
powertop                    # Power consumption analyzer
```

### CPU Power Management
```bash
# CPU frequency scaling
cpufreq-info                # Frequency information
cpufreq-set -g performance  # Set governor
cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Power states
cat /proc/acpi/processor/CPU*/power    # C-states
turbostat                   # CPU power monitoring
```

## Hardware Diagnostic Tools

### System Health Monitoring
```bash
# Hardware health
lm-sensors                  # Hardware monitoring
hddtemp /dev/sda           # Hard drive temperature
smartctl -H /dev/sda       # SMART health
edac-util                  # Memory error detection

# System stability
memtest86+                 # Memory testing
stress-ng                  # System stress testing
badblocks /dev/sda         # Bad block detection
```

### Hardware Testing
```bash
# Comprehensive hardware testing
hardware-detect            # Debian hardware detection
discover                   # Hardware discovery
kudzu                      # Red Hat hardware probe (legacy)

# Performance benchmarking
sysbench                   # System benchmark suite
unixbench                  # Unix benchmark
hdparm                     # Hard disk benchmarking
```

## Hardware Configuration Files

### Important Configuration Locations
```bash
# Hardware configuration
/etc/modprobe.d/           # Module configuration
/etc/udev/rules.d/         # Device rules
/sys/                      # Hardware information
/proc/                     # Process and hardware info
/dev/                      # Device files

# Hardware databases
/usr/share/hwdata/         # Hardware databases
/lib/modules/$(uname -r)/  # Kernel modules
```

## Modern Hardware Management

### Firmware Management
```bash
# UEFI/BIOS information
dmidecode -t bios          # BIOS information
efibootmgr                 # EFI boot manager
fwupdmgr get-devices       # Firmware update manager
fwupdmgr refresh           # Refresh firmware database

# Hardware abstraction
lshw -json                 # JSON output
inxi -Fxz --output json    # JSON system info
```

### Container and Virtualization Hardware
```bash
# Virtualization detection
systemd-detect-virt        # Detect virtualization
virt-what                  # Virtualization detection
cat /proc/cpuinfo | grep hypervisor

# Container hardware access
ls /sys/fs/cgroup/         # Control groups
cat /proc/self/cgroup      # Process cgroup membership
```

## Hardware Troubleshooting Workflow

### Diagnostic Steps
```bash
# 1. System overview
inxi -Fxz
lshw -short
dmesg | grep -i error

# 2. Specific component analysis
lspci -v                   # PCI devices
lsusb -v                   # USB devices
lsblk -f                   # Storage
sensors                    # Temperatures

# 3. Performance monitoring
htop
iostat -x 1
vmstat 1

# 4. Hardware logs
dmesg | tail
journalctl -k | tail
cat /var/log/syslog | grep hardware
```

### Common Hardware Issues
```bash
# Driver issues
lsmod | grep driver_name   # Check if driver loaded
modinfo driver_name        # Driver information
dmesg | grep firmware      # Firmware loading issues

# Hardware failures
smartctl -a /dev/sda       # Disk health
memtest86+                 # Memory testing
sensors                    # Temperature issues
```

Linux provides comprehensive hardware detection and management capabilities through a rich ecosystem of utilities, from basic information gathering to advanced monitoring and diagnostics.
