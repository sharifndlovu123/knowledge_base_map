### **Branch and Bound Algorithm**  

Branch and Bound is an optimization technique used to find the most optimal solution by systematically exploring the solution space while eliminating suboptimal paths.  

#### **Key Characteristics**  
- Used to find the most **optimal solution** in search and optimization problems.  
- Each solution path has a **cost** associated with it, and the algorithm aims to minimize or maximize this cost.  
- The technique **keeps track of solutions and their costs**, continuing the search only if a better solution is possible.  
- Unlike heuristic-based methods, **Branch and Bound searches the entire solution space** but eliminates unnecessary explorations.  
- Each **path (not just the node) has a cost**, and the cost increases with path length.  
- The algorithm **prunes paths that have an estimated cost higher than the best solution found so far**, avoiding unnecessary computations.  

---


```python
function BranchAndBound(problem):
    best_solution = None
    best_cost = ∞  # Initialize best cost as infinity
    queue = PriorityQueue()  # Use a priority queue for exploring the search space
    queue.insert(problem.initial_state, cost=0)

    while queue is not empty:
        current_state, current_cost = queue.pop()  # Remove state with the least cost
        
        if current_cost ≥ best_cost:
            continue  # Prune this branch as it cannot yield a better solution

        if problem.is_goal(current_state):
            best_solution = current_state
            best_cost = current_cost
            continue

        for child, cost in problem.expand(current_state):
            total_cost = current_cost + cost
            if total_cost < best_cost:
                queue.insert(child, total_cost)  # Add to queue if it can be a better solution

    return best_solution, best_cost

```