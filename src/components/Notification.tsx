import React from "react";

interface Notifications {
  message: string;
}

const Notification: React.FC<Notifications> = ({ message }) => {
  return (
    <div className="fixed top-10 bg-green-300 text-green-900 p-2 rounded-lg shadow-lg w-96 text-center font-bold">
      <p className="mt-2">{message}</p>
    </div>
  );
};


export default Notification;
