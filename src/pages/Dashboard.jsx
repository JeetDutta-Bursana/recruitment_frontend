// Dashboard.jsx
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import axios from '../api/axiosInstance';

const Dashboard = forwardRef((props, ref) => {
  const [stats, setStats] = useState({
    jobsPosted: 0,
    applications: 0,
    hired: 0,
    interviews: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
    }
  };

  useImperativeHandle(ref, () => ({
    refetchStats: fetchStats,
  }));

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-10">
      <h2 className="text-3xl font-bold text-center text-blue-600">📊 Employer Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Jobs Posted" value={stats.jobsPosted} color="blue" />
        <StatCard title="Applications" value={stats.applications} color="indigo" />
        <StatCard title="Hired" value={stats.hired} color="green" />
        <StatCard title="Interviews" value={stats.interviews} color="yellow" />
      </div>
    </div>
  );
});

const StatCard = ({ title, value, color }) => (
  <div className={`bg-white shadow-lg rounded-lg p-6 text-center border-t-4 border-${color}-500`}>
    <h3 className={`text-3xl font-bold text-${color}-600`}>{value}</h3>
    <p className="text-gray-600 mt-2">{title}</p>
  </div>
);

export default Dashboard;
