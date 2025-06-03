import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Log de inicialização
console.log('%c🏠 ORIENTOHUB - SISTEMA LOCAL', 'color: #10b981; font-size: 18px; font-weight: bold;');
console.log('%c✅ Inicializando aplicação...', 'color: #10b981; font-size: 12px;');

// Encontrar elemento root
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Elemento root não encontrado");
}

// Renderizar aplicação
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('%c✅ Aplicação renderizada', 'color: #10b981; font-size: 12px; font-weight: bold;');