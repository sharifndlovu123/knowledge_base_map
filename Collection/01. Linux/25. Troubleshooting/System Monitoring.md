# 05. Linux System Monitoring and Troubleshooting

## Overview

System monitoring involves tracking performance metrics, analyzing logs, and setting up alerts to maintain system health and quickly identify issues.

## Performance Monitoring Tools

### htop - Interactive Process Viewer
```bash
# Install and use htop
sudo apt install htop
htop

# Key htop features:
# - Real-time process monitoring
# - CPU/memory usage per core
# - Process tree view (F5)
# - Kill processes (F9)
# - Search processes (F3)
# - Filter by user (u)

# Configure htop colors and layout
# Setup -> Display options -> Detailed CPU time
```

### System Resource Monitoring
```bash
# CPU monitoring
top                           # Classic process monitor
iostat 1                      # CPU and I/O statistics
vmstat 1                      # Virtual memory stats
sar -u 1 10                   # CPU utilization over time
mpstat 1                      # Multi-processor statistics

# Memory monitoring
free -h                       # Memory usage
watch -n 1 'free -h'         # Continuous memory monitoring
cat /proc/meminfo             # Detailed memory information
pmap -x PID                   # Process memory mapping

# Disk I/O monitoring
iotop                         # I/O usage by process
iotop -o                      # Only show active I/O
iostat -x 1                   # Extended I/O statistics
atop                          # Advanced system monitor
```

### Network Monitoring
```bash
# Network traffic monitoring
iftop                         # Interface bandwidth usage
nethogs                       # Network usage by process
vnstat                        # Network traffic statistics
ss -tuln                      # Socket statistics
netstat -i                    # Interface statistics

# Real-time network monitoring
watch -n 1 'ss -tuln | grep :80'
tcpdump -i eth0               # Packet capture
wireshark                     # GUI packet analyzer

# Network performance testing
iperf3 -s                     # Server mode
iperf3 -c server_ip           # Client test
ping -c 10 8.8.8.8           # Latency test
traceroute google.com         # Route tracing
```

## Log Management and Analysis

### System Logs Location
```bash
# Main log directories
/var/log/                     # Primary log directory
/var/log/syslog              # General system messages
/var/log/auth.log            # Authentication logs
/var/log/kern.log            # Kernel messages
/var/log/mail.log            # Mail server logs
/var/log/apache2/            # Apache web server logs
/var/log/nginx/              # Nginx web server logs

# Application-specific logs
/var/log/mysql/              # MySQL logs
/var/log/postgresql/         # PostgreSQL logs
/var/log/fail2ban.log        # Fail2ban logs
```

### Log Analysis with journalctl
```bash
# Basic journalctl usage
journalctl                    # All journal entries
journalctl -f                 # Follow logs (tail -f style)
journalctl -n 50              # Last 50 entries
journalctl --since "1 hour ago"  # Last hour
journalctl --since "2024-01-01"  # Since specific date

# Filter by service
journalctl -u ssh             # SSH service logs
journalctl -u apache2         # Apache service logs
journalctl -u nginx           # Nginx service logs

# Filter by priority
journalctl -p err             # Error level and above
journalctl -p warning         # Warning level and above
journalctl -p crit            # Critical level and above

# Advanced filtering
journalctl _COMM=sshd         # SSH daemon messages
journalctl _UID=1000          # Messages from specific user
journalctl -k                 # Kernel messages only
journalctl --list-boots       # Available boot sessions
```

### Log Analysis Scripts
```bash
#!/bin/bash
# Log analysis script for security events

LOG_FILE="/var/log/auth.log"
REPORT_FILE="/tmp/security-report-$(date +%Y%m%d).txt"

echo "Security Log Analysis - $(date)" > "$REPORT_FILE"
echo "=================================" >> "$REPORT_FILE"

# Failed SSH attempts
echo "Failed SSH Login Attempts:" >> "$REPORT_FILE"
grep "Failed password" "$LOG_FILE" | tail -20 >> "$REPORT_FILE"

# Successful logins
echo -e "\nSuccessful SSH Logins:" >> "$REPORT_FILE"
grep "Accepted password" "$LOG_FILE" | tail -10 >> "$REPORT_FILE"

# Sudo usage
echo -e "\nSudo Commands:" >> "$REPORT_FILE"
grep "sudo:" "$LOG_FILE" | tail -10 >> "$REPORT_FILE"

# Summary statistics
FAILED_COUNT=$(grep -c "Failed password" "$LOG_FILE")
SUCCESS_COUNT=$(grep -c "Accepted password" "$LOG_FILE")
SUDO_COUNT=$(grep -c "sudo:" "$LOG_FILE")

echo -e "\nSummary:" >> "$REPORT_FILE"
echo "Failed logins: $FAILED_COUNT" >> "$REPORT_FILE"
echo "Successful logins: $SUCCESS_COUNT" >> "$REPORT_FILE"
echo "Sudo commands: $SUDO_COUNT" >> "$REPORT_FILE"

cat "$REPORT_FILE"
```

