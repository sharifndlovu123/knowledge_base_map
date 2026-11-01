# 03. File Protocols


Here's a categorization of file transfer protocols based on their encryption support:

**Protocols Without Built-in Encryption:**

|Protocol Name|Description|
|---|---|
|**FTP** (File Transfer Protocol)|Standard network protocol used to transfer files between a client and server over a TCP-based network.|
|**TFTP** (Trivial File Transfer Protocol)|Simplified version of FTP; uses UDP and lacks security features.|
|**FSP** (File Service Protocol)|Lightweight alternative to FTP; operates over UDP without built-in encryption.|
|**BitTorrent**|Peer-to-peer file sharing protocol; does not inherently provide encryption.|
|**HTTP** (Hypertext Transfer Protocol)|Protocol for transmitting hypermedia documents, such as HTML; used for file transfers without encryption.|

**Protocols With Built-in Encryption:**

|Protocol Name|Description|
|---|---|
|**FTPS** (FTP Secure)|Extension to FTP adding support for TLS and SSL encryption.|
|**SFTP** (SSH File Transfer Protocol)|Provides file access, transfer, and management over a secure SSH channel.|
|**HTTPS** (HTTP Secure)|Secure version of HTTP; uses TLS to encrypt data between client and server.|
|**SCP** (Secure Copy Protocol)|Uses SSH for secure file transfers between hosts on a network.|
|**FASP** (Fast and Secure Protocol)|Proprietary protocol designed for high-speed data transfer with built-in encryption.|
|**AS2** (Applicability Statement 2)|Used to transmit EDI data securely over the internet using encryption and digital signatures.|

_Note: Some protocols, such as BitTorrent, can implement encryption through extensions or additional features, but they do not include encryption by default._