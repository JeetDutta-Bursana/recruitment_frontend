// src/pages/MyApplications.jsx
import { useEffect, useState } from "react";
import JobServices from "../api/JobServices";
import axios from "../api/axiosInstance";

const MyApplications = ({ user }) => {
  const userId = user?.userId || user?.id;

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/applications/user/${userId}`);
        const applications = res.data;

        const jobPromises = applications.map((app) =>
          JobServices.getJobById(app.jobId).then((jobRes) => ({
            ...jobRes.data,
            appliedAt: app.appliedAt || app.createdAt,
          }))
        );

        const jobs = await Promise.all(jobPromises);
        setAppliedJobs(jobs);
      } catch (err) {
        console.error("❌ Failed to fetch applied jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [userId]);

  if (!userId) {
    return (
      <div className="text-center py-10 text-gray-500">
        ❌ You must be logged in to view your applications.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400 animate-pulse">
        Loading your applications...
      </div>
    );
  }

  if (appliedJobs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        You haven’t applied to any jobs yet.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Applications</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Job Title</th>
              <th className="py-3 px-4 text-left">Company</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Applied Date</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {appliedJobs.map((job) => (
              <tr key={job.jobId} className="border-t">
                <td className="py-3 px-4">{job.title}</td>
                <td className="py-3 px-4">{job.company}</td>
                <td className="py-3 px-4">{job.location}</td>
                <td className="py-3 px-4">
                  {job.appliedAt
                    ? new Date(job.appliedAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="py-3 px-4 text-green-600 font-semibold">Applied</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyApplications;
