import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Criar diretório data se não existir
import fs from 'fs';
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const db = new Database(path.join(dataDir, 'app.db'));

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
    invited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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

// Inserir dados de teste se não existirem
const adminUser = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@humansys.com');
if (!adminUser) {
  console.log('📝 Criando usuário administrador de teste...');

  // Senha simples para teste: "admin123"
  const adminPassword = btoa('admin123'); // Base64 básico para teste

  const insertAdmin = db.prepare(`
    INSERT INTO users (email, name, password_hash) 
    VALUES (?, ?, ?)
  `);

  const result = insertAdmin.run('admin@humansys.com', 'Administrador', adminPassword);

  // Criar créditos para o admin
  const insertCredits = db.prepare(`
    INSERT INTO user_credits (user_id, credits, plan) 
    VALUES (?, ?, ?)
  `);
  insertCredits.run(result.lastInsertRowid, 1000, 'premium');

  console.log('✅ Usuário administrador criado com sucesso!');
  console.log('📧 Email: admin@humansys.com');
  console.log('🔑 Senha: admin123');
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// User routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  console.log('🔐 Tentativa de login:', { email });

  // Converter senha para base64 para comparar
  const passwordHash = btoa(password);

  const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE email = ? AND password_hash = ?')
    .get(email, passwordHash);

  if (user) {
    console.log('✅ Login bem-sucedido:', user);
    res.json({ success: true, user });
  } else {
    console.log('❌ Credenciais inválidas para:', email);
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/users', (req, res) => {
  const { email, name, password_hash } = req.body;

  console.log('👤 Criando novo usuário:', { email, name });

  try {
    const stmt = db.prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)');
    const result = stmt.run(email, name, password_hash);

    // Create default credits
    const creditsStmt = db.prepare('INSERT INTO user_credits (user_id, credits) VALUES (?, ?)');
    creditsStmt.run(result.lastInsertRowid, 100);

    const newUser = { id: result.lastInsertRowid, email, name };
    console.log('✅ Usuário criado com sucesso:', newUser);

    res.json({ 
      success: true, 
      user: newUser
    });
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
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
      INSERT INTO collaborators (user_id, name, email, position, department, hire_date, invited_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const currentDate = new Date().toISOString();
    const result = stmt.run(user_id, name, email, position, department, hire_date, currentDate);

    res.json({ 
      success: true, 
      collaborator: { id: result.lastInsertRowid, invited_at: currentDate, ...req.body } 
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

// Users listing route
app.get('/api/users', (req, res) => {
  try {
    const users = db.prepare('SELECT id, email, name, created_at FROM users ORDER BY created_at DESC').all();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Database server running on port ${PORT}`);
  console.log(`📁 Database file: ${path.join(dataDir, 'app.db')}`);
  console.log(`🌐 Server accessible at: http://0.0.0.0:${PORT}`);
  console.log(`🔗 API Health check: http://0.0.0.0:${PORT}/api/health`);
});