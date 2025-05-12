import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicNoteById } from '../api/notes';
import html2pdf from 'html2pdf.js';
import { ArrowLeft, Download, FileText } from 'react-feather';

const PublicNotePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await getPublicNoteById(id);
        if (res.data) {
          setNote(res.data);
          setError('');
        } else {
          setError('Note not found');
        }
      } catch (err) {
        setError('Failed to load note. It may be private or deleted.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNote();
  }, [id]);

  const exportToPDF = () => {
    const element = document.getElementById('note-content');
    html2pdf().from(element).save(`${note.title}.pdf`);
  };

  const exportToMarkdown = () => {
    const content = `# ${note.title}\n\n${note.content}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${note.title}.md`;
    link.click();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="container py-5">
        <div className="glass-container p-4 text-center">
          <h2 className="text-danger mb-3">❌ Note Unavailable</h2>
          <p className="lead">{error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="me-2"/>
            Back to Notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="glass-container p-4 p-lg-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} className="me-2"/>
            Back
          </button>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-outline-dark"
              onClick={exportToPDF}
              title="Export to PDF"
            >
              <Download size={18}/>
            </button>
            <button 
              className="btn btn-outline-dark"
              onClick={exportToMarkdown}
              title="Export to Markdown"
            >
              <FileText size={18}/>
            </button>
          </div>
        </div>

        <article id="note-content">
          <header className="mb-5">
            <h1 className="display-5 fw-bold mb-3">{note.title}</h1>
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className={`badge rounded-pill fs-6 ${
                note.category === 'High' ? 'bg-danger' : 
                note.category === 'Medium' ? 'bg-warning' : 'bg-success'
              }`}>
                {note.category} Priority
              </span>
              {note.createdAt && (
                <span className="text-muted">
                  Created {new Date(note.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </header>

          <section className="mb-5">
            <div className="tags-cloud mb-4">
              {(note.tags || []).map((tag, i) => (
                <span key={i} className="badge bg-secondary me-2 rounded-pill px-3">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="note-content bg-light p-4 rounded-3">
              <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                {note.content}
              </pre>
            </div>
          </section>

          <footer className="text-muted small">
            <div className="d-flex justify-content-between align-items-center">
              <span>Note ID: {note.id}</span>
              {note.updatedAt && (
                <span>
                  Last updated: {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default PublicNotePage;