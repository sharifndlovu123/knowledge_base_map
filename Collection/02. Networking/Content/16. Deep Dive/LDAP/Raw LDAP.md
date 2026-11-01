# 02. Raw LDAP

Yes — here's how to **fully set up the environment using phpLDAPadmin (PLA)** to meet your assignment’s first requirement:  
> *“Create an appropriate Directory Information Tree on your server (containing Friends’ names and telephone numbers) using PLA. Populate the tree with some entries.”*

This setup assumes you're using Docker and have already run a containerized OpenLDAP with PLA (per our earlier discussion). If not, I’ll walk you through it step-by-step.

---

## ✅ STEP 1: Set Up OpenLDAP + phpLDAPadmin with Docker

Create a `docker-compose.yml`:

```yaml
version: '3.7'

services:
  openldap:
    image: osixia/openldap:1.5.0
    container_name: openldap
    environment:
      LDAP_ORGANISATION: "Friend Directory"
      LDAP_DOMAIN: "example.com"
      LDAP_ADMIN_PASSWORD: "admin"
    ports:
      - "389:389"
    networks:
      - ldap_net

  phpldapadmin:
    image: osixia/phpldapadmin:0.9.0
    container_name: phpldapadmin
    environment:
      PHPLDAPADMIN_LDAP_HOSTS: "openldap"
    ports:
      - "8080:80"
    networks:
      - ldap_net

networks:
  ldap_net:
    driver: bridge
```

Run it:

```bash
docker-compose up -d
```

Then go to `http://localhost:8080` to access phpLDAPadmin.

---

## ✅ STEP 2: Log in to phpLDAPadmin (PLA)

- **Login DN:** `cn=admin,dc=example,dc=com`
- **Password:** `admin`

Click **Login**.

---

## ✅ STEP 3: Create Organizational Units (OUs)

From the left panel:
1. Click on your base DN: `dc=example,dc=com`
2. Click "**Create new entry here**"
3. Choose `Generic: Organizational Unit`
4. Set `ou=Friends`
5. Click "**Create Object**", then "**Commit**"

Now you’ll have: `ou=Friends,dc=example,dc=com`

---

## ✅ STEP 4: Add Friends With Phone Numbers

Under `ou=Friends`:
1. Click “Create a child entry”
2. Choose: `Generic: User Account`
3. Fill in:
   - **uid:** `jdoe`
   - **cn:** `John Doe`
   - **sn:** `Doe`
   - **userPassword:** `secret`
   - **telephoneNumber:** `555-1234`

Click **Create Object**, then **Commit**.

Repeat to add more friends.

---

## ✅ STEP 5: Verify DIT Structure

Your Directory Tree should now look like:

```
dc=example,dc=com
└── ou=Friends
    ├── uid=jdoe
    ├── uid=asmith
    └── ...
```

Each `uid` entry (user) has `cn`, `sn`, `telephoneNumber`, and optionally a password.

---

## ✅ Done: You’ve Fulfilled the First Requirement

> ✅ *"Create an appropriate Directory Information Tree on your server (containing Friends’ names and telephone numbers) using PLA. Populate the tree with some entries."*

---

Let me know when you're ready to move to the second part:  
→ writing a **raw socket-based LDAP client** to search the directory without using any high-level LDAP libraries. That part is much more involved — you’ll be crafting ASN.1 by hand or byte-by-byte.



-----

## PART 2

Alright, now you're stepping into the deep end.

---

## 🧱 Your Goal:
Write a **raw LDAP client** that:
- Connects to your OpenLDAP server via **port 389**
- Constructs LDAP requests manually (using **ASN.1 BER encoding**)
- Sends them over a raw socket
- Parses the LDAP response manually

---

## 🔥 The Reality:
LDAP is **not string-based** like HTTP — it's a binary protocol using **ASN.1 with BER** (Basic Encoding Rules). So, you need to:
1. Open a raw TCP socket
2. Manually craft LDAP BER-encoded packets (Bind request, Search request, etc.)
3. Send them
4. Read back and decode the BER response

We’ll use **Java** (no LDAP libraries), just `java.net.Socket`, `InputStream`, and `OutputStream`.

---

## 🔑 Step 1: Understand Minimal ASN.1 LDAP Packet Structure

### 🔐 LDAP Bind Request (simple auth):
```text
LDAPMessage ::= SEQUENCE {
  messageID       INTEGER,
  protocolOp      CHOICE {
      bindRequest     BindRequest,
      ... }
}

BindRequest ::= [APPLICATION 0] SEQUENCE {
  version         INTEGER,
  name            LDAPDN,
  authentication  CHOICE {
      simple          [0] OCTET STRING,
      ... }
}
```

