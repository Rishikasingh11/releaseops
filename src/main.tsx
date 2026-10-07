import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Ensure strict in-memory execution: purge any legacy client-side storage keys
if (typeof window !== 'undefined') {
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch {
    // Ignore if storage access is restricted
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
