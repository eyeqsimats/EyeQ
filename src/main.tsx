import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import scrollFX from "./lib/scrollFX";

// Initialize scroll animations after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  scrollFX.init();
});

createRoot(document.getElementById("root")!).render(<App />);
