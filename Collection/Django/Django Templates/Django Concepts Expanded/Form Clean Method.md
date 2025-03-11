
### ✅ **1. Using `clean_<fieldname>()` in Forms**

#### **Example: Validating an Email Domain**

```python
from django import forms

class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=100)
    email = forms.EmailField()
    age = forms.IntegerField()

    # Custom validation for the email field
    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email.endswith('@example.com'):
            raise forms.ValidationError("Email must be from @example.com domain.")
        return email
```

- **Key Point:**  
    `clean_email()` is automatically called when validating the form.

---

### ✅ **2. Using `clean()` in Forms for Cross-Field Validation**

#### **Example: Ensuring Age is Over 18 for Registration**

```python
class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=100)
    email = forms.EmailField()
    age = forms.IntegerField()

    def clean(self):
        cleaned_data = super().clean()
        age = cleaned_data.get('age')

        if age and age < 18:
            raise forms.ValidationError("You must be at least 18 years old to register.")
```

- **Key Point:**  
    `clean()` validates the entire form, making it ideal for cross-field validation.

---

### ✅ **3. Using `clean()` in Django Models**

#### **Example: Validating Product Price and Discount**

```python
from django.db import models
from django.core.exceptions import ValidationError

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def clean(self):
        # Ensure discount_price is less than the original price
        if self.discount_price and self.discount_price >= self.price:
            raise ValidationError("Discount price must be less than the original price.")
```

- **Usage Example:**
    
    ```python
    product = Product(name="Laptop", price=1000, discount_price=1200)
    product.full_clean()  # This will raise a ValidationError
    ```
    
- **Key Point:**  
    Always call `full_clean()` before saving to trigger model validation manually, or it will be triggered automatically via ModelForms.
    

---

### 🚀 **Bonus: ModelForm with Both `clean_<fieldname>()` and `clean()`**

```python
from django.forms import ModelForm
from .models import Product

class ProductForm(ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'price', 'discount_price']

    def clean_discount_price(self):
        discount_price = self.cleaned_data.get('discount_price')
        if discount_price is not None and discount_price < 0:
            raise forms.ValidationError("Discount price cannot be negative.")
        return discount_price

    def clean(self):
        cleaned_data = super().clean()
        price = cleaned_data.get('price')
        discount_price = cleaned_data.get('discount_price')

        if discount_price and discount_price >= price:
            raise forms.ValidationError("Discount must be less than the original price.")
```

---

Let me know if you'd like more specific examples or edge cases! 🚀