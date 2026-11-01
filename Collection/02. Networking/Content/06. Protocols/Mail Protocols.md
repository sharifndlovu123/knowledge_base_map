# 06. Mail Protocols


## **SMTP (Simple Mail Transfer Protocol)**  

**Purpose:** SMTP is used to **send** emails from a client (e.g., Outlook, Gmail) to an email server and between email servers. It does not handle receiving emails.  

---

### **Key Features:**  
- Works on a **push model** (sends emails).  
- Used by **mail servers to relay messages**.  
- Requires **authentication** to prevent spam.  
- Supports **encryption** (TLS/SSL) for security.  

---

### **SMTP Ports:**  
| **Port** | **Encryption** | **Usage** |
|---------|-------------|---------|
| **25** | ❌ None | Used for server-to-server email transfer (often blocked by ISPs). |
| **465** | ✅ SSL | Deprecated but still in use. |
| **587** | ✅ STARTTLS | Recommended for secure email sending. |
| **2525** | ✅ STARTTLS | Alternative if 587 is blocked. |

---

### **SMTP Commands:**  
| **Command** | **Description** |
|------------|----------------|
| `HELO` / `EHLO` | Initiates communication. |
| `MAIL FROM:` | Specifies the sender’s email. |
| `RCPT TO:` | Specifies the recipient’s email. |
| `DATA` | Starts the email content transmission. |
| `QUIT` | Ends the session. |

---

### **SMTP Process:**  
1. **Client connects to SMTP server** on port 587 (or another port).  
2. **Server authenticates the client** (if required).  
3. **Email is sent using SMTP commands** (MAIL FROM, RCPT TO, DATA).  
4. **Server relays the email** to the recipient’s mail server.  
5. **Recipient retrieves email via IMAP or POP3.**  

---

### **Security Measures:**  
- Use **STARTTLS (port 587)** or **SSL (port 465)** for encryption.  
- Enable **SMTP Authentication (SMTP AUTH)** to prevent spam.  
- Use **DKIM, SPF, and DMARC** to prevent email spoofing.  

---
## **POP3 (Post Office Protocol v3)**  

**Purpose:** POP3 is used for **retrieving** emails from a mail server to a client. It downloads emails and typically **deletes them from the server**, making it useful for offline access.  

---

### **Key Features:**  
- Works on a **pull model** (fetches emails).  
- Stores emails **locally** on the user’s device.  
- Does **not sync** emails across multiple devices.  
- **Simpler and faster** than IMAP but less flexible.  

---

### **POP3 Ports:**  
| **Port** | **Encryption** | **Usage** |
|---------|-------------|---------|
| **110** | ❌ None | Default POP3 (unencrypted). |
| **995** | ✅ SSL/TLS | Secure POP3 (recommended). |

---

### **POP3 Commands:**  
| **Command** | **Description** |
|------------|----------------|
| `USER` | Sends the username. |
| `PASS` | Sends the password. |
| `STAT` | Checks the number of emails. |
| `LIST` | Lists emails in the mailbox. |
| `RETR` | Retrieves a specific email. |
| `DELE` | Deletes a specific email. |
| `QUIT` | Ends the session. |

---

### **POP3 Process:**  
1. **Client connects to the POP3 server** on port 110 or 995.  
2. **User logs in** using their credentials.  
3. **Server lists available emails**.  
4. **Client downloads emails** (and optionally deletes them from the server).  
5. **Connection closes**, and emails are stored **locally**.  

---

### **Limitations of POP3:**  
- Emails **do not sync** across multiple devices.  
- **Once downloaded, emails are removed** from the server (unless configured otherwise).  
- Lacks features like **folder organization** (unlike IMAP).  

Use **IMAP instead of POP3** if you need multi-device email access. 

---
## **IMAP4 (Internet Message Access Protocol v4)**  

**Purpose:** IMAP4 is used to **retrieve and manage emails** on a mail server while keeping them stored there. It allows users to access emails from multiple devices and syncs changes across them.  

---

### **Key Features:**  
- **Emails remain on the server** until deleted.  
- Supports **multiple device access** (syncs across devices).  
- Allows **organizing emails into folders**.  
- Supports **partial downloads** (view subject before full download).  

---

### **IMAP4 Ports:**  
| **Port** | **Encryption** | **Usage** |
|---------|-------------|---------|
| **143** | ❌ None | Default IMAP (unencrypted). |
| **993** | ✅ SSL/TLS | Secure IMAP (recommended). |

---

### **IMAP4 Commands:**  
| **Command** | **Description** |
|------------|----------------|
| `LOGIN` | Authenticates the user. |
| `SELECT` | Selects a mailbox (e.g., Inbox). |
| `FETCH` | Retrieves email headers or body. |
| `STORE` | Marks messages (read, unread, deleted, etc.). |
| `EXPUNGE` | Deletes marked messages permanently. |
| `LOGOUT` | Ends the session. |

---

### **IMAP4 Process:**  
1. **Client connects to the IMAP server** on port 143 or 993.  
2. **User logs in** with credentials.  
3. **Server fetches email headers** (without downloading full emails).  
4. **User reads emails** (which remain on the server).  
5. **Changes (read, delete, move) sync** across devices.  

---

### **Advantages of IMAP4 Over POP3:**  
✅ **Emails stay on the server** (ideal for webmail & multi-device access).  
✅ **Syncs changes** (read/unread status, folder organization).  
✅ **Supports remote email management** (without full downloads).  

Use **IMAP4 if you need access from multiple devices**, and use **POP3 only if you want local storage with no syncing**. 


