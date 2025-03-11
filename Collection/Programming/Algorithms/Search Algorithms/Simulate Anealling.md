flexible version of hill climbing..
sometimes accepts a worse option.

This seemingly counterintuitive approach—allowing the solution quality to temporarily decrease—is
what allows simulated annealing to avoid getting stuck on local optima.

in hill climbing, you’ll inevitably get trapped on a ”peak” that isn’t the highest.

methodology `making less-than-ideal choices to escape getting stuck in local optima`

```
Input: Initial State s, Loss function L(·)
Output: Best solution found
	CURRENT ← {s}
	BEST ← {s}
	Set initial temperature T = T0 (magnitude similar to typical loss differences)
	t ← 1
	repeat
		NEXT ← randomly chosen adjacent state to CURRENT
		ΔL ← L(NEXT) − L(CURRENT)
		if ΔL < 0 then
			CURRENT ← NEXT
		else
			CURRENT ← NEXT with probability min{1, exp(−ΔL/T)}
		end if
		if L(CURRENT) < L(BEST) then
			BEST ← CURRENT
		end if
		t ← t + 1
		T ← T0/ log(t + 1) {Example cooling schedule}
	until no improvement in BEST for N iterations
	return BEST
```

Disadvantages

- performance depends heavily on getting its settings right, particularly the starting temperature, how quickly the temperature cools down, and how it explores neighbouring solutions.
- Finding the best settings often takes a lot of trial and error and can be time-consuming.
- Simulated Annealing can also be computationally expensive. 
- It’s also a heuristic, meaning it doesn’t guarantee to find the absolute best solution;
- it might get stuck on a good, but not perfect, solution.