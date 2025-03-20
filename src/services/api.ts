// services/api.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Define API base URL directly instead of using process.env
const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication if needed
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      // Server responded with an error status
      console.error('API Error:', error.response.data);
      
      // You could implement global toast notifications here
      // toast.error(error.response.data.message || 'An error occurred');
      
      // Handle authentication errors
      if (error.response.status === 401) {
        // Redirect to login or clear auth state
        // history.push('/login');
        // localStorage.removeItem('token');
      }
    } else if (error.request) {
      // Request was made but no response was received
      console.error('Network Error:', error.request);
      // toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened while setting up the request
      console.error('Request Error:', error.message);
      // toast.error('An error occurred while sending the request.');
    }
    
    return Promise.reject(error);
  }
);

export default api;