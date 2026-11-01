# 02. Best First Search

### Best-First Search (BestFS)

Best-first search is a search algorithm that expands the most promising node based on a given heuristic function.

#### **Key Characteristics**
- Best-first search is not guaranteed to find the shortest path.
- It avoids revisiting nodes unless necessary (e.g., for finding the shortest path).
- The algorithm minimizes the cost of finding a solution by using heuristics.
- It combines depth-first search (DFS) and breadth-first search (BFS) strategies.
- The algorithm maintains two lists:
  - **OPEN**: Nodes evaluated by the heuristic function but not yet expanded.
  - **CLOSED**: Nodes that have already been visited.

#### **Algorithm Pseudocode**
```plaintext
def bestfs(in Start, out State)
    open = [Start],
    close = [],
    State = failure;
    
    while (open <> []) AND (State <> success)
    begin
        remove the leftmost state from open, call it X;
        if X is the goal, then
            State = success
        else begin
            generate children of X;
            for each child of X do
                case
                    the child is not on open or closed
                    begin
                        assign the child a heuristic value,
                        add the child to open,
                    end;
                    
                    the child is already on open
                    if the child was reached by a shorter path then
                        update the path cost on open;
                    
                    the child is already on closed:
                    if the child is reached by a shorter path then
                    begin
                        remove the state from closed,
                        add the child to open
                    end;
                endcase
            endfor
            put X on closed;
            re-order states on open by heuristic merit (best leftmost);
    endwhile;
    return State;
end
```