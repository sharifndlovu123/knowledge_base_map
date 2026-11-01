# 04. YAML

### **YAML (Yet Another Markup Language / YAML Ain't Markup Language) Breakdown**

YAML is a **human-readable data serialization format** commonly used for **configuration files**, **data exchange**, and **infrastructure-as-code** (e.g., Docker Compose, Kubernetes, Ansible).

Unlike XML and JSON, YAML is designed to be **clean and minimal**, using **indentation** instead of brackets or tags.

---

## **1. Basic YAML Structure**

A YAML document consists of **key-value pairs, lists, and nested structures**, all defined using indentation.

### **Example YAML File**

```yaml
name: Alice
age: 30
is_student: false
hobbies:
  - Reading
  - Gaming
  - Hiking
address:
  city: New York
  zip: "10001"
```

### **Key Features:**

- **Key-Value Pairs** (`name: Alice`)
- **Boolean Values** (`true` / `false`)
- **Lists (Arrays)** (`hobbies:` with `-` for each item)
- **Nested Structures** (`address:` has `city` and `zip`)

🚨 **YAML is indentation-sensitive!** Always use **spaces, not tabs**.

---

## **2. YAML Syntax Rules**

1. **Key-value pairs are separated by `:`**
    
    ```yaml
    key: value
    ```
    
2. **Indentation determines structure (No brackets/commas)**
    
    ```yaml
    person:
      name: Bob
      age: 25
    ```
    
3. **Lists use `-` (hyphen)**
    
    ```yaml
    hobbies:
      - Reading
      - Gaming
    ```
    
4. **Strings don’t need quotes unless necessary**
    
    ```yaml
    message: Hello, world!
    ```
    
    - Use quotes if the value contains `:` or special characters:
        
        ```yaml
        url: "https://example.com"
        ```
        
5. **Booleans, Numbers, and Null**
    
    ```yaml
    active: true
    count: 42
    empty_value: null
    ```
    
6. **Multi-line Strings**
    - **Literal block (`|`)** (Preserves new lines)
        
        ```yaml
        description: |
          This is a multi-line
          string in YAML.
        ```
        
    - **Folded block (`>`)** (Joins lines with spaces)
        
        ```yaml
        description: >
          This is a folded
          multi-line string.
        ```
        

---

## **3. YAML Data Types**

|Type|Example|
|---|---|
|**String**|`name: "Alice"`|
|**Integer**|`age: 30`|
|**Float**|`price: 10.99`|
|**Boolean**|`is_student: false`|
|**Null**|`value: null`|
|**List**|`hobbies: [Reading, Gaming]`|
|**Dictionary**|`address: {city: New York, zip: 10001}`|

---

## **4. Lists in YAML**

### **Inline List**

```yaml
fruits: [Apple, Banana, Cherry]
```

### **Multiline List**

```yaml
fruits:
  - Apple
  - Banana
  - Cherry
```

---

## **5. Dictionaries (Objects)**

YAML supports **key-value nesting** like JSON.

### **Inline Dictionary**

```yaml
person: {name: Alice, age: 30}
```

### **Multiline Dictionary**

```yaml
person:
  name: Alice
  age: 30
```

---

## **6. Anchors & Aliases (Reuse Data)**

YAML allows reusing values using `&` (anchor) and `*` (alias).

```yaml
defaults: &default_settings
  timeout: 30
  retries: 5

server:
  <<: *default_settings
  host: example.com
```

- `&default_settings` defines reusable settings.
- `*default_settings` inserts them under `server`.

---

## **7. Merging Data (`<<`)**

Instead of manually copying values, YAML allows merging dictionaries:

```yaml
base: &base
  os: Linux
  version: "1.0"

app:
  <<: *base
  name: MyApp
```

---

## **8. YAML vs JSON**

|Feature|YAML|JSON|
|---|---|---|
|**Syntax**|Uses indentation|Uses `{}` and `[]`|
|**Readability**|More human-friendly|More compact|
|**Comments**|`# This is a comment`|❌ Not supported|
|**Data Types**|Strings, Numbers, Lists, Dictionaries|Same|
|**Multiline Strings**|Yes (`|`and`>`)|
|**Parsing**|Slower|Faster|

✅ **JSON is better for APIs**  
✅ **YAML is better for configuration files**

---

## **9. YAML in Different Tools**

### **Kubernetes Example (`deployment.yaml`)**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-container
          image: nginx:latest
          ports:
            - containerPort: 80
```

### **Docker Compose Example (`docker-compose.yml`)**

```yaml
version: "3.8"
services:
  web:
    image: nginx
    ports:
      - "80:80"
```

---

## **10. Parsing YAML in Code**

### **Python (PyYAML)**

```python
import yaml

data = yaml.safe_load("""
name: Alice
age: 30
hobbies:
  - Reading
  - Gaming
""")
print(data["name"])  # Alice
```

### **PowerShell**

```powershell
$yaml = Get-Content config.yaml | ConvertFrom-Yaml
$yaml.name  # Output: Alice
```

---

## **11. Comments in YAML**

YAML supports **inline comments** using `#`:

```yaml
name: Alice  # This is a name
```

🚨 **No multi-line comments in YAML.**

---

## **12. Best Practices for YAML**

✅ **Use spaces, not tabs**  
✅ **Use `-` for lists and indentation for structure**  
✅ **Use `|` for multiline strings if formatting matters**  
✅ **Use `#` for comments**  
✅ **Use anchors (`&`) and aliases (`*`) for reusable data**

---

## **13. Common Uses of YAML**

- **Configuration files** (Kubernetes, Docker Compose, GitHub Actions)
- **Data serialization** (Ansible, CloudFormation)
- **API Definitions** (OpenAPI/Swagger)
- **CI/CD Pipelines** (GitLab, GitHub Actions)

---

### **Key Takeaways**

✅ YAML is **indentation-based**, no brackets or commas.  
✅ Used for **config files, automation, and DevOps tools**.  
✅ Supports **anchors, aliases, and merging** for reusable data.  
✅ **More readable** than JSON, but **parses slower**.

Need deeper insights into a specific YAML feature? 🚀