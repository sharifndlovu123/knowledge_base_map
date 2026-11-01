# 01. Hardware and Storage Troubleshooting

## Boot Issues Diagnosis

### Boot Process Analysis
```bash
# Check boot logs
dmesg | head -50              # Kernel boot messages
journalctl -b                 # Current boot journal
journalctl --list-boots       # Available boot sessions
journalctl -b -1              # Previous boot logs

# GRUB troubleshooting
sudo update-grub              # Rebuild GRUB configuration
sudo grub-install /dev/sda    # Reinstall GRUB
sudo grub-mkconfig -o /boot/grub/grub.cfg

# Boot from rescue mode
# Add 'single' or 'init=/bin/bash' to kernel parameters
# Or use 'systemd.unit=rescue.target'

# Check systemd boot analysis
systemd-analyze               # Boot time summary
systemd-analyze blame         # Services by startup time
systemd-analyze critical-chain  # Critical path analysis
systemd-analyze plot > boot.svg  # Visual boot chart
```

### Hardware Detection Issues
```bash
# Hardware information
lshw                          # Complete hardware listing
lshw -short                   # Concise hardware summary
dmidecode                     # DMI/SMBIOS information
lspci -v                      # PCI devices verbose
lsusb -v                      # USB devices verbose

# CPU and memory detection
lscpu                         # CPU architecture info
cat /proc/cpuinfo             # Detailed CPU information
cat /proc/meminfo             # Memory information
free -h                       # Memory usage

# Check for hardware errors
dmesg | grep -i error         # Hardware error messages
dmesg | grep -i fail          # Hardware failures
cat /var/log/kern.log | grep -i error
mcelog                        # Machine check exceptions (x86)
```

### UEFI/BIOS Boot Problems
```bash
# UEFI boot management
efibootmgr                    # List UEFI boot entries
efibootmgr -v                 # Verbose boot entries
efibootmgr -c -d /dev/sda -p 1 -L "Linux" -l '\EFI\ubuntu\grubx64.efi'

# Check EFI system partition
mount | grep /boot/efi        # EFI partition mount
ls -la /boot/efi/EFI/         # EFI boot loaders
df -h /boot/efi               # EFI partition space

# Secure Boot issues
mokutil --sb-state            # Secure Boot status
mokutil --list-enrolled       # Enrolled keys
dmesg | grep -i "secure boot" # Secure Boot messages
```

## Storage Device Diagnosis

### Disk Health Assessment
```bash
# SMART health monitoring
smartctl -a /dev/sda          # Complete SMART data
smartctl -H /dev/sda          # Health status only
smartctl -t short /dev/sda    # Short self-test
smartctl -t long /dev/sda     # Extended self-test
smartctl -l selftest /dev/sda # Test results

# Check for bad sectors
badblocks -v /dev/sda         # Read-only bad block scan
badblocks -nvs /dev/sda       # Non-destructive read-write test
e2fsck -c /dev/sda1           # Check filesystem with badblocks

# Disk I/O performance
hdparm -tT /dev/sda           # Disk read performance
iostat -x 1                   # Real-time I/O statistics
iotop                         # I/O usage by process
```

### Filesystem Issues
```bash
# Filesystem check and repair
fsck /dev/sda1                # Generic filesystem check
e2fsck -f /dev/sda1           # Force ext2/3/4 check
e2fsck -p /dev/sda1           # Automatic repair
e2fsck -y /dev/sda1           # Answer yes to all prompts

# XFS filesystem repair
xfs_check /dev/sda1           # Check XFS filesystem
xfs_repair /dev/sda1          # Repair XFS filesystem
xfs_repair -n /dev/sda1       # Dry run repair

# Btrfs filesystem check
btrfs check /dev/sda1         # Check Btrfs filesystem
btrfs check --repair /dev/sda1 # Repair Btrfs filesystem
btrfs scrub start /mnt/point  # Data integrity check

# Filesystem information
tune2fs -l /dev/sda1          # ext2/3/4 filesystem info
dumpe2fs /dev/sda1 | head -20 # Superblock information
xfs_info /dev/sda1            # XFS filesystem info
```

## Mount Issues Resolution

### Mount Point Troubleshooting
```bash
# Check current mounts
mount                         # All mounted filesystems
df -h                         # Mounted filesystems with usage
findmnt                       # Tree view of mounts
cat /proc/mounts              # Kernel view of mounts

# Mount manually
mount /dev/sda1 /mnt/disk     # Basic mount
mount -t ext4 /dev/sda1 /mnt/disk  # Specify filesystem type
mount -o ro /dev/sda1 /mnt/disk    # Read-only mount
mount -o remount,rw /mnt/disk      # Remount as read-write

# Check /etc/fstab
cat /etc/fstab                # Filesystem table
mount -a                      # Mount all fstab entries
findmnt --verify              # Verify fstab entries

# Troubleshoot mount failures
dmesg | tail -20              # Recent kernel messages
journalctl -f                 # Follow system journal
lsof /mnt/point               # Check if mount point is busy
fuser -mv /mnt/point          # Processes using mount point
```

### UUID and Label Issues
```bash
# Check device UUIDs and labels
blkid                         # All block device IDs
blkid /dev/sda1               # Specific device ID
ls -la /dev/disk/by-uuid/     # UUID symlinks
ls -la /dev/disk/by-label/    # Label symlinks

# Set filesystem labels
e2label /dev/sda1 "new-label" # Set ext2/3/4 label
xfs_admin -L "new-label" /dev/sda1  # Set XFS label
tune2fs -L "new-label" /dev/sda1    # Alternative for ext

# Generate new UUID
tune2fs -U random /dev/sda1   # Generate new UUID for ext
xfs_admin -U generate /dev/sda1     # Generate new UUID for XFS
```

