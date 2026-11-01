# 04. Linux Cryptography: Encryption, Hashing, and Certificate Management

## Overview

Linux provides comprehensive cryptographic tools for data protection, integrity verification, and secure communication. This guide covers symmetric and asymmetric encryption, hashing algorithms, digital signatures, and certificate management.

## Symmetric Encryption

### OpenSSL Symmetric Encryption
```bash
# AES encryption (recommended)
openssl enc -aes-256-cbc -salt -in file.txt -out file.txt.enc
openssl enc -aes-256-cbc -d -in file.txt.enc -out file.txt

# Different AES modes
openssl enc -aes-256-gcm -salt -in file.txt -out file.txt.enc    # GCM mode
openssl enc -aes-256-cfb -salt -in file.txt -out file.txt.enc    # CFB mode
openssl enc -aes-256-ofb -salt -in file.txt -out file.txt.enc    # OFB mode

# ChaCha20-Poly1305 (modern alternative)
openssl enc -chacha20-poly1305 -salt -in file.txt -out file.txt.enc

# Encrypt with password from file
openssl enc -aes-256-cbc -salt -in file.txt -out file.txt.enc -pass file:password.txt

# Encrypt without password prompt (scripting)
echo "mypassword" | openssl enc -aes-256-cbc -salt -in file.txt -out file.txt.enc -pass stdin
```

### GnuPG Symmetric Encryption
```bash
# GPG symmetric encryption
gpg --symmetric --cipher-algo AES256 file.txt
gpg --symmetric --armor --cipher-algo AES256 file.txt  # ASCII armored output

# Decrypt GPG symmetric
gpg --decrypt file.txt.gpg

# Batch mode (no interaction)
echo "password" | gpg --batch --yes --passphrase-fd 0 --symmetric file.txt

# Available ciphers
gpg --version  # Shows supported algorithms
gpg --cipher-algo help  # List cipher algorithms
```

### Directory and Archive Encryption
```bash
# Encrypt entire directory with tar and openssl
tar czf - directory/ | openssl enc -aes-256-cbc -salt -out directory.tar.gz.enc

# Decrypt directory
openssl enc -aes-256-cbc -d -in directory.tar.gz.enc | tar xzf -

# Encrypt with 7zip
7z a -p"password" -mhe=on encrypted.7z files/
7z x encrypted.7z  # Extract

# Encrypt with zip
zip -r -e encrypted.zip files/
unzip encrypted.zip
```

## Asymmetric Encryption

### RSA Key Generation and Usage
```bash
# Generate RSA key pair
openssl genrsa -out private.key 4096
openssl rsa -in private.key -pubout -out public.key

# Generate with password protection
openssl genrsa -aes256 -out private.key 4096

# Extract public key from private key
openssl rsa -in private.key -pubout -out public.key

# View key details
openssl rsa -in private.key -text -noout
openssl rsa -pubin -in public.key -text -noout

# Encrypt file with RSA public key
openssl rsautl -encrypt -pubin -inkey public.key -in file.txt -out file.txt.enc

# Decrypt with RSA private key
openssl rsautl -decrypt -inkey private.key -in file.txt.enc -out file.txt

# Sign file with RSA private key
openssl rsautl -sign -inkey private.key -in hash.txt -out signature.bin

# Verify signature with RSA public key
openssl rsautl -verify -pubin -inkey public.key -in signature.bin -out verified.txt
```

### Elliptic Curve Cryptography (ECC)
```bash
# List available curves
openssl ecparam -list_curves

# Generate ECC key pair
openssl ecparam -genkey -name secp384r1 -out ec-private.key
openssl ec -in ec-private.key -pubout -out ec-public.key

# Generate specific curves
openssl ecparam -genkey -name prime256v1 -out ec-p256.key    # P-256
openssl ecparam -genkey -name secp384r1 -out ec-p384.key     # P-384
openssl ecparam -genkey -name secp521r1 -out ec-p521.key     # P-521

# View ECC key details
openssl ec -in ec-private.key -text -noout
openssl ec -pubin -in ec-public.key -text -noout
```

### EdDSA (Ed25519) Keys
```bash
# Generate Ed25519 key pair
openssl genpkey -algorithm Ed25519 -out ed25519-private.key
openssl pkey -in ed25519-private.key -pubout -out ed25519-public.key

# View Ed25519 key
openssl pkey -in ed25519-private.key -text -noout
```

## Hashing and Message Digests