## Alerting and Notification Systems

### Email Alerts Setup
```bash
# Install mail utilities
sudo apt install mailutils postfix

# Configure postfix for local delivery
sudo dpkg-reconfigure postfix

# Test email functionality
echo "Test message" | mail -s "Test Subject" user@example.com

# Alert script for high CPU usage
#!/bin/bash
CPU_THRESHOLD=80
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | sed 's/%us,//')

if (( $(echo "$CPU_USAGE > $CPU_THRESHOLD" | bc -l) )); then
    echo "High CPU usage detected: ${CPU_USAGE}%" | \
    mail -s "CPU Alert - $(hostname)" admin@example.com
fi
```

### Advanced Monitoring with Nagios
```bash
# Install Nagios
sudo apt update
sudo apt install nagios4 nagios-plugins-contrib

# Start Nagios
sudo systemctl start nagios4
sudo systemctl enable nagios4

# Access web interface at http://localhost/nagios4

# Custom Nagios check script
#!/bin/bash
# /usr/local/nagios/libexec/check_disk_usage.sh

PARTITION="$1"
WARNING="$2"
CRITICAL="$3"

if [ $# -ne 3 ]; then
    echo "Usage: $0 <partition> <warning%> <critical%>"
    exit 3
fi

USAGE=$(df "$PARTITION" | awk 'NR==2 {print $5}' | sed 's/%//')

if [ "$USAGE" -ge "$CRITICAL" ]; then
    echo "CRITICAL - Disk usage ${USAGE}% on $PARTITION"
    exit 2
elif [ "$USAGE" -ge "$WARNING" ]; then
    echo "WARNING - Disk usage ${USAGE}% on $PARTITION"
    exit 1
else
    echo "OK - Disk usage ${USAGE}% on $PARTITION"
    exit 0
fi
```

### Prometheus and Grafana Setup
```bash
# Install Prometheus
sudo apt install prometheus

# Basic Prometheus configuration (/etc/prometheus/prometheus.yml)
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']

# Install Node Exporter for system metrics
sudo apt install prometheus-node-exporter

# Install Grafana
sudo apt install software-properties-common
sudo add-apt-repository "deb https://packages.grafana.com/oss/deb stable main"
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
sudo apt update
sudo apt install grafana

# Start services
sudo systemctl start prometheus
sudo systemctl start prometheus-node-exporter
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# Access Grafana at http://localhost:3000 (admin/admin)
```

## System Health Monitoring

### Automated Health Checks
```bash
#!/bin/bash
# Comprehensive system health check

HEALTH_REPORT="/tmp/system-health-$(date +%Y%m%d-%H%M).txt"

echo "System Health Report - $(date)" > "$HEALTH_REPORT"
echo "======================================" >> "$HEALTH_REPORT"

# Check system load
LOAD=$(uptime | awk '{print $(NF-2)}' | sed 's/,//')
echo "System Load: $LOAD" >> "$HEALTH_REPORT"

# Check memory usage
MEMORY=$(free | awk '/^Mem:/ {printf "%.1f", $3/$2 * 100}')
echo "Memory Usage: ${MEMORY}%" >> "$HEALTH_REPORT"

# Check disk usage
echo "Disk Usage:" >> "$HEALTH_REPORT"
df -h | grep -E '^/dev/' >> "$HEALTH_REPORT"

# Check running services
echo -e "\nCritical Services Status:" >> "$HEALTH_REPORT"
SERVICES=("ssh" "apache2" "mysql" "nginx")
for service in "${SERVICES[@]}"; do
    if systemctl is-active --quiet "$service"; then
        echo "$service: Running" >> "$HEALTH_REPORT"
    else
        echo "$service: Stopped" >> "$HEALTH_REPORT"
    fi
done

# Check network connectivity
echo -e "\nNetwork Connectivity:" >> "$HEALTH_REPORT"
if ping -c 1 8.8.8.8 >/dev/null 2>&1; then
    echo "Internet: Connected" >> "$HEALTH_REPORT"
else
    echo "Internet: Disconnected" >> "$HEALTH_REPORT"
fi

# Check for errors in logs
echo -e "\nRecent Errors:" >> "$HEALTH_REPORT"
journalctl -p err --since "1 hour ago" --no-pager | tail -5 >> "$HEALTH_REPORT"

cat "$HEALTH_REPORT"

# Send alert if critical issues found
CRITICAL_ISSUES=$(grep -c "Disconnected\|Stopped\|Error" "$HEALTH_REPORT")
if [ "$CRITICAL_ISSUES" -gt 0 ]; then
    mail -s "System Health Alert - $(hostname)" admin@example.com < "$HEALTH_REPORT"
fi
```