You need to encode this manually as bytes.

---

## ✅ Step 2: Build and Send LDAP Bind Request in Java

Here's **minimal Java code** to:
- Connect to port 389
- Manually send a BindRequest
- Receive and decode the response header

```java
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class RawLdapBindClient {
    public static void main(String[] args) throws Exception {
        String ldapHost = "localhost"; // Or Docker IP if remote
        int ldapPort = 389;

        Socket socket = new Socket(ldapHost, ldapPort);
        OutputStream out = socket.getOutputStream();
        InputStream in = socket.getInputStream();

        // LDAP BindRequest (version=3, bind DN, simple password)
        byte[] bindRequest = new byte[] {
            0x30, 0x1b,                    // LDAPMessage SEQUENCE (27 bytes)
              0x02, 0x01, 0x01,            // messageID: 1
              0x60, 0x16,                  // [APPLICATION 0] SEQUENCE (22 bytes)
                0x02, 0x01, 0x03,          // version: 3
                0x04, 0x13,                // name: OCTET STRING (19 bytes)
                  // "cn=admin,dc=example,dc=com"
                  'c','n','=','a','d','m','i','n',',','d','c','=','e','x','a','m','p','l','e',',','d','c','=','c','o','m',
                0x80, 0x05,                // [0] simple auth (OCTET STRING)
                  'a','d','m','i','n'
        };

        out.write(bindRequest);
        out.flush();

        // Read response
        byte[] response = new byte[1024];
        int len = in.read(response);

        System.out.println("Received " + len + " bytes:");
        for (int i = 0; i < len; i++) {
            System.out.printf("%02x ", response[i]);
        }

        in.close();
        out.close();
        socket.close();
    }
}
```

> ⚠️ The above is a **simplified BindRequest**. It assumes a short DN/password and hardcodes sizes. You’ll want to eventually build a helper method to BER-encode values dynamically.

---

## ✅ Step 3: Next Up — Perform a Search

Once the Bind is successful, you'll send a **SearchRequest**, which is also encoded in ASN.1. That request is a lot more involved (requires filters, baseDN, scope, attributes, etc.). I’ll walk you through that once your bind works.

---

## ✅ Step 4: Test It

Make sure your server is listening on port 389 and that the user `cn=admin,dc=example,dc=com` with password `admin` exists — which it should if you followed PLA setup.

---

## 🧪 Once Working…

You’ll want to build:
- Your own `BerEncoder` class (encode integers, strings, sequences, etc.)
- Logic to decode responses using `byte[]` and read tags, lengths, values
- Optionally implement SearchRequest with simple equality filters (e.g. `uid=jdoe`)

---

Let me know if you want:
- A basic `BerEncoder` class
- A follow-up example that sends a `SearchRequest` to retrieve a telephone number for a given friend

This is **low-level networking and binary protocol parsing** — totally doable but not trivial.


----


## Part 3

Here’s a basic `BerEncoder` in Java that helps you construct LDAP-compatible ASN.1/BER-encoded byte arrays for:

- **INTEGER**
- **OCTET STRING**
- **SEQUENCE**
- **Context-specific tags ([0], [APPLICATION 0], etc.)**

This is **minimal** and suitable for your assignment (manually crafting packets at the byte level).

---

## ✅ `BerEncoder.java` – Minimal BER Encoder

```java
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

public class BerEncoder {
    private final ByteArrayOutputStream out = new ByteArrayOutputStream();

    public void addInteger(int value) {
        out.write(0x02); // INTEGER tag
        out.write(0x01); // always 1 byte
        out.write(value);
    }

    public void addOctetString(String s) {
        byte[] data = s.getBytes(StandardCharsets.UTF_8);
        out.write(0x04); // OCTET STRING tag
        addLength(data.length);
        out.write(data, 0, data.length);
    }

    public void addContextualOctetString(int tag, String s) {
        byte[] data = s.getBytes(StandardCharsets.UTF_8);
        out.write(0x80 + tag); // context-specific primitive
        addLength(data.length);
        out.write(data, 0, data.length);
    }

    public void startSequence() {
        out.write(0x30); // UNIVERSAL SEQUENCE tag
        out.write(0x00); // placeholder, to be updated later
    }

    public void startApplication(int tag) {
        out.write(0x60 + tag); // [APPLICATION x], constructed
        out.write(0x00); // placeholder
    }

    public void startContextConstructed(int tag) {
        out.write(0xa0 + tag); // [CONTEXT x], constructed
        out.write(0x00); // placeholder
    }

    public void wrapLast(int startPos, int tag) {
        byte[] content = out.toByteArray();
        int contentLen = content.length - startPos;

        ByteArrayOutputStream wrapped = new ByteArrayOutputStream();
        wrapped.write(tag);
        addLengthTo(wrapped, contentLen);
        wrapped.write(content, startPos, contentLen);

        byte[] prefix = content, suffix = wrapped.toByteArray();
        out.reset();
        out.write(content, 0, startPos);
        out.write(suffix, 0, suffix.length);
    }

    private void addLength(int length) {
        if (length < 0x80) {
            out.write(length);
        } else {
            out.write(0x81);
            out.write(length);
        }
    }

    private void addLengthTo(ByteArrayOutputStream stream, int length) {
        if (length < 0x80) {
            stream.write(length);
        } else {
            stream.write(0x81);
            stream.write(length);
        }
    }

    public byte[] toByteArray() {
        byte[] data = out.toByteArray();
        if (data[1] == 0x00) {
            data[1] = (byte)(data.length - 2); // fix SEQUENCE length
        }
        return data;
    }

    public int length() {
        return out.size();
    }
}
```

