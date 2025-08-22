import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

// Convenience functions
export const loginUser = (email, password) => api.post('/users/login', { email, password });
export const registerUser = (payload) => api.post('/users/register', payload);
export const getMe = () => api.get('/users/me');
export const updateMe = (payload) => api.put('/users/me', payload);

export const getTasks = (params) => api.get('/tasks', { params });
export const getTask = (id) => api.get(`/tasks/${id}`);
export const createTask = (payload) => api.post('/tasks', payload);
export const updateTask = (id, payload) => api.put(`/tasks/${id}`, payload);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export const applyForTask = (taskId) => api.post(`/applications/apply/${taskId}`);
export const getApplicationsForTask = (taskId) => api.get(`/applications/task/${taskId}`);
export const updateApplicationStatus = (applicationId, status) => api.put(`/applications/${applicationId}`, { status }); 