### Common Hash Algorithms
```bash
# MD5 (deprecated, for compatibility only)
md5sum file.txt
echo "text" | md5sum

# SHA family
sha1sum file.txt              # SHA-1 (deprecated)
sha224sum file.txt            # SHA-224
sha256sum file.txt            # SHA-256 (recommended)
sha384sum file.txt            # SHA-384
sha512sum file.txt            # SHA-512

# OpenSSL hashing
openssl dgst -md5 file.txt
openssl dgst -sha256 file.txt
openssl dgst -sha3-256 file.txt
openssl dgst -blake2b512 file.txt

# Hash with OpenSSL (binary output)
openssl dgst -sha256 -binary file.txt > file.sha256

# Create and verify checksum files
sha256sum *.txt > checksums.sha256
sha256sum -c checksums.sha256  # Verify checksums
```

### HMAC (Hash-based Message Authentication Code)
```bash
# HMAC with OpenSSL
openssl dgst -sha256 -hmac "secret_key" file.txt
openssl dgst -sha512 -hmac "secret_key" file.txt

# HMAC from hex key
openssl dgst -sha256 -mac HMAC -macopt hexkey:deadbeef file.txt

# HMAC with key file
openssl dgst -sha256 -mac HMAC -macopt key:"$(cat keyfile)" file.txt
```

### Password Hashing
```bash
# bcrypt hashing (requires htpasswd)
htpasswd -bnBC 12 username password

# Argon2 hashing
echo -n "password" | argon2 "salt" -id -t 3 -m 12 -p 1

# PBKDF2 with OpenSSL
openssl passwd -6 password     # SHA-512 based crypt
openssl passwd -5 password     # SHA-256 based crypt

# scrypt hashing
echo "password" | scrypt enc -t 0.1 > password.scrypt
echo "password" | scrypt dec password.scrypt
```

## Digital Signatures

### Creating and Verifying Signatures
```bash
# Create signature with OpenSSL
openssl dgst -sha256 -sign private.key -out signature.bin file.txt

# Verify signature
openssl dgst -sha256 -verify public.key -signature signature.bin file.txt

# Create signature in base64
openssl dgst -sha256 -sign private.key file.txt | base64 > signature.b64

# Verify base64 signature
base64 -d signature.b64 | openssl dgst -sha256 -verify public.key -signature /dev/stdin file.txt

# Combined signature and verification
openssl rsautl -sign -inkey private.key -in file.txt -out signature.bin
openssl rsautl -verify -pubin -inkey public.key -in signature.bin
```

### GnuPG Digital Signatures
```bash
# Create detached signature
gpg --detach-sign --armor file.txt

# Create inline signature
gpg --clear-sign file.txt

# Verify signature
gpg --verify file.txt.asc file.txt
gpg --verify file.txt.asc  # For clear-signed files

# Sign with specific key
gpg --local-user keyid --detach-sign file.txt

# Verify and extract
gpg --decrypt signed-file.txt.gpg
```

## Certificate Management

### X.509 Certificate Creation
```bash
# Create self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Create certificate with specific parameters
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 \
  -subj "/C=US/ST=CA/L=San Francisco/O=MyOrg/CN=example.com" -nodes

# Create CSR (Certificate Signing Request)
openssl req -new -key private.key -out certificate.csr

# Create certificate from CSR (self-signed)
openssl x509 -req -in certificate.csr -signkey private.key -out certificate.crt -days 365

# Create certificate with SAN (Subject Alternative Names)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 \
  -config <(cat <<EOF
[req]
distinguished_name = req_distinguished_name
x509_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = example.com

[v3_req]
subjectAltName = @alt_names

[alt_names]
DNS.1 = example.com
DNS.2 = www.example.com
DNS.3 = api.example.com
IP.1 = 192.168.1.100
EOF
) -nodes
```

### Certificate Information and Verification
```bash
# View certificate details
openssl x509 -in certificate.crt -text -noout
openssl x509 -in certificate.crt -noout -dates
openssl x509 -in certificate.crt -noout -subject
openssl x509 -in certificate.crt -noout -issuer

# Check certificate expiration
openssl x509 -in certificate.crt -noout -checkend 86400  # Check if expires in 24h

# Verify certificate chain
openssl verify -CAfile ca.crt certificate.crt
openssl verify -CAfile ca.crt -untrusted intermediate.crt certificate.crt

# Check certificate against private key
openssl x509 -noout -modulus -in certificate.crt | openssl md5
openssl rsa -noout -modulus -in private.key | openssl md5
# MD5 sums should match

# Extract certificate fingerprint
openssl x509 -in certificate.crt -noout -fingerprint -sha256
openssl x509 -in certificate.crt -noout -fingerprint -md5
```

