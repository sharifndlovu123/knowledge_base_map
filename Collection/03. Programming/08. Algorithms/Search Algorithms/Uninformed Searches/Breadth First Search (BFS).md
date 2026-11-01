# 01. Breadth First Search (BFS)



**BFS explores nodes level by level, visiting all nodes at the current depth before moving deeper.**  
- **Guaranteed to find the shortest path** from the start node to the goal.  
- **Each node is visited only once**, avoiding redundant checks.  

### **Drawbacks of BFS**  
- **High branching factor** can cause **combinatorial explosion**.  
- Consumes **large amounts of memory and time** as the state space grows.  

---

## **BFS Algorithm (Pseudo Code)**  
```python
def bfs(in Start, out State):
    open = [Start]
    closed = []
    State = "failure"

    while open and State != "success":
        X = open.pop(0)  # Remove the leftmost state from open
        
        if X is the goal:
            State = "success"
        else:
            generate children of X
            closed.append(X)
            eliminate children of X already in open or closed
            open.extend(remaining children)  # Add to the right end of open

    return State
```

---

## **Combinatorial Explosion in BFS**  

**Combinatorial explosion** occurs when the number of possible states grows **exponentially** with problem size.  
If the branching factor = **3**, the number of nodes at each level increases as:  

- **Level 0:** 1 node (starting point)  
- **Level 1:** 3 nodes  
- **Level 2:** 9 nodes  
- **Level 3:** 27 nodes  
- **Level 4:** 81 nodes  
- **Level 5:** 243 nodes  
- … **Exponential Growth**  

This rapid growth makes BFS impractical for large search spaces due to **memory and time constraints**.  

---

**Solution:**  
- **Use heuristic-based search algorithms** like **A\* or Greedy Best-First Search**.  
- **Use pruning techniques** like **Alpha-Beta Pruning** in game trees.  
- **Consider depth-limited or iterative deepening approaches** to balance memory and efficiency.  
