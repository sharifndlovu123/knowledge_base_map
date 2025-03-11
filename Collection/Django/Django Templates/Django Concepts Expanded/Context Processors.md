In Django, **context processors** are Python functions that take a request object as an argument and return a dictionary of data to be added to the context of every template. This is useful when you want certain variables to be available globally across all templates.

### 1️⃣ **Basic Example: Adding Site Name Globally**

**`myapp/context_processors.py`**

```python
def site_name(request):
    return {
        'SITE_NAME': 'My Awesome Website'
    }
```

**Add to `settings.py`**

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'myapp.context_processors.site_name',  # Add this line
            ],
        },
    },
]
```

**In Your Template (`base.html`)**

```html
<h1>Welcome to {{ SITE_NAME }}</h1>
```

---

### 2️⃣ **Example with User-Specific Data (Cart Items Count)**

**`shop/context_processors.py`**

```python
def cart_item_count(request):
    if request.user.is_authenticated:
        cart = request.user.cart  # Assuming a OneToOne relation with Cart
        return {'cart_item_count': cart.items.count()}
    return {'cart_item_count': 0}
```

**Update `settings.py`**

```python
'context_processors': [
    # Default processors...
    'shop.context_processors.cart_item_count',
],
```

**In Template (`navbar.html`)**

```html
<a href="/cart/">Cart ({{ cart_item_count }})</a>
```

---

### 3️⃣ **Dynamic Data Based on Request (Current Path)**

**`core/context_processors.py`**

```python
def current_path(request):
    return {
        'current_path': request.path
    }
```

**In Template (`footer.html`)**

```html
<p>You are currently on: {{ current_path }}</p>
```

---

### 🚀 **Pro Tip: Built-in Context Processors**

Django provides several built-in context processors, like:

- `django.template.context_processors.request` → Adds `request` object
- `django.contrib.auth.context_processors.auth` → Adds `user` and `perms`
- `django.template.context_processors.static` → For `static` tag usage
