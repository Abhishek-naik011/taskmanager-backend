// ------------------- Startup Debug Logs -------------------
console.log('STARTUP: server.js loaded, node version:', process.version);
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT_EXCEPTION', err && err.stack ? err.stack : err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED_REJECTION', err && err.stack ? err.stack : err);
  process.exit(1);
});

// ------------------- Imports -------------------
import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

// ------------------- Database Connection -------------------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon or Render Postgres
  },
});

// ------------------- App Setup -------------------
const app = express();
app.use(cors());
app.use(express.json());

// ------------------- Routes -------------------
app.get("/", (req, res) => {
  res.send("✅ Task Manager Backend is running successfully!");
});

app.get("/tasks", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT id, text FROM tasks ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Database error (GET /tasks):", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: "Text required" });

  try {
    const { rows } = await pool.query(
      "INSERT INTO tasks(text) VALUES($1) RETURNING id, text",
      [te]()
