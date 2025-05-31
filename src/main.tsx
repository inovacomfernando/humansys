import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { setupDatabase } from './lib/setupDatabase'

// Inicializar banco de dados
setupDatabase().then(() => {
  console.log('Database initialization completed');
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)