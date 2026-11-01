# 07. Network Communication & Streaming Protocols



## **VoIP Protocols & Ports**  

| **Protocol** | **Purpose** | **Default Port(s)** |
|-------------|------------|------------------|
| **SIP (Session Initiation Protocol)** | Call signaling (setup, modify, and terminate calls) | **5060 (UDP/TCP, unencrypted)** <br> **5061 (TCP, encrypted with TLS)** |
| **RTP (Real-time Transport Protocol)** | Transmits voice & video data | **Dynamic range: 16384–32767 (UDP, varies by implementation)** |
| **RTCP (RTP Control Protocol)** | Monitors RTP sessions for QoS | **Same as RTP, alternating port numbers (UDP)** |

 **Why These Ports Matter?**  
- **SIP (5060/5061)** → Handles call initiation, management, and termination.  
- **RTP (16384-32767)** → Delivers actual voice/video packets.  
- **RTCP** → Provides quality feedback (e.g., packet loss, jitter).  

**Firewalls & NAT Configurations Must Allow These Ports for Smooth VoIP Communication!**



## **SIP (Session Initiation Protocol)**  

📌 **What is SIP?**  
SIP (Session Initiation Protocol) is a **signaling protocol** used to establish, modify, and terminate **real-time communication sessions** such as voice, video, and messaging over IP networks. It is widely used in **VoIP (Voice over IP)** systems, video conferencing, and multimedia applications.  

---                               

### **Key Features of SIP:**  

✅ **Session Management**  
- Establishes, modifies, and ends VoIP calls and multimedia sessions.  

✅ **Supports Multiple Media Types**  
- Handles **voice, video, messaging, and file transfers**.  

✅ **Peer-to-Peer Communication**  
- Devices communicate directly after the session is established.  

✅ **User Mobility**  
- Calls can be redirected to different devices (e.g., from a desk phone to a mobile).  

✅ **Works with Other Protocols**  
- Uses **RTP (Real-time Transport Protocol)** for media transmission.  
- Can integrate with **H.323** for video conferencing.  

✅ **SIP Addressing**  
- Users have a SIP address similar to an email (`sip:user@domain.com`).  

---

### **How SIP Works (Call Flow)**  

1️⃣ **User A dials User B**  
2️⃣ **SIP INVITE** request is sent to User B’s SIP server  
3️⃣ User B’s SIP server forwards the request  
4️⃣ User B accepts the call (SIP 200 OK response)  
5️⃣ Media (voice/video) is transmitted using RTP  
6️⃣ Either user can send a **BYE** request to end the session  

---

### **SIP in Network Directories**  

📌 **SIP Servers (PBX Systems) Maintain Call Records**  
- Call logs and metadata (time, duration, participants)  
- Voicemail and call recordings  

📌 **User Data is Stored on SIP Proxies or Registrars**  
- **Registrar Server** stores user locations  
- **Proxy Server** routes SIP messages  

📌 **Example SIP Directory Structure:**  
```
/var/log/sip/
  ├── call_records/
  ├── voicemail/
  ├── sip_users.db
```

---

### **Comparison: SIP vs. Other Communication Protocols**  

| Feature | **SIP** | **H.323** | **WebRTC** |
|---------|--------|--------|--------|
| **Purpose** | VoIP & multimedia | Video conferencing | Web-based real-time comms |
| **Flexibility** | Highly flexible | Rigid architecture | Browser-native |
| **Network Type** | IP-based | IP + PSTN | Web-based |
| **Ease of Use** | Easier to implement | Complex setup | Simple for developers |

**SIP is a flexible, widely used protocol for VoIP, video calls, and real-time communications.**

---

## **RTSP (Real-Time Streaming Protocol)**  

📌 **What is RTSP?**  
RTSP (Real-Time Streaming Protocol) is a **network control protocol** used to establish and control streaming media sessions between clients and servers. It is commonly used for **live video streaming**, IP cameras, and media playback applications.  

---

### **Key Features of RTSP:**  

✅ **Media Control (Not Transmission)**  
- RTSP **controls** streaming sessions (play, pause, stop, seek) but does not transmit media itself.  
- Uses **RTP (Real-time Transport Protocol)** or **RTCP** for media delivery.  

✅ **Supports On-Demand & Live Streaming**  
- Can stream pre-recorded media or live feeds (e.g., security cameras, live broadcasts).  

