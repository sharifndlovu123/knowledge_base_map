# 03. System Integrity, Security Scans, and Standards Maintenance

## Overview

Maintaining system integrity involves continuous monitoring, vulnerability scanning, compliance verification, and adherence to security standards. This comprehensive guide covers tools and practices for ensuring system security and compliance.

## File Integrity Monitoring

### AIDE (Advanced Intrusion Detection Environment)
```bash
# Install AIDE
sudo apt install aide                    # Debian/Ubuntu
sudo yum install aide                    # CentOS/RHEL

# Initialize AIDE database
sudo aideinit
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Configuration file (/etc/aide/aide.conf)
# Define what to monitor
/bin    f+p+u+g+s+b+m+c+md5+sha1
/sbin   f+p+u+g+s+b+m+c+md5+sha1
/etc    f+p+u+g+s+b+m+c+md5+sha1
/lib    f+p+u+g+s+b+m+c+md5+sha1
/boot   f+p+u+g+s+b+m+c+md5+sha1

# Exclude directories
!/proc
!/sys
!/dev
!/tmp
!/var/log

# Run integrity check
sudo aide --check
sudo aide --check --verbose

# Update database after legitimate changes
sudo aide --update
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Custom AIDE rules
MyRule = p+i+n+u+g+s+b+m+c+md5+sha1+rmd160+tiger

# Automated monitoring script
#!/bin/bash
AIDE_LOG="/var/log/aide.log"
DATE=$(date)

echo "[$DATE] Running AIDE integrity check" >> $AIDE_LOG
aide --check >> $AIDE_LOG 2>&1

if [ $? -ne 0 ]; then
    echo "[$DATE] AIDE detected changes!" >> $AIDE_LOG
    mail -s "AIDE Alert - System Changes Detected" admin@example.com < $AIDE_LOG
fi
```

### Tripwire (Commercial Alternative)
```bash
# Install Tripwire (commercial version)
# Download from www.tripwire.com

# Open source alternative - OSSEC
sudo apt install ossec-hids-server

# OSSEC configuration (/var/ossec/etc/ossec.conf)
<ossec_config>
  <syscheck>
    <frequency>7200</frequency>
    <directories check_all="yes">/etc,/usr/bin,/usr/sbin</directories>
    <directories check_all="yes">/bin,/sbin</directories>
    <ignore>/etc/mtab</ignore>
    <ignore>/etc/hosts.deny</ignore>
    <ignore>/etc/mail/statistics</ignore>
    <ignore>/etc/random-seed</ignore>
  </syscheck>
</ossec_config>

# Start OSSEC
sudo /var/ossec/bin/ossec-control start
```

### Custom Integrity Monitoring
```bash
#!/bin/bash
# Custom file integrity monitoring script

BASELINE_DIR="/var/lib/integrity"
MONITORED_DIRS="/etc /bin /sbin /usr/bin /usr/sbin"
REPORT_FILE="/var/log/integrity-report.log"

create_baseline() {
    mkdir -p "$BASELINE_DIR"
    for dir in $MONITORED_DIRS; do
        if [ -d "$dir" ]; then
            find "$dir" -type f -exec sha256sum {} \; > "$BASELINE_DIR/$(basename $dir).baseline"
        fi
    done
    echo "Baseline created at $(date)" > "$BASELINE_DIR/baseline.date"
}

check_integrity() {
    echo "Integrity check started at $(date)" >> "$REPORT_FILE"
    
    for dir in $MONITORED_DIRS; do
        if [ -d "$dir" ] && [ -f "$BASELINE_DIR/$(basename $dir).baseline" ]; then
            echo "Checking $dir..." >> "$REPORT_FILE"
            
            # Generate current checksums
            find "$dir" -type f -exec sha256sum {} \; > "/tmp/$(basename $dir).current"
            
            # Compare with baseline
            diff "$BASELINE_DIR/$(basename $dir).baseline" "/tmp/$(basename $dir).current" >> "$REPORT_FILE"
            
            if [ $? -ne 0 ]; then
                echo "Changes detected in $dir!" >> "$REPORT_FILE"
                mail -s "File Integrity Alert: Changes in $dir" admin@example.com < "$REPORT_FILE"
            fi
            
            rm "/tmp/$(basename $dir).current"
        fi
    done
}

case "$1" in
    baseline) create_baseline ;;
    check) check_integrity ;;
    *) echo "Usage: $0 {baseline|check}" ;;
esac
```

## Vulnerability Scanning

### OpenVAS/GVM (Greenbone Vulnerability Management)
```bash
# Install OpenVAS/GVM
sudo apt update
sudo apt install gvm

# Setup GVM
sudo gvm-setup

# Start GVM services
sudo systemctl start gvm
sudo systemctl enable gvm

# Create admin user
sudo runuser -u _gvm -- gvmd --create-user=admin --password=admin

# Access web interface at https://localhost:9392

# Command line scanning
gvm-cli socket --xml "<get_targets/>"
gvm-cli socket --xml "<create_target><name>Test Target</name><hosts>192.168.1.0/24</hosts></create_target>"

# Automated scan script
#!/bin/bash
TARGET="192.168.1.0/24"
SCAN_NAME="Daily Network Scan"

# Create target
TARGET_ID=$(gvm-cli socket --xml \
    "<create_target><name>$SCAN_NAME Target</name><hosts>$TARGET</hosts></create_target>" | \
    grep -o 'id="[^"]*"' | cut -d'"' -f2)

# Create scan config
TASK_ID=$(gvm-cli socket --xml \
    "<create_task><name>$SCAN_NAME</name><target id=\"$TARGET_ID\"/><config id=\"daba56c8-73ec-11df-a475-002264764cea\"/></create_task>" | \
    grep -o 'id="[^"]*"' | cut -d'"' -f2)

# Start scan
gvm-cli socket --xml "<start_task task_id=\"$TASK_ID\"/>"

echo "Scan started with Task ID: $TASK_ID"
```

