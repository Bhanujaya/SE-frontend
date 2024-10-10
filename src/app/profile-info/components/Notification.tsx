import React from "react";

interface Notifications {
  message: string;
}

const Notification: React.FC<Notifications> = ({ message }) => {
  return (
    <div className="z-50 fixed top-[70px] left-[calc(50%+80px)] transform -translate-x-1/2 bg-green-300 text-green-900 p-2 rounded-lg shadow-lg w-96 text-center">
      <p className="mt-1">{message}</p>
    </div>
  );
};



export default Notification;
