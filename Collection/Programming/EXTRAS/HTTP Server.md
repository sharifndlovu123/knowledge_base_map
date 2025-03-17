	## **Understanding HTTP and Handling It in Code**

HTTP (Hypertext Transfer Protocol) is the foundation of communication on the web. It operates on a client-server model where a client (e.g., a browser or API consumer) sends requests to a server, and the server responds accordingly.

This breakdown will cover the essential components of handling HTTP in code, including initializing an HTTP server, handling requests and responses, managing headers, and handling status codes.

The samples provided below are in Java, but the concepts are broken down in a universal manner, subheading by subheading. This means the ideas remain the same, though the code may vary across different languages or libraries.

---

### **1. Initializing an HTTP Server**

Every HTTP server must:

- Open a network socket on a port (default: `80` for HTTP, `443` for HTTPS).
- Listen for incoming client requests.
- Process requests and send responses.

Example (Java):

```java
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;

public class SimpleHttpServer {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.start();
        System.out.println("Server started on port 8080");
    }
}
```

> This initializes a basic HTTP server that listens on port `8080`.

---

### **2. Handling HTTP Requests and Responses**

Once the server is running, it needs to process requests and send appropriate responses.

- **Handling an Exchange (Client-Server Communication)**
    - `request method`: GET, POST, PUT, DELETE, etc.
    - `request headers`: Metadata (e.g., `Content-Type`, `Authorization`).
    - `request body`: Data (for methods like POST or PUT).
    - `response headers`: Metadata for responses.
    - `response body`: The actual data returned.

Example:

```java
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;

public class RequestHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String response = "Hello, World!";
        exchange.sendResponseHeaders(200, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
```

> This handles an HTTP request and sends a `200 OK` response with "Hello, World!".

---

### **3. Managing Headers**

HTTP headers are essential for defining request and response properties.

#### **Setting Response Headers**

```java
exchange.getResponseHeaders().set("Content-Type", "text/plain");
```

#### **Reading Request Headers**

```java
String userAgent = exchange.getRequestHeaders().getFirst("User-Agent");
```

---

### **4. HTTP Methods and Status Codes**

Each HTTP request has a **method** and should return an appropriate **status code**.

#### **Common Methods**

|Method|Description|
|---|---|
|GET|Retrieve data|
|POST|Submit data|
|PUT|Update resource|
|DELETE|Remove resource|

#### **Common Status Codes**

|Code|Meaning|
|---|---|
|200|OK|
|201|Created|
|400|Bad Request|
|404|Not Found|
|500|Internal Server Error|

Example:

```java
exchange.sendResponseHeaders(404, -1); // Sends a 404 Not Found response
```

---

### **5. Handling Query Parameters and Request Body**

**Extracting Query Parameters:**

```java
String query = exchange.getRequestURI().getQuery();
```

**Reading the Request Body:**

```java
InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
BufferedReader br = new BufferedReader(isr);
String body = br.readLine();
```

---

### **6. Stopping the Server**

An HTTP server should have a mechanism to shut down gracefully.

```java
server.stop(0);
```

---

### **Conclusion**

A simple HTTP server:

1. **Starts a server** on a given port.
2. **Handles incoming HTTP requests** with a request handler.
3. **Processes request headers and body** to extract client data.
4. **Sends responses** with status codes and headers.
5. **Supports multiple request methods** (GET, POST, etc.).
6. **Manages server shutdown** when needed.


---


## **Handling Different HTTP Request Types**

An HTTP server must handle various request methods (GET, POST, PUT, DELETE, etc.), each serving a different purpose. Below is a breakdown of how to handle these request types in code.

---

### **1. Handling GET Requests**

**Purpose:** Retrieve data without modifying the server state.  
**Example Use Case:** Fetching user details.

Example:

```java
@Override
public void handle(HttpExchange exchange) throws IOException {
    if ("GET".equals(exchange.getRequestMethod())) {
        String response = "Fetched data successfully!";
        exchange.sendResponseHeaders(200, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    } else {
        exchange.sendResponseHeaders(405, -1); // Method Not Allowed
    }
}
```

> This checks if the request method is `GET` and responds accordingly.

---

### **2. Handling POST Requests**

**Purpose:** Submit data to the server (e.g., form submissions, API requests).  
**Example Use Case:** Creating a new user.

Example:

```java
@Override
public void handle(HttpExchange exchange) throws IOException {
    if ("POST".equals(exchange.getRequestMethod())) {
        InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
        BufferedReader br = new BufferedReader(isr);
        StringBuilder requestBody = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            requestBody.append(line);
        }
        br.close();

        String response = "Received POST data: " + requestBody.toString();
        exchange.sendResponseHeaders(201, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    } else {
        exchange.sendResponseHeaders(405, -1);
    }
}
```

> This reads and processes data sent in a `POST` request.

---

### **3. Handling PUT Requests**

**Purpose:** Update an existing resource.  
**Example Use Case:** Updating user details.

Example:

```java
@Override
public void handle(HttpExchange exchange) throws IOException {
    if ("PUT".equals(exchange.getRequestMethod())) {
        InputStreamReader isr = new InputStreamReader(exchange.getRequestBody(), "utf-8");
        BufferedReader br = new BufferedReader(isr);
        StringBuilder requestBody = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) {
            requestBody.append(line);
        }
        br.close();

        String response = "Updated data: " + requestBody.toString();
        exchange.sendResponseHeaders(200, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    } else {
        exchange.sendResponseHeaders(405, -1);
    }
}
```

> This processes a `PUT` request and updates data.

---

### **4. Handling DELETE Requests**

**Purpose:** Remove a resource.  
**Example Use Case:** Deleting a user.

Example:

```java
@Override
public void handle(HttpExchange exchange) throws IOException {
    if ("DELETE".equals(exchange.getRequestMethod())) {
        String response = "Resource deleted successfully!";
        exchange.sendResponseHeaders(200, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    } else {
        exchange.sendResponseHeaders(405, -1);
    }
}
```

> This handles `DELETE` requests by acknowledging the removal of a resource.

---

### **5. Handling Query Parameters**

Query parameters are often used in `GET` requests to send additional information.

Example:  
If the client sends `GET /user?id=123`, we can extract the `id` like this:

```java
String query = exchange.getRequestURI().getQuery();
String[] params = query.split("=");
String userId = params.length > 1 ? params[1] : "Not provided";
```

> This extracts the `id` parameter from the request URL.

---

### **6. Sending JSON Responses**

Most modern APIs return JSON instead of plain text.

Example:

```java
exchange.getResponseHeaders().set("Content-Type", "application/json");
String jsonResponse = "{ \"message\": \"Success\", \"status\": 200 }";
exchange.sendResponseHeaders(200, jsonResponse.length());
OutputStream os = exchange.getResponseBody();
os.write(jsonResponse.getBytes());
os.close();
```

> This sets the `Content-Type` to `application/json` and sends a JSON response.

---

### **Conclusion**

To handle different HTTP request types:

- **GET:** Retrieve data (e.g., fetch user details).
- **POST:** Submit data (e.g., create a new user).
- **PUT:** Update existing data (e.g., update user profile).
- **DELETE:** Remove a resource (e.g., delete a user).

---

## **Best Practices for Handling Multiple HTTP Methods Cleanly**

When working with multiple HTTP request types, it's important to **keep your code clean and maintainable**. Here are some strategies:

---

### **1. Use a Router or Dispatcher**

Instead of checking `if` conditions repeatedly, delegate the request to method-specific handlers.

#### **Example: Using a Simple Router**

```java
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class Router implements HttpHandler {
    private final Map<String, RequestHandler> routes = new HashMap<>();

    public Router() {
        routes.put("GET", new GetHandler());
        routes.put("POST", new PostHandler());
        routes.put("PUT", new PutHandler());
        routes.put("DELETE", new DeleteHandler());
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        RequestHandler handler = routes.getOrDefault(method, new NotAllowedHandler());
        handler.handle(exchange);
    }
}
```

> This separates request handling into different classes based on method types.

---

### **2. Create Separate Handlers for Each Method**

Each method should have its own class for better separation of concerns.

#### **Example: GET Request Handler**

```java
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;

public class GetHandler implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String response = "Fetched data successfully!";
        exchange.sendResponseHeaders(200, response.length());
        OutputStream os = exchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }
}
```

> Each handler processes a specific method without interference.


Additionally you can point handlers to html content, for simple use case this works but for advanced approaches and a wider variety of html pages consider a change in implementation or a framework

