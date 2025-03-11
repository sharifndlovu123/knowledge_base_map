## Installation
### [Via A CDN (e.g. unpkg.com)](https://htmx.org/docs/#via-a-cdn-e-g-unpkg-com)

The fastest way to get going with htmx is to load it via a CDN. You can simply add this to your head tag and get going:

```html
<script src="https://unpkg.com/htmx.org@2.0.4" integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+" crossorigin="anonymous"></script>
```

An unminified version is also available as well:

```html
<script src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.js" integrity="sha384-oeUn82QNXPuVkGCkcrInrS1twIxKhkZiFfr2TdiuObZ3n3yIeMiqcRzkIcguaof1" crossorigin="anonymous"></script>
```

While the CDN approach is extremely simple, you may want to consider [not using CDNs in production](https://blog.wesleyac.com/posts/why-not-javascript-cdn).

### [Download a copy](https://htmx.org/docs/#download-a-copy)

The next easiest way to install htmx is to simply copy it into your project.

Download `htmx.min.js` [from unpkg.com](https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js) and add it to the appropriate directory in your project and include it where necessary with a `<script>` tag:

```html
<script src="/path/to/htmx.min.js"></script>
```


## AJAX core
The core of htmx is a set of attributes that allow you to issue AJAX requests directly from HTML:

| Attribute                                           | Description                                |
| --------------------------------------------------- | ------------------------------------------ |
| [hx-get](https://htmx.org/attributes/hx-get/)       | Issues a `GET` request to the given URL    |
| [hx-post](https://htmx.org/attributes/hx-post/)     | Issues a `POST` request to the given URL   |
| [hx-put](https://htmx.org/attributes/hx-put/)       | Issues a `PUT` request to the given URL    |
| [hx-patch](https://htmx.org/attributes/hx-patch/)   | Issues a `PATCH` request to the given URL  |
| [hx-delete](https://htmx.org/attributes/hx-delete/) | Issues a `DELETE` request to the given URL |

Simple example
```html
<button hx-put="/messages">
    Put To Messages
</button>
```

This tells the browser:

> When a user clicks on this button, issue a PUT request to the URL /messages and load the response into the button


## [Triggering Requests](https://htmx.org/docs/#triggers)

By default, AJAX requests are triggered by the “natural” event of an element:

- `input`, `textarea` & `select` are triggered on the `change` event
- `form` is triggered on the `submit` event
- everything else is triggered by the `click` event

if you want different behaviour you can use the [hx-trigger](https://htmx.org/attributes/hx-trigger/) attribute to specify which event will cause the request.

Here is a `div` that posts to `/mouse_entered` when a mouse enters it:

```html
<div hx-post="/mouse_entered" hx-trigger="mouseenter">
    [Here Mouse, Mouse!]
</div>
```

### 📝 **Common HTMX `hx-trigger` Events**

Here are some frequently used events with `hx-trigger`:

| Event               | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `click` (default)   | Fires when an element is clicked                            |
| `mouseenter`        | Fires when the mouse enters the element                     |
| `mouseleave`        | Fires when the mouse leaves the element                     |
| `change`            | Fires when an input field value changes                     |
| `input`             | Fires while typing in an input field                        |
| `keydown` / `keyup` | Fires when a key is pressed/released                        |
| `focus` / `blur`    | Fires when an input gains/loses focus                       |
| `submit`            | Fires when a form is submitted                              |
| `load`              | Fires when the element is loaded (useful for auto-fetching) |

#### [Trigger Modifiers](https://htmx.org/docs/#trigger-modifiers)
A trigger can also have a few additional modifiers that change its behaviour.
request to only happen once, you can use the `once` modifier for the trigger:

```html
<div hx-post="/mouse_entered" hx-trigger="mouseenter once">
    [Here Mouse, Mouse!]
</div>
```

### 🔥 **Common HTMX `hx-trigger` Modifiers**

| Modifier            | Description                                                         | Example                                   |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| `once`              | Fires the event only once                                           | `hx-trigger="click once"`                 |
| `changed`           | Fires only when the value actually changes (for inputs)             | `hx-trigger="change changed"`             |
| `delay:Nms`         | Delays event triggering by `N` milliseconds                         | `hx-trigger="click delay:500ms"`          |
| `throttle:Nms`      | Ensures the event fires at most once every `N` milliseconds         | `hx-trigger="input throttle:300ms"`       |
| `from:event/css`    | Fires only if triggered from a specific event. Allows CSS selectors | `hx-trigger="click from:keydown"`         |
| `consume`           | Prevents the event from bubbling up to parent elements              | `hx-trigger="click consume"`              |
| `target:<selector>` | Triggers the event only when a specific child element is targeted   | `hx-trigger="click target:.my-class"`     |
| `once-from:event`   | Fires once only when the specified event happens                    | `hx-trigger="click once-from:mouseenter"` |
You can use these attributes to implement many common UX patterns, such as [Active Search](https://htmx.org/examples/active-search/):

```html
<input type="text" name="q"
    hx-get="/trigger_delay"
    hx-trigger="keyup changed delay:500ms"
    hx-target="#search-results"
    placeholder="Search...">
<div id="search-results"></div>
```
This input will issue a request 500 milliseconds after a key up event if the input has been changed and inserts the results into the `div` with the id `search-results`.

Multiple triggers can be specified in the [hx-trigger](https://htmx.org/attributes/hx-trigger/) attribute, separated by commas.

```html
<button hx-get="/data" hx-trigger="click, mouseenter">
    Load Data on Click or Hover
</button>
```

#### [Trigger Filters](https://htmx.org/docs/#trigger-filters)

You may also apply trigger filters by using square brackets after the event name, enclosing a javascript expression that will be evaluated. If the expression evaluates to `true` the event will trigger, otherwise it will not.

Here is an example that triggers only on a Control-Click of the element

```html
<div hx-get="/clicked" hx-trigger="click[ctrlKey]">
    Control Click Me
</div>
```

#### [Special Events](https://htmx.org/docs/#special-events)

htmx provides a few special events for use in [hx-trigger](https://htmx.org/attributes/hx-trigger/):

- `load` - fires once when the element is first loaded
- `revealed` - fires once when an element first scrolls into the viewport
- `intersect` - fires once when an element first intersects the viewport. This supports two additional options:
    - `root:<selector>` - a CSS selector of the root element for intersection
    - `threshold:<float>` - a floating point number between 0.0 and 1.0, indicating what amount of intersection to fire the event on

You can also use custom events to trigger requests if you have an advanced use case.

#### [Polling](https://htmx.org/docs/#polling)

If you want an element to poll the given URL rather than wait for an event, you can use the `every` syntax with the [`hx-trigger`](https://htmx.org/attributes/hx-trigger/) attribute:

```html
<div hx-get="/news" hx-trigger="every 2s"></div>
```

This tells htmx

> Every 2 seconds, issue a GET to /news and load the response into the div

 stop polling from a server response you can respond with the HTTP response code [`286`](https://en.wikipedia.org/wiki/86_\(term\)) and the element will cancel the polling.

#### [Load Polling](https://htmx.org/docs/#load_polling)

Another technique that can be used to achieve polling in htmx is “load polling”, where an element specifies a `load` trigger along with a delay, and replaces itself with the response:

```html
<div hx-get="/messages"
    hx-trigger="load delay:1s"
    hx-swap="outerHTML">
</div>
```

If the `/messages` end point keeps returning a div set up this way, it will keep “polling” back to the URL every second.

Load polling can be useful in situations where a poll has an end point at which point the polling terminates, such as when you are showing the user a [progress bar](https://htmx.org/examples/progress-bar/).

### [Request Indicators](https://htmx.org/docs/#indicators)

When an AJAX request is issued it is often good to let the user know that something is happening since the browser will not give them any feedback. You can accomplish this in htmx by using `htmx-indicator` class.
The `htmx-indicator` class is defined so that the opacity of any element with this class is 0 by default, making it invisible but present in the DOM.

use for loading
```html
<button hx-get="/click">
    Click Me!
    <img class="htmx-indicator" src="/spinner.gif">
</button>
```
The `htmx-request` class will cause a child element with the `htmx-indicator` class on it to transition to an opacity of 1, showing the indicator.

If you want the `htmx-request` class added to a different element, you can use the [hx-indicator](https://htmx.org/attributes/hx-indicator/) attribute with a CSS selector to do so:

```html
<div>
    <button hx-get="/click" hx-indicator="#indicator">
        Click Me!
    </button>
    <img id="indicator" class="htmx-indicator" src="/spinner.gif"/>
</div>
```

Here we call out the indicator explicitly by id. Note that we could have placed the class on the parent `div` as well and had the same effect.

You can also add the [`disabled` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) to elements for the duration of a request by using the [hx-disabled-elt](https://htmx.org/attributes/hx-disabled-elt/) attribute.

### [Targets](https://htmx.org/docs/#targets)

If you want the response to be loaded into a different element other than the one that made the request, you can use the [hx-target](https://htmx.org/attributes/hx-target/) attribute, which takes a CSS selector. Looking back at our Live Search example:

```html
<input type="text" name="q"
    hx-get="/trigger_delay"
    hx-trigger="keyup delay:500ms changed"
    hx-target="#search-results"
    placeholder="Search...">
<div id="search-results"></div>
```
#### [Extended CSS Selectors](https://htmx.org/docs/#extended-css-selectors)

`hx-target`, and most attributes that take a CSS selector, support an “extended” CSS syntax:

- You can use the `this` keyword, which indicates that the element that the `hx-target` attribute is on is the target
```html
<input type="text" name="q"
    hx-get="/search"
    hx-trigger="keyup delay:500ms changed"
    hx-target="this"
    placeholder="Type here...">

```
- The `closest <CSS selector>` syntax will find the [closest](https://developer.mozilla.org/docs/Web/API/Element/closest) ancestor element or itself, that matches the given CSS selector. (e.g. `closest tr` will target the closest table row to the element)
- The `next <CSS selector>` syntax will find the next element in the DOM matching the given CSS selector.
- The `previous <CSS selector>` syntax will find the previous element in the DOM matching the given CSS selector.
- `find <CSS selector>` which will find the first child descendant element that matches the given CSS selector. (e.g `find tr` would target the first child descendant row to the element) , meaning first child of owner.
### [Swapping](https://htmx.org/docs/#swapping)

htmx offers a few different ways to swap the HTML returned into the DOM. By default, the content replaces the `innerHTML` of the target element. You can modify this by using the [hx-swap](https://htmx.org/attributes/hx-swap/) attribute with any of the following values:
Here’s a table with the information formatted properly:

| **Name**      | **Description**                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| `innerHTML`   | Default. Inserts content **inside** the target element, replacing its inner content.                            |
| `outerHTML`   | Replaces the **entire** target element with the returned content.                                               |
| `afterbegin`  | Prepends content **before the first child** inside the target element.                                          |
| `beforebegin` | Inserts content **before** the target element (in its parent).                                                  |
| `beforeend`   | Appends content **after the last child** inside the target element.                                             |
| `afterend`    | Inserts content **after** the target element (in its parent).                                                   |
| `delete`      | Deletes the target element, **regardless of response** content.                                                 |
| `none`        | Does **not** append content from the response (but Out-of-Band Swaps and Response Headers are still processed). |
Swapping Examples
```html

    <h2>HTMX Swap Examples</h2>

    <!-- 1. Default: innerHTML (Replaces the content inside the div) -->
    <div id="innerHTML" class="box">

	    <button hx-get="/clicked" hx-swap="innerHTML">
	        innerHTML (default)
	    <!-- ✅ This paragraph will be replaced with new content -->
	    </button>
	</div>

    <!-- 2. outerHTML (Replaces the entire div) -->
    <div id="outerHTML" class="box">
        <button hx-get="/data" hx-swap="outerHTML">
            outerHTML
        </button>
        <p>This whole div will be replaced</p> 
        <!-- ✅ The entire div gets replaced -->
    </div>

    <!-- 3. afterbegin (Prepends inside the div, before the first child) -->
    <div id="afterbegin" class="box">
        <button hx-get="/data" hx-swap="afterbegin">
            afterbegin
        </button>
        <p>First child</p> 
        <!-- ✅ New content will be added before this -->
    </div>

    <!-- 4. beforebegin (Prepends before the div in its parent) -->
    <div id="beforebegin" class="box">
        <button hx-get="/data" hx-swap="beforebegin">
            beforebegin
        </button>
        <p>Content inside</p> 
        <!-- ✅ New content will be added before this whole div -->
    </div>

    <!-- 5. beforeend (Appends inside the div, after the last child) -->
    <div id="beforeend" class="box">
        <button hx-get="/data" hx-swap="beforeend">
            beforeend
        </button>
        <p>Existing content</p> 
        <!-- ✅ New content will be added after this -->
    </div>

    <!-- 6. afterend (Appends after the div in its parent) -->
    <div id="afterend" class="box">
        <button hx-get="/data" hx-swap="afterend">
            afterend
        </button>
        <p>Inside content</p> 
        <!-- ✅ New content will be added after this whole div -->
    </div>

    <!-- 7. delete (Removes the div entirely) -->
    <div id="delete" class="box">
        <button hx-get="/data" hx-swap="delete">
            delete
        </button>
        <p>This div will disappear</p> 
        <!-- ✅ This div will be removed regardless of response -->
    </div>

    <!-- 8. none (Does not swap content but processes Out-of-Band swaps) -->
    <div id="none" class="box">
        <button hx-get="/data" hx-swap="none">
            none
        </button>
        <p>This content will remain unchanged</p> 
        <!-- ✅ Content remains the same, but Out-of-Band swaps still apply -->
    </div>


```

#### [Morph Swaps](https://htmx.org/docs/#morphing)
Htmx also supports _morphing_ swaps, via extensions. Morphing swaps attempt to _merge_ new content into the existing DOM, rather than simply replacing it. They often do a better job preserving things like focus, video state, etc. by mutating existing nodes in-place during the swap operation, at the cost of more CPU.

The following extensions are available for morph-style swaps:

- [Idiomorph](https://htmx.org/extensions/idiomorph) - A morphing algorithm created by the htmx developers.
- [Morphdom Swap](https://github.com/bigskysoftware/htmx-extensions/blob/main/src/morphdom-swap/README.md) - Based on the [morphdom](https://github.com/patrick-steele-idem/morphdom), the original DOM morphing library.
- [Alpine-morph](https://github.com/bigskysoftware/htmx-extensions/blob/main/src/alpine-morph/README.md) - Based on the [alpine morph](https://alpinejs.dev/plugins/morph) plugin, plays well with alpine.js

#### [View Transitions](https://htmx.org/docs/#view-transitions)

The new, experimental [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) gives developers a way to create an animated transition between different DOM states. It is still in active development and is not available in all browsers, but htmx provides a way to work with this new API that falls back to the non-transition mechanism if the API is not available in a given browser.

You can experiment with this new API using the following approaches:

- Set the `htmx.config.globalViewTransitions` config variable to `true` to use transitions for all swaps
- Use the `transition:true` option in the `hx-swap` attribute
- If an element swap is going to be transitioned due to either of the above configurations, you may catch the `htmx:beforeTransition` event and call `preventDefault()` on it to cancel the transition.

View Transitions can be configured using CSS, as outlined in [the Chrome documentation for the feature](https://developer.chrome.com/docs/web-platform/view-transitions/#simple-customization).

You can see a view transition example on the [Animation Examples](https://htmx.org/examples/animations#view-transitions) page.

#### [Swap Options](https://htmx.org/docs/#swap-options)

The [hx-swap](https://htmx.org/attributes/hx-swap/) attribute supports many options for tuning the swapping behavior of htmx. For example, by default htmx will swap in the title of a title tag found anywhere in the new content. You can turn this behavior off by setting the `ignoreTitle` modifier to true:

```html
    <button hx-post="/like" hx-swap="outerHTML ignoreTitle:true">Like</button>
```

|Option|Description|
|---|---|
|**transition**|`true` or `false`, whether to use the view transition API for this swap.|
|**swap**|The swap delay to use (e.g., `100ms`) between when old content is cleared and new content is inserted.|
|**settle**|The settle delay to use (e.g., `100ms`) between when new content is inserted and when it is settled.|
|**ignoreTitle**|If set to `true`, any title found in the new content will be ignored and will not update the document title.|
|**scroll**|`top` or `bottom`, will scroll the target element to its top or bottom.|
|**show**|`top` or `bottom`, will scroll the target element’s top or bottom into view.|

### [Synchronization](https://htmx.org/docs/#synchronization)

Often you want to coordinate the requests between two elements. For example, you may want a request from one element to supersede the request of another element, or to wait until the other element’s request has finished.

htmx offers a [`hx-sync`](https://htmx.org/attributes/hx-sync/) attribute to help you accomplish this.

Consider a race condition between a form submission and an individual input’s validation request in this HTML:

```html
<form hx-post="/store">
    <input id="title" name="title" type="text"
        hx-post="/validate"
        hx-trigger="change">
    <button type="submit">Submit</button>
</form>
```
Without using `hx-sync`, filling out the input and immediately submitting the form triggers two parallel requests to `/validate` and `/store`.

Using `hx-sync="closest form:abort"` on the input will watch for requests on the form and abort the input’s request if a form request is present or starts while the input request is in flight:

Declarative way...
```html
<form hx-post="/store">
    <input id="title" name="title" type="text"
        hx-post="/validate"
        hx-trigger="change"
        hx-sync="closest form:abort">
    <button type="submit">Submit</button>
</form>
```

Programmatic way to cancel requests: you can send the `htmx:abort` event to an element to cancel any in-flight requests:
```html
<button id="request-button" hx-post="/example">
    Issue Request
</button>
<button onclick="htmx.trigger('#request-button', 'htmx:abort')">
    Cancel Request
</button>
```

More examples and details can be found on the [`hx-sync` attribute page.](https://htmx.org/attributes/hx-sync/)

### [CSS Transitions](https://htmx.org/docs/#css_transitions)

htmx makes it easy to use [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions) without javascript.

Consider this HTML content:

```html
<div id="div1">Original Content</div>
```

Imagine this content is replaced by htmx via an ajax request with this new content:

```html
<div id="div1" class="red">New Content</div>
```

Note two things:

- The div has the _same_ id in the original and in the new content
- The `red` class has been added to the new content

Given this situation, we can write a CSS transition from the old state to the new state:
```css
.red {
    color: red;
    transition: all ease-in 1s ;
}
```

When htmx swaps in this new content, it will do so in such a way that the CSS transition will apply to the new content, giving you a nice, smooth transition to the new state.

So, in summary, all you need to do to use CSS transitions for an element is keep its `id` stable across requests!

You can see the [Animation Examples](https://htmx.org/examples/animations/) for more details and live demonstrations.

#### [Details](https://htmx.org/docs/#details)

To understand how CSS transitions actually work in htmx, you must understand the underlying swap & settle model that htmx uses.

When new content is received from a server, before the content is swapped in, the existing content of the page is examined for elements that match by the `id` attribute. If a match is found for an element in the new content, the attributes of the old content are copied onto the new element before the swap occurs. The new content is then swapped in, but with the _old_ attribute values. Finally, the new attribute values are swapped in, after a “settle” delay (20ms by default). A little crazy, but this is what allows CSS transitions to work without any javascript by the developer.

### CSRF TOKEN
Place under base.html 
```html
<script>
	document.body.addEventListener('htmx:configRequest', (event) => {
		event.detail.headers['X-CSRFToken'] = "{{ csrf_token }}";
	});
</script>
```
### [Out of Band Swaps](https://htmx.org/docs/#oob_swaps)

If you want to swap content from a response directly into the DOM by using the `id` attribute you can use the [hx-swap-oob](https://htmx.org/attributes/hx-swap-oob/) attribute in the _response_ html:

```html
<div id="message" hx-swap-oob="true">Swap me directly!</div>
Additional Content
```

In this response, `div#message` would be swapped directly into the matching DOM element, while the additional content would be swapped into the target in the normal manner.

You can use this technique to “piggy-back” updates on other requests.

### [Parameters](https://htmx.org/docs/#parameters)

By default, an element that causes a request will include its value if it has one. If the element is a form it will include the values of all inputs within it.

As with HTML forms, the `name` attribute of the input is used as the parameter name in the request that htmx sends.

Additionally, if the element causes a non-`GET` request, the values of all the inputs of the nearest enclosing form will be included.

```html
<div>
    <button hx-post="/register" hx-include="[name='email']">
        Register!
    </button>
    Enter email: <input name="email" type="email"/>
</div>
```

If you wish to include the values of other elements, you can use the [hx-include](https://htmx.org/attributes/hx-include/) attribute with a CSS selector of all the elements whose values you want to include in the request.

If you wish to filter out some parameters you can use the [hx-params](https://htmx.org/attributes/hx-params/) attribute.

Finally, if you want to programmatically modify the parameters, you can use the [htmx:configRequest](https://htmx.org/events/#htmx:configRequest) event.

### **`hx-values` vs. `hx-include` in HTMX**

Both `hx-values` and `hx-include` are used to send additional data in an HTMX request, but they work differently.

---

### **1️⃣ `hx-values` → Manually Add Data**

- Used to add **static or dynamic key-value pairs** to the request payload.
- You define the data **directly in the element**.
- Works for `POST`, `PUT`, `DELETE`, etc.

#### **Example: Sending JSON-like Data**

```html
<button 
    hx-post="/submit" 
    hx-values='{"user_id": "123", "action": "register"}'>
    Register
</button>
```

📌 **Sent Data:**

```json
{
    "user_id": "123",
    "action": "register"
}
```

✔️ Useful when you want to send extra **static or JavaScript-generated values**.

---

### **2️⃣ `hx-include` → Include Input Fields**

- Selects other form elements **outside** the triggering element and includes them in the request.
- Helps when you want to **send inputs without wrapping everything inside a `<form>`**.

#### **Example: Including an Input Field**

```html
<input type="email" name="email" id="email-input" />

<button 
    hx-post="/register"
    hx-include="#email-input">
    Register
</button>
```

📌 **Sent Data (if user enters `test@example.com`):**

```json
{
    "email": "test@example.com"
}
```

✔️ Useful when you have input fields **outside of the button or form**.

---

### **Key Differences**

|Feature|`hx-values`|`hx-include`|
|---|---|---|
|How it Works|Manually defines values|Collects values from other elements|
|Works with|Any request type|Primarily for `POST` & `PUT`|
|Use Case|Sending extra static/dynamic values|Including external input fields|

#### [File Upload](https://htmx.org/docs/#files)

If you wish to upload files via an htmx request, you can set the [hx-encoding](https://htmx.org/attributes/hx-encoding/) attribute to `multipart/form-data`. This will use a `FormData` object to submit the request, which will properly include the file in the request.

Note that depending on your server-side technology, you may have to handle requests with this type of body content very differently.

Note that htmx fires a `htmx:xhr:progress` event periodically based on the standard `progress` event during upload, which you can hook into to show the progress of the upload.

See the [examples section](https://htmx.org/examples/) for more advanced form patterns, including [progress bars](https://htmx.org/examples/file-upload/) and [error handling](https://htmx.org/examples/file-upload-input/).

### [Confirming Requests](https://htmx.org/docs/#confirming)

Often you will want to confirm an action before issuing a request. htmx supports the [`hx-confirm`](https://htmx.org/attributes/hx-confirm/) attribute, which allows you to confirm an action using a simple javascript dialog:

```html
<button hx-delete="/account" hx-confirm="Are you sure you wish to delete your account?">
    Delete My Account
</button>
```
Using events you can implement more sophisticated confirmation dialogs. The [confirm example](https://htmx.org/examples/confirm/) shows how to use [sweetalert2](https://sweetalert2.github.io/) library for confirmation of htmx actions.

#### [Confirming Requests Using Events](https://htmx.org/docs/#confirming-requests-using-events)

Another option to do confirmation with is via the [`htmx:confirm` event](https://htmx.org/events/#htmx:confirm). This event is fired on _every_ trigger for a request (not just on elements that have a `hx-confirm` attribute) and can be used to implement asynchronous confirmation of the request.

Here is an example using [sweet alert](https://sweetalert.js.org/guides/) on any element with a `confirm-with-sweet-alert='true'` attribute on it:

```javascript
document.body.addEventListener('htmx:confirm', function(evt) {
  if (evt.target.matches("[confirm-with-sweet-alert='true']")) {
    evt.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Are you sure you are sure?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        evt.detail.issueRequest();
      }
    });
  }
});
```

Full example
```html
<head>
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
</head>
<body>
    <section>
        <div>
            <button hx-delete="/account" confirm-with-sweet-alert="true">
                Delete My Account
            </button>
        </div>
    </section>
    <script>
        document.body.addEventListener('htmx:confirm', function(evt) {
            if (evt.target.matches("[confirm-with-sweet-alert='true']")) {
              evt.preventDefault();
              swal({
                title: "Are you sure?",
                text: "Are you sure you are sure?",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              }).then((confirmed) => {
                if (confirmed) {
                  evt.detail.issueRequest();
                }
              });
            }
          });
    </script>
</body>
```

# Sortable

In this example we show how to integrate the [Sortable](https://sortablejs.github.io/Sortable/) javascript library with htmx.
```html
<script src="[https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js](https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/Sortable.min.js)"></script>
```

To begin we initialize the `.sortable` class with the `Sortable` javascript library:

```js
htmx.onLoad(function(content) {
    var sortables = content.querySelectorAll(".sortable");
    for (var i = 0; i < sortables.length; i++) {
      var sortable = sortables[i];
      var sortableInstance = new Sortable(sortable, {
          animation: 150,
          ghostClass: 'blue-background-class',

          // Make the `.htmx-indicator` unsortable
          filter: ".htmx-indicator",
          onMove: function (evt) {
            return evt.related.className.indexOf('htmx-indicator') === -1;
          },

          // Disable sorting on the `end` event
          onEnd: function (evt) {
            this.option("disabled", true);
          }
      });

      // Re-enable sorting on the `htmx:afterSwap` event
      sortable.addEventListener("htmx:afterSwap", function() {
        sortableInstance.option("disabled", false);
      });
    }
})
```

Next, we create a form that has some sortable divs within it, and we trigger an ajax request on the `end` event, fired by Sortable.js:

```html
<form class="sortable" hx-post="/items" hx-trigger="end">
  <div class="htmx-indicator">Updating...</div>
  <div><input type='hidden' name='item' value='1'/>Item 1</div>
  <div><input type='hidden' name='item' value='2'/>Item 2</div>
  <div><input type='hidden' name='item' value='3'/>Item 3</div>
  <div><input type='hidden' name='item' value='4'/>Item 4</div>
  <div><input type='hidden' name='item' value='5'/>Item 5</div>
</form>
```

Note that each div has a hidden input inside of it that specifies the item id for that row.

When the list is reordered via the Sortable.js drag-and-drop, the `end` event will be fired. htmx will then post the item ids in the new order to `/items`, to be persisted by the server.