import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";
import bcrypt from "bcrypt";
import cors from "cors";


const { Pool } = pkg;

const app = express();
const port = 5000;

app.use(cors())
app.use(bodyParser.json());
app.use(express.static("public"));

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",           // your PostgreSQL username
  host: "localhost",
  database: "task_manager",    // your database name
  password: "josephlaity",     // your password
  port: 5432,
});

// Create users table if it doesn't exist
pool.query(`
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
)
`).then(() => {
    console.log("Users table is ready");
  }).catch(err => console.error("Error creating table", err));

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
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.status(200).json({ user: { username: user.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch all tasks
app.get("/api/tasks", async (req, res) => {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ error: "User query parameter is required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, date_assigned, date_due, assigned_by, description, status FROM tasks WHERE assigned_by = $1 ORDER BY date_assigned DESC",
      [user]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


//-----ANALYTICS------ 

// Get all task analytics
app.get("/api/analytics", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        assigned_by AS username,
        COUNT(*) AS total_assigned,
        SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS overdue
      FROM tasks
      GROUP BY assigned_by
      ORDER BY username
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Get task analytics for a specific user
app.get("/api/analytics/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) AS total_assigned,
        SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS overdue
      FROM tasks
      WHERE assigned_by = $1
    `, [username]);
    res.json(result.rows[0]); // single user summary
  } catch (err) {
    console.error("Error fetching analytics for user:", err);
    res.status(500).json({ error: "Failed to fetch analytics for user" });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
