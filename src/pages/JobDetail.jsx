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

  if (!job) return <p className="text-center mt-10 text-gray-600">Loading job...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">{job.title}</h2>
      <p className="mb-2"><strong>Company:</strong> {job.company}</p>
      <p className="mb-2"><strong>Location:</strong> {job.location}</p>
      <p className="mb-2"><strong>Salary:</strong> {job.minSalary} - {job.maxSalary}</p>
      <p className="mb-2"><strong>Type:</strong> {job.jobType} ({job.employmentType})</p>
      <p className="mb-2"><strong>Experience:</strong> {job.experience}</p>
      <p className="mb-2"><strong>Openings:</strong> {job.openings}</p>
      <p className="mb-2"><strong>Apply Between:</strong> {job.openingDate} → {job.lastDate}</p>
      <div className="mt-4 whitespace-pre-wrap">
        <p><strong>Description:</strong></p>
        <p>{job.description}</p>
      </div>
      <div className="mt-4 whitespace-pre-wrap">
        <p><strong>Requirements:</strong></p>
        <p>{job.requirements}</p>
      </div>
      <div className="mt-4 whitespace-pre-wrap">
        <p><strong>Perks:</strong></p>
        <p>{job.perks}</p>
      </div>
      <p className="mt-4 text-blue-700 font-semibold">📩 Contact: {job.contactEmail}</p>
    </div>
  );
};

export default JobDetail;
