import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem('quicknotes_token');
    if (!savedToken) {
      navigate('/login?error=unauthorized');
    } else {
      setToken(savedToken);
    }
  }, [navigate]);

  return (
    <>
      <Navbar />

      <div className="container py-4">
        <div className="alert alert-success">
          Welcome to your dashboard! 🎉
        </div>

        <p className="text-muted">This will show your notes and tools soon.</p>
      </div>
    </>
  );
};

export default Dashboard;
