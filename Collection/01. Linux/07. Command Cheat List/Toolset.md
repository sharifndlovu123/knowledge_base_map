# 03. Linux Toolsets: Traditional vs Modern

## Network Management

| Category | Traditional Tools | Modern Tools | Purpose |
|----------|------------------|--------------|---------|
| **Network Config** | `ifconfig`, `route`, `netstat` | `ip`, `ss`, `nmcli` | Interface/routing management |
| **Firewall** | `iptables`, `ip6tables` | `nftables`, `firewalld`, `ufw` | Packet filtering |
| **Network Planning** | Manual `/etc/network/interfaces` | `netplan`, `NetworkManager` | Declarative network config |
| **DNS Resolution** | `nslookup`, `host` | `dig`, `resolvectl` | DNS queries |
| **Traffic Analysis** | `tcpdump`, `netstat` | `ss`, `bpftrace`, `tcpdump` | Network monitoring |

### Details
- **ifconfig → ip**: `ifconfig eth0` vs `ip addr show eth0`
- **netstat → ss**: `netstat -tuln` vs `ss -tuln`
- **iptables → nftables**: Complex chains vs unified ruleset
- **Network files → netplan**: Direct editing vs YAML configuration

## Process Management

| Category | Traditional Tools | Modern Tools | Purpose |
|----------|------------------|--------------|---------|
| **Process Viewing** | `ps`, `top`, `pstree` | `htop`, `btop`, `procs` | Process monitoring |
| **System Monitor** | `vmstat`, `iostat`, `sar` | `systemd-analyze`, `iotop`, `dstat` | System performance |
| **Service Management** | `service`, `/etc/init.d/`, `chkconfig` | `systemctl`, `journalctl` | Service control |
| **Process Control** | `kill`, `killall`, `nohup` | `systemd-run`, `pkill`, `pgrep` | Process lifecycle |
| **Resource Limits** | `ulimit`, manual configs | `systemd` resource control | Process constraints |

### Details
- **SysV Init → systemd**: `/etc/init.d/apache2 start` vs `systemctl start apache2`
- **syslog → journald**: `/var/log/*` files vs `journalctl`
- **cron → systemd timers**: Crontab vs `.timer` units

## Storage & Filesystem

| Category | Traditional Tools | Modern Tools | Purpose |
|----------|------------------|--------------|---------|
| **Disk Management** | `fdisk`, `parted` | `gdisk`, `lsblk`, `findmnt` | Partitioning |
| **Filesystem** | `ext2/3`, `mount`/`umount` | `ext4`, `btrfs`, `zfs`, `xfs` | File storage |
| **Volume Management** | Raw partitions | `LVM`, `stratis` | Logical volumes |
| **Mounting** | Manual `/etc/fstab` | `systemd.mount`, `udisks2` | Automatic mounting |
| **Disk Usage** | `du`, `df` | `ncdu`, `duf`, `dust` | Space analysis |

### Details
- **ext3 → ext4/btrfs**: Basic journaling vs advanced features (snapshots, compression)
- **Raw partitions → LVM**: Fixed sizes vs flexible volume management
- **Manual fstab → systemd mounts**: Static config vs dynamic mounting

## Text Processing & Search

| Category | Traditional Tools | Modern Tools | Purpose |
|----------|------------------|--------------|---------|
| **Text Search** | `grep`, `egrep`, `fgrep` | `ripgrep (rg)`, `ag`, `pcregrep` | Pattern matching |
| **File Finding** | `find`, `locate` | `fd`, `fzf`, `locate` | File discovery |
| **Text Editing** | `vi`, `nano`, `emacs` | `vim`, `nvim`, `micro`, `helix` | Text manipulation |
| **Text Processing** | `awk`, `sed`, `cut` | `jq`, `yq`, `miller` | Data transformation |
| **Paging** | `more`, `less` | `bat`, `most` | File viewing |

### Details
- **grep → ripgrep**: `grep -r pattern .` vs `rg pattern` (faster, better defaults)
- **find → fd**: `find . -name "*.txt"` vs `fd txt` (simpler syntax)
- **cat → bat**: Plain text vs syntax highlighting

