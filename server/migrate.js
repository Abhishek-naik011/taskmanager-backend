// migrate.js — run once to create DB table
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const sql = `
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);`;

async function migrate() {
  try {
    await pool.query(sql);
    console.log("Migration successful: tasks table exists.");
  } catch (err) {
    console.error("Migration error:", err);
  } finally {
    await pool.end();
  }
}

migrate();
