import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NoteForm from './components/NoteForm';
import PublicNotesList from './components/PublicNotesList';
import PublicNotePage from './pages/PublicNotePage';
import Login from './pages/Login';
import AuthSuccess from './pages/AuthSuccess';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('quicknotes_token'));

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('quicknotes_token'));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <div className="vh-100 d-flex flex-column">
        {token && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}
        <div className="flex-grow-1 overflow-auto">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/auth-success" element={<AuthSuccess />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/public-note/:id" element={<PublicNotePage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;