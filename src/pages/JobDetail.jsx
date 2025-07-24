import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    axios.get(`/api/jobs/view/${jobId}`)
      .then((res) => setJob(res.data))
      .catch(() => alert('Job not found or server error'));
  }, [jobId]);

  const handleApplyClick = () => {
    window.location.href = 'https://1c.atract.in/login';
  };

  if (!job) return <p className="text-center mt-10 text-gray-600">Loading job...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl mt-12 border border-gray-200">
      <h2 className="text-3xl font-bold text-blue-800 mb-4">{job.title}</h2>
      
      <div className="mb-6 space-y-1">
        <p><span className="font-semibold">💼 Company:</span> {job.company}</p>
        <p><span className="font-semibold">📍 Location:</span> {job.location}</p>
        <p><span className="font-semibold">💰 Salary:</span> ₹{job.minSalary} – ₹{job.maxSalary}</p>
        <p><span className="font-semibold">🧑‍💻 Experience Required:</span> {job.experience}</p>
        <p><span className="font-semibold">📅 Apply Between:</span> {job.openingDate} → {job.lastDate}</p>
        <p><span className="font-semibold">👥 Openings:</span> {job.openings}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">{job.jobType}</span>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{job.employmentType}</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-700">📝 Description</h3>
        <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
      </div>

      {job.requirements && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">✅ Requirements</h3>
          <p className="whitespace-pre-wrap text-gray-700">{job.requirements}</p>
        </div>
      )}

      {job.perks && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">🎁 Perks</h3>
          <p className="whitespace-pre-wrap text-gray-700">{job.perks}</p>
        </div>
      )}

      

      {/* Apply Now Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleApplyClick}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg px-8 py-3 rounded-full shadow-md transition-transform hover:scale-105"
        >
          🚀 Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetail;
