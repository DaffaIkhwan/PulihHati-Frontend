import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import './index.css';
import SafeSpace from './components/SafeSpace';
import HomeScreen from './home';
import Chatbot from './chatbot';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/app/*" element={<App />} />
        <Route path="/safespace" element={<SafeSpace />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/chatbot" element={<Chatbot />} />
        {/* Redirect to HomeScreen as default route */}
        <Route path="*" element={<Navigate to="/chatbot" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
