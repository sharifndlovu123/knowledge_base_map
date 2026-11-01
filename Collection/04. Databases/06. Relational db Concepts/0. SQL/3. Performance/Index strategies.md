# 03. Index strategies

### **Index Strategies for Database Performance**  

Indexes improve query performance by allowing the database to find data efficiently rather than scanning entire tables. However, improper indexing can degrade performance due to increased write overhead.  

---

## **1. Types of Indexes**  

### **1.1 Primary Index (Clustered Index)**  
- Organizes table rows in the order of the index.  
- A table can have **only one clustered index** (usually the primary key).  
- Faster for range queries but slows down **INSERT/UPDATE/DELETE** operations.  

**Example:**  
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,  -- Automatically creates a clustered index
    name TEXT,
    department TEXT
);
```

---

### **1.2 Secondary Index (Non-Clustered Index)**  
- Stores pointers to the actual data instead of reordering table rows.  
- **Can be multiple per table**, useful for frequent searches on non-primary key columns.  

**Example:**  
```sql
CREATE INDEX idx_employee_department ON employees(department);
```

---

### **1.3 Unique Index**  
- Ensures values in a column remain unique.  
- Acts like a non-clustered index with a uniqueness constraint.  

**Example:**  
```sql
CREATE UNIQUE INDEX idx_unique_email ON users(email);
```

---

### **1.4 Composite Index (Multi-Column Index)**  
- Indexes multiple columns to optimize queries filtering on **both** fields.  
- The column order matters! Queries using the **first indexed column** benefit the most.  

**Example:**  
```sql
CREATE INDEX idx_order_customer ON orders(customer_id, order_date);
```
✅ **Optimized Query:**  
```sql
SELECT * FROM orders WHERE customer_id = 100 AND order_date > '2024-01-01';
```
❌ **Not Optimized (order_date alone is inefficient):**  
```sql
SELECT * FROM orders WHERE order_date > '2024-01-01';
```

---

### **1.5 Full-Text Index**  
- Used for text-heavy searches (e.g., search engines, chat applications).  

**Example (PostgreSQL):**  
```sql
CREATE INDEX idx_article_text ON articles USING gin(to_tsvector('english', content));
```

---

### **1.6 Partial Index**  
- Indexes only **specific rows** to reduce storage and improve performance.  

**Example:**  
```sql
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
```

---

### **1.7 Covering Index**  
- Stores all required query columns in the index itself, eliminating table lookups.  

**Example:**  
```sql
CREATE INDEX idx_orders_covering ON orders(customer_id, order_date, total_amount);
```
✅ Optimized Query:  
```sql
SELECT customer_id, order_date, total_amount FROM orders WHERE customer_id = 100;
```
(Does not need to fetch data from the table.)

---

### **1.8 Hash Index**  
- Optimized for **exact** lookups but **not** range queries.  
- Available in PostgreSQL, MySQL (Memory Engine).  

**Example (PostgreSQL):**  
```sql
CREATE INDEX idx_user_hash ON users USING hash(email);
```

---

## **2. Best Practices for Indexing**  

✅ **Index Frequently Queried Columns**  
- Columns used in **WHERE**, **JOIN**, and **ORDER BY** should have indexes.  

✅ **Avoid Over-Indexing**  
- More indexes = **slower writes** (INSERT/UPDATE/DELETE operations).  

✅ **Use Composite Indexes for Multi-Column Queries**  
- Order matters! The first column in the index should be the **most selective**.  

✅ **Analyze Execution Plans**  
- Use **EXPLAIN ANALYZE** to ensure indexes are being used.  

✅ **Regularly Rebuild and Maintain Indexes**  
- **Fragmentation** slows down performance over time.  
- In PostgreSQL:  
```sql
REINDEX TABLE orders;
```
- In MySQL:  
```sql
OPTIMIZE TABLE orders;
```

Properly designed indexes can **drastically** improve query performance while keeping write overhead manageable.