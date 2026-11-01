# 02. Augmented Backus–Naur Form

### **Augmented Backus–Naur Form (ABNF)**  

#### **1. What is ABNF?**
ABNF (**Augmented Backus–Naur Form**) is a **formal notation** used to define the **syntax of languages, protocols, and data formats**. It is an **extension of Backus–Naur Form (BNF)** with additional features like repetition, alternatives, and character ranges.  

It is used in standards like:
- **HTTP (RFC 9110)**
- **Email (RFC 5322)**
- **URI/URL (RFC 3986)**
- **SIP (Session Initiation Protocol)**
- **DNS (Domain Name System)**

---

#### **2. ABNF Syntax & Rules**
ABNF defines a **set of rules** that specify how strings should be structured.  

##### **Basic Syntax**
- **Rules are written as:**
  ```
  rule-name = definition
  ```
- **Case-insensitive** (unless explicitly stated otherwise).
- **Whitespace is ignored** (except inside quoted strings).
- **Operators** define how elements combine.

##### **Example: Defining a Simple Number Format**
```abnf
number = 1*3DIGIT  ; A number with 1 to 3 digits
```
- `1*3` → **Repetition** (at least 1, at most 3 digits)
- `DIGIT` → A predefined rule for digits (`0-9`)

---

#### **3. ABNF Operators**
| Operator  | Meaning |
|-----------|---------|
| `=`       | Defines a rule |
| `|`       | Alternation (OR) |
| `*`       | Repetition (zero or more times) |
| `1*3`     | Repetition (1 to 3 times) |
| `#`       | Comma-separated repetition |
| `()`      | Grouping |
| `[` `]`   | Optional |
| `"text"`  | Case-sensitive string |
| `%xHH`    | Hexadecimal character |

##### **Example: Defining an Email Format**
```abnf
email = local-part "@" domain
local-part = 1*64(ALPHA / DIGIT / "." / "-")  ; Up to 64 chars
domain = 1*255(ALPHA / DIGIT / ".")          ; Up to 255 chars
```
- `1*64(ALPHA / DIGIT / "." / "-")` → **Up to 64 characters**, using letters, digits, dot, or hyphen.
- `"@"` → Literal `@` symbol.
- `1*255(ALPHA / DIGIT / ".")` → **Up to 255 characters**, forming a valid domain.

---

#### **4. ABNF vs BNF**
| Feature         | BNF                        | ABNF |
|----------------|---------------------------|------|
| **Used in**    | Programming languages      | Internet protocols, networking |
| **Repetition** | No (`*` not supported)     | Yes (`1*3DIGIT`, `*DIGIT`) |
| **Case Sensitivity** | Case-sensitive       | Case-insensitive |
| **Built-in Types** | No                      | Yes (`DIGIT`, `ALPHA`, etc.) |

---

#### **5. Where is ABNF Used?**
ABNF is commonly used in:
- **Internet protocols** (HTTP, SMTP, SIP, etc.).
- **Data formats** (email, URIs, JSON, etc.).
- **Network standards** (TLS, DNS, FTP).

---

#### **6. Example: Defining a Simple IPv4 Address**
```abnf
IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet

dec-octet = DIGIT                 ; 0-9
           / %x31-39 DIGIT         ; 10-99
           / "1" 2DIGIT            ; 100-199
           / "2" %x30-34 DIGIT     ; 200-249
           / "25" %x30-35          ; 250-255
```
This defines an **IPv4 address** in a structured way.

---

#### **7. Why Use ABNF?**
- **Human-readable** and **machine-parsable**.
- Standardized in **RFC 5234**.
- **More powerful** than regular BNF due to repetition and predefined rules.


---

### **Sample ABNF Definition for an HTTP Request (RFC 9112 - HTTP/1.1)**  

An HTTP request consists of:
1. **Request Line** → (`Method URI Version`)
2. **Headers** → (`Header-Name: Value`)
3. **Body** (optional)

---

### **1. ABNF Definition for an HTTP Request**
```abnf
HTTP-message = start-line CRLF
               *( header-field CRLF )
               CRLF
               [ message-body ]

start-line = request-line

request-line = method SP request-target SP HTTP-version CRLF

method = token
request-target = origin-form / absolute-form / authority-form / asterisk-form

HTTP-version = "HTTP/" DIGIT "." DIGIT

header-field = field-name ":" OWS field-value OWS
field-name = token
field-value = *( field-content / obs-fold )

message-body = *OCTET
```

---

### **2. Breakdown**
- **`request-line`** → Defines the HTTP method, URL, and protocol version.
- **`method`** → The HTTP action (`GET`, `POST`, `PUT`, etc.).
- **`request-target`** → The resource being requested (e.g., `/index.html`).
- **`HTTP-version`** → Specifies the HTTP protocol version.
- **`header-field`** → Defines headers (`Host: example.com`).
- **`message-body`** → Optional body for `POST`, `PUT`, etc.

