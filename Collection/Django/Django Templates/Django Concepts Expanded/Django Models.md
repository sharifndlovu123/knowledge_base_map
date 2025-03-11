
 Includes all types of model fields.
```python
from django.db import models
import uuid

# Abstract Base Model
class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True  # Abstract Base Class
        ordering = ['-created_at']  # Default ordering
        get_latest_by = 'created_at'

# Abstract Person Model
class Person(TimestampedModel):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)

    class Meta:
        abstract = True
        verbose_name = "Person"
        verbose_name_plural = "People"

# Instructor Model (Inherits from Person)
class Instructor(Person):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    bio = models.TextField(blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='instructors/', blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'instructor_data'  # Custom table name
        unique_together = ('first_name', 'last_name')  # Composite uniqueness constraint

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

# Course Category Model
class CourseCategory(TimestampedModel):
    name = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    slug = models.SlugField(unique=True)

    class Meta:
        indexes = [  # Database Index
            models.Index(fields=['slug']),
        ]
        verbose_name_plural = "Course Categories"

    def __str__(self):
        return self.name

# Course Model
class Course(TimestampedModel):
    title = models.CharField(max_length=100)
    description = models.TextField()
    instructor = models.ForeignKey(Instructor, on_delete=models.CASCADE, related_name='courses')
    category = models.ForeignKey(CourseCategory, on_delete=models.SET_NULL, null=True, blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    duration_hours = models.FloatField()
    start_date = models.DateField()
    end_date = models.DateField()
    is_published = models.BooleanField(default=False)
    syllabus = models.JSONField(blank=True, null=True)
    materials = models.FileField(upload_to='courses/materials/', blank=True, null=True)

    class Meta:
        permissions = [  # Custom Permissions
            ("can_publish", "Can publish courses"),
        ]
        constraints = [  # Check Constraint
            models.CheckConstraint(check=models.Q(price__gte=0), name='price_non_negative'),
        ]

    def __str__(self):
        return self.title

# Student Profile Model
class StudentProfile(TimestampedModel):
    bio = models.TextField(blank=True, null=True)
    enrollment_date = models.DateTimeField(auto_now_add=True)
    preferred_study_time = models.TimeField(blank=True, null=True)

# Student Model (Multi-table Inheritance)
class Student(Person):
    age = models.PositiveIntegerField()
    grade_level = models.SmallIntegerField(default=1)
    enrolled_courses = models.ManyToManyField(Course, related_name='students')
    profile = models.OneToOneField(StudentProfile, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        ordering = ['last_name', 'first_name']
        default_related_name = 'students'

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

```

## One to One Related User

```python
from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True)

    def __str__(self):
        return f'{self.user.username} Profile'

```

## Abstract User 
[[Polymorphic (Abstracting)]]

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)
    is_premium_member = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ['username']

    def __str__(self):
        return self.username

```

Requires Settings seup
```python
AUTH_USER_MODEL = 'yourapp.CustomUser'
```

## Django Managers
[[Custom Django Managers and Querysets]]