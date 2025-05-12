import React, { useState } from 'react';
import { createNote } from '../api/notes';

const NoteForm = ({ onNoteCreated }) => {
  const [note, setNote] = useState({
    title: '',
    content: '',
    is_public: true,
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
        is_public: true,
        tags: note.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      const res = await createNote(formattedNote);
      setNoteId(res.data.id);
      setNote({ title: '', content: '', is_public: false, tags: '', category: 'Low' });
      setError(null);
      onNoteCreated(); // Trigger notes refresh
    } catch (err) {
      setError('❌ Failed to create note. Please try again.');
    }
  };

  return (
    <div className="glass-container p-4 rounded-4 shadow-sm mb-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="icon-wrapper bg-primary rounded-3 p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
               stroke="currentColor" strokeWidth="2" className="feather feather-edit-3 text-white">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>
        <h4 className="m-0">Create New Note</h4>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            className="modern-input form-control"
            placeholder="Note title"
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            required
          />
        </div>

        <div className="mb-4">
          <textarea
            className="modern-input form-control"
            placeholder="Write your content here..."
            rows="4"
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            required
          />
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <input
              className="modern-input form-control"
              placeholder="Tags (comma separated)"
              value={note.tags}
              onChange={(e) => setNote({ ...note, tags: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <select
              className="modern-select form-select"
              value={note.category}
              onChange={(e) => setNote({ ...note, category: e.target.value })}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary w-100 py-2 btn-hover-effect" type="submit">
          Create Note
        </button>

        {noteId && (
          <div className="alert alert-success mt-3 mb-0">
            ✅ Note created successfully!
          </div>
        )}
        {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
      </form>
    </div>
  );
};

export default NoteForm;