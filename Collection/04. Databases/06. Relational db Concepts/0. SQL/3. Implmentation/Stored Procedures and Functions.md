# 03. Stored Procedures and Functions

### **Stored Procedures and Functions in SQL**  

Stored procedures and functions **allow reusable, modular, and efficient execution of SQL logic** inside a database.  

---

## **1. Stored Procedures**  
A **stored procedure** is a **precompiled collection of SQL statements** stored in the database that can be executed with a single call.  

### **Key Features**  
- Can **execute multiple SQL statements**.  
- Supports **input and output parameters**.  
- Improves **performance** by reducing redundant queries.  
- Often used for **business logic** inside the database.  

### **Example: Creating a Stored Procedure**  
```sql
CREATE PROCEDURE GetEmployeeByID (IN emp_id INT)
BEGIN
    SELECT * FROM employees WHERE id = emp_id;
END;
```
### **Executing a Stored Procedure**  
```sql
CALL GetEmployeeByID(5);
```

### **Example: Stored Procedure with Output Parameter**  
```sql
CREATE PROCEDURE GetTotalSalary (OUT total_salary DECIMAL(10,2))
BEGIN
    SELECT SUM(salary) INTO total_salary FROM employees;
END;
```
Calling the procedure and retrieving the result:  
```sql
CALL GetTotalSalary(@salary);
SELECT @salary;
```

---

## **2. Functions**  
A **function** is similar to a stored procedure but:  
- **Must return a single value**.  
- **Cannot modify database state** (i.e., no `INSERT`, `UPDATE`, `DELETE`).  
- Used in **SELECT statements** or expressions.  

### **Example: Creating a Function**  
```sql
CREATE FUNCTION GetEmployeeCount() RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE emp_count INT;
    SELECT COUNT(*) INTO emp_count FROM employees;
    RETURN emp_count;
END;
```
### **Using the Function in a Query**  
```sql
SELECT GetEmployeeCount();
```

### **Example: Function with Parameters**  
```sql
CREATE FUNCTION GetDepartmentSalary(dept_name VARCHAR(50)) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE total_salary DECIMAL(10,2);
    SELECT SUM(salary) INTO total_salary FROM employees WHERE department = dept_name;
    RETURN total_salary;
END;
```
### **Calling the Function**  
```sql
SELECT GetDepartmentSalary('HR');
```

---

## **Differences Between Stored Procedures and Functions**  

| Feature              | Stored Procedure                         | Function                           |
|----------------------|----------------------------------------|-----------------------------------|
| **Returns a Value**  | Optional (`OUT` parameter possible)    | Must return a single value       |
| **Can Modify Data**  | Yes (`INSERT`, `UPDATE`, `DELETE`)     | No (read-only)                   |
| **Used in Queries**  | No (must be called separately)         | Yes (used in `SELECT` statements) |
| **Supports Transactions** | Yes | No |

Stored procedures are used for **complex logic and modifying data**, while functions are mainly used for **calculations and returning values**.  
