import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import NoteForm from '../components/NoteForm';
import PublicNotesList from '../components/PublicNotesList';
import { getPublicNotes } from '../api/notes';

const Dashboard = () => {
  const [token, setToken] = useState(undefined);
  const [notes, setNotes] = useState([]);
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

  const fetchNotes = async () => {
    try {
      const res = await getPublicNotes();
      const result = Array.isArray(res.data) ? res.data : [];
      setNotes(result);
    } catch (err) {
      console.error("Failed to fetch notes", err);
      setNotes([]);
    }
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  if (token === undefined) {
    return <div className="text-center mt-5">🔄 Checking authentication...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="container-fluid py-4 px-lg-5">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="mb-5">
              <h1 className="display-6 mb-3">Welcome to Your Dashboard</h1>
              <p className="lead text-muted">
                Start creating and organizing your notes efficiently
              </p>
            </div>
            
            <NoteForm onNoteCreated={fetchNotes} />
            <PublicNotesList 
              notes={notes} 
              onNotesUpdate={fetchNotes} 
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;