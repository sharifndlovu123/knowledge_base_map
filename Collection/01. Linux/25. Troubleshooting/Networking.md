# 02. Network Troubleshooting

## Connectivity Testing and Diagnosis

### Basic Network Connectivity
```bash
# Test basic connectivity
ping -c 4 8.8.8.8             # Test external connectivity
ping -c 4 192.168.1.1         # Test gateway
ping6 -c 4 2001:4860:4860::8888  # IPv6 connectivity

# Trace network path
traceroute google.com          # Trace route to destination
mtr google.com                 # Real-time trace with statistics
tracepath google.com          # Alternative path discovery

# Check network interfaces
ip addr show                   # All interface IP addresses
ip link show                   # Interface status and MAC addresses
ifconfig                       # Legacy interface information
ethtool eth0                   # Ethernet interface details
iwconfig                       # Wireless interface configuration
```

### Network Configuration Issues
```bash
# Check IP configuration
ip route show                  # Routing table
route -n                       # Numeric routing table
netstat -rn                    # Legacy routing display

# Network interface management
ip link set eth0 up           # Bring interface up
ip link set eth0 down         # Bring interface down
ip addr add 192.168.1.100/24 dev eth0  # Add IP address
ip route add default via 192.168.1.1   # Add default route

# DHCP troubleshooting
dhclient -v eth0               # Request DHCP lease
dhclient -r eth0               # Release DHCP lease
systemctl status networking    # Check networking service
systemctl restart networking   # Restart networking
```

### Advanced Network Diagnostics
```bash
# Check network services and ports
ss -tuln                       # Socket statistics
netstat -tuln                  # Legacy socket display
nmap -sT localhost             # Port scan localhost
lsof -i                        # Files/processes using network

# Network performance testing
iperf3 -s                      # Start iperf server
iperf3 -c server_ip            # Test throughput to server
speedtest-cli                  # Internet speed test
iftop                          # Real-time bandwidth usage
```

## DNS Resolution Problems

### DNS Testing and Diagnosis
```bash
# Basic DNS testing
nslookup google.com            # Basic DNS lookup
dig google.com                 # Detailed DNS query
dig @8.8.8.8 google.com       # Query specific DNS server
host google.com                # Simple DNS lookup

# DNS configuration check
cat /etc/resolv.conf           # DNS servers configuration
systemd-resolve --status       # systemd-resolved status
systemd-resolve --flush-caches # Clear DNS cache

# Advanced DNS troubleshooting
dig +trace google.com          # Trace DNS resolution path
dig google.com MX              # Query specific record type
dig -x 8.8.8.8                 # Reverse DNS lookup
dig google.com +short          # Short answer format
```

### DNS Server Issues
```bash
# Check DNS service status
systemctl status systemd-resolved  # systemd-resolved status
systemctl status dnsmasq       # dnsmasq status
systemctl status bind9         # BIND DNS server

# DNS cache management
systemctl restart systemd-resolved  # Restart DNS resolver
resolvectl flush-caches        # Flush resolver cache
/etc/init.d/dnsmasq restart    # Restart dnsmasq

# Test DNS server response
dig @localhost google.com      # Test local DNS server
nmap -p 53 dns_server_ip       # Check if DNS port is open
```

### DNS Configuration Fixes
```bash
# Fix DNS resolution
echo "nameserver 8.8.8.8" > /etc/resolv.conf
echo "nameserver 1.1.1.1" >> /etc/resolv.conf

# systemd-resolved configuration
echo "[Resolve]" > /etc/systemd/resolved.conf
echo "DNS=8.8.8.8 1.1.1.1" >> /etc/systemd/resolved.conf
systemctl restart systemd-resolved

# NetworkManager DNS settings
nmcli con mod "connection_name" ipv4.dns "8.8.8.8,1.1.1.1"
nmcli con up "connection_name"
```

## Firewall Troubleshooting

### UFW Firewall Issues
```bash
# Check UFW status
sudo ufw status verbose        # Detailed firewall status
sudo ufw status numbered       # Rules with numbers
sudo ufw show listening        # Show listening ports

# UFW rule management
sudo ufw allow 22              # Allow SSH
sudo ufw deny 23               # Deny telnet
sudo ufw delete 3              # Delete rule by number
sudo ufw reset                 # Reset all rules

# UFW troubleshooting
sudo ufw --dry-run enable      # Test enable without applying
journalctl -u ufw              # UFW service logs
```

### iptables Troubleshooting
```bash
# Check iptables rules
iptables -L -n -v              # List all rules with counters
iptables -t nat -L -n          # NAT table rules
iptables -t mangle -L -n       # Mangle table rules

# iptables debugging
iptables -I INPUT -j LOG --log-prefix "IPTABLES-DEBUG: "
tail -f /var/log/kern.log | grep IPTABLES-DEBUG

# Reset iptables (emergency)
iptables -F                    # Flush all rules
iptables -X                    # Delete user chains
iptables -t nat -F             # Flush NAT rules
iptables -P INPUT ACCEPT       # Set default policy
```

### Common Firewall Fixes
```bash
# Allow common services through firewall
sudo ufw allow ssh             # SSH access
sudo ufw allow http            # HTTP traffic
sudo ufw allow https           # HTTPS traffic
sudo ufw allow from 192.168.1.0/24  # Allow local network

# iptables allow rules
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
```

