Any captured groups will be provided in `scope` as the key `url_route`, a dict with a `kwargs` key containing a dict of the named regex groups and an `args` key with a list of positional regex groups. Note that named and unnamed groups cannot be mixed: Positional groups are discarded as soon as a single named group is matched.

This explanation refers to how Django Channels handles **URL routing** and **captured groups** in WebSocket or ASGI requests. When you define URL patterns with dynamic segments (using named or positional groups), Django Channels extracts these segments and makes them available in the `scope` dictionary under the key `url_route`. This allows you to access the captured values in your consumer.

Let’s break this down step by step:

---

### 1. **Captured Groups in URL Patterns**

In Django, URL patterns can include **dynamic segments** (also called captured groups) that extract parts of the URL. These segments can be:
- **Named groups**: Captured using a name (e.g., `<str:stream>`).
- **Positional groups**: Captured without a name (e.g., `(\d+)`).

For example:
```python
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/stream/(?P<stream>\w+)/$', consumers.StreamConsumer.as_asgi()),
]
```
Here, `(?P<stream>\w+)` is a **named group** that captures a sequence of word characters (letters, numbers, underscores) and assigns it to the name `stream`.

---

### 2. **How Captured Groups Are Stored in `scope`**

When a WebSocket connection or ASGI request is made, Django Channels processes the URL and extracts the captured groups. These groups are stored in the `scope` dictionary under the key `url_route`. The `url_route` key contains a dictionary with two keys:
- `kwargs`: A dictionary of **named groups**.
- `args`: A list of **positional groups**.

For example, if the URL is `/ws/stream/live/`, the `scope` dictionary will look like this:
```python
scope = {
    'type': 'websocket',
    'path': '/ws/stream/live/',
    'url_route': {
        'kwargs': {'stream': 'live'},  # Named groups
        'args': []  # Positional groups (empty in this case)
    },
    # Other keys like 'headers', 'query_string', etc.
}
```

---

### 3. **Accessing Captured Groups in the Consumer**

You can access the captured groups in your consumer using `self.scope["url_route"]`. For example:
```python
from channels.generic.websocket import WebsocketConsumer

class StreamConsumer(WebsocketConsumer):
    def connect(self):
        # Access the named group 'stream'
        stream = self.scope["url_route"]["kwargs"]["stream"]
        print(f"Connected to stream: {stream}")
        self.accept()
```

In this example:
- `self.scope["url_route"]["kwargs"]["stream"]` retrieves the value of the named group `stream` from the URL.
- If the URL was `/ws/stream/live/`, the value of `stream` will be `"live"`.

---

### 4. **Named vs. Positional Groups**

- **Named Groups**:
  - Defined using `(?P<name>pattern)` in regex or `<type:name>` in path converters.
  - Stored in `scope["url_route"]["kwargs"]` as a dictionary.
  - Example:
    ```python
    re_path(r'^ws/stream/(?P<stream>\w+)/$', ...)
    ```
    - URL: `/ws/stream/live/`
    - `scope["url_route"]["kwargs"] = {'stream': 'live'}`

- **Positional Groups**:
  - Defined using `(pattern)` in regex.
  - Stored in `scope["url_route"]["args"]` as a list.
  - Example:
    ```python
    re_path(r'^ws/stream/(\w+)/$', ...)
    ```
    - URL: `/ws/stream/live/`
    - `scope["url_route"]["args"] = ['live']`

---

### 5. **Mixing Named and Positional Groups**

The text mentions:
> "Named and unnamed groups cannot be mixed: Positional groups are discarded as soon as a single named group is matched."

This means:
- If your URL pattern contains **both named and positional groups**, only the **named groups** will be captured and stored in `scope["url_route"]["kwargs"]`.
- The **positional groups** will be ignored.

For example:
```python
re_path(r'^ws/stream/(?P<stream>\w+)/(\