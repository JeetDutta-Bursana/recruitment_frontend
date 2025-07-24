// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // ✅ use http unless you have SSL
  withCredentials: true,
});

export default axiosInstance;