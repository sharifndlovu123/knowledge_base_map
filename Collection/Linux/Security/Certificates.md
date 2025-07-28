# Digital Certificates: Complete Guide

## What are Digital Certificates?

Digital certificates are electronic documents that use cryptographic signatures to bind public keys with identities (people, organizations, devices). They serve as digital IDs that verify the authenticity of entities in digital communications.

## Certificate Components

### X.509 Certificate Structure
```bash
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 1a:2b:3c:4d:5e:6f
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: C=US, O=Let's Encrypt, CN=R3
        Validity:
            Not Before: Jan  1 00:00:00 2024 GMT
            Not After : Apr  1 00:00:00 2024 GMT
        Subject: CN=example.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
            RSA Public-Key: (2048 bit)
        X509v3 extensions:
            X509v3 Subject Alternative Name:
                DNS:example.com, DNS:www.example.com
            X509v3 Key Usage:
                Digital Signature, Key Encipherment
            X509v3 Extended Key Usage:
                TLS Web Server Authentication
```

### Key Fields Explained
- **Subject**: Who the certificate is issued to
- **Issuer**: Who issued the certificate (CA)
- **Validity Period**: When certificate is valid (Not Before/After)
- **Public Key**: The actual public key
- **Serial Number**: Unique identifier from the CA
- **Extensions**: Additional information (SANs, key usage, etc.)

## Types of Certificates

### By Use Case

#### SSL/TLS Certificates
```bash
# Web server certificates
# Purpose: Encrypt HTTPS traffic
# Extensions: TLS Web Server Authentication
# Common Names: example.com, *.example.com

# Client certificates
# Purpose: Authenticate users to servers
# Extensions: TLS Web Client Authentication
# Common Names: user@example.com, User Name
```

#### Code Signing Certificates
```bash
# Purpose: Sign software to verify integrity and publisher
# Extensions: Code Signing
# Used for: Applications, drivers, scripts
# Platforms: Windows Authenticode, Apple Developer, etc.
```

#### Email Certificates (S/MIME)
```bash
# Purpose: Encrypt and sign email messages
# Extensions: Email Protection
# Common Names: user@example.com
# Standards: S/MIME, PGP
```

#### Document Signing Certificates
```bash
# Purpose: Digital signatures on documents
# Extensions: Document Signing
# Used for: PDF signing, legal documents
# Standards: PAdES, XAdES, CAdES
```

### By Authority Level

#### Root Certificates
```bash
# Self-signed certificates at the top of trust chain
# Embedded in operating systems and browsers
# Examples: DigiCert Global Root CA, Baltimore CyberTrust Root

# View system root certificates
# Linux
ls /etc/ssl/certs/
# macOS
security find-certificate -a -p /System/Library/Keychains/SystemRootCertificates.keychain
# Windows
certmgr.msc (Trusted Root Certification Authorities)
```

#### Intermediate Certificates
```bash
# Signed by root CAs, used to sign end-entity certificates
# Creates certificate chain: Root → Intermediate → End Entity
# Allows CAs to keep root certificates offline for security

# Example chain verification
openssl verify -CAfile root.crt -untrusted intermediate.crt end-entity.crt
```

#### End-Entity Certificates
```bash
# Certificates issued to final users/devices/servers
# Cannot sign other certificates (unless specifically allowed)
# Examples: SSL certificates, user certificates, device certificates
```

## Certificate Formats

### Common Formats
```bash
# PEM (Privacy-Enhanced Mail)
# Base64 encoded, human-readable
# File extensions: .pem, .crt, .cer, .key
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKZG...
-----END CERTIFICATE-----

# DER (Distinguished Encoding Rules)
# Binary format, not human-readable
# File extensions: .der, .cer
# Convert: openssl x509 -outform der -in cert.pem -out cert.der

# PKCS#12 (.p12, .pfx)
# Contains certificate and private key in single encrypted file
# Common in Windows environments
# Create: openssl pkcs12 -export -out cert.p12 -inkey private.key -in cert.pem

# PKCS#7 (.p7b, .p7c)
# Contains certificates and certificate chains (no private keys)
# Often used for certificate distribution
```

### Format Conversions
```bash
# PEM to DER
openssl x509 -outform der -in certificate.pem -out certificate.der

# DER to PEM
openssl x509 -inform der -in certificate.der -out certificate.pem

# PEM to PKCS#12
openssl pkcs12 -export -out certificate.p12 -inkey private.key -in certificate.pem -certfile ca-chain.pem

# PKCS#12 to PEM
openssl pkcs12 -in certificate.p12 -out certificate.pem -nodes

# Extract private key from PKCS#12
openssl pkcs12 -in certificate.p12 -nocerts -out private.key -nodes

# Extract certificates from PKCS#12
openssl pkcs12 -in certificate.p12 -nokeys -out certificate.pem
```

