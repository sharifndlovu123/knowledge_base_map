
[[HTML]]
If you want to implement CGI using **Java** (without violating the assignment rules), you can create a **standalone Java CGI script** that generates HTML output. This script will be **executed by Apache**, similar to how a compiled C binary would work.

---

## **1. Write a Java CGI Program (`HelloCGI.java`)**

This Java program **does not use any networking functions**—it simply prints an HTML response.

```java
import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class HelloCGI {
    public static void main(String[] args) {
        // Get current time
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String formattedTime = now.format(formatter);

        // Print HTTP headers
        System.out.println("Content-Type: text/html\n");
        
        // Print HTML response
        System.out.println("<html>");
        System.out.println("<head><title>CGI with Java</title></head>");
        System.out.println("<body>");
        System.out.println("<h1>Hello from Java CGI!</h1>");
        System.out.println("<p>Current Time: " + formattedTime + "</p>");
        System.out.println("</body>");
        System.out.println("</html>");
    }
}
```

---

## **2. Compile the Java Program**

Run the following command in **VS Code’s terminal** to compile the program:

```sh
javac HelloCGI.java
```

This creates `HelloCGI.class`, which is the compiled bytecode.

---

## **3. Run and Test the Output in VS Code**

To check if the output is correct, run:

```sh
java HelloCGI
```

Expected output:

```
Content-Type: text/html

<html>
<head><title>CGI with Java</title></head>
<body>
<h1>Hello from Java CGI!</h1>
<p>Current Time: 03-02-2025 14:35:12</p>
</body>
</html>
```

---

## **4. Deploy the Java CGI Script to Apache**

If you want to run this through a **web server**, do the following:

### **Move the Java Class to Apache’s CGI Directory**

1. Copy `HelloCGI.class` to the **Apache CGI directory**:
    
    ```sh
    sudo cp HelloCGI.class /var/www/html/cgi-bin/
    ```
    
2. **Ensure the CGI script is executable**:
    
    ```sh
    chmod +x /var/www/html/cgi-bin/HelloCGI.class
    ```
    

### **Modify Apache Configuration for Java CGI**

1. Open Apache’s configuration file:
    
    ```sh
    sudo nano /etc/apache2/apache2.conf  # Ubuntu/Debian
    sudo nano /etc/httpd/conf/httpd.conf # CentOS/RHEL
    ```
    
2. **Enable Java CGI Execution** by adding this inside the `<Directory>` block for `/cgi-bin/`:
    
    ```apache
    AddHandler cgi-script .class
    ```
    
3. **Restart Apache**:
    
    ```sh
    sudo systemctl restart apache2  # Ubuntu/Debian
    sudo systemctl restart httpd    # CentOS/RHEL
    ```
    

---

## **5. Test the Java CGI Script in a Browser**

Open your web browser and go to:

```
http://your-server-ip/cgi-bin/HelloCGI.class
```

It should display the generated HTML page with the **current time**.

---

## **Key Points**

✅ **No networking functions**—this strictly follows the assignment rules.  
✅ Uses **standard Java features** (no external libraries).  
✅ **CGI-compliant**—works like compiled C binaries.  
✅ Can be tested in **VS Code first**, then deployed to **Apache**.
