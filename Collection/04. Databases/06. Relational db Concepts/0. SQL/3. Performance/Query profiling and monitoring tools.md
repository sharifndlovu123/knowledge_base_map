# 06. Query profiling and monitoring tools

### **Database Statistics and Their Maintenance**  

Database statistics play a crucial role in query optimization. They provide the database engine with information about data distribution, table sizes, index efficiency, and other metadata that influence query execution plans.  

---

## **1. What Are Database Statistics?**  
Database statistics include:  
✅ **Table Statistics:** Number of rows, table size, and distribution of values.  
✅ **Index Statistics:** Cardinality, uniqueness, and clustering factor.  
✅ **Column Statistics:** Minimum, maximum, and most common values (histograms).  
✅ **Query Execution Statistics:** Cached execution plans and cost estimations.  

---

## **2. Why Are Database Statistics Important?**  
The **query optimizer** relies on up-to-date statistics to:  
🔹 Choose the best index for a query.  
🔹 Determine whether to use full table scans, indexed lookups, or joins.  
🔹 Optimize execution plans for efficiency.  

📌 **If statistics are outdated, the optimizer may choose inefficient execution plans, leading to poor performance.**  

---

## **3. Collecting and Updating Statistics**  

### **3.1 PostgreSQL: `ANALYZE` and `VACUUM`**  
✅ **Analyze a single table:**  
```sql
ANALYZE customers;
```
✅ **Analyze the entire database:**  
```sql
ANALYZE;
```
✅ **Auto-Vacuum (Automatic Statistics Update)**  
PostgreSQL runs **autovacuum** to update statistics periodically.  
🔹 You can fine-tune it in `postgresql.conf`:  
```ini
autovacuum = on
autovacuum_vacuum_scale_factor = 0.2
autovacuum_analyze_scale_factor = 0.1
```

---

### **3.2 MySQL: `ANALYZE TABLE` and `OPTIMIZE TABLE`**  
✅ **Update table statistics manually:**  
```sql
ANALYZE TABLE customers;
```
✅ **Rebuild and optimize fragmented tables:**  
```sql
OPTIMIZE TABLE orders;
```
📌 **MySQL also updates statistics automatically** based on workload.  

---

### **3.3 SQL Server: `UPDATE STATISTICS` and Auto-Updates**  
✅ **Manually refresh statistics:**  
```sql
UPDATE STATISTICS customers;
```
✅ **Enable automatic updates (default setting):**  
```sql
ALTER DATABASE mydb SET AUTO_UPDATE_STATISTICS ON;
```

---

### **3.4 Oracle: `DBMS_STATS` Package**  
✅ **Gather statistics for a table:**  
```sql
EXEC DBMS_STATS.GATHER_TABLE_STATS('HR', 'EMPLOYEES');
```
✅ **Gather statistics for the entire schema:**  
```sql
EXEC DBMS_STATS.GATHER_SCHEMA_STATS('HR');
```

---

## **4. Monitoring and Maintaining Statistics**  
✅ **Check if statistics are outdated**  
- **PostgreSQL:**  
  ```sql
  SELECT relname, last_analyze FROM pg_stat_all_tables WHERE schemaname = 'public';
  ```
- **MySQL:**  
  ```sql
  SHOW TABLE STATUS LIKE 'customers';
  ```
- **SQL Server:**  
  ```sql
  SELECT name, STATS_DATE(object_id, index_id) FROM sys.stats;
  ```

✅ **Schedule Automatic Maintenance**  
- **PostgreSQL:** Autovacuum does this automatically.  
- **SQL Server:** Use `sp_updatestats` to refresh all table statistics.  
- **MySQL:** Optimize and analyze large tables periodically.  

---

## **5. Best Practices**  
🔹 **Enable automatic statistics updates** where possible.  
🔹 **Manually update statistics** after major data changes.  
🔹 **Monitor query execution plans** and adjust indexing strategies.  
🔹 **Avoid frequent full-table statistics updates** unless necessary.  
🔹 **Use histograms (if supported)** to improve optimizer accuracy.  

Keeping database statistics updated ensures efficient query execution and optimized performance.