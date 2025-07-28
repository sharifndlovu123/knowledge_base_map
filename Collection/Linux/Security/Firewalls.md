# Linux Firewalls: Complete Guide

## Overview

Linux firewalls control network traffic flow based on predetermined rules. They operate at different layers and use various frameworks, from low-level packet filtering to high-level application gateways.

## Firewall Evolution Timeline

| Era | Tool | Type | Status |
|-----|------|------|--------|
| **Legacy** | `ipchains` | Packet filter | Obsolete |
| **Traditional** | `iptables/ip6tables` | Netfilter frontend | Widely used |
| **Modern** | `nftables` | Unified framework | Current standard |
| **User-Friendly** | `ufw`, `firewalld` | High-level frontends | Popular |

## iptables: Traditional Firewall

### iptables Architecture
```
Netfilter Hooks → Tables → Chains → Rules → Targets
```

### Tables and Chains
```bash
# Tables (processing purposes)
filter    # Default table for filtering packets
nat       # Network Address Translation
mangle    # Packet alteration
raw       # Connection tracking exemption
security  # SELinux context

# Built-in Chains
INPUT     # Incoming packets destined for local system
OUTPUT    # Outgoing packets from local system
FORWARD   # Packets routed through the system
PREROUTING  # Packets before routing decision
POSTROUTING # Packets after routing decision
```

### Basic iptables Commands
```bash
# View current rules
iptables -L -n -v                    # List all rules with packet counts
iptables -t nat -L                   # List NAT table rules
iptables -L INPUT --line-numbers     # Show rule numbers

# Basic rule syntax
iptables -A INPUT -s 192.168.1.0/24 -j ACCEPT
#        │  │     │                   │
#        │  │     │                   └─ Target (action)
#        │  │     └─ Match criteria
#        │  └─ Chain
#        └─ Action (Append)

# Common actions
-A  # Append rule to end of chain
-I  # Insert rule at specific position
-D  # Delete rule
-R  # Replace rule
-F  # Flush (delete all rules)
-P  # Set default policy
```

### Common iptables Rules
```bash
# Set default policies
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback traffic
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established and related connections
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allow SSH (port 22)
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP and HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Allow specific source
iptables -A INPUT -s 192.168.1.100 -j ACCEPT

# Block specific IP
iptables -A INPUT -s 10.0.0.100 -j DROP

# Allow ping (ICMP)
iptables -A INPUT -p icmp --icmp-type 8 -j ACCEPT

# Rate limiting (prevent DoS)
iptables -A INPUT -p tcp --dport 80 -m limit --limit 25/minute --limit-burst 100 -j ACCEPT
```

### Advanced iptables Features
```bash
# Connection tracking
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Time-based rules
iptables -A INPUT -p tcp --dport 80 -m time --timestart 09:00 --timestop 17:00 -j ACCEPT

# MAC address filtering
iptables -A INPUT -m mac --mac-source 00:11:22:33:44:55 -j ACCEPT

# Multi-port matching
iptables -A INPUT -p tcp -m multiport --dports 80,443,8080 -j ACCEPT

# String matching
iptables -A FORWARD -p tcp --dport 80 -m string --string "malware" --algo bm -j DROP

# Geolocation blocking (with geoip module)
iptables -A INPUT -m geoip --src-cc CN,RU -j DROP

# Recent module (track connection attempts)
iptables -A INPUT -p tcp --dport 22 -m recent --set --name SSH
iptables -A INPUT -p tcp --dport 22 -m recent --update --seconds 60 --hitcount 4 --name SSH -j DROP
```

### NAT Configuration
```bash
# SNAT (Source NAT) - Masquerading
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# DNAT (Destination NAT) - Port forwarding
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 192.168.1.100:8080

# Redirect local ports
iptables -t nat -A OUTPUT -p tcp --dport 80 -j REDIRECT --to-port 8080
```

### iptables Persistence
```bash
# Save rules (Debian/Ubuntu)
iptables-save > /etc/iptables/rules.v4
ip6tables-save > /etc/iptables/rules.v6

# Install persistence package
sudo apt install iptables-persistent

# Save rules (CentOS/RHEL)
service iptables save
# or
iptables-save > /etc/sysconfig/iptables

# Restore rules
iptables-restore < /etc/iptables/rules.v4
```

## nftables: Modern Firewall Framework

### nftables Advantages
- Unified framework for IPv4/IPv6
- Better performance
- Simplified rule syntax
- Atomic rule updates
- Better scripting support

