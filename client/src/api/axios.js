import axios from 'axios';

const api = axios.create({ 
  baseURL: 'https://ml-cinerate-production.up.railway.app/api'
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(err);
  }
);

export default api;