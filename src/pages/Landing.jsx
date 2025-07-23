import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-green-500 to-indigo-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-2xl w-full flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700">Welcome to Recruitment_E2E</h1>
        <p className="text-lg text-gray-600 mb-10 text-center">Choose your portal to get started</p>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
          {/* Employer Section */}
          <div className="flex-1 bg-blue-50 rounded-2xl p-6 flex flex-col items-center shadow-md">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">For Employers</h2>
            <Link to="/employee/employee-login" className="w-full mb-3 py-2 px-6 rounded-lg bg-blue-600 text-white font-semibold text-lg text-center hover:bg-blue-700 transition">Login</Link>
            <Link to="/employee/employee-register" className="w-full py-2 px-6 rounded-lg bg-white border border-blue-600 text-blue-700 font-semibold text-lg text-center hover:bg-blue-50 transition">Register</Link>
          </div>
          {/* Job Seeker Section */}
          <div className="flex-1 bg-green-50 rounded-2xl p-6 flex flex-col items-center shadow-md">
            <h2 className="text-2xl font-bold text-green-700 mb-4">For Job Seekers</h2>
            <Link to="/login" className="w-full mb-3 py-2 px-6 rounded-lg bg-green-600 text-white font-semibold text-lg text-center hover:bg-green-700 transition">Login</Link>
            <Link to="/register" className="w-full py-2 px-6 rounded-lg bg-white border border-green-600 text-green-700 font-semibold text-lg text-center hover:bg-green-50 transition">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 