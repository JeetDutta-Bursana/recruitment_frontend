// src/components/ProfilePanel.jsx
import { X, LogOut, FileText } from "lucide-react";

const ProfilePanel = ({ user, onClose, onLogout }) => {
  if (!user) return null;

  const handleViewResume = () => {
    if (!user.resume || !user.resume.trim()) {
      alert("No resume available");
      return;
    }

    const base64Data = user.resume.includes(",")
      ? user.resume.split(",")[1]
      : user.resume;

    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto animate-slideInRight relative rounded-l-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
        >
          <X size={24} />
        </button>

        {/* Profile Picture */}
        <div className="flex flex-col items-center mt-8">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-indigo-600 shadow-lg object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-indigo-200 flex items-center justify-center text-4xl text-white font-bold shadow-lg">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Name and Email */}
          <h2 className="mt-4 text-2xl font-semibold text-indigo-700">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>

          {/* Details */}
          <div className="mt-6 w-full text-sm text-gray-700 space-y-2 border-t border-gray-200 pt-4">
            <p>
              <span className="font-medium text-gray-900">User ID:</span>{" "}
              {user.userId || user.id}
            </p>
            <p>
              <span className="font-medium text-gray-900">Mobile:</span>{" "}
              {user.mobile || "N/A"}
            </p>
          </div>

          {/* View Resume */}
          {user.resume?.trim() && (
            <button
              onClick={handleViewResume}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-full shadow hover:from-indigo-600 hover:to-purple-700 transition font-semibold"
            >
              <FileText size={18} />
              View Resume
            </button>
          )}

          {/* Logout */}
          <button
            onClick={onLogout}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-full shadow hover:bg-red-700 transition font-semibold"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
