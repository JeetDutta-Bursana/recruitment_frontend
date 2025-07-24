// src/App.jsx

import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Employee from './pages/Employee';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import Profile from './pages/Profile';
import JDGenerator from './pages/JDGenerator';
import AddJob from './pages/AddJob';
import PaymentPage from './pages/PaymentPage'; // ✅ Import your payment page
import Landing from './pages/Landing';

import axios from './api/axiosInstance';

const App = () => {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);

  // Fetch logged-in user (candidate)
  useEffect(() => {
    axios
      .get('/auth/user/current-user', { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // Fetch logged-in employee (employer)
  useEffect(() => {
    axios
      .get('/auth/employee/current-employee', { withCredentials: true })
      .then((res) => setEmployee(res.data))
      .catch(() => setEmployee(null));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="w-full bg-yellow-300 text-black text-center font-bold py-1 tracking-wider text-base z-50">
        Beta Version
      </div>
      <Navbar
        user={user}
        setUser={setUser}
        employee={employee}
        setEmployee={setEmployee}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        <Routes>
          {/* Employer Dashboard */}
          <Route
            path="/employee/*"
            element={
              <Employee
                employee={employee}
                setEmployee={setEmployee}
              />
            }
          />

          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route
            path="/profile"
            element={
              <Profile
                user={user}
                setUser={setUser}
              />
            }
          />

          {/* JD Generator and Add Job */}
          <Route path="/jd-generator" element={<JDGenerator />} />
          <Route path="/add-job" element={<AddJob />} />

          {/* ✅ Payment Page Route */}
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
