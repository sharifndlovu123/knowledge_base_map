
# 04. Tabu Search Algorithm

Tabu search algorithm is quite similar to hill climbing, except that it allows solutions to worsen when they reach local optima or are “almost” optimal.  
A state is considered to be an “almost” local optimum if the only states that improve the objective function were visited earlier.

## Pseudocode

```plaintext
Set s = s0. Initial candidate solution
Set length(L) = z. Maximum tabu list length
Set L = {}. Initialise tabu list
repeat
    Generate a random neighbour s′
    if s′ ∉ L then
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

## Steps of Tabu Search

### 1. Initialization  
- Start with a random solution (s).  
- Create an empty tabu list (T).  
- Set a tabu list size (k).  

### 2. Perturbation  
- Generate a "neighbouring" solution (s’) by making a small change to (s).  
- Exclude solutions currently on the tabu list.  

### 3. Selection  
- Select the best solution (s’) from the allowed neighbours.  

### 4. Tabu List Update  
- Add the move that led to s’ to the tabu list (T).  
- If the tabu list is full, remove the oldest entry.  

### 5. Move  
- Move to the selected solution (s = s’).  

### 6. Aspiration Criteria  
- Allow a tabu move if it leads to a better solution than any seen.  

### 7. Iteration  
- Repeat steps 2-6 until a stopping criterion is met (e.g., max iterations, time limit).  

**Output:** Return the best solution found.  

## Key Features  

- **Tabu List:** Stores recently visited solutions or moves.  
- **Neighbourhood Structure:** Defines how "neighbouring" solutions are generated (problem-specific).  
- **Tabu List Size (k):** Controls how long solutions/moves remain tabu.  
- **Aspiration Criteria:** Allows overriding the tabu restriction in certain cases.  

## Disadvantages  

- **Can get stuck in local optima:** Local search algorithms can get trapped in solutions that are better than their neighbours but not the best overall.  
- **No guarantee of optimality:** Local search does not guarantee finding the global optimum.  
- **Performance depends on parameters:** The effectiveness of the algorithm depends on choices like neighbourhood size and stopping criteria.  

