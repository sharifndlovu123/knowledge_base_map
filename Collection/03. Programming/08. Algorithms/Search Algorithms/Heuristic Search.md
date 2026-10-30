

## **Definition**  

A rule of thumb, a shortcut, or an educated guess used to guide the search for a solution when finding the absolute best solution is too difficult or time-consuming.  

Search methods that include the use of domain knowledge in the form of heuristics are described as **“weak” search methods**.  

### **Key Characteristics**  

- Heuristics help reduce the size of the search space.  
- An evaluation function is applied to each goal to assess how promising it is in leading to the goal.  
- Incorporates the use of domain-specific knowledge in the process of choosing which node to visit next in the search process.  
- Heuristics may find a solution but are **not guaranteed** to.  
- Heuristic functions estimate the cost from a node to the goal node.  
- The incorporation of domain knowledge speeds up the search process.  
- Heuristic functions are **not guaranteed to be completely accurate**.  

### **Properties of Heuristic Values**  

- **Heuristic values** are always **≥ 0** for all nodes.  
- Heuristic values represent an **approximate cost** of finding a solution.  
- A heuristic value of **zero** indicates that the state is a **goal state**.  
- A **heuristic that never overestimates the cost to the goal** is called an **admissible heuristic**.  
- Not all heuristics are necessarily admissible.  

#### **Example of Heuristic Admissibility**  

- \( h(a) \) = **Straight-line distance estimate from a to b** → **Admissible?**  
- \( h(a) \) = **10 × (Straight-line distance estimate from a to b)** → **Admissible?**  

### **Additional Properties**  

- A **heuristic value of infinity** indicates that the state is a **dead-end** and won’t lead anywhere.  
- A **good heuristic must not take long to compute**.  
- Heuristics are often defined on a **simplified or relaxed version** of the problem (e.g., **the number of misplaced tiles in a puzzle**).  

### **Comparing Heuristics**  

- **Heuristic function h1 is better than heuristic function h2** if fewer nodes are expanded during the search when using **h1** compared to **h2**.  
- **Devising good heuristic functions is difficult**.  
- Heuristics are **fallible and not perfect**.  

## **Heuristic Search vs. Traditional Search**  

DFS and BFS may require too much memory to generate the entire state space. In these cases, a **heuristic search** is performed.  

- Heuristics help **reduce the size of the search space**.  
- An evaluation function is applied to each goal to assess how promising it is.  
- Involves the use of **domain-specific knowledge** to decide which node to visit next.  
- Considered **"weak" search methods** because heuristics **help but do not always** guarantee a solution.  

## **Examples of Heuristic-Based Algorithms**  

- **[[Hill Climbing]]**  
- **[[Best First Search]] (BFS)**  
- **[[A+ Algorithm|A* Algorithm]]**  
