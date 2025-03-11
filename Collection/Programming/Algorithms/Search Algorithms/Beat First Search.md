The best-first search is a general search where the minimum cost nodes were first expanded.

- The best-first search is not guaranteed to find the shortest solution path. 
- It is more efficient not to revisit nodes (unless you want to find the shortest path). This can be achieved by restricting legal moves to not include nodes that have already been visited.
- The best-first search attempts to minimize the cost of finding a solution. 
- It is a combination of depth-first search and breadth-first search with heuristics. 
- Two lists are maintained in the implementation of the best-first algorithm: OPEN and CLOSED. OPEN contains nodes that have been evaluated by the heuristic function but have not yet been expanded into successors. The CLOSED contains nodes that have already been visited.

```
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
				give the state on open the shorter path
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