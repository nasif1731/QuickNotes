import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8000' });

// API calls
export const fetchNotes = () => API.get('/notes');
export const createNote = (note) => API.post('/notes', note);
export const getPublicNotes = () => API.get('/notes');
export const deleteNote = (id) => API.delete(`/notes/${id}`);
export const updateNote = (id, updatedNote) => API.put(`/notes/${id}`, updatedNote);