## Certificate Lifecycle Management

### Certificate Generation Process

#### 1. Key Pair Generation
```bash
# RSA key pair
openssl genrsa -out private.key 4096

# ECDSA key pair (more efficient)
openssl ecparam -genkey -name secp384r1 -out private.key

# View key details
openssl rsa -in private.key -text -noout
openssl ec -in private.key -text -noout
```

#### 2. Certificate Signing Request (CSR)
```bash
# Generate CSR
openssl req -new -key private.key -out certificate.csr \
  -subj "/C=US/ST=California/L=San Francisco/O=My Company/CN=example.com"

# CSR with Subject Alternative Names
openssl req -new -key private.key -out certificate.csr \
  -config <(cat <<EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = California
L = San Francisco
O = My Company
CN = example.com

[v3_req]
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = example.com
DNS.2 = www.example.com
DNS.3 = api.example.com
IP.1 = 192.168.1.100
EOF
)

# View CSR details
openssl req -in certificate.csr -text -noout
```

#### 3. Certificate Issuance
```bash
# Self-signed certificate (for testing)
openssl req -x509 -new -nodes -key private.key -sha256 -days 365 -out certificate.crt

# CA-signed certificate (send CSR to CA, receive signed certificate)
# Commercial CAs: DigiCert, GlobalSign, Sectigo, etc.
# Free CAs: Let's Encrypt, ZeroSSL
```

### Certificate Installation

#### Web Servers
```bash
# Apache
SSLCertificateFile /path/to/certificate.crt
SSLCertificateKeyFile /path/to/private.key
SSLCertificateChainFile /path/to/intermediate.crt

# Nginx
ssl_certificate /path/to/fullchain.pem;  # certificate + intermediate
ssl_certificate_key /path/to/private.key;

# Test configuration
apache2ctl configtest
nginx -t
```

#### Operating Systems
```bash
# Linux (Ubuntu/Debian)
sudo cp certificate.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates

# CentOS/RHEL
sudo cp certificate.crt /etc/pki/ca-trust/source/anchors/
sudo update-ca-trust

# macOS
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certificate.crt

# Windows (PowerShell as Administrator)
Import-Certificate -FilePath certificate.crt -CertStoreLocation Cert:\LocalMachine\Root
```

## Certificate Validation and Verification

### Manual Verification
```bash
# Verify certificate against CA
openssl verify -CAfile ca-bundle.crt certificate.crt

# Check certificate chain
openssl s_client -connect example.com:443 -showcerts

# Verify certificate matches private key
cert_md5=$(openssl x509 -noout -modulus -in certificate.crt | openssl md5)
key_md5=$(openssl rsa -noout -modulus -in private.key | openssl md5)
echo "Certificate: $cert_md5"
echo "Private Key: $key_md5"
# Should match

# Check certificate expiration
openssl x509 -in certificate.crt -noout -dates
openssl x509 -in certificate.crt -noout -checkend 86400  # Check if expires in 24h
```

### Automated Validation
```bash
# Certificate monitoring script
#!/bin/bash
check_cert_expiry() {
    local domain=$1
    local warning_days=30
    
    expiry_date=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | \
                 openssl x509 -noout -enddate | cut -d= -f2)
    expiry_epoch=$(date -d "$expiry_date" +%s)
    current_epoch=$(date +%s)
    days_left=$(( (expiry_epoch - current_epoch) / 86400 ))
    
    if [ $days_left -lt $warning_days ]; then
        echo "WARNING: Certificate for $domain expires in $days_left days"
        return 1
    else
        echo "OK: Certificate for $domain expires in $days_left days"
        return 0
    fi
}

check_cert_expiry "example.com"
```

## Certificate Authorities (CAs)

### Public CAs
```bash
# Commercial CAs
# - DigiCert: Enterprise, high assurance
# - GlobalSign: International presence
# - Sectigo (formerly Comodo): Cost-effective
# - GoDaddy: Domain registrar integrated

# Free CAs
# - Let's Encrypt: Automated, domain-validated
# - ZeroSSL: Alternative to Let's Encrypt
# - SSL.com: Free 90-day certificates
```

