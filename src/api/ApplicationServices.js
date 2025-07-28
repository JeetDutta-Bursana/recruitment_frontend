import axios from './axiosInstance';

const BASE_URL = '/api/applications';

const ApplicationService = {
  /**
   * Submit a new job application
   * @param {Object} applicationData - The application payload
   */
  applyToJob: (applicationData) =>
    axios.post(`${BASE_URL}/apply`, applicationData),

  /**
   * Fetch all applications for a given user
   * @param {string} userId
   */
  getUserApplications: (userId) =>
    axios.get(`${BASE_URL}/user/${userId}`),

  /**
   * Check if a user has already applied to a specific job
   * @param {string} userId
   * @param {string} jobId
   */
  hasUserApplied: (userId, jobId) =>
    axios.get(`${BASE_URL}/check?userId=${userId}&jobId=${jobId}`),

  /**
   * Mark application as paid after payment success
   * @param {string} applicationId
   */
  markAsPaid: (applicationId) =>
    axios.post(`${BASE_URL}/mark-paid/${applicationId}`),

  /**
   * Cancel an application
   * @param {string} applicationId
   */
  cancelApplication: (applicationId) =>
    axios.delete(`${BASE_URL}/${applicationId}`),
};

export default ApplicationService;
