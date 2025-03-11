Drag-and-drop enhances the user interface, offering a natural way to reorder elements that is more intuitive than using numbers or clicking buttons. It is also a time-saver for course instructors, who will be able to reorganize course modules and their contents easily.

To implement this feature, we will use the HTML5 Sortable library, which simplifies the process of creating sortable lists using the native HTML5 Drag and Drop API.

When users finish dragging a module, you will use the JavaScript Fetch API to send an asynchronous HTTP request to the server that stores the new module order.

You can read more information about the HTML5 Drag and Drop API at 
- https://www.w3schools.com/html/html5_draganddrop.asp. 
You can find examples built with the HTML5 Sortable library at 
- https://lukasoppermann.github.io/html5sortable/. 

Documentation for the HTML5 Sortable library is available at https://github.com/lukasoppermann/html5sortable.

Django Braces
```python
    python -m pip install django-braces==1.15.0
```

django-braces is a third-party module that contains a collection of generic mixins for Django. These mixins provide additional features for class-based views that are useful for various common scenarios. You can see a list of all mixins provided by django-braces at https://django-braces.readthedocs.io/.

Our application will use the following mixins
- CsrfExemptMixin: 
	Used to avoid checking the cross-site request forgery (CSRF) token in the POST requests. You need this to perform AJAX POST requests without the need to pass a csrf_token.

- JsonRequestResponseMixin: 
	Parses the request data as JSON and also serializes the response as JSON and returns an HTTP response with the application/json content type.

load the html5 library, 
```javascript
{% block include_js %}
<script src="https://cdnjs.cloudflare.com/ajax/libs/html5sortable/0.13.3/html5sortable.min.js"></script>
{% endblock %}

{% block domready %}
var options = {
	method: 'POST',
	mode: 'same-origin'
}
const moduleOrderUrl = '{% url "module_order" %}';
sortable('#modules', {
	forcePlaceholderSize: true,
	placeholderClass: 'placeholder'
});
{% endblock %}
```

Define a sortable element for the HTML element with id="modules"
Use a CSS selector # to select the element with the given id.

Start dragging an item, the HTML5 Sortable library creates a placeholder item so that you can easily see where the element will be placed.


When you drag a module to a different position, you need to send an HTTP request to the server to store the new order. This can be done by attaching an event handler to the sortable element and sending a request to the server using the JavaScript Fetch API.

```javascript

remove ;  and end and add.
[0].addEventListener('sortupdate', function(e) {
modulesOrder = {};
var modules = document.querySelectorAll('#modules li');
modules.forEach(function (module, index) {
  // update module index
  modulesOrder[module.dataset.id] = index;
  // update index in HTML element
  module.querySelector('.order').innerHTML = index + 1;
});
// add new order to the HTTP request options
options['body'] = JSON.stringify(modulesOrder);
// send HTTP request
fetch(moduleOrderUrl, options)
});
```

In the new code, an event listener is created for the sortupdate event of the sortable element. The sortupdate event is triggered when an element is dropped in a different position. The following tasks are performed in the event function:

1. An empty modulesOrder dictionary is created. The keys for this dictionary will be the module IDs, and the values will contain the index of each module.

2. The list elements of the #modules HTML element are selected with document.querySelectorAll(), using the #modules li CSS selector.

3. forEach() is used to iterate over each list element.

4. The new index for each module is stored in the modulesOrder dictionary. The ID of each module is retrieved from the HTML data-id attribute by accessing module.dataset.id. You use the ID as the key of the modulesOrder dictionary and the new index of the module as the value.

5. The order displayed for each module is updated by selecting the element with the order CSS class. Since the index is zero-based and we want to display a one-based index, we add 1 to index.

6. A key named body is added to the options dictionary with the new order contained in modulesOrder. The JSON.stringify() method converts the JavaScript object into a JSON string. This is the body for the HTTP request to update the module order.

7. The Fetch API is used by creating a fetch() HTTP request to update the module order. The ModuleOrderView view that corresponds to the module_order URL takes care of updating the order of the modules.