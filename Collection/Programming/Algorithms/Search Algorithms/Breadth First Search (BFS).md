The breadth-first search visits nodes left-to-right at each level of the tree. Each node is not visited
more than once.

- Breadth-first is guaranteed to find the shortest path from the start to the goal.
- BFS has a bad branching factor which can lead to combinatorial explosion.

```
def bfs (in Start, out State)
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
			put remaining children on right end of open
		end else
	endwhile
	return State;
enddef
```


In the context of **Breadth-First Search (BFS)**, **combinatorial explosion** refers to a situation where the number of possible states or nodes to explore increases exponentially with the size of the problem. This leads to inefficiencies in terms of both time and memory consumption.

For instance, if at each level there are 3 possible moves (branching factor = 3), the number of nodes explored at each level will be:

- Level 0: 1 node (the starting point)
- Level 1: 3 nodes
- Level 2: 9 nodes
- Level 3: 27 nodes, and so on.

This exponential growth in the number of nodes can quickly become unmanageable, causing the algorithm to consume excessive memory and time.