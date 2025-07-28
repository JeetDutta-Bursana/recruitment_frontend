import { useEffect, useState, useRef } from "react";
import JobCard from "../components/JobCard";
import BotModal from "./BotModal";
import { useLocation } from "react-router-dom";
import JobServices from "../api/JobServices";
import BookmarkService from "../api/BookmarkServices";
import ApplicationService from "../api/ApplicationServices";

const JobList = ({ user }) => {
  const location = useLocation();
  const userId = user?.userId;

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({ location: "", company: "", jobId: "" });
  const [sortBy, setSortBy] = useState("latest");
  const [bookmarked, setBookmarked] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [showBotModal, setShowBotModal] = useState(false);

  const loader = useRef(null);

  useEffect(() => {
    fetchJobs(0);
    if (userId) {
      fetchBookmarkedJobs();
      fetchAppliedJobs();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) observer.observe(loader.current);
    return () => loader.current && observer.unobserve(loader.current);
  }, [hasMore, userId]);

  useEffect(() => {
    if (page > 0) fetchJobs(page);
  }, [page]);

  useEffect(() => {
    if (location.state?.paymentCompleted && location.state?.appliedJobId) {
      setAppliedJobs((prev) =>
        prev.includes(location.state.appliedJobId) ? prev : [...prev, location.state.appliedJobId]
      );
    }
  }, [location.state]);

  const fetchJobs = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await JobServices.getAllJobsPaginated(pageNumber); // You should implement this in JobServices
      const newJobs = res.data || [];
      const allJobs = [...jobs, ...newJobs];
      const uniqueJobs = Array.from(new Map(allJobs.map((j) => [j.jobId, j])).values());
      setJobs(uniqueJobs);
      setHasMore(newJobs.length > 0);
    } catch (err) {
      console.error("❌ Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarkedJobs = async () => {
    try {
      const res = await BookmarkService.getUserBookmarks(userId);
      setBookmarked(res.data.map((b) => b.jobId));
    } catch (err) {
      console.error("❌ Failed to fetch bookmarks", err);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await ApplicationService.getUserApplications(userId);
      const jobIds = res.data.map((app) => app.jobId);
      setAppliedJobs(jobIds);
    } catch (err) {
      console.error("❌ Failed to fetch applied jobs", err);
    }
  };

  const handleBookmark = async (jobId) => {
    try {
      if (bookmarked.includes(jobId)) {
        await BookmarkService.removeBookmark(userId, jobId);
      } else {
        await BookmarkService.addBookmark(userId, jobId); // You need to add this method if not defined
      }
      fetchBookmarkedJobs();
    } catch (err) {
      console.error("❌ Failed to update bookmark", err);
    }
  };

  const sortJobs = (list) => {
    if (sortBy === "latest") {
      return list.slice().sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
    }
    if (sortBy === "salary") {
      return list.slice().sort((a, b) => parseFloat(b.maxSalary) - parseFloat(a.maxSalary));
    }
    return list;
  };

  const filteredJobs = sortJobs(
    jobs.filter(
      (job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase()) &&
        job.company.toLowerCase().includes(filters.company.toLowerCase()) &&
        job.jobId.toLowerCase().includes(filters.jobId.toLowerCase())
    )
  );

  useEffect(() => {
    if (filteredJobs.length === 0) {
      setSelectedJob(null);
    } else if (!selectedJob || !filteredJobs.some((job) => job.jobId === selectedJob.jobId)) {
      setSelectedJob(filteredJobs[0]);
    }
  }, [filteredJobs, selectedJob]);

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center gap-4 sticky top-0 z-10">
        <input
          type="text"
          placeholder="Filter by Location"
          className="border rounded px-4 py-2 w-full md:w-1/4"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Company"
          className="border rounded px-4 py-2 w-full md:w-1/4"
          value={filters.company}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Job ID"
          className="border rounded px-4 py-2 w-full md:w-1/4"
          value={filters.jobId}
          onChange={(e) => setFilters({ ...filters, jobId: e.target.value })}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/4"
        >
          <option value="latest">📅 Latest First</option>
          <option value="salary">💰 Highest Salary</option>
        </select>
      </div>

      {/* Layout */}
      <div className="flex gap-6">
        {/* Left Panel */}
        <div className="w-1/2 h-[70vh] overflow-y-auto pr-4">
          {filteredJobs.map((job) => (
            <div
              key={job.jobId}
              onClick={() => {
                setSelectedJob(job);
                setShowFullDetails(false);
              }}
              className={`cursor-pointer ${
                selectedJob?.jobId === job.jobId ? "ring-2 ring-blue-500 rounded-md" : ""
              }`}
            >
              <JobCard
                job={job}
                isSelected={selectedJob?.jobId === job.jobId}
                isBookmarked={bookmarked.includes(job.jobId)}
                isApplied={appliedJobs.includes(job.jobId)}
                onApply={() => {
                  setSelectedJob(job);
                  setShowBotModal(true);
                }}
                onBookmark={() => handleBookmark(job.jobId)}
              />
            </div>
          ))}
          {loading && (
            <div className="text-center py-4 text-gray-400 animate-pulse">Loading more jobs...</div>
          )}
          {hasMore && (
            <div ref={loader} className="text-center py-4 text-sm text-gray-500">
              Scroll to load more...
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-1/2 sticky top-[130px] self-start h-[70vh] overflow-y-auto bg-white p-6 shadow-lg rounded-xl">
          {selectedJob ? (
            <>
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                <button
                  onClick={() => setShowFullDetails((prev) => !prev)}
                  className="text-sm text-blue-600 underline"
                >
                  {showFullDetails ? "Show Less" : "View More"}
                </button>
              </div>
              <p className="text-gray-600 mt-2">🏢 {selectedJob.company}</p>
              <p className="text-gray-600">📍 {selectedJob.location}</p>
              <p className="text-green-700 mt-2 font-semibold">
                💰 {selectedJob.minSalary} - {selectedJob.maxSalary}
              </p>
              {!showFullDetails ? (
                <p className="mt-4 text-sm text-gray-700 line-clamp-3">{selectedJob.description}</p>
              ) : (
                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <p><strong>Description:</strong> {selectedJob.description}</p>
                  <p><strong>Requirements:</strong> {selectedJob.requirements}</p>
                  <p><strong>Perks:</strong> {selectedJob.perks}</p>
                  <p><strong>Experience:</strong> {selectedJob.experience}</p>
                  <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
                  <p><strong>Employment Type:</strong> {selectedJob.employmentType}</p>
                  <p><strong>Department:</strong> {selectedJob.department}</p>
                  <p><strong>Mode:</strong> {selectedJob.mode}</p>
                  <p><strong>Openings:</strong> {selectedJob.openings}</p>
                  <p><strong>Opening Date:</strong> {selectedJob.openingDate}</p>
                  <p><strong>Last Date to Apply:</strong> {selectedJob.lastDate}</p>
                  <p><strong>Contact Email:</strong> {selectedJob.contactEmail}</p>
                  <p><strong>Job ID:</strong> {selectedJob.jobId}</p>
                </div>
              )}
              <button
                onClick={() => setShowBotModal(true)}
                disabled={appliedJobs.includes(selectedJob.jobId)}
                className={`mt-6 px-6 py-2 rounded-full transition ${
                  appliedJobs.includes(selectedJob.jobId)
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {appliedJobs.includes(selectedJob.jobId) ? "✔️ Applied" : "✅ Apply"}
              </button>
            </>
          ) : (
            <p className="text-gray-400 italic">No job selected</p>
          )}
        </div>
      </div>

      {/* Bot Modal */}
      {showBotModal && selectedJob && (
        <BotModal
          job={selectedJob}
          user={user}
          onClose={() => setShowBotModal(false)}
          onFinish={(success) => {
            if (success) {
              setAppliedJobs((prev) => [...prev, selectedJob.jobId]);
            }
            setShowBotModal(false);
          }}
        />
      )}
    </div>
  );
};

export default JobList;
