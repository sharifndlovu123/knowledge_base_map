# 09. Port Numbers

> Keep in mind this table is just a bried showcase of each protocol and their respective port number, there are instances where a protocol has more than one port and that should be kept in mind; these summaries dont refer to those additional ports.


# Protocol Port Numbers

## Web and HTTP Services
| Protocol | Port(s) |
|----------|---------|
| HTTP | 80 |
| HTTPS | 443 |
| WebSocket | 80, 443 (WSS) |
| REST | 80, 443 (typically over HTTP/HTTPS) |
| SOAP | 80, 443 (typically over HTTP/HTTPS) |

## File Transfer
| Protocol | Port(s) |
|----------|---------|
| FTP | 20 (data), 21 (control) |
| FTPS | 989 (data), 990 (control) |
| SFTP | 22 |
| TFTP | 69 |
| SCP | 22 |
| FASP | 33001 (default) |
| AS2 | 443 (typically over HTTPS) |
| BitTorrent | 6881-6889 |

## Remote Access
| Protocol | Port(s) |
|----------|---------|
| SSH | 22 |
| Telnet | 23 |
| RDP | 3389 |
| VNC | 5900-5903 |
| X11 | 6000-6063 |

## Email and Messaging
| Protocol | Port(s) |
|----------|---------|
| SMTP | 25, 587 (submission), 465 (SMTPS) |
| POP3 | 110, 995 (POP3S) |
| IMAP | 143, 993 (IMAPS) |
| IRC | 6667, 6697 (TLS) |
| XMPP | 5222 (client), 5269 (server) |
| Signal | 443 (over HTTPS) |
| Matrix | 8448 |
| MQTT | 1883, 8883 (TLS) |

## Network Services
| Protocol | Port(s) |
|----------|---------|
| DNS | 53 (TCP/UDP) |
| DHCP | 67 (server), 68 (client) |
| SNMP | 161 (agent), 162 (trap) |
| NTP | 123 |
| LDAP | 389, 636 (LDAPS) |
| Syslog | 514 (UDP), 601 (TCP), 6514 (TLS) |

## Voice and Video
| Protocol | Port(s) |
|----------|---------|
| SIP | 5060 (UDP/TCP), 5061 (TLS) |
| H.323 | 1720 (call setup), 1719 (RAS) |
| RTMP | 1935 |
| RTP | 16384-32767 (dynamic range) |
| RTSP | 554 |

## File Sharing and Network Storage
| Protocol | Port(s) |
|----------|---------|
| SMB | 445 (modern), 139 (NetBIOS) |
| NFS | 2049 |
| AFP | 548 |
| iSCSI | 3260 |
| WebDAV | 80, 443 |

## Database Systems
| Protocol/Database | Port(s) |
|----------|---------|
| MySQL/MariaDB | 3306 |
| PostgreSQL | 5432 |
| Microsoft SQL Server | 1433 |
| Oracle | 1521, 1526 |
| MongoDB | 27017 |
| Redis | 6379 |
| Cassandra | 9042 (client), 7000 (cluster) |
| Elasticsearch | 9200 (HTTP), 9300 (transport) |
| CouchDB | 5984 |
| Neo4j | 7474 (HTTP), 7687 (Bolt) |
| InfluxDB | 8086 |
| Memcached | 11211 |
| IBM Db2 | 50000 |
| SQLite | No port (file-based) |
| DynamoDB | 443 (HTTPS API) |

## Tunneling and VPN
| Protocol | Port(s) |
|----------|---------|
| L2TP | 1701 |
| PPTP | 1723 |
| OpenVPN | 1194 (default) |
| IPsec | 500 (IKE), 4500 (NAT-T) |
| WireGuard | 51820 (default) |
| Shadowsocks | 8388 (default) |

## IoT and Specialized Protocols
| Protocol | Port(s) |
|----------|---------|
| CoAP | 5683, 5684 (DTLS) |
| MQTT | 1883, 8883 (TLS) |
| AMQP | 5672, 5671 (TLS) |
| Modbus TCP | 502 |
| OPC UA | 4840 |

## Low-Level and Transport
| Protocol | Port(s) |
|----------|---------|
| ICMP | No port (IP protocol 1) |
| TCP | All ports (transport protocol) |
| UDP | All ports (transport protocol) |
| QUIC | 443 (typically) |
| SCTP | No standard port |
| GRE | No port (IP protocol 47) |