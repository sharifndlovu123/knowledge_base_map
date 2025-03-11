### 🚀 **Django Default Template Tags & Filters**

Django provides a rich set of **template tags** and **filters** to control presentation logic within templates.

---

## 🏷️ **1️⃣ Default Template Tags**

These tags perform actions like control flow, including templates, URL reversing, etc.

### ✅ **Control Flow Tags**

- `{% if %}` → Conditional logic
- `{% ifequal %}` / `{% ifnotequal %}` → Compare values (deprecated in favor of `{% if %}`)
- `{% for %}` → Loop through items
- `{% empty %}` → Used inside `{% for %}` for empty iterables
- `{% with %}` → Define temporary variables
- `{% regroup %}` → Group list of objects by a common attribute

### 📦 **Template Inheritance Tags**

- `{% extends "base.html" %}` → Inherit from another template
- `{% block content %}` → Define blocks for child templates to override
- `{% include "partial.html" %}` → Include reusable template snippets
- `{% load custom_tags %}` → Load custom template tags/filters

### 🌐 **URL & Static Tags**

- `{% url 'view_name' arg1 arg2 %}` → Generate URLs dynamically
- `{% static 'path/to/file.css' %}` → Load static files
- `{% csrf_token %}` → CSRF protection in forms

### 🔄 **Other Useful Tags**

- `{% autoescape on/off %}` → Enable/disable auto-escaping
- `{% spaceless %}` → Remove whitespace between HTML tags
- `{% comment %} This won't be rendered {% endcomment %}` → Add comments
- `{% verbatim %}` → Prevent Django from parsing template code inside

---

## 🚀 **2️⃣ Default Template Filters (Pipelines `|`)**

Filters modify variable outputs. You chain them using the `|` operator.

### 🔤 **String Filters**

- `{{ value|title }}` → Capitalizes each word (e.g., `hello world` → `Hello World`)
- `{{ value|upper }}` → Converts to uppercase
- `{{ value|lower }}` → Converts to lowercase
- `{{ value|truncatechars:10 }}` → Truncates text to 10 characters
- `{{ value|truncatewords:3 }}` → Limits output to 3 words
- `{{ value|default:"N/A" }}` → Displays default value if variable is empty

### 🔢 **Number Filters**

- `{{ value|add:5 }}` → Adds 5 to the value
- `{{ value|divisibleby:3 }}` → Returns `True` if divisible by 3
- `{{ value|floatformat:2 }}` → Formats float to 2 decimal places

### 📆 **Date & Time Filters**

- `{{ date|date:"Y-m-d" }}` → Formats date
- `{{ date|timesince }}` → Shows time since the date (e.g., `3 days ago`)
- `{{ date|timeuntil }}` → Shows time until the date

### 📋 **List & Dictionary Filters**

- `{{ items|length }}` → Returns the number of items
- `{{ items|first }}` / `{{ items|last }}` → Returns the first/last item
- `{{ my_dict|get_item:"key" }}` → Accesses a dictionary key (with custom filter)

### 🔒 **Escape & Safe Filters**

- `{{ value|escape }}` → Escapes HTML for safety
- `{{ value|safe }}` → Marks string as safe (no escaping)

---

## 💡 **3️⃣ Combining Filters (Chaining Pipelines)**

You can chain filters to apply multiple transformations:

```django
{{ "hello world" | upper | truncatechars:5 }}  <!-- Output: HELLO -->
```

Or with default values:

```django
{{ username|default:"Guest"|title }}
```

---

## 🗒️ **4️⃣ Special Filter Examples**

### ✅ `default_if_none`

Returns a default value **only if** the variable is `None` (unlike `default`, which works for empty values too):

```django
{{ user_name|default_if_none:"Anonymous" }}
```

### 🔍 `dictsort`

Sorts a list of dictionaries by a specific key:

```django
{% for item in items|dictsort:"name" %}
    {{ item.name }}
{% endfor %}
```

---

## 📦 **Bonus: Custom Filter Example**

```python
# myapp/templatetags/custom_filters.py
from django import template

register = template.Library()

@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)
```

Usage:

```django
{% load custom_filters %}
{{ my_dict|get_item:"username" }}
```

---
[[Template Tags]]