"use client";

import React, { useState } from "react";
import { TfiClose } from "react-icons/tfi";

interface AddMemberPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onInvite: (email: string) => void;
}

const AddMemberPopup: React.FC<AddMemberPopupProps> = ({ isVisible, onClose, onInvite }) => {
  const [email, setEmail] = useState("");

  const handleInvite = () => {
    if (email) {
      onInvite(email);
      setEmail(""); 
    }
  };

  const handleClose = () => {
    setEmail(""); 
    onClose(); 
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-2xl w-4/12 h-64">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img src="/people.svg" alt="Add People" className="w-8 h-8 mr-2" />
            <h1 className="text-2xl">Add People</h1>
          </div>
          <button onClick={handleClose} aria-label="Close"> 
            <TfiClose className="w-4 h-4 text-gray-800" />
          </button>
        </div>

        <div>
          <h3 className="font-semibold mt-5 ml-2">Invite by Email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            maxLength={60} 
            className="border p-2 rounded-lg w-4/5 mt-2 h-11"
          />
        </div>

        <div className="border-b ml-2 w-full border-gray-300 mt-8"></div>

        {/* Invite button */}
        <div className="mt-4">
          <button 
            onClick={handleInvite} 
            className="w-32 h-11 bg-indigo-400 text-white text-lg rounded-lg ml-80"
          >
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberPopup;
