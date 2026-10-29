

## A Algorithm

The A algorithm is essentially the best-first search implemented with the following function:

`f(n) = g(n) + h(n)`

- **g(n):** Measures the length of the path from any state `n` to the start state.
- **h(n):** Heuristic measure from state `n` to the goal state.

The use of the evaluation function `f(n)` applied to the 8-Puzzle problem is illustrated in the following image of the initial and goal states.

---

## A* Algorithm

https://www.youtube.com/watch?v=6TsL96NAZCo&t=33s

Algorithms that are **guaranteed to determine the shortest path** are called `admissible algorithms`.

**Breadth-first search** is an example of an admissible algorithm. The evaluation function we have considered with the best-first algorithm is:

`f(n) = g(n) + h(n),`

where:

- **g(n):** An estimate of the cost of the distance from the start node to some node `n`, e.g., the depth at which the state is found in the graph.
- **h(n):** The heuristic estimate of the distance from `n` to a goal.

An evaluation function used by admissible algorithms is:

`f*(n) = g*(n) + h*(n)`

where:

- **g*(n):** Estimates the shortest path from the start node to the node `n`.
- **h*(n):** Estimates the actual cost from the start node to the goal node that passes through `n`.
- `f*` does not exist in practice, and we attempt to estimate `f` as closely as possible to `f*`.
- `g(n)` is a reasonable estimate of `g*(n)`, usually:
  
  `g(n) ≤ g*(n)`
  
- It is usually not possible to compute `h*(n)`. Instead, we try to find a heuristic `h(n)` that is bounded from above by the actual cost of the shortest path to the goal, meaning:
  
  `h(n) ≤ h*(n)`
  
- The **best-first search** used with `f(n)` is called the **A algorithm**.
- If `h(n) ≤ h*(n)` in the A algorithm, then the A algorithm is called the **A* algorithm**.

