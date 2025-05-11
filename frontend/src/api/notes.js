import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/notes`
});

// API calls
export const fetchNotes = () => API.get('/');
export const createNote = (note) => API.post('/', note);
export const getPublicNotes = () => API.get('/');
export const deleteNote = (id) => API.delete(`/${id}`);
export const updateNote = (id, updatedNote) => API.put(`/${id}`, updatedNote);
