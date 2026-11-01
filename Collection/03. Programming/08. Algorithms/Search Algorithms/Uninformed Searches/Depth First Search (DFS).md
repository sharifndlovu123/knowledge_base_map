# 02. Depth First Search (DFS)



A commonly used search algorithm for exploring a **state space**.  
- **DFS explores as deep as possible** before backtracking.  
- It follows a **single path to the lowest depth or ply** before moving to another branch.  
- DFS is more efficient in **search spaces with a high branching factor**.  

### **Drawbacks of DFS**  
- **May get "lost"** in deep search, requiring a **depth-bound** to limit exploration.  
- The **solution path may be long and suboptimal**.  
- Not suitable for search spaces with **infinite depth**.  

---

## **Depth-First Search Algorithm (Pseudo Code)**  
```python
def dfs(in Start, out State):
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
            open = remaining children + open  # Add to the left end of open

    return State
```

---

## **Depth-First Search with Iterative Deepening (DFID)**  

A **variation of DFS** that **limits search depth** and **iterates deeper each time**.  
- Searches **entire row** at a depth before moving deeper.  
- Each iteration **increases the depth bound by 1**.  
- Terminates when a **solution path is found**.  
- Ideal for **state-space representations with infinite depth**.  
- **Guaranteed to find the shortest path**.  
- However, **prior iterations are computationally wasted** since information is not retained.  

---

## **DFID Algorithm (Pseudo Code)**  
```python
def DFID(initial_state, goal_states):
    search_depth = 1
    
    while solution not found:
        dfs(initial_state, goal_states, depth_bound=search_depth)
        search_depth += 1
```
