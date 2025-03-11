Welcome to Channels!
## Introduction

Channels wraps Django’s native asynchronous view support, allowing Django projects to handle not only HTTP, but protocols that require long-running connections too - WebSockets, MQTT, chatbots, amateur radio, and more.

It does this while preserving Django’s synchronous and easy-to-use nature, allowing you to choose how you write your code - synchronous in a style like Django views, fully asynchronous, or a mixture of both.

It provides integrations with Django’s auth system, session system, and more, making it easier than ever to extend your HTTP-only project to other protocols.

Channels also bundles this event-driven architecture with _channel layers_, a system that allows you to easily communicate between processes, and separate your project into different processes.

Channels gives you the tools to write these basic _consumers_ - individual pieces that might handle chat messaging, or notifications - and tie them together with URL routing, protocol detection and other handy things to make a full application.

We treat HTTP and the existing Django application as part of a bigger whole. Traditional Django views are still there with Channels and still usable - with Django’s native ASGI support but you can also write custom HTTP long-polling handling, or WebSocket receivers, and have that code sit alongside your existing code.

Safe, synchronous techniques like Django views for most code, but have the option to drop down to a more direct, asynchronous interface for complex tasks.

### Scopes and Events

Channels and ASGI split up incoming connections into two components: a _scope_, and a series of _events_.

The _scope_ is a set of details about a single incoming connection - such as the path a web request was made from, or the originating IP address of a WebSocket, or the user messaging a chatbot. The scope persists throughout the connection.

For HTTP, the scope just lasts a single request. For WebSockets, it lasts for the lifetime of the socket (but changes if the socket closes and reconnects) ie chatbot.

During the lifetime of this _scope_, a series of _events_ occur. These represent user interactions - making a HTTP request, for example, or sending a WebSocket frame. 

Your Channels or ASGI applications will be **instantiated once per scope**, and then be fed the stream of _events_ happening within that scope to decide what action to take.

An example with HTTP:

- The user makes an HTTP request.
- We open up a new `http` type scope with details of the request’s path, method, headers, etc.
- We send a `http.request` event with the HTTP body content.
- The Channels or ASGI application processes this and generates a `http.response` event to send back to the browser and close the connection.
- The HTTP request/response is completed and the scope is destroyed.

An example with a chatbot:

- The user sends a first message to the chatbot.
- This opens a scope containing the user’s username, chosen name, and user ID.
- The application is given a `chat.received_message` event with the event text. It does not have to respond, but could send one, two or more other chat messages back as `chat.send_message` events if it wanted to.
- The user sends more messages to the chatbot and more `chat.received_message` events are generated.
- After a timeout or when the application process is restarted the scope is closed.

Within the lifetime of a scope - be that a chat, an HTTP request, a socket connection or something else - you will have one application instance handling all the events from it, and you can persist things onto the application instance as well. You can choose to write a raw ASGI application if you wish, but Channels gives you an easy-to-use abstraction over them called _consumers_.

### What is a Consumer?

A consumer is the basic unit of Channels code. We call it a _consumer_ as it _consumes events_, think of it as a tiny little application.
 
When a request or new socket comes in, Channels will follow its routing table find the right consumer for that incoming connection, and start up a copy of it.

unlike Django views, consumers are long-running. They can also be short-running

HTTP requests can also be served by consumers - but they’re built around the idea of living for a little while.

A basic consumer looks like this:

```python
class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.username = "Anonymous"
        self.accept()
        self.send(text_data="[Welcome %s!]" % self.username)

    def receive(self, *, text_data):
        if text_data.startswith("/name"):
            self.username = text_data[5:].strip()
            self.send(text_data="[set your username to %s]" % self.username)
        else:
            self.send(text_data=self.username + ": " + text_data)

    def disconnect(self, message):
        pass
```

Each different protocol has different kinds of events that happen, and each type is represented by a different method. You write code that handles each event, and Channels will take care of scheduling them and running them all in parallel.

Underneath, Channels is running on a fully asynchronous event loop, and if you write code like above, it will get called in a synchronous thread. This means you can safely do blocking operations, like calling the Django ORM:

```python
class LogConsumer(WebsocketConsumer):

    def connect(self, message):
        Log.objects.create(
            type="connected",
            client=self.scope["client"],
        )
```

If you want more control and you’re willing to work only in asynchronous functions, you can write fully asynchronous consumers:
```python
class PingConsumer(AsyncConsumer):
    async def websocket_connect(self, message):
        await self.send({
            "type": "websocket.accept",
        })

    async def websocket_receive(self, message):
        await asyncio.sleep(1)
        await self.send({
            "type": "websocket.send",
            "text": "pong",
        })
```

### Routing and Multiple Protocols

You can combine multiple consumers (which are, remember, their own ASGI apps) into one bigger app that represents your project using routing:

```python
application = URLRouter([
    path("chat/admin/", AdminChatConsumer.as_asgi()),
    path("chat/", PublicChatConsumer.as_asgi(),
])
```

VERY IMPORTANT
Channels is not just built around the world of HTTP and WebSockets - it also allows you to build any protocol into a Django environment, by building a server that maps those protocols into a similar set of events. For example, you can build a chatbot in a similar style:

```python
class ChattyBotConsumer(SyncConsumer):

    def telegram_message(self, message):
        """
        Simple echo handler for telegram messages in any chat.
        """
        self.send({
            "type": "telegram.message",
            "text": "You said: %s" % message["text"],
        })
```

And then use another router to have the one project able to serve both WebSockets and chat requests:

