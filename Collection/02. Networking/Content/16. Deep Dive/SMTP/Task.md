# 02. Task



## Java-Based Alarm System with Local Email Notification

### **Overview**

This project is a **simulated home alarm system** built in Java, designed to send **email alerts via a local-only SMTP server** when triggered. It mimics real-world alarm sensors using keyboard input and operates fully offline — no external internet connectivity required. The system is designed to run on a full Linux system with a permanent network connection, and it uses standard SMTP commands over a raw TCP socket to deliver messages locally.

---

### **Key Features**

- **Offline Operation**  
  Uses a local SMTP server (e.g., Postfix) to send email without internet access.

- **Manual Sensor Simulation**  
  Simulates motion sensors or door sensors through key presses (`m` for motion, `d` for door).

- **Email Alert via SMTP**  
  Manually sends raw SMTP commands over TCP (no external libraries used) to deliver mail.

- **Local Mail Delivery**  
  Sends messages to the local Linux user’s inbox (`/var/mail/username`) for verification.


---

### **Built From Scratch With:**

- **Java Sockets** – connects to SMTP server over TCP (port 25)
- **Raw SMTP Protocol Commands** – `HELO`, `MAIL FROM`, `RCPT TO`, `DATA`, `QUIT`
- **Standard Input (System.in)** – listens for specific keypresses to simulate triggers
- **Local Mail Tools** – uses `mail` or `mailx` to read messages from `/var/mail/$USER`

---

### **How It Works (Step-by-Step)**

1. **SMTP Server Setup** – Installed and configured Postfix to accept local mail only.
2. **Raw SMTP Socket Programming** – Java connects directly to localhost on port 25.
3. **Send Mail via SMTP Commands** – Program sends proper SMTP commands to deliver a message.
4. **Receive Email Locally** – Local user receives the email; verified using Linux `mail` tool.
5. **Simulate Alarm Input** – Java program waits for specific key presses to simulate an alarm trigger and send alerts.

---

