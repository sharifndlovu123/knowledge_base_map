# Linux Boot Process Diagram

```mermaid
flowchart TD
   A[Power On<br/>Hardware Initialization] --> B[BIOS/UEFI<br/>Firmware Init<br/>- Hardware checks<br/>- Find boot device]
   B --> C[Boot Loader<br/>GRUB/LILO/etc<br/>- Load kernel<br/>- Load initrd]
   C --> D[Kernel Loading<br/>- Decompress<br/>- Initialize<br/>- Hardware detect]
   D --> E[initrd/initramfs<br/>- Temporary rootfs<br/>- Load drivers<br/>- Mount real root]
   E --> F[Real Root FS<br/>Mount<br/>- Switch to real<br/>filesystem]
   F --> G[Init System<br/>systemd/SysV<br/>- Start services<br/>- User processes]
   G --> H[Login Prompt<br/>User Space<br/>- Desktop/Shell<br/>- Applications]

   style A fill:#ff9999
   style B fill:#ffcc99
   style C fill:#ffff99
   style D fill:#ccff99
   style E fill:#99ffcc
   style F fill:#99ccff
   style G fill:#cc99ff
   style H fill:#ff99cc
```

## Boot Process Steps Explained

1. **Power On** - Hardware initialization, CPU starts
2. **BIOS/UEFI** - Firmware tests hardware, locates boot device
3. **Boot Loader** - GRUB loads kernel and initial ramdisk into memory
4. **Kernel** - Decompresses, initializes, detects hardware, starts init
5. **initrd/initramfs** - Temporary filesystem loads essential drivers
6. **Real Root** - Mounts actual root filesystem, switches from initrd
7. **Init System** - Starts system services and daemons
8. **User Space** - Login manager, desktop environment, user applications

**Key Files/Locations:**
- `/boot/vmlinuz*` - Kernel image
- `/boot/initrd*` - Initial ramdisk
- `/boot/grub/` - GRUB configuration
- `/etc/fstab` - Filesystem mount points
- `/sbin/init` - First user process (PID 1)