```python
application = ProtocolTypeRouter({

    "websocket": URLRouter([
        path("chat/admin/", AdminChatConsumer.as_asgi()),
        path("chat/", PublicChatConsumer.as_asgi()),
    ]),

    "telegram": ChattyBotConsumer.as_asgi(),
})
```

goal of Channels is to let you build out your Django projects to work across any protocol or transport you might encounter in the modern web, while letting you work with the familiar components and coding style you’re used to.

### Cross-Process Communication

Much like a standard WSGI server, your application code that is handling protocol events runs inside the server process itself - for example, WebSocket handling code runs inside your WebSocket server process.

Each socket or connection to your overall application is handled by an _application instance_ inside one of these servers. They get called and can send data back to the client directly.

#### Channel Layers
However, as you build more complex application systems you start needing to communicate between different _application instances_ - for example, if you are building a chatroom, when one _application instance_ receives an incoming message, it needs to distribute it out to any other instances that represent people in the chatroom.

You can do this by polling a database, but Channels introduces the idea of a _channel layer_, a low-level abstraction around a set of transports that allow you to send information between different processes. Each application instance has a unique _channel name_, and can join _groups_, allowing both point-to-point and broadcast messaging.

Note
Channel layers are an optional part of Channels, and can be disabled if you want (by setting the `CHANNEL_LAYERS` setting to an empty value).

```python
# In a consumer
self.channel_layer.send(
    'event',
    {
        'type': 'message',
        'channel': channel,
        'text': text,
    }
)
```

You can also send messages to a dedicated process that’s listening on its own, fixed channel name:
```python
# In a consumer
self.channel_layer.send(
    "myproject.thumbnail_notifications",
    {
        "type": "thumbnail.generate",
        "id": 90902949,
    },
)
```

### Django Integration

Channels ships with easy drop-in support for common Django features, like `sessions` and `authentication`. You can combine authentication with your WebSocket views by just adding the right middleware around them:

```python
from django.core.asgi import get_asgi_application
from django.urls import re_path

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                re_path(r"^front(end)/$", consumers.AsyncChatConsumer.as_asgi()),
            ])
        )
    ),
})
```

# Installation

```bash
python -m pip install -U 'channels[daphne]'
```

This will install Channels together with the Daphne ASGI application server. If you wish to use a different application server you can `pip install channels`, without the optional `daphne` add-on.

```python
INSTALLED_APPS = (
    "daphne",
    "channels",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.sites",
    ...
)
```


This will install the Daphne’s ASGI version of the `runserver` management command.

You can also add `"channels"` for Channel’s `runworker` command.

Then, adjust your project’s `asgi.py` file, e.g. `myproject/asgi.py`, to wrap the Django ASGI application:

```python
import os

from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    # Just HTTP for now. (We can add other protocols later.)
})
```
set your `ASGI_APPLICATION` setting to point to that routing object as your root application:
settings.py
```python
ASGI_APPLICATION = "myproject.asgi.application"
```

