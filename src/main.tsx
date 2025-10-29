/**
 * Venkat Express - Premium Global Shopping & Courier Service
 * Developed by: Shiva from Dream Team Services
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use try-catch for Chrome mobile compatibility
    try {
      navigator.serviceWorker
        .register('/service-worker.js', { scope: '/' })
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope);
        })
        .catch((error) => {
          // Fail silently - don't block app initialization
          console.log('Service Worker registration failed:', error);
        });
    } catch (error) {
      // Chrome mobile might throw errors, catch them
      console.log('Service Worker not supported or blocked:', error);
    }
  });
}

// Handle PWA start - ensure app opens at home page when launched as standalone
if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
  // Check if this is the initial PWA launch
  const isPWALaunch = sessionStorage.getItem('pwa_launched') !== 'true';
  
  if (isPWALaunch) {
    // Mark PWA as launched in this session
    sessionStorage.setItem('pwa_launched', 'true');
    
    // If not on home page and this is a fresh PWA launch, redirect to home
    if (window.location.pathname !== '/' && !window.location.pathname.startsWith('/product/')) {
      window.location.href = '/';
    }
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Please check your index.html file.");
}

createRoot(rootElement).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
