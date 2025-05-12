import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('quicknotes_token');
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('quicknotes_token');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/auth-success';

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center gap-3">
          <span className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" strokeWidth="2" className="feather feather-file-text">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            QuickNotes
          </span>
          <button 
            onClick={toggleDarkMode}
            className="btn btn-link text-decoration-none"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '🌞' : '🌙'}
          </button>
        </div>

        {!isAuthPage && token && (
          <div className="d-flex gap-3 align-items-center responsive-stack">
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-link text-decoration-none text-dark dark-mode-text"
            >
              Dashboard
            </button>
            <button 
              onClick={handleLogout}
              className="btn btn-outline-danger rounded-pill px-4 btn-hover-effect"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;