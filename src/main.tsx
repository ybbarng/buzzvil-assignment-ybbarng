import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { useBattleStore } from "@/stores/battle-store";
import { useGameStore } from "@/stores/game-store";
import App from "./App.tsx";

if (import.meta.env.DEV) {
  Object.assign(window, { useBattleStore, useGameStore });
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
