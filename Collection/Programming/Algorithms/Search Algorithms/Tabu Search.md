
Tabu search algorithm is quite similar to hill climbing, 

except that it allows solutions to worsen when they reach local optima or are “almost” A state is considered to be an “almost” local optimum if the only states that improve the objective function were visited earlier.

```
Set s = s0. Initial candidate solution
Set length(L) = z. Maximum tabu list length
Set L = {}. Initialise tabu list
repeat
	Generate a random neighbour s′
	if s′ /∈ L then
		if length(L) > z then
			Remove the oldest solution from L. FIFO queue
		end if
		Set s′ ∈ L
	end if
	if s′ < s then
		s = s′
	end if
until (stopping criteria satisfied)
return s
```

Disavantages
• Can get stuck in local optima - Local search algorithms can get trapped in local optima, which are solutions that are better than their neighbours but not the best overall.
• No guarantee of optimality Local search does not guarantee finding the global optimum.
• Performance depends on parameters The performance of local search can depend on the choice of parameters, such as the neighbourhood size and the stopping criterion.