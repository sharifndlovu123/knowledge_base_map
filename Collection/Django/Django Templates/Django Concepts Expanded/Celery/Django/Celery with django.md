

NOTE:
- Previous versions of Celery required a separate library to work with Django, but since 3.1 this is no longer the case. Django is supported out of the box now so this document only contains a basic way to integrate Celery and Django. 
- You’ll use the same API as non-Django users so you’re recommended to read the [First Steps with Celery](https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html#first-steps) tutorial first and come back to this tutorial. [[Celery#Using Celery in your Application]]
- Celery 5.3.x supports Django 2.2 LTS or newer versions. Please use Celery 5.2.x for versions older than Django 2.2 or Celery 4.4.x if your Django version is older than 1.11.



To use Celery with your Django project you must first define an instance of the Celery library (called an “app”)


If you have a modern Django project layout like:

```
- proj/
  - manage.py
  - proj/
    - __init__.py
    - settings.py
    - urls.py
```

then the recommended way is to create a new proj/proj/celery.py module that defines the Celery instance:

file: proj/proj/celery.py

```python
import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proj.settings')

app = Celery('proj')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
```

IMPORTANT
Then you need to import this app in your `proj/proj/__init__.py` module. This ensures that the app is loaded when Django starts so that the `@shared_task` decorator (mentioned later) will use it:

`proj/proj/__init__.py`:
```python
# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
from .celery import app as celery_app

__all__ = ('celery_app',)
```

Note that this example project layout is suitable for larger projects

#### BREAKDOWN

Let’s break down what happens in the first module, first, we set the default [`DJANGO_SETTINGS_MODULE`](http://docs.djangoproject.com/en/dev/topics/settings/#envvar-DJANGO_SETTINGS_MODULE "(in Django v5.2)") environment variable for the **celery** command-line program:
```python
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proj.settings')
```

You don’t need this line, but it saves you from always passing in the settings module to the `celery` program. It must always come before creating the app instances, as is what we do next:

```python
app = Celery('proj')
```
This is our instance of the library, you can have many instances but there’s probably no reason for that when using Django.

We also add the Django settings module as a configuration source for Celery. This means that you don’t have to use multiple configuration files, and instead configure Celery directly from the Django settings; but you can also separate them if wanted.

```python
app.config_from_object('django.conf:settings', namespace='CELERY')
```

IMPORTANT

The uppercase name-space means that all [Celery configuration options](https://docs.celeryq.dev/en/stable/userguide/configuration.html#configuration) must be specified in uppercase instead of lowercase, and start with `CELERY_`, so for example the [`task_always_eager`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-task_always_eager) setting becomes `CELERY_TASK_ALWAYS_EAGER`, and the [`broker_url`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-broker_url) setting becomes `CELERY_BROKER_URL`.

This also applies to the workers settings, for instance, the [`worker_concurrency`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-worker_concurrency) setting becomes `CELERY_WORKER_CONCURRENCY`.

For example, a Django project’s configuration:
settings.py
```python
# Celery Configuration Options
CELERY_TIMEZONE = "Australia/Tasmania"
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60
```
 The `CELERY_` namespace is also optional, but recommended (to prevent overlap with other Django settings).

common practice for reusable apps is to define all tasks in a separate `tasks.py` module, and Celery does have a way to auto-discover these modules:
```python
app.autodiscover_tasks()
```

With the line above Celery will automatically discover tasks from all of your installed apps, following the `tasks.py` convention:
```
- app1/
    - tasks.py
    - models.py
- app2/
    - tasks.py
    - models.py
```


@shared_task decorator
The tasks you write will probably live in reusable apps, and reusable apps cannot depend on the project itself, so you also cannot import your app instance directly.

The `@shared_task` decorator lets you create tasks without having any concrete app instance:

`demoapp/tasks.py`:
```python
# Create your tasks here

from demoapp.models import Widget

from celery import shared_task

@shared_task
def add(x, y):
    return x + y

@shared_task
def mul(x, y):
    return x * y

@shared_task
def xsum(numbers):
    return sum(numbers)

@shared_task
def count_widgets():
    return Widget.objects.count()

@shared_task
def rename_widget(widget_id, name):
    w = Widget.objects.get(id=widget_id)
    w.name = name
w.save()
```

SAMPLES : https://github.com/celery/celery/tree/main/examples/django/

AVOID This Mistake

## Trigger tasks at the end of the DB transaction

common pitfall with Django is triggering a task immediately and not wait until the end of the database transaction, which means that the Celery task may run before all changes are persisted to the database. For example:

VERY BAD

```python
# views.py
def create_user(request):
    # Note: simplified example, use a form to validate input
    user = User.objects.create(username=request.POST['username'])
    send_email.delay(user.pk)
    return HttpResponse('User created')

# task.py
@shared_task
def send_email(user_pk):
    user = User.objects.get(pk=user_pk)
    # send email ...
```

In this case, the `send_email` task could start before the view has committed the transaction to the database, and therefore the task may not be able to find the user.

A common solution is to use Django’s [on_commit](https://docs.djangoproject.com/en/stable/topics/db/transactions/#django.db.transaction.on_commit) hook to trigger the task after the transaction has been committed:
```python
- send_email.delay(user.pk)
+ transaction.on_commit(lambda: send_email.delay(user.pk))
```

Since this is such a common pattern, Celery 5.4 introduced a handy shortcut for this, using a [`DjangoTask`](https://docs.celeryq.dev/en/stable/reference/celery.contrib.django.task.html#celery.contrib.django.task.DjangoTask "celery.contrib.django.task.DjangoTask"). Instead of calling [`delay()`](https://docs.celeryq.dev/en/stable/reference/celery.app.task.html#celery.app.task.Task.delay "celery.app.task.Task.delay"), you should call [`delay_on_commit()`](https://docs.celeryq.dev/en/stable/reference/celery.contrib.django.task.html#celery.contrib.django.task.DjangoTask.delay_on_commit "celery.contrib.django.task.DjangoTask.delay_on_commit"):

```python
- send_email.delay(user.pk)
+ send_email.delay_on_commit(user.pk)
```

This task class should be used automatically if you’ve follow the setup steps above. However, if your app [uses a custom task base class](https://docs.celeryq.dev/en/stable/userguide/tasks.html#task-custom-classes), you’ll need inherit from [`DjangoTask`](https://docs.celeryq.dev/en/stable/reference/celery.contrib.django.task.html#celery.contrib.django.task.DjangoTask "celery.contrib.django.task.DjangoTask") instead of [`Task`](https://docs.celeryq.dev/en/stable/reference/celery.app.task.html#celery.app.task.Task "celery.app.task.Task") to get this behaviour.


DEEPSEEK EXAMPLE

Certainly! Below is an example of how you can use Django's `on_commit` hook and Celery's `delay_on_commit` method to trigger a task after a transaction has been committed.

### Example Scenario:
Let's assume you have a Django model `User` and you want to send an email to a user after they have been successfully created in the database.

### Step 1: Define the Celery Task
First, define a Celery task that sends an email.

```python
# tasks.py
from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_email(user_id):
    from .models import User  # Import the User model locally to avoid circular imports
    user = User.objects.get(pk=user_id)
    subject = 'Welcome to Our Site'
    message = f'Hello {user.username}, thank you for registering on our site.'
    send_mail(subject, message, 'from@example.com', [user.email])
```

### Step 2: Use `on_commit` Hook
Now, in your view or wherever you are creating the user, use Django's `on_commit` hook to trigger the task after the transaction is committed.

```python
# views.py
from django.db import transaction
from .models import User
from .tasks import send_email

def create_user(request):
    # Assuming you have a form or some logic to create a user
    username = request.POST['username']
    email = request.POST['email']
    
    with transaction.atomic():
        user = User.objects.create(username=username, email=email)
        
        # Use on_commit to ensure the task is triggered after the transaction is committed
        transaction.on_commit(lambda: send_email.delay(user.pk))
    
    return HttpResponse("User created successfully!")
```

### Step 3: Use `delay_on_commit` (Celery 5.4+)
If you are using Celery 5.4 or later, you can simplify the code by using `delay_on_commit` instead of manually wrapping the task in `on_commit`.

```python
# views.py
from django.db import transaction
from .models import User
from .tasks import send_email

def create_user(request):
    # Assuming you have a form or some logic to create a user
    username = request.POST['username']
    email = request.POST['email']
    
    with transaction.atomic():
        user = User.objects.create(username=username, email=email)
        
        # Use delay_on_commit to trigger the task after the transaction is committed
        send_email.delay_on_commit(user.pk)
    
    return HttpResponse("User created successfully!")
```

### Explanation:
- **`transaction.on_commit(lambda: send_email.delay(user.pk))`**: This ensures that the `send_email` task is only triggered after the database transaction is successfully committed. If the transaction fails, the task will not be triggered.
  
- **`send_email.delay_on_commit(user.pk)`**: This is a shortcut introduced in Celery 5.4 that internally uses Django's `on_commit` hook. It simplifies the code and makes it more readable.

### When to Use `delay()`:
If you want to trigger the task immediately without waiting for the transaction to commit, you can still use the traditional `delay()` method:

```python
send_email.delay(user.pk)
```

However, this should be used with caution, as it might lead to inconsistencies if the task is executed before the transaction is committed.

### Conclusion:
Using `delay_on_commit` or `on_commit` with Celery tasks in Django ensures that your tasks are only executed after the database transaction is successfully committed, preventing potential issues with task execution before the data is actually saved.


## Extensions

### django-celery-results. 
Using the Django ORM/Cache as a result backend

This extension provides result backends using either the Django ORM, or the Django Cache framework.

Intsall
```bash
 pip install django-celery-results
```

import
```python
INSTALLED_APPS = (
    ...,
    'django_celery_results',
)
```
Note that there is no dash in the module name, only underscores.

Configure Celery to use the [https://pypi.org/project/django-celery-results/](https://pypi.org/project/django-celery-results/) backend.

Assuming you are using Django’s `settings.py` to also configure Celery, add the following settings:

```python
CELERY_RESULT_BACKEND = 'django-db'
```

For the cache backend you can use:

```python
CELERY_CACHE_BACKEND = 'django-cache'
```

We can also use the cache defined in the CACHES setting in django.

```python
# celery setting.
CELERY_CACHE_BACKEND = 'default'

# django setting.
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.db.DatabaseCache',
        'LOCATION': 'my_cache_table',
    }
}
```


### `django-celery-beat`
 Database-backed Periodic Tasks with Admin interface
### [[Celery Beat VS Django Celery Beat]]
