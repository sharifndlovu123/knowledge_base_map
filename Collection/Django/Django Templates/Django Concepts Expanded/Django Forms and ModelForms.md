## ✅ **1. Django Form Example (User Registration Form)**

### **`forms.py`**

```python
from django import forms

class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=50)
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)
    age = forms.IntegerField(min_value=13)  # Minimum age requirement

    # Field-specific validation for email
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email.endswith('@example.com'):
            raise forms.ValidationError("Email must be from the @example.com domain.")
        return email

    # Cross-field validation for password confirmation
    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')

        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError("Passwords do not match.")
```

### **Usage in Views:**

```python
from django.shortcuts import render
from .forms import RegistrationForm

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            # Process the registration (e.g., save to DB)
            return render(request, 'success.html')
    else:
        form = RegistrationForm()

    return render(request, 'register.html', {'form': form})
```

### **Template (`register.html`):**

```html
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Register</button>
</form>
```

---

## ✅ **2. Django ModelForm Example (Product Model)**

### **`models.py`**

```python
from django.db import models
from django.core.exceptions import ValidationError

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock = models.IntegerField()

    def clean(self):
        if self.discount_price and self.discount_price >= self.price:
            raise ValidationError("Discount price must be less than the original price.")

    def __str__(self):
        return self.name
```

### **`forms.py` (ModelForm):**

```python
from django import forms
from .models import Product

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'price', 'discount_price', 'stock']

    # Field-specific validation for stock
    def clean_stock(self):
        stock = self.cleaned_data.get('stock')
        if stock < 0:
            raise forms.ValidationError("Stock cannot be negative.")
        return stock

    # Cross-field validation for discount and price
    def clean(self):
        cleaned_data = super().clean()
        price = cleaned_data.get('price')
        discount_price = cleaned_data.get('discount_price')

        if discount_price and discount_price >= price:
            raise forms.ValidationError("Discount price must be less than the original price.")
```

### **Usage in Views:**

```python
from django.shortcuts import render
from .forms import ProductForm

def add_product(request):
    if request.method == 'POST':
        form = ProductForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, 'success.html')
    else:
        form = ProductForm()

    return render(request, 'add_product.html', {'form': form})
```

### **Template (`add_product.html`):**

```html
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    <button type="submit">Add Product</button>
</form>
```

---

## Widgets

### Forms
```python
from django import forms

class UserProfileForm(forms.Form):
    username = forms.CharField(
        max_length=50,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your username'
        })
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'you@example.com'
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'form-control',
            'placeholder': 'Enter your password'
        })
    )
    date_of_birth = forms.DateField(
        widget=forms.DateInput(attrs={
            'type': 'date',  # Date picker widget
            'class': 'form-control'
        })
    )
    bio = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'placeholder': 'Tell us about yourself',
            'rows': 4
        }),
        required=False
    )

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email.endswith('@example.com'):
            raise forms.ValidationError("Email must be from @example.com domain.")
        return email

```
### ModelForms

```python
from django import forms
from .models import BlogPost

class BlogPostForm(forms.ModelForm):
    class Meta:
        model = BlogPost
        fields = ['title', 'content', 'tags', 'published_date']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Blog Title'
            }),
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'rows': 6,
                'placeholder': 'Write your blog content here...'
            }),
            'tags': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'e.g., Django, Python, WebDev'
            }),
            'published_date': forms.DateInput(attrs={
                'type': 'date',
                'class': 'form-control'
            })
        }

    def clean_tags(self):
        tags = self.cleaned_data.get('tags')
        if len(tags.split(',')) > 5:
            raise forms.ValidationError("You can only add up to 5 tags.")
        return tags

```

---

## 🚀 **Summary of Widget Customization Options:**

|**Widget Type**|**Django Field**|**Widget Class**|**Key Attributes**|
|:--|:--|:--|:--|
|Text Input|`CharField`|`forms.TextInput`|`placeholder`, `class`, `maxlength`|
|Password Input|`CharField`|`forms.PasswordInput`|`type='password'`|
|Email Input|`EmailField`|`forms.EmailInput`|`placeholder`, `class`|
|Date Picker|`DateField`|`forms.DateInput`|`type='date'`, `class='form-control'`|
|Textarea (Multi-line)|`CharField` / `TextField`|`forms.Textarea`|`rows`, `cols`, `placeholder`|
|Dropdown (Choices)|`ChoiceField`|`forms.Select`|`choices`, `class`|
|Checkbox|`BooleanField`|`forms.CheckboxInput`|`checked`, `class`|
|Multiple Select|`MultipleChoiceField`|`forms.SelectMultiple`|`multiple`, `class`|
|File Upload|`FileField`|`forms.FileInput`|`accept="image/*"` for images|

[[Django Crispy Forms]]