---

## 🔍 How to Use It

Here’s how to build an LDAP BindRequest using `BerEncoder`:

```java
BerEncoder enc = new BerEncoder();

// Outer LDAPMessage SEQUENCE
enc.startSequence(); // 0x30 placeholder

enc.addInteger(1); // messageID = 1

// [APPLICATION 0] BindRequest
enc.out.write(0x60); // tag
ByteArrayOutputStream app = new ByteArrayOutputStream();
app.write(0x02); app.write(0x01); app.write(0x03); // version = 3
byte[] name = "cn=admin,dc=example,dc=com".getBytes();
app.write(0x04); app.write(name.length); app.write(name);
byte[] pw = "admin".getBytes();
app.write(0x80); app.write(pw.length); app.write(pw);

byte[] appContent = app.toByteArray();
enc.addLength(appContent.length);
enc.out.write(appContent);

// Fix top-level length
byte[] request = enc.toByteArray();
```

Or wrap that logic in your own method to build a full BindRequest.

---

## ⚠️ Reminder
LDAP uses:
- **SEQUENCE** (`0x30`)
- **INTEGER** (`0x02`)
- **OCTET STRING** (`0x04`)
- **[0]** = `0x80`, **[APPLICATION 0]** = `0x60`
- All values need length-prefixing with BER rules

Let me know if you want the full BindRequest builder that uses this encoder cleanly.


## part 4

Here’s a **raw Java LDAP client example** that:

1. Performs a **BindRequest** using your admin DN and password
2. Sends a **SearchRequest** for a given user (e.g. `uid=jdoe`)
3. Parses the response to extract the **telephoneNumber**

All done **without using LDAP libraries** — just raw sockets and byte-level protocol handling.

---

## ⚙️ Assumptions

- LDAP running on `localhost:389`
- User `uid=jdoe` exists under `ou=Friends,dc=example,dc=com`
- User has an attribute `telephoneNumber`

---

## ✅ Java Code: Raw LDAP Bind + SearchRequest

