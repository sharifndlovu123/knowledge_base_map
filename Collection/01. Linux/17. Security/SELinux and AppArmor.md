# 06. SELinux vs AppArmor: Linux Security Frameworks

## Overview

Both SELinux and AppArmor are Mandatory Access Control (MAC) systems that provide additional security layers beyond traditional Unix permissions. They restrict what programs can do, even when running as root.

## SELinux (Security-Enhanced Linux)

### Architecture
SELinux implements a **label-based security model** where every process, file, and system object has a security context (label). Access decisions are made based on these labels and defined policies.

### Security Context Format
```bash
user:role:type:level
# Example: system_u:object_r:httpd_config_t:s0
```

### Components
- **User**: SELinux user identity
- **Role**: Defines what domains a user can access
- **Type/Domain**: Primary access control mechanism
- **Level**: Multi-Level Security (MLS) classification

### Basic Commands
```bash
# Check SELinux status
sestatus
getenforce

# Set SELinux mode
setenforce 0    # Permissive
setenforce 1    # Enforcing

# View file contexts
ls -Z /etc/passwd
-rw-r--r--. root root system_u:object_r:passwd_file_t:s0 /etc/passwd

# View process contexts
ps -eZ | grep httpd
system_u:system_r:httpd_t:s0 1234 ? 00:00:01 httpd

# Check AVC denials (audit log)
ausearch -m AVC -ts recent
sealert -a /var/log/audit/audit.log
```

### SELinux Modes
```bash
# Enforcing: Policies enforced, violations blocked
# Permissive: Policies logged but not enforced
# Disabled: SELinux completely off

# Check current mode
getenforce

# Set permanent mode in /etc/selinux/config
SELINUX=enforcing
SELINUXTYPE=targeted
```

### Policy Management
```bash
# List boolean policies
getsebool -a
setsebool httpd_can_network_connect on

# Make boolean permanent
setsebool -P httpd_can_network_connect on

# Install policy packages
semodule -l                    # List modules
semodule -i custom_policy.pp   # Install policy
semodule -r custom_policy      # Remove policy
```

### File Context Management
```bash
# View default contexts
semanage fcontext -l | grep httpd

# Set file context
semanage fcontext -a -t httpd_config_t "/opt/myapp/config(/.*)?"

# Apply context changes
restorecon -R /opt/myapp/

# Relabel entire filesystem
fixfiles relabel
```

### Troubleshooting SELinux
```bash
# Generate readable audit reports
sealert -a /var/log/audit/audit.log

# Allow specific access (generates policy)
audit2allow -a
audit2allow -M mypolicy < audit.log
semodule -i mypolicy.pp

# Temporary permissive for specific domain
semanage permissive -a httpd_t
```

## AppArmor (Application Armor)

### Architecture
AppArmor uses **path-based security** where profiles define what files and capabilities applications can access. It's simpler than SELinux but less granular.

### Profile Modes
- **Enforce**: Profile rules are enforced
- **Complain**: Violations logged but allowed
- **Disabled**: Profile not loaded

### Basic Commands
```bash
# Check AppArmor status
apparmor_status
aa-status

# Profile management
aa-enforce /path/to/profile     # Set to enforce mode
aa-complain /path/to/profile    # Set to complain mode
aa-disable /path/to/profile     # Disable profile

# Load/reload profiles
apparmor_parser -r /etc/apparmor.d/usr.bin.firefox
```

### Profile Location and Structure
```bash
# Profiles stored in
/etc/apparmor.d/

# Profile syntax example (/etc/apparmor.d/usr.bin.example)
#include <tunables/global>

/usr/bin/example {
  #include <abstractions/base>
  #include <abstractions/nameservice>
  
  capability net_bind_service,
  
  /usr/bin/example mr,
  /etc/example/** r,
  /var/log/example.log w,
  /tmp/** rw,
  
  network inet tcp,
  
  deny /etc/shadow r,
  deny /home/** w,
}
```

### Profile Development
```bash
# Generate profile automatically
aa-genprof /usr/bin/myapp

# Learn mode - builds profile by monitoring
aa-logprof

# Edit profiles
aa-easyprof /usr/bin/myapp
```

### Debugging AppArmor
```bash
# View denials
dmesg | grep DENIED
journalctl | grep apparmor

# Analyze logs
aa-logprof    # Interactive log analysis
```

## Comparison: SELinux vs AppArmor

| Aspect | SELinux | AppArmor |
|--------|---------|----------|
| **Security Model** | Label-based (Type Enforcement) | Path-based |
| **Complexity** | High - steep learning curve | Medium - more intuitive |
| **Granularity** | Very fine-grained control | Coarse-grained control |
| **Default Distros** | RHEL, CentOS, Fedora | Ubuntu, SUSE, Debian |
| **Configuration** | Complex policies, contexts | Simpler profile files |
| **Performance Impact** | Higher overhead | Lower overhead |
| **Policy Language** | Complex rule language | Simpler syntax |
| **Network Control** | Detailed network policies | Basic network rules |
| **Learning Curve** | Steep | Moderate |

