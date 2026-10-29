A methodical approach plus the tools for each layer of the [[OSI Model]].

---

# Troubleshooting Methodology

1. **Identify the problem**: gather info, question users, what changed, duplicate the issue, define the scope
2. **Establish a theory** of probable cause (start with the obvious, consider multiple causes)
3. **Test the theory**; if wrong, form a new one or escalate
4. **Establish a plan of action**, consider impact, then implement or escalate
5. **Verify full functionality** and add preventive measures
6. **Document** findings, actions and outcomes

Approaches: **top-down** (application first), **bottom-up** (cables first), **divide and conquer** (start mid-stack, e.g. ping), **follow the path**, **compare with a working device**, **swap components**.

---

# The Quick Ladder

```
1. Physical    link lights / cable        →  replace patch cable, check port
2. Data link   VLAN, duplex, MAC          →  show interface, show vlan
3. Network     IP, mask, gateway          →  ip a, ping gateway, ping remote IP
4. Name        DNS                        →  nslookup / dig
5. Transport   port open / firewall       →  nc, telnet, ss, nmap
6. Application the service itself         →  curl, logs
```

If you can ping `8.8.8.8` but not `google.com`, it is **DNS**. If you cannot ping your gateway, it is local (layer 1-3).

---

# Tools

## Connectivity and path

| Tool | Use |
| ---- | --- |
| `ping` | ICMP echo, reachability and latency |
| `traceroute` / `tracert` | Hop-by-hop path (uses TTL expiry) |
| `mtr` | Continuous traceroute with loss per hop |
| `pathping` (Windows) | Ping + trace statistics |
| `arp -a` | IP ↔ MAC cache |

```
$ ping -c 4 192.168.1.1          # gateway
$ ping -c 4 8.8.8.8              # internet by IP
$ traceroute example.com
$ mtr -rw example.com
```

## Local configuration

| OS | Command |
| -- | ------- |
| Linux | `ip a`, `ip r`, `ip neigh`, `nmcli`, `resolvectl status` |
| Windows | `ipconfig /all`, `ipconfig /release`, `/renew`, `/flushdns`, `route print` |
| Both | `hostname`, `nslookup` |

```
$ ip a                           # addresses
$ ip r                           # routing table, check default route
$ ip neigh                       # ARP table
```

## Name resolution

```
$ nslookup example.com 1.1.1.1
$ dig example.com A +short
$ dig @8.8.8.8 example.com MX
$ dig -x 93.184.216.34           # reverse lookup
$ dig +trace example.com         # follow delegation from the root
```

See [[DNS]].

## Ports and sockets

```
$ ss -tulpn                      # listening sockets (Linux), netstat -an on Windows
$ nc -zv host 443                # test a TCP port
$ nmap -sS -p 1-1024 host        # port scan
$ curl -v https://example.com    # full HTTP exchange incl. TLS
$ curl -I https://example.com    # headers only
$ openssl s_client -connect example.com:443   # inspect TLS certificate
```

## Packet capture
- **Wireshark** (GUI) and **tcpdump** (CLI) capture traffic; mirror a switch port with **SPAN** ([[Switching and VLANs]])

```
$ sudo tcpdump -i eth0 -nn port 53          # watch DNS
$ sudo tcpdump -i eth0 host 10.0.0.5 and tcp port 80 -w cap.pcap
```

Display filters: `ip.addr == 10.0.0.5`, `tcp.port == 443`, `dns`, `tcp.flags.syn == 1`.

## Hardware testers

| Tool | Finds |
| ---- | ----- |
| **Cable tester** | Continuity, shorts, split pairs, miswires |
| **Tone generator and probe** | Locate a cable in a bundle |
| **TDR** (copper) / **OTDR** (fibre) | Distance to a break |
| **Multimeter** | Voltage / continuity |
| **Loopback plug** | Test a port / NIC |
| **Wi-Fi analyser** | Signal strength, channel overlap, interference |
| **Optical power meter** | Fibre signal loss |
| **Toner / punch-down tool, crimper** | Terminating cable |

