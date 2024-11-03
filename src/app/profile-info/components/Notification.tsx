import React from "react";

interface Notifications {
  message: string;
  type: 'success' | 'error'; // Define type to distinguish between success and error
}

const Notification: React.FC<Notifications> = ({ message, type }) => {
  // Conditional styling based on type
  const bgColor = type === 'success' ? 'bg-green-300' : 'bg-red-300';
  const textColor = type === 'success' ? 'text-green-900' : 'text-red-900';

  return (
    <div className={`z-50 fixed top-[70px] left-[calc(50%+80px)] transform -translate-x-1/2 ${bgColor} ${textColor} p-2 rounded-lg shadow-lg w-96 text-center`}>
      <p className="mt-1">{message}</p>
    </div>
  );
};

export default Notification;