### Nessus (Commercial)
```bash
# Install Nessus (download from tenable.com)
sudo dpkg -i Nessus-10.x.x-ubuntu1404_amd64.deb

# Start Nessus
sudo systemctl start nessusd
sudo systemctl enable nessusd

# Access web interface at https://localhost:8834

# Nessus command line interface
/opt/nessus/bin/nessuscli adduser admin
/opt/nessus/bin/nessuscli ls
/opt/nessus/bin/nessuscli update

# Automated Nessus scanning with API
#!/bin/bash
NESSUS_URL="https://localhost:8834"
USERNAME="admin"
PASSWORD="password"

# Login and get token
TOKEN=$(curl -k -H "Content-Type: application/json" \
    -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" \
    "$NESSUS_URL/session" | jq -r '.token')

# Create scan
SCAN_ID=$(curl -k -H "X-Cookie: token=$TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"uuid":"731a8e52-3ea6-a291-ec0a-d2ff0619c19d7bd788d6","settings":{"name":"API Scan","text_targets":"192.168.1.0/24"}}' \
    "$NESSUS_URL/scans" | jq -r '.scan.id')

# Launch scan
curl -k -H "X-Cookie: token=$TOKEN" \
    -X POST "$NESSUS_URL/scans/$SCAN_ID/launch"

echo "Scan launched with ID: $SCAN_ID"
```

### Lynis (System Auditing)
```bash
# Install Lynis
sudo apt install lynis
# Or download from https://cisofy.com/lynis/

# Run basic audit
sudo lynis audit system

# Detailed audit with custom profile
sudo lynis audit system --profile /etc/lynis/custom.prf

# Generate report
sudo lynis audit system --report-file /var/log/lynis-report.dat

# Custom Lynis profile (/etc/lynis/custom.prf)
# Skip specific tests
skip-test=AUTH-9262
skip-test=FILE-6310

# Custom tests
config:kernel_change_log:on
config:ssh_root_login:off
config:firewall_installed:on

# Automated Lynis scanning
#!/bin/bash
REPORT_DIR="/var/log/lynis"
DATE=$(date +%Y%m%d)

mkdir -p "$REPORT_DIR"

# Run Lynis audit
lynis audit system --report-file "$REPORT_DIR/lynis-$DATE.dat" \
    --log-file "$REPORT_DIR/lynis-$DATE.log"

# Check for critical findings
CRITICAL=$(grep "critical" "$REPORT_DIR/lynis-$DATE.log" | wc -l)
WARNING=$(grep "warning" "$REPORT_DIR/lynis-$DATE.log" | wc -l)

if [ $CRITICAL -gt 0 ] || [ $WARNING -gt 10 ]; then
    echo "Lynis found $CRITICAL critical and $WARNING warning issues" | \
    mail -s "Lynis Security Audit Alert" -a "$REPORT_DIR/lynis-$DATE.log" admin@example.com
fi
```

### Nmap Security Scanning
```bash
# Network discovery and vulnerability scanning
nmap -sS -O -sV --script vuln 192.168.1.0/24

# Specific vulnerability scans
nmap --script smb-vuln-* 192.168.1.0/24
nmap --script ssl-* 192.168.1.0/24
nmap --script http-vuln-* 192.168.1.0/24

# Advanced scanning script
#!/bin/bash
NETWORK="192.168.1.0/24"
REPORT_DIR="/var/log/nmap-scans"
DATE=$(date +%Y%m%d)

mkdir -p "$REPORT_DIR"

# Network discovery
nmap -sn "$NETWORK" > "$REPORT_DIR/hosts-$DATE.txt"

# Port scanning
nmap -sS -T4 -p- "$NETWORK" > "$REPORT_DIR/ports-$DATE.txt"

# Service detection
nmap -sV -sC "$NETWORK" > "$REPORT_DIR/services-$DATE.txt"

# Vulnerability scanning
nmap --script vuln "$NETWORK" > "$REPORT_DIR/vulns-$DATE.txt"

# OS detection
nmap -O "$NETWORK" > "$REPORT_DIR/os-$DATE.txt"

# Generate summary
echo "Nmap scan completed on $(date)" > "$REPORT_DIR/summary-$DATE.txt"
echo "Hosts discovered: $(grep "Nmap scan report" "$REPORT_DIR/hosts-$DATE.txt" | wc -l)" >> "$REPORT_DIR/summary-$DATE.txt"
echo "Open ports found: $(grep "open" "$REPORT_DIR/ports-$DATE.txt" | wc -l)" >> "$REPORT_DIR/summary-$DATE.txt"
echo "Vulnerabilities found: $(grep "VULNERABLE" "$REPORT_DIR/vulns-$DATE.txt" | wc -l)" >> "$REPORT_DIR/summary-$DATE.txt"
```

## Compliance and Standards

### CIS Benchmarks
```bash
# Install CIS-CAT tool (Center for Internet Security)
# Download from https://www.cisecurity.org/cis-cat/

# Run CIS benchmark assessment
./Assessor-CLI.sh -i -rd /var/www/html/reports/ -nts -rp index

# Automated CIS compliance checking
#!/bin/bash
CIS_SCRIPT="/opt/cis-cat/Assessor-CLI.sh"
REPORT_DIR="/var/log/cis-reports"
DATE=$(date +%Y%m%d)

mkdir -p "$REPORT_DIR"

# Run CIS assessment
$CIS_SCRIPT -b benchmarks/CIS_Ubuntu_Linux_20.04_LTS_Benchmark_v1.1.0-xccdf.xml \
    -r "$REPORT_DIR/cis-report-$DATE.html" \
    -t text \
    -rp index

# Parse results
PASS=$(grep -c "Result.*Pass" "$REPORT_DIR/cis-report-$DATE.txt")
FAIL=$(grep -c "Result.*Fail" "$REPORT_DIR/cis-report-$DATE.txt")

echo "CIS Benchmark Results: $PASS passed, $FAIL failed" | \
mail -s "CIS Compliance Report" -a "$REPORT_DIR/cis-report-$DATE.html" admin@example.com
```

