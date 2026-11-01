# 03. Peer to Peer Architecture

### **Peer-to-Peer (P2P) Architecture**

**Peer-to-Peer (P2P)** is a decentralized **network architecture** where each device (peer) acts both as a **client and a server**. In this model, all peers have equal capabilities and can communicate directly with each other to share resources, rather than relying on a central server.

#### **Key Components:**

1. **Peers**:
    
    - Each peer is a device (computer, smartphone, etc.) that participates in the network.
    - Peers both **request** and **provide** services/resources to other peers.
    - There is **no central server**; each peer is responsible for sharing its own resources, such as files, computing power, or bandwidth.
2. **Resource Sharing**:
    
    - Peers share resources directly with one another, such as files in file-sharing systems, processing power in distributed computing, or bandwidth in video streaming.

#### **How It Works:**

1. **Resource Discovery**: Peers can discover each other through a **distributed hash table (DHT)**, a lookup system, or some form of directory services.
2. **Direct Communication**: Once a peer locates another, they communicate directly, exchanging data or services.
3. **Distributed Tasks**: In some P2P networks, tasks or resources can be divided among peers, such as in **distributed computing** projects or file-sharing networks.

#### **Characteristics**:

- **Decentralized**: There is no central server. Each peer is autonomous and can join or leave the network freely.
- **Resource Sharing**: Peers share data or services directly with each other without needing a middleman.
- **Scalability**: The system can scale as more peers join, without the need for a central infrastructure.
- **Fault Tolerant**: The failure of one or several peers doesn't bring down the whole system, as other peers can take over their tasks or data.

#### **Examples**:

- **File Sharing**: Systems like **BitTorrent** allow peers to share files directly, with no central server storing the files.
- **VoIP**: Peer-to-peer communication platforms like **Skype** use P2P for direct voice or video calls between users.
- **Cryptocurrencies**: Networks like **Bitcoin** use P2P for decentralized transactions, where each node in the network can act as both a user and a miner (validator).

#### **Advantages**:

- **Decentralization**: Reduces reliance on central servers, which lowers costs and avoids a single point of failure.
- **Efficiency**: Direct communication between peers can increase speed and reduce the overhead of using centralized servers.
- **Fault Tolerance**: The network is more robust because the failure of one peer doesn't affect the whole network.

#### **Disadvantages**:

- **Security Issues**: Since peers are directly connected to each other, there’s more potential for **malicious activity**, such as sharing infected files or unauthorized access.
- **Scalability Limitations**: In very large P2P networks, finding peers and maintaining connections can become inefficient without proper infrastructure.
- **Data Consistency**: Ensuring that data is synchronized and consistent across multiple peers can be challenging.

In summary, **Peer-to-Peer (P2P)** architecture enables decentralized, direct communication between devices, making it ideal for sharing resources, distributed tasks, and scaling without relying on a central server. However, it introduces challenges like security concerns and the need for efficient discovery and management of peers.