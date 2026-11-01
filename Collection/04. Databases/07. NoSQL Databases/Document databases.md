# 03. Document databases

### **Document Databases: MongoDB and Couchbase**

Document databases are a type of NoSQL database designed to store, retrieve, and manage semi-structured data in the form of **documents**. These databases use formats like JSON, BSON, or XML to store data, making them ideal for applications that need flexibility in data representation and schema evolution. MongoDB and Couchbase are two of the most popular document databases in the industry.

---

### **1. MongoDB**

#### **Overview**:
MongoDB is one of the most widely used NoSQL databases. It stores data in a **JSON-like format** called **BSON** (Binary JSON), which supports rich data types. MongoDB is known for its flexibility, scalability, and high availability.

#### **Key Features**:
- **Document-Oriented**: Data is stored as documents (e.g., JSON or BSON), allowing nested structures like arrays and embedded objects. This flexibility enables schema-less design, which is ideal for rapidly changing applications.
- **Scalability**: MongoDB offers **horizontal scaling** via **sharding**, where data is distributed across multiple servers (shards) to ensure that the system can handle large datasets and high throughput.
- **Indexes**: MongoDB supports a variety of indexes, including compound indexes, geospatial indexes, and text search indexes, making querying more efficient.
- **Aggregation Framework**: MongoDB provides a powerful aggregation pipeline for performing complex queries, such as filtering, grouping, and sorting data, as well as transforming data.
- **Replication**: Built-in support for replication using **Replica Sets** ensures high availability and fault tolerance. Replica sets consist of a primary node and one or more secondary nodes that replicate the data from the primary.
- **ACID Transactions**: MongoDB added multi-document ACID (Atomic, Consistent, Isolated, Durable) transactions in version 4.0, which allows you to perform multiple operations within a single transaction, ensuring data consistency.
- **Use Cases**:
  - **Content Management Systems (CMS)**: MongoDB's flexible schema is great for storing diverse types of content.
  - **Real-time Analytics**: With its rich querying and aggregation features, MongoDB is used in applications that require real-time analytics and insights.
  - **IoT Applications**: Ideal for storing sensor data or events in a flexible and scalable way.
  - **E-commerce Platforms**: MongoDB is used to manage product catalogs, orders, and customer data, especially when the data model changes frequently.

#### **Limitations**:
- **Consistency**: MongoDB uses **eventual consistency** by default (though you can configure for stronger consistency). This could be a limitation for applications requiring strong consistency across distributed nodes.
- **Joins**: While MongoDB supports **$lookup** for joining collections, it’s not as powerful or efficient as SQL joins, especially in highly complex queries.
- **Memory Usage**: Due to its in-memory data structures and index storage, MongoDB can use a significant amount of RAM, which can become costly at scale.

#### **Advantages**:
- Flexible schema for rapid iteration and schema-less design.
- High scalability with sharding and replication.
- Wide adoption, strong community support, and rich ecosystem.

---

### **2. Couchbase**

#### **Overview**:
Couchbase is another popular NoSQL document database, combining the best features of key-value stores and document databases. It is designed for high performance, scalability, and availability, providing features such as in-memory caching, indexing, and full-text search.

