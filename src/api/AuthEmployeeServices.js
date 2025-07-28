// src/api/EmployeeAuthServices.js
import axios from './axiosInstance';

const AuthEmployeeServices = {
  // Login
  loginEmployee: (employeeData) =>
    axios.post('/auth/employee/login', employeeData, { withCredentials: true }),

  // Register
  registerEmployee: (employeeData) =>
    axios.post('/auth/employee/register', employeeData, { withCredentials: true }),

  // Get current logged-in employee
  fetchCurrentEmployee: () =>
    axios.get('/auth/employee/current-employee', { withCredentials: true }),

  // Logout
  logoutEmployee: () =>
    axios.post('/auth/employee/logout', {}, { withCredentials: true }),
};

export default AuthEmployeeServices;