### Basic nftables Concepts
```bash
# Hierarchy: table → chain → rule

# Tables (address families)
ip        # IPv4
ip6       # IPv6
inet      # IPv4 and IPv6
arp       # ARP
bridge    # Bridge
netdev    # Network device (ingress)
```

### nftables Commands
```bash
# List current configuration
nft list ruleset

# List specific table
nft list table inet filter

# Create table
nft add table inet filter

# Create chain
nft add chain inet filter input { type filter hook input priority 0 \; policy drop \; }

# Add rule
nft add rule inet filter input tcp dport 22 accept

# Delete rule by handle
nft list ruleset -a    # Show handles
nft delete rule inet filter input handle 5
```

### Sample nftables Configuration
```bash
#!/usr/sbin/nft -f

# Clear existing rules
flush ruleset

# Main table
table inet filter {
    # Input chain
    chain input {
        type filter hook input priority 0; policy drop;
        
        # Allow loopback
        iif lo accept
        
        # Allow established/related
        ct state established,related accept
        
        # Allow SSH
        tcp dport 22 accept
        
        # Allow HTTP/HTTPS
        tcp dport { 80, 443 } accept
        
        # Allow ICMP
        icmp type echo-request accept
        
        # Rate limiting
        tcp dport 80 limit rate 10/second accept
        
        # Drop everything else
        counter drop
    }
    
    # Output chain
    chain output {
        type filter hook output priority 0; policy accept;
    }
    
    # Forward chain
    chain forward {
        type filter hook forward priority 0; policy drop;
    }
}

# NAT table
table inet nat {
    chain prerouting {
        type nat hook prerouting priority -100;
        
        # Port forwarding
        tcp dport 8080 dnat to 192.168.1.100:80
    }
    
    chain postrouting {
        type nat hook postrouting priority 100;
        
        # Masquerading
        oif eth0 masquerade
    }
}
```

### nftables Sets and Maps
```bash
# Create sets for efficient matching
nft add set inet filter blacklist { type ipv4_addr \; }
nft add element inet filter blacklist { 10.0.0.1, 10.0.0.2 }
nft add rule inet filter input ip saddr @blacklist drop

# Create maps
nft add map inet filter port_redirect { type inet_service : ipv4_addr . inet_service \; }
nft add element inet filter port_redirect { 80 : 192.168.1.100 . 8080 }
nft add rule inet filter prerouting dnat to tcp dport map @port_redirect
```

## UFW (Uncomplicated Firewall)

### UFW Basics
```bash
# Enable/disable UFW
sudo ufw enable
sudo ufw disable

# Check status
sudo ufw status
sudo ufw status verbose
sudo ufw status numbered

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### UFW Rules
```bash
# Allow/deny by port
sudo ufw allow 22
sudo ufw allow 80/tcp
sudo ufw allow 53/udp
sudo ufw deny 23

# Allow/deny by service name
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https

# Allow from specific IP
sudo ufw allow from 192.168.1.100
sudo ufw allow from 192.168.1.0/24

# Allow to specific port from specific IP
sudo ufw allow from 192.168.1.100 to any port 22

# Allow specific application
sudo ufw allow 'Apache Full'
sudo ufw allow 'OpenSSH'

# Delete rules
sudo ufw delete allow 80
sudo ufw delete 2  # By rule number

# Advanced rules
sudo ufw allow from 192.168.1.0/24 to any port 3306
sudo ufw limit ssh  # Rate limiting for SSH
```

### UFW Application Profiles
```bash
# List available profiles
sudo ufw app list

# Show profile details
sudo ufw app info 'Apache Full'

# Create custom profile (/etc/ufw/applications.d/myapp)
[MyApp]
title=My Application
description=Custom application
ports=8080,8443/tcp

# Update application profiles
sudo ufw app update MyApp
```

## firewalld: Dynamic Firewall Management

### firewalld Concepts
```bash
# Zones: Predefined rule sets for different trust levels
# Services: Named service definitions
# Runtime vs Permanent: Temporary vs persistent changes
```

### firewalld Zones
```bash
# List zones
firewall-cmd --get-zones

# Default zones
drop       # Drop all incoming, allow outgoing
block      # Reject all incoming, allow outgoing
public     # Default zone, selective incoming
external   # Masquerading enabled
dmz        # Limited access
work       # Trust work environment
home       # Trust home environment
internal   # Internal network
trusted    # Trust all connections

# Check active zones
firewall-cmd --get-active-zones

# Get default zone
firewall-cmd --get-default-zone

