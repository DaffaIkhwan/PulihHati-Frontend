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

// Service Worker DISABLED - Was causing offline redirect issues
// This fixes the problem where login redirects to offline page
console.log('🚫 Service Worker disabled to prevent offline redirect issues');

// Force unregister any existing service workers
if ('serviceWorker' in navigator) {
  // Immediate unregister
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      console.log(`🗑️ Found ${registrations.length} service worker(s) to unregister`);
      registrations.forEach(registration => {
        registration.unregister().then(success => {
          if (success) {
            console.log('✅ Successfully unregistered service worker:', registration.scope);
          } else {
            console.log('❌ Failed to unregister service worker:', registration.scope);
          }
        });
      });

      // Force reload after unregistering
      setTimeout(() => {
        console.log('🔄 Reloading page to ensure clean state...');
        window.location.reload();
      }, 1000);
    } else {
      console.log('✅ No service workers found - clean state');
    }
  }).catch(error => {
    console.error('❌ Error checking service workers:', error);
  });

  // Also listen for any new service worker registrations and block them
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🚫 Blocking new service worker registration');
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => registration.unregister());
    });
  });
}
