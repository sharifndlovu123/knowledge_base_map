[[Rest Framework Summary]]

ie: you can create an API to be consumed by a mobile application for your e-learning platform. 
If you provide an API to third parties, they will be able to consume information and operate with your application programmatically. 
An API allows developers to automate actions on your platform and integrate your service with other applications or online services. 
You will build a fully featured API for your e-learning platform.

sample ![[Pasted image 20250201195816.png]]
- You will create two different sets of API views, `SubjectViewSet` and `CourseViewSet`. The former will include the list and detail views for subjects. 
- The latter will include the list and detail views for courses. You will also implement the `enroll` action in `CourseViewSet` to enroll students in courses. 
- This action will be only available to authenticated users, by using the `IsAuthenticated` permission. 
- You will create the `contents` action in `CourseViewSet` to access a course’s content. To access course contents, users have to be authenticated and enrolled in the given course. 
- You will implement the custom `IsEnrolled` permission to limit access to contents to the users enrolled in the course.



RESTFUL API
The **REST** architecture comes from **Representational State Transfer**. RESTful APIs are resource-based; your models represent resources, and HTTP methods such as `GET`, `POST`, `PUT`, or `DELETE` are used to retrieve, create, update, or delete objects. HTTP response codes are also used in this context.

 HTTP response codes are returned to indicate the result of the HTTP request, for example, `2XX` response codes for success, `4XX` for errors, and so on.
 Formats to exchange data in RESTful APIs are JSON and XML. You will build a RESTful API with JSON serialization for your project.
 
**Django REST framework** (**DRF**) provides a comprehensive set of tools to build RESTful APIs for your projects.
 relevant components that we will use to build our API:
 - **Serializers**: To transform data into a standardized format that other programs can understand, or to _deserialize_ data, by converting data into a format that your program can process.
- **Parsers and renderers**: To render (or format) serialized data appropriately before it is returned in an HTTP response. Similarly, to parse incoming data to ensure that it’s in the correct form.
- **API views**: To implement the application logic.
- **URLs**: To define the API endpoints that will be available.
- **Authentication and permissions**: To define authentication methods for the API and the permissions required for each view.

