import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import SafeSpace from './safespace';
import Login from './components/Login';
import Register from './components/Register';
import Home from './home';
import Profile from './components/ProfileNew';
import Chatbot from './chatbot';
import Navbar from './components/Navbar';
// PWA components disabled to fix offline issues
// import PWAInstallPrompt from './components/PWAInstallPrompt';
// import OfflineIndicator from './components/OfflineIndicator';
import ErrorBoundary from './components/ErrorBoundary';

import AboutPage from './about/AboutPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/safespace" element={<SafeSpace />} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/chatbot" element={<Chatbot />} />
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* PWA components disabled to fix offline issues */}
        {/* <PWAInstallPrompt /> */}
        {/* <OfflineIndicator /> */}
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);

// SERVICE WORKER COMPLETELY DISABLED - Was causing offline redirect issues
// This fixes the problem where login redirects to offline page
console.log('🚫 Service Worker COMPLETELY DISABLED to prevent offline redirect issues');

// AGGRESSIVE SERVICE WORKER REMOVAL
if ('serviceWorker' in navigator) {
  // Immediate and aggressive unregister
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      console.log(`🗑️ FORCE REMOVING ${registrations.length} service worker(s)`);
      registrations.forEach(registration => {
        registration.unregister().then(success => {
          if (success) {
            console.log('✅ FORCE REMOVED service worker:', registration.scope);
          } else {
            console.log('❌ Failed to remove service worker:', registration.scope);
          }
        });
      });
    } else {
      console.log('✅ No service workers found - CLEAN STATE CONFIRMED');
    }
  }).catch(error => {
    console.error('❌ Error checking service workers:', error);
  });

  // Block any new service worker registrations
  const originalRegister = navigator.serviceWorker.register;
  navigator.serviceWorker.register = function() {
    console.log('🚫 BLOCKED service worker registration attempt');
    return Promise.reject(new Error('Service Worker registration blocked'));
  };

  // Block controller changes
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🚫 BLOCKING service worker controller change');
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  });
}

// Ensure no offline caching
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    if (cacheNames.length > 0) {
      console.log('🗑️ Clearing all caches:', cacheNames);
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  }).then(() => {
    console.log('✅ All caches cleared');
  }).catch(error => {
    console.error('❌ Error clearing caches:', error);
  });
}
