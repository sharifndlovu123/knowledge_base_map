

### **1. Basic URL Configuration**

- **Project `urls.py`:**
    
    ```python
    from django.contrib import admin
    from django.urls import path
    from myapp import views
    
    urlpatterns = [
        path('admin/', admin.site.urls),
        path('', views.home, name='home'),               # Root URL
        path('about/', views.about, name='about'),       # Simple URL
    ]
    ```
    
- **App `urls.py`:**
    
    ```python
    from django.urls import path
    from . import views
    
    urlpatterns = [
        path('', views.index, name='index'),
        path('detail/<int:id>/', views.detail, name='detail'),
    ]
    ```
    

---

### **2. Using `include()`**

- **Purpose:** To include URL configurations from other apps for better modularity.
    
- **Example:**
    
    - **Project `urls.py`:**
        
        ```python
        from django.contrib import admin
        from django.urls import path, include
        
        urlpatterns = [
            path('admin/', admin.site.urls),
            path('blog/', include('blog.urls')),        # Include URLs from the blog app
            path('shop/', include('shop.urls')),        # Include URLs from the shop app
        ]
        ```
        
    - **App `blog/urls.py`:**
        
        ```python
        from django.urls import path
        from . import views
        
        urlpatterns = [
            path('', views.post_list, name='post_list'),
            path('<int:post_id>/', views.post_detail, name='post_detail'),
        ]
        ```
        

---

### **3. URL Patterns with `path()`**

- **Basic Syntax:**
    
    ```python
    path('route/', view, name='name')
    ```
    
- **Dynamic Segments:**
    
    ```python
    path('user/<int:id>/', views.user_detail, name='user_detail')    # Integer
    path('product/<slug:slug>/', views.product_detail, name='product_detail')  # Slug
    path('profile/<str:username>/', views.profile, name='profile')   # String
    path('order/<uuid:order_id>/', views.order_detail, name='order_detail')    # UUID
    path('date/<path:subpath>/', views.show_path, name='show_path')  # Path (accepts slashes)
    ```
    
- **Optional Parameters:** (Handled in views)
    
    ```python
    path('archive/', views.archive, name='archive')
    path('archive/<int:year>/', views.archive, name='archive_year')
    ```
    

---

### **4. Using `re_path()` (Regex URLs)** [[Regex URLs]]

- **Purpose:** For complex patterns not supported by `path()`.
    
- **Example:**
    
    ```python
    from django.urls import re_path
    from . import views
    
    urlpatterns = [
        re_path(r'^articles/(?P<year>[0-9]{4})/$', views.year_archive, name='year_archive'),
        re_path(r'^category/(?P<slug>[\w-]+)/$', views.category_detail, name='category_detail'),
    ]
    ```
    
- **Breakdown:**
    
    - `^` and `$` denote start and end of the string.
    - `(?P<year>[0-9]{4})`: Named capture group (`year`) for a 4-digit number.
    - `[\w-]+`: Matches letters, numbers, underscores, and hyphens.

---

### **5. Namespaces for Organized URLs**

- **Purpose:** To avoid URL name conflicts when using multiple apps.
    
- **App `shop/urls.py`:**
    
    ```python
    from django.urls import path
    from . import views
    
    app_name = 'shop'
    
    urlpatterns = [
        path('', views.index, name='index'),
        path('product/<int:id>/', views.product_detail, name='product_detail'),
    ]
    ```
    
- **Project `urls.py`:**
    
    ```python
    from django.urls import path, include
    
    urlpatterns = [
        path('shop/', include('shop.urls', namespace='shop')),
    ]
    ```
    
- **Template Usage:**
    
    ```html
    <a href="{% url 'shop:product_detail' id=5 %}">View Product</a>
    ```
    

---

### **7. URL Reverse Resolution**

- **In Templates:**
    
    ```html
    <a href="{% url 'home' %}">Home</a>
    <a href="{% url 'post_detail' post_id=10 %}">View Post</a>
    ```
    
- **In Views (Using `reverse()`):**
    
    ```python
    from django.urls import reverse
    from django.http import HttpResponseRedirect
    
    def redirect_home(request):
        return HttpResponseRedirect(reverse('home'))
    ```
    
- **With Parameters:**
    
    ```python
    reverse('product_detail', args=[5])
    reverse('shop:product_detail', kwargs={'id': 5})
    ```
    

---

### **8. Class-Based Views (CBV) URLs**

- **Using `as_view()`:**
    
    ```python
    from django.urls import path
    from .views import PostListView, PostDetailView
    
    urlpatterns = [
        path('posts/', PostListView.as_view(), name='post_list'),
        path('posts/<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    ]
    ```
    

---

### **9. Catch-All URL Patterns**

- **Catch-All with `re_path()`:**
    
    ```python
    from django.urls import re_path
    
    urlpatterns = [
        re_path(r'^.*$', views.page_not_found, name='404'),  # Catch-all pattern
    ]
    ```
    
- **Alternative with `path()`:**
    
    ```python
    path('<path:resource>/', views.catch_all, name='catch_all')
    ```
    

---

### **10. Custom Error Handling**

- **Custom Error Views:**
    
    ```python
    handler404 = 'myapp.views.custom_404'
    handler500 = 'myapp.views.custom_500'
    ```
    
- **Example Custom View:**
    
    ```python
    def custom_404(request, exception):
        return render(request, '404.html', status=404)
    ```
    

[[Subdomains]]
---