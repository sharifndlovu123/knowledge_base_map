[[Celery Beat VS Django Celery Beat]]

## Periodic Tasks
**celery beat** is a scheduler; It kicks off tasks at regular intervals, that are then executed by available worker nodes in the cluster.

By default the entries are taken from the [`beat_schedule`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-beat_schedule) setting, but custom stores can also be used, like storing the entries in a SQL database.

Ensure only a single scheduler is running for a schedule at a time, otherwise you’d end up with duplicate tasks. Using a centralized approach means the schedule doesn’t have to be synchronized, and the service can operate without using locks.

## Time Zones

Periodic task schedules uses the UTC time zone by default, but you can change the time zone used using the [`timezone`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-timezone) setting

ie:
```python
timezone = 'Europe/London'
```

This setting must be added to your app, either by configuring it directly using (`app.conf.timezone = 'Europe/London'`), or by adding it to your configuration module if you have set one up using `app.config_from_object` (celery config module).

NOTE

The default scheduler (storing the schedule in the `celerybeat-schedule` file) will automatically detect that the time zone has changed, and so will reset the schedule itself, but other schedulers may not be so smart (e.g., the Django database scheduler, see below) and in that case you’ll have to reset the schedule manually.

#### Django scheduler issue:

Celery recommends and is compatible with the `USE_TZ` setting introduced in Django 1.4.

For Django users the time zone specified in the `TIME_ZONE` setting will be used, or you can specify a custom time zone for Celery alone by using the [`timezone`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-timezone) setting.

The database scheduler won’t reset when timezone related settings change, so you must do this manually:

Django-Celery only supports Celery 4.0 and below
```python
python manage.py shell
>>> from djcelery.models import PeriodicTask
>>> PeriodicTask.objects.update(last_run_at=None)
```

for Celery 4.0 and above, do as follow:

```python
python manage.py shell
>>> from django_celery_beat.models import PeriodicTask
>>> PeriodicTask.objects.update(last_run_at=None)
```

## Entries
Calling the tasks

task.py
To call a task periodically you have to add an entry to the beat schedule list.
```python
from celery import Celery
from celery.schedules import crontab

app = Celery()

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    # Calls test('hello') every 10 seconds.
    sender.add_periodic_task(10.0, test.s('hello'), name='add every 10')

    # Calls test('hello') every 30 seconds.
    # It uses the same signature of previous task, an explicit name is
    # defined to avoid this task replacing the previous one defined.
    sender.add_periodic_task(30.0, test.s('hello'), name='add every 30')

    # Calls test('world') every 30 seconds
    sender.add_periodic_task(30.0, test.s('world'), expires=10)

    # Executes every Monday morning at 7:30 a.m.
    sender.add_periodic_task(
        crontab(hour=7, minute=30, day_of_week=1),
        test.s('Happy Mondays!'),
    )

@app.task
def test(arg):
    print(arg)

@app.task
def add(x, y):
    z = x + y
    print(z)
```

