# 01. Client Server Architecture

### **Client/Server Architecture**

The **Client/Server** model is a **distributed network architecture** where **clients** and **servers** perform distinct roles in providing services and resources. It's a foundation for most networked applications.

#### **Key Components:**

1. **Client**:
    
    - **Requests services** or resources from the server.
    - Typically, it is a device (computer, smartphone, etc.) with an application that requests data (e.g., web browser, email client).
    - Clients **don’t provide services** but act as users of services.
2. **Server**:
    
    - **Provides resources or services** requested by the client.
    - Servers are more powerful machines designed to handle multiple client requests (e.g., web servers, file servers, database servers).
    - Servers **don’t initiate requests**; they wait for client requests.

#### **How It Works:**

1. The **client** sends a request (usually through a network protocol like HTTP for web servers).
2. The **server** receives the request, processes it, and sends back the requested data or response.
3. The **client** then uses the data it receives from the server.

#### **Characteristics:**

- **Centralized Resources**: Servers typically maintain the resources (e.g., databases, files), which clients access.
- **Scalability**: Multiple clients can connect to one or more servers. Servers can be scaled up or replicated to handle more clients.
- **Security & Control**: Servers control access to resources, enforcing permissions and managing security.

#### **Examples**:

- **Web Browsing**: The browser (client) sends an HTTP request to a web server, which processes and returns the webpage.
- **Email Systems**: The email client requests messages from an email server (e.g., IMAP/SMTP).
- **Database Access**: A database client queries the database server for records.

#### **Advantages**:

- **Centralized management**: Easier to manage and secure data, backups, and updates.
- **Resource efficiency**: Servers can be optimized to handle specific tasks (e.g., serving web pages, handling database queries).
- **Scalability**: Additional servers can be added to distribute the load if necessary.

#### **Disadvantages**:

- **Single point of failure**: If the server goes down, all clients are affected.
- **Server overload**: If too many clients request services at the same time, the server may become overwhelmed, leading to performance issues.

In summary, **Client/Server architecture** provides a structured way for clients to request and servers to provide services over a network, typically in a scalable, manageable, and secure manner.