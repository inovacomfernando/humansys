// Setup local simplificado
export const setupLocalDatabase = () => {
  console.log('🗄️ Inicializando banco de dados local...');

  // Verificar localStorage
  try {
    localStorage.setItem('db_test', 'ok');
    localStorage.removeItem('db_test');
    console.log('✅ LocalStorage disponível');

    // Inicializar estruturas básicas se não existirem
    const tables = ['collaborators', 'trainings', 'user_credits', 'goals', 'feedback'];

    tables.forEach(table => {
      const key = `local_db_${table}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });

    console.log('✅ Banco de dados local configurado');
    return true;
  } catch (error) {
    console.error('❌ Erro ao configurar banco local:', error);
    return false;
  }
};

// Executar setup
setupLocalDatabase();