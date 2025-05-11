import Navbar from '../components/Navbar';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:4000/api/auth/google';
  };

  return (
    <>
      <Navbar />

      <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
        <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '400px' }}>
          <div className="card-body text-center p-4">
            <h2 className="mb-3">📝 Welcome to QuickNotes</h2>
            <p className="text-muted mb-4">Sign in to start creating and managing your notes.</p>
            <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleGoogleLogin}>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
                style={{ width: '20px', height: '20px' }}
              />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
