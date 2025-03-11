## Django Caching Guide

### Why Caching Matters

As your site grows and handles more traffic, request overhead can become significant. Caching helps mitigate this by storing frequently accessed data, reducing server load, and improving response times.

By caching database queries, calculation results, or rendered content, you avoid redundant processing for subsequent requests needing the same data.

You can cache:

- Individual database queries
- Outputs of specific views
- Template fragments
- Entire websites

### How Caching Works

When handling an HTTP request:

1. **Check Cache:** Look for the requested data in the cache.
2. **Return Cached Data:** If found, return it immediately.
3. **Cache Miss:** If not found:
    - Perform the database query or processing.
    - Store the result in the cache.
    - Return the generated data.

### Available Cache Backends

- **Memcached:** `backends.memcached.PyMemcacheCache` or `backends.memcached.PyLibMCCache`
- **Redis:** `backends.redis.RedisCache`
- **Database Cache:** `backends.db.DatabaseCache` (uses the default database)
- **File-Based Cache:** `backends.filebased.FileBasedCache` (stores cache as serialized files)
- **Local Memory Cache:** `backends.locmem.LocMemCache` (default backend)
- **Dummy Cache:** `backends.dummy.DummyCache` (no actual caching; for development)

**Common Choices:** Redis and Memcached are the preferred options for production.

### Setting Up Memcached with Docker

**Install and Run Memcached:**

```bash
docker pull memcached:1.6.26
docker run -it --rm --name memcached -p 11211:11211 memcached:1.6.26 -m 64
```

The `-m` option limits memory usage to 64 MB.

**Install Python Binding:**

```bash
python -m pip install pymemcache==4.0.0
```

### Cache Settings in Django

```python
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
        'LOCATION': '127.0.0.1:11211',
    }
}
```

- `BACKEND`: Specifies the cache backend.
- `LOCATION`: Defines where the cache is hosted.
- `TIMEOUT`: Default expiration time (300 seconds by default).
- `KEY_PREFIX`: Prevents key collisions.
- `OPTIONS`: Additional backend-specific settings.
- `VERSION`: Supports cache versioning.

### Cache Levels

1. **Low-Level Cache API** (Granular control):

```python
from django.core.cache import cache

def get_expensive_data():
    data = cache.get('expensive_data')
    if data is None:
        data = perform_expensive_calculation()
        cache.set('expensive_data', data, timeout=60)
    return data
```

2. **Template Fragment Caching:**

```html
{% load cache %}
{% cache 300 sidebar %}
    <div class="sidebar">{{ trending_topics }}</div>
{% endcache %}
```

3. **Per-View Cache:**

```python
from django.views.decorators.cache import cache_page

@cache_page(60 * 5)
def product_list(request):
    products = Product.objects.all()
    return render(request, 'products/list.html', {'products': products})
```

4. **Per-Site Cache:**

```python
MIDDLEWARE = [
    'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware',
]

CACHE_MIDDLEWARE_SECONDS = 60 * 15
```

### Debugging Cache with Django Debug Toolbar

**Install:**

```bash
python -m pip install django-debug-toolbar==4.3.0
```

**Configure `settings.py`:**

```python
INSTALLED_APPS = ['debug_toolbar']
MIDDLEWARE = ['debug_toolbar.middleware.DebugToolbarMiddleware']
INTERNAL_IPS = ['127.0.0.1']
```

**Add to `urls.py`:**

```python
from django.urls import include, path
import debug_toolbar

urlpatterns = [
    path('__debug__/', include(debug_toolbar.urls)),
]
```

### Best Practices

- **Avoid caching `None` values** to distinguish between cache misses and actual data.
- **Use key versioning** when deploying new features that affect cached data.
- **Set appropriate timeouts** to balance performance with data freshness.