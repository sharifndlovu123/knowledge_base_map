
```bash
pip install django-crispy-forms
```

Once installed add `crispy_forms` to your `INSTALLED_APPS` in settings.py:

```python
INSTALLED_APPS = (
    ...
    'crispy_forms',
    'selected framework'
)
```

You will need to install the appropriate template pack for your CSS framework and add it to your list of `INSTALLED_APPS`
 The the following template packs have been extracted from crispy-forms core are now available on PyPI.

- `Bootstrap2` [crispy-forms-bootstrap2](https://pypi.org/project/crispy-forms-bootstrap2/).

- `Bootstrap3` [crispy-bootstrap3](https://pypi.org/project/crispy-bootstrap3/).

- `Bootstrap4` [crispy-bootstrap4](https://pypi.org/project/crispy-bootstrap4/).

- - `uni-form` [Uni-form](https://github.com/draganbabic/uni-form/tree/uni-form-v-1-5) is a nice looking, well structured, highly customizable, accessible and usable forms.

In addition the following template packs are available through separately maintained projects.

- `foundation` [Foundation](https://get.foundation/) In the creator’s words, “The most advanced responsive front-end framework in the world.” This template pack is available through [crispy-forms-foundation](https://github.com/sveetch/crispy-forms-foundation)
    
- `tailwind` [Tailwind](https://tailwindcss.com/) A utility first framework. This template pack is available through [crispy-tailwind](https://github.com/django-crispy-forms/crispy-tailwind)
    
- `Bootstrap 5` Support for newer versions of Bootstrap will be in separate template packs. This starts with version 5 and is available through [crispy-bootstrap5](https://github.com/django-crispy-forms/crispy-bootstrap5)
    
- `Bulma` [Bulma](https://bulma.io/): the modern CSS framework that just works. This template pack is available through [crispy-bulma](https://github.com/ckrybus/crispy-bulma)

Using Bootstrap-4
```python
INSTALLED_APPS = (
	...
	"crispy_forms",
	"crispy_bootstrap4",
	...
)

CRISPY_ALLOWED_TEMPLATE_PACKS = "bootstrap4"

CRISPY_TEMPLATE_PACK = "bootstrap4"
```


Crispy filter lets you render a form or formset using django-crispy-forms elegantly div based fields. Let’s see a usage example:
```html
{% load crispy_forms_tags %}

<form method="post" class="my-class">
    {{ my_formset|crispy }}
</form>
```

1. Add `{% load crispy_forms_tags %}` to the template.
2. Append the `|crispy` filter to your form or formset context variable.
3. Refresh and enjoy!

## Form Helper
django-crispy-forms implements a class called `FormHelper` that defines the form rendering behavior. Helpers give you a way to control form attributes and its layout, doing this in a programmatic way using Python. This way you write as little HTML as possible, and all your logic stays in the forms and views files.

Example will use this item
```python
class ExampleForm(forms.Form):
    like_website = forms.TypedChoiceField(
        label = "Do you like this website?",
        choices = ((1, "Yes"), (0, "No")),
        coerce = lambda x: bool(int(x)),
        widget = forms.RadioSelect,
        initial = '1',
        required = True,
    )

    favorite_food = forms.CharField(
        label = "What is your favorite food?",
        max_length = 80,
        required = True,
    )

    favorite_color = forms.CharField(
        label = "What is your favorite color?",
        max_length = 80,
        required = True,
    )

    favorite_number = forms.IntegerField(
        label = "Favorite number",
        required = False,
    )

    notes = forms.CharField(
        label = "Additional notes or feedback",
        required = False,
    )
```

import the helper
```python
from crispy_forms.helper import FormHelper
```

use the following to manipulate the form help
```python
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit

class ExampleForm(forms.Form):
    [...]
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        # form attributes
        self.helper.form_id = 'id-exampleForm'
        self.helper.form_class = 'blueForms'
        self.helper.form_method = 'post'
        self.helper.form_action = 'submit_survey'

        self.helper.add_input(Submit('submit', 'Submit'))
```

Note that we are importing a class called `Submit` that is a layout object. We will see what layout objects are in detail later on, for now on let’s just say that this adds a submit button to our form, so people can send their survey.

`FormHelper` has a list of attributes that can be set, that affect mainly form attributes

- Our form will have as DOM id `id-exampleForm` 
- It will have as DOM CSS class `blueForms`
- It will use http `POST` to send information
- It's action will be set to `reverse(submit_survey)`

 Supposing we have the form in the template context as `example_form`,
render the new form in the template: USE THIS WAY
```html
{% load crispy_forms_tags %}
{% crispy example_form example_form.helper %}
```

Notice that the `{% crispy %}` tags expects two parameters:
- First the form variable 
- Then the helper.

EXTRA
	In this case we use the `FormHelper` attached to the form, but you could also create a `FormHelper` instance and pass it as a context variable. Most of the time, you will want to use the helper attached. Note that if you name your `FormHelper` attribute `helper` you will only need to do:
```html
{% crispy form %}
```


EXPECTED FORM OUTPUT
```html
<form action="submit_survey" class="blueForms" id="id-exampleForm" method="post">
    <input name="csrfmiddlewaretoken" type="hidden" value="evU93ufHyzX5dP5h5hgOaq96zIj8c02X">
    <div id="div_id_like_website" class="form-group">
        <label class="requiredField"> Do you like this website?<span class="asteriskField">*</span> </label>
        <div action="submit_survey" class="blueForms" id="id-exampleForm">
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" name="like_website" value="1" id="id_like_website_0" required checked /> <label class="custom-control-label" for="id_like_website_0"> Yes </label>
            </div>
            <div class="custom-control custom-radio">
                <input type="radio" class="custom-control-input" name="like_website" value="0" id="id_like_website_1" required /> <label class="custom-control-label" for="id_like_website_1"> No </label>
            </div>
        </div>
    </div>
    <div id="div_id_favorite_food" class="form-group">
        <label for="id_favorite_food" class="requiredField"> What is your favorite food?<span class="asteriskField">*</span> </label>
        <div><input type="text" name="favorite_food" maxlength="80" class="textinput inputtext form-control" required id="id_favorite_food" /></div>
    </div>
    <div id="div_id_favorite_color" class="form-group">
        <label for="id_favorite_color" class="requiredField"> What is your favorite color?<span class="asteriskField">*</span> </label>
        <div><input type="text" name="favorite_color" maxlength="80" class="textinput inputtext form-control" required id="id_favorite_color" /></div>
    </div>
    <div id="div_id_favorite_number" class="form-group">
        <label for="id_favorite_number" class=""> Favorite number </label>
        <div><input type="number" name="favorite_number" class="numberinput form-control" id="id_favorite_number" /></div>
    </div>
    <div id="div_id_notes" class="form-group">
        <label for="id_notes" class=""> Additional notes or feedback </label>
        <div><input type="text" name="notes" class="textinput inputtext form-control" id="id_notes" /></div>
    </div>
    <div class="form-group">
        <div class=""><input type="submit" name="submit" value="Submit" class="btn btn-primary" id="submit-id-submit" /></div>
    </div>
</form>
```



It looks overwhelming now but focus on the following and note of their values
What you’ll get is the form rendered as HTML with awesome bits. Specifically…

- Opening and closing form tags, with id, class, action and method set as in the helper:
```html
<form action="submit_survey" class="blueForms" id="id-exampleForm" method="post">
    [...]
</form>
```

- Django’s CSRF controls:
```html
<input name="csrfmiddlewaretoken" type="hidden" value="evU93ufHyzX5dP5h5hgOaq96zIj8c02X">
```

- Submit button:
```html
<div class="form-group">
    <div class=""><input type="submit" name="submit" value="Submit" class="btn btn-primary" id="submit-id-submit" /></div>
</div>
```


## Manipulating a helper in a view

Let’s see how we could change any helper property in a view:
```python
@login_required()
def inbox(request, template_name):
    example_form = ExampleForm()
    redirect_url = request.GET.get('next')

    # Form handling logic
    [...]

    if redirect_url is not None:
        example_form.helper.form_action = reverse('submit_survey') + '?next=' + redirectUrl

    return render_to_response(template_name, {'example_form': example_form}, context_instance=RequestContext(request))
```

## Rendering several forms with helpers[](https://django-crispy-forms.readthedocs.io/en/latest/crispy_tag_forms.html#rendering-several-forms-with-helpers "Link to this heading")

Often we get asked: “How do you render two or more forms, with their respective helpers, using `{% crispy %}` tag, without having `<form>` tags rendered twice?” Easy, you need to set `form_tag` helper property to `False` in every helper:
```python
self.helper.form_tag = False
```

Then you will have to write a little of html code surrounding the forms:
```html
<form action="{% url 'submit_survey' %}" class="my-class" method="post">
    {% crispy first_form %}
    {% crispy second_form %}
</form>
```

list of [Helper attributes you can set](https://django-crispy-forms.readthedocs.io/en/latest/form_helper.html#helper-attributes) and what they are for.

## Change ‘*’ required fields[](https://django-crispy-forms.readthedocs.io/en/latest/crispy_tag_forms.html#change-required-fields "Link to this heading")

If you don’t like the use of `*` (asterisk) to denote required fields you have two options:

- Asterisks have an `asteriskField` class set. So you can hide it using CSS rule:
```css
.asteriskField {
    display: none;
}
```
- Override `field.html` template with a custom one.
## Make crispy-forms fail loud

By default when crispy-forms encounters errors, it fails silently, logs them and continues working if possible. 

A settings variable called `CRISPY_FAIL_SILENTLY` has been added so that you can control this behaviour. 

If you want to raise exceptions instead of logging, telling you what’s going on when you are developing in debug mode, you can set it to:
```python
CRISPY_FAIL_SILENTLY = not DEBUG
```

## Change crispy-forms </input> default classes

Django fields generate default classes, crispy-forms handles these and adds other classes for compatibility with CSS frameworks.

For example a `CharField` generates an `<input class="textinput" ...`. But in uni-form we need the class to be `textInput` (with capital ‘I’), so crispy-forms leaves it like `<input class="textinput textInput"...`.

All official template packs are handled automatically, but maybe you are integrating a new CSS framework, or your company’s custom one, with crispy-forms and need to change the default conversions. 

For this you need to use a settings variable called `CRISPY_CLASS_CONVERTERS`, expected to be a Python dictionary:

```python
CRISPY_CLASS_CONVERTERS = {'textinput': "textinput inputtext"}
```

For example this setting would generate `<input class"textinput inputtext" ...`. The key of the dictionary `textinput` is the Django’s default class, the value is what you want it to be substituted with, in this case we are keeping `textinput`.


## Render a form within Python code[](https://django-crispy-forms.readthedocs.io/en/latest/crispy_tag_forms.html#render-a-form-within-python-code "Link to this heading")

Sometimes, it might be useful to render a form using crispy-forms within Python code, like a Django view, for that there is a nice helper `render_crispy_form`. 

The prototype of the method is `render_crispy_form(form, helper=None, context=None)`. You can use it like this. Remember to pass your CSRF token to the helper method using the context dictionary if you want the rendered form to be able to submit.


## AJAX validation recipe

You may wish to validate a crispy-form through AJAX to re-render any resulting form errors. One way to do this is to set up a view that validates the form and renders its html using `render_crispy_form`.

This html is then returned to the client AJAX request. Let’s see an example.
Server Side Code:
```python
from django.template.context_processors import csrf
from crispy_forms.utils import render_crispy_form

@json_view
def save_example_form(request):
    form = ExampleForm(request.POST or None)
    if form.is_valid():
        # You could actually save through AJAX and return a success code here
        form.save()
        return {'success': True}

    ctx = {}
    ctx.update(csrf(request))
    form_html = render_crispy_form(form, context=ctx)
    return {'success': False, 'form_html': form_html}
```
jsonview decorator from [django-jsonview](https://github.com/jsocol/django-jsonview).
Note that you have to provide `render_crispy_form` the necessary CSRF token, otherwise it will not work.

Client Side jQuery:
```javascript
var example_form = '#example-form';

$.ajax({
    url: "{% url 'save_example_form' %}",
    type: "POST",
    data: $(example_form).serialize(),
    success: function(data) {
        if (!(data['success'])) {
            // Here we replace the form, for the
            $(example_form).replaceWith(data['form_html']);
        }
        else {
            // Here you can show the user a success message or do whatever you need
            $(example_form).find('.success-message').show();
        }
    },
    error: function () {
        $(example_form).find('.error-message').show()
    }
});
```

## Bootstrap horizontal forms[](https://django-crispy-forms.readthedocs.io/en/latest/crispy_tag_forms.html#bootstrap-horizontal-forms "Link to this heading")

![[Pasted image 20250214193926.png]]

The way you do horizontal forms in Bootstrap version 3 is setting some `col-lg-X` classes in labels and divs wrapping fields. This would mean a lot of hassle updating your layout objects for settings these classes, too much verbosity.

SOLUTION
Instead some `FormHelper` attributes have been added to help you easily achieve this. You will need to set only three attributes:
```python
helper.form_class = 'form-horizontal'
helper.label_class = 'col-lg-2'
helper.field_class = 'col-lg-8'
helper.layout = Layout(
    'email',
    'password',
    'remember_me',
    StrictButton('Sign in', css_class='btn-default'),
)
```


## Bootstrap inline forms

The way you do inline forms in Bootstrap version 3 is:
![[Pasted image 20250214194213.png]]


```python
helper.form_class = 'form-inline'
helper.field_template = 'bootstrap3/layout/inline_field.html'
helper.layout = Layout(
    'email',
    'password',
    'remember_me',
    StrictButton('Sign in', css_class='btn-default'),
)
```
Note: The form-inline class needs to be added to the form’s FORM tag. Therefore let crispy-forms render the FORM tag or add the form-inline class manually to the FORM tag in your template.


If you need to set attributes in a field, you have to use `InlineField` instead of `Field`:
from crispy_forms.bootstrap import InlineField

```python
helper.layout = Layout(
    InlineField('email', readonly=True),
    'password',
    [...]
)
```


## FormHelper with a form attached (Default layout)

`FormHelper` optionally can be passed an instance of a form. You would do it this way:
```python
from crispy_forms.helper import FormHelper

class ExampleForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper(self)
```

When you do this crispy-forms builds a default layout using `form.fields` for you, so you don’t have to manually list them all if your form is huge. If you later need to manipulate some bits of a big layout, using dynamic layouts is highly recommended, check [Updating layouts on the go](https://django-crispy-forms.readthedocs.io/en/latest/dynamic_layouts.html#dynamic-layouts).

Also, now the helper is able to cross match the layout with the form instance, being able to search by widget type if you are using dynamic API.

## Helper attributes you can set[](https://django-crispy-forms.readthedocs.io/en/latest/form_helper.html#helper-attributes-you-can-set "Link to this heading")

**template_pack**

Allows you to set what template pack you want to use at `FormHelper` level. This is useful for example when a website needs to render different styling forms for different use cases, like desktop website vs smartphone website.

**template**

When set allows you to render a form/formset using a custom template. Default template is at `{{ TEMPLATE_PACK }}/[whole_uni_form.html|whole_uni_formset.html]`.

**field_template**

When set allows you to render a form/formset using a custom field template. Default template is at `{{ TEMPLATE_PACK }}/field.html`.

**form_method = ``POST``**

Specifies form method attribute. You can see it to `POST` or `GET`. Defaults to `POST`.

**form_action**

Applied to the form action attribute. Can be a named URL in your URLconf that can be executed via the {% url %} template tag.

```python
url(r'^show/profile/$', 'show_my_profile_view', name='show_my_profile')
```

Sometimes you may want to add arguments to the URL, for that you will have to do in your view:
You can also point it to a URL ‘/whatever/blabla/’.

```python
from django.urls import reverse
form.helper.form_action = reverse('url_name', args=[event.id])
form.helper.form_action = reverse('url_name', kwargs={'book_id': book.id})
```

**attrs**

Added in 1.2.0, a dictionary to set any kind of form attributes. Underscores in keys are translated into hyphens. The recommended way when you need to set several form attributes in order to keep your helper tidy:

```html
``{'id': 'form-id', 'data_id': '/whatever'}``
<form id="form-id" data-id="/whatever" ...>
```

Example
```python
from crispy_forms.helper import FormHelper

class MyForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.attrs = {
            'id': 'form-id',
            'data_id': '/whatever',
            'data_user_type': 'admin'
        }
```

generated outout of form,
```html
<form id="form-id" data-id="/whatever" data-user-type="admin" ...>
```

**form_id**

Specifies form DOM id attribute. If no id provided then no id attribute is created on the form.

**form_class**

String containing separated CSS classes to be applied to form class attribute.

**form_tag = True**

It specifies if `<form></form>` tags should be rendered when using a Layout. If set to `False` it renders the form without the `<form></form>` tags. Defaults to `True`.

**disable_csrf = False**

Disable CSRF token, when done, crispy-forms won’t use `{% csrf_token %}` tag. This is useful when rendering several forms using `{% crispy %}` tag and `form_tag = False` csrf_token gets rendered several times.

**form_error_title**

If you are rendering a form using `{% crispy %}` tag and it has `non_field_errors` to display, they are rendered in a div. You can set the title of the div with this attribute. Example: “Form Errors”.

When there are non-field errors (errors that don't belong to a specific field), crispy-forms will render them in a div with this title.
sample output

```python
from crispy_forms.helper import FormHelper

class MyForm(forms.Form):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_error_title = "Form Errors"
```
inside our view
```python
# In your view
form.add_error(None, "This form has global errors")
```

```html
<div id="div_id_my_form_errors">
    <h3>Form Errors</h3>
    <p>This form has global errors</p>
</div>
```

**formset_error_title**

If you are rendering a formset using `{% crispy %}` tag and it has `non_form_errors` to display, they are rendered in a div. You can set the title of the div with this attribute. Example: “Formset Errors”.

sample output

```python
from crispy_forms.helper import FormHelper

class MyFormsetHelper(FormHelper):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.formset_error_title = "Formset Errors"

# When using with a formset
formset = MyFormSet()
helper = MyFormsetHelper()
```
View
```python
# In your view
formset.non_form_errors().append("This formset has validation errors")
```

```html
{% load crispy_forms_tags %}
{% crispy formset helper %}

<div id="div_id_formset_errors">
    <h3>Formset Errors</h3>
    <p>This formset has validation errors</p>
</div>
```

**form_show_errors = True**

Default set to `True`. It decides whether to render or not form errors. If set to `False`, form.errors will not be visible even if they happen. You have to manually render them customizing your template. This allows you to customize error output.

**render_unmentioned_fields = False**

By default django-crispy-forms renders the layout specified if it exists strictly, which means it only renders what the layout mentions, unless your form has `Meta.fields` and `Meta.exclude` defined, in that case it uses them. 

If you want to render unmentioned fields (all form fields), for example if you are worried about forgetting mentioning them you have to set this property to `True`. It defaults to `False`.

**render_hidden_fields = False**

By default django-crispy-forms renders the layout specified if it exists strictly. Sometimes you might be interested in rendering all form’s hidden fields no matter if they are mentioned or not. Useful when trying to render forms with layouts as part of a formset with hidden primary key fields. It defaults to `False`.

**render_required_fields = False**

By default django-crispy-forms renders the layout specified if it exists strictly. Sometimes you might be interested in rendering all form’s required fields no matter if they are mentioned or not. It defaults to `False`.

**include_media = True**

By default django-crispy-forms renders all form media for you within the form. If you want to render form media yourself manually outside the form, set this to `False`. 

If you want to globally prevent rendering of form media, override the FormHelper class with this setting modified. It defaults to `True`.

## Bootstrap Helper attributes
There are currently some helper attributes that only have functionality for a specific template pack.

**help_text_inline = False**

Sets whether help texts should be rendered inline or block. If set to `True` help texts will be rendered using `help-inline` class, otherwise using `help-block`. By default text messages are rendered in block mode.

**error_text_inline = True**

Sets whether to render error messages inline or block. If set to `True` errors will be rendered using `help-inline` class, otherwise using `help-block`. By default error messages are rendered in inline mode.

**form_show_labels = True**

Default set to `True`. Determines whether or not to render the form’s field labels.

## Bootstrap 3 Helper attributes[](https://django-crispy-forms.readthedocs.io/en/latest/form_helper.html#bootstrap-3-helper-attributes "Link to this heading")

All previous, `bootstrap` (version 2) attributes are also settable in bootstrap 3 template pack `FormHelpers`. Here are listed the ones, that are only available in `bootstrap3` template pack:

**label_class = ‘’**

Default set to `''`. This class will be applied to every label, this is very useful to do horizontal forms. Set it for example like this `label_class = col-lg-2`.

**field_class = ‘’**

Default set to `''`. This class will be applied to every div `controls` wrapping a field. This is useful for doing horizontal forms. Set it for example like this `field_class = col-lg-8`.

## Bootstrap 4 Helper attributes[](https://django-crispy-forms.readthedocs.io/en/latest/form_helper.html#bootstrap-4-helper-attributes "Link to this heading")

All previous, `bootstrap` (version 2 and 3) attributes are also settable in bootstrap 4 template pack `FormHelpers`. Here are listed the ones, that are only available in `bootstrap4` template pack:

**use_custom_control = True**

Enables the [optional UI customization](https://getbootstrap.com/docs/4.3/components/forms/#custom-forms) of the template pack for radio, checkbox, select and file field. Useful when you already have customization based on the default interpretation of the template pack. Setting to `False` results in the [standard bootstrap](https://getbootstrap.com/docs/4.3/components/forms/#checkboxes-and-radios) classes being applied for radio and checkbox, and Django rendering for file field. See table below for examples.

The file field requires [additional JS](https://www.w3schools.com/bootstrap4/bootstrap_forms_custom.asp#myFile) to enable its functionality, it is provided within the template pack as vanilla JS.

Defaults to `True`.

![[Pasted image 20250214201757.png]]