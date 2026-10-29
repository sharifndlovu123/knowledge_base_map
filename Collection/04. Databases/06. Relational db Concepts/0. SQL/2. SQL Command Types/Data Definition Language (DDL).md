### **SQL Data Definition Language (DDL)**  
DDL (Data Definition Language) is used to define and manage the **structure** of database objects like tables, indexes, schemas, and views. These commands affect the database schema but not the data itself.  

---

### **1. `CREATE` – Creating Database Objects**  
Used to create new **tables, schemas, views, and indexes**.  

#### **Example: Creating a Table**
```sql
CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    salary DECIMAL(10,2)
);
```
#### **Example: Creating an Index**
```sql
CREATE INDEX idx_employee_name ON employees(name);
```

---

### **2. `ALTER` – Modifying Existing Objects**  
Used to **add, modify, or remove** columns or constraints from a table.  

#### **Example: Adding a Column**
```sql
ALTER TABLE employees ADD COLUMN email VARCHAR(255);
```
#### **Example: Modifying a Column**
```sql
ALTER TABLE employees ALTER COLUMN salary TYPE FLOAT;
```
#### **Example: Dropping a Column**
```sql
ALTER TABLE employees DROP COLUMN department;
```

---

### **3. `DROP` – Deleting Objects**  
Removes **tables, views, indexes, or databases** permanently.  

#### **Example: Dropping a Table**
```sql
DROP TABLE employees;
```
#### **Example: Dropping an Index**
```sql
DROP INDEX idx_employee_name;
```
#### **Example: Dropping a Database**
```sql
DROP DATABASE company_db;
```

---

### **4. `TRUNCATE` – Deleting All Rows (but Keeping Structure)**  
Removes **all rows** from a table but **keeps the table structure** intact. Faster than `DELETE` since it doesn’t log each row deletion.  

#### **Example: Truncating a Table**
```sql
TRUNCATE TABLE employees;
```

---

### **DDL Key Points**  
- **Changes schema structure**, not just data.  
- **`CREATE` adds objects, `ALTER` modifies them, `DROP` removes them.**  
- **`TRUNCATE` removes all data but keeps the table definition.**  
- **DDL operations are auto-committed**, meaning they **cannot be rolled back** in most databases.