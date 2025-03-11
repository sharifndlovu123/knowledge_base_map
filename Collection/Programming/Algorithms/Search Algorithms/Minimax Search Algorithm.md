
part of game and game playing

If the game tree is sufficiently small, we can generate the entire tree and look ahead to decide which move to make.

In a game in which there are two players and only one can win, we want to maximize the score of one player MAX and minimize the score of the other MIN. The players in the game are referred to as MAX and MIN players.

MAX represents the person trying to win the game and maximize their score. MIN represents the opponent who tries to minimize MAX’s score. This technique assumes that the opponent has and uses the same knowledge of the state space as MAX.

Each level in the search space contains a label MAX or MIN, indicating whose move is at that particular point in the game.

This algorithm is used to look ahead and decide which move to make first. It is mainly used in decision-making and game theory. If the game space is sufficiently small, the entire space can be generated, and leaf nodes can be allocated a win (1), draw (0), or loss (-1) value.


Characteristics of Minimax
- The Minimax algorithm always finds the optimal path in a finite tree, especially if both players play
optimally.
- higher branching factor, the algorithm struggles.
- game space is large, a game tree can be generated at a particular depth or ply. However, win and loss values cannot be assigned to nodes at the cut-off depth because these are not final nodes. Instead, a heuristic value is used.
- The heuristic values are an estimate of how promising the node is in leading to a win for Max.

PROBLEM
One of the problems associated with generating a state space to a certain depth is the horizon effect. This refers to the problem of a look-ahead to a certain depth that does not detect a promising path and instead leads to a worse situation.


## Alpha Beta Pruning

disadvantage of the minimax algorithm is that all nodes in the game tree cut-offs to a
certain depth were examined.

Alpha-beta pruning reduces the number of nodes explored.


- Alpha α stores the best already explored option along a given path to the root of the maximizing
layer. This is the maximum score that the maximizer can receive; only the maximizer layer can
change this value and has an initial value of negative infinity (−∞).
• Beta (β) stores the best already-explored option along a given path to the root for the minimizing
layer. This is the minimum score that the minimizer can receive; only the minimizer layer can
change this value and has an initial value of positive infinity (+∞).
• IF α ≥β, a given branch can be pruned, so there is no need to visit the given children.



SAMPLE

The children of B have static values of 3 and 5, and B is at the MIN level; thus, the value returned to B is three. If we consider F, it has a value of -5.

Thus, the value returned to C is at most -5. However, A is at a MAX level; thus, the value at A will be at least three, greater than -5.

Therefore, regardless of the value of G, A has a value of 3. Therefore, we do not need to explore and evaluate G because its value will not affect the value returned to A.

This is called the alpha cut. Similarly, we can get a beta-cut if the value of a subtree will always be bigger than the value returned by its sibling to a node at a minimizing level. In Alpha-Beta pruning, we assign two extra variables to every single node in the search tree: alpha α and beta β.

![[Pasted image 20250310005628.png]]

![[Pasted image 20250310005644.png]]