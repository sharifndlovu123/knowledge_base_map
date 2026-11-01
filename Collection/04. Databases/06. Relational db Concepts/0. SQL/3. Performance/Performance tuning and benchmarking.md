# 04. Performance tuning and benchmarking

### **Database Performance Tuning and Benchmarking**  

Optimizing database performance ensures faster queries, better resource utilization, and scalability. This involves query optimization, indexing strategies, memory tuning, and benchmarking techniques.  

---

## **1. Query Optimization**  

### **1.1 Use `EXPLAIN` and `EXPLAIN ANALYZE`**  
- Helps understand query execution plans and find bottlenecks.  

**Example (PostgreSQL, MySQL):**  
```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 100;
```

✅ **Look for**:  
- **Sequential Scans** (bad for large tables) → Add indexes.  
- **Nested Loops** (slow for joins) → Optimize with indexes.  
- **Sorting & Hash Joins** → Increase memory allocation if necessary.

---

### **1.2 Reduce `SELECT *` Usage**  
- Fetch only required columns to minimize data transfer overhead.  

✅ **Optimized Query:**  
```sql
SELECT name, age FROM users WHERE status = 'active';
```
❌ **Bad Query:**  
```sql
SELECT * FROM users;
```

---

### **1.3 Optimize `JOIN`s and Subqueries**  
- Ensure indexed columns are used for `JOIN`s.  

✅ **Optimized Query:**  
```sql
SELECT o.order_id, c.name 
FROM orders o 
JOIN customers c ON o.customer_id = c.customer_id;
```
- Instead of using correlated subqueries:  
```sql
SELECT order_id, (SELECT name FROM customers WHERE customers.customer_id = orders.customer_id) 
FROM orders;
```

---

## **2. Index Optimization**  

✅ **Ensure proper indexing on frequently queried columns.**  
- Use **composite indexes** for multi-column searches.  
- Use **partial indexes** to reduce size.  

✅ **Avoid over-indexing** (slows down inserts/updates).  
```sql
CREATE INDEX idx_users_status ON users(status);
```

✅ **Rebuild fragmented indexes periodically:**  
```sql
REINDEX TABLE users;
```

---

## **3. Connection Pooling & Caching**  

### **3.1 Enable Connection Pooling**  
- Reduces overhead of repeatedly opening/closing database connections.  
- Use **PgBouncer** for PostgreSQL, **HikariCP** for Java apps.

### **3.2 Implement Caching**  
- Use **Redis** or **Memcached** for frequent queries to avoid hitting the database.  

✅ **Example (PostgreSQL + Redis Caching)**  
```python
import redis
import psycopg2

cache = redis.Redis(host='localhost', port=6379, db=0)
conn = psycopg2.connect("dbname=mydb user=postgres")

def get_user(user_id):
    cached = cache.get(f"user:{user_id}")
    if cached:
        return cached  # Return from cache
    
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    
    cache.setex(f"user:{user_id}", 3600, str(user))  # Cache for 1 hour
    return user
```

---

## **4. Memory and Storage Optimization**  

✅ **Tune `work_mem` and `shared_buffers` (PostgreSQL):**  
```sql
SHOW work_mem;
ALTER SYSTEM SET work_mem = '64MB';
```
✅ **Use proper data types:**  
- Use **INTEGER** instead of **BIGINT** when possible.  
- Use **TEXT** sparingly; prefer **VARCHAR(n)** when length is known.  

✅ **Partition large tables** to improve query speed:  
```sql
CREATE TABLE orders_2024 PARTITION OF orders FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

---

## **5. Benchmarking Tools & Load Testing**  

### **5.1 `pgbench` (PostgreSQL)**  
```bash
pgbench -i -s 10 mydb  # Initialize with 10x scaling
pgbench -c 10 -j 2 -T 60 mydb  # Run test with 10 clients for 60 seconds
```

### **5.2 `sysbench` (MySQL, PostgreSQL)**  
```bash
sysbench oltp_read_write --table-size=1000000 --mysql-db=test --threads=16 run
```

### **5.3 `Apache JMeter` for application-level testing**  
- Simulates thousands of concurrent users executing queries.  

---

## **6. Summary of Best Practices**  

✅ **Optimize queries using `EXPLAIN ANALYZE`**  
✅ **Use proper indexing strategies** (but avoid over-indexing)  
✅ **Enable caching for frequent queries**  
✅ **Use connection pooling to manage concurrent requests**  
✅ **Tune memory settings (`work_mem`, `shared_buffers`)**  
✅ **Benchmark using `pgbench`, `sysbench`, and `JMeter`**  

Proper database tuning ensures applications scale efficiently and handle increasing loads without degradation.