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

// Unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('🗑️ Unregistered service worker:', registration.scope);
    });
  });
}
