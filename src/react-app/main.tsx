import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/react-app/index.css";
import App from "@/react-app/App.tsx";

// Add error handling for the root element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

// Add global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

try {
  const root = createRoot(rootElement);
  
  // Remove initial loading screen
  const removeLoadingScreen = () => {
    const loadingElement = document.getElementById('initial-loading');
    if (loadingElement) {
      loadingElement.remove();
    }
  };

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  // Remove loading screen after React renders
  setTimeout(removeLoadingScreen, 100);
} catch (error) {
  console.error('Failed to render app:', error);
  // Fallback UI
  rootElement.innerHTML = `
    <div style="
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background-color: #f9fafb; 
      font-family: system-ui, -apple-system, sans-serif;
      padding: 20px;
    ">
      <div style="
        max-width: 400px; 
        background: white; 
        border-radius: 8px; 
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
        padding: 24px; 
        text-align: center;
      ">
        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
        <h1 style="font-size: 20px; font-weight: bold; color: #111827; margin-bottom: 8px;">
          Loading Error
        </h1>
        <p style="color: #6b7280; margin-bottom: 16px;">
          Unable to load the application. Please refresh the page or try again later.
        </p>
        <button 
          onclick="window.location.reload()" 
          style="
            background-color: #2563eb; 
            color: white; 
            padding: 8px 16px; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer;
            font-size: 14px;
          "
        >
          Refresh Page
        </button>
      </div>
    </div>
  `;
}
