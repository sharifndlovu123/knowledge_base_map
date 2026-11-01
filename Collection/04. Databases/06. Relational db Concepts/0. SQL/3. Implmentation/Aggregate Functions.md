# 02. Aggregate Functions

### **Aggregate Functions in SQL**  

Aggregate functions **perform calculations** on a set of rows and return a **single** result. They are often used with `GROUP BY` to summarize data.  

---

### **1. COUNT() – Counting Rows**  
Returns the number of rows matching a condition.  

Example – Count total employees:  
```sql
SELECT COUNT(*) FROM employees;
```
Example – Count employees per department:  
```sql
SELECT department, COUNT(*) 
FROM employees 
GROUP BY department;
```

---

### **2. SUM() – Total of a Column**  
Returns the sum of values in a column.  

Example – Total salaries:  
```sql
SELECT SUM(salary) FROM employees;
```
Example – Total salary per department:  
```sql
SELECT department, SUM(salary) 
FROM employees 
GROUP BY department;
```

---

### **3. AVG() – Average Value**  
Calculates the **average** of a numeric column.  

Example – Average salary across all employees:  
```sql
SELECT AVG(salary) FROM employees;
```
Example – Average salary per department:  
```sql
SELECT department, AVG(salary) 
FROM employees 
GROUP BY department;
```

---

### **4. MIN() – Lowest Value**  
Returns the **minimum** value in a column.  

Example – Find the **lowest** salary:  
```sql
SELECT MIN(salary) FROM employees;
```
Example – Lowest salary per department:  
```sql
SELECT department, MIN(salary) 
FROM employees 
GROUP BY department;
```

---

### **5. MAX() – Highest Value**  
Returns the **maximum** value in a column.  

Example – Find the **highest** salary:  
```sql
SELECT MAX(salary) FROM employees;
```
Example – Highest salary per department:  
```sql
SELECT department, MAX(salary) 
FROM employees 
GROUP BY department;
```

---

### **Using Multiple Aggregate Functions Together**  
Example – Summary of salaries:  
```sql
SELECT department, 
       COUNT(*) AS num_employees, 
       SUM(salary) AS total_salary, 
       AVG(salary) AS avg_salary, 
       MIN(salary) AS lowest_salary, 
       MAX(salary) AS highest_salary
FROM employees 
GROUP BY department;
```
This returns a **department-wise salary summary**.  

