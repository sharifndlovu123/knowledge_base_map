# 02. Linux Kernel Modules: Complete Guide

## Overview

Kernel modules are pieces of code that can be loaded and unloaded into the kernel upon demand. They extend the kernel's functionality without requiring a system reboot, providing drivers for hardware, filesystem support, system calls, and network protocols.

## Kernel Module Basics

### What are Kernel Modules?
- **Loadable code segments** that extend kernel functionality
- **Device drivers** for hardware components
- **Filesystem implementations** (ext4, btrfs, etc.)
- **Network protocols** and filters
- **System call implementations**
- **Security frameworks** (SELinux, AppArmor modules)

### Module vs Built-in
```bash
# Built-in: Compiled directly into kernel
# - Always available
# - Cannot be removed
# - Increases kernel size

# Modular: Loaded as needed
# - Loaded on demand
# - Can be unloaded
# - Reduces memory usage
# - Easier updates
```

## Working with Kernel Modules

### Listing Modules
```bash
# List all loaded modules
lsmod

# List with detailed information
lsmod | column -t

# Module information
modinfo module_name
modinfo e1000e

# Find module file location
modinfo -n module_name

# Show module dependencies
modinfo -F depends module_name

# List all available modules
find /lib/modules/$(uname -r) -name "*.ko" | head -20
```

### Loading and Unloading Modules
```bash
# Load a module
sudo modprobe module_name
sudo modprobe e1000e

# Load module with parameters
sudo modprobe module_name parameter=value
sudo modprobe snd-hda-intel model=auto

# Load module file directly (not recommended)
sudo insmod /path/to/module.ko

# Unload a module
sudo modprobe -r module_name
sudo rmmod module_name

# Force unload (dangerous)
sudo rmmod -f module_name
```

### Module Information and Dependencies
```bash
# Show module details
modinfo ext4
# Output includes:
# - filename: /lib/modules/5.15.0/kernel/fs/ext4/ext4.ko
# - description: Fourth Extended Filesystem
# - author: Remy Card, Stephen Tweedie, Andrew Morton, Andreas Dilger, Theodore Ts'o
# - license: GPL
# - depends: mbcache,jbd2
# - parm: max_dir_size_kb:Maximum size of directory in KB

# Check if module is loaded
lsmod | grep module_name

# Show module usage count
cat /proc/modules | grep module_name

# Show module dependencies tree
modprobe --show-depends module_name
```

## Module Configuration

### Automatic Module Loading
```bash
# Modules loaded at boot
/etc/modules
/etc/modules-load.d/*.conf

# Example: /etc/modules-load.d/custom.conf
loop
dm-crypt
nvidia

# Prevent module loading
/etc/modprobe.d/blacklist.conf

# Example blacklist entry
blacklist nouveau
blacklist pcspkr
install pcspkr /bin/true
```

### Module Parameters
```bash
# Set module parameters at load time
/etc/modprobe.d/custom.conf

# Examples:
options snd-hda-intel model=auto
options nouveau modeset=0
options kvm_intel nested=1
options zfs zfs_arc_max=8589934592

# View current parameters
systool -v -m module_name
cat /sys/module/module_name/parameters/*

# Runtime parameter modification (if supported)
echo value > /sys/module/module_name/parameters/parameter_name
```

### Module Aliases
```bash
# Create module aliases
/etc/modprobe.d/aliases.conf

# Example aliases
alias eth0 e1000e
alias sound-slot-0 snd-hda-intel
alias char-major-10-135 rtc
```

## Module Development

### Simple "Hello World" Module
```c
// hello.c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>

static int __init hello_init(void)
{
    printk(KERN_INFO "Hello, World! Module loaded.\n");
    return 0;
}

static void __exit hello_exit(void)
{
    printk(KERN_INFO "Goodbye, World! Module unloaded.\n");
}

module_init(hello_init);
module_exit(hello_exit);

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Your Name");
MODULE_DESCRIPTION("A simple Hello World module");
MODULE_VERSION("1.0");
```

