
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Limpar cache corrompido na inicialização
const clearCorruptedCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase.auth') && key.includes('undefined')) {
        localStorage.removeItem(key);
        console.log('Removed corrupted auth key:', key);
      }
    });

    // Limpar cache antigo
    keys.forEach(key => {
      if (key.includes('cache') && key.includes('null')) {
        localStorage.removeItem(key);
        console.log('Removed corrupted cache key:', key);
      }
    });
  } catch (error) {
    console.log('Cache cleanup error:', error);
  }
};

// Executar limpeza
clearCorruptedCache();

console.log('%c🛠️ MODO DESENVOLVIMENTO', 'color: blue; font-size: 16px; font-weight: bold;');
console.log('%cSistema iniciado em modo de desenvolvimento', 'color: blue; font-size: 12px;');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
