# 02. Local Searches



- A **heuristic approach** for finding solutions to **optimization problems**.  
- Works by **iteratively improving** a candidate solution.  
- Explores the **"neighbourhood"** of the current solution.  
- Aims to find **better solutions nearby**.  

---

## **Core Components**  

### **Candidate Solution**  
- The current **"guess"** for the best solution.  

### **Neighbourhood**  
- The set of possible solutions that are **"close"** to the current solution.  
- "Close" is **defined based on the problem**.  

### **Objective Function**  
- A function that evaluates the **"quality"** of a solution.  
- We want to **maximize** or **minimize** this function.  
- Example: The **height of a mountain** in an optimization problem.  

### **Neighbourhood Exploration**  
- The strategy for selecting **which neighbour to examine next**.  

---

## **How Local Search Works**  

### **Algorithm Steps**  

1. **Start** with a random candidate solution.  
2. **Define a neighbourhood** of possible solutions.  
3. **Explore** the neighbourhood of the current solution.  
4. **If a better neighbour is found, update the current solution.**  
5. **Repeat steps 3 and 4** until a stopping criterion is met:  
   - Maximum **iterations reached**.  
   - **No better neighbours** found.  

---

## **Key Characteristics**  

1. **Iterative Improvement**  
   - Repeatedly **refines** the current solution.  

2. **Neighbourhood Exploration**  
   - Focuses on exploring **solutions similar** to the current one.  

3. **Heuristic Nature**  
   - **Does not guarantee** finding the **global optimum**.  
   - Aims for a **good solution (local optimum)** in a reasonable time.  

4. **Problem-Specific**  
   - The **definition of "neighbourhood"** and the **evaluation function** depend on the problem.  

---

## **Examples of Local Search Algorithms**  

- **[[Hill Climbing]]**  
- **[[Simulate Anealling|Simulated Annealing]]**  
- **[[Tabu Search]]**  
