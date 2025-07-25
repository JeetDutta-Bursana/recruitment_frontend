import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePanel from '../components/ProfilePanel';
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import AuthServices from '../api/AuthServices';

const Navbar = ({ user, setUser, employee, setEmployee }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="text-2xl font-bold">
            Recruitment<span className="text-green-300">_E2E</span>
          </div>

          {/* Center: Main nav links (dashboard, job list, etc.) */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium mx-auto">
            {user && (
              <>
                <Link to="/home" className="hover:text-green-200">Dashboard</Link>
                <button onClick={() => setShowProfile(true)} className="hover:text-green-200">Profile</button>
                <Link to="/job-list" className="hover:text-green-200">Job List</Link>
                <Link to="/my-applications" className="hover:text-green-200">My Applications</Link>
              </>
            )}
            {employee && (
              <>
                <Link to="/employee/home" className="hover:text-green-200">Home</Link>
                <Link to="/employee/add-job" className="hover:text-green-200">Add Job</Link>
                <Link to="/employee/jd-generator" className="hover:text-green-200">JD Generator</Link>
                <Link to="/employee/dashboard" className="hover:text-green-200">Analytics</Link>
              </>
            )}
          </nav>

          {/* Right: Employer/Job Seeker + Name + Logout */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            {!currentUser && (
              <>
                <Dropdown title="Employer" color="text-blue-800" links={[
                  { to: "/employee/employee-login", label: "Login" },
                  { to: "/employee/employee-register", label: "Signup" }
                ]} />
                <Dropdown title="Job Seeker" color="text-green-800" links={[
                  { to: "/login", label: "Login" },
                  { to: "/register", label: "Signup" }
                ]} />
              </>
            )}
            {currentUser && (
              <>
                <span className="font-semibold">Hi, {currentUser?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-700 font-semibold px-4 py-1.5 rounded-md hover:bg-blue-100 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-blue-800 px-4 pb-4 space-y-3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              {!currentUser && (
                <>
                  <MobileLink to="/employee/employee-login">Employer Login</MobileLink>
                  <MobileLink to="/employee/employee-register">Employer Signup</MobileLink>
                  <MobileLink to="/login">Job Seeker Login</MobileLink>
                  <MobileLink to="/register">Job Seeker Signup</MobileLink>
                </>
              )}
              {user && (
                <>
                  <MobileLink to="/home">Dashboard</MobileLink>
                  <MobileLink to="/job-list">Job List</MobileLink>
                  <MobileLink to="/my-applications">My Applications</MobileLink>
                  <button onClick={() => setShowProfile(true)} className="text-white w-full text-left">Profile</button>
                  <button onClick={handleLogout} className="text-white w-full text-left">Logout</button>
                </>
              )}
              {employee && (
                <>
                  <MobileLink to="/employee/home">Home</MobileLink>
                  <MobileLink to="/employee/add-job">Add Job</MobileLink>
                  <MobileLink to="/employee/jd-generator">JD Generator</MobileLink>
                  <MobileLink to="/employee/dashboard">Analytics</MobileLink>
                  <button onClick={handleLogout} className="text-white w-full text-left">Logout</button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Profile Modal */}
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

// Dropdown Component
const Dropdown = ({ title, color, links }) => (
  <div className="relative group">
    <button className="flex items-center gap-1 hover:text-green-200 transition">
      {title} <ChevronDown size={16} />
    </button>
    <div className={`absolute left-0 mt-2 w-40 bg-white ${color} rounded-md shadow-md opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition duration-200 z-20`}>
      {links.map(({ to, label }) => (
        <Link key={to} to={to} className="block px-4 py-2 hover:bg-gray-100">
          {label}
        </Link>
      ))}
    </div>
  </div>
);

// Mobile Link
const MobileLink = ({ to, children }) => (
  <Link to={to} className="block text-white text-sm py-1 border-b border-blue-600">
    {children}
  </Link>
);

export default Navbar;
