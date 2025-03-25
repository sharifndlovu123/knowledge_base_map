

Iterated Local Search (ILS) is a metaheuristic that builds on local search techniques. It belongs to the broader family of local search algorithms but includes enhancements to avoid getting stuck in local optima.

## Key Steps of ILS:

1. **Generate Initial Solution**
   - Start with an initial solution (s1) created randomly or through a problem-specific heuristic. 
   - Example: For a knapsack problem, the initial solution could be selecting a random set of items.

2. **Perform Local Search**
   - Apply a local search procedure to the initial solution (s1) to find a locally optimal solution (s*). 
   - This step involves making small adjustments to the solution and accepting improvements to the objective function.
   - Example: In the knapsack problem, this could involve flipping one item in/out and checking if it increases the total value without exceeding the weight limit.

3. **Perturbation**
   - Introduce a perturbation (a significant change) to the current locally optimal solution (s*), resulting in a new solution (s′).
   - The perturbation helps move away from the current local optimum to explore new regions of the solution space.
   - Example: In the knapsack problem, this could mean flipping two random bits in the binary solution representation, drastically changing which items are included.

4. **Perform Local Search Again**
   - Apply local search to the perturbed solution (s′) to find a new locally optimal solution (s′*).
   - The local search refines the perturbed solution, possibly leading to a better local optimum.
   - Example: In the knapsack problem, the solution could change after evaluating neighbours of the perturbed solution, accepting only those with higher value and feasible weight.

5. **Acceptance Criterion**
   - Decide whether to accept the new locally optimal solution (s′*) or retain the current solution (s*).
   - This decision can be made based on various criteria, including solution quality and history of the search. A probabilistic approach may be used to accept worse solutions to escape local optima.
   - Example: If the perturbed solution provides a higher value, accept it; otherwise, retain the current best solution.

6. **Termination Condition**
   - Check if the termination condition is met. This could be based on a maximum number of iterations, a time limit, or achieving a target solution quality.
   - If the termination condition is met, stop the algorithm; otherwise, return to step 3 (perturbation) and continue the iterative process.
   - Example: Stop after 100 iterations or if the algorithm has not found any better solutions after a set number of tries.

#### Example Walkthrough

For the **Knapsack Problem**, ILS can be applied as follows:

- **Initial Solution**: `1100` (items 1 and 2 included; total weight 20, total value 11).
- **Local Search**: Evaluate possible neighbours (e.g., `0100`, `1000`, `1110`) and choose the best one (no improvement in this case, so `1100` remains).
- **Perturbation**: Flip two bits to form a new solution like `0010` (items 3 included, value 9, weight 13).
- **Local Search Again**: Apply local search to `0010` and evaluate new neighbours (e.g., `1010`, `0110`). Most solutions are invalid, so `0010` remains.
- **Acceptance Criterion**: Since `1100` has a higher value (11 vs. 9), the algorithm retains the solution `1100`.
- **Termination Condition**: Repeat the perturbation, local search, and acceptance steps until a stopping condition is met.




### Knapsack Problem

The Knapsack problem is a classic NP-hard optimization challenge involving selecting a subset of \(n\) items, each with weight \(w_i\) and value \(v_i\), to maximize the total value within a knapsack of capacity \(W\). Due to its NP-hard nature, optimal solutions are computationally expensive for large instances.

However, efficient algorithms and metaheuristics provide acceptable approximate solutions. The Knapsack problem finds applications in diverse fields, including logistics, finance, scheduling, and resource allocation.

#### Given Instance of the 0/1 Knapsack Problem

> **f3l-dkp4-20 = {{4, 20}, {9, 6}, {11, 5}, {13, 9}, {15, 7}} [2]**

- Where {4, 20} means:
  - "4" indicates the number of items available.
  - "20" represents the capacity of the knapsack (the maximum weight it can hold).
- The subsequent lines represent the items. Each line corresponds to one item and contains two numbers: the item’s weight and its value.

  - "9 6": Item 1 has a weight of 9 and a value of 6.
  - "11 5": Item 2 has a weight of 11 and a value of 5.
  - "13 9": Item 3 has a weight of 13 and a value of 9.
  - "15 7": Item 4 has a weight of 15 and a value of 7.

You have a knapsack with a capacity of 20 units of weight. The goal is to find the combination of these four items that fits into the knapsack (without exceeding the weight capacity) while maximizing the total value of the items inside. Use the Iterated Local Search (ILS) to solve this problem.

### Step-By-Step Solution

1. **Solution Representation**

   Represent a solution as a binary string of length 4.
   - 1 means the item is included.
   - 0 means the item is excluded.
   
   Example: `1010` means items 1 and 3 are in the knapsack, and items 2 and 4 are not.

2. **Initial Solution Generation**

   For simplicity, start with a random solution. For example: `1100` (items 1 and 2).

   - **Initial Solution:** `1100`
     - Weight: \( 9 + 11 = 20 \)
     - Value: \( 6 + 5 = 11 \)

3. **Local Search**

   - **Neighbourhood:** A neighbour is created by flipping one bit (adding or removing an item).
   - **Local Search Procedure:**
     - Generate all neighbours of the current solution.
     - Evaluate each neighbour: Calculate the total weight and value. If the weight is within the capacity (20) and the value is higher than the current solution, accept the neighbour as the new current solution.
     - Repeat until no better neighbour is found.
   - **Repair Function:** If a neighbour exceeds the weight capacity, it is invalid. For more complex problems, sophisticated repair functions may be required.
   - **Neighbours:** `0100`, `1000`, `1110`, `1101`.
     - `1110` (weight: \( 9 + 11 + 13 = 33 \)) is invalid.
     - `1101` (weight: \( 9 + 11 + 15 = 35 \)) is invalid.
     - `0100` (weight: 11, value: 5) is lower.
     - `1000` (weight: 9, value: 6) is lower.
     - Thus, `1100` remains.

4. **Perturbation**

   Introduce a perturbation (e.g., flip two bits randomly). This will change the solution significantly, moving it to a different area of the search space.

   - **Example:** If the current solution is `1010`, a perturbation might flip bits 1 and 4, resulting in `0011`.

   New perturbation of `0101` (weight: \( 11 + 15 = 26 \)) is invalid. Try again.

   New perturbation of `0010` (weight: 13, value: 9).

5. **Local Search Again**

   Apply the local search procedure (step 3) to the perturbed solution.

   - Neighbours:
     - `1010` is invalid.
     - `0110` is invalid.
     - `0000` has a value of 0.
     - `0011` is invalid.
     - Thus, `0010` remains.

6. **Acceptance Criterion**

   - **Simple Acceptance:** If the new locally optimal solution (`s*'`) has a higher value than the current best solution (`s*`), accept it.
   - **Probabilistic Acceptance:** A probabilistic criterion (like in simulated annealing) could also be used to occasionally accept worse solutions, helping to escape local optima.
   
   - `0010` has a value of 9, and `1100` has a value of 11. `1100` is kept.

7. **Termination Condition**

   Set a maximum number of iterations (e.g., 100 iterations). The algorithm stops when the termination condition is met.

### Repeat

Continue with perturbation, local search, and acceptance until the termination condition is met.