IMPORTANT
Please be wary of any other third-party apps that require an overloaded or replacement `runserver` command. Daphne provides a separate `runserver` command and may conflict with it. An example of such a conflict is with [whitenoise.runserver_nostatic](https://github.com/evansd/whitenoise/issues/77) from [whitenoise](https://github.com/evansd/whitenoise). In order to solve such issues, make sure `daphne` is at the top of your `INSTALLED_APPS` or remove the offending app altogether.

## Installing the latest development version

To install the latest version of Channels, clone the repo, change to the repo, change to the repo directory, and pip install it into your current virtual environment:

```bash
git clone git@github.com:django/channels.git
cd channels
<activate your project’s virtual environment>
(environment) pip install -e .  # the dot specifies the current repo
```

# Consumers

ASGI is more designed for interoperability than for writing complex applications in. So, Channels provides you with Consumers, a rich abstraction that allows you to create ASGI applications easily.

Consumers do a couple of things in particular:

- Structure your code as a series of functions to be called whenever an event happens, rather than making you write an event loop.
- Allow you to write synchronous or async code, and deal with handoffs and threading for you.

IMPORTANT
Of course, you are free to ignore consumers and use the other parts of Channels - like routing, session handling and authentication - with any ASGI app, but they’re generally the best way to write your application code.

## Basic Layout

A consumer is a subclass of either `channels.consumer.AsyncConsumer` or `channels.consumer.SyncConsumer`. 

As these names suggest, one will expect you to write async-capable code, while the other will run your code synchronously in a threadpool.

Basic example of a `SyncConsumer`:

```python
from channels.consumer import SyncConsumer

class EchoConsumer(SyncConsumer):

    def websocket_connect(self, event):
        self.send({
            "type": "websocket.accept",
        })

    def websocket_receive(self, event):
        self.send({
            "type": "websocket.send",
            "text": event["text"],
        })
```

This is a very simple WebSocket echo server - it will accept all incoming WebSocket connections, and then reply to all incoming WebSocket text frames with the same text.

tip
Consumers are structured around a series of named methods corresponding to the `type` value of the messages they are going to receive, with any `.` replaced by `_`. The two handlers above are handling `websocket.connect` and `websocket.receive` messages respectively.

How did we know what event types we were going to get and what would be in them (like `websocket.receive` having a `text`) key?
- the ASGI WebSocket specification, which tells us how WebSockets are presented - read more about it in [ASGI](https://channels.readthedocs.io/en/latest/asgi.html)
- and protected this application with a router that checks for a scope type of `websocket` - see more about that in [Routing](https://channels.readthedocs.io/en/latest/topics/routing.html).
- details - https://asgi.readthedocs.io/en/latest/specs/www.html#http


`self.send(event)`. This lets you send events back to the client or protocol server as defined by the protocol - if you read the [WebSocket protocol](https://asgi.readthedocs.io/en/latest/specs/www.html#http) , you’ll see that the dict we send above is how you send a text frame to the client.


 `AsyncConsumer` is laid out very similarly, but all the handler methods must be coroutines, and `self.send` is a coroutine:
```python
from channels.consumer import AsyncConsumer

class EchoConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        await self.send({
            "type": "websocket.accept",
        })

    async def websocket_receive(self, event):
        await self.send({
            "type": "websocket.send",
            "text": event["text"],
        })
```

When should you use `AsyncConsumer` or `SyncConsumer`?

- what you’re talking to. 
- If you call a slow synchronous function from inside an `AsyncConsumer` you’re going to hold up the entire event loop, so they’re only useful if you’re also calling async code (for example, using `HTTPX` to fetch 20 pages in parallel).
- If you’re calling any part of Django’s ORM or other synchronous code, you should use a `SyncConsumer`, as this will run the whole consumer in a thread and stop your ORM queries blocking the entire server.

TIPs
1. **write SyncConsumers by default**, and only use AsyncConsumers in cases where you know you are doing something that would be improved by async handling (long-running tasks that could be done in parallel) _and_ you are only using async-native libraries.

2. If you really want to call a synchronous function from an `AsyncConsumer`, take a look at `asgiref.sync.sync_to_async`, which is the utility that Channels uses to run `SyncConsumers` in threadpools, and can turn any synchronous callable into an asynchronous coroutine.	

3. if you want to call the Django ORM from an `AsyncConsumer` (or any other asynchronous code), you should use the `database_sync_to_async` adapter or use the async versions of the methods (prefixed with `a`, like `aget`).

### Closing Consumers

When the socket or connection attached to your consumer is closed - either by you or the client - you will likely get an event sent to you (for example, `http.disconnect` or `websocket.disconnect`), and your application instance will be given a short amount of time to act on it.

IMPORTANT
- Once you have finished doing your post-disconnect cleanup, you need to raise `channels.exceptions.StopConsumer` to halt the ASGI application cleanly and let the server clean it up.
- If you leave it running - by not raising this exception - the server will reach its application close timeout (which is 10 seconds by default in Daphne) and then kill your application and raise a warning.

The generic consumers below do this for you, so this is only needed if you are writing your own consumer class based on `AsyncConsumer` or `SyncConsumer`. However, if you override their `__call__` method, or block the handling methods that it calls from returning

Additionally, if you launch your own background coroutines, make sure to also shut them down when the connection is finished, or you’ll leak coroutines into the server.

### Channel Layers
Consumers also let you deal with Channel’s _channel layers_, to let them send messages between each other either one-to-one or via a broadcast system called groups.

Consumers will use the channel layer `default` unless the `channel_layer_alias` attribute is set when subclassing any of the provided `Consumer` classes.

```python
from channels.consumer import SyncConsumer

class EchoConsumer(SyncConsumer):
    channel_layer_alias = "echo_alias"
```

## Scope

Consumers receive the connection’s `scope` when they are called, which contains a lot of the information you’d find on the `request` object in a Django view. It’s available as `self.scope` inside the consumer’s methods

Scopes are part of the [ASGI specification](https://channels.readthedocs.io/en/latest/asgi.html), but here are some common things you might want to use:
- `scope["path"]`, the path on the request. _(HTTP and WebSocket)_
- `scope["headers"]`, raw name/value header pairs from the request _(HTTP and WebSocket)_
- `scope["method"]`, the method name used for the request. _(HTTP)_
- 
If you enable things like [Authentication](https://channels.readthedocs.io/en/latest/topics/authentication.html), you’ll also be able to access the user object as `scope["user"]`, and the URLRouter, for example, will put captured groups from the URL into `scope["url_route"]`.

1. **Captured Groups in URLs**:
    
    - In Django, URLs often contain dynamic parts, called **captured groups**, which are defined using regex or path converters in the URL patterns. For example:
        
```python
	    path('chat/<str:room_name>/', consumers.ChatConsumer.as_asgi())
```
        
    Here, `<str:room_name>` is a captured group. When a request is made to a URL like `/chat/lobby/`, the `room_name` will be captured as `"lobby"`. which is stored inside the key url_route

the scope is the place to get connection information and where middleware will put attributes it wants to let you access (in the same way that Django’s middleware adds things to `request`).

TIP
For a full list of what can occur in a connection scope, look at the basic ASGI spec for the protocol you are terminating, plus any middleware or routing code you are using. The web (HTTP and WebSocket) scopes are available in [the Web ASGI spec](https://github.com/django/asgiref/blob/master/specs/www.rst).


## Generic Consumers

What you see above is the basic layout of a consumer that works for any protocol. Much like Django’s _generic views_, 

Channels ships with _generic consumers_ that wrap common functionality up so you don’t need to rewrite it, specifically for HTTP and WebSocket handling.

### WebsocketConsumer
Available as `channels.generic.websocket.WebsocketConsumer`, this wraps the verbose plain-ASGI message sending and receiving into handling that just deals with text and binary frames:

```python
from channels.generic.websocket import WebsocketConsumer

class MyConsumer(WebsocketConsumer):
    groups = ["broadcast"]

    def connect(self):
        # Called on connection.
        # To accept the connection call:
        self.accept()
        # Or accept the connection and specify a chosen subprotocol.
        # A list of subprotocols specified by the connecting client
        # will be available in self.scope['subprotocols']
        self.accept("subprotocol")
        # To reject the connection, call:
        self.close()

    def receive(self, text_data=None, bytes_data=None):
        # Called with either text_data or bytes_data for each frame
        # You can call:
        self.send(text_data="Hello world!")
        # Or, to send a binary frame:
        self.send(bytes_data="Hello world!")
        # Want to force-close the connection? Call:
        self.close()
        # Or add a custom WebSocket error code!
        self.close(code=4123)

    def disconnect(self, close_code):
        # Called when the socket closes
```

Subprotocols [[Subprotocols]]

You can also raise `channels.exceptions.AcceptConnection` or `channels.exceptions.DenyConnection` from anywhere inside the `connect` method in order to accept or reject a connection, if you want reusable authentication or rate-limiting code that doesn’t need to use mixins.

A `WebsocketConsumer`’s channel will automatically be added to (on connect) and removed from (on disconnect) any groups whose names appear in the consumer’s `groups` class attribute.

`groups` must be an iterable, and a channel layer with support for groups must be set as the channel backend (`channels.layers.InMemoryChannelLayer` and `channels_redis.core.RedisChannelLayer` both support groups).

 If no channel layer is configured or the channel layer doesn’t support groups, connecting to a `WebsocketConsumer` with a non-empty `groups` attribute will raise `channels.exceptions.InvalidChannelLayerError`
### AsyncWebsocketConsumer

as `channels.generic.websocket.AsyncWebsocketConsumer`, this has the exact same methods and signature as `WebsocketConsumer` but everything is async, and the functions you need to write have to be as well:

```python
from channels.generic.websocket import AsyncWebsocketConsumer

class MyConsumer(AsyncWebsocketConsumer):
    groups = ["broadcast"]

    async def connect(self):
        # Called on connection.
        # To accept the connection call:
        await self.accept()
        # Or accept the connection and specify a chosen subprotocol.
        # A list of subprotocols specified by the connecting client
        # will be available in self.scope['subprotocols']
        await self.accept("subprotocol")
        # To reject the connection, call:
        await self.close()

    async def receive(self, text_data=None, bytes_data=None):
        # Called with either text_data or bytes_data for each frame
        # You can call:
        await self.send(text_data="Hello world!")
        # Or, to send a binary frame:
        await self.send(bytes_data="Hello world!")
        # Want to force-close the connection? Call:
        await self.close()
        # Or add a custom WebSocket error code!
        await self.close(code=4123)

    async def disconnect(self, close_code):
        # Called when the socket closes
```

### JsonWebsocketConsumer

as `channels.generic.websocket.JsonWebsocketConsumer`, this works like `WebsocketConsumer`, except it will auto-encode and decode to JSON sent as WebSocket text frames.

The only API differences are:
- Your `receive_json` method must take a single argument, `content`, that is the decoded JSON object.
- `self.send_json` takes only a single argument, `content`, which will be encoded to JSON for you.
If you want to customise the JSON encoding and decoding, you can override the `encode_json` and `decode_json` classmethods.


### AsyncJsonWebsocketConsumer

async version of `JsonWebsocketConsumer`, available as `channels.generic.websocket.AsyncJsonWebsocketConsumer`. Note that even `encode_json` and `decode_json` are async functions.

### AsyncHttpConsumer

as `channels.generic.http.AsyncHttpConsumer`, this offers basic primitives to implement a HTTP endpoint:
```python
from channels.generic.http import AsyncHttpConsumer

class BasicHttpConsumer(AsyncHttpConsumer):
    async def handle(self, body):
        await asyncio.sleep(10)
        await self.send_response(200, b"Your response bytes", headers=[
            (b"Content-Type", b"text/plain"),
        ])
```

You are expected to implement your own `handle` method. The method receives the whole request body as a single bytestring. Headers may either be passed as a list of tuples or as a dictionary. The response body content is expected to be a bytestring.

NB
You can also implement a `disconnect` method if you want to run code on disconnect - for example, to shut down any coroutines you launched. This will run even on an unclean disconnection, so don’t expect that `handle` has finished running cleanly.

If you need more control over the response, e.g. for implementing long polling, use the lower level `self.send_headers` and `self.send_body` methods instead.  This example already mentions channel layers which will be explained in detail later:

```python
import json
from channels.generic.http import AsyncHttpConsumer

class LongPollConsumer(AsyncHttpConsumer):
    async def handle(self, body):
        await self.send_headers(headers=[
            (b"Content-Type", b"application/json"),
        ])
        # Headers are only sent after the first body event.
        # Set "more_body" to tell the interface server to not
        # finish the response yet:
        await self.send_body(b"", more_body=True)

    async def chat_message(self, event):
        # Send JSON and finish the response:
        await self.send_body(json.dumps(event).encode("utf-8"))
```

Of course you can also use those primitives to implement a HTTP endpoint for [Server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events):

```python
from datetime import datetime
from channels.generic.http import AsyncHttpConsumer

class ServerSentEventsConsumer(AsyncHttpConsumer):
    async def handle(self, body):
        await self.send_headers(headers=[
            (b"Cache-Control", b"no-cache"),
            (b"Content-Type", b"text/event-stream"),
            (b"Transfer-Encoding", b"chunked"),
        ])
        while True:
            payload = "data: %s\n\n" % datetime.now().isoformat()
            await self.send_body(payload.encode("utf-8"), more_body=True)
            await asyncio.sleep(1)
```

# Routing

consumers are valid [ASGI](https://channels.readthedocs.io/en/latest/asgi.html) applications, you don’t want to just write one and have that be the only thing you can give to protocol servers like Daphne.

Channels provides routing classes that allow you to combine and stack your consumers (and any other valid ASGI application) to dispatch based on what the connection is.

IMPORTANT
Channels routers only work on the _scope_ level, not on the level of individual _events_, which means you can only have one consumer for any given connection. Routing is to work out what single consumer to give a connection, not how to spread events from one connection across multiple consumers.

Tip
Routers are themselves valid ASGI applications, and it’s possible to nest them. We suggest that you have a `ProtocolTypeRouter` as the root application of your project - the one that you pass to protocol servers - and nest other, more protocol-specific routing underneath there.

Channels expects you to be able to define a single _root application_, and provide the path to it as the `ASGI_APPLICATION` setting (think of this as being analogous to the `ROOT_URLCONF` setting in Django).

we recommend following Django’s conventions and putting them in a project-level file called `asgi.py`, next to `urls.py`.

```python
import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from django.urls import path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

from chat.consumers import AdminChatConsumer, PublicChatConsumer

application = ProtocolTypeRouter({
    # Django's ASGI application to handle traditional HTTP requests
    "http": django_asgi_app,

    # WebSocket chat handler
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                path("chat/admin/", AdminChatConsumer.as_asgi()),
                path("chat/", PublicChatConsumer.as_asgi()),
            ])
        )
    ),
})
```

NOTE
We call the `as_asgi()` classmethod when routing our consumers. This returns an ASGI wrapper application that will instantiate a new consumer instance for each connection or scope. This is similar to Django’s `as_view()`, which plays the same role for per-request instances of class-based views.

It’s possible to have routers from third-party apps, too, or write your own, but we’ll go over the built-in Channels ones here.

## ProtocolTypeRouter
`channels.routing.ProtocolTypeRouter`

Top level of your ASGI application stack and the main entry in your routing file.
lets you dispatch to one of a number of other ASGI applications based on the `type` value present in the `scope`. Protocols will define a fixed type value that their scope contains, so you can use this to distinguish between incoming connection types.

It takes a single argument - a dictionary mapping type names to ASGI applications that serve them:

```python
ProtocolTypeRouter({
    "http": some_app,
    "websocket": some_other_app,
})
```

If you want to split HTTP handling between long-poll handlers and Django views, use a URLRouter using Django’s `get_asgi_application()` specified as the last entry with a match-everything pattern.


## URLRouter
`channels.routing.URLRouter`

Routes `http` or `websocket` type connections via their HTTP path. Takes a single argument, a list of Django URL objects (either `path()` or `re_path()`):

```python
URLRouter([
    re_path(r"^longpoll/$", LongPollConsumer.as_asgi()),
    re_path(r"^notifications/(?P<stream>\w+)/$", LongPollConsumer.as_asgi()),
    re_path(r"", get_asgi_application()),
])
```

EXTRA [[URL routing and captured groups]]
Any captured groups will be provided in `scope` as the key `url_route`, a dict with a `kwargs` key containing a dict of the named regex groups and an `args` key with a list of positional regex groups. Note that named and unnamed groups cannot be mixed: Positional groups are discarded as soon as a single named group is matched.

For example, to pull out the named group `stream` in the example above, you would do this:

```python
stream = self.scope["url_route"]["kwargs"]["stream"]
```

IMPORTANT
Please note that `URLRouter` nesting will not work properly with `path()` routes if inner routers are wrapped by additional middleware

## ChannelNameRouter
`channels.routing.ChannelNameRouter`

Routes `channel` type scopes based on the value of the `channel` key in their scope. Intended for use with the [[Channels Based - Worker and Background Tasks]]

It takes a single argument - a dictionary mapping channel names to ASGI applications that serve them

```python
ChannelNameRouter({
    "thumbnails-generate": some_app,
    "thumbnails-delete": some_other_app,
})
```


# Database Access

Django ORM is a synchronous piece of code, if you want to access it from asynchronous code you need to do special handling to make sure its connections are closed properly.

If you’re using `SyncConsumer`, or anything based on it - like `JsonWebsocketConsumer` - you don’t need to do anything special, as all your code is already run in a synchronous mode and Channels will do the cleanup for you as part of the `SyncConsumer` code.

If you are writing asynchronous code, however, you will need to call database methods in a safe, synchronous context, using `database_sync_to_async` or by using the asynchronous methods prefixed with `a` like `Model.objects.aget()`.

## Database Connections
Channels can potentially open a lot more database connections than you may be used to if you are using threaded consumers (synchronous ones) - it can open up to one connection per thread.

to control the maximum number of threads used, set the `ASGI_THREADS` environment variable to the maximum number you wish to allow

By default, the number of threads is set to “the number of CPUs * 5

TIP
To avoid having too many threads idling in connections, you can instead rewrite your code to use async consumers and only dip into threads when you need to use Django’s ORM (using `database_sync_to_async`).

Using async consumers Channels will automatically call Django’s `close_old_connections` method when a new connection is started, when a connection is closed, and whenever anything is received from the client.


This mirrors Django’s logic for closing old connections at the start and end of a request, to the extent possible. Connections are _not_ automatically closed when sending data from a consumer since Channels has no way to determine if this is a one-off send (and connections could be closed) or a series of sends (in which closing connections would kill performance).

if you have a long-lived async consumer you should periodically call `aclose_old_connections`

## database_sync_to_async

`channels.db.database_sync_to_async` is a version of `asgiref.sync.sync_to_async` that also cleans up database connections on exit.

write your ORM queries in a separate function or method, and then call it with `database_sync_to_async` like so:

```python
from channels.db import database_sync_to_async

async def connect(self):
    self.username = await database_sync_to_async(get_name)()

def get_name(self):
    return User.objects.all()[0].name
```

or as a decorator

```python
from channels.db import database_sync_to_async

async def connect(self):
    self.username = await get_name()

@database_sync_to_async
def get_name(self):
    return User.objects.all()[0].name
```

## aclose_old_connections

`django.db.aclose_old_connections` is an async wrapper around Django’s `close_old_connections`. When using a long-lived `AsyncConsumer` that calls the Django ORM it is important to call this function periodically.

Preferrably, this function should be called before making the first query in a while.

ie: 
It should be called if the Consumer is woken up by a channels layer event and needs to make a few ORM queries to determine what to send to the client. This function should be called _before_ making those queries.


# Channel Layers 

Channel Layers are optional part of Channels, leave `CHANNEL_LAYERS` unset or set to empty dict `{}`

It allows you to talk between different instances of an application. They’re a useful part of making a distributed realtime application if you don’t want to have to shuttle all of your messages or events through a database.

DANGER ZONE
Channel layers have a purely async interface (for both send and receive); you will need to wrap them in a converter if you want to call them from synchronous code (see below).

## Configuration

Channel layers are configured via the `CHANNEL_LAYERS` Django setting

You can get the default channel layer from a project with `channels.layers.get_channel_layer()`, but if you are using consumers, then a copy is automatically provided for you on the consumer as `self.channel_layer`.

### Redis Channel Layer
[channels_redis](https://pypi.org/project/channels-redis/) is the only official Django-maintained channel layer supported for production use.
uses Redis as its backing store, and it supports both a single-server and sharded configurations as well as group support. To use this layer you’ll need to install the [channels_redis](https://pypi.org/project/channels-redis/) package.

Redis is running on localhost (127.0.0.1) port 6379:
```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("127.0.0.1", 6379)],
        },
    },
}
```

### In-Memory Channel Layer

**Do Not Use In Production**
Channels also comes packaged with an in-memory Channels Layer. This layer can be helpful in [Testing](https://channels.readthedocs.io/en/latest/topics/testing.html) or for local-development purposes:

```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}
```

## Synchronous Functions

By default the `send()`, `group_send()`, `group_add()` and other functions are async functions, meaning you have to `await` them. If you need to call them from synchronous code, you’ll need to use the handy `asgiref.sync.async_to_sync` wrapper:

```python
from asgiref.sync import async_to_sync

async_to_sync(channel_layer.send)("channel_name", {...})
```

## What To Send Over The Channel Layer

Channel layer is for high-level application-to-application communication. When you send a message, it is received by the consumers listening to the group or channel on the other end.

MEANING you should send high-level events over the channel layer, and then have consumers handle those events, and do appropriate low-level networking to their attached client.

For example, a chat application could send events like this over the channel layer:
```python
await self.channel_layer.group_send(
    room.group_name,
    {
        "type": "chat.message",
        "room_id": room_id,
        "username": self.scope["user"].username,
        "message": message,
    }
)
```

Then the consumers define a handling function to receive those events and turn them into WebSocket frames:

```python
async def chat_message(self, event):
    """
    Called when someone has messaged our chat.
    """
    # Send a message down to the client
    await self.send_json(
        {
            "msg_type": settings.MSG_TYPE_MESSAGE,
            "room": event["room_id"],
            "username": event["username"],
            "message": event["message"],
        },
    )
```

Channels’ `SyncConsumer` or `AsyncConsumer` will automatically provide you a `self.channel_layer` and `self.channel_name` attribute, which contains a pointer to the channel layer instance and the channel name that will reach the consumer respectively.

Any message sent to that channel name - or to a group the channel name was added to - will be received by the consumer much like an event from its connected client, and dispatched to a named method on the consumer.

The name of the method will be the `type` of the event with periods replaced by underscores - so, for example, an event coming in over the channel layer with a `type` of `chat.join` will be handled by the method `chat_join`.

IMPORTANT
If you are inheriting from the `AsyncConsumer` class tree, all your event handlers, including ones for events over the channel layer, must be asynchronous (`async def`). If you are in the `SyncConsumer` class tree instead, they must all be synchronous (`def`).

## Single Channels

'Each application instance'
each long-running HTTP request or open WebSocket - results in a single Consumer instance, and if you have channel layers enabled, Consumers will generate a unique _channel name_ for themselves, and start listening on it for events.

means you can send those consumers events from outside the process - from other consumers, maybe, or from management commands - and they will react to them and run code just like they would events from their client connection.

The channel name is available on a consumer as `self.channel_name`.

Here’s an example of writing the channel name into a database upon connection, and then specifying a handler method for events on it:

```python
class ChatConsumer(WebsocketConsumer):
	# websocket
    def connect(self):
        # Make a database row with our channel name
        Clients.objects.create(channel_name=self.channel_name)
	# websocket
    def disconnect(self, close_code):
        # Note that in some rare cases (power loss, etc) disconnect may fail
        # to run; this naive example would leave zombie channel names around.
        Clients.objects.filter(channel_name=self.channel_name).delete()
	# channel layer event, note __
    def chat_message(self, event):
        # Handles the "chat.message" event when it's sent to us.
        self.send(text_data=event["text"])
```

Note that, because you’re mixing event handling from the channel layer and from the protocol connection, you need to make sure that your type names do not clash. It’s recommended you prefix type names (like we did here with `chat.`) to avoid clashes.

To send to a single channel, just find its channel name (for the example above, we could crawl the database), and use `channel_layer.send`:

```python
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()
await channel_layer.send("channel_name", {
    "type": "chat.message",
    "text": "Hello there!",
})
```

## Groups

 in most cases you’ll want to send to multiple channels/consumers at once as a broadcast. 
 - Not only for cases like a chat where you want to send incoming messages to everyone in the room. 
 - even for sending to an individual user who might have more than one browser tab or device connected.
construct your own solution for this if you like using your existing datastores, or you can use the Groups system built-in to some channel layers.

Groups is a broadcast system that:
- Allows you to add and remove channel names from named groups, and send to those named groups.
- Provides group expiry for clean-up of connections whose disconnect handler didn’t get to run (e.g. power failure)

They do not allow you to enumerate or list the channels in a group; it’s a pure broadcast system.
Need more precise control or need to know who is connected? ; you should build your own system or use a suitable third-party one.

use groups by adding a channel to them during connection, and removing it during disconnection, illustrated here on the WebSocket generic consumer:

```python
# This example uses WebSocket consumer, which is synchronous, and so
# needs the async channel layer functions to be converted.
from asgiref.sync import async_to_sync

class ChatConsumer(WebsocketConsumer):

    def connect(self):
        async_to_sync(self.channel_layer.group_add)("chat", self.channel_name)

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)("chat", self.channel_name)
```

TIP
Group names are restricted to ASCII alphanumerics, hyphens, and periods only and are limited to a maximum length of 100 in the default backend.

to send to a group, use `group_send`, like in this small example which broadcasts chat messages to every connected socket when combined with the code above:

```python
class ChatConsumer(WebsocketConsumer):

    ...

    def receive(self, text_data):
        async_to_sync(self.channel_layer.group_send)(
            "chat",
            {
                "type": "chat.message",
                "text": text_data,
            },
        )

    def chat_message(self, event):
        self.send(text_data=event["text"])
```


## Using Outside Of Consumers

You’ll often want to send to the channel layer from outside of the scope of a consumer, and so you won’t have `self.channel_layer`. In this case, you should use the `get_channel_layer` function to retrieve it:

```python
from channels.layers import get_channel_layer
channel_layer = get_channel_layer()
```

once you have it, you can just call methods on it. Remember that **channel layers only support async methods**, so you can either call it from your own asynchronous context:

```python
for chat_name in chats:
    await channel_layer.group_send(
        chat_name,
        {"type": "chat.system_message", "text": announcement_text},
    )
```

Or you’ll need to use async_to_sync:
```python
from asgiref.sync import async_to_sync

async_to_sync(channel_layer.group_send)("chat", {"type": "chat.force_disconnect"})
```


# Sessions

Channels supports standard Django sessions using HTTP cookies for both HTTP and WebSocket. There are some caveats, however.
## Basic Usage

The `SessionMiddleware` in Channels supports standard Django sessions, and like all middleware, should be wrapped around the ASGI application that needs the session information in its scope (for example, a `URLRouter` to apply it to a whole collection of consumers, or an individual consumer).

IMPORTANT
`SessionMiddleware` requires `CookieMiddleware` to function. For convenience, these are also provided as a combined callable called `SessionMiddlewareStack` that includes both. All are importable from `channels.session`.

To use the middleware, wrap it around the appropriate level of consumer in your `asgi.py`:
```python
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.sessions import SessionMiddlewareStack

from myapp import consumers

application = ProtocolTypeRouter({

    "websocket": AllowedHostsOriginValidator(
        SessionMiddlewareStack(
            URLRouter([
                path("frontend/", consumers.AsyncChatConsumer.as_asgi()),
            ])
        )
    ),

})
```

NOTE
`SessionMiddleware` will only work on protocols that provide HTTP headers in their `scope` - by default, this is HTTP and WebSocket.

To access the session, use `self.scope["session"]` in your consumer code:
```python
class ChatConsumer(WebsocketConsumer):

    def connect(self, event):
        self.scope["session"]["seed"] = random.randint(1, 1000)
```

NOTE
`SessionMiddleware` respects all the same Django settings as the default Django session framework, like `SESSION_COOKIE_NAME` and `SESSION_COOKIE_DOMAIN`.

## Session Persistence

Within HTTP consumers or ASGI applications, session persistence works as you would expect from Django HTTP views - sessions are saved whenever you send a HTTP response that does not have status code `500`.

This is done by overriding any `http.response.start` messages to inject cookie headers into the response as you send it out. If you have set the `SESSION_SAVE_EVERY_REQUEST` setting to `True`, it will save the session and send the cookie on every response, otherwise it will only save whenever the session is modified.

NB
If you are in a WebSocket consumer, however, the session is populated **but will never be saved automatically** - you must call `scope["session"].save()` (or the asynchronous version, `scope["session"].asave()`) yourself whenever you want to persist a session to your session store.

 If you don’t save, the session will still work correctly inside the consumer (as it’s stored as an instance variable), but other connections or HTTP views won’t be able to see the changes.

Note
If you are in a long-polling HTTP consumer, you might want to save changes to the session before you send a response. If you want to do this, call `scope["session"].save()`.

# Authentication

Channels supports standard Django authentication out-of-the-box for HTTP and WebSocket consumers,

 you can write your own middleware or handling code if you want to support a different authentication scheme (for example, tokens in the URL).
## Django authentication

The `AuthMiddleware` in Channels supports standard Django authentication, where the user details are stored in the session. It allows read-only access to a user object in the `scope`.

NB
`AuthMiddleware` requires `SessionMiddleware` to function, which itself requires `CookieMiddleware`. For convenience, these are also provided as a combined callable called `AuthMiddlewareStack` that includes all three.

To use the middleware, wrap it around the appropriate level of consumer in your `asgi.py`:

```python
from django.urls import re_path

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

from myapp import consumers

application = ProtocolTypeRouter({

    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                re_path(r"^front(end)/$", consumers.AsyncChatConsumer.as_asgi()),
            ])
        )
    ),

})
```

it’s recommended you wrap it around a higher-level application component, like in this case the `URLRouter`, and not individually around each consumer

NB
Note that the `AuthMiddleware` will only work on protocols that provide HTTP headers in their `scope` - by default, this is HTTP and WebSocket.

To access the user, just use `self.scope["user"]` in your consumer code:
```python
class ChatConsumer(WebsocketConsumer):

    def connect(self):
        self.user = self.scope["user"]
        self.accept()
```

## Custom Authentication

If you have a custom authentication scheme, you can write a custom middleware to parse the details and put a user object (or whatever other object you need) into your scope.

Middleware is written as a callable that takes an ASGI application and wraps it to return another ASGI application.
Most authentication can just be done on the scope, so all you need to do is override the initial constructor that takes a scope, rather than the event-running coroutine.

simple example of a middleware that just takes a user ID out of the query string and uses that:

```python
from channels.db import database_sync_to_async

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class QueryAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).
        scope['user'] = await get_user(int(scope["query_string"]))

        return await self.app(scope, receive, send)
```

Same principles can be applied to authenticate over non-HTTP protocols; for example, you might want to use someone’s chat username from a chat protocol to turn it into a user.

## How to log a user in/out

Channels provides direct login and logout functions (much like Django’s `contrib.auth` package does) as `channels.auth.login` and `channels.auth.logout`.

NB
Login
Within your consumer you can await `login(scope, user, backend=None)` to log a user in. This requires that your scope has a `session` object; the best way to do this is to ensure your consumer is wrapped in a `SessionMiddlewareStack` or a `AuthMiddlewareStack`.

Logout
You can logout a user with the `logout(scope)` async function.


If you are in a WebSocket consumer, or logging-in after the first response has been sent in a http consumer, the session is populated **but will not be saved automatically** - you must call `scope["session"].save()` after login in your consumer code:

```python
from channels.auth import login

class ChatConsumer(AsyncWebsocketConsumer):

    ...

    async def receive(self, text_data):
        ...
        # login the user to this session.
        await login(self.scope, user)
        # save the session (if the session backend does not access the db you can use `sync_to_async`)
        await database_sync_to_async(self.scope["session"].save)()
```

When calling `login(scope, user)`, `logout(scope)` or `get_user(scope)` from a synchronous function you will need to wrap them in `async_to_sync`, as we only provide async versions:

```python
from asgiref.sync import async_to_sync
from channels.auth import login

class SyncChatConsumer(WebsocketConsumer):

    ...

    def receive(self, text_data):
        ...
        async_to_sync(login)(self.scope, user)
        self.scope["session"].save()
```

IMPORTANT
If you are using a long running consumer, websocket or long-polling HTTP it is possible that the user will be logged out of their session elsewhere while your consumer is running. You can periodically use `get_user(scope)` to be sure that the user is still logged in.


# Security
basic security for protocols you’re serving via Channels and helpers that we provide.

## WebSockets

WebSockets start out life as a HTTP request, including all the cookies and headers, and so you can use the standard [Authentication](https://channels.readthedocs.io/en/latest/topics/authentication.html) code in order to grab current sessions and check user IDs.

NB
There is also a risk of cross-site request forgery (CSRF) with WebSockets though, as they can be initiated from any site on the internet to your domain, and will still have the user’s cookies and session from your site. If you serve private data down the socket, you should restrict the sites which are allowed to open sockets to you.

This is done via the `channels.security.websocket` package, and the two ASGI middlewares it contains, `OriginValidator` and `AllowedHostsOriginValidator`.

`OriginValidator` lets you restrict the valid options for the `Origin` header that is sent with every WebSocket to say where it comes from. Just wrap it around your WebSocket application code like this, and pass it a list of valid domains as the second argument. 

You can pass only a single domain (for example, `.allowed-domain.com`) or a full origin, in the format `scheme://domain[:port]` (for example, `http://allowed-domain.com:80`). Port is optional, but recommended:

```python
from channels.security.websocket import OriginValidator

application = ProtocolTypeRouter({

    "websocket": OriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                ...
            ])
        ),
        [".goodsite.com", "http://.goodsite.com:80", "http://other.site.com"],
    ),
})
```
Note: If you want to resolve any domain, then use the origin `*`.

the set of domains you want to restrict to is the same as the Django `ALLOWED_HOSTS` setting, which performs a similar security check for the `Host` header, and so `AllowedHostsOriginValidator` lets you use this setting without having to re-declare the list:

```python
from channels.security.websocket import AllowedHostsOriginValidator

application = ProtocolTypeRouter({

    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                ...
            ])
        ),
    ),
})
```

`AllowedHostsOriginValidator` will also automatically allow local connections through if the site is in `DEBUG` mode, much like Django’s host validation.

 [Previous](https://channels.readthedocs.io/en/latest/topics/authentication.html "Authentication")[Next](https://channels.readthedocs.io/en/latest/topics/testing.html "Testing")