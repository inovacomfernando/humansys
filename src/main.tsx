import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupDatabase } from './lib/setupDatabase';

// Clear any problematic cache entries on startup
const clearProblematicCache = () => {
  try {
    // Remove any corrupted auth tokens
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('supabase.auth') && key.includes('undefined')) {
        localStorage.removeItem(key);
        console.log('Removed corrupted auth key:', key);
      }
    });

    // Clear any old cache that might be causing issues
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

// Clean up on startup
clearProblematicCache();

// Initialize database on app start with better error handling
setupDatabase()
  .then(() => console.log('Database initialized successfully'))
  .catch(error => {
    console.error('Database initialization failed:', error);
    // Don't prevent app from starting
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);