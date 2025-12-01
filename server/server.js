import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(express.static("public"));

// placeholder for creating a PostgreSQL client
const client = new Client({
    user: 'your-username',
    host: 'localhost',
    database: 'your-database',
    password: 'your-password',
    port: 5432,
});

client.connect();


// CREATE Task
app.post('/tasks', async (req, res) => {
    const { name, date_assigned, date_due, assigned_by, description, status } = req.body;
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
app.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('SELECT * FROM tasks WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE Task
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { name, date_assigned, date_due, assigned_by, description, status } = req.body;

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
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Task
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
;
