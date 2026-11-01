# 06. Setting up Java with Maven in VS Code

Here's how to set up Java with Maven in Visual Studio Code:

## 1. Install Prerequisites

1. **Install Java Development Kit (JDK)**
    
    - Download and install an LTS version (8, 11, 17, or 21) from Oracle or Adoptium
2. **Install Maven**
    
    - Download from [Apache Maven website](https://maven.apache.org/download.cgi)
    - Extract the archive to a location on your computer
    - Add Maven's `bin` directory to your system PATH
3. **Verify installations** in a terminal/command prompt:
    
    ```
    java -version
    mvn -version
    ```
    

## 2. Install VS Code Extensions

1. Open VS Code and go to Extensions (Ctrl+Shift+X)
2. Install these extensions:
    - "Extension Pack for Java" (includes Java essentials)
    - "Maven for Java" (if not included in the pack)

## 3. Create a Maven Project

**Option 1: Using VS Code Command Palette**

1. Press Ctrl+Shift+P to open the Command Palette
2. Type "Maven: Create Maven Project"
3. Select "Create from archetype" (recommended for beginners)
4. Choose an archetype (e.g., maven-archetype-quickstart)
5. Follow prompts to set groupId, artifactId, and version

**Option 2: Using Terminal in VS Code**

1. Open a terminal in VS Code (Ctrl+`)
2. Navigate to your desired directory
3. Run:
    
    ```
    mvn archetype:generate -DgroupId=com.example -DartifactId=my-app -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
    ```
    
4. Open the created folder in VS Code

## 4. Working with Your Maven Project

- The Maven Explorer view shows your project structure
- Edit `pom.xml` to manage dependencies and build configuration
- Use the Maven extension menu for common tasks like clean, compile, and package
- Run Maven goals from Command Palette with "Maven: Execute Commands..."

## 5. Running Your Application

1. Open the Java source file with your main method
2. Click the "Run" button that appears above the main method
3. Alternatively, use the Command Palette: "Java: Run Java"

Your project is now set up with Java and Maven in VS Code!

With Maven, you can create:

- Desktop applications (using JavaFX, Swing, or AWT)
- Web applications (using frameworks like Spring, Jakarta EE, etc.)
- Mobile applications (with frameworks like JavaFX Mobile or through Apache Cordova)
- Enterprise server applications
- Microservices
- Command-line tools and utilities
- Libraries and frameworks for other developers to use
- Android applications (though Gradle is more common for Android)