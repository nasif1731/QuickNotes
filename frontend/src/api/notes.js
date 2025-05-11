import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}` // base is just the gateway root
});

// Notes API calls
export const fetchNotes = () => API.get('/notes');
export const createNote = (note) => API.post('/notes', note);  // ✅ NO trailing slash
export const getPublicNotes = () => API.get('/notes');
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const updateNote = (id, updatedNote) => API.put(`/notes/${id}`, updatedNote);