### Private CAs
```bash
# Create your own CA for internal use
# 1. Generate CA private key
openssl genrsa -out ca.key 4096

# 2. Create CA certificate
openssl req -new -x509 -days 3650 -key ca.key -out ca.crt \
  -subj "/C=US/ST=CA/L=SF/O=Internal CA/CN=Internal Root CA"

# 3. Sign certificates with your CA
openssl x509 -req -in certificate.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out certificate.crt -days 365 -extensions v3_req \
  -extfile <(cat <<EOF
[v3_req]
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = internal.example.com
EOF
)
```

## Certificate Security

### Key Security Best Practices
```bash
# 1. Strong key generation
openssl genrsa -out private.key 4096  # Minimum 2048-bit RSA
openssl ecparam -genkey -name secp384r1 -out private.key  # Or ECDSA

# 2. Secure key storage
chmod 600 private.key
chown root:root private.key

# 3. Use hardware security modules (HSMs) for high-value keys
# 4. Regular key rotation
# 5. Secure key backup and recovery procedures
```

### Certificate Pinning
```bash
# HTTP Public Key Pinning (HPKP) - Deprecated
# Use Certificate Transparency monitoring instead

# Extract public key fingerprint for pinning
openssl x509 -in certificate.crt -pubkey -noout | \
openssl rsa -pubin -outform der | \
openssl dgst -sha256 -binary | \
openssl enc -base64
```

### Certificate Transparency
```bash
# Monitor certificate issuance for your domains
# Tools:
# - crt.sh: https://crt.sh/?q=example.com
# - Facebook CT Monitor
# - SSLMate Cert Spotter

# Query Certificate Transparency logs
curl -s "https://crt.sh/?q=example.com&output=json" | jq '.[].common_name' | sort -u
```

## Troubleshooting Certificates

### Common Issues

#### Certificate Chain Problems
```bash
# Problem: Incomplete certificate chain
# Solution: Include intermediate certificates

# Check chain completeness
openssl s_client -connect example.com:443 -showcerts

# Fix: Concatenate certificates in correct order
cat end-entity.crt intermediate.crt > fullchain.crt
```

#### Certificate/Key Mismatch
```bash
# Verify certificate and key match
cert_hash=$(openssl x509 -noout -modulus -in cert.crt | openssl md5)
key_hash=$(openssl rsa -noout -modulus -in private.key | openssl md5)
if [ "$cert_hash" = "$key_hash" ]; then
    echo "Certificate and key match"
else
    echo "Certificate and key do NOT match"
fi
```

#### Subject Alternative Name Issues
```bash
# Check SAN entries
openssl x509 -in certificate.crt -text -noout | grep -A1 "Subject Alternative Name"

# Generate certificate with correct SANs
# (See CSR generation examples above)
```

#### Certificate Expiration
```bash
# Check expiration
openssl x509 -in certificate.crt -noout -dates

# Automated expiration checking
#!/bin/bash
for domain in example.com api.example.com; do
    expiry=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | \
             openssl x509 -noout -enddate | cut -d= -f2)
    days_left=$(( ($(date -d "$expiry" +%s) - $(date +%s)) / 86400 ))
    echo "$domain: $days_left days until expiration"
done
```

## Advanced Certificate Topics

### Certificate Profiles and Templates
```bash
# Create certificate template for specific use cases
# Example: Web server certificate template
[web_server_cert]
basicConstraints = CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
authorityKeyIdentifier = keyid,issuer:always

[alt_names]
DNS.1 = $ENV::COMMON_NAME
DNS.2 = www.$ENV::COMMON_NAME
```

### Certificate Revocation
```bash
# Certificate Revocation Lists (CRL)
wget http://crl.example.com/ca.crl
openssl crl -in ca.crl -text -noout

# Online Certificate Status Protocol (OCSP)
openssl ocsp -issuer ca.crt -cert certificate.crt -text -url http://ocsp.example.com

# OCSP Stapling verification
openssl s_client -connect example.com:443 -status
```

### Multi-Domain and Wildcard Certificates
```bash
# Wildcard certificate (covers all subdomains)
CN=*.example.com
# Covers: api.example.com, www.example.com, mail.example.com
# Does NOT cover: example.com (need SAN for that)

# Multi-domain certificate with SAN
CN=example.com
SAN=DNS:example.com,DNS:www.example.com,DNS:api.example.com,DNS:example.org
```

Digital certificates form the backbone of modern internet security, enabling secure communications, authentication, and data integrity across all digital platforms.
