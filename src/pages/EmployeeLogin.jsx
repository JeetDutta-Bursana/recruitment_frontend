// src/pages/EmployeeLogin.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeAuthServices from '../api/EmployeeAuthServices';

const EmployeeLogin = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await EmployeeAuthServices.loginEmployee(email, password);
      const res = await EmployeeAuthServices.fetchCurrentEmployee();
      setUser(res.data);
      navigate('/employee/home');
    } catch (err) {
      alert(err.response?.data || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-4 py-12">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden w-full max-w-md">
        <div className="bg-blue-700 text-white py-6 px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-1">Welcome, Employer!</h2>
          <p className="text-sm text-blue-100">Secure access to your hiring tools</p>
        </div>

        <div className="p-8">
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">
            Login to <span className="text-blue-700">Recruitment_E2E</span>
          </h3>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-lg"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow"
            >
              Login
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{' '}
            <Link to="/employee/employee-register" className="text-blue-700 font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