### SCAP (Security Content Automation Protocol)
```bash
# Install OpenSCAP
sudo apt install libopenscap8 openscap-utils scap-security-guide

# List available profiles
oscap info /usr/share/scap-security-guide/ssg-ubuntu2004-ds.xml

# Run SCAP scan
oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_standard \
    --results-arf results.xml \
    --report report.html \
    /usr/share/scap-security-guide/ssg-ubuntu2004-ds.xml

# Generate remediation script
oscap xccdf generate fix --profile xccdf_org.ssgproject.content_profile_standard \
    --output remediation.sh \
    results.xml

# Automated SCAP compliance
#!/bin/bash
SCAP_CONTENT="/usr/share/scap-security-guide/ssg-ubuntu2004-ds.xml"
PROFILE="xccdf_org.ssgproject.content_profile_standard"
REPORT_DIR="/var/log/scap-reports"
DATE=$(date +%Y%m%d)

mkdir -p "$REPORT_DIR"

# Run SCAP evaluation
oscap xccdf eval \
    --profile "$PROFILE" \
    --results-arf "$REPORT_DIR/scap-results-$DATE.xml" \
    --report "$REPORT_DIR/scap-report-$DATE.html" \
    "$SCAP_CONTENT"

# Generate remediation
oscap xccdf generate fix \
    --profile "$PROFILE" \
    --output "$REPORT_DIR/remediation-$DATE.sh" \
    "$REPORT_DIR/scap-results-$DATE.xml"

# Check compliance score
SCORE=$(oscap xccdf eval --profile "$PROFILE" "$SCAP_CONTENT" 2>&1 | \
    grep "Score" | awk '{print $2}')

echo "SCAP Compliance Score: $SCORE" | \
mail -s "SCAP Compliance Report" -a "$REPORT_DIR/scap-report-$DATE.html" admin@example.com
```

### STIG (Security Technical Implementation Guides)
```bash
# Download STIG content from DISA
# Available at https://public.cyber.mil/stigs/

# Apply STIG using Ansible
# RHEL 8 STIG playbook example
---
- name: Apply RHEL 8 STIG
  hosts: rhel8_servers
  become: yes
  
  tasks:
    - name: Set password minimum length
      lineinfile:
        path: /etc/security/pwquality.conf
        regexp: '^minlen'
        line: 'minlen = 15'
    
    - name: Configure password complexity
      lineinfile:
        path: /etc/security/pwquality.conf
        regexp: '^{{ item.key }}'
        line: '{{ item.key }} = {{ item.value }}'
      loop:
        - { key: 'dcredit', value: '-1' }
        - { key: 'ucredit', value: '-1' }
        - { key: 'lcredit', value: '-1' }
        - { key: 'ocredit', value: '-1' }
    
    - name: Set session timeout
      lineinfile:
        path: /etc/bashrc
        line: 'TMOUT=900'
        create: yes
    
    - name: Configure audit rules
      blockinfile:
        path: /etc/audit/rules.d/stig.rules
        create: yes
        block: |
          -w /etc/passwd -p wa -k identity
          -w /etc/group -p wa -k identity
          -w /etc/gshadow -p wa -k identity
          -w /etc/shadow -p wa -k identity
          -w /var/log/faillog -p wa -k logins
          -w /var/log/lastlog -p wa -k logins

# STIG validation script
#!/bin/bash
STIG_CHECKS="/opt/stig-checks"
REPORT_FILE="/var/log/stig-compliance.log"

echo "STIG Compliance Check - $(date)" > "$REPORT_FILE"

# Check password policy
if grep -q "minlen = 15" /etc/security/pwquality.conf; then
    echo "PASS: Password minimum length configured" >> "$REPORT_FILE"
else
    echo "FAIL: Password minimum length not configured" >> "$REPORT_FILE"
fi

# Check session timeout
if grep -q "TMOUT=900" /etc/bashrc; then
    echo "PASS: Session timeout configured" >> "$REPORT_FILE"
else
    echo "FAIL: Session timeout not configured" >> "$REPORT_FILE"
fi

# Check audit configuration
if [ -f /etc/audit/rules.d/stig.rules ]; then
    echo "PASS: STIG audit rules present" >> "$REPORT_FILE"
else
    echo "FAIL: STIG audit rules missing" >> "$REPORT_FILE"
fi

# Summary
PASS_COUNT=$(grep -c "PASS:" "$REPORT_FILE")
FAIL_COUNT=$(grep -c "FAIL:" "$REPORT_FILE")

echo "Summary: $PASS_COUNT passed, $FAIL_COUNT failed" >> "$REPORT_FILE"
```

## Container Security Scanning

### Docker Security
```bash
# Install Docker Bench Security
git clone https://github.com/docker/docker-bench-security.git
cd docker-bench-security
sudo sh docker-bench-security.sh

# Trivy container scanning
sudo apt install wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt update
sudo apt install trivy

# Scan container images
trivy image nginx:latest
trivy image --severity HIGH,CRITICAL ubuntu:20.04
trivy image --format json --output results.json myapp:latest

# Scan filesystem
trivy fs /path/to/project

# Automated container scanning
#!/bin/bash
IMAGES=$(docker images --format "{{.Repository}}:{{.Tag}}" | grep -v "<none>")
REPORT_DIR="/var/log/container-scans"
DATE=$(date +%Y%m%d)

mkdir -p "$REPORT_DIR"

for image in $IMAGES; do
    echo "Scanning $image..."
    trivy image --format json --output "$REPORT_DIR/${image//\//_}-$DATE.json" "$image"
    
    # Check for critical vulnerabilities
    CRITICAL=$(trivy image --format table "$image" | grep -c "CRITICAL")
    if [ $CRITICAL -gt 0 ]; then
        echo "CRITICAL vulnerabilities found in $image: $CRITICAL" | \
        mail -s "Container Security Alert" admin@example.com
    fi
done
```

