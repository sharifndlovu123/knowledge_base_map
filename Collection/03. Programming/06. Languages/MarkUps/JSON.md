# 02. JSON

### **JSON (JavaScript Object Notation) Breakdown**

JSON is a lightweight data format used for data exchange between systems. It's **text-based**, **human-readable**, and follows a **key-value** structure similar to dictionaries in Python or objects in JavaScript.

---

## **1. JSON Data Structure**

JSON consists of:

1. **Objects** `{ key: value }` (like dictionaries)
2. **Arrays** `[value1, value2]` (like lists)
3. **Primitive Values** (strings, numbers, booleans, null)

### **Example JSON**

```json
{
  "name": "Alice",
  "age": 25,
  "isStudent": false,
  "hobbies": ["reading", "gaming"],
  "address": {
    "city": "New York",
    "zip": "10001"
  }
}
```

---

## **2. JSON Data Types**

JSON supports the following **six** data types:

|Type|Example|Notes|
|---|---|---|
|**String**|`"hello"`|Enclosed in **double quotes**|
|**Number**|`25`, `3.14`|Integers & floating points|
|**Boolean**|`true`, `false`|No quotes needed|
|**Null**|`null`|Represents an empty value|
|**Object**|`{ "key": "value" }`|Collection of key-value pairs|
|**Array**|`[1, 2, "text"]`|Ordered list of values|

---

## **3. JSON Objects (`{}`)**

A **JSON object** is a collection of key-value pairs.

### **Example**

```json
{
  "id": 101,
  "name": "Bob",
  "email": "bob@example.com"
}
```

- **Keys must be strings** (double-quoted).
- **Values can be any valid JSON type**.

---

## **4. JSON Arrays (`[]`)**

JSON arrays are **ordered** collections of values.

### **Example**

```json
{
  "fruits": ["apple", "banana", "cherry"]
}
```

- Arrays **can contain mixed types**, though it’s uncommon:

```json
{
  "mixed": [42, "hello", true, null]
}
```

---

## **5. Nesting Objects & Arrays**

JSON supports **nesting**, meaning objects can contain arrays and vice versa.

### **Example**

```json
{
  "user": {
    "id": 1,
    "name": "John",
    "contacts": ["john@email.com", "123-456-7890"]
  }
}
```

---

## **6. JSON Syntax Rules**

- Use **double quotes (`"`)** for keys and strings.
- No **trailing commas** (unlike JavaScript objects).
- **Keys must be strings**.
- **Booleans and `null` are lowercase** (`true`, `false`, `null`).

✅ **Valid JSON:**

```json
{ "name": "Alice", "age": 30 }
```

❌ **Invalid JSON (trailing comma):**

```json
{ "name": "Alice", "age": 30, }
```

---

## **7. JSON vs JavaScript Objects**

|Feature|JSON Example|JavaScript Object Example|
|---|---|---|
|**Key Quotes**|`{ "name": "Alice" }`|`{ name: "Alice" }` (No quotes)|
|**Property Access**|`jsonObj["name"]`|`obj.name` or `obj["name"]`|
|**Allowed Values**|Strings, numbers, arrays, objects|Functions, dates, regex|

---

## **8. Converting JSON in Different Languages**

### **JavaScript**

```js
// Convert JSON string to object
let obj = JSON.parse('{"name": "Alice"}');

// Convert object to JSON string
let jsonStr = JSON.stringify(obj);
```

### **Python**

```python
import json

# Convert JSON string to dictionary
data = json.loads('{"name": "Alice"}')

# Convert dictionary to JSON string
json_str = json.dumps(data, indent=2)
```

---

## **9. Common JSON Operations**

### **Reading JSON from a File**

#### **Python**

```python
with open("data.json", "r") as file:
    data = json.load(file)
```

#### **JavaScript (Node.js)**

```js
const fs = require('fs');
let data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
```

---

## **10. Common Mistakes in JSON**

|Mistake|Example|Fix|
|---|---|---|
|**Single quotes**|`{'key': 'value'}`|Use **double quotes** (`"`)|
|**Trailing comma**|`{ "name": "Alice", }`|Remove comma|
|**Unquoted keys**|`{ name: "Alice" }`|Use `"name"`|
|**Functions**|`{ "sayHello": function() { return "Hi"; } }`|Functions are **not** allowed|

---

## **11. JSON in APIs**

JSON is widely used in **REST APIs** for data exchange.

### **Example API Response (GET Request)**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Alice"
  }
}
```

Clients (browsers, mobile apps) parse this response to extract and display data.

---

## **12. JSON Schema (Validation)**

To ensure JSON is structured correctly, **JSON Schema** is used.

### **Example JSON Schema**

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer" }
  },
  "required": ["name", "age"]
}
```

---

## **13. JSON Tools**

- **Online Formatters**: [jsonlint.com](https://jsonlint.com/)
- **CLI Pretty Print (Linux/Mac)**:
    
    ```sh
    cat data.json | jq .
    ```
    
- **PowerShell Pretty Print**:
    
    ```powershell
    Get-Content data.json | ConvertFrom-Json | ConvertTo-Json -Depth 10
    ```
    

---

### **Key Takeaways**

✅ JSON is simple and widely used.  
✅ Always use **double quotes** for keys and strings.  
✅ Objects (`{}`) store **key-value** pairs.  
✅ Arrays (`[]`) store **ordered values**.  
✅ JSON is **not the same as JavaScript objects** (no functions, strict syntax).

Do you need deeper insight into a specific part? 🚀