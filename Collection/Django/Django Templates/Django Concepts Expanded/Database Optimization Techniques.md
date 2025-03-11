Here are the key Django database optimization techniques:

# 1. QuerySet Optimization

## select_related()
Used for ForeignKey and OneToOne relationships to perform a SQL JOIN and include related object data:

```python
# Instead of
blog = Blog.objects.get(id=1)
author = blog.author  # Triggers another query

# Do this
blog = Blog.objects.select_related('author').get(id=1)
author = blog.author  # No additional query
```

## prefetch_related()
Used for ManyToMany relationships and reverse ForeignKey relationships:

```python
# Instead of
posts = Post.objects.all()
for post in posts:
    print(post.tags.all())  # Separate query for each post

# Do this
posts = Post.objects.prefetch_related('tags')
for post in posts:
    print(post.tags.all())  # No additional queries
```

## Combining Both
```python
Post.objects.select_related('author')\
    .prefetch_related('tags')\
    .filter(status='published')
```

# 2. Annotations and Aggregations

## Using annotate()
```python
from django.db.models import Count, Avg

# Get posts with comment count
posts = Post.objects.annotate(
    total_comments=Count('comments')
)

# Get authors with average post length
authors = Author.objects.annotate(
    avg_post_length=Avg('posts__content_length')
)
```

## Using aggregate()
```python
from django.db.models import Min, Max, Avg

# Get statistics across all posts
stats = Post.objects.aggregate(
    min_length=Min('content_length'),
    max_length=Max('content_length'),
    avg_length=Avg('content_length')
)
```

# 3. Bulk Operations

## Bulk Create
```python
# Instead of
for title in titles:
    Post.objects.create(title=title)

# Do this
Post.objects.bulk_create([
    Post(title=title) for title in titles
])
```

## Bulk Update
```python
posts = Post.objects.filter(status='draft')
for post in posts:
    post.status = 'published'

# Update all at once
Post.objects.bulk_update(posts, ['status'])
```

# 4. Database Indexing

## Adding Indexes
```python
class Post(models.Model):
    title = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['title', 'created']),
            models.Index(fields=['-created']),
        ]
```

# 5. Caching

## Using Django's Cache Framework
```python
from django.core.cache import cache

def get_posts():
    # Try to get data from cache
    posts = cache.get('all_posts')
    if posts is None:
        # If not in cache, get from database
        posts = Post.objects.all()
        # Store in cache for 15 minutes
        cache.set('all_posts', posts, 900)
    return posts
```

## Using cached_property
```python
from django.utils.functional import cached_property

class Post(models.Model):
    @cached_property
    def comment_count(self):
        return self.comments.count()
```

# 6. Database Constraints

## Adding Constraints
```python
class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField()
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['title', 'slug'],
                name='unique_title_slug'
            )
        ]
```

# 7. Query Optimization

## Using values() and values_list()
```python
# Instead of fetching entire objects
titles = [post.title for post in Post.objects.all()]

# Do this
titles = Post.objects.values_list('title', flat=True)
```

## Using exists() for Checking Existence
```python
# Instead of
if Post.objects.filter(status='published').count() > 0:

# Do this
if Post.objects.filter(status='published').exists():
```

# 8. Measuring Performance

## Using django-debug-toolbar
```python
INSTALLED_APPS = [
    ...
    'debug_toolbar',
]

MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    ...
]
```

## Using explain()
```python
# View the query execution plan
queryset = Post.objects.filter(status='published')
print(queryset.explain())
```

Remember:
1. Always monitor query counts and execution times
2. Use Django Debug Toolbar in development
3. Profile your code to identify bottlenecks
4. Consider database-specific optimizations
5. Use appropriate indexes for your queries
6. Cache frequently accessed data
7. Use bulk operations when possible
8. Keep your database well-maintained and optimized

These techniques should be applied based on your specific use case and requirements. Not all optimizations are necessary for every situation, and some might even be counterproductive in certain scenarios.