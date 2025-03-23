### **Transaction Control Language (TCL)**  

TCL commands manage database transactions, ensuring data integrity and consistency. They are used to **commit, rollback, or save** changes within a transaction.

---

### **Key TCL Commands**  

#### 1. **COMMIT** – Save Changes Permanently  
Used to permanently save all changes made in the current transaction. Once a `COMMIT` is executed, the changes **cannot be undone**.

```sql
COMMIT;
```

Example:
```sql
UPDATE employees SET salary = salary * 1.10 WHERE department = 'Sales';
COMMIT;
```
- Increases salaries for all sales employees by 10% and **saves** the changes permanently.

---

#### 2. **ROLLBACK** – Undo Changes  
Used to **revert** all changes made in the current transaction **since the last COMMIT**.

```sql
ROLLBACK;
```

Example:
```sql
UPDATE employees SET salary = salary * 1.10 WHERE department = 'Sales';
ROLLBACK;
```
- If a mistake is detected before committing, `ROLLBACK` cancels the update, restoring the original values.

---

#### 3. **SAVEPOINT** – Create a Partial Rollback Point  
Used to set a **savepoint** within a transaction, allowing a **partial rollback** instead of undoing everything.

```sql
SAVEPOINT savepoint_name;
```

Example:
```sql
BEGIN;

UPDATE employees SET salary = salary * 1.10 WHERE department = 'Sales';
SAVEPOINT before_manager_update;

UPDATE employees SET salary = salary * 1.20 WHERE role = 'Manager';

-- If there's an issue with the manager update, rollback only that part
ROLLBACK TO before_manager_update;

COMMIT;
```
- This **keeps** the first update (Sales department) while **rolling back** only the manager salary update.

---

### **Key Notes on TCL:**  
- **COMMIT** makes changes permanent.  
- **ROLLBACK** undoes all changes since the last `COMMIT`.  
- **SAVEPOINT** allows rolling back only part of a transaction.  