### Certificate Authority (CA) Operations
```bash
# Create CA private key
openssl genrsa -aes256 -out ca-private.key 4096

# Create CA certificate
openssl req -new -x509 -days 3650 -key ca-private.key -out ca-certificate.crt

# Sign certificate with CA
openssl x509 -req -in certificate.csr -CA ca-certificate.crt -CAkey ca-private.key \
  -CAcreateserial -out signed-certificate.crt -days 365

# Create certificate with extensions
openssl x509 -req -in certificate.csr -CA ca-certificate.crt -CAkey ca-private.key \
  -CAcreateserial -out certificate.crt -days 365 -extensions v3_req \
  -extfile <(cat <<EOF
[v3_req]
keyUsage = keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = example.com
DNS.2 = www.example.com
EOF
)
```

## Advanced Cryptographic Operations

### Key Derivation Functions (KDF)
```bash
# PBKDF2 key derivation
openssl pkcs8 -topk8 -in private.key -out encrypted.key -v2 aes256 -iter 100000

# scrypt key derivation
echo "password" | scrypt enc -t 0.1 -r 8 -N 16384 > derived.key

# Argon2 key derivation
echo -n "password" | argon2 "salt" -id -t 3 -m 12 -p 1 -l 32
```

### Key Exchange
```bash
# Diffie-Hellman parameters
openssl dhparam -out dhparams.pem 2048
openssl dhparam -out dhparams.pem 4096

# ECDH key exchange
openssl ecparam -genkey -name secp384r1 -out alice-private.key
openssl ec -in alice-private.key -pubout -out alice-public.key

openssl ecparam -genkey -name secp384r1 -out bob-private.key
openssl ec -in bob-private.key -pubout -out bob-public.key

# Generate shared secret (requires custom script or application)
```

### Random Number Generation
```bash
# Generate random bytes
openssl rand -hex 32          # 32 random hex bytes
openssl rand -base64 32       # 32 random bytes in base64
openssl rand 32 > random.bin  # Binary random data

# Strong random number generation
dd if=/dev/urandom bs=32 count=1 | xxd  # System random
dd if=/dev/random bs=32 count=1 | xxd   # Blocking random (higher entropy)

# Generate random passwords
openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
pwgen 16 1                    # Using pwgen tool
```

## File System Encryption

### LUKS (Linux Unified Key Setup)
```bash
# Format partition with LUKS
sudo cryptsetup luksFormat /dev/sdb1

# Open LUKS device
sudo cryptsetup luksOpen /dev/sdb1 encrypted_device

# Create filesystem on encrypted device
sudo mkfs.ext4 /dev/mapper/encrypted_device

# Mount encrypted filesystem
sudo mkdir /mnt/encrypted
sudo mount /dev/mapper/encrypted_device /mnt/encrypted

# Close LUKS device
sudo umount /mnt/encrypted
sudo cryptsetup luksClose encrypted_device

# Add key to LUKS
sudo cryptsetup luksAddKey /dev/sdb1

# Remove key from LUKS
sudo cryptsetup luksRemoveKey /dev/sdb1

# Backup LUKS header
sudo cryptsetup luksHeaderBackup /dev/sdb1 --header-backup-file luks-header.backup

# Restore LUKS header
sudo cryptsetup luksHeaderRestore /dev/sdb1 --header-backup-file luks-header.backup
```

### EncFS (Encrypted Filesystem in Userspace)
```bash
# Install EncFS
sudo apt install encfs

# Create encrypted directory
encfs ~/encrypted ~/decrypted

# Mount existing encrypted directory
encfs ~/encrypted ~/decrypted

# Unmount
fusermount -u ~/decrypted

# Change password
encfsctl passwd ~/encrypted
```

### eCryptfs (Enterprise Cryptographic Filesystem)
```bash
# Install eCryptfs
sudo apt install ecryptfs-utils

# Mount encrypted directory
sudo mount -t ecryptfs /source/directory /mount/point

# Setup home directory encryption
ecryptfs-setup-private

# Unwrap passphrase
ecryptfs-unwrap-passphrase ~/.ecryptfs/wrapped-passphrase
```

## GnuPG (GNU Privacy Guard)

### Key Management
```bash
# Generate new key pair
gpg --full-generate-key
gpg --generate-key  # Quick generation

# List keys
gpg --list-keys
gpg --list-secret-keys

# Export public key
gpg --export --armor user@example.com > public.key
gpg --export user@example.com > public.key.bin

# Export private key
gpg --export-secret-keys --armor user@example.com > private.key

# Import key
gpg --import public.key

# Delete key
gpg --delete-key user@example.com
gpg --delete-secret-key user@example.com

# Edit key
gpg --edit-key user@example.com
```

