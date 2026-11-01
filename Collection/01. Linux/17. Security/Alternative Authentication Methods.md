# 01. Alternative Authentication Methods in Linux

## Overview

Linux supports various authentication methods beyond traditional password authentication. These methods provide enhanced security, convenience, and compliance with modern security requirements.

## PAM (Pluggable Authentication Modules)

PAM is the core authentication framework in Linux that allows flexible authentication configuration without modifying applications.

### PAM Architecture
```
Application → libpam → PAM Modules → Authentication Backend
    ↓
Examples: login, ssh, sudo, su
```

### PAM Configuration Structure
```bash
# Location: /etc/pam.d/
# Each service has its own PAM configuration file

# PAM rule format:
# type  control  module-path  module-arguments

# Types:
# - auth: Authentication (verify identity)
# - account: Account management (access control)
# - password: Password management
# - session: Session management
```

### PAM Control Flags
```bash
# required: Must succeed, continue processing
# requisite: Must succeed, stop on failure
# sufficient: Success ends processing for this type
# optional: Success/failure doesn't matter
# include: Include another PAM file
# substack: Include with separate stack
```

### Example PAM Configuration (/etc/pam.d/sshd)
```bash
# Authentication
auth       required     pam_sepermit.so
auth       substack     password-auth
auth       include      postlogin

# Account management
account    required     pam_nologin.so
account    include      password-auth

# Password management
password   include      password-auth

# Session management
session    required     pam_selinux.so close
session    required     pam_loginuid.so
session    optional     pam_keyinit.so force revoke
session    include      password-auth
session    include      postlogin
session    required     pam_selinux.so open
```

## SSH Key Authentication

### Setup SSH Keys
```bash
# Generate key pair
ssh-keygen -t rsa -b 4096 -C "user@example.com"
ssh-keygen -t ed25519 -C "user@example.com"  # More secure, smaller

# Copy public key to server
ssh-copy-id user@server
# Or manually
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

# SSH configuration (/etc/ssh/sshd_config)
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PasswordAuthentication no  # Disable passwords
```

### Advanced SSH Key Management
```bash
# Certificate-based SSH authentication
# Generate CA key
ssh-keygen -t rsa -b 4096 -f ssh_ca

# Sign user key with CA
ssh-keygen -s ssh_ca -I user_cert -n user1,user2 -V +52w ~/.ssh/id_rsa.pub

# Server configuration
TrustedUserCAKeys /etc/ssh/ssh_ca.pub
```

## Two-Factor Authentication (2FA)

### Google Authenticator (TOTP)
```bash
# Install Google Authenticator PAM module
sudo apt install libpam-google-authenticator  # Debian/Ubuntu
sudo yum install google-authenticator         # CentOS/RHEL

# Configure for user
google-authenticator
# Follow prompts to generate QR code and backup codes

# PAM configuration (/etc/pam.d/sshd)
auth required pam_google_authenticator.so

# SSH configuration (/etc/ssh/sshd_config)
ChallengeResponseAuthentication yes
AuthenticationMethods publickey,keyboard-interactive
```

### OATH (Open Authentication)
```bash
# Install OATH toolkit
sudo apt install oathtool libpam-oath

# Generate OATH key
head -10 /dev/urandom | sha512sum | cut -b 1-30

# Configure OATH (/etc/users.oath)
HOTP/T30 user1 - 00112233445566778899aabbccddeeff

# PAM configuration
auth required pam_oath.so usersfile=/etc/users.oath window=5
```

## Smart Card Authentication

### PKCS#11 Smart Cards
```bash
# Install smart card support
sudo apt install opensc pcscd libpam-pkcs11

# Start PC/SC daemon
sudo systemctl enable pcscd
sudo systemctl start pcscd

# List available readers
pcsc_scan

# PAM configuration (/etc/pam.d/login)
auth sufficient pam_pkcs11.so
```

### CAC (Common Access Card)
```bash
# Install CAC support
sudo apt install coolkey opensc-pkcs11

# Configure PKCS#11 (/etc/pkcs11/pkcs11.conf)
use_pkcs11_module = coolkey
pkcs11_module = /usr/lib64/pkcs11/libcoolkeypk11.so

# Test smart card
pkcs11-tool --list-slots
```

## Biometric Authentication

### Fingerprint Authentication
```bash
# Install fingerprint PAM module
sudo apt install libpam-fprintd fprintd

# Enroll fingerprints
fprintd-enroll username

# List enrolled fingerprints
fprintd-list username

# PAM configuration (/etc/pam.d/common-auth)
auth sufficient pam_fprintd.so
```

