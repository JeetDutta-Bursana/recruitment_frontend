import { Bookmark } from 'lucide-react';

const JobCard = ({
  job,
  isSelected,
  onApply,
  onBookmark,
  isBookmarked,
  isApplied,
}) => {
  return (
    <div
      className={`cursor-pointer bg-white rounded-2xl shadow-md border p-4 mb-4 transition duration-300 ${
        isSelected ? 'border-blue-600 ring-2 ring-blue-300' : 'hover:shadow-xl'
      }`}
    >
      <div className="flex justify-between items-start">
        <span className="text-xs bg-red-100 text-red-700 font-semibold px-3 py-1 rounded-full">
          🔥 Urgent Hiring
        </span>
        <Bookmark
          className={`cursor-pointer ${
            isBookmarked ? 'text-blue-700' : 'text-blue-500 hover:text-blue-700'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
        />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mt-2">{job.title}</h2>
      <p className="text-gray-600 mt-1">
        🏢 <span className="font-medium">{job.company}</span> &nbsp;&nbsp;📍{' '}
        {job.location}
      </p>
      <p className="text-sm text-green-700 font-medium mt-1">
        💰 Salary: {job.minSalary} - {job.maxSalary}
      </p>
      <div className="flex gap-2 mt-2">
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
          {job.mode}
        </span>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700">
          {job.jobType}
        </span>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isApplied) onApply(); // 🟦 Triggers BotModal from JobList
          }}
          disabled={isApplied}
          className={`px-4 py-2 rounded-full text-sm transition ${
            isApplied
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isApplied ? '✔️ Applied' : '✅ Easily Apply'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
