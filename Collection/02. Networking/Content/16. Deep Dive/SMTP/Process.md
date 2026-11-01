# 01. SMTP Process

---

## **Step 1: Goal Clarification**

### Assignment Goal

You are building a **keyboard-triggered alarm simulator** that:

- Simulates a **sensor** using **keyboard input**.
- Sends an **email via SMTP** to a **local user’s mailbox** (not the internet).
- Proves delivery by reading the email in a local email client (like `mail`).

### Real-world Analogy

This is like simulating a home alarm system that emails you when triggered — but it only uses **local infrastructure** (no cloud, no Gmail, no external mail servers).

---

### What You Will Build

- A **Java program** that:

    - Listens for key presses (e.g., door opens → you hit `D`)
    - Connects to an SMTP server (on `localhost:25`)
    - Sends a properly-formatted email using raw SMTP commands

- A **Postfix mail server** that:

    - Accepts the email from your Java program
    - Delivers it to your local user account inbox

- A way to **read the email locally** (to prove it worked)

---

### What You’re NOT Doing

- You're **not** sending email to Gmail or external accounts.
- You're **not** using any high-level mail libraries (like JavaMail).
- You're **not** using APIs or cloud services.

---

### Requirements Going Forward

You’ll need:

- Linux OS, or WSL2 on Windows (This solution will be done with Linux OS).
- Java (JDK 11+)
- Postfix installed locally
- Mail client (`mail` or `mutt`)

---

That’s **Step 1: Goal clarified and scoped**.

---


## **Step 2: System Setup (Linux)**

We’ll set up:

- A working **Postfix SMTP server** (local only)
- A **mail client** to verify messages
- Your Linux user account as a local recipient

---

### Step 2.1: Install Required Packages

Install **Postfix** (SMTP server) and **mailutils** (simple mail client):

```bash
sudo apt update
sudo apt install postfix mailutils
```

During install, you’ll get prompted for Postfix configuration.

---

### Step 2.2: Postfix Install Prompts

#### Prompt 1: "General type of mail configuration"
- Choose: `Local only`

#### Prompt 2: "System mail name"
- Enter: `localhost`

That tells Postfix:
s
- Only accept mail from local programs
- Only deliver mail to users on your own system
- Never talk to the internet

---

### Step 2.3: Verify Postfix Config

Open the config:
```bash
sudo nano /etc/postfix/main.cf
```

Look for (or add if missing):

```ini
inet_interfaces = loopback-only
mydestination = localhost.localdomain, localhost
```

Save and exit (`Ctrl + O`, `Enter`, `Ctrl + X`)

---

### Step 2.4: Restart Postfix

```bash
sudo systemctl restart postfix
```

---

### Step 2.5: Test Local Delivery

Send a test email to your user (replace `$USER` if needed):

```bash
echo "This is a test message" | mail -s "Test Subject" $USER
```

Now read it:

```bash
mail
```

If you see the email: **Postfix is working and delivering mail locally.**

---

At this point:

- Your Linux system can send/receive local emails.
- Postfix is isolated (no internet delivery).
- Your user has a functioning local inbox.


---

## **Step 3: Java Program to Send Raw SMTP Email**

Now we write a Java program that:

- Connects to your local Postfix SMTP server (`localhost:25`)
- Sends an email using raw SMTP commands
- Triggers on a key press (simulating a sensor)

---

### Step 3.1: Basic Java SMTP Client Skeleton

Here's the full code, no libraries — just `Socket`, `PrintWriter`, and `BufferedReader`.

```java
import java.io.*;
import java.net.Socket;
import java.util.Scanner;

public class AlarmSMTP {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Alarm system armed. Press any key to simulate sensor trigger...");

        scanner.nextLine(); // Wait for key press

        try (Socket socket = new Socket("localhost", 25);
             PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
             BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()))) {

            // Read server banner
            System.out.println("SERVER: " + in.readLine());

            // Send HELO
            out.println("HELO localhost");
            System.out.println("SERVER: " + in.readLine());

            // MAIL FROM
            out.println("MAIL FROM:<alarm@localhost>");
            System.out.println("SERVER: " + in.readLine());

            // RCPT TO (your Linux username)
            String recipient = System.getProperty("user.name") + "@localhost";
            out.println("RCPT TO:<" + recipient + ">");
            System.out.println("SERVER: " + in.readLine());

            // DATA
            out.println("DATA");
            System.out.println("SERVER: " + in.readLine());

            // Email body (ends with single period on a line)
            out.println("Subject: Alarm Triggered");
            out.println();
            out.println("Sensor was triggered at: " + java.time.LocalDateTime.now());
            out.println(".");
            System.out.println("SERVER: " + in.readLine());

            // QUIT
            out.println("QUIT");
            System.out.println("SERVER: " + in.readLine());

            System.out.println("Alarm email sent to " + recipient);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

---

### Step 3.2: Compile and Run

```bash
javac AlarmSMTP.java
java AlarmSMTP
```

- It will wait for a keypress.
- Then it connects to Postfix, sends email manually via SMTP commands.
- You’ll see each server response (handshake, mail accepted, etc.).
- Then it exits cleanly.

---

### Step 3.3: Check the Mail

Open the local inbox:

```bash
mail
```

You should see:

- A subject line: `Alarm Triggered`
- Body: includes timestamp from the program

---

This completes **Step 3**: Your Java SMTP client works, talks to Postfix, and delivers a local message.

---

## **Step 4: Make Sure You Can Read the Local Email**

You've now:

- Installed Postfix
- Set up your Java program to send email to a local user (like `you@localhost`)
- Sent an email via raw SMTP

Now you need to **verify the message was actually delivered and can be read locally**.

---

### Step 4.1: Use the `mail` Command

The Postfix server delivers messages to the local user's mailbox, usually in **`/var/mail/<username>`**. On most Linux distros, you can read it using the `mail` CLI tool:

```bash
mail
```

If this is your first time using it, you’ll see a numbered list of messages like this:

```
Heirloom Mail version 12.5.  Type ? for help.
"/var/mail/yourusername": 1 message
> 1  From alarm@localhost  Fri Apr 12 12:30:22 2025
   Subject: Alarm Triggered
   ...