### Makefile for Module Compilation
```makefile
# Makefile
obj-m += hello.o

KDIR = /lib/modules/$(shell uname -r)/build

all:
	make -C $(KDIR) M=$(PWD) modules

clean:
	make -C $(KDIR) M=$(PWD) clean

install:
	make -C $(KDIR) M=$(PWD) modules_install

.PHONY: all clean install
```

### Building and Installing Custom Module
```bash
# Install development tools
sudo apt install build-essential linux-headers-$(uname -r)  # Debian/Ubuntu
sudo yum groupinstall "Development Tools"                   # CentOS/RHEL
sudo yum install kernel-devel kernel-headers               # CentOS/RHEL

# Build module
make

# Load module
sudo insmod hello.ko

# Check module
lsmod | grep hello
dmesg | tail

# Unload module
sudo rmmod hello

# Install module system-wide
sudo make install
sudo depmod -a
```

## Advanced Module Programming

### Module with Parameters
```c
// param_module.c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/moduleparam.h>

static int debug_level = 1;
static char *device_name = "default";
static int port_array[4] = {1, 2, 3, 4};
static int port_count = 4;

module_param(debug_level, int, S_IRUGO | S_IWUSR);
MODULE_PARM_DESC(debug_level, "Debug level (default: 1)");

module_param(device_name, charp, S_IRUGO);
MODULE_PARM_DESC(device_name, "Device name");

module_param_array(port_array, int, &port_count, S_IRUGO);
MODULE_PARM_DESC(port_array, "Array of port numbers");

static int __init param_init(void)
{
    int i;
    printk(KERN_INFO "Debug level: %d\n", debug_level);
    printk(KERN_INFO "Device name: %s\n", device_name);
    printk(KERN_INFO "Port count: %d\n", port_count);
    
    for (i = 0; i < port_count; i++) {
        printk(KERN_INFO "Port[%d]: %d\n", i, port_array[i]);
    }
    
    return 0;
}

static void __exit param_exit(void)
{
    printk(KERN_INFO "Parameter module unloaded\n");
}

module_init(param_init);
module_exit(param_exit);

MODULE_LICENSE("GPL");
```

