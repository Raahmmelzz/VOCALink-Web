import axios from 'axios';

const api = axios.create({
    // 💥 UPDATED: Pointing to your live Render FastAPI backend!
    baseURL: 'https://vocalink-fastapi.onrender.com/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

<<<<<<< Updated upstream
// This automatically attaches the token to every request if the user is logged in
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
=======
// Now perfectly matches your AuthContext and FastAPI's JWT rules
api.interceptors.request.use((config) => {
    // Now it checks both Local (Remember Me) and Session (Normal Login)
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    
>>>>>>> Stashed changes
    if (token && config.headers) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export default api;