### Kubernetes Security
```bash
# Install kube-bench (CIS Kubernetes Benchmark)
curl -L https://github.com/aquasecurity/kube-bench/releases/latest/download/kube-bench_linux_amd64.tar.gz -o kube-bench.tar.gz
tar xvf kube-bench.tar.gz
sudo mv kube-bench /usr/local/bin/

# Run Kubernetes CIS benchmark
kube-bench run --targets master
kube-bench run --targets node

# Install kube-hunter (Kubernetes penetration testing)
pip3 install kube-hunter

# Run Kubernetes security assessment
kube-hunter --remote 192.168.1.100

# Install Falco (Runtime security monitoring)
curl -s https://falco.org/repo/falcosecurity-3672BA8F.asc | apt-key add -
echo "deb https://download.falco.org/packages/deb stable main" | tee -a /etc/apt/sources.list.d/falcosecurity.list
apt-get update -y
apt-get install -y falco

# Falco rules for suspicious activity
# /etc/falco/falco_rules.local.yaml
- rule: Shell in Container
  desc: Notice shell activity within a container
  condition: >
    spawned_process and container and
    (proc.name = bash or proc.name = sh)
  output: >
    Shell spawned in container (user=%user.name container_id=%container.id 
    container_name=%container.name shell=%proc.name parent=%proc.pname cmdline=%proc.cmdline)
  priority: WARNING
  tags: [shell, container]
```

## Network Security Monitoring

### Suricata IDS/IPS
```bash
# Install Suricata
sudo apt update
sudo apt install suricata

# Configuration (/etc/suricata/suricata.yaml)
vars:
  address-groups:
    HOME_NET: "[192.168.1.0/24]"
    EXTERNAL_NET: "!$HOME_NET"

af-packet:
  - interface: eth0
    cluster-id: 99
    cluster-type: cluster_flow

# Update rules
sudo suricata-update

# Start Suricata
sudo systemctl start suricata
sudo systemctl enable suricata

# Monitor alerts
tail -f /var/log/suricata/fast.log
tail -f /var/log/suricata/eve.json

# Custom Suricata rules
# /etc/suricata/rules/local.rules
alert tcp any any -> $HOME_NET 22 (msg:"SSH Brute Force Attempt"; flow:to_server,established; content:"SSH"; detection_filter:track by_src, count 5, seconds 60; sid:1000001; rev:1;)

alert http any any -> $HOME_NET any (msg:"Suspicious User Agent"; content:"sqlmap"; http_user_agent; sid:1000002; rev:1;)
```

### OSSEC HIDS
```bash
# Install OSSEC
wget https://github.com/ossec/ossec-hids/archive/3.7.0.tar.gz
tar xzf 3.7.0.tar.gz
cd ossec-hids-3.7.0
sudo ./install.sh

# OSSEC configuration (/var/ossec/etc/ossec.conf)
<ossec_config>
  <global>
    <email_notification>yes</email_notification>
    <email_to>admin@example.com</email_to>
    <smtp_server>localhost</smtp_server>
    <email_from>ossec@example.com</email_from>
  </global>

  <rules>
    <include>rules_config.xml</include>
    <include>pam_rules.xml</include>
    <include>sshd_rules.xml</include>
    <include>apache_rules.xml</include>
    <include>local_rules.xml</include>
  </rules>

  <syscheck>
    <frequency>7200</frequency>
    <directories check_all="yes">/etc,/usr/bin,/usr/sbin</directories>
    <directories check_all="yes">/bin,/sbin</directories>
  </syscheck>

  <rootcheck>
    <frequency>36000</frequency>
  </rootcheck>

  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/auth.log</location>
  </localfile>

  <localfile>
    <log_format>apache</log_format>
    <location>/var/log/apache2/access.log</location>
  </localfile>
</ossec_config>

# Custom OSSEC rules (/var/ossec/rules/local_rules.xml)
<group name="local,syslog,">
  <rule id="100001" level="10">
    <if_sid>5501</if_sid>
    <description>Multiple SSH login attempts</description>
    <same_source_ip />
    <frequency>5</frequency>
    <timeframe>300</timeframe>
  </rule>
</group>
```

## Automated Security Monitoring

