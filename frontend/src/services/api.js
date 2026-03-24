import axios from 'axios';

// Use relative URL so Vite proxy handles it and prevents CORS issues locally
const api = axios.create({
    baseURL: '/api',
});

export const uploadDevelopers = async (data) => {
    const response = await api.post('/developers', data);
    return response.data;
};

export const runAnalysis = async () => {
    const response = await api.post('/analyze');
    return response.data;
};

export const getResults = async () => {
    const response = await api.get('/results');
    return response.data;
};

export default api;
