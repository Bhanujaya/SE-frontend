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
  const [role, setRole] = useState("member"); // Default role
  const [errors, setErrors] = useState({ email: '', role: '' });

  const handleInvite = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Handle token
    const tokenData = localStorage.getItem("jwt");
    const parsedTokenData = tokenData ? JSON.parse(tokenData) : null;
    const token = parsedTokenData ? parsedTokenData.token : "";
  
    if (!token) {
      console.error("Token not found");
      return;
    }
  
    if (!email) {
      setErrors({ ...errors, email: 'Email required!' });
      return; // Don't proceed if there are errors
    } else {
      setErrors({ ...errors, email: '' }); // Clear errors if the email is valid
    }
  
    const projectId = "2a5cf408-ce79-44b0-8ba9-97c48284c77d	";  // dynamic projectId later
    const inviteData = { email, role }; // Include role in the request
  
    try {
      console.log('Token being sent:', token);
      const response = await fetch(`http://localhost:9000/${projectId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`, // include token if needed
        },
        body: JSON.stringify(inviteData)
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Invited successfully:", responseData);
        onInvite(email); // Notify the parent component of the invite
        setEmail(""); // Clear the input field
        handleClose(); // Close the popup
        window.location.reload(); // Reload the page after successful invite
      } else {
        const errorData = await response.json();
        console.error("Failed to invite:", errorData);
  
        // Show a specific error message if the email is not found
        if (errorData && errorData.error.includes("not found member")) {
          setErrors({ ...errors, email: "Email not found." });
        } else {
          setErrors({ ...errors, email: "Failed to invite. Please try again." });
        }
      }
    } catch (error) {
      console.error("Error inviting:", error);
      setErrors({ ...errors, email: "An error occurred. Please try again." });
    }
  }

  const handleClose = () => {
    setEmail(""); 
    setErrors({ email: '', role: '' }); // Clear errors on close
    
    onClose(); 
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <form onSubmit={handleInvite} className="bg-white p-5 rounded-2xl w-4/12 h-64">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <img src="/people.svg" alt="Add People" className="w-8 h-8 mr-2" />
            <h1 className="text-2xl">Add People</h1>
          </div>
          <button type="button" onClick={handleClose} aria-label="Close"> 
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
            maxLength={24} 
            className="border p-2 rounded-lg w-4/5 mt-2 h-11"
          />

          {errors.email && (
            <span><p className="text-red-500 mt-1 ml-2">{errors.email}</p></span>
          )}

        </div>

        <div className="border-b ml-2 w-full border-gray-300 mt-8"></div>

        {/* Invite button */}
        <div className="mt-4 w-full flex justify-end">
          <button 
            type="submit"
            // onClick={handleInvite}
            className="py-2 px-3 bg-indigo-400 text-white text-lg rounded-lg hover:bg-indigo-500 transition duration-200"
          >
            Invite
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMemberPopup;