### Security Dashboard Script
```bash
#!/bin/bash
# Comprehensive security status dashboard

REPORT_FILE="/var/log/security-dashboard.html"
DATE=$(date)

cat > "$REPORT_FILE" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Security Dashboard - $DATE</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .status-ok { color: green; font-weight: bold; }
        .status-warning { color: orange; font-weight: bold; }
        .status-critical { color: red; font-weight: bold; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Security Dashboard</h1>
    <p>Generated: $DATE</p>
    
    <h2>System Status</h2>
    <table>
        <tr><th>Component</th><th>Status</th><th>Details</th></tr>
EOF

# Check services
check_service() {
    local service=$1
    if systemctl is-active --quiet "$service"; then
        echo "<tr><td>$service</td><td class='status-ok'>Running</td><td>Service active</td></tr>" >> "$REPORT_FILE"
    else
        echo "<tr><td>$service</td><td class='status-critical'>Stopped</td><td>Service inactive</td></tr>" >> "$REPORT_FILE"
    fi
}

check_service "ssh"
check_service "ufw"
check_service "fail2ban"

# Check disk usage
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    DISK_STATUS="status-ok"
elif [ "$DISK_USAGE" -lt 90 ]; then
    DISK_STATUS="status-warning"
else
    DISK_STATUS="status-critical"
fi
echo "<tr><td>Disk Usage</td><td class='$DISK_STATUS'>${DISK_USAGE}%</td><td>Root filesystem usage</td></tr>" >> "$REPORT_FILE"

# Check failed login attempts
FAILED_LOGINS=$(grep "Failed password" /var/log/auth.log | grep "$(date +%b\ %e)" | wc -l)
if [ "$FAILED_LOGINS" -lt 10 ]; then
    LOGIN_STATUS="status-ok"
elif [ "$FAILED_LOGINS" -lt 50 ]; then
    LOGIN_STATUS="status-warning"
else
    LOGIN_STATUS="status-critical"
fi
echo "<tr><td>Failed Logins Today</td><td class='$LOGIN_STATUS'>$FAILED_LOGINS</td><td>SSH authentication failures</td></tr>" >> "$REPORT_FILE"

# Check system updates
UPDATES=$(apt list --upgradable 2>/dev/null | grep -v "Listing" | wc -l)
if [ "$UPDATES" -eq 0 ]; then
    UPDATE_STATUS="status-ok"
elif [ "$UPDATES" -lt 20 ]; then
    UPDATE_STATUS="status-warning"
else
    UPDATE_STATUS="status-critical"
fi
echo "<tr><td>Available Updates</td><td class='$UPDATE_STATUS'>$UPDATES</td><td>Package updates pending</td></tr>" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOF
    </table>
    
    <h2>Recent Security Events</h2>
    <h3>Failed SSH Logins (Last 24 Hours)</h3>
    <pre>
$(grep "Failed password" /var/log/auth.log | grep "$(date +%b\ %e)" | tail -10)
    </pre>
    
    <h3>Sudo Usage (Last 24 Hours)</h3>
    <pre>
$(grep "sudo:" /var/log/auth.log | grep "$(date +%b\ %e)" | tail -10)
    </pre>
    
    <h3>System Load</h3>
    <pre>
$(uptime)
$(free -h)
$(df -h)
    </pre>
    
</body>
</html>
EOF

echo "Security dashboard generated: $REPORT_FILE"

# Email the report
if command -v mutt >/dev/null; then
    mutt -e "set content_type=text/html" -s "Security Dashboard Report" admin@example.com < "$REPORT_FILE"
fi
```

### Comprehensive Security Monitoring
```bash
#!/bin/bash
# Master security monitoring script

LOG_DIR="/var/log/security-monitoring"
DATE=$(date +%Y%m%d)
ALERT_EMAIL="admin@example.com"

mkdir -p "$LOG_DIR"

# Function to send alerts
send_alert() {
    local subject="$1"
    local message="$2"
    echo "$message" | mail -s "$subject" "$ALERT_EMAIL"
    logger "SECURITY ALERT: $subject - $message"
}

# Check for rootkits
echo "Running rootkit detection..." >> "$LOG_DIR/monitor-$DATE.log"
if command -v rkhunter >/dev/null; then
    rkhunter --check --sk --report-warnings-only >> "$LOG_DIR/rkhunter-$DATE.log" 2>&1
    if [ $? -ne 0 ]; then
        send_alert "Rootkit Detection Alert" "rkhunter found potential issues. Check $LOG_DIR/rkhunter-$DATE.log"
    fi
fi

# Check for malware
echo "Running malware scan..." >> "$LOG_DIR/monitor-$DATE.log"
if command -v clamscan >/dev/null; then
    clamscan -r /home /var/www --infected --remove >> "$LOG_DIR/clamav-$DATE.log" 2>&1
    INFECTED=$(grep "Infected files:" "$LOG_DIR/clamav-$DATE.log" | awk '{print $3}')
    if [ "$INFECTED" -gt 0 ]; then
        send_alert "Malware Detection Alert" "$INFECTED infected files found and removed"
    fi
fi

# Check system integrity
echo "Checking file integrity..." >> "$LOG_DIR/monitor-$DATE.log"
if command -v aide >/dev/null; then
    aide --check >> "$LOG_DIR/aide-$DATE.log" 2>&1
    if [ $? -eq 1 ]; then
        send_alert "File Integrity Alert" "AIDE detected file system changes"
    fi
fi

```bash
# Check for suspicious network connections
echo "Checking network connections..." >> "$LOG_DIR/monitor-$DATE.log"
SUSPICIOUS_CONNECTIONS=$(netstat -tuln | grep ":22\|:80\|:443" | wc -l)
if [ "$SUSPICIOUS_CONNECTIONS" -gt 100 ]; then
    send_alert "Network Connection Alert" "High number of connections detected: $SUSPICIOUS_CONNECTIONS"
fi

# Check for unusual processes
echo "Checking for unusual processes..." >> "$LOG_DIR/monitor-$DATE.log"
ps aux --sort=-%cpu | head -20 >> "$LOG_DIR/processes-$DATE.log"
HIGH_CPU=$(ps aux --sort=-%cpu | head -5 | awk 'NR>1 && $3>80 {print $11}')
if [ -n "$HIGH_CPU" ]; then
    send_alert "High CPU Usage Alert" "Processes with high CPU usage detected: $HIGH_CPU"
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    send_alert "Disk Space Critical" "Root filesystem is ${DISK_USAGE}% full"
fi

# Check for new SUID files
echo "Checking for new SUID files..." >> "$LOG_DIR/monitor-$DATE.log"
find / -type f -perm -4000 2>/dev/null > "$LOG_DIR/suid-current-$DATE.txt"
if [ -f "$LOG_DIR/suid-baseline.txt" ]; then
    NEW_SUID=$(comm -13 "$LOG_DIR/suid-baseline.txt" "$LOG_DIR/suid-current-$DATE.txt")
    if [ -n "$NEW_SUID" ]; then
        send_alert "New SUID Files Detected" "New SUID files found: $NEW_SUID"
    fi
else
    cp "$LOG_DIR/suid-current-$DATE.txt" "$LOG_DIR/suid-baseline.txt"
fi

# Check system logs for anomalies
echo "Analyzing system logs..." >> "$LOG_DIR/monitor-$DATE.log"
SECURITY_EVENTS=$(grep -i "security\|authentication\|privilege\|sudo\|su" /var/log/syslog | grep "$(date +%b\ %e)" | wc -l)
if [ "$SECURITY_EVENTS" -gt 100 ]; then
    send_alert "High Security Event Volume" "$SECURITY_EVENTS security-related events detected today"
