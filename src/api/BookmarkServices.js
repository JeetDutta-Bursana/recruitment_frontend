import axios from './axiosInstance';
const BookmarkService = {
  getUserBookmarks: (userId) => axios.get(`/bookmark/user/${userId}`),
  removeBookmark: (userId, jobId) =>
    axios.delete(`/bookmark/remove/${userId}/${jobId}`),
  addBookmark: (userId, jobId) =>
  axios.post(`/bookmark/add`, { userId, jobId }),

};

export default BookmarkService;