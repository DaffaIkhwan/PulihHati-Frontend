import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import SafeSpace from './components/SafeSpace';
import Login from './components/Login';
import Register from './components/Register';
import Home from "./components/Home";
import Chatbot from './chatbot';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/safespace" element={<SafeSpace />} />
        <Route path="/about" element={<div className="p-8">About Us Page</div>} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/chatbot" element={<Chatbot />} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
