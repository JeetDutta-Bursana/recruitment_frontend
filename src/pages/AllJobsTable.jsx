import { useEffect, useRef, useState } from 'react';
import JobServices from '../api/JobServices';
import {
  Trash2,
  Edit3,
  Share2,
  Save,
  X,
  Eye,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const AllJobsTable = () => {
  const [jobs, setJobs] = useState([]);
  const [editJobId, setEditJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const [viewJob, setViewJob] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const rowRefs = useRef({});
  const viewRef = useRef();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await JobServices.getAllJobs();
      setJobs(res.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch jobs', err);
    }
  };

  const handleEdit = (job) => {
    setEditJobId(job.jobId);
    setEditedJob({ ...job });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await JobServices.updateJob(editJobId, editedJob);
      setJobs((prev) =>
        prev.map((j) => (j.jobId === editJobId ? { ...j, ...editedJob } : j))
      );
      setEditJobId(null);
      setEditedJob({});
    } catch (err) {
      alert('❌ Failed to update job.');
    }
  };

  const handleCancel = () => {
    setEditJobId(null);
    setEditedJob({});
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await JobServices.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.jobId !== jobId));
    } catch (err) {
      alert('Failed to delete job.');
    }
  };

  const handleShare = (jobId) => {
    const url = `${window.location.origin}/jobs/${jobId}`;
    navigator.clipboard.writeText(url);
    alert('📋 Job link copied to clipboard!');
  };

  const handleView = (job) => {
    setViewJob(job);
    setTimeout(() => viewRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
  };

  const closeView = () => {
    setViewJob(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(filterText.toLowerCase()) ||
      job.company.toLowerCase().includes(filterText.toLowerCase()) ||
      job.location.toLowerCase().includes(filterText.toLowerCase())
  );

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = jobs.map((job, idx) => [
      idx + 1,
      job.title,
      job.company,
      job.location,
      `${job.minSalary} - ${job.maxSalary}`,
      job.openings,
      job.lastDate,
    ]);

    autoTable(doc, {
      head: [['#', 'Title', 'Company', 'Location', 'Salary', 'Openings', 'Last Date']],
      body: tableData,
    });

    doc.save('jobs-list.pdf');
  };

  return (
    // ... UI JSX stays unchanged, only axios logic is replaced with JobServices
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-700">📋 All Posted Jobs</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="🔍 Filter by title or company or location"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border px-3 py-1 rounded text-sm"
          />
          <button
            onClick={exportToPDF}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
          >
            📄 Export to PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Job Title</th>
              <th className="px-4 py-2 text-left">Company</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Salary</th>
              <th className="px-4 py-2 text-left">Openings</th>
              <th className="px-4 py-2 text-left">Last Date</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <tr
                  key={job.jobId}
                  ref={(el) => (rowRefs.current[job.jobId] = el)}
                  className="border-b"
                >
                  <td className="px-4 py-2">
                    {editJobId === job.jobId ? (
                      <input
                        name="title"
                        value={editedJob.title || ''}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      job.title
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editJobId === job.jobId ? (
                      <input
                        name="company"
                        value={editedJob.company || ''}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      job.company
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editJobId === job.jobId ? (
                      <input
                        name="location"
                        value={editedJob.location || ''}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      job.location
                    )}
                  </td>
                  <td className="px-4 py-2 text-green-600 font-semibold">
                    {editJobId === job.jobId ? (
                      <>
                        <input
                          name="minSalary"
                          value={editedJob.minSalary || ''}
                          onChange={handleChange}
                          className="w-1/2 border px-2 py-1 rounded"
                        />
                        -
                        <input
                          name="maxSalary"
                          value={editedJob.maxSalary || ''}
                          onChange={handleChange}
                          className="w-1/2 border px-2 py-1 rounded"
                        />
                      </>
                    ) : (
                      `${job.minSalary} - ${job.maxSalary}`
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editJobId === job.jobId ? (
                      <input
                        name="openings"
                        value={editedJob.openings || ''}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      job.openings
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editJobId === job.jobId ? (
                      <input
                        name="lastDate"
                        type="date"
                        value={editedJob.lastDate || ''}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      job.lastDate
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2 flex-wrap">
                    {editJobId === job.jobId ? (
                      <>
                        <button onClick={handleSave} className="text-green-600 hover:text-green-800"><Save size={18} /></button>
                        <button onClick={handleCancel} className="text-gray-600 hover:text-gray-800"><X size={18} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(job)} className="text-yellow-500 hover:text-yellow-700"><Edit3 size={18} /></button>
                        <button onClick={() => deleteJob(job.jobId)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                        <button onClick={() => handleShare(job.jobId)} className="text-blue-500 hover:text-blue-700"><Share2 size={18} /></button>
                        <button onClick={() => handleView(job)} className="text-purple-500 hover:text-purple-700"><Eye size={18} /></button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500 italic">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => paginate(idx + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* View Job Section */}
      {viewJob && (
        <div ref={viewRef} className="mt-10 bg-white shadow-lg rounded-xl p-6 relative">
          <button onClick={closeView} className="absolute top-4 right-4 text-gray-500 hover:text-red-600">
            <X size={24} />
          </button>

          <h3 className="text-2xl font-semibold text-blue-700 mb-4">🔍 Job Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
            <p><strong>Title:</strong> {viewJob.title}</p>
            <p><strong>Company:</strong> {viewJob.company}</p>
            <p><strong>Location:</strong> {viewJob.location}</p>
            <p><strong>Salary:</strong> {viewJob.minSalary} - {viewJob.maxSalary}</p>
            <p><strong>Experience:</strong> {viewJob.experience}</p>
            <p><strong>Job Type:</strong> {viewJob.jobType}</p>
            <p><strong>Department:</strong> {viewJob.department}</p>
            <p><strong>Employment Type:</strong> {viewJob.employmentType}</p>
            <p><strong>Openings:</strong> {viewJob.openings}</p>
            <p><strong>Mode:</strong> {viewJob.mode}</p>
            <p><strong>Opening Date:</strong> {viewJob.openingDate}</p>
            <p><strong>Closing Date:</strong> {viewJob.lastDate}</p>
            <p><strong>Email:</strong> {viewJob.contactEmail}</p>
            <p className="sm:col-span-2"><strong>Description:</strong> {viewJob.description}</p>
            <p className="sm:col-span-2"><strong>Requirements:</strong> {viewJob.requirements}</p>
            <p className="sm:col-span-2"><strong>Perks:</strong> {viewJob.perks}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllJobsTable;
