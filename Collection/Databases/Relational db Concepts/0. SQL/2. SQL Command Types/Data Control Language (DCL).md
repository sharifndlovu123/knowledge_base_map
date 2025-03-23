### **Data Control Language (DCL)**  

DCL is a subset of SQL that deals with **permissions and access control** in a database. It is used to grant or revoke privileges to users or roles.  

---

### **Key DCL Commands**  

#### 1. **GRANT** – Assign Permissions  
Used to provide users or roles with specific privileges on database objects like tables, views, or procedures.  

```sql
GRANT privilege(s) ON object TO user;
```
Example:  
```sql
GRANT SELECT, INSERT ON employees TO user1;
```
- Grants **SELECT** and **INSERT** privileges on the `employees` table to `user1`.  

Granting **all privileges**:  
```sql
GRANT ALL PRIVILEGES ON employees TO user1;
```
- Allows `user1` to perform any operation on `employees`.  

Granting privileges with the ability to pass them on:  
```sql
GRANT SELECT ON employees TO user1 WITH GRANT OPTION;
```
- `user1` can **grant** the same `SELECT` privilege to others.  

---

#### 2. **REVOKE** – Remove Permissions  
Used to take back previously granted privileges from users or roles.  

```sql
REVOKE privilege(s) ON object FROM user;
```
Example:  
```sql
REVOKE INSERT ON employees FROM user1;
```
- Removes `INSERT` privilege on `employees` from `user1`.  

Revoking all privileges:  
```sql
REVOKE ALL PRIVILEGES ON employees FROM user1;
```
- Completely removes access to `employees` for `user1`.  

---

### **Key Notes on DCL:**  
- DCL **ensures security** by controlling who can **read, modify, or delete data**.  
- **GRANT grants access; REVOKE takes it away.**  
- Some databases **require administrator rights** to execute DCL commands.  

