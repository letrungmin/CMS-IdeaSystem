import axios from 'axios';

// 1. Create an axios instance with default configurations
const axiosClient = axios.create({
  // baseURL points to the Spring Boot Backend (default port 8080)
  baseURL: 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. REQUEST INTERCEPTOR: Automatically attach the JWT Token before sending API requests
axiosClient.interceptors.request.use(
  (config) => {
    // Only access localStorage on the client-side (browser environment)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR: Handle responses or global errors from the Backend
axiosClient.interceptors.response.use(
  (response) => {
    // Return data directly, bypassing Axios's verbose headers/config wrapper
    return response.data;
  },
  (error) => {
    // If Backend returns 401 (Unauthorized - Token expired or missing)
    if (error.response?.status === 401) {
      console.error("Token expired or invalid!");
      
      // Automatically redirect to the login page (if on client-side)
      if (typeof window !== 'undefined') {
        // Temporarily commented out. Uncomment after the Login page is created.
        // window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;