### Network Filesystems
```bash
# NFS troubleshooting
showmount -e nfs_server       # Show NFS exports
rpcinfo -p nfs_server         # RPC services
mount -t nfs server:/path /mnt/nfs  # Manual NFS mount

# CIFS/SMB troubleshooting
smbclient -L server_name      # List SMB shares
mount -t cifs //server/share /mnt/cifs -o username=user
testparm                      # Test Samba configuration

# Check network filesystem services
systemctl status nfs-server   # NFS server status
systemctl status smbd         # Samba daemon status
```

## Storage Hardware Troubleshooting

### SATA/IDE Issues
```bash
# Check SATA connections
dmesg | grep -i sata          # SATA controller messages
dmesg | grep -i ata           # ATA device messages
cat /proc/scsi/scsi           # SCSI device list
lsscsi                        # SCSI devices in tree format

# Check disk connection
ls /sys/block/                # Available block devices
cat /sys/block/sda/queue/scheduler  # I/O scheduler
hdparm -i /dev/sda            # Drive identification
```

### USB Storage Issues
```bash
# USB device troubleshooting
dmesg | grep -i usb           # USB subsystem messages
lsusb -t                      # USB device tree
usb-devices                   # Detailed USB information

# USB mass storage specific
dmesg | grep "usb-storage"    # USB storage messages
cat /proc/bus/usb/devices     # USB device details
```

### RAID Array Problems
```bash
# Software RAID (mdadm)
cat /proc/mdstat              # RAID array status
mdadm --detail /dev/md0       # Detailed array information
mdadm --examine /dev/sda1     # Examine RAID member

# RAID repair operations
mdadm --manage /dev/md0 --fail /dev/sda1    # Mark drive as failed
mdadm --manage /dev/md0 --remove /dev/sda1  # Remove failed drive
mdadm --manage /dev/md0 --add /dev/sda1     # Add replacement drive

# Hardware RAID
# LSI MegaRAID
storcli64 /c0 show            # Show controller info
storcli64 /c0/v0 show         # Show virtual drive

# Adaptec RAID
arcconf getconfig 1           # Get configuration
```

## LVM Troubleshooting

### LVM Diagnosis
```bash
# LVM status
pvs                           # Physical volumes summary
vgs                           # Volume groups summary
lvs                           # Logical volumes summary
pvdisplay                     # Detailed PV information
vgdisplay                     # Detailed VG information
lvdisplay                     # Detailed LV information

# LVM recovery
pvscan                        # Scan for physical volumes
vgscan                        # Scan for volume groups
lvscan                        # Scan for logical volumes
vgchange -ay                  # Activate all volume groups

# LVM repair
vgck volume_group             # Check volume group consistency
pvck /dev/sda1                # Check physical volume
```

### Emergency Recovery Procedures

### Single User Mode Recovery
```bash
# Boot to single user mode
# Add 'single' or '1' to kernel boot parameters

# Emergency remount
mount -o remount,rw /         # Remount root as read-write
mount -a                      # Mount all filesystems

# Reset forgotten root password
passwd root                   # Change root password
```

### Live USB Recovery
```bash
# Boot from live USB/CD
# Mount damaged system
mkdir /mnt/system
mount /dev/sda1 /mnt/system
mount /dev/sda2 /mnt/system/home  # If separate /home

# Chroot into system
for i in /dev /dev/pts /proc /sys /run; do
    mount -B $i /mnt/system$i
done
chroot /mnt/system

# Repair GRUB from chroot
grub-install /dev/sda
update-grub
```

### Data Recovery
```bash
# File recovery tools
testdisk                      # Partition recovery
photorec                      # File recovery by signature
ddrescue /dev/sda /backup/disk.img  # Disk imaging
foremost -i /dev/sda -o /recovery    # File carving

# Emergency filesystem repair
e2fsck -b 32768 /dev/sda1     # Use alternate superblock
dumpe2fs /dev/sda1 | grep superblock  # Find superblocks
```

### Automated Health Monitoring
```bash
#!/bin/bash
# Storage health monitoring script

ALERT_EMAIL="admin@example.com"
LOG_FILE="/var/log/storage-health.log"

echo "Storage Health Check - $(date)" >> "$LOG_FILE"

# Check all disks
for disk in $(lsblk -dn -o NAME | grep -E '^sd|^nvme'); do
    echo "Checking /dev/$disk" >> "$LOG_FILE"
    
    # SMART health check
    if smartctl -H /dev/$disk | grep -q "PASSED"; then
        echo "  SMART: PASSED" >> "$LOG_FILE"
    else
        echo "  SMART: FAILED" >> "$LOG_FILE"
        echo "SMART failure detected on /dev/$disk" | \
        mail -s "Disk Health Alert" "$ALERT_EMAIL"
    fi
    
    # Check for reallocated sectors
    REALLOCATED=$(smartctl -a /dev/$disk | grep "Reallocated_Sector_Ct" | awk '{print $10}')
    if [ "$REALLOCATED" -gt 0 ]; then
        echo "  Reallocated sectors: $REALLOCATED" >> "$LOG_FILE"
        echo "Reallocated sectors detected on /dev/$disk: $REALLOCATED" | \
        mail -s "Disk Sector Alert" "$ALERT_EMAIL"
    fi
done

# Check filesystem usage
df -h | awk 'NR>1 && $5+0 > 90 {print $6" is "$5" full"}' >> "$LOG_FILE"
```

This comprehensive troubleshooting guide covers hardware detection, boot process analysis, storage device diagnosis, and emergency recovery procedures for maintaining system reliability and recovering from hardware and storage failures.