# Set default zone
firewall-cmd --set-default-zone=public
```

### firewalld Commands
```bash
# Service management
firewall-cmd --list-services
firewall-cmd --add-service=http
firewall-cmd --add-service=https --permanent
firewall-cmd --remove-service=ssh
firewall-cmd --reload  # Apply permanent changes

# Port management
firewall-cmd --list-ports
firewall-cmd --add-port=8080/tcp
firewall-cmd --add-port=1000-2000/tcp
firewall-cmd --remove-port=8080/tcp

# Source management
firewall-cmd --add-source=192.168.1.0/24
firewall-cmd --remove-source=192.168.1.100

# Rich rules (advanced)
firewall-cmd --add-rich-rule='rule family="ipv4" source address="192.168.1.0/24" service name="ssh" accept'
firewall-cmd --add-rich-rule='rule family="ipv4" source address="10.0.0.0/8" drop'

# Masquerading
firewall-cmd --add-masquerade
firewall-cmd --list-all

# Port forwarding
firewall-cmd --add-forward-port=port=80:proto=tcp:toport=8080:toaddr=192.168.1.100
```

### Custom firewalld Services
```bash
# Create custom service (/etc/firewalld/services/myapp.xml)
<?xml version="1.0" encoding="utf-8"?>
<service>
  <short>MyApp</short>
  <description>My custom application</description>
  <port protocol="tcp" port="8080"/>
  <port protocol="udp" port="8081"/>
</service>

# Reload and use
firewall-cmd --reload
firewall-cmd --add-service=myapp
```

## Application Layer Firewalls

### fail2ban: Intrusion Prevention
```bash
# Install fail2ban
sudo apt install fail2ban

# Configuration files
/etc/fail2ban/jail.conf     # Default configuration (don't edit)
/etc/fail2ban/jail.local    # Local overrides

