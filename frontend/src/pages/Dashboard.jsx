import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import NoteForm from '../components/NoteForm';
import PublicNotesList from '../components/PublicNotesList';

const Dashboard = () => {
  const [token, setToken] = useState(undefined); // undefined = loading, null = not found
  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem('quicknotes_token');
    if (!savedToken) {
      setToken(null);
    } else {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token === null) {
      navigate('/login?error=unauthorized');
    }
  }, [token, navigate]);

  if (token === undefined) {
    return <div className="text-center mt-5">🔄 Checking authentication...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4">
        <div className="alert alert-success">
          ✅ Welcome to your dashboard!
        </div>
        <NoteForm />
        <PublicNotesList />
      </div>
    </>
  );
};

export default Dashboard;
