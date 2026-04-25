import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// UPDATED: Now perfectly matches your AuthContext and Django's JWT rules
api.interceptors.request.use((config) => {
    // UPDATED: Now it checks both Local (Remember Me) and Session (Normal Login)
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
});

export default api;