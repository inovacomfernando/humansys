
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new Database(path.join(__dirname, '../data/app.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password_hash TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS collaborators (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    position TEXT,
    department TEXT,
    hire_date DATE,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_credits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    credits INTEGER DEFAULT 100,
    plan TEXT DEFAULT 'trial',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
  );

  CREATE TABLE IF NOT EXISTS trainings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    duration INTEGER,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = db.prepare('SELECT id, email, name FROM users WHERE email = ? AND password_hash = ?')
    .get(email, password);
  
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/users', (req, res) => {
  const { email, name, password_hash } = req.body;
  
  try {
    const stmt = db.prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)');
    const result = stmt.run(email, name, password_hash);
    
    // Create default credits
    const creditsStmt = db.prepare('INSERT INTO user_credits (user_id, credits) VALUES (?, ?)');
    creditsStmt.run(result.lastInsertRowid, 100);
    
    res.json({ 
      success: true, 
      user: { id: result.lastInsertRowid, email, name } 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Collaborators routes
app.get('/api/collaborators/:userId', (req, res) => {
  const { userId } = req.params;
  
  const collaborators = db.prepare('SELECT * FROM collaborators WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId);
  
  res.json(collaborators);
});

app.post('/api/collaborators', (req, res) => {
  const { user_id, name, email, position, department, hire_date } = req.body;
  
  try {
    const stmt = db.prepare(`
      INSERT INTO collaborators (user_id, name, email, position, department, hire_date) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(user_id, name, email, position, department, hire_date);
    
    res.json({ 
      success: true, 
      collaborator: { id: result.lastInsertRowid, ...req.body } 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Credits routes
app.get('/api/credits/:userId', (req, res) => {
  const { userId } = req.params;
  
  const credits = db.prepare('SELECT * FROM user_credits WHERE user_id = ?').get(userId);
  
  if (credits) {
    res.json(credits);
  } else {
    res.status(404).json({ error: 'Credits not found' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Database server running on port ${PORT}`);
  console.log(`📁 Database file: ${path.join(__dirname, '../data/app.db')}`);
});
