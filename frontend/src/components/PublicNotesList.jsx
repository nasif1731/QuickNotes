import React, { useEffect, useState } from 'react';
import { getPublicNotes, deleteNote, updateNote } from '../api/notes';
import html2pdf from 'html2pdf.js';

const PublicNotesList = () => {
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', is_public: true, tags: '', category: 'Low' });
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchNotes = async () => {
    try {
      const res = await getPublicNotes();
      const result = Array.isArray(res.data) ? res.data : [];
      setNotes(result);
    } catch (err) {
      console.error("❌ Failed to fetch notes", err);
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

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
    await updateNote(editingNoteId, {
      ...editForm,
      tags: editForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    });
    setEditingNoteId(null);
    fetchNotes();
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
    <div className="card p-4 shadow-sm mt-4">
      <h4 className="mb-3">📢 Public Notes</h4>

      <input
        className="form-control mb-2"
        placeholder="Search by title or note ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <select
        className="form-select mb-3"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {filteredNotes.length === 0 ? (
        <p className="text-muted">No matching notes found.</p>
      ) : (
        <ul className="list-group">
          {filteredNotes.map((note) => (
            <li key={note.id} className="list-group-item">
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
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={editForm.is_public}
                      onChange={(e) => setEditForm({ ...editForm, is_public: e.target.checked })}
                      id={`public-${note.id}`}
                    />
                    <label className="form-check-label" htmlFor={`public-${note.id}`}>Public</label>
                  </div>
                  <button className="btn btn-success btn-sm me-2" onClick={handleUpdate}>Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditingNoteId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <h5>{note.title}</h5>
                  <p>{note.content}</p>
                  <div className="mb-2">
                    <span className={`badge me-2 ${note.category === 'High' ? 'bg-danger' : note.category === 'Medium' ? 'bg-warning text-dark' : 'bg-success'}`}>
                      {note.category}
                    </span>
                    {(note.tags || []).map((tag, i) => (
                      <span key={i} className="badge bg-secondary me-1">{tag}</span>
                    ))}
                  </div>
                  <small className="text-muted">ID: {note.id}</small><br />
                  <div className="mt-2">
                    <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(note)}>Edit</button>
                    <button className="btn btn-sm btn-danger me-2" onClick={() => handleDelete(note.id)}>Delete</button>
                    <button className="btn btn-sm btn-info me-2" onClick={() => exportToPDF(note)}>📄 Export PDF</button>
                    <button className="btn btn-sm btn-outline-info" onClick={() => exportToMarkdown(note)}>📝 Export MD</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PublicNotesList;
