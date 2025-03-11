
### **Polymorphic Content Model in Django**

When building a course platform, you may want to add various content types to modules, such as text, images, files, and videos. **Polymorphism** allows you to manage these diverse content types through a unified interface, enabling flexibility in how content is stored and retrieved.

To achieve this in Django, you can utilize **Generic Foreign Keys**, which allow foreign keys to reference objects from any model.

---

### 🔗 **Generic Relationship for Course Content**

The `Content` model establishes a generic relation, linking course modules to different content types dynamically.

```python
from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class Content(models.Model):
    module = models.ForeignKey(
        Module,
        related_name='contents',
        on_delete=models.CASCADE
    )
    content_type = models.ForeignKey(  # References the model type (Text, Image, Video, etc.)
        ContentType,
        on_delete=models.CASCADE
    )
    object_id = models.PositiveIntegerField()  # Stores the ID of the related content object
    item = GenericForeignKey('content_type', 'object_id')  # Links to the actual content object
```

With this setup:

- **`ContentType`** identifies the model (e.g., `Text`, `Video`, `Image`).
- **`object_id`** holds the primary key of the related model instance.
- **`GenericForeignKey`** combines the above to create a dynamic relation.

---

### 📋 **Model Inheritance for Diverse Content Types**

Since each content type (text, image, video, document) requires unique data, Django’s **model inheritance** helps to manage shared and specific fields efficiently.

Django provides three types of model inheritance:

---

### 1️⃣ **Abstract Base Classes**

Use **abstract models** when you want to define common fields without creating a separate database table. Child models inherit these fields.

```python
from django.db import models

# Abstract base class with common fields
class BaseContent(models.Model):
    title = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True  # No database table will be created for BaseContent

# Inherits common fields, adds specific content field
class Text(BaseContent):
    body = models.TextField()

class Image(BaseContent):
    image = models.ImageField(upload_to='images/')

class Video(BaseContent):
    url = models.URLField()

class Document(BaseContent):
    file = models.FileField(upload_to='documents/')
```

**Key Points:**

- No table for `BaseContent` in the database.
- Shared fields (`title`, `created`) exist in all child models.

![[Pasted image 20250126180758.png]]

---

### 2️⃣ **Multi-Table Inheritance**

Use **multi-table inheritance** when both the parent and child models should have their own database tables. Django automatically adds a `OneToOneField` to connect them.

```python
from django.db import models

# Parent model with common fields
class BaseContent(models.Model):
    title = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)

# Child model with additional fields
class Text(BaseContent):
    body = models.TextField()  # Specific field for Text content
```

**How It Works:**

- A separate table is created for both `BaseContent` and `Text`.
- Django adds an implicit `basecontent_ptr_id` to the `Text` table to link it to `BaseContent`.

![[Pasted image 20250126180835.png]]

---

### 3️⃣ **Proxy Models**

**Proxy models** allow you to modify the behavior of an existing model (e.g., adding methods or changing default ordering) without creating a new database table.

```python
from django.db import models
from django.utils import timezone

# Base model
class BaseContent(models.Model):
    title = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)

# Proxy model for adding behavior without creating a new table
class OrderedContent(BaseContent):
    class Meta:
        proxy = True  # No new table, uses BaseContent’s table
        ordering = ['created']

    def created_delta(self):
        return timezone.now() - self.created
```

**Benefits:**

- No additional database table.
- Customize model behavior (e.g., add `created_delta()` method).
- Apply default ordering (`ordering = ['created']`).

![[Pasted image 20250126180847.png]]

---

### 🚀 **Summary**

|Inheritance Type|Use Case|Creates a DB Table?|Key Feature|
|:--|:--|:--|:--|
|**Abstract Base Classes**|Shared fields across models|❌|DRY code with no extra table|
|**Multi-Table Inheritance**|Parent & child models as full entities|✅|Separate tables with `OneToOneField` link|
|**Proxy Models**|Change behavior, no schema changes|❌|Add methods, managers, custom ordering|

By combining **generic relationships** with **model inheritance**, you can create a flexible, scalable system for managing diverse content types within your Django applications. 🚀