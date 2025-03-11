### 🚀 **Setting Up a Relational Database with Django**

Django supports relational databases like **PostgreSQL**, **MySQL**, **SQLite**, and **MariaDB**. Here’s how to set up a relational database with Django step-by-step:

---

## ✅ **1. Install Django and Database Driver**

- **For PostgreSQL:**

```bash
pip install django psycopg2
```

- **For MySQL:**

```bash
pip install django mysqlclient
```

- **For SQLite:**  
    No extra installation is needed. Django uses SQLite by default.

---

## ✅ **2. Configure Database in `settings.py`**

Open your Django project’s `settings.py` and modify the `DATABASES` setting:

### **PostgreSQL Example:**

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydatabase',
        'USER': 'mydbuser',
        'PASSWORD': 'mypassword',
        'HOST': 'localhost',  # Use '127.0.0.1' or your DB server IP
        'PORT': '5432',       # Default PostgreSQL port
    }
}
```

### **MySQL Example:**

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mydatabase',
        'USER': 'mydbuser',
        'PASSWORD': 'mypassword',
        'HOST': 'localhost',
        'PORT': '3306',       # Default MySQL port
    }
}
```

### **SQLite Example (Default):**

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

---

## ✅ **3. Create Models (Defining Relationships)**

In `models.py` of your app:

```python
from django.db import models
from django.contrib.auth.models import User

# One-to-One Relationship (UserProfile linked to User)
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.user.username

# One-to-Many Relationship (Each Post belongs to one User)
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=200)
    content = models.TextField()

    def __str__(self):
        return self.title

# Many-to-Many Relationship (Posts can have multiple Tags)
class Tag(models.Model):
    name = models.CharField(max_length=50)
    posts = models.ManyToManyField(Post, related_name='tags')

    def __str__(self):
        return self.name
```

### 🔑 **Relationship Types Recap:**

- **One-to-One:** `models.OneToOneField`
- **One-to-Many:** `models.ForeignKey`
- **Many-to-Many:** `models.ManyToManyField`

---

## ✅ **4. Make Migrations and Apply Them**

Run the following commands to create database tables:

```bash
python manage.py makemigrations
python manage.py migrate
```

- `makemigrations` generates migration files.
- `migrate` applies those migrations to the database.

---

## ✅ **5. Create Superuser to Manage Data (Optional)**

```bash
python manage.py createsuperuser
```

This allows you to log into the Django Admin Panel at `http://localhost:8000/admin/` to manage data visually.

---

## ✅ **6. Interact with the Database via Django Shell**

```bash
python manage.py shell
```

```python
from myapp.models import UserProfile, Post, Tag
from django.contrib.auth.models import User

# Create a user
user = User.objects.create(username='johndoe', email='john@example.com')

# Create a profile
profile = UserProfile.objects.create(user=user, bio='Software Developer')

# Create a post
post = Post.objects.create(author=user, title='My First Post', content='Hello, Django!')

# Add tags
tag1 = Tag.objects.create(name='Django')
tag2 = Tag.objects.create(name='Python')
post.tags.add(tag1, tag2)
```

---

## ✅ **7. Database Indexing (Performance Boost)**

You can add indexes to improve query performance:

```python
class Post(models.Model):
    title = models.CharField(max_length=200, db_index=True)  # Indexed field
    content = models.TextField()

    class Meta:
        indexes = [
            models.Index(fields=['title']),
        ]
```

Run migrations again:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## ✅ **8. Using Environment Variables (For Security)**

Instead of hardcoding DB credentials, use environment variables:

```python
import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

Set these in your `.env` file:

```bash
DB_NAME=mydatabase
DB_USER=mydbuser
DB_PASSWORD=mypassword
DB_HOST=localhost
DB_PORT=5432
```

---

## 🚀 **Final Notes:**

- Use **PostgreSQL** for production due to its robustness.
- Use **SQLite** for quick prototypes or testing.
- Always apply migrations when changes are made to models.

Would you like me to expand on any part, such as advanced queries or database optimization tips? 😊