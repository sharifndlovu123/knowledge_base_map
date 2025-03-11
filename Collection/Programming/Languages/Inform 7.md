Inform 7 is a **natural language** programming language used for creating interactive fiction. Its syntax is designed to be readable like English. Here are the basics:

---

### **1. Creating a Simple Room**

```inform7
The Kitchen is a room.
The Living Room is a room. 

The Kitchen is north of the Living Room.
```

- This defines **two rooms** and connects them.

---

### **2. Adding Objects**

```inform7
The apple is in the Kitchen.
The apple is edible.
```

- This **creates an apple** that can be eaten.

---

### **3. Describing Objects**

```inform7
The table is in the Kitchen. The description is "A sturdy wooden table."
```

- When the player **examines the table**, they will see the description.

---

### **4. Adding Player Actions**

```inform7
Instead of eating the table:
    say "That doesn't seem very appetizing."
```

- This prevents the player from eating the table.

---

### **5. Creating an NPC (Character)**

```inform7
Bob is a man in the Kitchen.
Bob carries a newspaper.
```

- **Bob** starts in the Kitchen and holds a newspaper.

---

### **6. Giving NPCs Behavior**

```inform7
Instead of asking Bob about the newspaper:
    say "'It's today's edition,' Bob says."
```

- The player can **ask Bob about the newspaper**.

---

### **7. Winning the Game**

```inform7
Instead of taking the golden key:
    say "You have won!";
    end the game.
```

- Taking the **golden key** ends the game.

---

Would you like more **advanced features** like **puzzles or inventory systems**? 🚀