// src/api/EmployeeAuthServices.js
import axios from './axiosInstance';

const BASE_URL = '/auth/employee';

const EmployeeAuthServices = {
  registerEmployee: async ({ name, email, empId, password, agreedToTerms }) => {
    return axios.post(`${BASE_URL}/register`, { name, email, empId, password, agreedToTerms }, {
      withCredentials: true
    });
  },

  loginEmployee: (email, password) => {
    return axios.post(`${BASE_URL}/login`, { email, password }, { withCredentials: true });
  },

  fetchCurrentEmployee: () => {
    return axios.get(`${BASE_URL}/current-employee`, { withCredentials: true });
  },

  logoutEmployee: () => {
    return axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
  }
};

export default EmployeeAuthServices;