fi

# Check for brute force attacks
FAILED_SSH=$(grep "Failed password" /var/log/auth.log | grep "$(date +%b\ %e)" | wc -l)
if [ "$FAILED_SSH" -gt 50 ]; then
    send_alert "SSH Brute Force Alert" "$FAILED_SSH failed SSH attempts detected today"
fi

# Generate summary report
echo "Security monitoring completed at $(date)" >> "$LOG_DIR/monitor-$DATE.log"
```

## Compliance Automation

### PCI DSS Compliance Monitoring
```bash
#!/bin/bash
# PCI DSS Compliance Check Script

PCI_REPORT="/var/log/pci-compliance-$(date +%Y%m%d).log"

echo "PCI DSS Compliance Check - $(date)" > "$PCI_REPORT"
echo "=================================================" >> "$PCI_REPORT"

# Requirement 1: Install and maintain a firewall
echo "1. Firewall Configuration Check" >> "$PCI_REPORT"
if systemctl is-active --quiet ufw || systemctl is-active --quiet firewalld; then
    echo "   PASS: Firewall is active" >> "$PCI_REPORT"
else
    echo "   FAIL: No active firewall detected" >> "$PCI_REPORT"
fi

# Requirement 2: Do not use vendor-supplied defaults
echo "2. Default Password Check" >> "$PCI_REPORT"
DEFAULT_USERS=$(awk -F: '$3 >= 1000 && $1 != "nobody" {print $1}' /etc/passwd | grep -E "(admin|root|user)")
if [ -z "$DEFAULT_USERS" ]; then
    echo "   PASS: No default user accounts found" >> "$PCI_REPORT"
else
    echo "   WARN: Potential default accounts: $DEFAULT_USERS" >> "$PCI_REPORT"
fi

# Requirement 3: Protect stored cardholder data
echo "3. Data Encryption Check" >> "$PCI_REPORT"
ENCRYPTED_PARTITIONS=$(lsblk -f | grep -c "crypto_LUKS")
if [ "$ENCRYPTED_PARTITIONS" -gt 0 ]; then
    echo "   PASS: $ENCRYPTED_PARTITIONS encrypted partitions found" >> "$PCI_REPORT"
else
    echo "   WARN: No encrypted partitions detected" >> "$PCI_REPORT"
fi

# Requirement 4: Encrypt transmission of cardholder data
echo "4. SSL/TLS Configuration Check" >> "$PCI_REPORT"
SSL_SERVICES=$(netstat -tuln | grep -E ":443|:993|:995" | wc -l)
if [ "$SSL_SERVICES" -gt 0 ]; then
    echo "   PASS: SSL/TLS services detected" >> "$PCI_REPORT"
else
    echo "   WARN: No SSL/TLS services found" >> "$PCI_REPORT"
fi

# Requirement 7: Restrict access by business need-to-know
echo "7. Access Control Check" >> "$PCI_REPORT"
SUDO_USERS=$(grep -c "sudo" /etc/group)
if [ "$SUDO_USERS" -lt 5 ]; then
    echo "   PASS: Limited number of sudo users ($SUDO_USERS)" >> "$PCI_REPORT"
else
    echo "   WARN: High number of sudo users ($SUDO_USERS)" >> "$PCI_REPORT"
fi

# Requirement 8: Identify and authenticate access
echo "8. Authentication Check" >> "$PCI_REPORT"
if grep -q "pam_pwquality.so" /etc/pam.d/common-password; then
    echo "   PASS: Password complexity enforced" >> "$PCI_REPORT"
else
    echo "   FAIL: Password complexity not enforced" >> "$PCI_REPORT"
fi

# Requirement 10: Track and monitor access
echo "10. Logging Configuration Check" >> "$PCI_REPORT"
if systemctl is-active --quiet rsyslog && [ -f /etc/audit/auditd.conf ]; then
    echo "   PASS: Logging services active" >> "$PCI_REPORT"
else
    echo "   FAIL: Logging not properly configured" >> "$PCI_REPORT"
fi

# Generate compliance score
PASS_COUNT=$(grep -c "PASS:" "$PCI_REPORT")
FAIL_COUNT=$(grep -c "FAIL:" "$PCI_REPORT")
WARN_COUNT=$(grep -c "WARN:" "$PCI_REPORT")
TOTAL=$((PASS_COUNT + FAIL_COUNT + WARN_COUNT))
SCORE=$((PASS_COUNT * 100 / TOTAL))

echo "" >> "$PCI_REPORT"
echo "Compliance Score: $SCORE% ($PASS_COUNT passed, $FAIL_COUNT failed, $WARN_COUNT warnings)" >> "$PCI_REPORT"

if [ "$SCORE" -lt 80 ]; then
    mail -s "PCI DSS Compliance Alert - Score: $SCORE%" admin@example.com < "$PCI_REPORT"
fi
```

### GDPR Data Protection Audit
```bash
#!/bin/bash
# GDPR Data Protection Audit Script

GDPR_REPORT="/var/log/gdpr-audit-$(date +%Y%m%d).log"

echo "GDPR Data Protection Audit - $(date)" > "$GDPR_REPORT"
echo "=============================================" >> "$GDPR_REPORT"

# Check for personal data locations
echo "1. Personal Data Discovery" >> "$GDPR_REPORT"
PERSONAL_DATA_PATTERNS=("email.*@.*\." "phone.*[0-9]{10}" "ssn.*[0-9]{3}-[0-9]{2}-[0-9]{4}")

for pattern in "${PERSONAL_DATA_PATTERNS[@]}"; do
    echo "   Searching for pattern: $pattern" >> "$GDPR_REPORT"
    find /var/www /home -type f -name "*.txt" -o -name "*.log" -o -name "*.csv" | \
    xargs grep -l "$pattern" 2>/dev/null | head -5 >> "$GDPR_REPORT"