---

### **3. Example HTTP Request**
✅ **Raw HTTP Request (Valid)**
```
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html

```
ABNF Breakdown:
```
request-line    = GET SP /index.html SP HTTP/1.1 CRLF
header-field    = Host ":" OWS example.com OWS CRLF
header-field    = User-Agent ":" OWS Mozilla/5.0 OWS CRLF
header-field    = Accept ":" OWS text/html OWS CRLF
CRLF            = End of headers
```

---

### **4. Example POST Request with a Body**
✅ **Valid HTTP POST Request**
```
POST /submit HTTP/1.1
Host: example.com
Content-Type: application/json
Content-Length: 27

{"name":"John","age":30}
```
ABNF Breakdown:
```
request-line    = POST SP /submit SP HTTP/1.1 CRLF
header-field    = Host ":" OWS example.com OWS CRLF
header-field    = Content-Type ":" OWS application/json OWS CRLF
header-field    = Content-Length ":" OWS 27 OWS CRLF
CRLF            = End of headers
message-body    = {"name":"John","age":30}
```

---

### **5. Why Use ABNF for HTTP Requests?**
- **Ensures standardization** across clients and servers.
- **Helps define strict syntax** for parsers and network protocols.
- **Used in RFCs** to define HTTP/1.1, HTTP/2, and HTTP/3.

---

### **Sample ABNF Definition for an HTTP Response (RFC 9112 - HTTP/1.1)**  

An HTTP response consists of:
1. **Status Line** → (`Version Status-Code Reason-Phrase`)  
2. **Headers** → (`Header-Name: Value`)  
3. **Body** (optional, depending on the response)  

---

### **1. ABNF Definition for an HTTP Response**
```abnf
HTTP-response = status-line CRLF
                *( header-field CRLF )
                CRLF
                [ message-body ]

status-line = HTTP-version SP status-code SP reason-phrase CRLF

HTTP-version = "HTTP/" DIGIT "." DIGIT

status-code = 3DIGIT

reason-phrase = *( HTAB / SP / VCHAR / obs-text )

header-field = field-name ":" OWS field-value OWS

message-body = *OCTET
```

---

### **2. Breakdown**
- **`status-line`** → Defines the protocol version, status code, and reason phrase.
- **`HTTP-version`** → Specifies the HTTP protocol version (e.g., `HTTP/1.1`).
- **`status-code`** → The **3-digit** response code (`200`, `404`, `500`).
- **`reason-phrase`** → A human-readable explanation of the status (`OK`, `Not Found`).
- **`header-field`** → Response headers (e.g., `Content-Type: application/json`).
- **`message-body`** → Optional response body (for `200 OK` or `404 Not Found` pages).

---

### **3. Example HTTP Response**
✅ **Valid HTTP Response for a Successful Request**
```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 27

<html><body>Hello</body></html>
```
ABNF Breakdown:
```
status-line     = HTTP/1.1 SP 200 SP OK CRLF
header-field    = Content-Type ":" OWS text/html OWS CRLF
header-field    = Content-Length ":" OWS 27 OWS CRLF
CRLF            = End of headers
message-body    = <html><body>Hello</body></html>
```

---

### **4. Example HTTP Response for a 404 Not Found**
✅ **Valid Response for a Missing Page**
```
HTTP/1.1 404 Not Found
Content-Type: text/plain
Content-Length: 13

404 Not Found
```
ABNF Breakdown:
```
status-line     = HTTP/1.1 SP 404 SP Not Found CRLF
header-field    = Content-Type ":" OWS text/plain OWS CRLF
header-field    = Content-Length ":" OWS 13 OWS CRLF
CRLF            = End of headers
message-body    = 404 Not Found
```

---

### **5. Example HTTP Response for a JSON API**
✅ **Valid JSON Response**
```
HTTP/1.1 201 Created
Content-Type: application/json
Content-Length: 41

{"message": "User created", "id": 12345}
```
ABNF Breakdown:
```
status-line     = HTTP/1.1 SP 201 SP Created CRLF
header-field    = Content-Type ":" OWS application/json OWS CRLF
header-field    = Content-Length ":" OWS 41 OWS CRLF
CRLF            = End of headers
message-body    = {"message": "User created", "id": 12345}
```

---

### **6. Why Use ABNF for HTTP Responses?**
- **Ensures consistency** between web clients and servers.
- **Defines exact syntax** for responses in protocols like HTTP/1.1, HTTP/2, and HTTP/3.
- **Used in RFC 9112** to standardize HTTP message structures.