```java
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;

public class RawLdapSearchClient {

    public static void main(String[] args) throws Exception {
        String ldapHost = "localhost";
        int ldapPort = 389;
        String baseDN = "ou=Friends,dc=example,dc=com";
        String bindDN = "cn=admin,dc=example,dc=com";
        String bindPassword = "admin";
        String searchUID = "jdoe";

        Socket socket = new Socket(ldapHost, ldapPort);
        OutputStream out = socket.getOutputStream();
        InputStream in = socket.getInputStream();

        // 1. BIND REQUEST
        byte[] bindReq = buildBindRequest(bindDN, bindPassword);
        out.write(bindReq);
        out.flush();
        readResponse(in); // just to ensure bind succeeded

        // 2. SEARCH REQUEST
        byte[] searchReq = buildSearchRequest(baseDN, searchUID);
        out.write(searchReq);
        out.flush();

        // 3. READ SEARCH RESPONSE
        byte[] resp = new byte[4096];
        int len = in.read(resp);

        // 4. Print hex for analysis
        System.out.println("Search Response (" + len + " bytes):");
        for (int i = 0; i < len; i++) {
            System.out.printf("%02x ", resp[i]);
        }
        System.out.println();

        // 5. Naive parse to find telephoneNumber
        String output = new String(resp, 0, len, StandardCharsets.UTF_8);
        if (output.contains("telephoneNumber")) {
            int idx = output.indexOf("telephoneNumber");
            int lenByte = resp[idx + 16]; // skip tag + length
            String phone = new String(resp, idx + 17, lenByte);
            System.out.println("Telephone: " + phone);
        } else {
            System.out.println("telephoneNumber not found.");
        }

        socket.close();
    }

    // ========== BIND REQUEST BUILDER ==========
    static byte[] buildBindRequest(String bindDN, String password) {
        byte[] dn = bindDN.getBytes(StandardCharsets.UTF_8);
        byte[] pw = password.getBytes(StandardCharsets.UTF_8);

        int totalLength = 1 + 1 + 1 +               // version
                          1 + 1 + dn.length +       // name
                          1 + 1 + pw.length;        // simple auth

        int bindLen = totalLength;
        int messageLen = 1 + 1 + 1 +                // messageID
                         1 + 1 + bindLen;           // bind request

        int fullLen = 1 + 1 + messageLen;

        byte[] buf = new byte[fullLen];
        int i = 0;

        buf[i++] = 0x30; // LDAPMessage SEQUENCE
        buf[i++] = (byte) (fullLen - 2);

        buf[i++] = 0x02; buf[i++] = 0x01; buf[i++] = 0x01; // messageID: 1

        buf[i++] = 0x60; buf[i++] = (byte) bindLen; // [APPLICATION 0] BindRequest

        buf[i++] = 0x02; buf[i++] = 0x01; buf[i++] = 0x03; // version: 3

        buf[i++] = 0x04; buf[i++] = (byte) dn.length;
        System.arraycopy(dn, 0, buf, i, dn.length); i += dn.length;

        buf[i++] = (byte) 0x80; buf[i++] = (byte) pw.length;
        System.arraycopy(pw, 0, buf, i, pw.length); i += pw.length;

        return buf;
    }

    // ========== SEARCH REQUEST BUILDER ==========
    static byte[] buildSearchRequest(String baseDN, String uid) {
        byte[] base = baseDN.getBytes(StandardCharsets.UTF_8);
        byte[] filterVal = uid.getBytes(StandardCharsets.UTF_8);
        byte[] attr = "telephoneNumber".getBytes(StandardCharsets.UTF_8);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // LDAPMessage SEQUENCE
        baos.write(0x30);
        ByteArrayOutputStream msg = new ByteArrayOutputStream();

        // messageID = 2
        msg.write(0x02); msg.write(0x01); msg.write(0x02);

        // SearchRequest [APPLICATION 3]
        ByteArrayOutputStream sr = new ByteArrayOutputStream();

        // baseObject
        sr.write(0x04); sr.write(base.length); sr.write(base);

        // scope = 2 (subtree), derefAliases = 0, sizeLimit = 0, timeLimit = 0, typesOnly = false
        sr.write(0x0a); sr.write(0x01); sr.write(0x02);
        sr.write(0x0a); sr.write(0x01); sr.write(0x00);
        sr.write(0x02); sr.write(0x01); sr.write(0x00);
        sr.write(0x02); sr.write(0x01); sr.write(0x00);
        sr.write(0x01); sr.write(0x01); sr.write(0x00);

        // Filter: (uid=<uid>)
        sr.write(0xa3); // equalityMatch
        sr.write(3 + 2 + filterVal.length); // total length

        // Attribute description
        sr.write(0x04); sr.write(0x03); sr.write('u'); sr.write('i'); sr.write('d');
        sr.write(0x04); sr.write(filterVal.length); sr.write(filterVal);

        // Attributes to return
        sr.write(0x30); // sequence of attributes
        sr.write(1 + attr.length);
        sr.write(0x04); sr.write(attr.length); sr.write(attr);

        byte[] srBytes = sr.toByteArray();

        msg.write(0x63); msg.write(srBytes.length); msg.write(srBytes);
        byte[] msgBytes = msg.toByteArray();

        baos.write(msgBytes.length);
        baos.write(msgBytes);

        return baos.toByteArray();
    }

    // ========== BASIC RESPONSE DEBUG ==========
    static void readResponse(InputStream in) throws Exception {
        byte[] buf = new byte[1024];
        int len = in.read(buf);
        System.out.println("Bind Response (" + len + " bytes):");
        for (int i = 0; i < len; i++) {
            System.out.printf("%02x ", buf[i]);
        }
        System.out.println("\n");
    }
}
```

---

## 🧪 What This Does:
- Sends a raw **BindRequest**
- Sends a raw **SearchRequest** with an equality filter for `uid=<friend>`
- Tries to find and print the `telephoneNumber` from the response
- **No LDAP libraries**, no abstractions — just raw byte streams

---

## ⚠️ Notes:
- The BER encoding is handcrafted — fragile but compliant enough for your assignment.
- The response parser is super naive (looks for known string offsets). You should write a proper BER parser if required.

---



