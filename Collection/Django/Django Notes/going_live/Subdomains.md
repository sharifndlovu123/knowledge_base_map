# Subdomains

### 🚀 **Bonus Example with More Complexity**

**URL:** `https://blog.educationsite.com/articles?sort=latest#comments`

1. **`https://`** → **Scheme/Protocol**  
2. **`blog.`** → **Subdomain**  
3. **`educationsite.com`** → **Domain Name (SLD + TLD)**  
4. **`/articles`** → **Path** (specific page or route)  
5. **`?sort=latest`** → **Query String** (key-value pair for filters/search)  
6. **`#comments`** → **Fragment Identifier** (anchors to a section on the page)

---

### 🗝️ **Quick Summary of URL Components**

| **Component**        | **Example**                  | **Purpose**                           |
|----------------------|------------------------------|---------------------------------------|
| **Scheme/Protocol**  | `https://`                   | Defines communication method          |
| **Subdomain**        | `www.` or `courses.`         | Divides sections of a site            |
| **Domain Name**      | `educationsite.com`          | Main address of the website           |
| **Path**             | `/courses` or `/articles`    | Route to a resource on the site       |
| **Query String**     | `?sort=latest`               | Passes data (e.g., filters, search)   |
| **Fragment**         | `#comments`                  | Jumps to a specific section on a page |

---




django sample (mycourse.educaproject.com)

```python
from django.urls import reverse
from django.shortcuts import get_object_or_404, redirect
from .models import Course
def subdomain_course_middleware(get_response):
    """
    Subdomains for courses
    """
    def middleware(request):
        host_parts = request.get_host().split('.')
        if len(host_parts) > 2 and host_parts[0] != 'www':
            # get course for the given subdomain
            course = get_object_or_404(Course, slug=host_parts[0])
            course_url = reverse('course_detail', args=[course.slug])
            # redirect current request to the course_detail view
            url = '{}://{}{}'.format(
                request.scheme, '.'.join(host_parts[1:]), course_url
            )
            return redirect(url)
        response = get_response(request)
        return response
    return middleware
```
