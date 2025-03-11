
### **1. Basic Queries**

- **Retrieve All Objects:**
    
    ```python
    Model.objects.all()
    ```
    
- **Retrieve Single Object:**
    
    ```python
    Model.objects.get(id=1)  # Raises DoesNotExist if not found
    ```
    
- **Filter Objects:**
    
    ```python
    Model.objects.filter(name='John')  # Returns a QuerySet
    ```
    
- **Exclude Objects:**
    
    ```python
    Model.objects.exclude(status='inactive')
    ```
    
- **Order By:**
    
    ```python
    Model.objects.order_by('created_at')       # Ascending
    Model.objects.order_by('-created_at')      # Descending
    ```
    
- **Limit and Offset:**
    
    ```python
    Model.objects.all()[:10]     # First 10 records
    Model.objects.all()[5:15]    # Records 6-15
    ```
    

---

### **2. Field Lookups**

- **Exact Match:**
    
    ```python
    Model.objects.filter(name__exact='John')
    ```
    
- **Case-Insensitive Match:**
    
    ```python
    Model.objects.filter(name__iexact='john')
    ```
    
- **Contains / Case-Insensitive Contains:**
    
    ```python
    Model.objects.filter(name__contains='oh')
    Model.objects.filter(name__icontains='OH')
    ```
    
- **Startswith / Endswith Case-Insensitive:**
    
    ```python
    Model.objects.filter(name__startswith='Jo')
    Model.objects.filter(name__istartswith='jo')
    Model.objects.filter(name__endswith='hn')
    Model.objects.filter(name__iendswith='HN')
    ```
    
- **In Lookup (List of Values)  *Matches Any Value in a List*  :**
    
    ```python
    Model.objects.filter(id__in=[1, 2, 3])
    ```
    
- **Range:**
    
    ```python
    Model.objects.filter(age__range=(18, 30))
    ```
    
- **Date and Time Lookups:**
    
    ```python
    Model.objects.filter(created_at__year=2024)
    Model.objects.filter(created_at__month=2)
    Model.objects.filter(created_at__day=11)
    Model.objects.filter(created_at__date='2024-02-11')
    Model.objects.filter(created_at__week_day=2)  # Monday=2, Sunday=1
    ```
    
- **Comparison Operators:**
    
    ```python
    Model.objects.filter(age__gt=18)     # Greater than
    Model.objects.filter(age__gte=18)    # Greater than or equal
    Model.objects.filter(age__lt=30)     # Less than
    Model.objects.filter(age__lte=30)    # Less than or equal
    ```
    
- **Null Checks:**
    
    ```python
    Model.objects.filter(email__isnull=True)
    ```
    
- **Boolean Field Lookup:**
    
    ```python
    Model.objects.filter(is_active=True)
    ```
    

---

### **3. Complex Queries**

- **Q Objects (OR Conditions):**
    
    ```python
    from django.db.models import Q
    
    Model.objects.filter(Q(name='John') | Q(age=30))
    Model.objects.filter(Q(name='John') & Q(is_active=True))
    ```
    
- **F Expressions (Comparing Fields):**
    
    ```python
    from django.db.models import F
    
    Model.objects.filter(salary__gt=F('bonus'))
    Model.objects.update(stock=F('stock') - 10)
    ```
    

---

### **4. Aggregation & Annotation**

- **Aggregation:**
    
    ```python
    from django.db.models import Count, Avg, Sum, Max, Min
    
    Model.objects.aggregate(Count('id'))
    Model.objects.aggregate(Avg('price'))
    Model.objects.aggregate(Sum('sales'))
    ```
    
- **Annotation:**
    
    ```python
    Model.objects.annotate(order_count=Count('orders'))
    ```
    

---

### **5. Related Model Lookups (ForeignKey, ManyToMany)**

- **Forward Lookups (ForeignKey):**
    
    ```python
    Order.objects.filter(customer__name='John')
    ```
    
- **Reverse Lookups (Related Name):**
    
    ```python
    Customer.objects.filter(order__status='completed')
    ```
    
- **Many-to-Many Lookups:**
    
    ```python
    Post.objects.filter(tags__name='Django')
    ```
    

---

### **6. Subqueries & Exists**

- **Subqueries:**
    
    ```python
    from django.db.models import Subquery, OuterRef
    
    subquery = Order.objects.filter(customer=OuterRef('pk')).values('amount')[:1]
    Customer.objects.annotate(latest_order_amount=Subquery(subquery))
    ```
    
