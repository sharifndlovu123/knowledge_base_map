
## Starting the worker


```bash
celery -A proj worker -l INFO
```

For a full list of available command-line options see [`worker`](https://docs.celeryq.dev/en/stable/reference/celery.bin.worker.html#module-celery.bin.worker "celery.bin.worker"), or simply do:

```bash
$ celery worker --help
```

You can start multiple workers on the same machine, but be sure to name each individual worker by specifying a node name with the [`--hostname`](https://docs.celeryq.dev/en/stable/reference/cli.html#cmdoption-celery-worker-n) argument:

```bash
$ celery -A proj worker --loglevel=INFO --concurrency=10 -n worker1@%h
$ celery -A proj worker --loglevel=INFO --concurrency=10 -n worker2@%h
$ celery -A proj worker --loglevel=INFO --concurrency=10 -n worker3@%h
```

The `hostname` argument can expand the following variables:

> - `%h`: Hostname, including domain name.
> - `%n`: Hostname only.
> - `%d`: Domain name only.

If the current hostname is _george.example.com_, these will expand to:

|   |   |   |
|---|---|---|
|Variable|Template|Result|
|`%h`|`worker1@%h`|_worker1@george.example.com_|
|`%n`|`worker1@%n`|_worker1@george_|
|`%d`|`worker1@%d`|_worker1@example.com_|

## Stopping the worker

When shutdown is initiated the worker will finish all currently executing tasks before it actually terminates. If these tasks are important, you should wait for it to finish before doing anything drastic, like sending the `KILL` signal.

you can use the `KILL` signal to force terminate the worker: but be aware that currently executing tasks will be lost (i.e., unless the tasks have the [`acks_late`](https://docs.celeryq.dev/en/stable/reference/celery.app.task.html#celery.app.task.Task.acks_late "celery.app.task.Task.acks_late") option set).

For production deployments you should be using init-scripts or a process supervision system (see [[Daemonization]].


## Automatic re-connection on connection loss to broker

Unless [`broker_connection_retry_on_startup`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-broker_connection_retry_on_startup) is set to False, Celery will automatically retry reconnecting to the broker after the first connection loss. [`broker_connection_retry`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-broker_connection_retry) controls whether to automatically retry reconnecting to the broker for subsequent reconnects.


## The broadcast() function

the client function used to send commands to the workers. Some remote control commands also have higher-level interfaces using [`broadcast()`](https://docs.celeryq.dev/en/stable/reference/celery.app.control.html#celery.app.control.Control.broadcast "celery.app.control.Control.broadcast") in the background, like [`rate_limit()`](https://docs.celeryq.dev/en/stable/reference/celery.app.control.html#celery.app.control.Control.rate_limit "celery.app.control.Control.rate_limit"), and [`ping()`](https://docs.celeryq.dev/en/stable/reference/celery.app.control.html#celery.app.control.Control.ping "celery.app.control.Control.ping").

Sending the [`rate_limit`](https://docs.celeryq.dev/en/stable/userguide/workers.html#std-control-rate_limit) command and keyword arguments:
```python
>>> app.control.broadcast('rate_limit',
...                          arguments={'task_name': 'myapp.mytask',
...                                     'rate_limit': '200/m'})
```

This will send the command asynchronously, without waiting for a reply. To request a reply you have to use the reply argument:
```python
>>> app.control.broadcast('rate_limit', {
...     'task_name': 'myapp.mytask', 'rate_limit': '200/m'}, reply=True)
[{'worker1.example.com': 'New rate limit set successfully'},
 {'worker2.example.com': 'New rate limit set successfully'},
 {'worker3.example.com': 'New rate limit set successfully'}]
```

Using the destination argument you can specify a list of workers to receive the command:

```python
>>> app.control.broadcast('rate_limit', {
...     'task_name': 'myapp.mytask',
...     'rate_limit': '200/m'}, reply=True,
...                             destination=['worker1@example.com'])
[{'worker1.example.com': 'New rate limit set successfully'}]
```

## Rate Limits

Example changing the rate limit for the myapp.mytask task to execute at most 200 tasks of that type every minute:
```python
>>> app.control.rate_limit('myapp.mytask', '200/m')
```
Above, the change request will affect all worker instances in the cluster. If you only want to affect a specific list of workers you can include the `destination` argument:
```python
>>> app.control.rate_limit('myapp.mytask', '200/m',
...            destination=['celery@worker1.example.com'])
```


## Autoscaling
- The autoscaler adds more pool processes when there is work to do,
- and starts removing processes when the workload is low.

It’s enabled by the [`--autoscale`](https://docs.celeryq.dev/en/stable/reference/cli.html#cmdoption-celery-worker-autoscale) option, which needs two numbers: the maximum and minimum number of pool processes:

```bash
--autoscale=AUTOSCALE
     Enable autoscaling by providing
     max_concurrency,min_concurrency.  Example:
       --autoscale=10,3 (always keep 3 processes, but grow to
      10 if necessary).
```

### Queues

You can get a list of queues that a worker consumes from by using the [`active_queues`](https://docs.celeryq.dev/en/stable/userguide/workers.html#std-control-active_queues) control command:

```bash
$ celery -A proj inspect active_queues
```

Like all other remote control commands this also supports the [`--destination`](https://docs.celeryq.dev/en/stable/reference/cli.html#cmdoption-celery-inspect-d) argument used to specify the workers that should reply to the request:

```bash
$ celery -A proj inspect active_queues -d celery@worker1.local
```

This can also be done programmatically by using the [`active_queues()`](https://docs.celeryq.dev/en/stable/reference/celery.app.control.html#celery.app.control.Inspect.active_queues "celery.app.control.Inspect.active_queues") method:

```python
app.control.inspect().active_queues()
app.control.inspect(['worker1.local']).active_queues()
```




If the queue name is defined in [`task_queues`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-task_queues) it will use that configuration, but if it’s not defined in the list of queues Celery will automatically generate a new queue for you (depending on the [`task_create_missing_queues`](https://docs.celeryq.dev/en/stable/userguide/configuration.html#std-setting-task_create_missing_queues) option).