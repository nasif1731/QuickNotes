import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('quicknotes_token');

  const handleLogout = () => {
    localStorage.removeItem('quicknotes_token');
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/auth-success';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <span className="navbar-brand">📝 QuickNotes</span>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {!isAuthPage && token && (
        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                className="btn btn-outline-light me-2"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
