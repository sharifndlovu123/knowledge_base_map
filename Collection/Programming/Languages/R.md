R is a language designed primarily for statistical computing and data visualization. Its syntax is relatively simple and expressive, with a focus on vectorized operations. Below is an overview of the key aspects of R syntax:

# Syntax

---

## **1. Variables and Assignment**

You can assign values to variables using `<-` (preferred) or `=`.

```r
x <- 10  # Preferred
y = 20   # Also works
```

To print a variable:

```r
print(x)
x  # Implicit printing in interactive mode
```

---

## **2. Data Types**

R supports various data types:

- **Numeric:** `x <- 10.5`
- **Integer:** `y <- 10L` (denoted with `L`)
- **Character (String):** `z <- "Hello"`
- **Logical (Boolean):** `flag <- TRUE`
- **Complex:** `c <- 3 + 2i`

To check the type:

```r
class(x)  # Returns "numeric"
```

---

## **3. Vectors (Key Data Structure)**

Vectors are one-dimensional arrays and the most fundamental data type in R.

```r
v <- c(1, 2, 3, 4, 5)  # Create a vector
v[1]  # Access first element
length(v)  # Get length
```

Vectorized operations:

```r
v * 2  # Multiplies each element by 2
v + c(5, 6, 7, 8, 9)  # Element-wise addition
```

---

## **4. Lists**

Lists can hold multiple types of data.

```r
my_list <- list(name="John", age=25, scores=c(90, 85, 88))
my_list$name  # Access list elements
```

---

## **5. Matrices**

Matrices are 2D arrays.

```r
m <- matrix(1:9, nrow=3, ncol=3)
m[1, 2]  # Access row 1, column 2
```

---

## **6. Data Frames (Like Tables)**

Data frames are like spreadsheets.

```r
df <- data.frame(name=c("Alice", "Bob"), age=c(25, 30))
df$name  # Access column
df[1, ]  # Access row
```

---

## **7. Control Structures**

### If-Else:

```r
x <- 10
if (x > 5) {
  print("Big")
} else {
  print("Small")
}
```

### Loops:

```r
for (i in 1:5) {
  print(i)
}

while (x > 0) {
  print(x)
  x <- x - 1
}
```

---

## **8. Functions**

Define custom functions:

```r
add_numbers <- function(a, b) {
  return(a + b)
}

result <- add_numbers(3, 5)
print(result)
```

---

## **9. Apply Functions (Vectorized Operations)**

Instead of loops, R uses `apply` functions:

```r
nums <- c(1, 2, 3, 4, 5)
squared <- sapply(nums, function(x) x^2)
print(squared)
```

---

## **10. Reading and Writing Data**

Read CSV:

```r
df <- read.csv("data.csv")
```

Write CSV:

```r
write.csv(df, "output.csv")
```

---

## **11. Plotting**

Basic plot:

```r
plot(1:10, (1:10)^2, type="b", col="red")
```

Histogram:

```r
hist(rnorm(1000), col="blue")
```

---

## **12. Packages and Libraries**

Install and load packages:

```r
install.packages("ggplot2")  # Install package
library(ggplot2)  # Load package
```

---

## **13. Working with ggplot2 (Data Visualization)**

Example:

```r
library(ggplot2)
ggplot(mtcars, aes(x=mpg, y=hp)) + geom_point()
```

---

R is powerful for data analysis and visualization. Would you like more details on a specific topic? 🚀


# Import
Importing files into R depends on the file type. Below are the most common ways to import data:

---

## **1. Import a CSV File**

CSV (Comma-Separated Values) is one of the most common formats.

### **Using `read.csv()` (Built-in Function)**

```r
data <- read.csv("data.csv")  # Default assumes a header row
head(data)  # Show first few rows
```

- If the file has no headers:
    
    ```r
    data <- read.csv("data.csv", header=FALSE)
    ```
    
- If the file uses a different delimiter (e.g., `;` instead of `,`):
    
    ```r
    data <- read.csv("data.csv", sep=";")
    ```
    

---

## **2. Import an Excel File**

For Excel files (`.xlsx`), you need the `readxl` package.

### **Using `readxl` Package**

```r
install.packages("readxl")  # Install package (only needed once)
library(readxl)  # Load package

data <- read_excel("data.xlsx", sheet = 1)  # Read first sheet
head(data)
```

---

## **3. Import a TXT File**

For space- or tab-separated text files, use `read.table()`.

```r
data <- read.table("data.txt", header=TRUE, sep="\t")
head(data)
```

For space-separated files:

```r
data <- read.table("data.txt", header=TRUE, sep=" ")
```

---

## **4. Import an RDS File (`.rds`)**

R's native format for saving objects.

```r
data <- readRDS("data.rds")
```

---

## **5. Import JSON Data**

For JSON files, use the `jsonlite` package.

```r
install.packages("jsonlite")
library(jsonlite)

data <- fromJSON("data.json")
```

---

## **6. Import Data from a URL**

You can read data directly from an online source.

```r
data <- read.csv("https://example.com/data.csv")
head(data)
```

---

## **7. Import a Database Table**

For databases (MySQL, PostgreSQL, SQLite), use the `DBI` package.

```r
install.packages("DBI")
library(DBI)

# Example for SQLite
conn <- dbConnect(RSQLite::SQLite(), "database.sqlite")
data <- dbReadTable(conn, "table_name")
dbDisconnect(conn)
```

---
