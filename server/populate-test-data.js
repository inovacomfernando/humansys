
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../data/app.db'));

// Inserir usuários de teste
const insertUser = db.prepare('INSERT OR IGNORE INTO users (email, name, password_hash) VALUES (?, ?, ?)');
const insertCredits = db.prepare('INSERT OR IGNORE INTO user_credits (user_id, credits, plan) VALUES (?, ?, ?)');
const insertCollaborator = db.prepare(`
  INSERT OR IGNORE INTO collaborators (user_id, name, email, position, department, hire_date, invited_at) 
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Dados de teste
const testUsers = [
  { email: 'admin@humansys.com', name: 'Administrador do Sistema', password: 'admin123' },
  { email: 'amanda@vendasimples.com.br', name: 'Amanda Motta', password: 'senha123' },
  { email: 'joao@empresa.com', name: 'João Silva', password: 'senha123' }
];

const testCollaborators = [
  { name: 'Amanda Motta', email: 'amanda@vendasimples.com.br', position: 'Gerente de Vendas', department: 'Vendas' },
  { name: 'Carlos Santos', email: 'carlos@empresa.com', position: 'Desenvolvedor', department: 'TI' },
  { name: 'Maria Oliveira', email: 'maria@empresa.com', position: 'Analista RH', department: 'Recursos Humanos' }
];

console.log('🚀 Populando dados de teste...');

try {
  // Inserir usuários
  testUsers.forEach((user, index) => {
    const result = insertUser.run(user.email, user.name, user.password);
    const userId = result.lastInsertRowid || index + 1;
    
    // Inserir créditos
    insertCredits.run(userId, 100, 'trial');
    
    console.log(`✅ Usuário criado: ${user.name} (ID: ${userId})`);
  });

  // Inserir colaboradores para o primeiro usuário
  testCollaborators.forEach((collab) => {
    const currentDate = new Date().toISOString();
    insertCollaborator.run(
      1, // user_id do primeiro usuário
      collab.name,
      collab.email,
      collab.position,
      collab.department,
      currentDate.split('T')[0], // hire_date
      currentDate // invited_at
    );
    console.log(`✅ Colaborador criado: ${collab.name}`);
  });

  console.log('🎉 Dados de teste inseridos com sucesso!');
  
} catch (error) {
  console.error('❌ Erro ao inserir dados:', error);
} finally {
  db.close();
}
