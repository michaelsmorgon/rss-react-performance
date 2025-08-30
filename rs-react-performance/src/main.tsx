import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <Suspense
      fallback={
        <div className="spinner" aria-busy="true" aria-label="Loading data…" />
      }
    >
      <App />
    </Suspense>
  </StrictMode>
);