## Detailed Feature Comparison

### File Access Control
```bash
# SELinux - label-based
ls -Z /var/www/html/
-rw-r--r--. apache apache unconfined_u:object_r:httpd_config_t:s0 index.html

# AppArmor - path-based
/var/www/html/** r,
/var/www/html/uploads/** rw,
```

### Process Confinement
```bash
# SELinux - domain transitions
type httpd_t;
type httpd_config_t;
allow httpd_t httpd_config_t:file read;

# AppArmor - executable profiles
/usr/sbin/apache2 {
  /etc/apache2/** r,
  /var/log/apache2/** w,
}
```

### Network Controls
```bash
# SELinux - detailed port/protocol control
allow httpd_t http_port_t:tcp_socket name_bind;

# AppArmor - basic network access
network inet tcp,
network inet6 tcp,
```

## Practical Examples

### Securing a Web Server

#### SELinux Approach
```bash
# Set correct contexts
setsebool -P httpd_can_network_connect 1
semanage fcontext -a -t httpd_exec_t "/opt/webapp/bin/webapp"
restorecon -R /opt/webapp/

# Custom policy for non-standard paths
semanage fcontext -a -t httpd_config_t "/opt/webapp/config(/.*)?"
restorecon -R /opt/webapp/config/
```

#### AppArmor Approach
```bash
# Create profile /etc/apparmor.d/opt.webapp.bin.webapp
/opt/webapp/bin/webapp {
  #include <abstractions/base>
  #include <abstractions/nameservice>
  #include <abstractions/web-data>
  
  capability net_bind_service,
  
  /opt/webapp/bin/webapp mr,
  /opt/webapp/config/** r,
  /opt/webapp/data/** rw,
  /var/log/webapp/** w,
  
  network inet tcp,
  network inet6 tcp,
  
  deny /etc/shadow r,
  deny /home/** rwx,
}

# Load the profile
apparmor_parser -r /etc/apparmor.d/opt.webapp.bin.webapp
```

### Database Server Security

#### SELinux
```bash
# PostgreSQL with custom data directory
semanage fcontext -a -t postgresql_db_t "/custom/pgdata(/.*)?"
restorecon -R /custom/pgdata/
setsebool -P postgresql_can_rsync 1
```

#### AppArmor
```bash
# PostgreSQL profile modification
/usr/lib/postgresql/*/bin/postgres {
  /custom/pgdata/** rwk,
  /custom/pgdata/pg_xlog/** rwl,
  deny network raw,
  deny network packet,
}
```

## Best Practices

### SELinux Best Practices
1. **Start with targeted policy** - don't use strict policy initially
2. **Use audit2allow carefully** - understand what you're allowing
3. **Test in permissive mode** first
4. **Use booleans** instead of custom policies when possible
5. **Regular policy updates** - keep policies current
6. **Monitor audit logs** regularly

### AppArmor Best Practices
1. **Use complain mode** during development
2. **Leverage abstractions** - reuse common patterns
3. **Start restrictive** and gradually open permissions
4. **Test thoroughly** - ensure applications function correctly
5. **Use aa-logprof** for policy refinement
6. **Regular profile updates**

## When to Choose Which

### Choose SELinux When:
- Maximum security is required
- Fine-grained control needed
- Running RHEL/CentOS/Fedora
- Complex multi-user environments
- Compliance requirements (Common Criteria, etc.)

### Choose AppArmor When:
- Simpler administration preferred
- Running Ubuntu/SUSE/Debian
- Rapid deployment needed
- Less complex security requirements
- Path-based security model fits use case

## Migration and Coexistence

### SELinux to AppArmor
```bash
# Disable SELinux
setenforce 0
# Edit /etc/selinux/config: SELINUX=disabled

# Install and enable AppArmor
apt install apparmor apparmor-utils
systemctl enable apparmor
```

### AppArmor to SELinux
```bash
# Disable AppArmor
systemctl stop apparmor
systemctl disable apparmor

# Enable SELinux (requires reboot and relabeling)
# Edit /etc/selinux/config: SELINUX=enforcing
```

**Note**: Both systems cannot run simultaneously - they're mutually exclusive.

## Common Issues and Solutions

### SELinux Troubleshooting
```bash
# Application won't start
ausearch -c 'httpd' --raw | audit2allow -M my-httpd
semodule -i my-httpd.pp

# File access denied
ls -Z problematic_file
restorecon problematic_file
```

### AppArmor Troubleshooting
```bash
# Profile prevents application startup
aa-complain /etc/apparmor.d/usr.bin.myapp
# Test application, then
aa-logprof    # Add necessary permissions
aa-enforce /etc/apparmor.d/usr.bin.myapp
```

Both SELinux and AppArmor significantly enhance Linux security, but require careful planning and ongoing maintenance to be effective.