- **Exists:**
    
    ```python
    from django.db.models import Exists
    
    exists_query = Order.objects.filter(customer=OuterRef('pk'))
    Customer.objects.annotate(has_orders=Exists(exists_query))
    ```
    

---

### **7. Raw SQL Queries**

- **Using Raw SQL:**
    
    ```python
    Model.objects.raw('SELECT * FROM app_model WHERE age > %s', [30])
    ```
    

---

### **8. Database Functions**

- **Using Functions:**
    
    ```python
    from django.db.models.functions import Lower
    
    Model.objects.annotate(lower_name=Lower('name')).filter(lower_name='john')
    ```
    
- **Concatenation:**
    
    ```python
    from django.db.models.functions import Concat
    from django.db.models import Value
    
    Model.objects.annotate(full_name=Concat('first_name', Value(' '), 'last_name'))
    ```
    

---

### **9. Distinct & Values**

- **Distinct Records:**
    
    ```python
    Model.objects.distinct()
    ```
    
- **Values (Dict Format):**
    
    ```python
    Model.objects.values('id', 'name')
    ```
    
- **Values List:**
    
    ```python
    Model.objects.values_list('name', flat=True)
    ```
    

---

### **10. Filters in Django ORM**

- **Basic Filters:**
    
    ```python
    Model.objects.filter(name='John', age=30)
    ```
    
- **Filter with `Q` Objects (AND/OR Logic):**
    
    ```python
    from django.db.models import Q
    
    Model.objects.filter(Q(name='John') | Q(age=30))   # OR Condition
    Model.objects.filter(Q(name='John') & Q(is_active=True))  # AND Condition
    ```

```python
	from django.db.models import Q
	
	# Products that are either cheap OR discounted
	Product.objects.filter(Q(price__lt=50) | Q(discount__gte=20))

```
- **Chaining Filters:**
    
    ```python
    Model.objects.filter(status='active').filter(age__gt=18)
    ```
    
- **Filter on Related Fields:**
    
    ```python
    Order.objects.filter(customer__email='john@example.com')
    ```
    
- **Date Filters:**
    
1. **`date`** - *Filter by Date Only (ignoring time)*  
    ```python
    Event.objects.filter(created_at__date='2024-01-01')  
    # Events created on January 1, 2024
    ```

2. **`year` / `month` / `day`** - *Filter by Year, Month, or Day*  
    ```python
    Event.objects.filter(created_at__year=2023)  
    Event.objects.filter(created_at__month=12)  
    Event.objects.filter(created_at__day=25)  
    ```

3. **`week_day`** - *Filter by Day of the Week (1=Sunday, 7=Saturday)*  
    ```python
    Event.objects.filter(created_at__week_day=1)  
    # Events created on Sunday
    ```
4. 
    ```python
    Model.objects.filter(created_at__date='2024-02-11')
    Model.objects.filter(updated_at__year=2024)
    ```
    
- **Range Filters:**
    
    ```python
    Model.objects.filter(price__range=(100, 500))
    ```
    
- **Filter Using Subquery:**
    
    ```python
    from django.db.models import Subquery
    
    subquery = Order.objects.filter(customer=OuterRef('pk')).values('id')
    Customer.objects.filter(id__in=Subquery(subquery))
    ```
    
- **Conditional Filters with `.exists()`:**
    
    ```python
    Model.objects.filter(is_active=True).exists()
    ```
    
- **Combining Filters and Exclude:**
    
    ```python
    Model.objects.filter(is_active=True).exclude(age__lt=18)
    ```
    
- **Case-Insensitive Filters:**
    
    ```python
    Model.objects.filter(name__iexact='john')
    ```
    
- **Negating Filters:**
    
    ```python
    from django.db.models import Q
    
    Model.objects.filter(~Q(status='inactive'))  # Equivalent to exclude
    ```
    

---
## **Advanced Lookups**

1. **`range`** - *Filter Between a Range of Values*  
    ```python
    Product.objects.filter(price__range=(50, 150))  
    # Price BETWEEN 50 AND 150
    ```

2. **`regex`** - *Regular Expression Match (Case-Sensitive)*  
    ```python
    User.objects.filter(email__regex=r'^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$')  
    # Matches emails with specific patterns
    ```

3. **`iregex`** - *Case-Insensitive Regular Expression Match*  
    ```python
    User.objects.filter(email__iregex=r'GMAIL\.COM$')  
    # Matches emails ending with 'gmail.com', case-insensitive
    ```

---




[[Select_Related and Prefetch_Related]]