### 🚀 **Setting Up a NoSQL Database with Django (MongoDB Example)**

While Django is designed for relational databases, you can integrate NoSQL databases like **MongoDB** using third-party libraries such as **Djongo** or **MongoEngine**. Here’s how to set it up step-by-step.

---

## ✅ **1. Install MongoDB and Required Packages**

- **Install MongoDB** on your system or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    
- **Install Django and MongoDB drivers:**
    

```bash
pip install django djongo
```

- Alternatively, if using **MongoEngine**:

```bash
pip install django mongoengine
```

---

## ✅ **2. Configure MongoDB in `settings.py`**

### **Using Djongo:**

```python
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'mydatabase',
        'ENFORCE_SCHEMA': False,
        'CLIENT': {
            'host': 'mongodb://localhost:27017/',
            'username': 'myuser',
            'password': 'mypassword',
            'authSource': 'admin',
        }
    }
}
```

- **`host`**: MongoDB server address.
- **`ENFORCE_SCHEMA`**: Set to `False` to allow schema flexibility.

---

## ✅ **3. Create Models (Schema-Free Approach)**

In `models.py` of your Django app:

```python
from django.db import models

# Example of a flexible document schema
class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True, null=True)  # Optional field

    def __str__(self):
        return self.name


class Post(models.Model):
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    tags = models.JSONField(default=list)  # Using JSON for dynamic data

    def __str__(self):
        return self.title
```

### 🔑 **Key Differences from Relational DB:**

- **No strict schema**: Fields like `JSONField` allow dynamic structures.
- **Relationships**: Still possible using foreign keys, but MongoDB prefers embedding documents over referencing.

---

## ✅ **4. Run Migrations**

Even though MongoDB is schema-less, Django still uses migrations for app structure:

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## ✅ **5. Interact with MongoDB via Django Shell**

```bash
python manage.py shell
```

```python
from myapp.models import UserProfile, Post

# Create a user profile
user = UserProfile.objects.create(name='Jane Doe', email='jane@example.com')

# Create a post with dynamic tags
post = Post.objects.create(author=user, title='MongoDB with Django', content='Hello NoSQL!', tags=['django', 'mongodb'])

# Query posts
posts = Post.objects.filter(tags__contains='django')
for p in posts:
    print(p.title)
```

---

## ✅ **6. Using MongoEngine (Alternative to Djongo)**

If you prefer MongoEngine, here’s how to set it up:

### **Install MongoEngine:**

```bash
pip install mongoengine
```

### **Update `settings.py`:**

```python
from mongoengine import connect
connect('mydatabase', host='localhost', port=27017)
```

### **Define Models with MongoEngine:**

```python
from mongoengine import Document, StringField, EmailField, ReferenceField, ListField

class UserProfile(Document):
    name = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)
    bio = StringField()

class Post(Document):
    author = ReferenceField(UserProfile)
    title = StringField(required=True, max_length=200)
    content = StringField()
    tags = ListField(StringField())
```

### **MongoEngine CRUD Operations:**

```python
# Create user
user = UserProfile(name='John Doe', email='john@example.com').save()

# Create post
post = Post(author=user, title='Mongo with Django', content='Exploring NoSQL', tags=['NoSQL', 'MongoDB']).save()

# Query posts
for post in Post.objects(tags__in=['MongoDB']):
    print(post.title)
```

---

## ✅ **7. Advanced MongoDB Features in Django**

- **Aggregation Framework:**

```python
from django.db.models import Count

# Count posts per author
Post.objects.values('author__name').annotate(total=Count('id'))
```

- **Flexible Schemas:**

```python
class DynamicDocument(models.Model):
    data = models.JSONField()  # Store any JSON data
```

---

## ✅ **8. Using Environment Variables (Security Best Practice)**

```python
import os

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': os.getenv('MONGO_DB_NAME'),
        'CLIENT': {
            'host': os.getenv('MONGO_URI'),
            'username': os.getenv('MONGO_USER'),
            'password': os.getenv('MONGO_PASSWORD'),
        }
    }
}
```

`.env` file:

```bash
MONGO_DB_NAME=mydatabase
MONGO_URI=mongodb://localhost:27017/
MONGO_USER=myuser
MONGO_PASSWORD=mypassword
```

---

## 🚀 **When to Use NoSQL with Django:**

- Large-scale unstructured or semi-structured data.
- Real-time analytics, IoT applications, or flexible data models.
- Faster write operations compared to traditional RDBMS.

---