#### **Key Features**:
- **Document-Oriented**: Like MongoDB, Couchbase stores data in JSON documents, which allows for flexible and schema-less data storage.
- **High Availability and Scalability**: Couchbase provides **built-in horizontal scaling** via **cluster architecture**. It automatically distributes data across nodes and replicates data for fault tolerance. It's designed to scale effortlessly for both read and write-heavy workloads.
- **In-Memory Caching**: Couchbase includes a memory-first architecture, where data is initially stored in RAM for extremely fast access and subsequently written to disk for persistence.
- **Indexing**: Couchbase supports **secondary indexes**, **full-text search**, **geospatial indexing**, and **view indexing** for efficient querying. The **N1QL query language** (similar to SQL) allows developers to write complex queries on the JSON documents.
- **ACID Transactions**: Couchbase supports **ACID transactions** at both the document and multi-document levels. This ensures data consistency across multiple operations.
- **Replication**: Couchbase replicates data to multiple nodes within the cluster to ensure availability, with automatic failover capabilities.
- **Eventing and Full-Text Search**: Couchbase includes features like **Eventing** (server-side functions that run in response to changes) and **Full-Text Search** for advanced querying capabilities.
- **Use Cases**:
  - **Real-Time Applications**: Couchbase is often used in applications that require low-latency access to data, such as real-time recommendation engines and gaming leaderboards.
  - **Mobile Applications**: Couchbase's mobile version, **Couchbase Lite**, allows data synchronization between devices and backend servers, making it suitable for mobile apps that need offline capabilities.
  - **E-commerce**: Couchbase's ability to handle large amounts of product catalogs, customer data, and session management in real time makes it suitable for e-commerce platforms.

#### **Limitations**:
- **Complexity**: Couchbase's architecture can be more complex to manage, especially when dealing with its in-memory and disk-based storage layers, indexing, and replication settings.
- **Learning Curve**: Couchbase’s query language (N1QL) might require additional learning for developers familiar with traditional SQL, as it is not as straightforward as MongoDB's JSON-based queries.
- **Cost**: Couchbase’s distributed nature can lead to increased costs, particularly when scaling horizontally for larger clusters.

#### **Advantages**:
- In-memory caching ensures fast read and write operations.
- Advanced features like full-text search, geospatial queries, and N1QL for SQL-like querying.
- High availability and horizontal scalability.
- Supports both document and key-value data models.

---

### **MongoDB vs. Couchbase: Key Differences**

| **Feature**               | **MongoDB**                           | **Couchbase**                         |
|---------------------------|----------------------------------------|---------------------------------------|
| **Data Model**             | JSON-like BSON documents               | JSON documents                       |
| **Query Language**         | MongoDB Query Language (MQL)           | N1QL (SQL-like for JSON)             |
| **Indexes**                | Supports compound, geospatial, text, and hashed indexes | Full-text search, secondary, geospatial, and view indexes |
| **ACID Transactions**      | Supports multi-document ACID transactions (since v4.0) | Supports multi-document ACID transactions |
| **Replication**            | Replica sets for high availability and fault tolerance | Built-in replication and failover capabilities |
| **Scaling**                | Horizontal scaling via sharding       | Automatic horizontal scaling (via clusters) |
| **Caching**                | No built-in caching (though it can be used with Redis) | Built-in memory-first caching architecture |
| **Data Consistency**       | Eventual consistency by default, with options for stronger consistency | Eventual consistency, but offers stronger consistency through tunable consistency settings |
| **Mobile Support**         | MongoDB Stitch offers mobile sync     | Couchbase Lite for mobile apps with sync capabilities |
| **Use Cases**              | Real-time analytics, content management, IoT | Real-time apps, mobile apps, e-commerce |
| **Ease of Use**            | More widely adopted with a large community and documentation | More complex architecture, but powerful for large-scale systems |

---

### **When to Use MongoDB vs. Couchbase**

- **Use MongoDB** if:
  - You need a flexible, schema-less database that allows for rapid development.
  - You are dealing with use cases that require rich querying and aggregation (e.g., content management, real-time analytics).
  - You are looking for a mature, widely-adopted NoSQL database with strong community support.
  - You need a document store that scales horizontally for large workloads.

- **Use Couchbase** if:
  - You need a combination of **key-value** and **document-based** data storage with extremely fast read and write performance.
  - You are building applications that require in-memory caching and high availability, such as real-time applications or mobile apps with offline capabilities.
  - You need advanced indexing and full-text search functionality for complex queries.
  - You are dealing with large-scale distributed systems where ease of scalability and high availability are essential.

Both MongoDB and Couchbase are powerful document databases, but the best choice depends on your specific needs regarding performance, scalability, complexity, and use case.