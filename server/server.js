// server/server.js (add these logs / use PORT)
console.log('STARTUP: server.js loaded, node version:', process.version);
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT_EXCEPTION', err && err.stack ? err.stack : err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED_REJECTION', err && err.stack ? err.stack : err);
  process.exit(1);
});

// ... your existing app setup code here (express, routes, db setup) ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LISTENING: Server listening on port ${PORT}`);
});

// server.js (Express + pg)
import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

// ✅ Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
});

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Default route (for quick testing)
app.get("/", (req, res) => {
  res.send("✅ Task Manager Backend is running successfully!");
});

// ✅ GET /tasks
app.get("/tasks", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, text FROM tasks ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Database error (GET /tasks):", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ POST /tasks
app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Text required" });

  try {
    const { rows } = await pool.query(
      "INSERT INTO tasks(text) VALUES($1) RETURNING id, text",
      [text.trim()]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Database error (POST /tasks):", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ DELETE /tasks/:id
app.delete("/tasks/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid task ID" });

  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("❌ Database error (DELETE /tasks):", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