### Face Recognition
```bash
# Install Howdy (facial recognition)
sudo add-apt-repository ppa:boltgolt/howdy
sudo apt update
sudo apt install howdy

# Configure face model
sudo howdy add

# Test recognition
sudo howdy test

# PAM integration (automatic)
# Howdy automatically configures PAM
```

## LDAP Authentication

### OpenLDAP Client Configuration
```bash
# Install LDAP client packages
sudo apt install libnss-ldap libpam-ldap ldap-utils

# Configure LDAP (/etc/ldap/ldap.conf)
BASE    dc=example,dc=com
URI     ldap://ldap.example.com
BINDDN  cn=admin,dc=example,dc=com

# NSS configuration (/etc/nsswitch.conf)
passwd: files ldap
group:  files ldap
shadow: files ldap

# PAM configuration (/etc/pam.d/common-auth)
auth sufficient pam_ldap.so
account sufficient pam_ldap.so
password sufficient pam_ldap.so
session optional pam_ldap.so
```

### Active Directory Integration
```bash
# Install required packages
sudo apt install realmd sssd sssd-tools libnss-sss libpam-sss adcli

# Join domain
sudo realm join --user=Administrator example.com

# SSSD configuration (/etc/sssd/sssd.conf)
[sssd]
domains = example.com
config_file_version = 2
services = nss, pam

[domain/example.com]
default_shell = /bin/bash
krb5_store_password_if_offline = True
cache_credentials = True
krb5_realm = EXAMPLE.COM
realmd_tags = manages-system joined-with-adcli
id_provider = ad
fallback_homedir = /home/%u@%d
ad_domain = example.com
use_fully_qualified_names = True
ldap_id_mapping = True
access_provider = ad

# Start SSSD
sudo systemctl enable sssd
sudo systemctl start sssd
```

## Kerberos Authentication

### MIT Kerberos Setup
```bash
# Install Kerberos
sudo apt install krb5-user

# Configure Kerberos (/etc/krb5.conf)
[libdefaults]
    default_realm = EXAMPLE.COM
    kdc_timesync = 1
    ccache_type = 4
    forwardable = true
    proxiable = true

[realms]
    EXAMPLE.COM = {
        kdc = kdc.example.com
        admin_server = kdc.example.com
    }

[domain_realm]
    .example.com = EXAMPLE.COM
    example.com = EXAMPLE.COM

# PAM configuration (/etc/pam.d/common-auth)
auth optional pam_krb5.so minimum_uid=1000
session optional pam_krb5.so minimum_uid=1000
```

### Kerberos Usage
```bash
# Get Kerberos ticket
kinit username

# List tickets
klist

# Renew ticket
kinit -R

# Destroy tickets
kdestroy

# SSH with Kerberos
ssh -o GSSAPIAuthentication=yes user@server
```

## Certificate-Based Authentication

### X.509 Client Certificates
```bash
# Generate client certificate
openssl genrsa -out client.key 4096
openssl req -new -key client.key -out client.csr
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -out client.crt

# Install certificate
mkdir -p ~/.pki/nssdb
pk12util -d ~/.pki/nssdb -i client.p12

# PAM configuration (/etc/pam.d/login)
auth sufficient pam_pkcs11.so
```

## One-Time Passwords (OTP)

### Hardware Tokens (YubiKey)
```bash
# Install YubiKey PAM module
sudo apt install libpam-yubico

# Configure YubiKey (/etc/pam.d/sshd)
auth required pam_yubico.so id=your_client_id key=your_secret_key

# Test YubiKey
ykpamcfg -2 -v
```

### Software OTP
```bash
# FreeOTP configuration
# Generate secret key
openssl rand -hex 20

# Configure OATH (/etc/users.oath)
HOTP/T30 username - secret_key_hex

# PAM configuration
auth required pam_oath.so usersfile=/etc/users.oath window=5
```

## Risk-Based Authentication

### GeoIP-Based Access Control
```bash
# Install GeoIP PAM module
sudo apt install libpam-geoip geoip-database

# Configure GeoIP (/etc/security/geoip.conf)
# Allow only specific countries
geoip_database = /usr/share/GeoIP/GeoIP.dat
geoip_action = allow
geoip_countries = US,CA,GB

# PAM configuration
auth required pam_geoip.so geoip_conf=/etc/security/geoip.conf
```

### Time-Based Access Control
```bash
# Install time-based PAM module
sudo apt install libpam-time

# Configure time restrictions (/etc/security/time.conf)
login;*;*;Al0800-1800
sshd;*;*;!Wd0000-2400

# PAM configuration (/etc/pam.d/login)
account required pam_time.so
```

## Modern Authentication Methods

