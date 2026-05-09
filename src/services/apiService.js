import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ── Auth ─────────────────────────────────────────
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => localStorage.removeItem('adminToken'),
    isLoggedIn: () => !!localStorage.getItem('adminToken'),
};

// ── Profile ───────────────────────────────────────
export const profileService = {
    getProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },
    update: (id, data) => api.put(`/profile/${id}`, data),
};

// ── Upload ────────────────────────────────────────
export const uploadService = {
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/Upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data; // { url, fileName }
    },
};

// ── Projects ──────────────────────────────────────
export const projectService = {
    getAll: () => api.get('/projects'),
    getById: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
};

// ── Skills ────────────────────────────────────────
export const skillService = {
    getAll: () => api.get('/skills'),
    create: (data) => api.post('/skills', data),
    update: (id, data) => api.put(`/skills/${id}`, data),
    delete: (id) => api.delete(`/skills/${id}`),
};

// ── Testimonials ──────────────────────────────────
export const testimonialService = {
    getAll: () => api.get('/testimonials'),
    create: (data) => api.post('/testimonials', data),
    update: (id, data) => api.put(`/testimonials/${id}`, data),
    delete: (id) => api.delete(`/testimonials/${id}`),
};

// ── Contact Messages ──────────────────────────────
export const contactService = {
    sendMessage: (data) => api.post('/contact', data),
    getAll: () => api.get('/contact'),
    delete: (id) => api.delete(`/contact/${id}`),
};

export default api;