See [[Cabling]].

---

# Common Problems and Causes

## Cabling and physical
| Symptom | Likely cause |
| ------- | ------------ |
| No link light | Bad cable, wrong cable type (straight vs crossover on old gear), dead port, SFP mismatch |
| Intermittent drops | Damaged cable, EMI / crosstalk, loose connector |
| Slow, many CRC errors | Bad cable, **duplex mismatch**, attenuation, exceeded **100 m** copper limit |
| TX/RX swapped on fibre | No link |
| Wrong standard | Cat5 on a 10G run, SM vs MM fibre, **bad SFP / transceiver** |

## Addressing and routing
| Symptom | Likely cause |
| ------- | ------------ |
| `169.254.x.x` address | DHCP unreachable / failed ([[Network Services]]) |
| Cannot leave subnet | Wrong / missing **default gateway** or mask |
| **Duplicate IP** | Static conflicts with DHCP, flapping connectivity |
| Reaches some networks only | Missing route, wrong subnet mask ([[Subnetting]]) |
| One direction works | **Asymmetric routing**, firewall state, ACL |
| **Routing loop** | TTL expired in transit messages |
| **Black hole** | Packets silently dropped (bad route, filter, ICMP blocked) |

## Name resolution
- Wrong DNS server / stale cache (`ipconfig /flushdns`), missing record, **split-horizon** surprises, TTL not expired after a change

## Switching and VLAN
- Wrong **VLAN** on access port, **trunk** not allowing the VLAN, **native VLAN mismatch**, **STP** blocking or loops / broadcast storm, **port security** shutdown (err-disabled), **MAC table** issues

## Wireless
- **Interference** (microwaves, neighbouring channels; use 1/6/11 on 2.4 GHz), **signal attenuation**, **channel overlap**, **dead spots**, wrong **SSID / passphrase / security type**, **roaming** issues, too many clients, **hidden node**, AP capacity ([[Wifi]])

## Application / service
- Port blocked by firewall or ACL, service not running or **bound to 127.0.0.1**, certificate expired or mismatched CN/SAN, **MTU / MSS** problems (small packets fine, large fail), time skew breaks TLS / Kerberos

---

# Reading ICMP and `traceroute` Output

| Result | Meaning |
| ------ | ------- |
| `Request timed out` | Dropped or not answering (ICMP may be blocked) |
| `Destination host unreachable` | No route / ARP failed (from local router or host) |
| `Destination net unreachable` | Router has no route |
| `TTL expired in transit` | Likely routing loop |
| `* * *` in traceroute | Hop does not reply to probes (not necessarily a fault) |
| Latency jump at one hop that continues | Congestion / issue at that hop |

---

# Interface Counters (switch / router)

```
Switch# show interfaces Gi0/1
  ...
  5 input errors, 5 CRC, 0 frame
  1200 runts, 0 giants
  3000 collisions, 120 late collision
```

| Counter | Hints |
| ------- | ----- |
| **CRC / FCS errors** | Bad cable, interference, duplex mismatch |
| **Runts** (< 64 B) | Collisions, bad NIC |
| **Giants** (> 1518 B) | MTU mismatch, bad NIC |
| **Late collisions** | Duplex mismatch or cable too long |
| **Drops / discards** | Congestion, QoS, buffer overflow |
| **Input errors vs output errors** | Source of the problem (receive side vs transmit) |

Quick router checks: `show ip interface brief`, `show ip route`, `show arp`, `show running-config`, `show logging`.

---

# Documentation Helps
- Network diagrams (physical and logical), **IDF / MDF** layout, **rack** diagrams, **cable labels**, **IP address plan**, **baselines** to compare against, **change logs**, and **asset inventory**

Related: [[Network Operations and Monitoring]], [[Network Devices]]
