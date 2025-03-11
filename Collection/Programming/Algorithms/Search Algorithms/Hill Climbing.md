similar to best-first search. While the best first search considers states globally, hillclimbing
considers only local states.


```
def hill_climbing(in Start, out State)
	open = [Start], close = [],
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
				end;
				the child is already on open
				
				if the child was reached by a shorter path then
				give the state on open the shorter path
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


## Greedy Hill Climbing

Form of hill climbing which chooses the node with the least estimated cost at each state.
However, this does not guarantee an optimal solution path. 
Greedy hill climbing is susceptible to the problem of becoming stuck in local optima.
- has backtracking

steps
1. Evaluate the initial state.
2. Select a new operator.
3. 3. Evaluate the new state.
4. If it is closer to the goal state than the current state make it the current state. If it is no better ignore.
5. If the current state is the goal state or no new operators are available, quit.
6. Otherwise repeat steps 2 to 4.