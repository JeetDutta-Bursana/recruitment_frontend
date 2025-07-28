// src/api/JobServices.js
import axios from './axiosInstance';

const JobServices = {
  // ------------------ Jobs ------------------ //
  
  getAllJobs: () => axios.get('/api/jobs/all'),
  getAllJobsPaginated: (page) => axios.get(`/api/jobs/all?page=${page}`),
  getPaginatedJobs: (page = 0) => axios.get(`/api/jobs/all?page=${page}`),
  getJobById: (jobId) => axios.get(`/api/jobs/${jobId}`),
  addJob: (jobData) => axios.post('/api/jobs/add-job', jobData),
  updateJob: (jobId, jobData) => axios.put(`/api/jobs/update/${jobId}`, jobData, { withCredentials: true }),
  deleteJob: (jobId) => axios.delete(`/api/jobs/delete/${jobId}`, { withCredentials: true }),


  // Get all jobs posted by current employee
  getAllPostedJobs: () => axios.get('/api/jobs/posted'),

  // ---------------- Applications ---------------- //
  getAppliedJobsByUser: (userId) => axios.get(`/api/applications/user/${userId}`),

  // ---------------- Bookmarks ---------------- //
  getBookmarkedJobsByUser: (userId) => axios.get(`/api/bookmarks/user/${userId}`),
  bookmarkJob: (userId, jobId) => axios.post(`/api/bookmarks`, { userId, jobId }),
  unbookmarkJob: (userId, jobId) => axios.delete(`/api/bookmarks/${userId}/${jobId}`),
};

export default JobServices;
