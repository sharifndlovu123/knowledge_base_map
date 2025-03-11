
### 🚀 **Django Template Tags**

Template tags in Django allow you to add dynamic logic to your templates, such as looping, conditional statements, custom filters, and more.

---

### ✅ **1️⃣ Built-in Template Tags Example**

#### **Looping with `{% for %}`**

```html
<ul>
  {% for item in items %}
    <li>{{ item.name }}</li>
  {% empty %}
    <li>No items available.</li>
  {% endfor %}
</ul>
```

#### **Conditional with `{% if %}`**

```html
{% if user.is_authenticated %}
  <p>Welcome, {{ user.username }}!</p>
{% else %}
  <p>Please log in.</p>
{% endif %}
```

---

### 🛠️ **2️⃣ Custom Template Tags**

You can create custom tags using the `Library` class from `django.template`.

#### **Step 1: Create a Template Tag Directory**

Structure:

```
myapp/
├── templatetags/
│   ├── __init__.py
│   └── custom_tags.py
```

#### **Step 2: Write a Custom Tag**

**`myapp/templatetags/custom_tags.py`**

```python
from django import template
from datetime import datetime

register = template.Library()

@register.simple_tag
def current_year():
    return datetime.now().year

@register.simple_tag
def multiply(a, b):
    return a * b
```

#### **Step 3: Load and Use in Template**

**`base.html`**

```html
{% load custom_tags %}

<p>Current Year: {% current_year %}</p>
<p>Multiplication Result: {% multiply 5 10 %}</p>
```

---

### 🔥 **3️⃣ Custom Inclusion Tags (Rendering HTML)**

Inclusion tags allow you to render reusable components with their own templates.

#### **Step 1: Create the Tag**

**`myapp/templatetags/custom_tags.py`**

```python
@register.inclusion_tag('components/user_card.html')
def user_card(user):
    return {'user': user}
```

#### **Step 2: Create the Template**

**`templates/components/user_card.html`**

```html
<div class="user-card">
  <h2>{{ user.username }}</h2>
  <p>Email: {{ user.email }}</p>
</div>
```

#### **Step 3: Use in Templates**

```html
{% load custom_tags %}

{% user_card user %}
```

---

### ⚡ **4️⃣ Custom Template Filters**

Filters modify variable values in templates.

#### **Create a Filter**

**`myapp/templatetags/custom_tags.py`**

```python
@register.filter
def capitalize_words(value):
    return value.title()
```

#### **Use in Template**

```html
{{ "hello world" | capitalize_words }}  <!-- Output: Hello World -->
```

---

### 🚩 **Bonus: Built-in Template Tags Cheat Sheet**

- `{% url 'view_name' arg1 arg2 %}` → Generate URLs
- `{% static 'path/to/file.css' %}` → Load static files
- `{% csrf_token %}` → CSRF protection in forms
- `{% include 'template.html' %}` → Include another template

---

Let me know if you’d like to dive deeper into any specific type of tag or advanced logic! 🚀

