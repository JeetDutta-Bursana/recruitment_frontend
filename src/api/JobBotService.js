// src/api/JobBotService.js
import axios from './axiosInstance';

const JobBotService = {
   // Generate dynamic Job Description 
    generateJD: (formData) => {
    return axios.post('/ai/jd/generate', formData, { withCredentials: true });
  },
  // Generate dynamic questions for job
  generateQuestions: (jobTitle) =>
    axios.post('/ai/jd/generate-questions', { title: jobTitle }, { withCredentials: true }),

  // Evaluate user's answers to dynamic questions
  evaluateAnswers: (questions, answers) =>
    axios.post('/ai/jd/evaluate', { questions, answers }, { withCredentials: true }),

  // Get user resume for enhancement
  getUserResume: (userId) =>
    axios.get(`/auth/user/${userId}/resume`, { withCredentials: true }),

  // Enhance resume using AI for a specific job
  enhanceResume: ({ resume, jobTitle, company, jobDescription }) =>
    axios.post('/ai/jd/cv/enhance', {
      resume,
      jobTitle,
      company,
      jobDescription,
    }, { withCredentials: true }),

  // Apply to a job after qualification
  applyToJob: ({ userId, jobId, answers, score, qualified }) =>
    axios.post('/api/applications/apply', {
      userId,
      jobId,
      answers,
      score,
      qualified,
    }, { withCredentials: true }),
};

export default JobBotService;
