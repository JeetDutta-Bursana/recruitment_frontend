import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import EmployeeAuthServices from '../api/EmployeeAuthServices';
import TCText from '../assets/TC.txt?raw';
import ProcessTermsText from '../assets/Process_Terms_Graded_New.txt?raw';

const EmployeeRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const [expandedPdf, setExpandedPdf] = useState(null); // 'tc', 'process', or null

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await EmployeeAuthServices.registerEmployee({ name, email, empId, password, agreedToTerms: agreed });
    alert(res.data);
    navigate('/employee/employee-login');
  } catch (err) {
    alert(err.response?.data || 'Registration failed');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 px-4 py-12">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden w-full max-w-md">
        <div className="bg-green-700 text-white py-6 px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-1">Employer Registration</h2>
          <p className="text-sm text-green-100">Create your account and start hiring smarter</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                type="text"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                required
                placeholder="Enter your employee ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-10"
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                required
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                I agree to the{' '}
                <button type="button" className="text-blue-600 underline focus:outline-none" onClick={() => setExpandedPdf(expandedPdf === 'tc' ? null : 'tc')}>Terms & Conditions</button>
                {' '}and{' '}
                <button type="button" className="text-blue-600 underline focus:outline-none" onClick={() => setExpandedPdf(expandedPdf === 'process' ? null : 'process')}>Process Terms</button>
              </label>
            </div>

            {expandedPdf === 'tc' && (
              <div className="w-full my-2 border rounded bg-gray-50 p-4 animate-slide-down max-h-[60vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-lg">Terms & Conditions</span>
                  <button onClick={() => setExpandedPdf(null)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                </div>
                <pre className="whitespace-pre-wrap text-base text-gray-900 font-sans text-left leading-relaxed tracking-normal" style={{fontFamily: 'Segoe UI, Arial, sans-serif', background: 'none', padding: 0, margin: 0}}>{TCText}</pre>
              </div>
            )}
            {expandedPdf === 'process' && (
              <div className="w-full my-2 border rounded bg-gray-50 p-4 animate-slide-down max-h-[60vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-lg">Process Terms</span>
                  <button onClick={() => setExpandedPdf(null)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                </div>
                <pre className="whitespace-pre-wrap text-base text-gray-900 font-sans text-left leading-relaxed tracking-normal" style={{fontFamily: 'Segoe UI, Arial, sans-serif', background: 'none', padding: 0, margin: 0}}>{ProcessTermsText}</pre>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition font-medium shadow"
              disabled={!agreed}
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/employee/employee-login" className="text-green-700 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegister;