DRF Docs **DRF** at [https://www.django-rest-framework.org/](https://www.django-rest-framework.org/).



## DRF Setup
Open the shell and install the framework with the following command:

```markup
python -m pip install djangorestframework==3.15.1
```

Edit the `settings.py` file of the `educa` project and add `rest_framework` to the `INSTALLED_APPS` setting to activate the application, as follows:

```python
INSTALLED_APPS = [
    # ...
    'rest_framework',
]
```

Then, add the following code to the `settings.py` file:

```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ]
}
```

`DEFAULT_PERMISSION_CLASSES` setting specifies the default permissions to read, create, update, or delete objects.
 You set `DjangoModelPermissionsOrAnonReadOnly` as the only default permission class.
	 This class relies on Django’s permissions system to allow users to create, update, or delete objects while providing read-only access for anonymous users.
 
alternative list of all DRF settings are here  [https://www.django-rest-framework.org/api-guide/settings/](https://www.django-rest-framework.org/api-guide/settings/).

## Serializers
After setting up DRF, you need to specify how your data will be serialized. Output data has to be serialized in a specific format, and input data will be deserialized for processing.

framework provides the following classes to build serializers for single objects:

- `Serializer`: Provides serialization for normal Python class instances
- `ModelSerializer`: Provides serialization for model instances
- `HyperlinkedModelSerializer`: The same as `ModelSerializer`, but it represents object relationships with links rather than primary keys

build the directory.
api/
    __init__.py
    serializers.py

All API functionality will be placed inside the api dir

Edit the `api/serializers.py` file and add the following code:

```python
from rest_framework import serializers
from courses.models import Subject
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'title', 'slug']
```

Serializer for the `Subject` model
The `Meta` class allows you to specify the model to serialize and the fields to be included for serialization. 
*All model fields will be included if you don’t set a `fields` attribute.



SImple Trial Run
Let’s try the serializer. Open the command line and start the Django shell with the following command:

```bash
python manage.py shell
```

Run the following code:

```bash
>>> from courses.models import Subject
>>> from courses.api.serializers import SubjectSerializer
>>> subject = Subject.objects.latest('id')
>>> serializer = SubjectSerializer(subject)
>>> serializer.data
{'id': 4, 'title': 'Programming', 'slug': 'programming'}
```

In this example, you get a `Subject` object, create an instance of `SubjectSerializer`, and access the serialized data. 
model data is translated into Python native data types.


## Parsers And Renderers
The serialized data has to be rendered in a specific format before you return it in an HTTP response.
when you get an HTTP request, you have to parse the incoming data and deserialize it before you can operate with it.
Let’s see how to parse incoming data. Execute the following code in the Python shell:

```markup
>>> from io import BytesIO
>>> from rest_framework.parsers import JSONParser
>>> data = b'{"id":4,"title":"Programming","slug":"programming"}'
>>> JSONParser().parse(BytesIO(data))
{'id': 4, 'title': 'Programming', 'slug': 'programming'}
```

Given a JSON string input, you can use the `JSONParser` class provided by DRF to convert it to a Python object.
DRF also includes `Renderer` classes that allow you to format API responses. The framework determines which renderer to use through content negotiation by inspecting the request’s `Accept` header to determine the expected content type for the response.

OR
potionally, the renderer is determined by the format suffix of the URL. For example, the URL `http://127.0.0.1:8000/api/data.json` might be an endpoint that triggers the `JSONRenderer` in order to return a JSON response.

Go back to the shell and execute the following code to render the `serializer` object from the previous serializer example:

```markup
>>> from rest_framework.renderers import JSONRenderer
>>> JSONRenderer().render(serializer.data)
```

You will see the following output:

```markup
b'{"id":4,"title":"Programming","slug":"programming"}'
```
use the `JSONRenderer` to render the serialized data into JSON.

 DRF uses two different renderers: `JSONRenderer` and `BrowsableAPIRenderer`. The latter provides a web interface to easily browse your API. You can change the default renderer classes with the `DEFAULT_RENDERER_CLASSES` option of the `REST_FRAMEWORK` setting.

---

### Building list and detail views
DRF comes with a set of generic views and mixins that you can use to build your API views.
The base views and mixins provide the functionality to retrieve, create, update, or delete model objects. You can see all the generic mixins and views provided by DRF at [https://www.django-rest-framework.org/api-guide/generic-views/](https://www.django-rest-framework.org/api-guide/generic-views/).

sample
Create a new file inside the `courses/api/` directory and name it `views.py`. Add the following code to it:

```python
from rest_framework import generics
from courses.api.serializers import SubjectSerializer
from courses.models import Subject
class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
class SubjectDetailView(generics.RetrieveAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
```
use the generic `ListAPIView` and `RetrieveAPIView` views of DRF. Both views have the following attributes:
- `queryset`: The base QuerySet to use to retrieve objects
- `serializer_class`: The class to serialize objects

Create the urls
 Create a new file inside the `courses/api/` directory, name it `urls.py`, and make it look as follows:

```python
from django.urls import path
from . import views
app_name = 'courses'
urlpatterns = [
    path(
        'subjects/',
        views.SubjectListView.as_view(),
        name='subject_list'
    ),
    path(
        'subjects/<pk>/',
        views.SubjectDetailView.as_view(),
        name='subject_detail'
    ),
]
```

 Edit the main `urls.py` file of the `educa` project and include the API patterns, as follows:

```python
urlpatterns = [
    # ...
    path('api/', include('courses.api.urls', namespace='api')),
]
```


# Consuming the API
We are going to use `curl` to consume the API. `curl` is a command-line tool that allows you to transfer data to and from a server.
Open the shell and retrieve the URL `http://127.0.0.1:8000/api/subjects/` with `curl`, as follows:

```bash
curl http://127.0.0.1:8000/api/subjects/
```

To obtain a more readable, well-indented JSON response, you can use `curl` with the `json_pp` utility, as follows:

```bash
curl http://127.0.0.1:8000/api/subjects/ | json_pp
```


Preview
Open `http://127.0.0.1:8000/api/subjects/` in your browser. You will see DRF’s browsable API, as follows:
![[Pasted image 20250201204102.png]]
This HTML interface is provided by the `BrowsableAPIRenderer` renderer. It displays the result headers and content, and it allows you to perform requests. You can also access the API detail view for a `Subject` object by including its ID in the URL.


# Extending serializers

you may want to enrich the response with additional relevant data or calculated fields. Let’s take a look at some of the options to extend serializers.

## Adding additional fields to serializers

add annotates

from django.db.models import Count
class SubjectListView(generics.ListAPIView):
    queryset = Subject.objects.annotate(total_courses=Count('courses'))
    serializer_class = SubjectSerializer
class SubjectDetailView(generics.RetrieveAPIView):
    queryset = Subject.objects.annotate(total_courses=Count('courses'))
    serializer_class = SubjectSerializer




## Implementing serializer method fields
DRF provides SerializerMethodField, which allows you to implement read-only fields that get their value by calling a method of the serializer class

 useful when you want to include some custom formatted data in your serialized object or perform complex calculations that are not directly a part of your model instances.

 method that serializes the top 3 popular courses for a subject.
 ank courses by the number of students enrolled in them

 ## Adding pagination to views
 DRF includes built-in pagination capabilities to control how many objects are sent over in your API responses

 Create a new file inside the courses/api/ directory and name it pagination.py. Add the following code to it:
```python
from rest_framework.pagination import PageNumberPagination
class StandardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50
```


Add the following onto our SubjectListView view
```python
from courses.api.pagination import StandardPagination
pagination_class = StandardPagination
```

Test with ?page_size=2&page=1

The json returned will no add the following extras
```markup
count: The total number of results.
next: The URL to retrieve the next page. The value is null when there are no following pages.
previous: The URL to retrieve the previous page. The value is null when there are no previous pages.
results: A list with the serialized objects returned on this page.
```




add the course Serialzier, and test it via shell

```python
# ...
from courses.models import Course, Subject
class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'id',
            'subject',
            'title',
            'slug',
            'overview',
            'created',
            'owner',
            'modules'
        ]

```

```markup
python manage.py shell
from rest_framework.renderers import JSONRenderer
from courses.models import Course
from courses.api.serializers import CourseSerializer
course = Course.objects.latest('id')
serializer = CourseSerializer(course)
JSONRenderer().render(serializer.data)

"modules": [6, 7, 9, 10]

```

result will print out primary key values 
So this is the nex topic,
## Serializing relations (Related Objects)
 https://www.django-rest-framework.org/api-guide/relations/.

DRF comes with different types of related fields to represent model relationships. This works for ForeignKey, ManyToManyField, and OneToOneField relationships, as well as generic model relations.

use StringRelatedField to change how related Module objects are serialized. StringRelatedField represents the related object using its __str__() method.

```python
# ...
class CourseSerializer(serializers.ModelSerializer):
    modules = serializers.StringRelatedField(many=True, read_only=True)
    class Meta:
        # ...
```
 you define the modules field that provides serialization for the related Module objects. 
 
 You use many=True to indicate that you are serializing multiple related objects. The read_only parameter indicates that this field is read-only and should not be included in any input to create or update objects.


 Previous result = "modules":[44,45,46]'
 New Result = "modules":["1. Birth of Music","2. Music in production","3. Music in theatre"]

 "Note that DRF does not optimize QuerySets. When serializing a list of courses, a SQL query will be generated for each course result to retrieve the related Module objects. You can reduce the number of additional SQL requests by using prefetch_related() in your QuerySet, like Course.objects.prefetch_related('modules'). We will cover this later in the section Creating ViewSets and routers".


## Creating nested serializers
we want to include more information about each module, we need to serialize Module objects and nest them.

Modify the previous code of the api/serializers.py file of the courses

```python
from django.db.models import Count
from rest_framework import serializers
from courses.models import Course, Module, Subject
class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['order', 'title', 'description']
class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)
    class Meta:
        # ...

```

you define ModuleSerializer to provide serialization for the Module model. Then, you modify the modules attribute of CourseSerializer to nest the ModuleSerializer serializer. 
You keep many=True to indicate that you are serializing multiple objects and read_only=True to keep this field read-only.



## Creating ViewSets and routers
viewsets allow you to Define the interactions of your API and let DRF build URLs dynamically with a Router object.
By using ViewSets, you can avoid repeating logic for multiple views. ViewSets include actions for the following standard operations:

```markup
Create operation: create()
Retrieve operation: list() and retrieve()
Update operation: update() and partial_update()
Delete operation: destroy()
```


 api/views.py
```python
from django.db.models import Count
from rest_framework import generics
from rest_framework import viewsets
from courses.api.pagination import StandardPagination
from courses.api.serializers import CourseSerializer, SubjectSerializer
from courses.models import Course, Subject
class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.prefetch_related('modules')
    serializer_class = CourseSerializer
    pagination_class = StandardPagination

```

CourseViewSet class inherits from ReadOnlyModelViewSet, which provides the read-only actions list() and retrieve() to list objects or retrieve a single object, respectively. 

You specify the base QuerySet to retrieve objects. You use prefetch_related('modules') to fetch the related Module objects in an efficient manner. 

This will avoid additional SQL queries when serializing nested modules for each course. In this class, you also define the serializer and pagination classes to use for the ViewSet.


add the folllowing under urls.py
```python
from django.urls import include, path
from rest_framework import routers
from . import views
app_name = 'courses'
router = routers.DefaultRouter()
router.register('courses', views.CourseViewSet)
urlpatterns = [
    # ...
    path('', include(router.urls)),
]

```
You create a DefaultRouter object and register CourseViewSet with the courses prefix. The router takes charge of generating URLs automatically for your ViewSet.

view courses now
http://127.0.0.1:8000/api/courses/


add the same for the subjects and now go to the main api
http://127.0.0.1:8000/api

we should be able to redirect to others easier

You can learn more about ViewSets at https://www.django-rest-framework.org/api-guide/viewsets/. You can also find more information about routers at https://www.django-rest-framework.org/api-guide/routers/.


Building custom API views
implement your own views with custom logic. Let’s learn how to create a custom API view.

## Building custom API views

DRF provides an APIView class that builds API functionality on top of Django’s View class

The APIView class differs from View by using DRF’s custom Request and Response objects and handling APIException exceptions to return the appropriate HTTP responses. 
It also has a built-in authentication and authorization system to manage access to views.

create a view for users to enroll in courses. Edit the api/views.py file of the courses application and add the following code

```python
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
class CourseEnrollView(APIView):
    def post(self, request, pk, format=None):
        course = get_object_or_404(Course, pk=pk)
        course.students.add(request.user)
        return Response({'enrolled': True})
```
Steps
    1. You create a custom view that subclasses APIView.

    2. You define a post() method for POST actions. No other HTTP method will be allowed for this view.

    3. You expect a pk URL parameter containing the ID of a course. You retrieve the course by the given pk parameter and raise a 404 exception if it’s not found.

    4. You add the current user to the students many-to-many relationship of the Course object and return a successful response.

add corresponding url:
```python
path(
    'courses/<pk>/enroll/',
    views.CourseEnrollView.as_view(),
    name='course_enroll'
),
```

Theoretically, you could now perform a POST request to enroll the current user in a course. However, you need to be able to identify the user and prevent unauthenticated users from accessing this view. Let’s see how API authentication and permissions work.




## Handling Authentication
https://www.django-rest-framework.org/api-guide/authentication/.
DRF provides authentication classes to identify the user performing the request. If authentication is successful, the framework sets the authenticated User object in request.user. 

If no user is authenticated, an instance of Django’s AnonymousUser is set instead.

DRF provides the following authentication backends:
```markup

1. BasicAuthentication: This is HTTP basic authentication. The user and password are sent by the client in the Authorization HTTP header, encoded with Base64. You can learn more about it at https://en.wikipedia.org/wiki/Basic_access_authentication.

2. TokenAuthentication: This is token-based authentication. A Token model is used to store user tokens. Users include the token in the Authorization HTTP header for authentication.

3. SessionAuthentication: This uses Django’s session backend for authentication. This backend is useful for performing authenticated AJAX requests to the API from your website’s frontend.

4. RemoteUserAuthentication: This allows you to delegate authentication to your web server, which sets a REMOTE_USER environment variable.
```

You can build a custom authentication backend by subclassing the BaseAuthentication class provided by DRF and overriding the authenticate() method.

### Implementing basic authentication
You can set authentication on a 'per-view basis' or set it 'globally' with the DEFAULT_AUTHENTICATION_CLASSES setting.

NB - Authentication only identifies the user performing the request.  It won’t allow or deny access to views. You have to use permissions to restrict access to views.

add to existing courseEnroll under api/views.py 
```python
# ...
from rest_framework.authentication import BasicAuthentication
class CourseEnrollView(APIView):
    authentication_classes = [BasicAuthentication]
    # ...
```

### Adding permissions to views

DRF includes a permission system to restrict access to views. Some of the built-in permissions of DRF are:

```markup
1. AllowAny: Unrestricted access, regardless of whether a user is authenticated or not.

2. IsAuthenticated: Allows access to authenticated users only.

3. IsAuthenticatedOrReadOnly: Complete access to authenticated users. Anonymous users are only allowed to execute read methods such as GET, HEAD, or OPTIONS.

4. DjangoModelPermissions: Permissions tied to django.contrib.auth. The view requires a queryset attribute. Only authenticated users with model permissions assigned are granted permission.

5. DjangoObjectPermissions: Django permissions on a per-object basis.

Denied permissions return 
HTTP 401: Unauthorized
HTTP 403: Permission denied
```

Add the following to api/views.py 
```python

from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
class CourseEnrollView(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAuthenticated]

```

test via curl or api
curl -i -X POST http://127.0.0.1:8000/api/courses/1/enroll/
returns 401

curl -i -X POST -u sharif:sharif101 http://127.0.0.1:8000/api/courses/10/enroll/
returns 200

### Adding additional actions to ViewSets
You can add extra actions to ViewSets. 

```python
# ...
from rest_framework.decorators import action
class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.prefetch_related('modules')
    serializer_class = CourseSerializer
    @action(
        detail=True,
        methods=['post'],
        authentication_classes=[BasicAuthentication],
        permission_classes=[IsAuthenticated]
    )
    def enroll(self, request, *args, **kwargs):
        course = self.get_object()
        course.students.add(request.user)
        return Response({'enrolled': True})

```

### Creating custom permissions
You want students to be able to access the contents of the courses they are enrolled on.
 Only students enrolled on a course should be able to access its contents. The best way to do this is with a custom permission class. 
 
```markup 
DRF provides a BasePermission class that allows you to define the following methods:
    has_permission(): A view-level permission check
    has_object_permission(): An instance-level permission check
```

These methods should return True to grant access, or False otherwise.

Create a new file inside the courses/api/ directory and name it permissions.py. 

```python
from rest_framework.permissions import BasePermission
class IsEnrolled(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.students.filter(id=request.user.id).exists()
```

You subclass the BasePermission class and override the has_object_permission(). You check that the user performing the request is present in the students relationship of the Course object. You are going to use the IsEnrolled permission next.

### Serializing course contents

You need to serialize course contents.
The Content model includes a generic foreign key that allows you to associate objects of different content models. Yet, you added a common render() method for all content models in the previous chapter. 
You can use this method to provide rendered content to your API.

api/serializers.py
```python
from courses.models import Content, Course, Module, Subject
class ItemRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        return value.render()
class ContentSerializer(serializers.ModelSerializer):
    item = ItemRelatedField(read_only=True)
    class Meta:
        model = Content
        fields = ['order', 'item']

```

In this code, you define a custom field by subclassing the RelatedField serializer field provided by DRF and overriding the to_representation() method.

```python
class ModuleWithContentsSerializer(serializers.ModelSerializer):
    contents = ContentSerializer(many=True)
    class Meta:
        model = Module
        fields = ['order', 'title', 'description', 'contents']
class CourseWithContentsSerializer(serializers.ModelSerializer):
    modules = ModuleWithContentsSerializer(many=True)
    class Meta:
        model = Course
        fields = [
            'id',
            'subject',
            'title',
            'slug',
            'overview',
            'created',
            'owner',
            'modules'
        ]

```


 Create a view that mimics the behavior of the retrieve() action but includes the course contents. Edit the api/views.py file and add the following method to the CourseViewSet class:

 ```python
# ...
from courses.api.permissions import IsEnrolled
from courses.api.serializers import CourseWithContentsSerializer
class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    # ...
    @action(
        detail=True,
        methods=['get'],
        serializer_class=CourseWithContentsSerializer,
        authentication_classes=[BasicAuthentication],
        permission_classes=[IsAuthenticated, IsEnrolled]
    )
    def contents(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

 ```

 Step by step
```markup
The description of this method is as follows:

6. You use the action decorator with the parameter detail=True to specify an action that is performed on a single object.

7. You specify that only the GET method is allowed for this action.

8. You use the new CourseWithContentsSerializer serializer class that includes rendered course contents.

9. You use both IsAuthenticated and your custom IsEnrolled permissions. By doing so, you make sure that only users enrolled in the course are able to access its contents.

10. You use the existing retrieve() action to return the Course object.

```

try access http://127.0.0.1:8000/api/courses/1/contents/, with allowed credentials

DRF also allows you to handle creating and editing objects with the ModelViewSet class. We have covered the main aspects of DRF, but you will find further information about its features in its extensive documentation at https://www.django-rest-framework.org/.


## Consuming the RESTful API

Now that you have implemented an API, you can consume it in a programmatic manner from other applications.

Interaction Options
    -  interact with the API using the JavaScript Fetch API in the frontend of your application
    -   consume the API from applications built with Python or any other programming language.


    Test API
    You are going to create a simple Python application that uses the RESTful API to retrieve all available courses and then enroll a student in all of them. 
    
    You will learn how to authenticate against the API using HTTP basic authentication and perform GET and POST requests.

Open the shell and install the Requests library with the following command:
```bash
python -m pip install requests==2.31.0
```


Create a new directory next to the educa project directory and name it api_examples. Create a new file inside the api_examples/ directory and name it enroll_all.py. The file structure should now look like this:

api_examples/
    enroll_all.py
educa/
    ...


add following code 
```python
import requests
base_url = 'http://127.0.0.1:8000/api/'
url = f'{base_url}courses/'
available_courses = []
while url is not None:
    print(f'Loading courses from {url}')
    r = requests.get(url)
    response = r.json()
    url = response['next']
    courses = response['results']
    available_courses += [course['title'] for course in courses]
print(f'Available courses: {", ".join(available_courses)}')

```


Start the development server from the educa project directory with the following command:

python manage.py runserver

Copy

Explain
In another shell, run the following command from the api_examples/ directory:

python enroll_all.py

Copy

Explain
You will see output with a list of all course titles, like this:

Available courses: Introduction to Django, Python for beginners, Algebra basics


```python
import requests

username = ''
password = ''

base_url = 'http://127.0.0.1:8000/api/'
url = f'{base_url}courses/'
available_courses = []

while url is not None:
    print(f'Loading courses from {url}')
    r = requests.get(url)
    response = r.json()
    url = response['next']
    courses = response['results']
    available_courses += [course['title'] for course in courses]
print(f'Available courses: {", ".join(available_courses)}')


for course in courses:
    course_id = course['id']
    course_title = course['title']
    r = requests.post(
        f'{base_url}courses/{course_id}/enroll/',
        auth=(username, password)
    )
    if r.status_code == 200:
        # successful request
        print(f'Successfully enrolled in {course_title}')

```

Explanation
```markup
11. You use requests.post() to send a POST request to the URL http://127.0.0.1:8000/api/courses/[id]/enroll/ for each course. 

12. This URL corresponds to the CourseEnrollView API view, which allows you to enroll a user in a course. 

13. You build the URL for each course using the course_id variable. 

14. The CourseEnrollView view requires authentication. It uses the IsAuthenticated permission and the BasicAuthentication authentication class. 

15. The Requests library supports HTTP basic authentication out of the box. You use the auth parameter to pass a tuple with the username and password to authenticate the user, using HTTP basic authentication.
```

test by running the script