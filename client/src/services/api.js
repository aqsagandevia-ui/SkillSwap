import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleLogin: (token) => api.post('/auth/google-login', { token }),
  getMe: () => api.get('/auth/me')
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/update', data),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`)
};

// Session APIs
export const sessionAPI = {
  getSessions: () => api.get('/session'),
  createSession: (data) => api.post('/session', data),
  acceptSession: (sessionId) => api.put('/session/accept', { sessionId }),
  rejectSession: (sessionId) => api.put('/session/reject', { sessionId }),
  completeSession: (data) => api.put('/session/complete', data)
};

// Message APIs
export const messageAPI = {
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (data) => api.post('/messages', data)
};

// Match APIs
export const matchAPI = {
  getMatches: () => api.get('/match'),
  createMatch: (data) => api.post('/match', data)
};

export default api;