```java
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.net.InetSocketAddress;

public class SimpleHttpServer {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/", new HtmlHandler("index.html"));
        server.setExecutor(null);
        server.start();
        System.out.println("Server started on port 8080...");
    }
}

class HtmlHandler implements HttpHandler {
    private final String filePath;

    public HtmlHandler(String filePath) {
        this.filePath = filePath;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        byte[] response = Files.readAllBytes(Paths.get(filePath));
        exchange.sendResponseHeaders(200, response.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(response);
        }
    }
}
```

---

### **3. Group Related Endpoints into Controllers**

For larger applications, organizing request handlers into **controllers** makes things clearer.

#### **Example Structure:**

```
/src
  /controllers
    UserController.java  --> Handles /user requests
    ProductController.java  --> Handles /product requests
  /handlers
    GetHandler.java
    PostHandler.java
    PutHandler.java
    DeleteHandler.java
  MainServer.java
```

#### **Example: UserController Handling Different Methods**

```java
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;

public class UserController implements HttpHandler {
    @Override
    public void handle(HttpExchange exchange) throws IOException {
        switch (exchange.getRequestMethod()) {
            case "GET":
                handleGet(exchange);
                break;
            case "POST":
                handlePost(exchange);
                break;
            case "PUT":
                handlePut(exchange);
                break;
            case "DELETE":
                handleDelete(exchange);
                break;
            default:
                exchange.sendResponseHeaders(405, -1);
        }
    }

    private void handleGet(HttpExchange exchange) throws IOException {
        // Handle GET logic
    }

    private void handlePost(HttpExchange exchange) throws IOException {
        // Handle POST logic
    }

    private void handlePut(HttpExchange exchange) throws IOException {
        // Handle PUT logic
    }

    private void handleDelete(HttpExchange exchange) throws IOException {
        // Handle DELETE logic
    }
}
```

> This keeps related request logic in **one controller** instead of scattered across files.

---

### **4. Use an Enum for HTTP Methods**

Avoid using **hardcoded strings** when checking request types.

```java
public enum HttpMethod {
    GET, POST, PUT, DELETE, PATCH
}
```

Usage:

```java
if (HttpMethod.valueOf(exchange.getRequestMethod()) == HttpMethod.GET) {
    handleGet(exchange);
}
```

> This prevents typos and makes code more structured.

---

### **5. Use Middleware for Cross-Cutting Concerns**

Middleware can handle tasks like logging, authentication, and request validation before reaching the main logic.

### **Example: Middleware for Logging**

```java
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;

public class LoggingMiddleware {
    public static void logRequest(HttpExchange exchange) {
        System.out.println("Received " + exchange.getRequestMethod() + " request for " + exchange.getRequestURI());
    }
}
```

Usage in a handler:

```java
@Override
public void handle(HttpExchange exchange) throws IOException {
    LoggingMiddleware.logRequest(exchange);
    // Proceed with request handling...
}
```

> This ensures **consistent logging** for all requests.

---

### **Conclusion: Clean Code Practices**

- **Use a Router** → Delegate requests to the appropriate handler.
- **Separate Handlers** → One class per HTTP method for better organization.
- **Abstract Common Logic** → Use a `BaseHandler` to avoid repetitive code.
- **Group Related Logic** → Controllers help organize endpoints logically.
- **Use Enums** → Avoid hardcoded HTTP method strings.
- **Use Middleware** → Handle cross-cutting concerns like logging and authentication.

---
## **(Advanced) Routing Dynamic Paths (e.g., `/user/{id}`)**

When handling dynamic paths, the server must extract **path parameters** from the request URL. Here’s how to implement clean, maintainable dynamic routing.

---

### **1. Basic Approach: Manual Path Parsing**

This approach manually extracts the dynamic part of the URL.

#### **Example: Handling `/user/{id}`**

```java
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.io.OutputStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserHandler implements BaseHandler {
    private static final Pattern USER_PATTERN = Pattern.compile("^/user/(\\d+)$");

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        Matcher matcher = USER_PATTERN.matcher(path);

        if (matcher.matches()) {
            String userId = matcher.group(1);
            sendResponse(exchange, 200, "Fetching user with ID: " + userId);
        } else {
            sendResponse(exchange, 404, "Not Found");
        }
    }
}
```

**How it works:**

- **Regex (`^/user/(\\d+)$`)** matches paths like `/user/123`
- Extracts `123` as `userId`
- Returns a response based on `userId`