done

# Check encryption of personal data
echo "2. Data Encryption Status" >> "$GDPR_REPORT"
ENCRYPTED_DIRS=$(find /var/www /opt -type d -name "*encrypt*" 2>/dev/null | wc -l)
if [ "$ENCRYPTED_DIRS" -gt 0 ]; then
    echo "   PASS: Encrypted directories found" >> "$GDPR_REPORT"
else
    echo "   WARN: No encrypted directories detected" >> "$GDPR_REPORT"
fi

# Check data retention policies
echo "3. Data Retention Check" >> "$GDPR_REPORT"
OLD_LOGS=$(find /var/log -type f -mtime +365 2>/dev/null | wc -l)
if [ "$OLD_LOGS" -gt 0 ]; then
    echo "   WARN: $OLD_LOGS log files older than 1 year found" >> "$GDPR_REPORT"
else
    echo "   PASS: No old log files found" >> "$GDPR_REPORT"
fi

# Check access logging
echo "4. Access Logging Verification" >> "$GDPR_REPORT"
if [ -f /var/log/auth.log ] && [ -f /var/log/audit/audit.log ]; then
    echo "   PASS: Access logging enabled" >> "$GDPR_REPORT"
else
    echo "   FAIL: Access logging not properly configured" >> "$GDPR_REPORT"
fi

# Check user consent mechanisms
echo "5. User Consent Tracking" >> "$GDPR_REPORT"
CONSENT_TABLES=$(mysql -u root -p"$DB_PASSWORD" -e "SHOW TABLES LIKE '%consent%'" 2>/dev/null | wc -l)
if [ "$CONSENT_TABLES" -gt 0 ]; then
    echo "   PASS: Consent tracking tables found" >> "$GDPR_REPORT"
else
    echo "   WARN: No consent tracking mechanism detected" >> "$GDPR_REPORT"
fi

echo "GDPR audit completed" >> "$GDPR_REPORT"
```

## Incident Response Automation

### Security Incident Detection
```bash
#!/bin/bash
# Automated Incident Detection and Response

INCIDENT_DIR="/var/log/incidents"
DATE=$(date +%Y%m%d-%H%M%S)
INCIDENT_ID="INC-$DATE"

mkdir -p "$INCIDENT_DIR"

# Function to create incident report
create_incident() {
    local severity="$1"
    local description="$2"
    local evidence="$3"
    
    cat > "$INCIDENT_DIR/$INCIDENT_ID.json" << EOF
{
    "incident_id": "$INCIDENT_ID",
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "severity": "$severity",
    "description": "$description",
    "status": "open",
    "evidence": "$evidence",
    "system": "$(hostname)",
    "ip_address": "$(hostname -I | awk '{print $1}')"
}
EOF
    
    # Send alert
    echo "SECURITY INCIDENT: $INCIDENT_ID - $description" | \
    mail -s "Security Incident - $severity" incident-response@example.com
    
    # Log to SIEM if available
    logger -p security.crit "INCIDENT:$INCIDENT_ID:$severity:$description"
}

# Check for suspicious login patterns
RECENT_FAILURES=$(grep "Failed password" /var/log/auth.log | grep "$(date +%b\ %e)" | wc -l)
if [ "$RECENT_FAILURES" -gt 100 ]; then
    EVIDENCE=$(grep "Failed password" /var/log/auth.log | grep "$(date +%b\ %e)" | tail -20)
    create_incident "HIGH" "Possible brute force attack - $RECENT_FAILURES failed logins" "$EVIDENCE"
fi

# Check for privilege escalation attempts
SUDO_FAILURES=$(grep "sudo.*FAILED" /var/log/auth.log | grep "$(date +%b\ %e)" | wc -l)
if [ "$SUDO_FAILURES" -gt 10 ]; then
    EVIDENCE=$(grep "sudo.*FAILED" /var/log/auth.log | grep "$(date +%b\ %e)")
    create_incident "CRITICAL" "Privilege escalation attempts detected" "$EVIDENCE"
fi

# Check for suspicious file access
SENSITIVE_ACCESS=$(grep -E "/etc/passwd|/etc/shadow|/etc/sudoers" /var/log/audit/audit.log | grep "$(date +%Y-%m-%d)" | wc -l)
if [ "$SENSITIVE_ACCESS" -gt 5 ]; then
    EVIDENCE=$(grep -E "/etc/passwd|/etc/shadow|/etc/sudoers" /var/log/audit/audit.log | grep "$(date +%Y-%m-%d)")
    create_incident "HIGH" "Suspicious access to sensitive files" "$EVIDENCE"
fi

# Check for unusual network activity
CONNECTIONS=$(netstat -tuln | wc -l)
if [ "$CONNECTIONS" -gt 200 ]; then
    EVIDENCE=$(netstat -tuln | head -20)
    create_incident "MEDIUM" "Unusual network activity - $CONNECTIONS connections" "$EVIDENCE"
fi

# Check for new processes
UNUSUAL_PROCESSES=$(ps aux | grep -E "(nc|netcat|nmap|wget|curl)" | grep -v grep | wc -l)
if [ "$UNUSUAL_PROCESSES" -gt 0 ]; then
    EVIDENCE=$(ps aux | grep -E "(nc|netcat|nmap|wget|curl)" | grep -v grep)
    create_incident "MEDIUM" "Suspicious processes detected" "$EVIDENCE"
fi
```

### Automated Containment Actions
```bash
#!/bin/bash
# Automated incident containment

INCIDENT_ID="$1"
ACTION="$2"

if [ -z "$INCIDENT_ID" ] || [ -z "$ACTION" ]; then
    echo "Usage: $0 <incident_id> <action>"
    echo "Actions: isolate, block_ip, disable_user, shutdown_service"
    exit 1
fi

LOG_FILE="/var/log/containment-$INCIDENT_ID.log"

log_action() {
    echo "$(date): $1" >> "$LOG_FILE"
    logger "CONTAINMENT:$INCIDENT_ID:$1"
}

