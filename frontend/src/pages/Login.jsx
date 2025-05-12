import Navbar from '../components/Navbar';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/api/auth/google`;
  };

  return (
    <>
      <Navbar />
      <div className="d-flex vh-100 justify-content-center align-items-center bg-light dark-mode-bg">
        <div className="glass-container shadow-lg border-0 p-5" style={{ width: '100%', maxWidth: '440px' }}>
          <div className="text-center">
            <div className="icon-wrapper bg-primary rounded-3 p-3 mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" 
                   stroke="currentColor" strokeWidth="2" className="feather feather-file-text text-white">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h2 className="mb-3">Welcome to QuickNotes</h2>
            <p className="text-muted mb-4">Secure note-taking made simple</p>
            
            <button
              className="btn btn-lg btn-outline-dark w-100 d-flex align-items-center justify-content-center gap-2 btn-hover-effect"
              onClick={handleGoogleLogin}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;