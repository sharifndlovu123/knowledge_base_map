# 02. Compiling Jars

To compile Java files into a JAR file, follow these steps:

---

### **1. Compile Java Files into `.class` Files**

Run this in the terminal (assuming your Java files are in the `src` directory):

```sh
javac -d out src/*.java
```

- `-d out` places compiled `.class` files into the `out` directory.
- `src/*.java` compiles all Java files in `src`.

---

### **2. Create a Manifest File (Optional, for Executable JARs)**

Create a `manifest.txt` file specifying the entry point (if applicable):

```
Main-Class: com.example.Main
```

(Replace `com.example.Main` with your actual main class.)

---

### **3. Package Everything into a JAR**

Run the following command:

```sh
jar cfm app.jar manifest.txt -C out .
```

- `c` → Create a JAR.
- `f` → Specifies the output file (`app.jar`).
- `m` → Uses the `manifest.txt` file.
- `-C out .` → Adds compiled files from the `out` directory.

---

### **4. Run the JAR File**

If it's an executable JAR:

```sh
	java -jar app.jar
```

---

### **Alternative: Without Manifest**

If you don’t need an executable JAR (e.g., it's a library):

```sh
jar cf app.jar -C out .
```

This just creates a JAR of compiled classes without an entry point.

---

### **Automation Using Gradle or Maven**

If you're using **Gradle**, add this to `build.gradle`:

```gradle
jar {
    manifest {
        attributes 'Main-Class': 'com.example.Main'
    }
}
```

Then build it with:

```sh
gradle jar
```

If you're using **Maven**, package with:

```sh
mvn package
```

---

That’s it! 🚀 Now you have a `.jar` file ready to use.