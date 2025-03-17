
## Sample

### Case Study - Knapsack Problem
The Knapsack problem is a classic NP-hard optimization challenge involving selecting a subset of n
items, each with weight wi and value vi, to maximize the total value within a knapsack of capacity W. Due to its NP-hard nature, optimal solutions are computationally expensive for large instances.

However, efficient algorithms and metaheuristics provide acceptable approximate solutions. The
Knapsack problem finds applications in diverse fields, including logistics, finance, scheduling, and
resource allocation.

Given the following instance of the 0/1 Knapsack problem
> f3l-dkp4-20= {{ 4,20},{9,6 },{11,5 },{13,9 },{15,7 } } [2]


- Where { 4,20} = ”4” indicates the number of items available. ”20” represents the capacity of the knapsack (the maximum weight it can hold).
- The subsequent lines represent the items. Each line corresponds to one item and contains two numbers: the item’s weight and its value, respectively.

– ”9 6”: Item 1 has a weight of 9 and a value of 6.
– ”11 5”: Item 2 has a weight of 11 and a value of 5.
– ”13 9”: Item 3 has a weight of 13 and a value of 9.
– ”15 7”: Item 4 has a weight of 15 and a value of 7.


You have a knapsack with a capacity of 20 units of weight. You’re given four items, each with its weight and value. The goal of the knapsack problem in this instance is to find the combination of these four items that you can fit into the knapsack (without exceeding the weight capacity) that maximizes the total value of the items inside. Use the Iterated Local Search to solve this problem.

### Step By Step Solution

1. Solution Representation- you need to establish how you will represent the solution. This is a problem-dependent. Represent a solution as a binary string of length 4.
- 1 means the item is included.
- 0 means the item is excluded.
For example, 1010 means items 1 and 3 are in the knapsack, and items 2 and 4 are not.


2. Initial Solution generation. For simplicity, you can start with a random solution. E.g. 1100 (items 1 and 2).
- Initial Solution: 1100 (weight: 9 + 11 = 20, value: 6 + 5 = 11)


3. Local Search.
- Define a Neighbourhood: A Neighbour is created by flipping one bit (adding or removing an item).
- Local Search Procedure.
	– Generate all Neighbours of the current solution.
	– Evaluate each Neighbour: Calculate the total weight and value. If the weight is within the capacity (20) and the value is higher than the current solution, accept the Neighbour as the new current solution.
	– Repeat until no better Neighbour is found.
- Repair Function: If a Neighbour exceeds the weight capacity, it is invalid. In this simple example,
we can just reject the Neighbour. For more complex problems, more sophisticated repair functions are necessary.
- Neighbours: 0100, 1000, 1110, 1101.
	– 1110 (weight: 9 + 11 + 13 = 33) is invalid.
	– 1101 (weight: 9 + 11 + 15 = 35) is invalid.
	– 0100 (weight: 11, value: 5) is lower.
	– 1000 (weight: 9, value: 6) is lower.
	– So, 1100 remains.


4. Perturbation
- Introduce a perturbation e.g. flip two bits randomly. This will change the solution significantly, moving it to a different area of the search space.
- Example: If the current solution is 1010, a perturbation might flip bits 1 and 4, resulting in 0011.

New perturbation of 0101 (weight 11+15=26) change 2 bits invalid, therefore, we try again.
New perturbation of 0010 (weight 13, value 9)

5. Local Search Again
- Apply the local search procedure (step 3) to the perturbed solution.
	Neighbours 1010 = invalid.
	Neighbours 0110 = invalid
	Neighbours 0000 = value 0
	Neighbours 0011 = invalid.
	0010 remains.
	
6. Acceptance Criterion
- Simple acceptance: If the new locally optimal solution (s*’) has a higher value than the current best solution (s*), accept it.
- You could use a probabilistic acceptance criterion (like in simulated annealing) to occasionally accept worse solutions, helping to escape local optima. 
	0010 has value of 9, and 1100 has value of 11. 1100 is kept.

7. Termination Condition
- Set a maximum number of iterations (e.g., 100 iterations). The algorithm stops when the termination condition is met.


Repeat: Continue with perturbation, local search, and acceptance.