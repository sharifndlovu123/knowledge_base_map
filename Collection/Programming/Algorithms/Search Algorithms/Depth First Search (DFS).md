
Commonly used to search a state space is the depth-first search. The depth-first search searches to the lowest depth or ply of the tree.

- DFS may get “lost” in search and hence a depth-bound may have to be imposed on a depth-first search.
- The solution path found by DFS may be long and suboptimal. DFS is more efficient for search spaces with many branches, i.e. the branching factor is high.

Searches entire line, far left, then moves

```
Depth First Search Algorithm
def dfs(in Start, out State)
	open = [Start];
	closed = [];
	State = failure;
	while (open <> []) AND (State <> success)
	begin
		remove the leftmost state from open, call it X;
		if X is the goal, then
			State = success
		else begin
			generate children of X;
			put X on closed
			eliminate the children of X on open or closed
			put remaining children on left end of open
		end else
	endwhile
	return State;
enddef
```

## Iterative Deepening

Iterative deepening involves performing the depth-first search on several different iterations with different depth bounds or cutoffs. 

Searches entire row, then iterates deeper.

- On each iteration, the cutoff is increased by one. The iterative process terminates when a solution path is obtained. 
- Iterative deepening is more advantageous in cases where the state-space representation has infinite depth rather than constant depth. 
- The state space is searched at a deeper level in each iteration.
- DFID is guaranteed to find the shortest path. The algorithm retains information between iterations; thus, prior iterations are “wasted.”

```
procedure DFID (intial_state, goal_states)
begin
	search_depth=1
	while (solution path is not found)
	begin
		dfs(initial_state, goals_states) with a depth bound of search_depth
		increment search_depth by 1
	endwhile
end
```