Setting these up from within the [`on_after_configure`](https://docs.celeryq.dev/en/stable/reference/celery.html#celery.Celery.on_after_configure "celery.Celery.on_after_configure") handler means that we’ll not evaluate the app at module level when using `test.s()`. 

Note that [`on_after_configure`](https://docs.celeryq.dev/en/stable/reference/celery.html#celery.Celery.on_after_configure "celery.Celery.on_after_configure") is sent after the app is set up, so tasks outside the module where the app is declared (e.g. in a tasks.py file located by [`celery.Celery.autodiscover_tasks()`](https://docs.celeryq.dev/en/stable/reference/celery.html#celery.Celery.autodiscover_tasks "celery.Celery.autodiscover_tasks")) must use a later signal, such as [`on_after_finalize`](https://docs.celeryq.dev/en/stable/reference/celery.html#celery.Celery.on_after_finalize "celery.Celery.on_after_finalize").

The [`add_periodic_task()`](https://docs.celeryq.dev/en/stable/reference/celery.html#celery.Celery.add_periodic_task "celery.Celery.add_periodic_task") function will add the entry to the [`beat_schedule`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-beat_schedule) setting behind the scenes, and the same setting can also be used to set up periodic tasks manually:

Example: Run the tasks.add task every 30 seconds.

celery.py :
```python
app.conf.beat_schedule = {
    'add-every-30-seconds': {
        'task': 'tasks.add',
        'schedule': 30.0,
        'args': (16, 16)
    },
}
app.conf.timezone = 'UTC'
```

if the usage is celery_config.py :
```python
beat_schedule = {
    'add-every-30-seconds': {
        'task': 'tasks.add',
        'schedule': 30.0,
        'args': (16, 16)
    },
}
timezone = 'UTC'
```

Using a [`timedelta`](https://docs.python.org/dev/library/datetime.html#datetime.timedelta "(in Python v3.14)") for the schedule means the task will be sent in 30 second intervals (the first task will be sent 30 seconds after celery beat starts, and then every 30 seconds after the last run).

Field Values

- task
    > The name of the task to execute.
    > 
    > Task names are described in the [Names](https://docs.celeryq.dev/en/stable/userguide/tasks.html#task-names) section of the User Guide. Note that this is not the import path of the task, even though the default naming pattern is built like it is.
    
- schedule
    > The frequency of execution.
    > 
    > This can be the number of seconds as an integer, a [`timedelta`](https://docs.python.org/dev/library/datetime.html#datetime.timedelta "(in Python v3.14)"), or a [`crontab`](https://docs.celeryq.dev/en/stable/reference/celery.schedules.html#celery.schedules.crontab "celery.schedules.crontab"). You can also define your own custom schedule types, by extending the interface of [`schedule`](https://docs.celeryq.dev/en/stable/reference/celery.schedules.html#celery.schedules.schedule "celery.schedules.schedule").
    
- args
    > Positional arguments ([`list`](https://docs.python.org/dev/library/stdtypes.html#list "(in Python v3.14)") or [`tuple`](https://docs.python.org/dev/library/stdtypes.html#tuple "(in Python v3.14)")).
    
- kwargs
    > Keyword arguments ([`dict`](https://docs.python.org/dev/library/stdtypes.html#dict "(in Python v3.14)")).
    
- options
    > Execution options ([`dict`](https://docs.python.org/dev/library/stdtypes.html#dict "(in Python v3.14)")).
    > 
    > This can be any argument supported by [`apply_async()`](https://docs.celeryq.dev/en/stable/reference/celery.app.task.html#celery.app.task.Task.apply_async "celery.app.task.Task.apply_async") – exchange, routing_key, expires, and so on.
    
- relative
    > If relative is true [`timedelta`](https://docs.python.org/dev/library/datetime.html#datetime.timedelta "(in Python v3.14)") schedules are scheduled “by the clock.” This means the frequency is rounded to the nearest second, minute, hour or day depending on the period of the [`timedelta`](https://docs.python.org/dev/library/datetime.html#datetime.timedelta "(in Python v3.14)").
    > 
    > By default relative is false, the frequency isn’t rounded and will be relative to the time when **celery beat** was started.



## Crontab Schedules
A Crontab like schedule also exists, see the section on [Crontab schedules](https://docs.celeryq.dev/en/stable/userguide/periodic-tasks.html#crontab-schedules).

If you want more control over when the task is executed, for example, a particular time of day or day of the week, you can use the [`crontab`](https://docs.celeryq.dev/en/stable/reference/celery.schedules.html#celery.schedules.crontab "celery.schedules.crontab") schedule type:

```python
from celery.schedules import crontab

app.conf.beat_schedule = {
    # Executes every Monday morning at 7:30 a.m.
    'add-every-monday-morning': {
        'task': 'tasks.add',
        'schedule': crontab(hour=7, minute=30, day_of_week=1),
        'args': (16, 16),
    },
}
```

Like with **cron**, the tasks may overlap if the first task doesn’t complete before the next. If that’s a concern you should use a locking strategy to ensure only one instance can run at a time (see for example [Ensuring a task is only executed one at a time](https://docs.celeryq.dev/en/stable/tutorials/task-cookbook.html#cookbook-task-serial)). makes use of cache.

Here’s a neatly formatted table for your `crontab` examples:
more [crontab expressions](https://docs.celeryq.dev/en/stable/reference/celery.schedules.html#celery.schedules.crontab)

|**Crontab Expression**|**Meaning**|
|---|---|
|`crontab()`|Execute every minute.|
|`crontab(minute=0, hour=0)`|Execute daily at midnight.|
|`crontab(minute=0, hour='*/3')`|Execute every three hours: midnight, 3 AM, 6 AM, 9 AM, noon, 3 PM, 6 PM, 9 PM.|
|`crontab(minute=0, hour='0,3,6,9,12,15,18,21')`|Same as previous.|
|`crontab(minute='*/15')`|Execute every 15 minutes.|
|`crontab(day_of_week='sunday')`|Execute every minute (!) on Sundays.|
|`crontab(minute='*', hour='*', day_of_week='sun')`|Same as previous.|
|`crontab(minute='*/10', hour='3,17,22', day_of_week='thu,fri')`|Execute every 10 minutes, but only between 3-4 AM, 5-6 PM, and 10-11 PM on Thursdays or Fridays.|
|`crontab(minute=0, hour='*/2,*/3')`|Execute every even hour and every hour divisible by three (except 1 AM, 5 AM, 7 AM, 11 AM, 1 PM, 5 PM, 7 PM, 11 PM).|
|`crontab(minute=0, hour='*/5')`|Execute every hour divisible by 5. Runs at 3 PM but not 5 PM (since 3 PM = 15 in 24-hour format, which is divisible by 5).|
|`crontab(minute=0, hour='*/3,8-17')`|Execute every hour divisible by 3 and every hour during office hours (8 AM - 5 PM).|
|`crontab(0, 0, day_of_month='2')`|Execute on the second day of every month.|
|`crontab(0, 0, day_of_month='2-30/2')`|Execute on every even-numbered day.|
|`crontab(0, 0, day_of_month='1-7,15-21')`|Execute on the first and third weeks of the month.|
|`crontab(0, 0, day_of_month='11', month_of_year='5')`|Execute on the eleventh of May every year.|
|`crontab(0, 0, month_of_year='*/3')`|Execute every day on the first month of every quarter.|

## Solar Schedules

a task that should be executed according to sunrise, sunset, dawn or dusk, you can use the [`solar`](https://docs.celeryq.dev/en/stable/reference/celery.schedules.html#celery.schedules.solar "celery.schedules.solar") schedule type:
```python
from celery.schedules import solar

app.conf.beat_schedule = {
    # Executes at sunset in Melbourne
    'add-at-melbourne-sunset': {
        'task': 'tasks.add',
        'schedule': solar('sunset', -37.81753, 144.96715),
        'args': (16, 16),
    },
}
```
Solar values = solar(event, latitude, longitude)

Be sure to use the correct sign for latitude and longitude:

| **Sign** | **Argument** | **Meaning** |
| -------- | ------------ | ----------- |
| `+`      | `latitude`   | North       |
| `-`      | `latitude`   | South       |
| `+`      | `longitude`  | East        |
| `-`      | `longitude`  | West        |
Possible event types are:

|                     |                                                                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Event**           | **Meaning**                                                                                                                                                                 |
| `dawn_astronomical` | Execute at the moment after which the sky is no longer completely dark. This is when the sun is 18 degrees below the horizon.                                               |
| `dawn_nautical`     | Execute when there’s enough sunlight for the horizon and some objects to be distinguishable; formally, when the sun is 12 degrees below the horizon.                        |
| `dawn_civil`        | Execute when there’s enough light for objects to be distinguishable so that outdoor activities can commence; formally, when the Sun is 6 degrees below the horizon.         |
| `sunrise`           | Execute when the upper edge of the sun appears over the eastern horizon in the morning.                                                                                     |
| `solar_noon`        | Execute when the sun is highest above the horizon on that day.                                                                                                              |
| `sunset`            | Execute when the trailing edge of the sun disappears over the western horizon in the evening.                                                                               |
| `dusk_civil`        | Execute at the end of civil twilight, when objects are still distinguishable and some stars and planets are visible. Formally, when the sun is 6 degrees below the horizon. |
| `dusk_nautical`     | Execute when the sun is 12 degrees below the horizon. Objects are no longer distinguishable, and the horizon is no longer visible to the naked eye.                         |
| `dusk_astronomical` | Execute at the moment after which the sky becomes completely dark; formally, when the sun is 18 degrees below the horizon.                                                  |
NB
All solar events are calculated using UTC, and are therefore unaffected by your time zone setting.

Deep dive on solar; see [`celery.schedules.solar`](https://docs.celeryq.dev/en/stable/reference/celery.schedules.html#celery.schedules.solar "celery.schedules.solar") for more documentation.


## Starting the Scheduler

To start the **celery beat** service:
```bash
celery -A proj beat
```

You can also embed beat inside the worker by enabling the workers [`-B`](https://docs.celeryq.dev/en/stable/reference/cli.html#cmdoption-celery-worker-B) option, this is convenient if you’ll never run more than one worker node, but it’s not commonly used and for that reason isn’t recommended for production use:

```bash
celery -A proj worker -B
```

Beat needs to store the last run times of the tasks in a local database file (named celerybeat-schedule by default), so it needs access to write in the current directory, or alternatively you can specify a custom location for this file:

```bash
celery -A proj beat -s /home/celery/var/run/celerybeat-schedule
```


## Using a custom Schedular Class

Custom scheduler classes can be specified on the command-line (the [`--scheduler`](https://docs.celeryq.dev/en/stable/reference/cli.html#cmdoption-celery-beat-S) argument).

The default scheduler is the [`celery.beat.PersistentScheduler`](https://docs.celeryq.dev/en/stable/reference/celery.beat.html#celery.beat.PersistentScheduler "celery.beat.PersistentScheduler"), that simply keeps track of the last run times in a local [`shelve`](https://docs.python.org/dev/library/shelve.html#module-shelve "(in Python v3.14)") database file.

There’s also the [https://pypi.org/project/django-celery-beat/](https://pypi.org/project/django-celery-beat/) extension that stores the schedule in the Django database, and presents a convenient admin interface to manage periodic tasks at runtime.
[[Django Celery Beat]]