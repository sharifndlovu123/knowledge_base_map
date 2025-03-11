
Function and Class Based Views
## Function Based Views

```python
# 🔨 2. Function-Based Views (FBVs) (views.py)
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse, Http404
from .models import Post
from .forms import PostForm

# List View
def post_list(request):
    posts = Post.objects.all()
    return render(request, 'posts/post_list.html', {'posts': posts})

# Detail View
def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, 'posts/post_detail.html', {'post': post})

# Create View
def post_create(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('post_list')
    else:
        form = PostForm()
    return render(request, 'posts/post_form.html', {'form': form})

# Update View
def post_update(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            return redirect('post_detail', pk=post.pk)
    else:
        form = PostForm(instance=post)
    return render(request, 'posts/post_form.html', {'form': form})

# Delete View
def post_delete(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        post.delete()
        return redirect('post_list')
    return render(request, 'posts/post_confirm_delete.html', {'post': post})

# ✅ Important FBV Concepts:
# - request.GET and request.POST for form data
# - HttpResponse and JsonResponse for API responses
# - get_object_or_404() for safely retrieving objects
# - decorators like @login_required, @csrf_exempt
# - Handling 404 with raise Http404


```


## Class Based Views

```python
# 🧱 3. Class-Based Views (CBVs) (views.py)
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from .models import Post

# List View
class PostListView(ListView):
    model = Post
    template_name = 'posts/post_list.html'
    context_object_name = 'posts'
    paginate_by = 10  # Pagination
    ordering = ['-created_at']  # Ordering

# Detail View
class PostDetailView(DetailView):
    model = Post
    template_name = 'posts/post_detail.html'
    context_object_name = 'post'

# Create View
@method_decorator(login_required, name='dispatch')
class PostCreateView(CreateView):
    model = Post
    fields = ['title', 'content', 'author']
    template_name = 'posts/post_form.html'
    success_url = reverse_lazy('post_list')

# Update View
class PostUpdateView(UpdateView):
    model = Post
    fields = ['title', 'content']
    template_name = 'posts/post_form.html'
    success_url = reverse_lazy('post_list')

# Delete View
class PostDeleteView(DeleteView):
    model = Post
    template_name = 'posts/post_confirm_delete.html'
    success_url = reverse_lazy('post_list')

# ✅ CBV Key Attributes:
# - `model` : defines the model for CRUD
# - `template_name` : specify the template to render
# - `context_object_name` : name for context data
# - `form_class` : custom form instead of `fields`
# - `success_url` : redirect URL after success
# - `queryset` : custom query sets
# - `ordering` : order the queryset
# - `paginate_by` : enable pagination
# - `get_context_data()` : modify context
# - `dispatch()` : method-level customization
# - `method_decorator` : apply decorators like `@login_required` on CBVs
# - `get_queryset()` : override to filter objects
# - `form_valid()` : custom validation logic

```

## Decorators

```python
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.contrib.auth.decorators import (
    login_required, permission_required, user_passes_test, staff_member_required
)
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from django.views.decorators.cache import cache_page, never_cache, vary_on_cookie, vary_on_headers
from django.db import transaction
from django.views.decorators.debug import sensitive_post_parameters, sensitive_variables
from django.utils.decorators import method_decorator
from django.utils.translation import override
from django.views.decorators.gzip import gzip_page

# 1. Authentication & Authorization Decorators
@login_required
def dashboard(request):
    return HttpResponse("Welcome to the dashboard!")

@permission_required('app.view_data')
def view_data(request):
    return HttpResponse("You have permission to view this data.")

@user_passes_test(lambda u: u.is_superuser)
def admin_only(request):
    return HttpResponse("Hello Admin!")

@staff_member_required
def staff_dashboard(request):
    return HttpResponse("Staff Members Only.")

# 2. CSRF Protection
@csrf_exempt
def webhook_receiver(request):
    return JsonResponse({"status": "Received without CSRF check"})

@csrf_protect
def secure_form(request):
    return HttpResponse("This form is CSRF protected.")

# 3. HTTP Method Restrictions
@require_POST
def submit_form(request):
    return HttpResponse("Form Submitted via POST.")

@require_GET
def get_data(request):
    return JsonResponse({"data": "This is a GET request."})

@require_http_methods(["POST", "PUT"])
def update_resource(request):
    return HttpResponse("Resource updated via POST or PUT.")

# 4. Caching
@cache_page(60 * 15)  # Cache for 15 minutes
def cached_view(request):
    return HttpResponse("This response is cached.")

@never_cache
def dynamic_view(request):
    return HttpResponse("This response will never be cached.")

@vary_on_cookie
def cookie_variation(request):
    return HttpResponse("Response varies based on cookies.")

@vary_on_headers("User-Agent")
def header_variation(request):
    return HttpResponse("Response varies based on User-Agent header.")

# 5. Transactions
@transaction.atomic
def save_data(request):
    # Database operations here will be atomic
    return HttpResponse("Data saved atomically.")

# 6. Debugging & Security
@sensitive_post_parameters('password')
def login_view(request):
    return HttpResponse("Sensitive data hidden in error reports.")

@sensitive_variables('secret_key')
def process_secret(request):
    secret_key = "my_super_secret_key"
    return HttpResponse("Processing sensitive data.")

# 7. GZip Compression
@gzip_page
def large_response(request):
    return HttpResponse("".join(["Data"] * 1000))

# 8. Internationalization
@override('fr')
def french_view(request):
    return HttpResponse("Bonjour le monde!")

# 9. Custom Decorator
from functools import wraps

def custom_decorator(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated:
            return view_func(request, *args, **kwargs)
        return HttpResponse('Unauthorized', status=401)
    return _wrapped_view

@custom_decorator
def protected_view(request):
    return HttpResponse("Protected by a custom decorator.")

```