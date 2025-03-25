
# Simulated Annealing  

Simulated annealing is a flexible version of hill climbing that sometimes accepts a worse option.  

This seemingly counterintuitive approach—allowing the solution quality to temporarily decrease—is what allows simulated annealing to avoid getting stuck on local optima.  

In hill climbing, you’ll inevitably get trapped on a "peak" that isn’t the highest.  

### **Methodology**  
**Making less-than-ideal choices to escape getting stuck in local optima.**  

## Key Features  

- **Cooling Schedule**: Controls how quickly the temperature decreases. Crucial for balancing exploration and exploitation.  
- **Neighbourhood Structure**: Defines how "neighbouring" solutions are generated (problem-specific).  
- **Metropolis Criterion**: The probabilistic rule used to decide whether to accept a worse solution.  

## **Pseudocode**  

```plaintext
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

## **Steps of Simulated Annealing**  

### 1. Initialization  
- Start with a random solution (s).  
- Set an initial temperature (T).  

### 2. Perturbation  
- Generate a "neighbouring" solution (s’) by making a small change to (s).  

### 3. Evaluation  
- Calculate the change in "energy" (cost/objective function) between s’ and s (δE).  

### 4. Acceptance  
- If δE < 0 (s’ is better): Accept s’.  
- If δE > 0 (s’ is worse): Accept s’ with probability exp(-δE / T).  

### 5. Cooling  
- Gradually reduce the temperature (T) using a "cooling schedule."  

### 6. Iteration  
- Repeat steps 2-5 until a stopping criterion is met (e.g., max iterations, low temperature).  

### 7. Output  
- Return the best solution found.  

## **Disadvantages**  

- Performance depends heavily on getting its settings right, particularly the starting temperature, how quickly the temperature cools down, and how it explores neighbouring solutions.  
- Finding the best settings often takes a lot of trial and error and can be time-consuming.  
- Simulated annealing can also be computationally expensive.  
- It’s a heuristic, meaning it doesn’t guarantee to find the absolute best solution.  
- It might get stuck on a good, but not perfect, solution.  
