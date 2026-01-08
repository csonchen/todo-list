const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'todos.db');
const db = new Database(dbPath);

// Initialize table
db.prepare(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Routes

// Get all todos
app.get('/api/todos', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM todos ORDER BY created_at DESC');
    const todos = stmt.all();
    // Convert integer boolean to javascript boolean
    const result = todos.map(todo => ({
      ...todo,
      completed: !!todo.completed
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO todos (text) VALUES (?)');
    const info = stmt.run(text);
    const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ ...newTodo, completed: !!newTodo.completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle todo status
app.patch('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body; // Expect boolean

  try {
    const stmt = db.prepare('UPDATE todos SET completed = ? WHERE id = ?');
    const result = stmt.run(completed ? 1 : 0, id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const updatedTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    res.json({ ...updatedTodo, completed: !!updatedTodo.completed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete todo
app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  try {
    const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
