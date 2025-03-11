
Formsets allow you to manage multiple instances of a form on the same page. We'll cover:

1. ✅ **Inline Formset Example** (Parent-Child Relationship)
2. 🔄 **Dynamic Formset Example** (Add/Remove Forms with JavaScript)

---

## ✅ **1. Inline Formset Example** (Parent-Child Relationship)

### **Scenario:**

- **Parent Model:** `Author`
- **Child Model:** `Book` (related to `Author` via `ForeignKey`)

### **Models (`models.py`):**

```python
from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    author = models.ForeignKey(Author, related_name='books', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    published_date = models.DateField()

    def __str__(self):
        return self.title
```

### **Forms (`forms.py`):**

```python
from django import forms
from django.forms import inlineformset_factory
from .models import Author, Book

# Form for Author
class AuthorForm(forms.ModelForm):
    class Meta:
        model = Author
        fields = ['name', 'bio']

# Inline Formset for Books related to an Author
BookInlineFormSet = inlineformset_factory(
    Author,
    Book,
    fields=['title', 'published_date'],
    extra=1,               # Number of extra blank forms
    can_delete=True        # Allow deletion of books
)
```

### **Views (`views.py`):**

```python
from django.shortcuts import render, redirect
from .forms import AuthorForm, BookInlineFormSet

def create_author(request):
    if request.method == 'POST':
        author_form = AuthorForm(request.POST)
        formset = BookInlineFormSet(request.POST)

        if author_form.is_valid() and formset.is_valid():
            author = author_form.save()
            books = formset.save(commit=False)
            for book in books:
                book.author = author
                book.save()
            return redirect('success')  # Redirect after successful submission
    else:
        author_form = AuthorForm()
        formset = BookInlineFormSet()

    return render(request, 'author_form.html', {
        'author_form': author_form,
        'formset': formset
    })
```

### **Template (`author_form.html`):**

```html
<h2>Create Author & Books</h2>
<form method="post">
    {% csrf_token %}
    {{ author_form.as_p }}

    <h4>Books:</h4>
    {{ formset.management_form }}
    <div id="book-forms">
        {% for form in formset %}
            <div class="book-form">
                {{ form.as_p }}
                {% if form.instance.pk %}
                    <label>Delete: {{ form.DELETE }}</label>
                {% endif %}
            </div>
        {% endfor %}
    </div>

    <button type="submit">Save</button>
</form>
```

---

## 🔄 **2. Dynamic Formset Example** (Add/Remove Forms with JavaScript)

We'll extend the above example to dynamically **add/remove book forms** using JavaScript.

### **Updated Template (`author_form.html`):**

```html
<h2>Create Author & Dynamic Books</h2>
<form method="post" id="author-form">
    {% csrf_token %}
    {{ author_form.as_p }}

    <h4>Books:</h4>
    {{ formset.management_form }}
    <div id="book-forms">
        {% for form in formset %}
            <div class="book-form">
                {{ form.as_p }}
                <button type="button" class="remove-book">Remove</button>
            </div>
        {% endfor %}
    </div>

    <button type="button" id="add-book">Add Book</button>
    <button type="submit">Save Author & Books</button>
</form>

<!-- JavaScript for Dynamic Formset -->
<script>
    const addBookBtn = document.getElementById('add-book');
    const bookForms = document.getElementById('book-forms');
    const totalForms = document.querySelector('#id_book_set-TOTAL_FORMS');

    addBookBtn.addEventListener('click', function () {
        const currentFormCount = parseInt(totalForms.value);
        const newForm = bookForms.children[0].cloneNode(true);  // Clone the first form
        const formRegex = new RegExp(`book_set-(\\d+)-`, 'g');

        // Clear input values and update form index
        newForm.innerHTML = newForm.innerHTML.replace(formRegex, `book_set-${currentFormCount}-`);
        newForm.querySelectorAll('input').forEach(input => input.value = '');

        bookForms.appendChild(newForm);
        totalForms.value = currentFormCount + 1;  // Update form count
    });

    // Remove book form
    bookForms.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-book')) {
            const bookForm = e.target.closest('.book-form');
            if (bookForms.children.length > 1) {  // Keep at least one form
                bookForm.remove();
                totalForms.value = bookForms.children.length;
            }
        }
    });
</script>
```

---

## 🚀 **Key Concepts Recap**

|**Feature**|**Inline Formset**|**Dynamic Formset (JS)**|
|---|---|---|
|**Use Case**|Managing related models (e.g., Author & Books)|Adding/removing forms dynamically (client-side)|
|**Django Tool**|`inlineformset_factory()`|Manual cloning + Django formset management form|
|**Extra Forms**|Controlled via `extra=1`|Controlled via JavaScript cloning|
|**Deletion Support**|`can_delete=True` (Django handles it)|JS handles removal, updates total forms manually|
|**Validation**|Server-side (`is_valid()`)|Server-side validation + client-side JS checks|

Would you like me to extend this to support file uploads, nested formsets, or advanced validation? 🚀