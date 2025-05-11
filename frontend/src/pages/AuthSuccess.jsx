import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('quicknotes_token', token);
      navigate('/dashboard'); // or wherever you want
    } else {
      navigate('/login?error=missing_token');
    }
  }, [location, navigate]);

  return <p className="text-center mt-5">Logging you in...</p>;
};

export default AuthSuccess;