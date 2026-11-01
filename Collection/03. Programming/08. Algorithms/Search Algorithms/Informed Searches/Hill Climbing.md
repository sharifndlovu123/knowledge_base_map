# 04. Hill Climbing

Similar to best-first search. While the best first search considers states globally, hillclimbing
considers only local states.


---

### ** Hill Climbing Algorithm**
Hill Climbing only considers local states and moves towards the best neighboring state.

```plaintext
def hill_climbing(in Start, out State)
    open = [Start], close = [],
    State = failure;
    
    while (open <> []) AND (State <> success)
    begin
        remove the leftmost state from open, call it X;
        
        if X is the goal, then
            State = success
        else 
        begin
            generate children of X;
            
            for each child of X do
            case
                the child is not on open or closed
                begin
                    assign the child a heuristic value,
                end;
                
                the child is already on open
                if the child was reached by a shorter path then
                    update the path cost on open;
                
                the child is already on closed:
                if the child is reached by a shorter path then
                begin
                    remove the state from closed,
                end;
            endcase
        endfor
        
        put X on closed;
        re-order the children states by heuristic merit (best leftmost);
        place the reordered list on the leftmost side of open;
    endwhile;
    
    return State;
end.
```

---

### **Greedy Hill Climbing**
A specialized form of hill climbing that immediately selects the node with the lowest estimated cost.

#### **Algorithm Steps**
1. Evaluate the initial state.
2. Select the best possible move based on the heuristic function.
3. Evaluate the new state.
4. If it improves upon the current state, move to it; otherwise, discard it.
5. If the goal state is reached or no better moves exist, terminate.
6. Otherwise, repeat from Step 2.

#### **Key Characteristics**
- **Faster than standard hill climbing** due to its aggressive selection process.
- **More prone to local optima** since it does not explore alternative paths.
- **Uses backtracking** in certain implementations if no improvement is found.

Greedy Hill Climbing sacrifices long-term strategy for immediate improvements, while Standard Hill Climbing may take longer but can explore different paths to reach a better overall solution.

---

### **Comparison: Standard Hill Climbing vs. Greedy Hill Climbing**

| Feature                | Standard Hill Climbing                          | Greedy Hill Climbing                          |
|------------------------|--------------------------------|--------------------------------|
| **Decision Process**   | Considers all neighboring states before selecting the best move. | Selects the best possible move immediately at each step. |
| **Backtracking**       | No backtracking, but may explore multiple neighbors before proceeding. | Backtracking may occur if no improvement is found. |
| **Local Optima Issue** | Can get stuck in local optima but may escape if a worse move is allowed (depending on the variant). | Highly prone to local optima since it always chooses the immediate best option. |
| **Search Efficiency**  | May take longer to explore different paths. | Faster but less reliable for finding global optima. |
| **Example Use Cases**  | Optimization problems requiring gradual improvements. | Situations demanding quick decision-making with limited lookahead. |