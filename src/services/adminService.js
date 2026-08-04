import axios from 'axios';
import { API_BASE_URL } from '../config';

const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const adminService = {
    login: async (credentials) => {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        if (response.data.Token) {
            localStorage.setItem('adminToken', response.data.Token);
            localStorage.setItem('adminUser', response.data.Username);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    },

    getStats: async () => {
        const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, { headers: getAuthHeader() });
        return response.data;
    },

    changePassword: async (passwordData) => {
        const response = await axios.post(`${API_BASE_URL}/auth/change-password`, passwordData, { headers: getAuthHeader() });
        return response.data;
    },

    // Profile Management
    getProfile: async () => {
        const response = await axios.get(`${API_BASE_URL}/profile`);
        return response.data;
    },

    updateProfile: async (id, profileData) => {
        const response = await axios.put(`${API_BASE_URL}/profile/${id}`, profileData, { headers: getAuthHeader() });
        return response.data;
    },

    // Projects CRUD
    getProjects: async () => {
        const response = await axios.get(`${API_BASE_URL}/projects`);
        return response.data;
    },

    createProject: async (projectData) => {
        const response = await axios.post(`${API_BASE_URL}/projects`, projectData, { headers: getAuthHeader() });
        return response.data;
    },

    updateProject: async (id, projectData) => {
        const response = await axios.put(`${API_BASE_URL}/projects/${id}`, projectData, { headers: getAuthHeader() });
        return response.data;
    },

    deleteProject: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/projects/${id}`, { headers: getAuthHeader() });
        return response.data;
    },

    // Skills CRUD
    getSkills: async () => {
        const response = await axios.get(`${API_BASE_URL}/skills`);
        return response.data;
    },

    createSkill: async (skillData) => {
        const response = await axios.post(`${API_BASE_URL}/skills`, skillData, { headers: getAuthHeader() });
        return response.data;
    },

    updateSkill: async (id, skillData) => {
        const response = await axios.put(`${API_BASE_URL}/skills/${id}`, skillData, { headers: getAuthHeader() });
        return response.data;
    },

    deleteSkill: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/skills/${id}`, { headers: getAuthHeader() });
        return response.data;
    },

    // Testimonials CRUD
    getTestimonials: async () => {
        const response = await axios.get(`${API_BASE_URL}/testimonials`);
        return response.data;
    },

    createTestimonial: async (testimonialData) => {
        const response = await axios.post(`${API_BASE_URL}/testimonials`, testimonialData, { headers: getAuthHeader() });
        return response.data;
    },

    updateTestimonial: async (id, testimonialData) => {
        const response = await axios.put(`${API_BASE_URL}/testimonials/${id}`, testimonialData, { headers: getAuthHeader() });
        return response.data;
    },

    deleteTestimonial: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/testimonials/${id}`, { headers: getAuthHeader() });
        return response.data;
    },

    // Messages View
    getMessages: async () => {
        const response = await axios.get(`${API_BASE_URL}/contact`, { headers: getAuthHeader() });
        return response.data;
    },

    deleteMessage: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/contact/${id}`, { headers: getAuthHeader() });
        return response.data;
    },

    // Image Upload
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_BASE_URL}/Upload/image`, formData, {
            headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
        });
        return response.data; // { url, fileName }
    },

    uploadDocument: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_BASE_URL}/Upload/document`, formData, {
            headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export default adminService;