### WebAuthn/FIDO2
```bash
# Install libfido2
sudo apt install libfido2-1 libfido2-dev libfido2-doc fido2-tools

# Generate resident key
fido2-token -M /dev/hidraw0

# PAM integration (experimental)
# Use pam-u2f for U2F support
sudo apt install libpam-u2f

# Register U2F device
pamu2fcfg -u username >> ~/.config/Yubico/u2f_keys

# PAM configuration
auth sufficient pam_u2f.so cue
```

### OAuth/OIDC Integration
```bash
# Install oauth2-proxy for web applications
wget https://github.com/oauth2-proxy/oauth2-proxy/releases/download/v7.4.0/oauth2-proxy-v7.4.0.linux-amd64.tar.gz

# Configure OAuth2 proxy
./oauth2-proxy \
  --provider=google \
  --email-domain=example.com \
  --upstream=http://localhost:8080 \
  --http-address=0.0.0.0:4180 \
  --client-id=your_client_id \
  --client-secret=your_client_secret \
  --cookie-secret=random_32_char_string
```

## PAM Module Security Configuration

### Account Lockout
```bash
# Configure account lockout (/etc/pam.d/common-auth)
auth required pam_tally2.so deny=5 unlock_time=900 onerr=fail

# Check locked accounts
pam_tally2 --user=username

# Unlock account
sudo pam_tally2 --user=username --reset
```

### Password Quality
```bash
# Install password quality module
sudo apt install libpam-pwquality

# Configure password requirements (/etc/security/pwquality.conf)
minlen = 12
minclass = 3
maxrepeat = 2
gecoscheck = 1
dictcheck = 1

# PAM configuration (/etc/pam.d/common-password)
password requisite pam_pwquality.so retry=3
```

### Session Limits
```bash
# Configure resource limits (/etc/security/limits.conf)
@users hard maxlogins 3
* hard nproc 100
* soft nofile 1024

# PAM configuration (/etc/pam.d/login)
session required pam_limits.so
```

## Authentication Method Comparison

| Method | Security Level | Convenience | Cost | Use Cases |
|--------|---------------|-------------|------|-----------|
| **Password** | Low | High | Free | Basic authentication |
| **SSH Keys** | High | High | Free | Server access |
| **2FA/TOTP** | High | Medium | Low | Account protection |
| **Smart Cards** | Very High | Medium | High | Enterprise, Government |
| **Biometrics** | High | Very High | Medium | Personal devices |
| **Certificates** | Very High | Medium | Medium | Enterprise PKI |
| **Kerberos** | High | High | Medium | Domain environments |
| **FIDO2/WebAuthn** | Very High | High | Medium | Modern web apps |

## Best Practices for Multi-Factor Authentication

### Layered Security Approach
```bash
# Example: SSH with multiple factors
# /etc/ssh/sshd_config
AuthenticationMethods publickey,keyboard-interactive:pam

# /etc/pam.d/sshd
auth required pam_google_authenticator.so
auth required pam_permit.so
```

### Backup Authentication Methods
```bash
# Configure backup codes for 2FA
# google-authenticator generates backup codes automatically

# Configure multiple SSH keys
# ~/.ssh/authorized_keys can contain multiple keys

# Emergency access procedures
# Maintain secure console access for emergencies
```

### Monitoring and Logging
```bash
# Monitor authentication attempts
sudo tail -f /var/log/auth.log

# Failed authentication tracking
sudo journalctl -u ssh -f | grep "Failed"

# PAM logging configuration (/etc/pam.d/common-auth)
auth optional pam_warn.so
session optional pam_warn.so
```

## Troubleshooting Authentication

### Common PAM Issues
```bash
# Debug PAM configuration
# Add to PAM config for debugging:
auth optional pam_warn.so

# Check PAM module dependencies
ldd /lib/x86_64-linux-gnu/security/pam_unix.so

# Test PAM configuration
pamtester service_name user authenticate
```

### SSH Authentication Debugging
```bash
# SSH client debugging
ssh -vvv user@server

# SSH server debugging
sudo /usr/sbin/sshd -d -p 2222

# Check SSH logs
sudo tail -f /var/log/auth.log | grep sshd
```

### System Authentication Logs
```bash
# Authentication logs
sudo tail -f /var/log/auth.log        # Debian/Ubuntu
sudo tail -f /var/log/secure          # CentOS/RHEL

# Systemd journal
sudo journalctl -f -u ssh
sudo journalctl -f -u gdm             # GNOME login
```

Alternative authentication methods provide robust security options for modern Linux environments, with PAM serving as the flexible foundation that enables seamless integration of multiple authentication technologies.
