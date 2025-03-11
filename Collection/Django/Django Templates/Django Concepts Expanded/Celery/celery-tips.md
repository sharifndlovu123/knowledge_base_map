options docker run -d -p 5672:5672 rabbitmq app = Celery('tasks', broker='pyamqp://guest@localhost//')

docker run -d -p 6379:6379 redis app = Celery('tasks', broker='redis://guest@localhost//')

run worker celery -A tasks worker --loglevel=INFO celery -A tasks worker -Q low-priority --loglevel=info 'specific queue' celery -A tasks worker -Q celery,low-priority --loglevel=info 'default is celery'

in order to keep track of backend results result_backend If you want to keep track of the tasks’ states, Celery needs to store or send the states somewhere.

app = Celery('tasks', backend='rpc://', broker='pyamqp://') # MQ app = Celery('tasks', backend='redis://localhost', broker='pyamqp://') # REDIS

backend options Redis: redis://localhost:6379/0 (fast, popular) Database: db+postgresql://user:pass@localhost/dbname (good for long-term storage) RabbitMQ: rpc:// (for simple setups) Memcached: memcached://127.0.0.1:11211/ Amazon S3, Cassandra, MongoDB, Elasticsearch (for advanced setups)

now we can hold the values result = add.delay(4, 4)

result = add.delay(1,4) print(result.get()) # return value print(result.status) # return status

statueses Task States with Result Backend PENDING → Task is waiting to be executed. STARTED → Task is running (if enabled with task_track_started=True). SUCCESS → Task completed successfully. FAILURE → Task failed. RETRY → Task is being retried. REVOKED → Task was canceled before completion.

Exceptions In case the task raised an exception, get() will re-raise the exception, but you can override this by specifying the propagate argument: result.get(propagate=False) If the task raised an exception, you can also gain access to the original traceback: result.traceback

WARNINGS

- Waiting for tasks within a task may lead to deadlocks. Please read Avoid launching synchronous subtasks.
- Backends use resources to store and transmit results. To ensure that resources are released, you must eventually call get() or forget() on EVERY AsyncResult instance returned after calling a task.

CONFIGURATIONS The configuration can be set on the app directly or by using a dedicated configuration module ie singiular app.conf.task_serializer = 'json' ie group app.conf.update( task_serializer='json', accept_content=['json'], # Ignore other content result_serializer='json', timezone='Europe/Oslo', enable_utc=True, )

For Huge programs use a dedicated Config Module 'Hard coding periodic task intervals and task routing options is discouraged.' A centralized configuration will also allow your SysAdmin to make simple changes in the event of system trouble. app.config_from_object('celeryconfig')

More on configs ([https://docs.celeryq.dev/en/stable/userguide/configuration.html#configuration](https://docs.celeryq.dev/en/stable/userguide/configuration.html#configuration)) To verify the config module provided python -m celeryconfig Returns none, if theres errors it returns something

WORK Rate and QUEUES If you’re using RabbitMQ or Redis as the broker then you can also direct the workers to set a new rate limit for the task at runtime: celery -A tasks control rate_limit tasks.add 10/m [worker@example.com](mailto:worker@example.com): OK new rate limit set successfully