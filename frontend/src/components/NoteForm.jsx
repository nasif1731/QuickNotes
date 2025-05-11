import React, { useState } from 'react';
import { createNote } from '../api/notes';

const NoteForm = () => {
  const [note, setNote] = useState({
    title: '',
    content: '',
    is_public: false,
    tags: '',
    category: 'Low'
  });
  const [noteId, setNoteId] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedNote = {
        ...note,
        tags: note.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      const res = await createNote(formattedNote);
      setNoteId(res.data.id);
      setNote({ title: '', content: '', is_public: false, tags: '', category: 'Low' });
      setError(null);
    } catch (err) {
      setError('❌ Failed to create note. Please try again.');
    }
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h4 className="mb-3">📝 Create Note</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Title"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Content"
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Tags (comma-separated)"
            value={note.tags}
            onChange={(e) => setNote({ ...note, tags: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={note.category}
            onChange={(e) => setNote({ ...note, category: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={note.is_public}
            onChange={(e) => setNote({ ...note, is_public: e.target.checked })}
            id="publicCheckbox"
          />
          <label className="form-check-label" htmlFor="publicCheckbox">Make Public</label>
        </div>

        <button className="btn btn-primary" type="submit">Create</button>

        {noteId && <p className="mt-3 text-success">✅ Note created with ID: {noteId}</p>}
        {error && <p className="mt-3 text-danger">{error}</p>}
      </form>
    </div>
  );
};

export default NoteForm;
