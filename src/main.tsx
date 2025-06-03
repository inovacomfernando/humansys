import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Inicializar sistema local
console.log('%c🏠 ORIENTOHUB - SISTEMA LOCAL', 'color: #10b981; font-size: 18px; font-weight: bold;');
console.log('%cSistema configurado para rodar 100% local', 'color: #10b981; font-size: 12px;');

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);