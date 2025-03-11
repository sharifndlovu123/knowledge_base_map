### 🚀 **Django Mixins & Combining Mixins**

Mixins are a powerful way to reuse behavior across multiple views in Django. They allow you to **extend functionality** without modifying base classes directly.

---

## ✅ **1. Basic Mixin Example**

A **mixin** is a class that provides **additional behavior** when used with Django views.

### **Example: Logging Mixin**

```python
import logging
from django.utils.timezone import now

logger = logging.getLogger(__name__)

class LoggingMixin:
    """Logs when a view is accessed"""
    def dispatch(self, request, *args, **kwargs):
        logger.info(f"{self.__class__.__name__} was accessed at {now()}")
        return super().dispatch(request, *args, **kwargs)
```

### **Using the Mixin in a View**

```python
from django.views.generic import TemplateView

class HomeView(LoggingMixin, TemplateView):
    template_name = "home.html"
```

📌 **How it works?**

- Before processing the request, it **logs the access time** and the view name.

---

## ✅ **2. Multiple Mixins (Combining Mixins)**

You can combine multiple mixins to create modular and reusable views.

### **Example: Combining Login Required & Logging Mixins**

```python
from django.contrib.auth.mixins import LoginRequiredMixin

class LoggedInUserLoggingMixin:
    """Logs user who accessed the page"""
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            logger.info(f"User {request.user.username} accessed {self.__class__.__name__}")
        return super().dispatch(request, *args, **kwargs)

class DashboardView(LoginRequiredMixin, LoggedInUserLoggingMixin, TemplateView):
    template_name = "dashboard.html"
```

📌 **What happens?**

- `LoginRequiredMixin` ensures only logged-in users can access.
- `LoggedInUserLoggingMixin` logs **which user accessed** the view.

---

## ✅ **3. CRUD Mixins (Create, Update, Delete, List)**

To reduce boilerplate code, we can use mixins for common **CRUD** operations.

### **CRUD Mixin for Handling Models**

```python
from django.shortcuts import get_object_or_404, redirect
from django.views import View

class ObjectMixin:
    """Mixin to get object dynamically"""
    model = None
    lookup_field = 'pk'

    def get_object(self):
        return get_object_or_404(self.model, **{self.lookup_field: self.kwargs[self.lookup_field]})
```

### **Using the Mixin in CRUD Views**

```python
from django.views.generic import DetailView, DeleteView
from django.urls import reverse_lazy
from .models import Book

class BookDetailView(ObjectMixin, DetailView):
    model = Book
    template_name = "book_detail.html"

class BookDeleteView(ObjectMixin, DeleteView):
    model = Book
    success_url = reverse_lazy("book_list")
    template_name = "book_confirm_delete.html"
```

📌 **Why use mixins?**

- Instead of repeating `get_object_or_404(self.model, pk=self.kwargs['pk'])` in every view, we **reuse `get_object()`** across views.

---

## ✅ **4. API Mixins for Django REST Framework (DRF)**

When building APIs with **Django REST Framework (DRF)**, mixins help to reduce redundant code.

### **Example: API CRUD Mixins**

```python
from rest_framework import mixins, generics
from .models import Book
from .serializers import BookSerializer

class BookListCreateView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)  # List all books

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)  # Create a new book
```

📌 **What this does?**

- Uses `ListModelMixin` for retrieving books.
- Uses `CreateModelMixin` for adding books.
- **DRF’s `GenericAPIView`** makes it flexible.

---

## ✅ **5. Form Handling with Mixins**

### **Example: Mixin for Prefilling Forms**

```python
class PrefillFormMixin:
    """Prefills form fields with request user"""
    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs.update({'initial': {'user': self.request.user}})
        return kwargs
```

### **Using It in a View**

```python
from django.views.generic.edit import CreateView
from .models import Review
from .forms import ReviewForm

class ReviewCreateView(PrefillFormMixin, CreateView):
    model = Review
    form_class = ReviewForm
    template_name = "review_form.html"
```

📌 **What happens?**

- The form **automatically pre-fills the `user` field** with the logged-in user.

---
## ✅ **6. Simple Mixin Example**

### **Scenario:**

You want to log every time a view is accessed.

### **Mixin (`mixins.py`):**

```python
from django.utils.timezone import now

class LogAccessMixin:
    def dispatch(self, request, *args, **kwargs):
        print(f"View accessed at {now()} by {request.user}")
        return super().dispatch(request, *args, **kwargs)
```

### **View (`views.py`):**

```python
from django.views.generic import TemplateView
from .mixins import LogAccessMixin

class HomePageView(LogAccessMixin, TemplateView):
    template_name = 'home.html'
```

Every time `HomePageView` is accessed, the access will be logged.

---

## 🔗 **7. Combining Multiple Mixins**

### **Scenario:**

You need to:

- ✅ Restrict access to logged-in users
- 🔒 Check if the user is an admin
- 📝 Log view access

### **Mixins (`mixins.py`):**

```python
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseForbidden
from django.utils.timezone import now

# Mixin for logging
class LogAccessMixin:
    def dispatch(self, request, *args, **kwargs):
        print(f"View accessed at {now()} by {request.user}")
        return super().dispatch(request, *args, **kwargs)

# Mixin to check admin status
class AdminRequiredMixin:
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return HttpResponseForbidden("Admins only!")
        return super().dispatch(request, *args, **kwargs)
```

### **View (`views.py`):**

```python
from django.views.generic import TemplateView
from .mixins import LogAccessMixin, AdminRequiredMixin
from django.contrib.auth.mixins import LoginRequiredMixin

class DashboardView(LoginRequiredMixin, AdminRequiredMixin, LogAccessMixin, TemplateView):
    template_name = 'dashboard.html'
```

### **Mixin Order Matters:**

- `LoginRequiredMixin` ensures the user is logged in.
- `AdminRequiredMixin` checks for admin rights.
- `LogAccessMixin` logs the view access after checks.

If you switch the order, the log may happen even if the user isn’t authorized.

---

## 🚀 **8. Advanced Use: Mixin with Permissions and Logging**

### **Scenario:**

You want to create a reusable mixin that:

- ✅ Requires specific permissions
- 📝 Logs the user action
- ⚡ Sends a notification to admins

### **Mixin (`mixins.py`):**

```python
from django.contrib.auth.mixins import PermissionRequiredMixin
from django.core.mail import send_mail
from django.utils.timezone import now

class AuditMixin(PermissionRequiredMixin):
    permission_required = 'app.view_sensitive_data'  # Custom permission

    def dispatch(self, request, *args, **kwargs):
        # Log user access
        print(f"{request.user} accessed sensitive data at {now()}")

        # Notify admin
        send_mail(
            subject="Sensitive Data Accessed",
            message=f"User {request.user} accessed sensitive data.",
            from_email="admin@example.com",
            recipient_list=["admin@example.com"],
            fail_silently=True
        )

        return super().dispatch(request, *args, **kwargs)
```

### **View (`views.py`):**

```python
from django.views.generic import DetailView
from .models import SensitiveData
from .mixins import AuditMixin

class SensitiveDataView(AuditMixin, DetailView):
    model = SensitiveData
    template_name = 'sensitive_data.html'
```
[[Mixin Samples]]