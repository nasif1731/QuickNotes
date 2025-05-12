import React, { useState } from 'react';
import { deleteNote, updateNote } from '../api/notes';
import { Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const PublicNotesList = ({ notes, onNotesUpdate }) => {
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    is_public: true,
    tags: '',
    category: 'Low'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const startEdit = (note) => {
    setEditingNoteId(note.id);
    setEditForm({
      title: note.title,
      content: note.content,
      is_public: note.is_public,
      tags: Array.isArray(note.tags) ? note.tags.join(', ') : note.tags || '',
      category: note.category || 'Low'
    });
  };

  const handleUpdate = async () => {
    try {
      await updateNote(editingNoteId, {
        ...editForm,
        is_public: true,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      });
      setEditingNoteId(null);
      onNotesUpdate(); // Trigger refresh
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      onNotesUpdate(); // Trigger refresh
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const exportToPDF = (note) => {
    const element = document.createElement('div');
    element.innerHTML = `<h2>${note.title}</h2><p>${note.content}</p>`;
    html2pdf().from(element).save(`${note.title}.pdf`);
  };

  const exportToMarkdown = (note) => {
    const content = `# ${note.title}\n\n${note.content}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${note.title}.md`;
    link.click();
  };

  const filteredNotes = notes.filter(note =>
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter ? note.category === categoryFilter : true)
  );

  return (
    <div className="glass-container p-4 rounded-4 shadow-sm mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 responsive-stack">
        <h4 className="m-0">Public Notes</h4>
        <div className="d-flex gap-2 flex-grow-1 ms-3" style={{ maxWidth: '600px' }}>
          <input
            className="modern-search form-control"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="modern-select form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">No notes found matching your criteria</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredNotes.map((note) => (
            <div key={note.id} className="col-12 col-md-6 col-lg-4">
              <div className="note-card card h-100 border-0 shadow-sm hover-shadow">
                <div className="card-body">
                  {editingNoteId === note.id ? (
                    <div>
                      <input
                        className="form-control mb-2"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                      <textarea
                        className="form-control mb-2"
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      />
                      <input
                        className="form-control mb-2"
                        placeholder="Tags (comma-separated)"
                        value={editForm.tags}
                        onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                      />
                      <select
                        className="form-select mb-2"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      
                      <button className="btn btn-success btn-sm me-2" onClick={handleUpdate}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingNoteId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0">
                          <Link to={`/public-note/${note.id}`} className="text-decoration-none">
                            {note.title}
                          </Link>
                        </h5>
                        <span className={`badge rounded-pill ${
                          note.category === 'High' ? 'bg-danger' : 
                          note.category === 'Medium' ? 'bg-warning' : 'bg-success'
                        }`}>
                          {note.category}
                        </span>
                      </div>
                      
                      <p className="card-text text-muted mb-3">{note.content.slice(0, 100)}...</p>
                      
                      <div className="tag-cloud mb-3">
                        {(note.tags || []).map((tag, i) => (
                          <span key={i} className="badge bg-secondary me-1 rounded-pill">{tag}</span>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="btn-group">
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => startEdit(note)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(note.id)}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="export-buttons">
                          <button 
                            className="btn btn-sm btn-link text-decoration-none"
                            onClick={() => exportToPDF(note)}
                            title="Export to PDF"
                          >
                            📄
                          </button>
                          <button 
                            className="btn btn-sm btn-link text-decoration-none"
                            onClick={() => exportToMarkdown(note)}
                            title="Export to Markdown"
                          >
                            📝
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicNotesList;