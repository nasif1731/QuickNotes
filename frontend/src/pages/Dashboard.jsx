import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import NoteForm from '../components/NoteForm';
import PublicNotesList from '../components/PublicNotesList';

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

  // Optional loading screen while checking token
  if (!token) return null;

  return (
    <>
      <Navbar />

      <div className="container-fluid py-4">
        <div className="alert alert-success">
          ✅ Welcome to your dashboard! You are logged in.
        </div>

        <div className="mb-4">
          <NoteForm />
        </div>

        <div>
          <PublicNotesList />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
