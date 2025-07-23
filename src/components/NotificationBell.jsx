// src/components/NotificationBell.jsx
import { Bell } from 'lucide-react';
import { useState } from 'react';

const NotificationBell = ({ notifications = [] }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="relative">
        <Bell size={24} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {show && (
        <div className="absolute right-0 mt-2 bg-white border rounded shadow-lg w-64 z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-gray-500">No notifications</p>
          ) : (
            <ul>
              {notifications.map((note, idx) => (
                <li key={idx} className="p-3 border-b hover:bg-gray-100">
                  {note}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
