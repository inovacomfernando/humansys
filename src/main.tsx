
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setupDatabase } from "@/lib/setupDatabase";

// Função para inicializar o sistema
const initializeSystem = async () => {
  console.log('%c🏠 ORIENTOHUB - SISTEMA LOCAL', 'color: #10b981; font-size: 18px; font-weight: bold;');
  console.log('%cInicializando sistema...', 'color: #10b981; font-size: 12px;');

  try {
    // Configurar banco de dados
    const dbReady = await setupDatabase();
    
    if (dbReady) {
      console.log('%c✅ Sistema inicializado com sucesso', 'color: #10b981; font-size: 12px; font-weight: bold;');
    } else {
      console.warn('%c⚠️ Sistema iniciado com limitações no banco', 'color: #f59e0b; font-size: 12px;');
    }
  } catch (error) {
    console.error('%c❌ Erro na inicialização:', 'color: #ef4444; font-size: 12px;', error);
  }
};

// Encontrar elemento root
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Elemento root não encontrado");
}

// Inicializar sistema e renderizar app
const root = createRoot(rootElement);

// Renderizar imediatamente e inicializar em paralelo
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Inicializar sistema em background
initializeSystem().catch(error => {
  console.error('Erro crítico na inicialização:', error);
});
