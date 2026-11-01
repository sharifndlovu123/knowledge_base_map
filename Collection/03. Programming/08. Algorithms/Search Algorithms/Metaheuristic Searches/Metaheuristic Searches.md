# 02. Metaheuristic Searches


 

Metaheuristic algorithms are high-level strategies used to guide the search process toward an optimal or near-optimal solution in complex optimization problems.  

### **Key Characteristics of Metaheuristics**  

- **Guided Search Strategy**: Metaheuristics determine the path and direction of the search process.  
- **Stochastic Nature**: Most metaheuristic algorithms use randomness in their search process.  
- **Escape from Local Optima**: They incorporate mechanisms to avoid getting stuck in local minima (or maxima) and continue exploring better solutions.  
- **General-Purpose Methods**: Unlike problem-specific algorithms, metaheuristics can be applied to a variety of optimization problems.  
- **May Use Domain Knowledge**: Some metaheuristics integrate domain-specific heuristics at a lower level to improve efficiency.  

---

### **What Does Stochastic Mean?**  
- A **stochastic** algorithm involves **randomness** in its decision-making process.  
- Instead of following a fixed deterministic path, it explores solutions using **probability-based choices**.  
- This randomness helps avoid local optima and increases the chances of finding a globally optimal solution.  

---

### **Examples of Single-Point Metaheuristic Searches**  
These algorithms maintain a **single candidate solution** at any given time and iteratively improve it.  

1. **[[Simulate Anealling|Simulated Annealing]] (SA)** – Inspired by thermodynamics, it probabilistically accepts worse solutions to escape local optima.  
2. **[[Tabu Search]] (TS)** – Uses memory structures (tabu list) to avoid revisiting previously explored solutions.  
3. **[[Iterated Local Search (ILS)]]** – Perturbs the current solution and applies local search to refine it.  
4. **Variable Neighbourhood Search (VNS)** – Dynamically changes the neighborhood structure to explore different regions of the search space.  
