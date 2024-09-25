const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key";

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(":memory:");

// Create Users and Tasks tables
db.serialize(() => {
  db.run(
    "CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT, email TEXT, password TEXT)"
  );
  db.run(
    "CREATE TABLE tasks (id TEXT PRIMARY KEY, user_id TEXT, title TEXT, status TEXT, FOREIGN KEY(user_id) REFERENCES users(id))"
  );
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Signup
app.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  const userId = uuidv4();

  db.run(
    "INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)",
    [userId, name, email, hashedPassword],
    (err) => {
      if (err) return res.status(500).send("Error registering new user.");
      res.status(201).send("User registered.");
    }
  );
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send("Invalid credentials.");
    }

    const token = jwt.sign({ id: user.id, name: user.name }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  });
});

// Create Task (Protected)
app.post("/tasks", authenticateToken, (req, res) => {
  const { title, status } = req.body;
  const taskId = uuidv4();
  const userId = req.user.id;

  db.run(
    "INSERT INTO tasks (id, user_id, title, status) VALUES (?, ?, ?, ?)",
    [taskId, userId, title, status],
    (err) => {
      if (err) return res.status(500).send("Error creating task.");
      res.status(201).send("Task created.");
    }
  );
});

// Get User Tasks (Protected)
app.get("/tasks", authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.all("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).send("Error fetching tasks.");
    res.json(rows);
  });
});

// Update Task (Protected)
app.put("/tasks/:id", authenticateToken, (req, res) => {
  const { title, status } = req.body;
  const taskId = req.params.id;
  db.run(
    "UPDATE tasks SET title = ?, status = ? WHERE id = ? AND user_id = ?",
    [title, status, taskId, req.user.id],
    (err) => {
      if (err) return res.status(500).send("Error updating task.");
      res.send("Task updated.");
    }
  );
});

// Delete Task (Protected)
app.delete("/tasks/:id", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  db.run(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [taskId, req.user.id],
    (err) => {
      if (err) return res.status(500).send("Error deleting task.");
      res.send("Task deleted.");
    }
  );
});

// Profile Management (Get, Update)
app.get("/profile", authenticateToken, (req, res) => {
  db.get(
    "SELECT id, name, email FROM users WHERE id = ?",
    [req.user.id],
    (err, user) => {
      if (err) return res.status(500).send("Error fetching profile.");
      res.json(user);
    }
  );
});

app.put("/profile", authenticateToken, (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = password ? bcrypt.hashSync(password, 8) : undefined;

  db.run(
    "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
    [name, email, hashedPassword, req.user.id],
    (err) => {
      if (err) return res.status(500).send("Error updating profile.");
      res.send("Profile updated.");
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
