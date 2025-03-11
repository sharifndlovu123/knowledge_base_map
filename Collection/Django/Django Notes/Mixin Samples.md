
```python
from django.contrib.auth.mixins import (
    LoginRequiredMixin,          
    # Replicates the login_required decorator’s functionality
    PermissionRequiredMixin      
    # Grants access based on specific user permissions
)
from django.views.generic import (
    ListView, CreateView, UpdateView, DeleteView
)
from django.urls import reverse_lazy
from .models import Course

# ---------- MIXINS ----------

# Mixin to filter querysets for the current user
class OwnerMixin:
    def get_queryset(self):
        return super().get_queryset().filter(owner=self.request.user)

# Mixin to set the current user as the owner when creating/updating objects
class OwnerEditMixin:
    def form_valid(self, form):
        form.instance.owner = self.request.user
        return super().form_valid(form)

# Combines OwnerMixin with authentication and permission checks
class OwnerCourseMixin(OwnerMixin, LoginRequiredMixin, PermissionRequiredMixin):
    model = Course
    fields = ['subject', 'title', 'slug', 'overview']
    success_url = reverse_lazy('manage_course_list')

# Extends OwnerCourseMixin to handle course form views
class OwnerCourseEditMixin(OwnerCourseMixin, OwnerEditMixin):
    template_name = 'courses/manage/course/form.html'

# ---------- VIEWS ----------

# List view to show courses for the current user
class ManageCourseListView(OwnerCourseMixin, ListView):
    template_name = 'courses/manage/course/list.html'
    permission_required = 'courses.view_course'

# Create view for the current user's courses
class CourseCreateView(OwnerCourseEditMixin, CreateView):
    permission_required = 'courses.add_course'

# Update view for the current user's courses
class CourseUpdateView(OwnerCourseEditMixin, UpdateView):
    permission_required = 'courses.change_course'

# Delete view for the current user's courses
class CourseDeleteView(OwnerCourseMixin, DeleteView):
    template_name = 'courses/manage/course/delete.html'
    permission_required = 'courses.delete_course'

# ---------- EXTRA MIXIN EXAMPLES ----------

# Adds current user to context data
class UserContextMixin:
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['user'] = self.request.user
        return context

# Mixin for adding pagination
class PaginationMixin:
    paginate_by = 10

# View combining multiple mixins for authentication, context, and pagination
class MyView(LoginRequiredMixin, UserContextMixin, PaginationMixin, ListView):
    model = Course
    template_name = 'courses/manage/course/list.html'
```
