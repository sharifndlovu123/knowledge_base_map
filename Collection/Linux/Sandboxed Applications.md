## **Sandboxed Applications in Linux**  

Sandboxing in Linux isolates applications from the rest of the system, restricting their access to files, network, and other system resources. This enhances security by preventing malicious or buggy applications from affecting the host system.  

---

### **Types of Sandboxing in Linux**  

#### **1. Namespace-Based Sandboxing**  
- Uses **Linux namespaces** to isolate processes, networking, mount points, and users.  
- Used in **Docker, LXC (Linux Containers), and Kubernetes**.  

#### **2. Mandatory Access Control (MAC)**  
- Uses security policies to limit what applications can access.  
- Examples:  
  - **SELinux (Security-Enhanced Linux)** – Used in Red Hat and CentOS.  
  - **AppArmor** – Used in Ubuntu and Debian.  

#### **3. User Space Sandboxing**  
- Applications run with restricted privileges under a specific user or group.  
- Example: **chroot** – Restricts file system access by creating a new root directory.  

#### **4. Application Sandboxing Tools**  

| Tool           | Description |  
|---------------|------------|  
| **Flatpak**   | Runs applications in an isolated user space with limited permissions. Used in Fedora and GNOME. |  
| **Snap**      | Similar to Flatpak, but uses AppArmor for security. Developed by Canonical for Ubuntu. |  
| **Firejail**  | Lightweight tool that restricts application access using namespaces and seccomp. |  
| **Bubblewrap**| Minimal sandboxing tool that restricts file access and process permissions. |  

---

### **Use Cases for Sandboxed Applications**  
- **Running untrusted software** (e.g., isolating a downloaded app).  
- **Secure web browsing** (e.g., Firefox in a sandbox).  
- **Testing and development** (e.g., running applications without modifying the system).  
- **Preventing malware spread** (e.g., limiting network and file access).  

Sandboxing in Linux enhances security by limiting application privileges, making it harder for malware or compromised apps to affect the system.