case "$ACTION" in
    isolate)
        log_action "Isolating system from network"
        # Block all incoming connections except SSH from management network
        iptables -P INPUT DROP
        iptables -A INPUT -i lo -j ACCEPT
        iptables -A INPUT -s 192.168.100.0/24 -p tcp --dport 22 -j ACCEPT
        iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
        log_action "System isolated - only management access allowed"
        ;;
    
    block_ip)
        read -p "Enter IP address to block: " IP_ADDR
        if [[ "$IP_ADDR" =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
            iptables -A INPUT -s "$IP_ADDR" -j DROP
            log_action "Blocked IP address: $IP_ADDR"
        else
            log_action "Invalid IP address format: $IP_ADDR"
        fi
        ;;
    
    disable_user)
        read -p "Enter username to disable: " USERNAME
        if id "$USERNAME" &>/dev/null; then
            usermod -L "$USERNAME"  # Lock account
            pkill -u "$USERNAME"    # Kill user processes
            log_action "Disabled user account: $USERNAME"
        else
            log_action "User not found: $USERNAME"
        fi
        ;;
    
    shutdown_service)
        read -p "Enter service name to shutdown: " SERVICE
        if systemctl is-active --quiet "$SERVICE"; then
            systemctl stop "$SERVICE"
            systemctl disable "$SERVICE"
            log_action "Shutdown and disabled service: $SERVICE"
        else
            log_action "Service not running: $SERVICE"
        fi
        ;;
    
    *)
        echo "Unknown action: $ACTION"
        exit 1
        ;;
esac

# Update incident status
if [ -f "/var/log/incidents/$INCIDENT_ID.json" ]; then
    jq --arg action "$ACTION" --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
       '.containment_actions += [{"action": $action, "timestamp": $timestamp}]' \
       "/var/log/incidents/$INCIDENT_ID.json" > "/tmp/$INCIDENT_ID.tmp" && \
       mv "/tmp/$INCIDENT_ID.tmp" "/var/log/incidents/$INCIDENT_ID.json"
fi

echo "Containment action '$ACTION' executed for incident $INCIDENT_ID"
echo "Log file: $LOG_FILE"
```

## Continuous Monitoring Dashboard

### Real-time Security Monitoring
```bash
#!/bin/bash
# Real-time security monitoring dashboard

DASHBOARD_DIR="/var/www/html/security-dashboard"
mkdir -p "$DASHBOARD_DIR"

# Generate real-time security dashboard
cat > "$DASHBOARD_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Security Monitoring Dashboard</title>
    <meta http-equiv="refresh" content="30">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .widget { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .metric { font-size: 2em; font-weight: bold; text-align: center; margin: 10px 0; }
        .status-ok { color: #28a745; }
        .status-warning { color: #ffc107; }
        .status-critical { color: #dc3545; }
        .chart { height: 200px; background: #f8f9fa; margin: 10px 0; padding: 20px; text-align: center; }
    </style>
</head>
<body>
    <h1>Security Monitoring Dashboard</h1>
    <p>Last Updated: <span id="timestamp"></span></p>
    
    <div class="dashboard-grid">
        <div class="widget">
            <h3>System Status</h3>
            <div id="system-status"></div>
        </div>
        
        <div class="widget">
            <h3>Security Events</h3>
            <div id="security-events"></div>
        </div>
        
        <div class="widget">
            <h3>Network Activity</h3>
            <div id="network-activity"></div>
        </div>
        
        <div class="widget">
            <h3>Failed Logins</h3>
            <div class="metric status-warning" id="failed-logins">0</div>
        </div>
        
        <div class="widget">
            <h3>Active Connections</h3>
            <div class="metric status-ok" id="connections">0</div>
        </div>
        
        <div class="widget">
            <h3>Disk Usage</h3>
            <div class="metric" id="disk-usage">0%</div>
        </div>
    </div>
    
    <script>
        function updateDashboard() {
            document.getElementById('timestamp').textContent = new Date().toLocaleString();
            
            // Fetch data from backend API
            fetch('/api/security-metrics')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('failed-logins').textContent = data.failed_logins;
                    document.getElementById('connections').textContent = data.connections;
                    document.getElementById('disk-usage').textContent = data.disk_usage + '%';
                })
                .catch(error => console.error('Error fetching data:', error));
        }
        
        // Update dashboard every 30 seconds
        setInterval(updateDashboard, 30000);
        updateDashboard();
    </script>
</body>
</html>
EOF

# API endpoint for dashboard data
cat > "$DASHBOARD_DIR/api.php" << 'EOF'
<?php
header('Content-Type: application/json');

// Get security metrics
$metrics = array();

// Failed logins today
$failed_logins = shell_exec("grep 'Failed password' /var/log/auth.log | grep '" . date('M j') . "' | wc -l");
$metrics['failed_logins'] = intval(trim($failed_logins));

// Active connections
$connections = shell_exec("netstat -tuln | wc -l");
$metrics['connections'] = intval(trim($connections));

// Disk usage
$disk_usage = shell_exec("df / | awk 'NR==2 {print \$5}' | sed 's/%//'");
$metrics['disk_usage'] = intval(trim($disk_usage));

// System load
$load = shell_exec("uptime | awk '{print \$10}' | sed 's/,//'");
$metrics['system_load'] = floatval(trim($load));

// Security events
$security_events = shell_exec("grep -i 'security\\|authentication\\|privilege' /var/log/syslog | grep '" . date('M j') . "' | wc -l");
$metrics['security_events'] = intval(trim($security_events));

echo json_encode($metrics);
?>
EOF

echo "Security dashboard created at $DASHBOARD_DIR"
echo "Access at http://localhost/security-dashboard/"
```

This comprehensive system integrity and security monitoring framework provides continuous oversight of Linux systems, ensuring compliance with security standards, detecting threats in real-time, and maintaining system integrity through automated monitoring, scanning, and response capabilities.