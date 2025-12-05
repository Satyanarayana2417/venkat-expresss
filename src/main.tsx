/**
 * Venkat Express - Premium Global Shopping & Courier Service
 * Developed by: Shiva from Dream Team Services
 */

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Storage version for managing cache invalidation
const STORAGE_VERSION = '1.0.1';
const STORAGE_VERSION_KEY = 'venkat-express-storage-version';

/**
 * Validate and clean localStorage data to prevent app crashes
 * This runs before the app mounts to ensure clean state
 */
const validateAndCleanStorage = (): void => {
  try {
    const currentVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    
    // If storage version doesn't match, clear potentially stale/corrupted data
    if (currentVersion !== STORAGE_VERSION) {
      console.log('Storage version mismatch, cleaning up old data...');
      
      // List of keys to validate (but not delete immediately)
      const keysToValidate = [
        'venkat-express-cart-guest',
        'venkat-express-wishlist-guest',
        'userLocation',
        'userLanguage'
      ];

      keysToValidate.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            // Try to parse JSON keys
            if (key !== 'userLanguage') {
              JSON.parse(value);
            }
          }
        } catch (error) {
          console.warn(`Removing corrupted localStorage key: ${key}`);
          localStorage.removeItem(key);
        }
      });

      // Update storage version
      localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
    }
  } catch (error) {
    console.error('Error validating localStorage:', error);
    // If localStorage is completely broken, try to clear it
    try {
      localStorage.clear();
      localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
    } catch (e) {
      console.error('Could not clear localStorage:', e);
    }
  }
};

// Ensure we're in a browser environment before accessing browser APIs
if (typeof window !== 'undefined') {
  // Validate storage before anything else
  validateAndCleanStorage();
  
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
}

// Safely get root element with browser check
const rootElement = typeof document !== 'undefined' ? document.getElementById("root") : null;

if (!rootElement) {
  throw new Error("Root element not found. Please check your index.html file.");
}

createRoot(rootElement).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
