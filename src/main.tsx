
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Inicializar sistema local
console.log('%c🏠 ORIENTOHUB - SISTEMA LOCAL', 'color: #10b981; font-size: 18px; font-weight: bold;');
console.log('%cSistema configurado para rodar totalmente local', 'color: #10b981; font-size: 12px;');

// Verificar e inicializar localStorage se necessário
const initializeLocalSystem = () => {
  try {
    // Teste de localStorage
    localStorage.setItem('system_test', 'ok');
    localStorage.removeItem('system_test');
    
    console.log('✅ Sistema de armazenamento local disponível');
    
    // Limpar dados antigos do Supabase se existirem
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('supabase.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar sistema local:', error);
    return false;
  }
};

// Inicializar sistema
if (initializeLocalSystem()) {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Failed to find the root element");

  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  // Fallback se localStorage não estiver disponível
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
      <div style="text-align: center;">
        <h1 style="color: #ef4444;">Erro no Sistema</h1>
        <p>LocalStorage não está disponível neste navegador.</p>
        <p>Por favor, habilite o armazenamento local e recarregue a página.</p>
      </div>
    </div>
  `;
}
