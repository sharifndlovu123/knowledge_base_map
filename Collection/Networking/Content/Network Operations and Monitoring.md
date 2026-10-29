Keeping a network running: monitoring, availability, performance, change control and documentation. Management protocols are in [[Network Management Protocols]].

---

# Monitoring

## Metrics
| Metric | Meaning |
| ------ | ------- |
| **Bandwidth** | Maximum capacity |
| **Throughput** | Actual data rate achieved |
| **Latency** | Delay (ms) |
| **Jitter** | Variation in latency, matters for voice / video |
| **Packet loss** | % of packets not delivered |
| **Utilisation** | % of capacity used |
| **Errors / discards** | CRC, drops, see [[Network Troubleshooting]] |
| **Availability** | Uptime %, e.g. 99.99% ≈ 52 min downtime / year |

A **baseline** (normal performance) lets you spot anomalies.

## Protocols and tools

| Tool / protocol | Purpose |
| --------------- | ------- |
| **SNMP** (UDP 161, traps 162) | Poll devices (OIDs in a **MIB**); **v1/v2c** community strings (weak), **v3** auth + encryption. Components: manager, agent, MIB |
| **Syslog** (UDP 514) | Central logs, severities **0 Emergency to 7 Debug** |
| **NetFlow / IPFIX / sFlow** | Flow records: who talks to whom, how much |
| **Packet capture** | Wireshark / tcpdump deep dive |
| **Ping / traceroute** | Reachability and path |
| **WMI / agents** | Host metrics |
| **Nagios, Zabbix, PRTG, LibreNMS, SolarWinds** | Monitoring platforms |
| **Prometheus + Grafana** | Metrics and dashboards (common with Kubernetes) |
| **SIEM** | Correlate logs for security |

Syslog severities: 0 Emergency, 1 Alert, 2 Critical, 3 Error, 4 Warning, 5 Notice, 6 Informational, 7 Debug.

```
$ snmpwalk -v2c -c public 192.168.1.1 system
$ snmpget -v3 -l authPriv -u monitor -a SHA -A authpass -x AES -X privpass 192.168.1.1 sysUpTime.0
```

Cloud equivalents: [[6. Azure Governance and Cost Management]] (Azure Monitor), [[6. AWS Developer Services and Serverless]] (CloudWatch), VPC flow logs ([[5. AWS Networking]]).

---

# High Availability and Redundancy

## Concepts
- **Single point of failure (SPOF)**: remove with redundancy
- **Active-active** (both share load) vs **active-passive / standby** (failover)
- **MTBF**, **MTTR**, **MTTF**; **RTO** (time to restore) and **RPO** (data loss window)

## Techniques

| Technique | Purpose |
| --------- | ------- |
| **Redundant links and devices** | Survive failure of a path or box |
| **Link aggregation (LACP)** | Bandwidth + redundancy ([[Switching and VLANs]]) |
| **STP / RSTP** | Loop-free redundant switching |
| **FHRP**: **HSRP, VRRP, GLBP** | Shared virtual gateway IP so hosts keep one default gateway when a router dies |
| **Dynamic routing** | Reroute automatically ([[Routing Protocols]]) |
| **Multihoming / ISP redundancy** | Two providers, often with BGP |
| **Load balancing / clustering** | Share load, survive node loss |
| **UPS and generators** | Power continuity |
| **NIC teaming** | Server-side redundancy |
| **RAID** | Disk redundancy |

## Site recovery types
- **Hot site**: fully equipped, live data, minutes to switch
- **Warm site**: equipment ready, data restored first, hours to days
- **Cold site**: empty space and power, days to weeks
- **Cloud DR**: see [[7. AWS Solutions Architecture]]

## Backups
- **Full**, **incremental** (since last backup, small, slow restore), **differential** (since last full)
- **3-2-1 rule**: 3 copies, 2 media, 1 offsite; test restores

---

# Quality of Service (QoS)

Prioritises traffic when links are congested so latency-sensitive flows (voice, video) win over bulk transfers.

- **Classification and marking**: **DSCP** (IP header), **CoS / 802.1p** (layer 2). Voice often **EF (46)**
- **Queuing**: FIFO, priority queuing, weighted fair queuing, **LLQ** (strict priority for voice)
- **Traffic shaping** (buffer and smooth) vs **policing** (drop / re-mark excess)
- **Congestion avoidance**: RED / WRED
- Voice targets: one-way latency < 150 ms, jitter < 30 ms, loss < 1%

---

# Traffic and Performance Concepts
- **Unicast, multicast** (one-to-group, IGMP) and **broadcast**; **anycast**
- **Bandwidth management**, **traffic shaping**, **caching** and **CDNs**
- **MTU** (1500 for Ethernet) and **MSS**; fragmentation hurts performance
- **Duplex**: full vs half; **auto-negotiation**
- **802.3 standards**: 10/100/1000BASE-T copper to 100 m; 10GBASE-T; fibre SX/LX/LR for multimode / single-mode ([[Ethernet]], [[Cabling]])

---

# Change and Configuration Management

- **Change management**: request → risk assessment → approval → schedule window → implement → verify → rollback plan → document
- **Configuration management**: baselines, **version control** for device configs (Git), config backups, **golden images**, templates
- **Network as code / automation**: Ansible, Python (Netmiko, NAPALM), Terraform; **APIs** (REST, NETCONF / RESTCONF, gNMI), **SDN** (control plane separated from data plane), **intent-based networking**
- **Patch and firmware management**: test, stage, deploy, verify
- **Lifecycle**: end-of-life / end-of-support planning

---

# Documentation and Policies

| Document | Content |
| -------- | ------- |
| **Physical diagram** | Racks, cabling, ports, patch panels (MDF / IDF) |
| **Logical diagram** | Subnets, VLANs, routing, flows |
| **IP address management (IPAM)** | Allocations, DHCP scopes |
| **Wiring / port maps** | Cable and patch panel labels |
| **Asset inventory** | Devices, serials, warranties, firmware |
| **Baseline / SLA** | Expected performance and uptime commitments |
| **Policies** | Acceptable use, BYOD, remote access, password, incident response, DR / BCP |

Good practice: **label everything**, keep documentation current, use **standard operating procedures**, **lock and log** physical access.

---

# Related Technology Notes

- **IPv6 transition**: dual stack, tunnelling, NAT64 ([[Ipv4 and Ipv6]])
- **Virtualisation / cloud networking**: virtual switches, VNets / VPCs, NFV, [[3. Azure Networking]], [[5. AWS Networking]]
- **Wireless operations**: site surveys, channel planning, controller management ([[Wifi]])
- **Voice / video**: SIP, RTP, QoS
- **IoT and OT networks**: segmentation, specialised protocols
