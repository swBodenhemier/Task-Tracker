import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
import bcrypt from "bcrypt";
import cors from "cors";

const { Pool } = pkg;

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// PostgreSQL connection
const pool = new Pool({
  user: "postgres", // your PostgreSQL username
  host: "localhost",
  database: "task_manager", // your database name
  password: "josephlaity", // your password
  port: 5432,
});

// Create users table if it doesn't exist
pool
  .query(
    `
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date_assigned DATE NOT NULL,
    date_due DATE NOT NULL,
    assigned_by VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
  )
  .then(() => {
    console.log("Users and Tasks tables are ready");
  })
  .catch((err) => console.error("Error creating table", err));


// Signup endpoint
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username",
      [username, hashedPassword]
    );
    res.status(201).json({ user: { username: result.rows[0].username } });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Username already exists" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.status(200).json({ user: { username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

client.connect();

// CREATE Task
app.post("/tasks", async (req, res) => {
  const { name, date_assigned, date_due, assigned_by, description, status } =
    req.body;
  try {
    const result = await client.query(
      `INSERT INTO tasks (name, date_assigned, date_due, assigned_by, description, status)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, date_assigned, date_due, assigned_by, description, status]
    );
    res.status(201).json(result.rows[0]); // Send back the created task
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ Task
app.get("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query("SELECT * FROM tasks WHERE id = $1", [
      id,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Task
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { name, date_assigned, date_due, assigned_by, description, status } =
    req.body;

  try {
    const result = await client.query(
      `UPDATE tasks
            SET name = $1, date_assigned = $2, date_due = $3, assigned_by = $4, description = $5, status = $6, updated_at = CURRENT_TIMESTAMP
            WHERE id = $7 RETURNING *`,
      [name, date_assigned, date_due, assigned_by, description, status, id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Return updated task
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Task
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length > 0) {
      res.status(200).json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
