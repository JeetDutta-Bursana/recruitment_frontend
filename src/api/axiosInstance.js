// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://recruitment-backend-s4la.onrender.com',
  withCredentials: true, // important for session-based auth
});

export default axiosInstance;