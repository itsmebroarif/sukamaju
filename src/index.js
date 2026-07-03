import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Catch chunk loading errors (typical for SPA updates where old files are deleted)
window.addEventListener('error', (e) => {
  const target = e.target;
  const isScriptError = target && target.tagName === 'SCRIPT' && target.src;
  const isChunkError = e.message && (e.message.includes('ChunkLoadError') || e.message.includes('Loading chunk'));
  
  if (isScriptError || isChunkError) {
    console.warn('Asset loading failed. Forcing reload to fetch fresh assets...', e);
    const lastReload = localStorage.getItem('sukamaju-last-reload');
    const now = Date.now();
    if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
      localStorage.setItem('sukamaju-last-reload', now.toString());
      window.location.reload();
    }
  }
}, true);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Actively unregister all service workers to clear cache bugs
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('Successfully unregistered old service worker');
        }
      });
    }
  }).catch((err) => {
    console.error('Error unregistering service workers:', err);
  });
}

