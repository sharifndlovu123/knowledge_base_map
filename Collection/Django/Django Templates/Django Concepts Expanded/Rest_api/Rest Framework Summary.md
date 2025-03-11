
# 1. Initial Setup

First, install DRF and add it to Django settings:

```bash
python -m pip install djangorestframework==3.15.1
```

Add to settings.py:
```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
]

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}
```

# 2. Create Serializers

Create api/serializers.py:
```python
from rest_framework import serializers
from courses.models import Subject, Course, Module

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'title', 'slug']

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['order', 'title', 'description']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'subject', 'title', 'slug', 'overview', 'created', 'owner', 'modules']
```

# 3. Create Views

Create api/views.py:
```python
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .serializers import SubjectSerializer, CourseSerializer
from courses.models import Subject, Course

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.prefetch_related('modules')
    serializer_class = CourseSerializer

    @action(detail=True, 
            methods=['post'],
            authentication_classes=[BasicAuthentication],
            permission_classes=[IsAuthenticated])
    def enroll(self, request, *args, **kwargs):
        course = self.get_object()
        course.students.add(request.user)
        return Response({'enrolled': True})

class SubjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
```

# 4. Configure URLs

Create api/urls.py:
```python
from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register('courses', views.CourseViewSet)
router.register('subjects', views.SubjectViewSet)

app_name = 'courses'
urlpatterns = [
    path('', include(router.urls)),
]
```

Add to main urls.py:
```python
path('api/', include('courses.api.urls', namespace='api')),
```

# 5. Custom Permissions

Create api/permissions.py:
```python
from rest_framework.permissions import BasePermission

class IsEnrolled(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.students.filter(id=request.user.id).exists()
```

This API provides:
- List and detail views for subjects and courses
- Course enrollment functionality for authenticated users
- Course content access restricted to enrolled students
- JSON responses with proper pagination
- Basic authentication support

Test the API using curl:
```bash
# List courses
curl http://127.0.0.1:8000/api/courses/

# Enroll in course (requires authentication)
curl -X POST -u username:password http://127.0.0.1:8000/api/courses/1/enroll/
```

The API will be available at:
- Courses: http://127.0.0.1:8000/api/courses/
- Subjects: http://127.0.0.1:8000/api/subjects/
- Course enrollment: http://127.0.0.1:8000/api/courses/<id>/enroll/