### Character Device Driver Example
```c
// char_dev.c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/device.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/uaccess.h>

#define DEVICE_NAME "mychardev"
#define CLASS_NAME "mychar"

MODULE_LICENSE("GPL");
MODULE_AUTHOR("Your Name");
MODULE_DESCRIPTION("A simple character device driver");
MODULE_VERSION("1.0");

static int major_number;
static char message[256] = {0};
static short message_size;
static int number_opens = 0;
static struct class* char_class = NULL;
static struct device* char_device = NULL;

// Function prototypes
static int dev_open(struct inode *, struct file *);
static int dev_release(struct inode *, struct file *);
static ssize_t dev_read(struct file *, char *, size_t, loff_t *);
static ssize_t dev_write(struct file *, const char *, size_t, loff_t *);

static struct file_operations fops = {
    .open = dev_open,
    .read = dev_read,
    .write = dev_write,
    .release = dev_release,
};

static int __init char_init(void)
{
    printk(KERN_INFO "MyCharDev: Initializing device\n");
    
    // Allocate major number
    major_number = register_chrdev(0, DEVICE_NAME, &fops);
    if (major_number < 0) {
        printk(KERN_ALERT "MyCharDev failed to register major number\n");
        return major_number;
    }
    
    // Register device class
    char_class = class_create(THIS_MODULE, CLASS_NAME);
    if (IS_ERR(char_class)) {
        unregister_chrdev(major_number, DEVICE_NAME);
        printk(KERN_ALERT "Failed to register device class\n");
        return PTR_ERR(char_class);
    }
    
    // Register device driver
    char_device = device_create(char_class, NULL, MKDEV(major_number, 0), NULL, DEVICE_NAME);
    if (IS_ERR(char_device)) {
        class_destroy(char_class);
        unregister_chrdev(major_number, DEVICE_NAME);
        printk(KERN_ALERT "Failed to create the device\n");
        return PTR_ERR(char_device);
    }
    
    printk(KERN_INFO "MyCharDev: device created correctly\n");
    return 0;
}

static void __exit char_exit(void)
{
    device_destroy(char_class, MKDEV(major_number, 0));
    class_unregister(char_class);
    class_destroy(char_class);
    unregister_chrdev(major_number, DEVICE_NAME);
    printk(KERN_INFO "MyCharDev: device unregistered\n");
}

static int dev_open(struct inode *inodep, struct file *filep)
{
    number_opens++;
    printk(KERN_INFO "MyCharDev: Device opened %d time(s)\n", number_opens);
    return 0;
}

static ssize_t dev_read(struct file *filep, char *buffer, size_t len, loff_t *offset)
{
    int error_count = 0;
    
    error_count = copy_to_user(buffer, message, message_size);
    
    if (error_count == 0) {
        printk(KERN_INFO "MyCharDev: Sent %d characters to user\n", message_size);
        return (message_size = 0);
    } else {
        printk(KERN_INFO "MyCharDev: Failed to send %d characters to user\n", error_count);
        return -EFAULT;
    }
}

static ssize_t dev_write(struct file *filep, const char *buffer, size_t len, loff_t *offset)
{
    sprintf(message, "%s(%zu letters)", buffer, len);
    message_size = strlen(message);
    printk(KERN_INFO "MyCharDev: Received %zu characters from user\n", len);
    return len;
}

static int dev_release(struct inode *inodep, struct file *filep)
{
    printk(KERN_INFO "MyCharDev: Device closed\n");
    return 0;
}

module_init(char_init);
module_exit(char_exit);
```

## Common Module Categories

### Network Modules
```bash
# Network interface drivers
e1000e          # Intel Ethernet
r8169           # Realtek Ethernet
iwlwifi         # Intel WiFi
ath9k           # Atheros WiFi

# Network protocols
tcp_bbr         # BBR congestion control
ip_tables       # Netfilter
nf_conntrack    # Connection tracking
bridge          # Bridge networking

# Load network module with parameters
modprobe e1000e InterruptThrottleRate=1,1,1,1
```

### Storage Modules
```bash
# Filesystem modules
ext4            # Fourth extended filesystem
btrfs           # B-tree filesystem
xfs             # XFS filesystem
ntfs            # NTFS support
fuse            # Filesystem in userspace

# Block device drivers
ahci            # SATA AHCI
nvme            # NVMe SSD
mpt3sas         # LSI SAS controller
megaraid_sas    # MegaRAID controller

# Load storage module
modprobe btrfs
```

### Hardware Drivers
```bash
# Graphics drivers
nvidia          # NVIDIA proprietary
nouveau         # NVIDIA open source
radeon          # AMD Radeon
i915            # Intel graphics

# Audio drivers
snd_hda_intel   # Intel HD Audio
snd_usb_audio   # USB audio
snd_ac97_codec  # AC97 codec

# USB drivers
usb_storage     # USB mass storage
usbhid          # USB HID devices
cdc_acm         # USB modem
```

## Module Signing and Security

### Module Signing
```bash
# Check if module signing is enabled
cat /proc/sys/kernel/modules_disabled
zcat /proc/config.gz | grep MODULE_SIG

# Generate signing key
openssl req -new -nodes -utf8 -sha256 -days 36500 -batch \
    -x509 -config x509.genkey -outform DER \
    -out signing_key.x509 -keyout signing_key.priv

# Sign module
/usr/src/linux/scripts/sign-file sha256 signing_key.priv signing_key.x509 module.ko

# Check module signature
modinfo module.ko | grep sig
```

