//Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import ProfilePanel from '../components/ProfilePanel'; // ✅ import
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import AuthServices from '../api/AuthServices'


const Navbar = ({ user, setUser, employee, setEmployee }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    try {
      if (user) {
  await AuthServices.logoutUser();
  setUser(null);
  navigate('/login');
} else if (employee) {
  await EmployeeAuthServices.logoutEmployee();
  setEmployee(null);
  navigate('/employee/employee-login');
}
    } catch (err) {
      alert('Logout failed');
    }
  };

  const currentUser = user || employee;

  return (
    <>
      <header className="bg-blue-700 text-white px-6 py-3 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-xl font-bold">Recruitment_E2E</p>

          <nav className="space-x-6 text-sm ml-auto flex items-center">
            {!currentUser && (
              <>
                <div className="inline-block relative group">
                  <button className="hover:underline focus:outline-none">Employer</button>
                  <div className="absolute left-0 mt-2 w-40 bg-white text-blue-700 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition z-10">
                    <Link to="/employee/employee-login" className="block px-4 py-2 hover:bg-blue-50">Login</Link>
                    <Link to="/employee/employee-register" className="block px-4 py-2 hover:bg-blue-50">Signup</Link>
                  </div>
                </div>
                <div className="inline-block relative group">
                  <button className="hover:underline focus:outline-none">Job Seeker</button>
                  <div className="absolute left-0 mt-2 w-40 bg-white text-green-700 rounded shadow-lg opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition z-10">
                    <Link to="/login" className="block px-4 py-2 hover:bg-green-50">Login</Link>
                    <Link to="/register" className="block px-4 py-2 hover:bg-green-50">Signup</Link>
                  </div>
                </div>
              </>
            )}
            {user && (
              <>
                <Link to="/home" className="hover:underline">Dashboard</Link>
                <button onClick={() => setShowProfile(true)} className="hover:underline">Profile</button>
                <Link to="/job-list" className="hover:underline">Job List</Link>
                <Link to="/my-applications" className="hover:underline">My Applications</Link>
              </>
            )}
            {employee && (
              <>
                <Link to="/employee/home" className="hover:underline">Dashboard</Link>
                <Link to="/employee/add-job" className="hover:underline">Add Job</Link>
                <Link to="/employee/jd-generator" className="hover:underline">JD Generator</Link>
                <Link to="/employee/dashboard" className="hover:underline">Analytics</Link>
              </>
            )}
          </nav>

          <div className="space-x-4 text-sm">
            {currentUser ? (
              <>
                <span className="font-medium">Hi, {currentUser?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-blue-100"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      {showProfile && (
        <ProfilePanel
          user={currentUser}
          onClose={() => setShowProfile(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

export default Navbar;