### GnuPG Operations
```bash
# Encrypt file
gpg --encrypt --recipient user@example.com file.txt
gpg -e -r user@example.com file.txt

# Decrypt file
gpg --decrypt file.txt.gpg
gpg -d file.txt.gpg

# Sign file
gpg --sign file.txt
gpg --detach-sign file.txt
gpg --clear-sign file.txt

# Encrypt and sign
gpg --encrypt --sign --recipient user@example.com file.txt

# Verify signature
gpg --verify file.txt.sig file.txt
```

### Key Server Operations
```bash
# Upload key to keyserver
gpg --send-keys keyid

# Download key from keyserver
gpg --recv-keys keyid
gpg --search-keys user@example.com

# Refresh keys from keyserver
gpg --refresh-keys

# Set default keyserver
echo "keyserver hkps://keys.openpgp.org" >> ~/.gnupg/gpg.conf
```

## Cryptographic Best Practices

### Algorithm Selection
```bash
# Recommended algorithms (as of 2024):
# Symmetric: AES-256, ChaCha20-Poly1305
# Asymmetric: RSA-4096, ECC P-384, Ed25519
# Hashing: SHA-256, SHA-3, BLAKE2
# Password: Argon2id, bcrypt, scrypt

# Deprecated/weak algorithms to avoid:
# DES, 3DES, RC4, MD5, SHA-1, RSA < 2048 bits
```

### Key Management Best Practices
```bash
# 1. Use strong random number generation
# 2. Protect private keys with strong passphrases
# 3. Store keys securely (hardware tokens, encrypted storage)
# 4. Implement key rotation policies
# 5. Use separate keys for different purposes
# 6. Backup keys securely
# 7. Revoke compromised keys immediately

# Example: Secure key backup
gpg --export-secret-keys --armor keyid | \
openssl enc -aes-256-cbc -salt > secret-key-backup.enc
```

### Secure File Handling
```bash
# Secure file deletion
shred -vfz -n 3 sensitive-file.txt
wipe sensitive-file.txt
rm sensitive-file.txt && sync

# Secure temporary files
tmpfile=$(mktemp -t secure.XXXXXX)
chmod 600 "$tmpfile"
trap 'shred -f "$tmpfile"; rm -f "$tmpfile"' EXIT

# Memory protection
ulimit -c 0  # Disable core dumps
echo 2 > /proc/sys/kernel/randomize_va_space  # Enable ASLR
```

## Automation and Scripting

### Automated Encryption Script
```bash
#!/bin/bash
# Secure file encryption script

encrypt_file() {
    local input_file="$1"
    local output_file="${input_file}.enc"
    local key_file="encryption.key"
    
    # Generate random key if it doesn't exist
    if [ ! -f "$key_file" ]; then
        openssl rand -base64 32 > "$key_file"
        chmod 600 "$key_file"
    fi
    
    # Encrypt file
    openssl enc -aes-256-cbc -salt -in "$input_file" \
        -out "$output_file" -pass file:"$key_file"
    
    echo "File encrypted: $output_file"
}

decrypt_file() {
    local input_file="$1"
    local output_file="${input_file%.enc}"
    local key_file="encryption.key"
    
    openssl enc -aes-256-cbc -d -in "$input_file" \
        -out "$output_file" -pass file:"$key_file"
    
    echo "File decrypted: $output_file"
}

# Usage
case "$1" in
    encrypt) encrypt_file "$2" ;;
    decrypt) decrypt_file "$2" ;;
    *) echo "Usage: $0 {encrypt|decrypt} <file>" ;;
esac
```

### Certificate Monitoring Script
```bash
#!/bin/bash
# Certificate expiration monitoring

check_cert_expiry() {
    local cert_file="$1"
    local warning_days="${2:-30}"
    
    if [ ! -f "$cert_file" ]; then
        echo "Certificate file not found: $cert_file"
        return 1
    fi
    
    # Get expiration date
    expiry_date=$(openssl x509 -in "$cert_file" -noout -enddate | cut -d= -f2)
    expiry_epoch=$(date -d "$expiry_date" +%s)
    current_epoch=$(date +%s)
    days_left=$(( (expiry_epoch - current_epoch) / 86400 ))
    
    echo "Certificate: $cert_file"
    echo "Expires: $expiry_date"
    echo "Days left: $days_left"
    
    if [ $days_left -lt $warning_days ]; then
        echo "WARNING: Certificate expires in $days_left days!"
        return 1
    fi
    
    return 0
}

# Check multiple certificates
for cert in /etc/ssl/certs/*.crt; do
    check_cert_expiry "$cert" 30
    echo "---"
done
```

Linux cryptography provides comprehensive tools for protecting data confidentiality, integrity, and authenticity through encryption, hashing, digital signatures, and certificate management, essential for modern security requirements.