> **Drawback:** This approach is **hardcoded** for `/user/{id}`. Let’s improve it.

---

### **2. Dynamic Routing Using a Router**

A better approach is **mapping paths dynamically** instead of using `if` conditions.

#### **Step 1: Create a Route Handler**

```java
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.IOException;
import java.util.function.BiConsumer;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class Route {
    private final Pattern pattern;
    private final BiConsumer<HttpExchange, Matcher> handler;

    public Route(String regex, BiConsumer<HttpExchange, Matcher> handler) {
        this.pattern = Pattern.compile(regex);
        this.handler = handler;
    }

    public boolean matches(HttpExchange exchange) throws IOException {
        Matcher matcher = pattern.matcher(exchange.getRequestURI().getPath());
        if (matcher.matches()) {
            handler.accept(exchange, matcher);
            return true;
        }
        return false;
    }
}
```

> **Explanation:**

- Accepts a **regex pattern** for matching paths.
- Uses a `BiConsumer` to **process the request** when matched.
- Calls the handler if the URL **matches** the pattern.

---

#### **Step 2: Implement a Router**

```java
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class Router implements HttpHandler {
    private final List<Route> routes = new ArrayList<>();

    public void addRoute(String pathRegex, BiConsumer<HttpExchange, Matcher> handler) {
        routes.add(new Route(pathRegex, handler));
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        for (Route route : routes) {
            if (route.matches(exchange)) return;
        }
        exchange.sendResponseHeaders(404, -1); // Not Found
    }
}
```

> **Explanation:**

- Stores **multiple routes**.
- Iterates through all registered routes, checking for a **match**.
- Calls the corresponding handler **when matched**.

---

#### **Step 3: Register Dynamic Routes**

Now, let's add dynamic routes in `MainServer.java`.

```java
public class MainServer {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        Router router = new Router();

        // Define dynamic user route: /user/{id}
        router.addRoute("^/user/(\\d+)$", (exchange, matcher) -> {
            String userId = matcher.group(1);
            new BaseHandler().sendResponse(exchange, 200, "User ID: " + userId);
        });

        // Define another dynamic route: /product/{id}
        router.addRoute("^/product/(\\d+)$", (exchange, matcher) -> {
            String productId = matcher.group(1);
            new BaseHandler().sendResponse(exchange, 200, "Product ID: " + productId);
        });

        // Attach router to the server
        server.createContext("/", router);
        server.setExecutor(null);
        server.start();
        System.out.println("Server started on port 8080");
    }
}
```

> **Key Features:**

- **Registers routes dynamically** (e.g., `/user/{id}`, `/product/{id}`)
- **Extracts dynamic values** from the URL using regex
- **Handles multiple dynamic routes** with a clean structure

---

### **3. Supporting Query Parameters (`?key=value`)**

For paths like `/user?id=123`, we handle query parameters separately.

#### **Extracting Query Parameters**

```java
import java.util.HashMap;
import java.util.Map;

public class QueryParser {
    public static Map<String, String> parseQuery(String query) {
        Map<String, String> params = new HashMap<>();
        if (query == null) return params;

        for (String pair : query.split("&")) {
            String[] parts = pair.split("=");
            if (parts.length == 2) {
                params.put(parts[0], parts[1]);
            }
        }
        return params;
    }
}
```

> **Usage Example:**

```java
String query = exchange.getRequestURI().getQuery();
Map<String, String> params = QueryParser.parseQuery(query);
String userId = params.getOrDefault("id", "Not provided");
sendResponse(exchange, 200, "User ID: " + userId);
```

> **This allows:**

- `/user?id=123` → Extracts `id=123`
- `/search?q=java&limit=10` → Extracts `q=java`, `limit=10`

---

### **Conclusion**

#### **Clean Routing Best Practices**

✅ **Use Regex-based Routing** → Handles dynamic paths efficiently  
✅ **Use a Router Class** → Centralizes route management  
✅ **Separate Route Handlers** → Keeps business logic modular  
✅ **Extract Query Parameters** → Supports `?key=value` structures

#### **Final Project Structure**

```
/src
  /controllers
    UserController.java   --> Handles /user/{id}
    ProductController.java --> Handles /product/{id}
  /handlers
    BaseHandler.java
    QueryParser.java
  /routing
    Router.java
    Route.java
  MainServer.java
  