## Routing Problems

### Routing Table Issues
```bash
# Check routing configuration
ip route show                  # Current routing table
route -n                       # Numeric route display
netstat -rn                    # Legacy route display

# Add/remove routes
ip route add 192.168.2.0/24 via 192.168.1.1  # Add route
ip route del 192.168.2.0/24   # Delete route
ip route add default via 192.168.1.1          # Add default route

# Persistent routing configuration
echo "192.168.2.0/24 via 192.168.1.1" >> /etc/network/interfaces
```

### Gateway and Routing Fixes
```bash
# Check default gateway
ip route | grep default        # Show default route
ping $(ip route | grep default | awk '{print $3}')  # Ping gateway

# Fix missing default route
ip route add default via 192.168.1.1
echo "GATEWAY=192.168.1.1" >> /etc/sysconfig/network  # RHEL/CentOS

# Network interface routing
ip route add 10.0.0.0/8 dev eth1  # Route via specific interface
```

## Network Services Troubleshooting

### SSH Connection Issues
```bash
# SSH debugging
ssh -v user@host               # Verbose SSH connection
ssh -vv user@host              # More verbose output
ssh -p 2222 user@host          # Custom port

# SSH server troubleshooting
systemctl status ssh           # SSH service status
journalctl -u ssh              # SSH service logs
sshd -T                        # Test SSH configuration
/usr/sbin/sshd -d              # Debug mode

# SSH configuration check
cat /etc/ssh/sshd_config       # SSH server configuration
ssh-keygen -l -f ~/.ssh/id_rsa.pub  # Check key fingerprint
```

### Web Server Connectivity
```bash
# Test web server connectivity
curl -I http://localhost       # HTTP headers
wget --spider http://localhost # Check if page exists
telnet localhost 80            # Raw HTTP connection

# Web server status
systemctl status apache2       # Apache status
systemctl status nginx         # Nginx status
netstat -tuln | grep :80       # Check if port 80 is listening

# Web server logs
tail -f /var/log/apache2/error.log   # Apache errors
tail -f /var/log/nginx/error.log     # Nginx errors
```

## Advanced Network Troubleshooting

### Packet Capture and Analysis
```bash
# Capture network traffic
tcpdump -i eth0                # Capture on interface
tcpdump -i eth0 port 80        # Capture HTTP traffic
tcpdump -i eth0 host 8.8.8.8   # Capture traffic to/from host
tcpdump -w capture.pcap -i eth0 # Save to file

# Analyze captured traffic
tcpdump -r capture.pcap        # Read capture file
wireshark capture.pcap         # GUI analysis tool
```

### Network Interface Problems
```bash
# Interface hardware issues
dmesg | grep eth0              # Kernel messages for interface
ethtool eth0                   # Interface hardware details
mii-tool eth0                  # Media-independent interface status

# Reset network interface
ip link set eth0 down
ip link set eth0 up
systemctl restart networking

# Check cable and link status
ethtool eth0 | grep "Link detected"
cat /sys/class/net/eth0/carrier  # Link status (1=up, 0=down)
```

### Automated Network Monitoring
```bash
#!/bin/bash
# Network connectivity monitoring script

LOG_FILE="/var/log/network-monitor.log"
ALERT_EMAIL="admin@example.com"

# Test connectivity to critical hosts
HOSTS=("8.8.8.8" "google.com" "192.168.1.1")

for host in "${HOSTS[@]}"; do
    if ! ping -c 3 "$host" >/dev/null 2>&1; then
        echo "$(date): Connectivity to $host FAILED" >> "$LOG_FILE"
        echo "Network connectivity to $host failed on $(hostname)" | \
        mail -s "Network Alert" "$ALERT_EMAIL"
    else
        echo "$(date): Connectivity to $host OK" >> "$LOG_FILE"
    fi
done

# Check DNS resolution
if ! nslookup google.com >/dev/null 2>&1; then
    echo "$(date): DNS resolution FAILED" >> "$LOG_FILE"
    echo "DNS resolution failed on $(hostname)" | \
    mail -s "DNS Alert" "$ALERT_EMAIL"
fi

# Check critical services
SERVICES=("ssh" "apache2" "nginx")
for service in "${SERVICES[@]}"; do
    if systemctl is-active --quiet "$service"; then
        PORT=$(systemctl show "$service" -p Listen | cut -d= -f2)
        if [ -n "$PORT" ] && ! netstat -tuln | grep -q "$PORT"; then
            echo "$(date): $service port not listening" >> "$LOG_FILE"
        fi
    fi
done
```

### Network Performance Optimization
```bash
# Check network interface statistics
cat /proc/net/dev              # Interface statistics
ip -s link show eth0           # Interface statistics with ip
ethtool -S eth0                # Driver statistics

# Network buffer tuning
echo 'net.core.rmem_max = 134217728' >> /etc/sysctl.conf
echo 'net.core.wmem_max = 134217728' >> /etc/sysctl.conf
sysctl -p                      # Apply settings

# Check network errors
netstat -i                     # Interface error counters
cat /proc/net/snmp             # SNMP statistics
```

This networking troubleshooting guide provides systematic approaches to diagnose and resolve connectivity, DNS, firewall, and routing issues, enabling rapid identification and resolution of network problems.