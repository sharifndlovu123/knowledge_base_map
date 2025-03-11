Custom Django managers and querysets are powerful tools for encapsulating database query logic and making your code more reusable and maintainable. Here's how you can create and use them:

---

### **1. Custom Managers**
A custom manager allows you to add methods to the default manager or override its behavior. You can use it to create shortcuts for common queries.

#### **Example: Custom Manager for Active Users**
```python
from django.db import models

class ActiveUserManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)

class User(models.Model):
    username = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    objects = models.Manager()  # Default manager
    active_users = ActiveUserManager()  # Custom manager

    def __str__(self):
        return self.username
```

**Usage:**
```python
# Get all active users
active_users = User.active_users.all()

# Get all users (including inactive ones)
all_users = User.objects.all()
```

---

### **2. Custom Querysets**
A custom queryset allows you to define reusable query logic that can be chained with other querysets.

#### **Example: Custom Queryset for Published Posts**
```python
from django.db import models
from django.utils import timezone

class PublishedPostQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status='published', published_date__lte=timezone.now())

    def drafts(self):
        return self.filter(status='draft')

class Post(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    title = models.CharField(max_length=200)
    content = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    published_date = models.DateTimeField(null=True, blank=True)

    objects = PublishedPostQuerySet.as_manager()  # Use the custom queryset as the default manager

    def __str__(self):
        return self.title
```

**Usage:**
```python
# Get all published posts
published_posts = Post.objects.published()

# Get all draft posts
draft_posts = Post.objects.drafts()
```

---

### **3. Combining Custom Managers and Querysets**
You can combine custom managers and querysets to create even more powerful abstractions.

#### **Example: Custom Manager and Queryset for Blog Posts**
```python
from django.db import models
from django.utils import timezone

class PostQuerySet(models.QuerySet):
    def published(self):
        return self.filter(status='published', published_date__lte=timezone.now())

    def drafts(self):
        return self.filter(status='draft')

    def by_author(self, author):
        return self.filter(author=author)

class PostManager(models.Manager):
    def get_queryset(self):
        return PostQuerySet(self.model, using=self._db)

    def published(self):
        return self.get_queryset().published()

    def drafts(self):
        return self.get_queryset().drafts()

    def by_author(self, author):
        return self.get_queryset().by_author(author)

class Post(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
    ]
    title = models.CharField(max_length=200)
    content = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    published_date = models.DateTimeField(null=True, blank=True)
    author = models.ForeignKey('User', on_delete=models.CASCADE)

    objects = PostManager()  # Use the custom manager

    def __str__(self):
        return self.title
```

**Usage:**
```python
# Get all published posts
published_posts = Post.objects.published()

# Get all draft posts
draft_posts = Post.objects.drafts()

# Get all posts by a specific author
author_posts = Post.objects.by_author(some_author)
```

---

### **4. Advanced Example: Custom Manager with Related Objects**
You can also use custom managers to prefetch related objects or perform complex queries.

#### **Example: Custom Manager for Posts with Comments**
```python
from django.db import models

class PostWithCommentsManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().prefetch_related('comments')

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()

    objects = models.Manager()  # Default manager
    with_comments = PostWithCommentsManager()  # Custom manager

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()

    def __str__(self):
        return self.text
```

**Usage:**
```python
# Get all posts with prefetched comments
posts_with_comments = Post.with_comments.all()
```

---

### **5. Best Practices**
- **Use Custom Managers for Business Logic**: Encapsulate query logic that is specific to your application's domain.
- **Keep Querysets Chainable**: Design custom querysets so they can be combined with other querysets.
- **Use `as_manager()` for Simplicity**: If you only need a custom queryset, you can use `as_manager()` to create a manager from it.
- **Avoid Overloading the Default Manager**: If you override the default manager, ensure it doesn't break existing code.

---

By using custom managers and querysets, you can make your Django models more expressive and your code more maintainable. This approach also helps you adhere to the DRY (Don’t Repeat Yourself) principle. 🚀