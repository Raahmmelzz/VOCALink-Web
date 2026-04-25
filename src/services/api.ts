import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// UPDATED: Now perfectly matches your AuthContext and Django's JWT rules
api.interceptors.request.use((config) => {
    // 1. Look for 'access_token' instead of 'token'
    const token = localStorage.getItem('access_token'); 
    
    if (token && config.headers) {
        // 2. Use 'Bearer' instead of 'Token'
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
});

export default api;