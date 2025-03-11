# Setting up Java with Gradle in VS Code

Here's how to set up Java with Gradle in Visual Studio Code:

## 1. Install Prerequisites

1. **Install Java Development Kit (JDK)**
    
    - Download and install an LTS version (8, 11, 17, or 21) from Oracle or Adoptium
2. **Install Gradle**
    
    - Download from [Gradle website](https://gradle.org/releases/)
    - Extract the archive to a location on your computer
    - Add Gradle's `bin` directory to your system PATH
3. **Verify installations** in a terminal/command prompt:
    
    ```
    java -version
    gradle -version
    ```
    

## 2. Install VS Code Extensions

1. Open VS Code and go to Extensions (Ctrl+Shift+X)
2. Install these extensions:
    - "Extension Pack for Java" (includes Java essentials)
    - "Gradle for Java" (if not included in the pack)

## 3. Create a Gradle Project

**Option 1: Using VS Code Command Palette**

1. Press Ctrl+Shift+P to open the Command Palette
2. Type "Gradle: Create Gradle Project"
3. Follow the prompts to set up your project

**Option 2: Using Terminal in VS Code**

1. Open a terminal in VS Code (Ctrl+`)
2. Navigate to your desired directory
3. Run:
    
    ```
    gradle init
    ```
    
4. Select options when prompted:
    - Type of project: "application"
    - Implementation language: "Java"
    - Build script DSL: "Groovy" (or "Kotlin")
    - Test framework: "JUnit Jupiter" (recommended)
    - Project name: your choice
    - Source package: e.g., "com.example.app"

## 4. Working with Your Gradle Project

- The Gradle Explorer view shows your project structure
- Edit `build.gradle` to manage dependencies and build configuration
- Key files:
    - `build.gradle` (project configuration)
    - `settings.gradle` (project settings)
    - `gradlew` and `gradlew.bat` (Gradle wrapper scripts)

## 5. Running Gradle Tasks

1. Open the Gradle Tasks view in the Explorer
    
2. Expand your project to see available tasks
    
3. Common tasks:
    
    - `build`: Assembles and tests the project
    - `clean`: Removes build directories
    - `run`: Runs the application
4. Run tasks by:
    
    - Clicking on them in the Gradle Tasks view
    - Using the Command Palette: "Gradle: Run Gradle Task"
    - Terminal command: `./gradlew taskName` (or `gradlew taskName` on Windows)

## 6. Running Your Application

1. Use the Gradle "run" task
2. Or open the Java file with your main method and click the "Run" button
3. Alternatively, use the Command Palette: "Java: Run Java"

Your project is now set up with Java and Gradle in VS Code!