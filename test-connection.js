
const fetch = require('node-fetch');

async function testConnection() {
  try {
    console.log('🔍 Testando conexão com o servidor...');
    
    // Teste 1: Health check
    const healthResponse = await fetch('http://0.0.0.0:3001/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Teste 2: Listar usuários
    const usersResponse = await fetch('http://0.0.0.0:3001/api/users');
    const usersData = await usersResponse.json();
    console.log('✅ Usuários disponíveis:', usersData);
    
    // Teste 3: Login com credenciais de teste
    const loginResponse = await fetch('http://0.0.0.0:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@humansys.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Teste de login:', loginData);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testConnection();
