// src/pages/Home.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthServices from '../api/AuthServices';

import ProfilePanel from '../components/ProfilePanel';
import MyApplications from './MyApplications';
import JobList from './JobList';

const Home = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await AuthServices.fetchCurrentUser();
        setUser(res.data);
        setActiveSection('jobcards');
      } catch (error) {
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleOpenSection = (section) => {
    setActiveSection(section);
    if (section !== 'profile') {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleCloseSection = () => {
    setActiveSection(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await AuthServices.logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <section className="min-h-[80vh] px-4 pb-10">
      <div className="flex flex-col justify-center items-center text-center py-12">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-lg p-10 max-w-3xl w-full">
          <h1 className="text-4xl font-extrabold mb-4">Welcome, {user.name} 👋</h1>
          <p className="text-lg text-blue-100 mb-6">
            You’ve successfully logged in to <span className="font-semibold">Recruitment_E2E</span>.
            Track your applications and manage your profile below.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => handleOpenSection('profile')}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition"
            >
              👤 My Profile
            </button>
            <button
              onClick={() => handleOpenSection('applications')}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition"
            >
              📄 My Applications
            </button>
            <button
              onClick={() => handleOpenSection('jobcards')}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition"
            >
              🗂️ Job Cards
            </button>
          </div>
        </div>
      </div>

      {activeSection === 'profile' && (
        <ProfilePanel user={user} onClose={handleCloseSection} onLogout={handleLogout} />
      )}

      {(activeSection === 'applications' || activeSection === 'jobcards') && (
        <div
          ref={scrollRef}
          className="relative max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-6"
        >
          <button
            onClick={handleCloseSection}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
            title="Close"
          >
            ✕
          </button>

          {activeSection === 'applications' && <MyApplications user={user} />}
          {activeSection === 'jobcards' && <JobList user={user} />}
        </div>
      )}
    </section>
  );
};

export default Home;