## Understanding Universal Use case of SMTP and IMAP/POP working together.

### **Using SMTP with IMAP or POP3**  

SMTP, IMAP, and POP3 are used together for **sending** and **receiving** emails.  

- **SMTP (Simple Mail Transfer Protocol)** → **Sends** emails  
- **IMAP (Internet Message Access Protocol)** → **Syncs and manages received emails**  
- **POP3 (Post Office Protocol v3)** → **Downloads received emails for local storage**  

---

### **How They Work Together**  

1️⃣ **Sending Emails (SMTP)**  
   - The email client (e.g., Outlook, Gmail) connects to an **SMTP server**.  
   - The user logs in and sends the email via the **MAIL FROM**, **RCPT TO**, and **DATA** commands.  
   - The SMTP server **relays** the email to the recipient’s email server.  
   - The recipient’s email server **stores the email** in the mailbox.  

2️⃣ **Receiving Emails (IMAP or POP3)**  
   - The recipient’s email client connects to their **mail server** using **IMAP or POP3**.  
   - **If using IMAP:** The client syncs with the server, keeping emails on the server and allowing access from multiple devices.  
   - **If using POP3:** The client downloads emails and (by default) removes them from the server, making them available only on one device.  

---

### **Example Setup in an Email Client**  

| **Function** | **Protocol** | **Port (Non-SSL)** | **Port (SSL/TLS)** |
|-------------|------------|-----------------|----------------|
| Sending Emails | **SMTP** | 25 / 587 | 465 |
| Receiving Emails | **IMAP** | 143 | 993 |
| Receiving Emails | **POP3** | 110 | 995 |

---

### **Choosing Between IMAP and POP3**  

| **Feature** | **IMAP** | **POP3** |
|------------|---------|---------|
| Email Storage | Stays on the server | Downloads to device |
| Access from Multiple Devices | ✅ Yes | ❌ No |
| Syncing Read/Unread Status | ✅ Yes | ❌ No |
| Local Email Backup Needed | ❌ No | ✅ Yes |
| Best For | Webmail & multiple devices | Single device, offline access |

---

### **Practical Example**  
- **John uses Outlook.**  
- **SMTP (Port 587)** sends emails from his Outlook to Gmail’s SMTP server.  
- **IMAP (Port 993)** syncs his inbox with Gmail’s server so he can check emails from his laptop and phone.  

If John had used **POP3**, emails would be **downloaded and removed from Gmail’s server**, meaning they wouldn’t sync across devices.  

 **IMAP + SMTP = Best for multi-device access.**  
 **POP3 + SMTP = Best for single-device offline access.**


 Differences Between IMAP and POP

 ### **Impact of IMAP and POP3 on File Directories (Mailbox Structure)**  

IMAP and POP3 handle email storage **differently**, affecting how emails are stored, accessed, and organized on both the **server** and **local machine**.  

---

### **IMAP’s Impact on File Directories**  

📌 **Emails Stay on the Server**  
- The email client **syncs** with the server; emails are **not permanently downloaded**.  
- The same folder structure is maintained across devices.  

📌 **Folder Structure is Preserved**  
- IMAP supports **server-side folders** (Inbox, Sent, Drafts, Spam, Custom Folders).  
- These folders are available across all email apps & devices.  

📌 **Read/Unread Status Syncs**  
- If you read an email on one device, it is **marked as read everywhere**.  

📌 **Local Storage Impact**  
- **No permanent local storage** unless manually downloaded.  
- Some clients cache recent emails for offline access.  

📌 **Example Directory Structure for IMAP:**  
```
/server/mailbox/user/
  ├── Inbox/
  ├── Sent/
  ├── Drafts/
  ├── Trash/
  ├── Spam/
  ├── CustomFolder1/
  ├── CustomFolder2/
```  

---

### **POP3’s Impact on File Directories**  

📌 **Emails are Downloaded & Removed from Server**  
- Emails are transferred **from the server to the local machine**.  
- Once downloaded, they are **deleted from the server** (unless configured otherwise).  

📌 **No Folder Synchronization**  
- POP3 **does not sync folders** (Inbox, Sent, etc.).  
- Each email app manages its own **local folder structure** separately.  

📌 **Requires an Email App for File Handling**  
- POP3 **relies on the email client** (e.g., Outlook, Thunderbird) to store and manage emails.  
- The app must create local directories to organize emails.  

📌 **Local Storage Impact**  
- Emails are stored in **local directories** on the user’s device.  
- If the computer crashes, emails can be **lost unless backed up**.  

📌 **Example Directory Structure for POP3:**  
```
/local/mail/
  ├── Inbox/  (Downloaded emails)
  ├── Sent/  (Managed by email app, not server-synced)
  ├── Archive/ (If user saves emails)
  ├── OldEmails.mbox (Static files storing past messages)
```

---

### **Comparison: IMAP vs. POP3 on Directories**  

| Feature | **IMAP** | **POP3** |
|---------|---------|---------|
| **Where are emails stored?** | On the **server** | On the **local device** |
| **Folder structure?** | ✅ **Syncs across devices** | ❌ **Only local, no sync** |
| **Read/unread sync?** | ✅ Yes | ❌ No |
| **Requires an email app for file storage?** | ❌ No (server handles) | ✅ Yes (app manages files) |
| **Access from multiple devices?** | ✅ Yes | ❌ No |
| **Risk of losing emails?** | ❌ Low (stored on server) | ✅ High (if not backed up) |

**IMAP keeps emails on the server, syncing across devices with folder support.**  
**POP3 depends on an email app to store and manage emails locally.**