### Secure Boot and Modules
```bash
# Check Secure Boot status
mokutil --sb-state

# Enroll signing key for Secure Boot
sudo mokutil --import signing_key.der

# Check enrolled keys
mokutil --list-enrolled
```

## Module Debugging and Troubleshooting

### Debugging Techniques
```bash
# Enable dynamic debugging
echo 'module module_name +p' > /sys/kernel/debug/dynamic_debug/control

# Check module dependencies
lsmod | grep module_name
modprobe --show-depends module_name

# View module symbols
cat /proc/kallsyms | grep module_name

# Check module information
modinfo module_name
systool -v -m module_name
```

### Common Issues and Solutions
```bash
# Module not found
# Solution: Install linux-headers package, check module name

# Module loading failed
dmesg | tail
journalctl -k | tail

# Dependency issues
depmod -a
modprobe --show-depends module_name

# Version mismatch
# Rebuild module for current kernel
uname -r
ls /lib/modules/
```

### Using ftrace for Module Debugging
```bash
# Enable function tracing
echo function > /sys/kernel/debug/tracing/current_tracer

# Filter by module
echo ':mod:module_name' > /sys/kernel/debug/tracing/set_ftrace_filter

# Start tracing
echo 1 > /sys/kernel/debug/tracing/tracing_on

# Load/test module, then view trace
cat /sys/kernel/debug/tracing/trace
```

## Performance and Memory Management

### Module Memory Usage
```bash
# Check module memory usage
cat /proc/modules
grep module_name /proc/*/maps

# Module memory layout
cat /sys/module/module_name/sections/.text
cat /sys/module/module_name/sections/.data
cat /sys/module/module_name/sections/.bss

# Memory debugging
echo 1 > /proc/sys/vm/drop_caches  # Clear cache before testing
```

### Performance Monitoring
```bash
# Monitor module performance
perf record -e cycles -a sleep 10
perf report

# Trace module function calls
trace-cmd record -p function_graph -g module_function
trace-cmd report

# Profile specific module
perf record -e cycles:k -a --call-graph dwarf
```

## Module Management Best Practices

### Development Best Practices
```c
// Always check return values
if (!ptr) {
    printk(KERN_ERR "Memory allocation failed\n");
    return -ENOMEM;
}

// Use proper cleanup in exit function
static void __exit cleanup_module(void) {
    // Cleanup in reverse order of initialization
    device_destroy(class, dev);
    class_destroy(class);
    unregister_chrdev(major, DEVICE_NAME);
}

// Use reference counting
struct kobject *kobj = kobject_get(obj);
// ... use object ...
kobject_put(kobj);
```

### Production Best Practices
```bash
# 1. Test modules thoroughly in development
# 2. Use signed modules in production
# 3. Monitor module loading/unloading
# 4. Keep modules up to date
# 5. Document module dependencies
# 6. Use proper error handling
# 7. Implement proper cleanup
# 8. Monitor system stability
```

## Advanced Module Topics

### Module Versioning
```bash
# Check module version magic
modinfo module_name | grep vermagic

# Force load module (dangerous)
modprobe --force module_name

# Module version dependencies
depmod -A
```

### Dynamic Module Loading
```bash
# Automatic hardware detection
udevadm info --export-db
udevadm test /sys/class/net/eth0

# Hotplug events
udevadm monitor --property

# Module autoloading rules
/etc/udev/rules.d/
```

### Out-of-Tree Modules
```bash
# DKMS (Dynamic Kernel Module Support)
sudo apt install dkms

# Add module to DKMS
sudo dkms add -m module_name -v 1.0

# Build module
sudo dkms build -m module_name -v 1.0

# Install module
sudo dkms install -m module_name -v 1.0

# Check DKMS status
dkms status
```

Kernel modules provide the foundation for Linux's modular architecture, enabling dynamic system configuration, hardware support, and functionality extension without kernel rebuilds.