✅ **Client-Server Communication**  
- Clients send RTSP requests, and the server responds with stream control commands.  

✅ **Efficient Bandwidth Usage**  
- Clients can start/stop streaming without reloading the entire media file.  

✅ **Works Over TCP & UDP**  
- Uses TCP for control signaling and UDP (via RTP) for media transport.  

---

### **RTSP Request Flow (Example for Video Playback)**  

1️⃣ **Client sends SETUP request** → Server responds with transport details.  
2️⃣ **Client sends PLAY request** → Server starts streaming via RTP.  
3️⃣ **Client sends PAUSE request** → Server temporarily halts streaming.  
4️⃣ **Client sends TEARDOWN request** → Server ends the session.  

---

### **RTSP in File Directories**  

📌 **Media Server Directory Structure:**  
```
/media/server/
  ├── movies/
  ├── live_feeds/
  ├── recordings/
```
📌 **RTSP URL Example:**  
- `rtsp://192.168.1.10:554/live/stream` (Streaming from an IP camera)  
- `rtsp://media.example.com:554/video.mp4` (On-demand video streaming)  

---

### **Comparison: RTSP vs. Other Streaming Protocols**  

| Feature  | **RTSP** | **HLS (HTTP Live Streaming)** | **DASH (Dynamic Adaptive Streaming over HTTP)** |
|----------|--------|--------|--------|
| **Latency** | Low (Real-time) | High (Chunk-based) | Medium |
| **Transport Protocol** | RTP (UDP/TCP) | HTTP (TCP) | HTTP (TCP) |
| **Use Case** | Live streaming, IP cameras | On-demand & live streaming | Adaptive streaming |

**RTSP is ideal for real-time streaming in surveillance, conferencing, and live media applications.**

---

## **VoIP (Voice over Internet Protocol)**  

📌 **What is VoIP?**  
VoIP (Voice over Internet Protocol) is a technology that enables **voice communication over the internet** instead of traditional phone lines (PSTN). It converts voice into digital packets and transmits them using IP networks.  

---

### **Key Features of VoIP:**  

✅ **Uses IP Networks for Calls**  
- Voice is transmitted as **data packets** over the internet.  
- Can work on **Wi-Fi, Ethernet, or mobile data (4G/5G)**.  

✅ **Cost-Effective**  
- Eliminates traditional phone charges.  
- Free or low-cost international calls.  

✅ **Flexible & Scalable**  
- Works on **IP phones, computers, and mobile devices**.  
- Can integrate with business **PBX (Private Branch Exchange) systems**.  

✅ **Supports Multimedia**  
- Handles **voice, video, and text messaging**.  

✅ **Uses SIP for Call Signaling**  
- **SIP (Session Initiation Protocol)** is commonly used to manage VoIP calls.  

✅ **Requires RTP for Media Transmission**  
- **RTP (Real-time Transport Protocol)** is used for delivering voice data.  

---

### **How VoIP Works (Call Flow)**  

1️⃣ **User dials a number** → SIP sends an INVITE request.  
2️⃣ **Call is established** → Media is transmitted via RTP.  
3️⃣ **Voice is digitized & compressed** → Sent in IP packets.  
4️⃣ **Call ends** → SIP sends a BYE request to terminate.  

---

### **VoIP & File Directories**  

📌 **VoIP Servers Store Call Logs & Recordings:**  
```
/var/voip/
  ├── call_logs/
  ├── recordings/
  ├── sip_users.db
```
📌 **Example VoIP Setup with SIP:**  
- **SIP Server**: Manages call signaling.  
- **Media Gateway**: Converts VoIP to PSTN (if needed).  
- **RTP Streams**: Handle actual voice data.  

---

### **Comparison: VoIP vs. Traditional Telephony**  

| Feature  | **VoIP** | **PSTN (Traditional Phone)** |
|----------|---------|------------------------------|
| **Cost** | Low (Internet-based) | High (Line rental, call charges) |
| **Scalability** | Easy (Software-based) | Limited (Requires physical lines) |
| **Call Quality** | Dependent on network | Consistent but costly |
| **Features** | Voice, video, messaging | Voice only |
 **VoIP is the future of communication, offering flexible, cost-effective voice and multimedia services over IP networks.**