import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  // Remove /api prefix since it's already being added by the backend
  if (!config.url?.startsWith('http')) {
    config.url = `/${config.url?.startsWith('/') ? config.url.slice(1) : config.url}`;
  }
  return config;
});

export default instance;