## System Information & Monitoring

| Category | Traditional Tools | Modern Tools | Purpose |
|----------|------------------|--------------|---------|
| **System Info** | `uname`, `lscpu`, `free` | `neofetch`, `systemd-analyze` | System overview |
| **Hardware Info** | `lspci`, `lsusb`, `dmidecode` | `hwinfo`, `inxi`, `lshw` | Hardware detection |
| **Performance** | `top`, `iostat`, `vmstat` | `htop`, `glances`, `btop` | Resource monitoring |
| **Logging** | `tail -f`, `grep` logs | `journalctl`, `lnav` | Log analysis |
| **Benchmarking** | `time`, `dd` | `hyperfine`, `sysbench`, `stress-ng` | Performance testing |

### Details
- **top → htop**: Basic process list vs interactive, colorful interface
- **log files → journalctl**: Scattered files vs centralized logging
- **Manual monitoring → systemd-analyze**: Guesswork vs detailed boot analysis

## Package Management

| Category | Traditional Tools | Modern Tools | Purpose |
|----------|------------------|--------------|---------|
| **Package Install** | `dpkg`, `rpm` | `apt`, `dnf`, `pacman`, `zypper` | Software management |
| **Dependencies** | Manual resolution | Automatic dependency handling | Dependency management |
| **Software Sources** | Manual repos | `snap`, `flatpak`, `appimage` | Universal packages |
| **Build Tools** | `make`, manual compilation | `cmake`, `meson`, `ninja` | Build systems |

### Details
- **dpkg → apt**: Manual dependency hell vs automatic resolution
- **Traditional packages → containers**: System packages vs isolated applications

## Container & Virtualization

| Category | Traditional Tools | Modern Tools | Purpose |
|----------|------------------|--------------|---------|
| **Virtualization** | `qemu`, `virtualbox` | `kvm`, `libvirt`, `virt-manager` | Virtual machines |
| **Containers** | `chroot`, `lxc` | `docker`, `podman`, `containerd` | Application isolation |
| **Orchestration** | Manual scripts | `kubernetes`, `docker-compose` | Container management |

## Security & Authentication

| Category | Traditional Tools | Modern Tools | Purpose |
|----------|------------------|--------------|---------|
| **Authentication** | `/etc/passwd`, `su` | `sudo`, `polkit`, `systemd-logind` | Access control |
| **Encryption** | `gpg`, basic tools | `age`, `sops`, integrated encryption | Data protection |
| **Security Scanning** | Manual audits | `lynis`, `chkrootkit`, `rkhunter` | Security assessment |
| **Access Control** | Basic permissions | `SELinux`, `AppArmor`, `capabilities` | Advanced security |

## Migration Patterns

### Common Evolution Paths
```bash
# Network configuration evolution
/etc/network/interfaces → NetworkManager → netplan

# Service management evolution  
/etc/init.d/service start → service start → systemctl start

# Firewall evolution
iptables rules → ufw → firewalld/nftables

# Logging evolution
/var/log/messages → rsyslog → journalctl

# Process monitoring evolution
ps aux | grep → pgrep → systemctl status
```

### Why Tools Evolved

| Aspect | Traditional Issues | Modern Solutions |
|--------|-------------------|------------------|
| **Complexity** | Complex syntax, many options | Simplified, intuitive commands |
| **Integration** | Standalone tools | Integrated ecosystems |
| **Performance** | Basic algorithms | Optimized for modern hardware |
| **User Experience** | Text-only, minimal feedback | Colors, progress bars, better output |
| **Configuration** | Manual file editing | Declarative, validated configs |
| **Debugging** | Limited introspection | Rich debugging and analysis tools |

### Adoption Strategy
- **Learn both**: Legacy systems still use traditional tools
- **Start modern**: New installations should use modern toolsets
- **Gradual migration**: Replace tools as you encounter use cases
- **Context matters**: Some traditional tools are still preferred in scripts
