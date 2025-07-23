// src/pages/Profile.jsx
import { X, LogOut, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthServices from '../api/AuthServices';
import BookmarkService from '../api/BookmarkServices';

const Profile = ({ user, setUser, onClose }) => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  useEffect(() => {
    if (showBookmarks && user) {
      BookmarkService.getUserBookmarks(user.userId || user.id)
        .then((res) => setBookmarks(res.data))
        .catch((err) =>
          console.error('❌ Failed to fetch bookmarks', err)
        );
    }
  }, [showBookmarks, user]);

  const handleRemoveBookmark = async (jobId) => {
    try {
      await BookmarkService.removeBookmark(user.userId || user.id, jobId);
      setBookmarks((prev) => prev.filter((id) => id !== jobId));
    } catch (err) {
      console.error('❌ Failed to remove bookmark', err);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthServices.logoutUser();
      setUser(null);
      navigate('/login');
    } catch (err) {
      alert('Logout failed');
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white h-full shadow-lg relative p-6 animate-slideInRight overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mt-6">
          <div className="w-24 h-24 rounded-full border-4 border-blue-600 shadow-md overflow-hidden">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-bold mt-4">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="mt-6 text-sm text-gray-700 space-y-3">
          <p><strong>User ID:</strong> {user.userId || user.id}</p>
        </div>

        <button
          onClick={() => setShowBookmarks((prev) => !prev)}
          className="mt-6 w-full bg-yellow-400 text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-yellow-500"
        >
          <Star size={18} />
          {showBookmarks ? 'Hide Favourites' : 'Show Favourites'}
        </button>

        {showBookmarks && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">📌 Bookmarked Jobs</h3>
            {bookmarks.length === 0 ? (
              <p className="text-sm text-gray-500">No bookmarks found.</p>
            ) : (
              <ul className="space-y-2">
                {bookmarks.map((jobId) => (
                  <li
                    key={jobId}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded shadow"
                  >
                    <span>{jobId}</span>
                    <button
                      onClick={() => handleRemoveBookmark(jobId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-600 text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-red-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
