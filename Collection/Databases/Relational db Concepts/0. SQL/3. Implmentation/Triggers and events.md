### **Triggers and Events in SQL**  

Triggers and events allow databases to **automate actions** in response to specific changes or scheduled tasks.  

---

## **1. Triggers**  
A **trigger** is a special type of stored procedure that **automatically executes** when a specific event occurs in a table (such as an `INSERT`, `UPDATE`, or `DELETE`).  

### **Key Features**  
- **Executed automatically** when a condition is met.  
- Can be defined to fire **before or after** the event.  
- Ensures **data integrity and validation**.  

### **Types of Triggers**  
| Type        | Description |
|------------|-------------|
| **BEFORE INSERT**  | Executes **before** inserting data |
| **AFTER INSERT**   | Executes **after** inserting data |
| **BEFORE UPDATE**  | Executes **before** updating data |
| **AFTER UPDATE**   | Executes **after** updating data |
| **BEFORE DELETE**  | Executes **before** deleting data |
| **AFTER DELETE**   | Executes **after** deleting data |

### **Example: Logging Changes with a Trigger**  
This trigger logs every new employee added to a separate audit table.  
```sql
CREATE TABLE employee_audit (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id INT,
    action VARCHAR(50),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER after_employee_insert
AFTER INSERT ON employees
FOR EACH ROW
BEGIN
    INSERT INTO employee_audit (emp_id, action)
    VALUES (NEW.id, 'INSERTED');
END;
```
Now, whenever a new employee is added:  
```sql
INSERT INTO employees (id, name, salary) VALUES (1, 'John Doe', 50000);
```
The **employee_audit** table records the change automatically.  

---

## **2. Events (Scheduled Jobs)**  
An **event** is a **scheduled database task** that runs at a specific time or interval.  

### **Key Features**  
- Executes **automatically** at scheduled times.  
- Used for **automating maintenance tasks** (e.g., cleaning logs, generating reports).  
- Requires the **event scheduler** to be enabled.  

### **Enabling Event Scheduler**  
```sql
SET GLOBAL event_scheduler = ON;
```

### **Example: Auto-Cleanup Old Records**  
This event **deletes old logs** every day at midnight.  
```sql
CREATE EVENT clean_old_logs
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    DELETE FROM logs WHERE created_at < NOW() - INTERVAL 30 DAY;
END;
```
### **Viewing Scheduled Events**  
```sql
SHOW EVENTS;
```

### **Dropping an Event**  
```sql
DROP EVENT clean_old_logs;
```

---

## **Differences Between Triggers and Events**  

| Feature        | Triggers | Events |
|---------------|---------|--------|
| **Execution Type** | Runs **immediately** when a specific event occurs (INSERT, UPDATE, DELETE) | Runs **at a scheduled time** |
| **Use Case** | Enforce data integrity, validation, logging | Automate tasks like maintenance, cleanup, and reporting |
| **Requires Event Scheduler** | No | Yes |
| **Runs Once or Multiple Times?** | Runs for **each affected row** | Runs **as a scheduled job** |

