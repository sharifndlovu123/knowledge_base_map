# 03. Data Manipulation Language (DML)

### **Data Manipulation Language (DML)**  

DML is a subset of SQL used for managing **data within tables**. Unlike DDL (which modifies database structure), DML operates on the actual **data stored in the tables**.  

---

### **Key DML Commands**  

#### 1. **SELECT** – Retrieve Data  
Used to query data from a table.  

```sql
SELECT column1, column2 FROM table_name WHERE condition;
```
Example:  
```sql
SELECT name, age FROM users WHERE age > 25;
```
- Fetches `name` and `age` columns from the `users` table where the age is greater than 25.  
- The `WHERE` clause filters records based on conditions.  

---

#### 2. **INSERT** – Add New Data  
Used to insert new records into a table.  

```sql
INSERT INTO table_name (column1, column2) VALUES (value1, value2);
```
Example:  
```sql
INSERT INTO employees (id, name, position) VALUES (101, 'Alice', 'Developer');
```
- Adds a new employee with ID **101**, name **Alice**, and position **Developer**.  
- The column order must match the order of values.  

---

#### 3. **UPDATE** – Modify Existing Data  
Used to modify existing records in a table.  

```sql
UPDATE table_name SET column1 = value1, column2 = value2 WHERE condition;
```
Example:  
```sql
UPDATE employees SET position = 'Senior Developer' WHERE name = 'Alice';
```
- Updates Alice's position to **Senior Developer**.  
- Always use the `WHERE` clause to avoid updating all records unintentionally.  

---

#### 4. **DELETE** – Remove Data  
Used to delete records from a table.  

```sql
DELETE FROM table_name WHERE condition;
```
Example:  
```sql
DELETE FROM users WHERE age < 18;
```
- Removes all users whose age is **less than 18**.  
- If `WHERE` is omitted, **all records in the table** will be deleted.  

---

### **Key Notes on DML:**  
- **DML commands modify data but do not change the database schema.**  
- **DML operations are part of a transaction** (you can `COMMIT` or `ROLLBACK` changes).  
- **DML performance depends on indexing and table size.**  