```

- Press `Enter` to read a message.
- Use `q` to quit.
- Use `d` to delete a message.
- Use `h` to list headers again.

If `mail` is not installed, run:

```bash
sudo apt install mailutils
```

Or on RHEL-based:

```bash
sudo dnf install mailx
```

---

### Step 4.2: Check Mail File Directly (Optional)

If `mail` isn't available or you want to confirm what's stored, you can read your mail file directly:

```bash
cat /var/mail/$(whoami)
```

This shows the raw contents of your inbox.

---

### Confirm Delivery

If everything worked, you should see:

- An email **From**: `alarm@localhost`
- A **Subject**: `Alarm Triggered`
- A **Body**: that contains the message your Java program sent

This confirms that:

- Your SMTP client works
- Postfix accepted and routed the message
- The mail landed in your local user’s inbox

---

That’s **Step 4 done**.

**Step 5**: making this program loop or respond to repeated input like a real alarm system.

---


## **Step 5: Simulate the Alarm Trigger via Keyboard Input**

Now that you can send mail and verify delivery, the next step is to **simulate the alarm being triggered**. Per your original scenario, this is done by pressing specific keys that act like sensors (e.g., door open, motion detected).

---

### Goal of Step 5:
Make your Java program listen for specific keyboard input, and **send an email whenever a certain key is pressed**.

---

### Implementation Plan:

We'll update the Java program to:

1. Loop forever, waiting for key input.
2. On a specific key press (e.g., `'m'` for motion or `'d'` for door), it sends an alert email.
3. Maybe allow `'q'` to quit the program cleanly.

---

### Basic Java Loop for Keyboard Input

Here’s a minimal example of that:

```java
import java.io.*;

public class AlarmTrigger {
    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

        System.out.println("Alarm system active. Press 'm' for motion, 'd' for door, 'q' to quit.");

        while (true) {
            String input = reader.readLine();

            if (input == null) continue;

            input = input.trim().toLowerCase();

            if (input.equals("q")) {
                System.out.println("Exiting alarm system.");
                break;
            }

            if (input.equals("m")) {
                sendAlarm("Motion detected!");
            } else if (input.equals("d")) {
                sendAlarm("Door opened!");
            } else {
                System.out.println("Unknown command. Use 'm', 'd', or 'q'.");
            }
        }
    }

    private static void sendAlarm(String message) {
        try {
            String recipient = System.getProperty("user.name") + "@localhost";
            Socket socket = new Socket("localhost", 25);
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter out = new PrintWriter(socket.getOutputStream(), true);

            // Read server greeting
            System.out.println("SERVER: " + in.readLine());

            out.println("HELO localhost");
            System.out.println("SERVER: " + in.readLine());

            out.println("MAIL FROM:<alarm@localhost>");
            System.out.println("SERVER: " + in.readLine());

            out.println("RCPT TO:<" + recipient + ">");
            System.out.println("SERVER: " + in.readLine());

            out.println("DATA");
            System.out.println("SERVER: " + in.readLine());

            out.println("Subject: Alarm Triggered");
            out.println();
            out.println("Alert: " + message);
            out.println(".");
            System.out.println("SERVER: " + in.readLine());

            out.println("QUIT");
            System.out.println("SERVER: " + in.readLine());

            socket.close();
        } catch (IOException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
```

---

### How to Test It

1. Run the program from terminal:

   ```bash
   java AlarmTrigger
   ```

2. Type:
   - `m` → triggers "Motion detected!" email
   - `d` → triggers "Door opened!" email
   - `q` → quits the program

3. Use `mail` to check your inbox and verify each alert arrived.

**Related project:** [sharifndlovu123/SMTP-Pop-Test](https://github.com/sharifndlovu123/SMTP-Pop-Test) (EmailPruner) is a Java command-line tool that speaks POP3 directly over a socket (`USER`, `PASS`, `STAT`, `TOP`, `LIST`, `DELE`, `QUIT`) to list, search, filter and bulk-delete messages.
