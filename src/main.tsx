
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupTables } from './lib/replit-db';

// Clear any problematic cache entries on startup
const clearProblematicCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-') || key.includes('cache_')) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cache limpo com sucesso');
  } catch (error) {
    console.error('Erro ao limpar cache:', error);
  }
};

// Clean up on startup
clearProblematicCache();

// Initialize PostgreSQL database on app start
setupTables()
  .then(() => console.log('✅ PostgreSQL Database initialized successfully'))
  .catch(error => {
    console.error('❌ PostgreSQL Database initialization failed:', error);
    // Don't prevent app from starting
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
