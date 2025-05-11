import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NoteForm from './components/NoteForm';
import PublicNotesList from './components/PublicNotesList';
import Login from './pages/Login';
import AuthSuccess from './pages/AuthSuccess';
import Dashboard from './pages/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Make sure dark-mode styles are here

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const Layout = () => (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">📝 Quick Notes</h1>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      <NoteForm />
      <PublicNotesList />
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
