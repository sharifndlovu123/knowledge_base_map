# **Ethernet**  

Ethernet is a widely used networking technology that enables wired communication in LANs (Local Area Networks), MANs (Metropolitan Area Networks), and some WANs (Wide Area Networks). It defines standards for cabling, signaling, and data transmission.  

---

## **1. Ethernet Standards and Speeds**  

Ethernet has evolved over time to support higher speeds and different transmission media.  

| **Standard**  | **Speed**  | **Max Cable Length** | **Cable Type**  | **Common Use**  |
|--------------|-----------|----------------------|----------------|----------------|
| 10BASE-T     | 10 Mbps   | 100m                 | Cat 3 UTP       | Early networks |
| 100BASE-TX   | 100 Mbps  | 100m                 | Cat 5 UTP       | Basic LANs |
| 1000BASE-T   | 1 Gbps    | 100m                 | Cat 5e/6 UTP    | Standard for most networks |
| 10GBASE-T    | 10 Gbps   | 55m (Cat 6) / 100m (Cat 6a) | Cat 6/6a UTP | High-speed networks |
| 40GBASE-T    | 40 Gbps   | 30m                  | Cat 8 UTP       | Data centers |
| 100GBASE-T   | 100 Gbps  | 30m                  | Cat 8 UTP       | High-performance computing |

Higher-speed Ethernet standards like **40GbE and 100GbE** also support **fiber optics** for longer distances.  

---

## **2. Ethernet Cable Types**  

Ethernet operates over different cable types, depending on speed and distance requirements.  

### **Twisted Pair Cables (Most Common for LANs)**
- **UTP (Unshielded Twisted Pair)**: Standard Ethernet cabling, cost-effective but vulnerable to interference.  
- **STP (Shielded Twisted Pair)**: Used in environments with high electromagnetic interference.  

### **Fiber Optic Cables (Used for Long Distances)**
- **Single-Mode Fiber (SMF)**: Supports distances up to 100 km.  
- **Multi-Mode Fiber (MMF)**: Shorter range, up to 2 km.  

### **Coaxial Cable (Older Ethernet)**
- Used in **10BASE2** and **10BASE5** networks but now mostly obsolete.  

---

## **3. Ethernet Frame Structure**  

Ethernet uses a standardized **frame structure** for data transmission.  

| **Field**    | **Size (Bytes)** | **Description** |
|-------------|----------------|----------------|
| **Preamble** | 7              | Synchronization pattern |
| **SFD (Start Frame Delimiter)** | 1 | Indicates start of frame |
| **Destination MAC** | 6 | Target device’s MAC address |
| **Source MAC** | 6 | Sender’s MAC address |
| **EtherType/Length** | 2 | Identifies protocol (IPv4, IPv6, etc.) |
| **Payload** | 46–1500 | Actual data being transmitted |
| **FCS (Frame Check Sequence)** | 4 | Error detection |

Each frame follows the **CSMA/CD (Carrier Sense Multiple Access with Collision Detection)** mechanism in half-duplex mode, but modern Ethernet primarily uses **full-duplex switching**, eliminating collisions.  

---

## **4. Ethernet Network Devices**  

- **Switch**: Directs Ethernet frames between devices in a network.  
- **Router**: Connects different networks and directs traffic between them.  
- **NIC (Network Interface Card)**: Allows a device to connect to an Ethernet network.  

---

## **5. Ethernet Deployment Types**  

- **LAN (Local Area Network)**: Small-scale Ethernet network in homes or offices.  
- **MAN (Metropolitan Area Network)**: Ethernet used in cities for fiber-optic infrastructure.  
- **WAN (Wide Area Network)**: Ethernet used in data centers and internet backbone.  

Ethernet is scalable, reliable, and widely used for both consumer and enterprise networking.