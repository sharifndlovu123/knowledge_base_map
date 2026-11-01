# 01. Advanced Queries

### **Advanced SQL Queries**  

Advanced SQL techniques like **JOINs, subqueries, Common Table Expressions (CTEs), and window functions** allow for powerful data retrieval and manipulation.  

---

### **1. JOINs: Combining Multiple Tables**  

`JOIN` operations merge rows from different tables based on a **related column**.  

#### **Types of JOINs:**  

- **INNER JOIN**: Returns only matching rows from both tables.  
- **LEFT JOIN** (LEFT OUTER JOIN): Returns all rows from the left table + matching rows from the right.  
- **RIGHT JOIN** (RIGHT OUTER JOIN): Returns all rows from the right table + matching rows from the left.  
- **FULL JOIN** (FULL OUTER JOIN): Returns all rows from both tables, filling in `NULL` where there is no match.  
- **CROSS JOIN**: Returns the Cartesian product of both tables.  
- **SELF JOIN**: A table joins itself.  

Example – `INNER JOIN`:
```sql
SELECT employees.name, departments.name AS department
FROM employees
INNER JOIN departments ON employees.department_id = departments.id;
```
- Returns only employees who have a matching department.

---

### **2. Subqueries: Nested Queries**  

A **subquery** is a query inside another query.  

Example – Get employees who earn more than the **average salary**:
```sql
SELECT name, salary 
FROM employees 
WHERE salary > (SELECT AVG(salary) FROM employees);
```

- The subquery calculates the average salary.  
- The main query filters employees earning above that.  

---

### **3. Common Table Expressions (CTEs)**  

A **CTE** is a temporary result set that improves readability and modularity.  

Example – Using a **CTE** for employees with salaries above average:
```sql
WITH HighEarners AS (
    SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)
)
SELECT * FROM HighEarners;
```
- CTEs enhance query structure without requiring nested subqueries.  

---

### **4. Window Functions: Aggregate Without GROUP BY**  

Window functions **operate over a partitioned dataset** without collapsing rows like `GROUP BY`.  

#### **Examples of Window Functions:**  
- **RANK()** – Assigns a rank with gaps.  
- **DENSE_RANK()** – Assigns a rank without gaps.  
- **ROW_NUMBER()** – Gives a unique row number.  
- **LEAD() / LAG()** – Access previous or next row.  
- **SUM() OVER() / AVG() OVER()** – Running totals and averages.  

Example – Rank employees by salary **within each department**:
```sql
SELECT name, department, salary,
       RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS rank
FROM employees;
```
- `PARTITION BY department` ensures ranking is done **per department**.  

---