### Process Monitoring
```bash
# Monitor specific processes
#!/bin/bash
# Process monitoring script

PROCESSES=("apache2" "mysql" "nginx" "ssh")
LOG_FILE="/var/log/process-monitor.log"

for process in "${PROCESSES[@]}"; do
    if ! pgrep "$process" > /dev/null; then
        echo "$(date): $process is not running" >> "$LOG_FILE"
        
        # Attempt to restart service
        if systemctl start "$process"; then
            echo "$(date): Successfully restarted $process" >> "$LOG_FILE"
        else
            echo "$(date): Failed to restart $process" >> "$LOG_FILE"
            echo "$process failed to restart on $(hostname)" | \
            mail -s "Service Restart Failed" admin@example.com
        fi
    fi
done

# Monitor process resource usage
ps aux --sort=-%cpu | head -10 > /tmp/top-cpu-processes.txt
ps aux --sort=-%mem | head -10 > /tmp/top-memory-processes.txt
```

## Real-time Monitoring Dashboard

### Simple Web Dashboard
```bash
#!/bin/bash
# Generate HTML dashboard

DASHBOARD_FILE="/var/www/html/dashboard.html"

cat > "$DASHBOARD_FILE" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>System Dashboard</title>
    <meta http-equiv="refresh" content="30">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .critical { background: #ffcccc; }
        .warning { background: #ffffcc; }
        .ok { background: #ccffcc; }
    </style>
</head>
<body>
    <h1>System Dashboard - $(hostname)</h1>
    <p>Last Updated: $(date)</p>
    
    <div class="metric">
        <h3>System Load</h3>
        <p>$(uptime)</p>
    </div>
    
    <div class="metric">
        <h3>Memory Usage</h3>
        <pre>$(free -h)</pre>
    </div>
    
    <div class="metric">
        <h3>Disk Usage</h3>
        <pre>$(df -h | grep -E '^/dev/')</pre>
    </div>
    
    <div class="metric">
        <h3>Network Interfaces</h3>
        <pre>$(ip addr show | grep -E '^[0-9]+:|inet ')</pre>
    </div>
    
    <div class="metric">
        <h3>Top Processes (CPU)</h3>
        <pre>$(ps aux --sort=-%cpu | head -10)</pre>
    </div>
    
</body>
</html>
EOF

echo "Dashboard generated at $DASHBOARD_FILE"
```

## Troubleshooting Common Issues

### High CPU Usage Investigation
```bash
# Identify high CPU processes
top -bn1 | head -20
ps aux --sort=-%cpu | head -10

# Monitor CPU usage over time
sar -u 1 60 > cpu_usage.log

# Check for CPU-intensive scripts
ps aux | grep -E "(python|php|perl|bash)" | grep -v grep

# Kill runaway processes
pkill -f suspicious_process_name

# Check system load history
sar -q | tail -20
```

### Memory Issues Diagnosis
```bash
# Check memory usage
free -h
cat /proc/meminfo

# Find memory-hungry processes
ps aux --sort=-%mem | head -10

# Check for memory leaks
valgrind --tool=memcheck --leak-check=full ./program

# Clear cache if needed (emergency only)
sync && echo 3 > /proc/sys/vm/drop_caches

# Check swap usage
swapon --show
cat /proc/swaps
```

### Disk Space Problems
```bash
# Find large files and directories
du -sh /* | sort -h
find / -type f -size +100M 2>/dev/null
ncdu /                        # Interactive disk usage analyzer

# Clean up common locations
sudo apt autoremove           # Remove unused packages
sudo apt autoclean           # Clean package cache
sudo journalctl --vacuum-time=7d  # Clean old journal entries

# Check for deleted files still open
lsof +L1                      # Files deleted but still open

# Monitor disk I/O
iotop -o                      # Only active I/O
iostat -x 1                   # Extended statistics
```

### Network Connectivity Issues
```bash
# Basic connectivity tests
ping -c 4 8.8.8.8            # Test external connectivity
ping -c 4 gateway_ip          # Test gateway connectivity
traceroute destination        # Trace network path
mtr destination               # Combined ping/traceroute

# Check network configuration
ip addr show                  # IP addresses
ip route show                 # Routing table
ss -tuln                      # Open ports
netstat -rn                   # Routing table (legacy)

# DNS troubleshooting
nslookup domain.com
dig domain.com
systemd-resolve --status      # systemd-resolved status

# Firewall check
sudo iptables -L -n           # Firewall rules
sudo ufw status               # UFW status
```

### Service Troubleshooting
```bash
# Service status and logs
systemctl status service_name
journalctl -u service_name -f
journalctl -u service_name --since "1 hour ago"

# Service dependencies
systemctl list-dependencies service_name
systemctl show service_name

# Restart and reload services
sudo systemctl restart service_name
sudo systemctl reload service_name
sudo systemctl daemon-reload

# Check service configuration
systemctl cat service_name
systemctl show service_name --property=ExecStart
```

This monitoring framework provides comprehensive system oversight, enabling proactive issue detection and rapid troubleshooting through continuous monitoring, log analysis, and automated alerting mechanisms.