// components/Favourites.js
import { useEffect } from 'react';
import { X } from 'lucide-react';
import JobCard from './JobCard';

const Favourites = ({ jobs, onClose, onRemoveBookmark, bookmarked }) => {
  // Escape key handler
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-3xl bg-white h-full overflow-y-auto shadow-lg p-6 relative animate-slideInUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
          aria-label="Close Favourites"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">⭐ Bookmarked Jobs</h2>

        {jobs.length === 0 ? (
          <p className="text-gray-500">No bookmarked jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.jobId}>
                <JobCard
                  job={job}
                  onBookmark={() => onRemoveBookmark(job.jobId)}
                  isBookmarked={bookmarked.includes(job.jobId)}
                  // Optionally disable Apply in favourites
                  onApply={null}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favourites;
