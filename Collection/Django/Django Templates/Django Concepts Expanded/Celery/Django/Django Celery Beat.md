[[Celery Beat VS Django Celery Beat]]

There’s also the [https://pypi.org/project/django-celery-beat/](https://pypi.org/project/django-celery-beat/) extension that stores the schedule in the Django database, and presents a convenient admin interface to manage periodic tasks at runtime.

To install and use this extension:

1. Use **pip** to install the package:
```bash
pip install django-celery-beat
```
    
2. Add the `django_celery_beat` module to `INSTALLED_APPS` in your Django project’ `settings.py`:
```python
    INSTALLED_APPS = (
        ...,
        'django_celery_beat',
    )
```
	Note that there is no dash in the module name, only underscores.
    
3. Apply Django database migrations so that the necessary tables are created:
```bash
    python manage.py migrate
```
    
4. Start the **celery beat** service using the `django_celery_beat.schedulers:DatabaseScheduler` scheduler:
    
```bash
celery -A proj beat -l INFO --scheduler django_celery_beat.schedulers:DatabaseScheduler
```
    
Note: You may also add this as the [`beat_scheduler`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-beat_scheduler) setting directly.
    
1. Visit the Django-Admin interface to set up some periodic tasks, this is , where you can create, edit and delete periodic tasks and how often they should run.



Important warning about time zones
WARNING

If you change the Django [`TIME_ZONE`](http://docs.djangoproject.com/en/dev/ref/settings/#std-setting-TIME_ZONE "(in Django v5.1)") setting your periodic task schedule will still be based on the old timezone.

To fix that you would have to reset the “last run time” for each periodic task:
```python
>>> from django_celery_beat.models import PeriodicTask, PeriodicTasks
>>> PeriodicTask.objects.update(last_run_at=None)
>>> PeriodicTasks.changed()
```
NB - This will reset the state as if the periodic tasks have never run before.

## Models

- [`django_celery_beat.models.PeriodicTask`](https://django-celery-beat.readthedocs.io/en/latest/reference/django-celery-beat.models.html#django_celery_beat.models.PeriodicTask "django_celery_beat.models.PeriodicTask")
    This model defines a single periodic task to be run.
    It must be associated with a schedule, which defines how often the task should run.
    
- [`django_celery_beat.models.IntervalSchedule`](https://django-celery-beat.readthedocs.io/en/latest/reference/django-celery-beat.models.html#django_celery_beat.models.IntervalSchedule "django_celery_beat.models.IntervalSchedule")
    A schedule that runs at a specific interval (e.g. every 5 seconds).
    
- [`django_celery_beat.models.CrontabSchedule`](https://django-celery-beat.readthedocs.io/en/latest/reference/django-celery-beat.models.html#django_celery_beat.models.CrontabSchedule "django_celery_beat.models.CrontabSchedule")
    A schedule with fields like entries in cron: `minute hour day-of-week day_of_month month_of_year`.
    
- [`django_celery_beat.models.PeriodicTasks`](https://django-celery-beat.readthedocs.io/en/latest/reference/django-celery-beat.models.html#django_celery_beat.models.PeriodicTasks "django_celery_beat.models.PeriodicTasks")
    This model is only used as an index to keep track of when the schedule has changed.

Whenever you update a [`PeriodicTask`](https://django-celery-beat.readthedocs.io/en/latest/reference/django-celery-beat.models.html#django_celery_beat.models.PeriodicTask "django_celery_beat.models.PeriodicTask"), a counter in this table is also incremented, which tells the `celery beat` service to reload the schedule from the database.

If you update periodic tasks in bulk, you will need to update the counter manually:

```python
>>> from django_celery_beat.models import PeriodicTasks
>>> PeriodicTasks.changed()
```

## Example Creating interval-based periodic task

To create a periodic task executing at an interval you must first create the interval object:

```python
>>> from django_celery_beat.models import PeriodicTask, IntervalSchedule

# executes every 10 seconds.
>>> schedule, created = IntervalSchedule.objects.get_or_create(
...     every=10,
...     period=IntervalSchedule.SECONDS,
... )
```

That’s all the fields you need: a period type and the frequency.

You can choose between a specific set of periods:
- [`IntervalSchedule.DAYS`](https://django-celery-beat.readthedocs.io/en/latest/reference/django-celery-beat.models.html#django_celery_beat.models.IntervalSchedule.DAYS "django_celery_beat.models.IntervalSchedule.DAYS")
- [`IntervalSchedule.HOURS`](https://django-celery-beat.readthedocs.io/en/latest/reference/django-celery-beat.models.html#django_celery_beat.models.IntervalSchedule.HOURS "django_celery_beat.models.IntervalSchedule.HOURS")
- [`IntervalSchedule.MINUTES`](https://django-celery-beat.readthedocs.io/en/latest/reference/django-celery-beat.models.html#django_celery_beat.models.IntervalSchedule.MINUTES "django_celery_beat.models.IntervalSchedule.MINUTES")
- [`IntervalSchedule.SECONDS`](https://django-celery-beat.readthedocs.io/en/latest/reference/django-celery-beat.models.html#django_celery_beat.models.IntervalSchedule.SECONDS "django_celery_beat.models.IntervalSchedule.SECONDS")
- [`IntervalSchedule.MICROSECONDS`](https://django-celery-beat.readthedocs.io/en/latest/reference/django-celery-beat.models.html#django_celery_beat.models.IntervalSchedule.MICROSECONDS "django_celery_beat.models.IntervalSchedule.MICROSECONDS")

use this to view the choices:
```python
IntervalSchedule.PERIOD_CHOICES
```


NOTE
If you have multiple periodic tasks executing every 10 seconds, then they should all point to the same schedule object. Sample:

```python
# Create or retrieve the 10-second interval schedule
schedule, created = IntervalSchedule.objects.get_or_create(
    every=10,
    period=IntervalSchedule.SECONDS,
)

# Create the first periodic task
task1 = PeriodicTask.objects.create(
    interval=schedule,  # Use the same schedule object
    name="Task 1",
    task="myapp.tasks.task1",
)

# Create the second periodic task
task2 = PeriodicTask.objects.create(
    interval=schedule,  # Use the same schedule object
    name="Task 2",
    task="myapp.tasks.task2",
)
```

Why Reuse the Same Schedule Object?
- **Efficiency**: Creating multiple `IntervalSchedule` objects with the same parameters would waste database space and resources.
- **Consistency**: Using the same schedule object ensures that all tasks with the same interval are synchronized and managed uniformly.
- **Maintainability**: If you need to change the interval later, you only need to update one `IntervalSchedule` object instead of multiple.


Now that we have defined the schedule object, we can create the periodic task entry:

```python
PeriodicTask.objects.create(
...     interval=schedule,                  # we created this above.
...     name='Importing contacts',          # simply describes this periodic task.
...     task='proj.tasks.import_contacts',  # name of task.
... )
```

Note that this is a very basic example, you can also specify the arguments and keyword arguments used to execute the task, the `queue` to send it to, and set an expiry time.

NOTE
Here’s an example specifying the arguments, note how JSON serialization is required:

```python
>>> import json
>>> from datetime import datetime, timedelta

PeriodicTask.objects.create(
...     interval=schedule,                  # we created this above.
...     name='Importing contacts',          # simply describes this periodic task.
...     task='proj.tasks.import_contacts',  # name of task.
...     args=json.dumps(['arg1', 'arg2']),
...     kwargs=json.dumps({
...        'be_careful': True,
...     }),
...     expires=datetime.utcnow() + timedelta(seconds=30)
... )
```

you can also use low-level AMQP routing using the `exchange` and `routing_key` fields.

## Example creating crontab-based periodic task

A crontab schedule has the fields: `minute`, `hour`, `day_of_week`, `day_of_month` and `month_of_year`, so if you want the equivalent of a `30 * * * *` (execute at 30 minutes past the hour every hour) crontab entry you specify:

```python
>>> from django_celery_beat.models import CrontabSchedule, PeriodicTask
>>> schedule, _ = CrontabSchedule.objects.get_or_create(
...     minute='30',
...     hour='*',
...     day_of_week='*',
...     day_of_month='*',
...     month_of_year='*',
... )
```

Then to create a periodic task using this schedule, use the same approach as the interval-based periodic task earlier in this document, but instead of `interval=schedule`, specify `crontab=schedule`:

```python
PeriodicTask.objects.create(
...     crontab=schedule,
...     name='Importing contacts',
...     task='proj.tasks.import_contacts',
... )
```

## Temporarily disable a periodic task

You can use the `enabled` flag to temporarily disable a periodic task:

```python
>>> periodic_task.enabled = False
>>> periodic_task.save()
```

## Example running periodic tasks

Periodic tasks still need ‘workers’ to execute them. So make sure the default **Celery** package is installed.

Both the worker and beat services need to be running at the same time.

1. Start a Celery worker service (specify your Django project name):
```bash
celery -A [project-name] worker --loglevel=info
```

2. As a separate process, start the beat service (specify the Django scheduler):
```bash
celery -A [project-name] beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler
```

**OR** you can use the -S (scheduler flag), for more options see `celery beat --help`):
```bash
celery -A [project-name] beat -l info -S django
```

**OR** you can set the scheduler through Django’s settings:
```bash
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'
```

Also, as an alternative, you can run the two steps above (worker and beat services) with only one command (recommended for **development environment only**):
```bash
celery -A [project-name] worker --beat --scheduler django --loglevel=info
```

3. Now you can add and manage your periodic tasks from the Django Admin interface.


## Working with django-celery-results

Now you can store [`PeriodicTask.name`](https://django-celery-beat.readthedocs.io/en/latest/reference/django-celery-beat.models.html#django_celery_beat.models.PeriodicTask.name "django_celery_beat.models.PeriodicTask.name") to django-celery-results (`TaskResult.periodic_task_name`).

Suppose we have two periodic tasks, their schedules are different, but the tasks are the same.

| name      | task             | args | schedule      |
| --------- | ---------------- | ---- | ------------- |
| schedule1 | some.celery.task | (1,) | every hour    |
| schedule2 | some.celery.task | (2,) | every 2 hours |

Now you can distinguish the source of the task from the results by the `periodic_task_name` field.

| id          | task_name                         | periodic_task_name   |
| ----------- | --------------------------------- | -------------------- |
| uuid1 uuid2 | some.celery.task some.celery.task | schedule1 schedule1  |
| uuid3 uuid4 | some.celery.task some.celery.task |  schedule2 schedule2 |
