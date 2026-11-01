# 02. Database statistics and their maintenance

### **Query Profiling and Monitoring Tools**  

Query profiling and monitoring are essential for optimizing database performance. They help identify slow queries, excessive resource usage, and inefficient execution plans.  

---

## **1. Query Profiling Tools**  

### **1.1 EXPLAIN / EXPLAIN ANALYZE**  
Most relational databases provide an `EXPLAIN` command to analyze how a query is executed.  

✅ **PostgreSQL Example**  
```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 123;
```
🔹 **Output**: Execution plan with estimated and actual execution times.  

✅ **MySQL Example**  
```sql
EXPLAIN SELECT * FROM orders WHERE customer_id = 123;
```
🔹 **Output**: Table scan details, index usage, and possible optimizations.  

---

### **1.2 PostgreSQL `pg_stat_statements`**  
Tracks execution statistics for all queries.  

✅ **Enable it:**  
```sql
CREATE EXTENSION pg_stat_statements;
```
✅ **Find slow queries:**  
```sql
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 5;
```

---

### **1.3 MySQL `SHOW PROFILE`** (Pre-MySQL 8)  
Provides detailed query execution stats.  

✅ **Enable profiling:**  
```sql
SET profiling = 1;
```
✅ **Run query & get profile:**  
```sql
SELECT * FROM orders WHERE customer_id = 123;
SHOW PROFILES;
SHOW PROFILE FOR QUERY 1;
```

🔹 **Alternative in MySQL 8+:** Use **Performance Schema**.  

✅ **Find slow queries in MySQL 8+:**  
```sql
SELECT event_name, timer_wait 
FROM performance_schema.events_statements_summary_by_digest 
ORDER BY timer_wait DESC 
LIMIT 5;
```

---

## **2. Database Monitoring Tools**  

### **2.1 pgAdmin (PostgreSQL)**  
- GUI for monitoring PostgreSQL queries and database performance.  
- Provides live query execution statistics.  

### **2.2 MySQL Workbench (MySQL, MariaDB)**  
- Built-in performance schema monitoring.  
- Graphical query profiling and index analysis.  

### **2.3 SQL Server Profiler (SQL Server)**  
- Tracks slow queries and system resource consumption.  
- Monitors deadlocks, locks, and execution plans.  

### **2.4 Oracle SQL Trace & TKPROF (Oracle DB)**  
- `SQL Trace` collects query execution details.  
- `TKPROF` formats the trace data for analysis.  

✅ **Enable SQL Trace:**  
```sql
ALTER SESSION SET sql_trace = TRUE;
```

✅ **Analyze with TKPROF:**  
```bash
tkprof tracefile.trc outputfile.txt
```

---

## **3. Real-Time Monitoring Tools**  

### **3.1 Prometheus + Grafana**  
- Tracks database query execution time, CPU, and memory usage.  
- Works with PostgreSQL, MySQL, MongoDB, and others.  

✅ **Example: Monitor MySQL with Prometheus**  
1. Install `mysqld_exporter`:  
   ```bash
   wget https://github.com/prometheus/mysqld_exporter/releases/latest/download/mysqld_exporter
   ```
2. Configure Prometheus to scrape MySQL metrics.  
3. Use Grafana to visualize query performance.  

---

### **3.2 Percona Monitoring and Management (PMM)**  
- Open-source tool for MySQL, PostgreSQL, and MongoDB.  
- Provides slow query analysis and real-time stats.  

✅ **Run PMM for MySQL:**  
```bash
docker run -d -p 80:80 --name pmm percona/pmm-server
```

---

### **3.3 AWS RDS Performance Insights**  
- Tracks slow queries, CPU utilization, and locking issues for RDS databases.  

✅ **Steps:**  
1. Enable **Performance Insights** in AWS RDS.  
2. Use AWS Console to analyze slow query trends.  

---

## **4. Best Practices**  
✅ **Regularly monitor slow queries** using `pg_stat_statements` (PostgreSQL) or `Performance Schema` (MySQL).  
✅ **Use indexes effectively** to optimize query performance.  
✅ **Leverage EXPLAIN ANALYZE** to understand query execution.  
✅ **Set up alerts** in monitoring tools like **Prometheus, Grafana, or PMM**.  
✅ **Optimize joins and subqueries** based on profiling data.  

Effective query profiling and monitoring prevent bottlenecks and keep databases running efficiently.