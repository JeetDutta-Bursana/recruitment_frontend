// src/pages/Employee.jsx
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeLogin from './EmployeeLogin';
import EmployeeRegister from './EmployeeRegister';
import EmpHome from './EmpHome';
import AddJob from './AddJob';
import JDGenerator from './JDGenerator';
import Dashboard from './Dashboard';
import EmployeeAuthServices from '../api/EmployeeAuthServices';

const Employee = ({ employee, setEmployee }) => {
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await EmployeeAuthServices.fetchCurrentEmployee();
        setEmployee(res.data);
      } catch {
        setEmployee(null);
      }
    };

    fetchEmployee();
  }, [setEmployee]);

  return (
    <Routes>
      <Route path="employee-login" element={<EmployeeLogin setUser={setEmployee} />} />
      <Route path="employee-register" element={<EmployeeRegister />} />
      
      <Route
        path="home"
        element={employee ? <EmpHome /> : <Navigate to="/employee/home" />}
      />
      <Route
        path="add-job"
        element={employee ? <AddJob /> : <Navigate to="/employee/add-job" />}
      />
      <Route
        path="jd-generator"
        element={employee ? <JDGenerator /> : <Navigate to="/employee/gd-generator" />}
      />
      <Route
        path="dashboard"
        element={employee ? <Dashboard /> : <Navigate to="/employee/dashboard" />}
      />
    </Routes>
  );
};

export default Employee;
