# 01. Process


## 🧱 1. **Set Up the LDAP Server**

### What you need:
- A running **OpenLDAP server**
- A **web interface** (PLA - phpLDAPadmin) to manually manage entries

### Actions:
- Run an OpenLDAP Docker container (e.g., `osixia/openldap`)
- Run a PLA Docker container and link it to the LDAP container
- Access PLA via browser to visually build your directory

### Directory Structure (DIT):
Build a basic Directory Information Tree like this:
```
dc=example,dc=com
└── ou=Friends
    ├── uid=jdoe
    │   ├── cn: John Doe
    │   ├── telephoneNumber: 123-456-7890
    └── uid=asmith
        ├── cn: Alice Smith
        ├── telephoneNumber: 987-654-3210
```

---

## 🔐 2. **Bind to the Server**

### What it means:
“Binding” is like **logging in**. You authenticate to LDAP so you can read or modify the directory.

### Steps:
- Connect to port `389` on the server using a TCP socket
- Craft a **BindRequest** using ASN.1/BER encoding manually
    - Contains version (3), bind DN (e.g. `cn=admin,dc=example,dc=com`), and password
- Send the BindRequest over the socket
- Wait for and parse the **BindResponse** to ensure login success

---

## 🔍 3. **Query via SearchRequest**

### Objective:
Search for a friend’s record based on their UID (e.g., `uid=jdoe`) and retrieve their `telephoneNumber`.

### Steps:
- Use the same socket connection from the bind step
- Construct a **SearchRequest** packet:
    - Base DN: `ou=Friends,dc=example,dc=com`
    - Scope: Subtree
    - Filter: Equality filter `(uid=jdoe)`
    - Attributes: `telephoneNumber`
- Encode all of that as a BER-encoded byte stream
- Send it through the socket

---

## 📩 4. **Read and Parse the Response**

### What you'll get back:
An **LDAPMessage** that wraps one or more **SearchResultEntry** objects.

Each entry will include:
- Distinguished Name (DN)
- One or more attributes (e.g., `telephoneNumber`)

### Steps:
- Read the raw bytes returned from the socket
- Parse them manually (byte or string-level operations)
- Look for the attribute name `telephoneNumber` and extract the value next to it

---

## 🧪 5. **Display the Result**

- Once the number is extracted, display it in the terminal
- If no result, show a “Not Found” message

---

## 🔁 6. **Repeat**

You should be able to run the program multiple times, input different UIDs, and get different results based on who exists in the LDAP directory.

---

## ✅ Summary of Steps

| Step | Action |
|------|--------|
| 1 | Launch OpenLDAP + phpLDAPadmin via Docker |
| 2 | Use PLA to create users under `ou=Friends` |
| 3 | Open socket to LDAP server on port 389 |
| 4 | Send manual BindRequest with DN + password |
| 5 | Build and send a SearchRequest for `uid=<name>` |
| 6 | Read the SearchResponse, parse `telephoneNumber` |
| 7 | Print result to user |

**Try it yourself:** [sharifndlovu123/LDAP-Test-Environment](https://github.com/sharifndlovu123/LDAP-Test-Environment) runs OpenLDAP in Docker with Java test utilities (`make up`, then `./test/test_ldap.sh`).
