### **Database Caching Mechanisms**  

Caching improves database performance by storing frequently accessed data in memory, reducing the need for expensive disk I/O operations.  

---

## **1. Types of Caching**  

### **1.1 Application-Level Caching**  
- Data is cached in the application layer before querying the database again.  
- Common tools: **Redis, Memcached, in-memory caching (e.g., Python’s `functools.lru_cache`)**.  

✅ **Example: Flask + Redis Caching**  
```python
import redis
import psycopg2

cache = redis.Redis(host='localhost', port=6379, db=0)
conn = psycopg2.connect("dbname=mydb user=postgres")

def get_user(user_id):
    cached = cache.get(f"user:{user_id}")
    if cached:
        return cached.decode("utf-8")  # Return from cache
    
    cur = conn.cursor()
    cur.execute("SELECT name FROM users WHERE id = %s", (user_id,))
    user = cur.fetchone()
    
    cache.setex(f"user:{user_id}", 3600, user[0])  # Cache for 1 hour
    return user[0]
```

---

### **1.2 Database-Level Caching**  
- The database itself caches frequently used queries and indexes.  
- Examples: **PostgreSQL’s `shared_buffers`, MySQL’s Query Cache (deprecated in MySQL 8)**.  

✅ **PostgreSQL Query Cache Tuning**  
```sql
SHOW shared_buffers;
ALTER SYSTEM SET shared_buffers = '256MB';
```

✅ **MySQL Query Cache (Pre-MySQL 8)**  
```sql
SET GLOBAL query_cache_size = 1000000;
SET GLOBAL query_cache_type = ON;
```

---

### **1.3 Reverse Proxy Caching (Edge Caching)**  
- A caching layer sits between the application and database, reducing repeated queries.  
- Examples: **Varnish, Cloudflare, Nginx FastCGI Cache**.  

✅ **Nginx FastCGI Cache Example**  
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
server {
    location /api/ {
        proxy_cache my_cache;
        proxy_pass http://backend_server;
    }
}
```

---

### **1.4 Object-Level Caching**  
- Store objects instead of raw database queries.  
- Example: **Django ORM caching**  

✅ **Example: Django + Memcached**  
```python
from django.core.cache import cache
user = cache.get(f"user_{user_id}")
if not user:
    user = User.objects.get(id=user_id)
    cache.set(f"user_{user_id}", user, timeout=3600)
```

---

## **2. Cache Expiration & Eviction Strategies**  

### **2.1 Time-to-Live (TTL)**  
- Cached data expires after a set time.  
- Example: `cache.set(key, value, ex=3600)` (expires in 1 hour).  

### **2.2 Least Recently Used (LRU)**  
- Removes the least recently used items when cache is full.  
- Redis and Memcached support LRU eviction.  

✅ **Enable LRU in Redis**  
```bash
redis-cli config set maxmemory-policy allkeys-lru
```

### **2.3 Write-Through vs. Write-Back Caching**  
- **Write-Through**: Data is written to the cache and database simultaneously.  
- **Write-Back**: Data is written to the cache first, then periodically flushed to the database.  

✅ **Example: Write-Through Cache in Python**  
```python
def set_user(user_id, name):
    conn.cursor().execute("UPDATE users SET name=%s WHERE id=%s", (name, user_id))
    cache.set(f"user:{user_id}", name)  # Update cache immediately
```

---

## **3. Best Practices**  
✅ Use **Redis or Memcached** for high-speed caching.  
✅ Implement **TTL & eviction strategies** to prevent stale data.  
✅ Use **database query caching** where supported (PostgreSQL’s `pg_stat_statements`).  
✅ Consider **CDN caching** for large-scale applications.  
✅ Always test cache performance with **benchmarking tools** (e.g., `redis-benchmark`).  

Caching significantly reduces database load and improves response times, but improper cache management can lead to stale data or unnecessary memory usage.