# Sample jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
ignoreip = 127.0.0.1/8 192.168.1.0/24

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[apache-auth]
enabled = true
port = http,https
filter = apache-auth
logpath = /var/log/apache*/*error.log
maxretry = 6

# Manage fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
sudo fail2ban-client status sshd

# Unban IP
sudo fail2ban-client set sshd unbanip 192.168.1.100
```

### ModSecurity: Web Application Firewall
```bash
# Install ModSecurity for Apache
sudo apt install libapache2-mod-security2

# Enable module
sudo a2enmod security2

# Configuration (/etc/apache2/mods-enabled/security2.conf)
<IfModule mod_security2.c>
    SecRuleEngine On
    SecRequestBodyAccess On
    SecResponseBodyAccess Off
    SecDataDir /var/cache/modsecurity
    
    # Include OWASP Core Rule Set
    Include /etc/modsecurity/*.conf
    Include /etc/modsecurity/activated_rules/*.conf
</IfModule>

# Download OWASP CRS
cd /etc/modsecurity
sudo wget https://github.com/SpiderLabs/owasp-modsecurity-crs/archive/v3.3.0.tar.gz
sudo tar -xzf v3.3.0.tar.gz
sudo mv owasp-modsecurity-crs-3.3.0 crs
```

## Network Segmentation and VLANs

### Bridge Firewalling
```bash
# Enable bridge firewalling
echo 1 > /proc/sys/net/bridge/bridge-nf-call-iptables
echo 1 > /proc/sys/net/bridge/bridge-nf-call-ip6tables

# Make persistent
echo 'net.bridge.bridge-nf-call-iptables = 1' >> /etc/sysctl.conf
echo 'net.bridge.bridge-nf-call-ip6tables = 1' >> /etc/sysctl.conf

# Bridge filtering rules
iptables -A FORWARD -m physdev --physdev-in eth0 --physdev-out eth1 -j ACCEPT
```

### VLAN Filtering
```bash
# Create VLAN interfaces
ip link add link eth0 name eth0.100 type vlan id 100
ip link add link eth0 name eth0.200 type vlan id 200

# Configure VLAN firewalling
iptables -A FORWARD -i eth0.100 -o eth0.200 -j DROP
iptables -A FORWARD -i eth0.200 -o eth0.100 -j DROP
```

## Advanced Firewall Features

### Connection Tracking
```bash
# View connection tracking table
conntrack -L

# Connection tracking statistics
cat /proc/net/nf_conntrack

# Tune connection tracking
echo 'net.netfilter.nf_conntrack_max = 131072' >> /etc/sysctl.conf
echo 'net.netfilter.nf_conntrack_tcp_timeout_established = 54000' >> /etc/sysctl.conf
```

### DPI (Deep Packet Inspection)
```bash
# Layer 7 filtering with l7-filter (deprecated)
# Modern alternative: nDPI integration

# Protocol detection with nDPI
iptables -A FORWARD -m ndpi --protocol bittorrent -j DROP
iptables -A FORWARD -m ndpi --protocol facebook -j REJECT
```

### Traffic Shaping Integration
```bash
# QoS with tc (traffic control)
tc qdisc add dev eth0 root handle 1: htb default 30

# Create classes
tc class add dev eth0 parent 1: classid 1:1 htb rate 100mbit
tc class add dev eth0 parent 1:1 classid 1:10 htb rate 80mbit ceil 100mbit
tc class add dev eth0 parent 1:1 classid 1:20 htb rate 20mbit ceil 100mbit

# Mark packets with iptables
iptables -t mangle -A OUTPUT -p tcp --dport 80 -j MARK --set-mark 10
iptables -t mangle -A OUTPUT -p tcp --dport 22 -j MARK --set-mark 20

# Filter based on marks
tc filter add dev eth0 protocol ip parent 1:0 prio 1 handle 10 fw flowid 1:10
tc filter add dev eth0 protocol ip parent 1:0 prio 1 handle 20 fw flowid 1:20
```

## Firewall Testing and Monitoring

### Testing Firewall Rules
```bash
# Port scanning with nmap
nmap -sS -O target_host              # SYN scan
nmap -sU target_host                 # UDP scan
nmap -A target_host                  # Aggressive scan

# Test specific ports
nc -zv target_host 80                # Test TCP port
nc -zuv target_host 53               # Test UDP port

# Test from specific source
hping3 -S -p 80 -c 5 target_host     # SYN flood test
```

### Monitoring and Logging
```bash
# Enable iptables logging
iptables -A INPUT -j LOG --log-prefix "IPTABLES-DROP: " --log-level 4

# View firewall logs
tail -f /var/log/kern.log | grep IPTABLES
journalctl -f -k | grep IPTABLES

# Analyze logs with fail2ban
# Custom filter for iptables logs
# /etc/fail2ban/filter.d/iptables.conf
[Definition]
failregex = .*IPTABLES-DROP.*SRC=<HOST>.*
ignoreregex =

# Performance monitoring
watch -n 1 'iptables -L -n -v'
watch -n 1 'nft list ruleset'
```

## Firewall Performance Optimization

### Rule Optimization
```bash
# Place most common rules first
# Use specific matches instead of generic ones
# Minimize rule traversal

# Good: Specific rule first
iptables -A INPUT -s 192.168.1.100 -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Use connection tracking efficiently
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Avoid unnecessary logging in performance-critical paths
```

### Hardware Acceleration
```bash
# Check for hardware offload support
ethtool -k eth0 | grep hw-tc-offload

# Enable hardware offload (if supported)
ethtool -K eth0 hw-tc-offload on

# nftables offload (requires kernel 5.4+)
nft add table netdev filter
nft add chain netdev filter ingress { type filter hook ingress device eth0 priority 0 \; }
nft add rule netdev filter ingress tcp dport 80 counter accept
```

## Firewall Comparison Summary

| Feature | iptables | nftables | UFW | firewalld |
|---------|----------|----------|-----|-----------|
| **Complexity** | High | Medium | Low | Medium |
| **Performance** | Good | Better | Good | Good |
| **IPv6 Support** | Separate tool | Unified | Built-in | Built-in |
| **Atomic Updates** | No | Yes | No | Yes |
| **Scripting** | Complex | Better | Limited | Good |
| **Learning Curve** | Steep | Moderate | Easy | Moderate |
| **Enterprise Features** | Manual | Built-in | Limited | Extensive |

## Best Practices

### Security Best Practices
```bash
# 1. Default deny policy
iptables -P INPUT DROP
iptables -P FORWARD DROP

# 2. Allow only necessary services
# 3. Use rate limiting for public services
# 4. Implement logging for security events
# 5. Regular rule audits
# 6. Network segmentation
# 7. Intrusion detection integration
# 8. Regular updates and patches
```

### Management Best Practices
```bash
# 1. Document all rules and changes
# 2. Use version control for configurations
# 3. Test rules in staging environment
# 4. Implement change management procedures
# 5. Monitor firewall performance
# 6. Regular backup of configurations
# 7. Emergency access procedures
# 8. Staff training and knowledge transfer
```

Linux firewalls provide comprehensive network security through multiple layers and tools, from low-level packet filtering to high-level application protection, enabling fine-grained control over network traffic flow.
