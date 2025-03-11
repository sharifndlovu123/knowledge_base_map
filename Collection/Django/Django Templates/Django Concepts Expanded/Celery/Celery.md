
[[celery-tips]]
## Choosing a Broker

Celery requires a solution to send and receive messages; usually this comes in the form of a separate service called a _message broker_.

There are several choices available, including:

### RabbitMQ
[RabbitMQ](http://www.rabbitmq.com/) is feature-complete, stable, durable and easy to install. It’s an excellent choice for a production environment

If you’re using Ubuntu or Debian install RabbitMQ by executing this command:

```bash
sudo apt-get install rabbitmq-server
```
$ 

Or, if you want to run it on Docker execute this:
```bash
docker run -d -p 5672:5672 rabbitmq
```


### Redis 
[Redis](https://redis.io/) is also feature-complete, but is more susceptible to data loss in the event of abrupt termination or power failures. Detailed information about using Redis:

[Using Redis](https://docs.celeryq.dev/en/stable/getting-started/backends-and-brokers/redis.html#broker-redis)

If you want to run it on Docker execute this:
```bash
docker run -d -p 6379:6379 redis
```

### Installing Celery

```bash
pip install celery
```


## Application
The first thing you need is a Celery instance. We call this the _Celery application_ or just _app_ for short.

this instance is used as the entry-point for everything you want to do in Celery, like creating tasks and managing workers, it must be possible for other modules to import it.

In this tutorial we keep everything contained in a single module, but for larger projects you want to create a [dedicated module](https://docs.celeryq.dev/en/stable/getting-started/next-steps.html#project-layout).

Simple tasky.py
```python
from celery import Celery

app = Celery('tasks', broker='pyamqp://guest@localhost//')

@app.task
def add(x, y):
    return x + y
```

The first argument to `Celery` is the name of the current module. This is only needed so that names can be automatically generated when the tasks are defined in the __main__ module.

The second argument is the broker keyword argument, specifying the URL of the message broker you want to use. Here we are using RabbitMQ (also the default option).

run simple worker

```bash
celery -A tasks worker --loglevel=INFO
```

help command

```bash
celery worker --help
```

## Calling the task
To call our task you can use the [`delay()`](https://docs.celeryq.dev/en/stable/reference/celery.app.task.html#celery.app.task.Task.delay "celery.app.task.Task.delay") method.
This is a handy shortcut to the [`apply_async()`](https://docs.celeryq.dev/en/stable/reference/celery.app.task.html#celery.app.task.Task.apply_async "celery.app.task.Task.apply_async") method that gives greater control of the task execution

```python
from tasks import add
add.delay(4, 4)
```


## Results

Calling a task returns an [`AsyncResult`](https://docs.celeryq.dev/en/stable/reference/celery.result.html#celery.result.AsyncResult "celery.result.AsyncResult") instance. This can be used to check the state of the task, wait for the task to finish, or get its return value (or if the task failed, to get the exception and traceback).

Results are not enabled by default. In order to do remote procedure calls or keep track of task results in a database.

If you want to keep track of the tasks’ states, Celery needs to store or send the states somewhere. There are several built-in result backends to choose from: [SQLAlchemy](http://www.sqlalchemy.org/)/[Django](http://djangoproject.com/) ORM, [MongoDB](http://www.mongodb.org/), [Memcached](http://memcached.org/), [Redis](https://redis.io/), [RPC](https://docs.celeryq.dev/en/stable/userguide/configuration.html#conf-rpc-result-backend) ([RabbitMQ](http://www.rabbitmq.com/)/AMQP), and – or you can define your own.

For this example we use the rpc result backend, that sends states back as transient messages. The backend is specified via the `backend` argument to [`Celery`](https://docs.celeryq.dev/en/stable/reference/celery.html#celery.Celery "celery.Celery"), (or via the [`result_backend`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-result_backend)

Setting the backend
```python
app = Celery('tasks', backend='rpc://', broker='pyamqp://')
```

redis backend, mq as broker
```python
app = Celery('tasks', backend='redis://localhost', broker='pyamqp://')
```

The [`ready()`](https://docs.celeryq.dev/en/stable/reference/celery.result.html#celery.result.AsyncResult.ready "celery.result.AsyncResult.ready") method returns whether the task has finished processing or not:
```python
result.get(timeout=1)
```

TIP
In case the task raised an exception, [`get()`](https://docs.celeryq.dev/en/stable/reference/celery.result.html#celery.result.AsyncResult.get "celery.result.AsyncResult.get") will re-raise the exception, but you can override this by specifying the `propagate` argument:
```python
result.get(propagate=False)

# use to gain access to the original traceback
result.traceback
```

## Configuration

The default configuration should be good enough for most use cases, but there are many options that can be configured to make Celery work exactly as needed. Reading about the options available is a good idea to familiarize yourself with what can be configured. You can read about the options in the [Configuration and defaults](https://docs.celeryq.dev/en/stable/userguide/configuration.html#configuration) reference.

The configuration can be set on the app directly or by using a dedicated configuration module. As an example you can configure the default serializer used for serializing task payloads by changing the [`task_serializer`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-task_serializer) setting:

```python
app.conf.task_serializer = 'json'
```

configuring many settings at once
```python
app.conf.update(
    task_serializer='json',
    accept_content=['json'],  # Ignore other content
    result_serializer='json',
    timezone='Europe/Oslo',
    enable_utc=True,
)
```

For larger projects, a dedicated configuration module is recommended. Hard coding periodic task intervals and task routing options is discouraged. It is much better to keep these in a centralized location.

A centralized configuration will also allow your SysAdmin to make simple changes in the event of system trouble.

You can tell your Celery instance to use a configuration module by calling the [`app.config_from_object()`](https://docs.celeryq.dev/en/stable/reference/celery.html#celery.Celery.config_from_object "celery.Celery.config_from_object") method:
```python
app.config_from_object('celeryconfig')
```

In the above case, a module named `celeryconfig.py` must be available to load from the current directory or on the Python path. It could look something like this:

`celeryconfig.py`:
```python
broker_url = 'pyamqp://'
result_backend = 'rpc://'

task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']
timezone = 'Europe/Oslo'
enable_utc = True
```

verify that your configuration file works properly and doesn’t contain any syntax errors, you can try to import it:
```python
python -m celeryconfig
```

For a complete reference of configuration options, see [Configuration and defaults](https://docs.celeryq.dev/en/stable/userguide/configuration.html#configuration).


 this is how you’d route a misbehaving task to a dedicated queue:
celeryconfig.py
```python
task_routes = {
    'tasks.add': 'low-priority',
}
```

Or instead of routing it you could rate limit the task instead, so that only 10 tasks of this type can be processed in a minute (10/m):

```python
task_annotations = {
    'tasks.add': {'rate_limit': '10/m'}
}
```


# Using Celery in your Application

View Django In Celery [[Celery with django]]

Project layout
```
src/
    proj/__init__.py
        /celery.py
        /tasks.py
```

proj/celery.py
```python
from celery import Celery

app = Celery('proj',
             broker='amqp://',
             backend='rpc://',
             include=['proj.tasks'])

# Optional configuration, see the application user guide.
app.conf.update(
    result_expires=3600,
)

if __name__ == '__main__':
    app.start()
```

NB
In this module you created our [`Celery`](https://docs.celeryq.dev/en/stable/reference/celery.html#celery.Celery "celery.Celery") instance (sometimes referred to as the _app_). To use Celery within your project you simply import this instance.


 You may want to use a different backend for your application. They all have different strengths and weaknesses. If you don’t need results, it’s better to disable them. Results can also be disabled for individual tasks by setting the `@task(ignore_result=True)` option.
 
proj/tasky.py
```python
from .celery import app

@app.task
def add(x, y):
    return x + y

@app.task
def mul(x, y):
    return x * y

@app.task
def xsum(numbers):
    return sum(numbers)
```

## Starting the worker [[Celery-Workers]]

```bash
celery -A proj worker -l INFO
```

Expected Output on start

```bash
--------------- celery@halcyon.local v4.0 (latentcall)
--- ***** -----
-- ******* ---- [Configuration]
- *** --- * --- . broker:      amqp://guest@localhost:5672//
- ** ---------- . app:         __main__:0x1012d8590
- ** ---------- . concurrency: 8 (processes)
- ** ---------- . events:      OFF (enable -E to monitor this worker)
- ** ----------
- *** --- * --- [Queues]
-- ******* ---- . celery:      exchange:celery(direct) binding:celery
--- ***** -----

[2012-06-08 16:23:51,078: WARNING/MainProcess] celery@halcyon.local has started.
```

- The <_broker_> is the URL you specified in the broker argument in our `celery` module. You can also specify a different broker on the command-line by using the [`-b`](https://docs.celeryq.dev/en/stable/reference/cli.html#cmdoption-celery-b) option.
-  <_Concurrency_> is the number of prefork worker process used to process your tasks concurrently. When all of these are busy doing work, new tasks will have to wait for one of the tasks to finish before it can be processed.
- <_Events_> is an option that causes Celery to send monitoring messages (events) for actions occurring in the worker. These can be used by monitor programs like `celery events`, and Flower – the real-time Celery monitor, which you can read about in the [Monitoring and Management guide](https://docs.celeryq.dev/en/stable/userguide/monitoring.html#guide-monitoring).
- _Queues_ is the list of queues that the worker will consume tasks from. The worker can be told to consume from several queues at once, and this is used to route messages to specific workers as a means for Quality of Service, separation of concerns, and prioritization, [Routing Guide](https://docs.celeryq.dev/en/stable/userguide/routing.html#guide-routing).

### In the background
In production you’ll want to run the worker in the background, described in detail in the [daemonization tutorial](https://docs.celeryq.dev/en/stable/userguide/daemonizing.html#daemonizing).

The daemonization scripts uses the **celery multi** command to start one or more workers in the background:
START
```bash
celery multi start w1 -A proj -l INFO
celery multi v4.0.0 (latentcall)
> Starting nodes...
    > w1.halcyon.local: OK
```

RESTART
```bash
celery  multi restart w1 -A proj -l INFO
celery multi v4.0.0 (latentcall)
> Stopping nodes...
    > w1.halcyon.local: TERM -> 64024
> Waiting for 1 node.....
    > w1.halcyon.local: OK
> Restarting node w1.halcyon.local: OK
celery multi v4.0.0 (latentcall)
> Stopping nodes...
    > w1.halcyon.local: TERM -> 64052
```

STOP
```bash
celery multi stop w1 -A proj -l INFO
```

The `stop` command is asynchronous so it won’t wait for the worker to shutdown. You’ll probably want to use the `stopwait` command instead, which ensures that all currently executing tasks are completed before exiting:

STOP WAIT
```bash
celery multi stopwait w1 -A proj -l INFO
```

IMPORTANT
**celery multi** doesn’t store information about workers so you need to use the same command-line arguments when restarting.

Logging
By default it’ll create pid and log files in the current directory. To protect against multiple workers launching on top of each other you’re encouraged to put these in a dedicated directory:

```bash
mkdir -p /var/run/celery
$ mkdir -p /var/log/celery
$ celery multi start w1 -A proj -l INFO --pidfile=/var/run/celery/%n.pid \
                                        --logfile=/var/log/celery/%n%I.log
```

With the multi command you can start multiple workers, and there’s a powerful command-line syntax to specify arguments for different workers too, for example:

```bash
celery multi start 10 -A proj -l INFO -Q:1-3 images,video -Q:4,5 data \
    -Q default -L:4,5 debug
```


### Calling Tasks

Call a task using delay method()
```python
from proj.tasks import add
add.delay(2, 2)
```

This method is actually a star-argument shortcut to another method called `apply_async()`:

```python
add.apply_async((2, 2))
```

The latter enables you to specify execution options like the time to run (countdown), the queue it should be sent to, and so on:

```python
add.apply_async((2, 2), queue='lopri', countdown=10)
```
In the above example the task will be sent to a queue named `lopri` and the task will execute, at the earliest, 10 seconds after the message was sent.

These three methods - `delay()`, `apply_async()`, and applying (`__call__`), make up the Celery calling API, which is also used for signatures.

NB
Every task invocation will be given a unique identifier (an UUID) – this is the task id.

The `delay` and `apply_async` methods return an [`AsyncResult`](https://docs.celeryq.dev/en/stable/reference/celery.result.html#celery.result.AsyncResult "celery.result.AsyncResult") instance, which can be used to keep track of the tasks execution state. But for this you need to enable a [result backend](https://docs.celeryq.dev/en/stable/userguide/tasks.html#task-result-backends) so that the state can be stored somewhere.


You can also inspect the exception and traceback if the task raised an exception, in fact `result.get()` will propagate any errors by default:

```python
res = add.delay(2, '2')
res.get(timeout=1)
```

Access task id
```python
res.id
d6b3aea2-fb9b-4ebc-8da4-848818db9114
```


If you don’t wish for the errors to propagate, you can disable that by passing `propagate`:
```python
res.get(propagate=False)
```

TO check task states:
```python
>>> res.failed()
True

>>> res.successful()
False
```

Access state directly
```python
res.state
'FAILURE'
```

A task can only be in a single state, but it can progress through several states. The stages of a typical task can be:
```
PENDING -> STARTED -> SUCCESS
```

The started state is a special state that’s only recorded if the [`task_track_started`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-task_track_started) setting is enabled, or if the `@task(track_started=True)` option is set for the task.

If the task is retried the stages can become even more complex. To demonstrate, for a task that’s retried two times the stages would be:

```
PENDING -> STARTED -> RETRY -> STARTED -> RETRY -> STARTED -> SUCCESS
```

## Signatures

sometimes you may want to pass the signature of a task invocation to another process or as an argument to another function, for which Celery uses something called _signatures_.

signature wraps the arguments and execution options of a single task invocation in such a way that it can be passed to functions or even serialized and sent across the wire

You can create a signature for the `add` task using the arguments `(2, 2)`, and a countdown of 10 seconds like this:

```python
>> add.signature((2, 2), countdown=10)
tasks.add(2, 2)

# shortcut
add.s(2,2)
```

Signature instances also support the calling API, meaning they have `delay` and `apply_async` methods.

But there’s a difference in that the signature may already have an argument signature specified. The `add` task takes two arguments, so a signature specifying two arguments would make a complete signature:
```python
>>> s1 = add.s(2, 2)
>>> res = s1.delay()
>>> res.get()
4
```

But, you can also make incomplete signatures to create what we call _partials_:

```python
# incomplete partial: add(?, 2)
>>> s2 = add.s(2)
```
`s2` is now a partial signature that needs another argument to be complete, and this can be resolved when calling the signature:

```python
# resolves the partial: add(8, 2)
>>> res = s2.delay(8)
>>> res.get()
10
```

Explained
Here you added the argument 8 that was prepended to the existing argument 2 forming a complete signature of `add(8, 2)`.

Keyword arguments can also be added later; these are then merged with any existing keyword arguments, but with new arguments taking precedence:

```python
>>> s3 = add.s(2, 2, debug=True)
>>> s3.delay(debug=False)   # debug is now False.
```


### Primitives
- [group](https://docs.celeryq.dev/en/stable/userguide/canvas.html#canvas-group)
- [chain](https://docs.celeryq.dev/en/stable/userguide/canvas.html#canvas-chain)
- [chord](https://docs.celeryq.dev/en/stable/userguide/canvas.html#canvas-chord)
- [map](https://docs.celeryq.dev/en/stable/userguide/canvas.html#canvas-map)
- [starmap](https://docs.celeryq.dev/en/stable/userguide/canvas.html#canvas-map)
- [chunks](https://docs.celeryq.dev/en/stable/userguide/canvas.html#canvas-chunks)

primitives are signature objects themselves, so they can be combined in any number of ways to compose complex work-flows.

NB
These examples retrieve results, so to try them out you need to configure a result backend.

GROUPS
A [`group`](https://docs.celeryq.dev/en/stable/reference/celery.html#celery.group "celery.group") calls a list of tasks in parallel, and it returns a special result instance that lets you inspect the results as a group, and retrieve the return values in order.

```python
>>> from celery import group
>>> from proj.tasks import add

>>> group(add.s(i, i) for i in range(10))().get()
[0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

- Partial group
```python
>>> g = group(add.s(i) for i in range(10))
>>> g(10).get()
[10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
```

CHAINS
Tasks can be linked together so that after one task returns the other is called:
```python
>>> from celery import chain
>>> from proj.tasks import add, mul

# (4 + 4) * 8
>>> chain(add.s(4, 4) | mul.s(8))().get()
64
```

or a partial chain:
```python
# (? + 4) * 8
>>> g = chain(add.s(4) | mul.s(8))
>>> g(4).get()
64
```
Chains can also be written like this:
```python
>>> (add.s(4, 4) | mul.s(8))().get()
64
```

CHORDS

A chord is a group with a callback:
```python
>>> from celery import chord
>>> from proj.tasks import add, xsum

>>> chord((add.s(i, i) for i in range(10)), xsum.s())().get()
90
```

A group chained to another task will be automatically converted to a chord:
```python
>>> (group(add.s(i, i) for i in range(10)) | xsum.s())().get()
90
```

Since these primitives are all of the signature type they can be combined almost however you want.

## Routing

Celery supports all of the routing facilities provided by AMQP, but it also supports simple routing where messages are sent to named queues.

The [`task_routes`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-task_routes) setting enables you to route tasks by name and keep everything centralized in one location:

```python
app.conf.update(
    task_routes = {
        'proj.tasks.add': {'queue': 'hipri'},
    },
)
```

You can also specify the queue at runtime with the `queue` argument to `apply_async`:

```python
>>> from proj.tasks import add
>>> add.apply_async((2, 2), queue='hipri')
```

then make a worker consume from this queue by specifying the [`celery worker -Q`](https://docs.celeryq.dev/en/stable/reference/cli.html#cmdoption-celery-worker-Q) option:

```bash
celery -A proj worker -Q hipri
```

or multiple 
```bash
celery -A proj worker -Q hipri,celery
```
## Remote Control

If you’re using RabbitMQ (AMQP), Redis, or Qpid as the broker then you can control and inspect the worker at runtime.

For example you can see what tasks the worker is currently working on:

```bash
$ celery -A proj inspect active
```

This is implemented by using broadcast messaging, so all remote control commands are received by every worker in the cluster.

You can also specify one or more workers to act on the request using the [`--destination`](https://docs.celeryq.dev/en/stable/reference/cli.html#cmdoption-celery-inspect-d) option. This is a comma-separated list of worker host names:

```bash
$ celery -A proj inspect active --destination=celery@example.com
```

If a destination isn’t provided then every worker will act and reply to the request.

The **celery inspect** command contains commands that don’t change anything in the worker; it only returns information and statistics about what’s going on inside the worker. For a list of inspect commands you can execute:

```bash
$ celery -A proj inspect --help
```

Then there’s the **celery control** command, which contains commands that actually change things in the worker at runtime:

```bash
$ celery -A proj control --help
```

For example you can force workers to enable event messages (used for monitoring tasks and workers):

```bash
$ celery -A proj control enable_events
```

When events are enabled you can then start the event dumper to see what the workers are doing:

```bash
$ celery -A proj events --dump
```

or you can start the curses interface:

```bash
$ celery -A proj events
```

when you’re finished monitoring you can disable events again:

```bash
$ celery -A proj control disable_events
```

The **celery status** command also uses remote control commands and shows a list of online workers in the cluster:

```bash
$ celery -A proj status
```

You can read more about the **celery** command and monitoring in the [Monitoring Guide](https://docs.celeryq.dev/en/stable/userguide/monitoring.html#guide-monitoring).

## Timezone

All times and dates, internally and in messages use the UTC timezone.
When the worker receives a message, for example with a countdown set it converts that UTC time to local time. If you wish to use a different timezone than the system timezone then you must configure that using the [`timezone`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-timezone) setting:

```python
app.conf.timezone = 'Europe/London'
```

## Optimization

The default configuration isn’t optimized for throughput. By default, it tries to walk the middle way between many short tasks and fewer long tasks,

If you have strict fair scheduling requirements, or want to optimize for throughput then you should read the [Optimizing Guide](https://docs.celeryq.dev/en/stable/userguide/optimizing.html#guide-optimizing).