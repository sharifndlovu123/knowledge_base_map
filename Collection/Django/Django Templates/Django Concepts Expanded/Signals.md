### 🚀 **List of Built-in Django Signals**

Django provides several built-in signals that allow you to execute custom logic when specific events occur. Here’s a list of commonly used signals:

---

## **📌 Model Signals**

These signals are triggered during various stages of model operations.

|Signal|Description|
|---|---|
|`pre_save`|Triggered **before** a model instance is saved.|
|`post_save`|Triggered **after** a model instance is saved.|
|`pre_delete`|Triggered **before** a model instance is deleted.|
|`post_delete`|Triggered **after** a model instance is deleted.|
|`pre_migrate`|Triggered **before** database migrations are applied.|
|`post_migrate`|Triggered **after** database migrations are applied.|
|`m2m_changed`|Triggered when a Many-to-Many field is modified.|
|`post_init`|Triggered after a model instance is loaded from the database.|

---

## **📌 Request/Response Signals**

These signals are related to HTTP request/response lifecycle.

|Signal|Description|
|---|---|
|`request_started`|Triggered when Django starts processing an HTTP request.|
|`request_finished`|Triggered when Django finishes processing an HTTP request.|
|`got_request_exception`|Triggered when an exception occurs while processing a request.|

---

## **📌 Management Signals**

These signals are related to Django’s command-line management system.

|Signal|Description|
|---|---|
|`pre_migrate`|Triggered before migrations are run.|
|`post_migrate`|Triggered after migrations are run.|

---

## **📌 Database Signals**

These signals are triggered during database interactions.

|Signal|Description|
|---|---|
|`connection_created`|Triggered when a new database connection is established.|

---

## **📌 Authentication Signals**

These signals are triggered during user authentication and session management.

|Signal|Description|
|---|---|
|`user_logged_in`|Triggered when a user logs in.|
|`user_logged_out`|Triggered when a user logs out.|
|`user_login_failed`|Triggered when a login attempt fails.|

---

## **📌 Testing Signals**

These signals are useful for testing.

|Signal|Description|
|---|---|
|`setting_changed`|Triggered when a Django setting is changed.|
|`template_rendered`|Triggered when a template is rendered.|

---

## **📌 Custom Signals**

You can also define your **own signals** using `Signal` from `django.dispatch`:

```python
from django.dispatch import Signal

order_placed = Signal(providing_args=["order", "user"])
```

Then, you can trigger it with:

```python
order_placed.send(sender=None, order=order_instance, user=user_instance)
```


Here are some common Django signal examples to help you understand how they work:

### 1. **Post-Save Signal for Creating a Profile Automatically**

When a new user is created, we want to create a corresponding user profile automatically.

```python
# signals.py
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.userprofile.save()
```

Make sure to import the signals in your app’s `apps.py`:

```python
# apps.py
from django.apps import AppConfig

class MyAppConfig(AppConfig):
    name = 'myapp'

    def ready(self):
        import myapp.signals
```

---

### 2. **Pre-Delete Signal for Cleaning Up Related Data**

When deleting a `BlogPost`, we want to delete all related `Comments`.

```python
# signals.py
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import BlogPost, Comment

@receiver(pre_delete, sender=BlogPost)
def delete_related_comments(sender, instance, **kwargs):
    instance.comments.all().delete()  # Assuming a related_name='comments'
```

---

### 3. **Post-Init Signal for Tracking Model Changes**

Track the initial state of a model when it's loaded from the database.

```python
# signals.py
from django.db.models.signals import post_init
from django.dispatch import receiver
from .models import Product

@receiver(post_init, sender=Product)
def track_initial_price(sender, instance, **kwargs):
    instance._initial_price = instance.price
```

Later, you can compare `instance.price` with `instance._initial_price` to detect changes.

---

### 4. **Custom Signal Example**

You can create and trigger custom signals.

```python
# signals.py
from django.dispatch import Signal, receiver

# Define the custom signal
order_placed = Signal(providing_args=["order", "user"])

@receiver(order_placed)
def handle_order_placed(sender, **kwargs):
    order = kwargs.get('order')
    user = kwargs.get('user')
    print(f"Order {order.id} placed by {user.username}")

# Trigger the custom signal
order_placed.send(sender=None, order=order_instance, user=user_instance)
```

---

### 5. **Post-Save Signal with Logging**

Log changes when a model is updated.

```python
# signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Product
import logging

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Product)
def log_product_update(sender, instance, created, **kwargs):
    if created:
        logger.info(f"New product added: {instance.name}")
    else:
        logger.info(f"Product updated: {instance.name}")
```

---

Let me know if you'd like more specific examples or explanations on any of these! 🚀