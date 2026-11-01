# 02. Design patterns for different use cases

### **Database Design Patterns for Different Use Cases**  

Database design patterns help structure data efficiently based on specific use cases, ensuring scalability, performance, and maintainability.  

---

## **1. Single-Table Inheritance (Polymorphic Table)**
- **Use Case:** When multiple entity types share common attributes but also have unique attributes.  
- **Structure:**  
  - A **single table** stores all entity types, with some columns used only for specific types.  
  - A **discriminator column** determines the entity type.  
- **Example:** Storing `Users` and `Admins` in one table with a column `role_type` to distinguish them.  
- **Pros:** Simpler queries.  
- **Cons:** Many nullable columns and wasted space.  

---

## **2. Table Per Type (TPT)**
- **Use Case:** When multiple entity types share some attributes but require separate tables for unique attributes.  
- **Structure:**  
  - A **parent table** stores common fields.  
  - **Child tables** store specific attributes and reference the parent.  
- **Example:** A `Users` table with `Admins` and `Customers` as separate tables linked to it.  
- **Pros:** No redundant or nullable fields.  
- **Cons:** Requires `JOINs` for queries.  

---

## **3. Table Per Concrete Type (TPC)**
- **Use Case:** When entity types don’t share fields and don’t require a common parent table.  
- **Structure:**  
  - Each entity type has its **own table** with all its attributes.  
- **Example:** `Admins` and `Customers` have separate tables without a common `Users` table.  
- **Pros:** No `JOINs` needed.  
- **Cons:** Redundant storage for common fields.  

---

## **4. Star Schema (For Data Warehousing)**
- **Use Case:** Optimizing **analytical queries** in data warehouses.  
- **Structure:**  
  - A **fact table** stores metrics (sales, revenue).  
  - **Dimension tables** store descriptive data (customers, time, products).  
- **Example:**  
  - Fact Table: `Sales (id, customer_id, product_id, amount, date_id)`  
  - Dimension Tables: `Customers`, `Products`, `Dates`.  
- **Pros:** Fast queries for analytics.  
- **Cons:** Data redundancy in dimension tables.  

---

## **5. Snowflake Schema**
- **Use Case:** A more normalized version of the **star schema** for reduced data redundancy.  
- **Structure:**  
  - Dimension tables are **normalized** into smaller sub-tables.  
- **Example:**  
  - Instead of a `Products` table, we have `Product_Categories` and `Product_Details`.  
- **Pros:** Saves storage.  
- **Cons:** Slower queries due to more `JOINs`.  

---

## **6. Sharded Database Pattern**
- **Use Case:** When handling **massive-scale applications** requiring horizontal scaling.  
- **Structure:**  
  - Data is **split across multiple databases** (shards) based on a **sharding key** (e.g., user ID).  
- **Example:**  
  - User data is partitioned by **region** (`users_usa`, `users_europe`).  
- **Pros:** High scalability.  
- **Cons:** Complex management and cross-shard queries are difficult.  

---

## **7. CQRS (Command Query Responsibility Segregation)**
- **Use Case:** When read and write operations require **different optimizations**.  
- **Structure:**  
  - **Separate databases** for reads and writes.  
- **Example:**  
  - A **PostgreSQL** database for transactions, and an **Elasticsearch** index for fast searches.  
- **Pros:** Optimized performance.  
- **Cons:** Increased complexity.  

---

## **8. Event Sourcing**
- **Use Case:** Applications needing a **complete history of changes** (e.g., banking, auditing).  
- **Structure:**  
  - Instead of updating records, **events are stored as logs** and replayed to reconstruct state.  
- **Example:**  
  - A **banking ledger** where every deposit, withdrawal, and transfer is an immutable event.  
- **Pros:** Perfect audit trail.  
- **Cons:** Complex queries.  

---

Each pattern fits different scenarios based on data volume, consistency requirements, and performance needs.