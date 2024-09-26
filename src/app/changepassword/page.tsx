"use client";

import { useState, useEffect, use } from 'react';
import Notification from '@/components/Notification';

export default function ChangePassword() { 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  // Alert when success
  const [notification, setNotification] = useState<string | null>(null);

  const toggleCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Reset errors
  let formErrors = { currentPassword: '', newPassword: '', confirmPassword: '' };

  // current password
  const storedPassword = "password";

  if (!currentPassword) {
    formErrors.currentPassword = 'Current password is required.';
  } else if (currentPassword !== storedPassword) {
    formErrors.currentPassword = 'Current password is incorrect.';
  }

  if (!newPassword) {
    formErrors.newPassword = 'New password is required.';
  } else if (newPassword.length < 8 || newPassword.length > 20) {
    formErrors.newPassword = 'Password must be between 8 and 20 characters long.';
  }

  if (!confirmPassword) {
    formErrors.confirmPassword = 'Confirm password is required.';
  } else if (newPassword !== confirmPassword) {
    formErrors.confirmPassword = 'Confirm password does not match new password.';
  }

  setErrors(formErrors);

  if (!formErrors.currentPassword && !formErrors.newPassword && !formErrors.confirmPassword) {
    console.log('success');
    setNotification("Saved");
    setTimeout(() => setNotification(null), 3000);

    // Clear fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  }
};


  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="mt-16 flex flex-col items-center h-screen">
      <h1 className="text-3xl mx-auto mt-2 font-sans font-medium">Change Password</h1>
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>

        {/* Current Password */}
        <label className="mt-6 block text-base text-gray-700 w-2/6 text-left">Current password</label>
        <div className="relative w-2/6">
          <input 
            type={showCurrentPassword ? "text" : "password"} 
            id="currentPassword" 
            name="currentPassword"
            className="mt-1 p-4 w-full text-sm border border-slate-400 rounded-xl"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button 
            type="button" 
            onClick={toggleCurrentPassword} 
            className="absolute inset-y-1 top-5 right-2 flex items-center text-gray-800"
          >
            {showCurrentPassword ? (
              <svg width="35" height="auto" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M22.2991 12.1613C22.2991 12.1613 19.2991 18.1613 12.2991 18.1613C5.29907 18.1613 2.29907 12.1613 2.29907 12.1613C2.29907 12.1613 5.29907 6.16125 12.2991 6.16125C19.2991 6.16125 22.2991 12.1613 22.2991 12.1613Z" stroke="black" strokeLinecap="round"/> <circle cx="12.2991" cy="12.1613" r="3" stroke="black" strokeLinecap="round"/> 
              </svg>
            ) : (
              <svg width="35" height="40" viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg" > <g filter="url(#filter0_d_1_2002)"> <path d="M23.1284 9.16125C23.1284 9.16125 22.8081 9.82861 22.1284 10.6757M15.1284 14.1613C13.5204 14.1613 12.1763 13.749 11.077 13.1613M15.1284 14.1613C16.7364 14.1613 18.0806 13.749 19.1798 13.1613M15.1284 14.1613V17.6613M7.12842 9.16125C7.12842 9.16125 7.48209 9.89807 8.23469 10.806M11.077 13.1613L8.12842 16.1613M11.077 13.1613C9.81761 12.4879 8.87966 11.5841 8.23469 10.806M19.1798 13.1613L21.6284 16.1613M19.1798 13.1613C20.5102 12.4499 21.4819 11.4815 22.1284 10.6757M8.23469 10.806L5.12842 12.1613M22.1284 10.6757L25.1284 12.1613" stroke="black" strokeLinecap="round" /> </g> 
              </svg>
            )}
          </button>
        </div>
        {errors.currentPassword && <p className="text-xs text-red-500 w-2/6">{errors.currentPassword}</p>}

        {/* New Password */}
        <label className="mt-4 block text-base text-gray-700 w-2/6 text-left">New password</label>
        <div className="relative w-2/6">
          <input 
            type={showNewPassword ? "text" : "password"} 
            id="newPassword" 
            name="newPassword"
            className="mt-1 p-4 w-full text-sm border border-slate-400 rounded-xl"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button 
            type="button" 
            onClick={toggleNewPassword} 
            className="absolute inset-y-1 top-5 right-2 flex items-center text-gray-800"
          >
            {showNewPassword ? (
              <svg width="35" height="auto" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M22.2991 12.1613C22.2991 12.1613 19.2991 18.1613 12.2991 18.1613C5.29907 18.1613 2.29907 12.1613 2.29907 12.1613C2.29907 12.1613 5.29907 6.16125 12.2991 6.16125C19.2991 6.16125 22.2991 12.1613 22.2991 12.1613Z" stroke="black" strokeLinecap="round"/> <circle cx="12.2991" cy="12.1613" r="3" stroke="black" strokeLinecap="round"/> 
              </svg>
            ) : (
              <svg width="35" height="40" viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg" > <g filter="url(#filter0_d_1_2002)"> <path d="M23.1284 9.16125C23.1284 9.16125 22.8081 9.82861 22.1284 10.6757M15.1284 14.1613C13.5204 14.1613 12.1763 13.749 11.077 13.1613M15.1284 14.1613C16.7364 14.1613 18.0806 13.749 19.1798 13.1613M15.1284 14.1613V17.6613M7.12842 9.16125C7.12842 9.16125 7.48209 9.89807 8.23469 10.806M11.077 13.1613L8.12842 16.1613M11.077 13.1613C9.81761 12.4879 8.87966 11.5841 8.23469 10.806M19.1798 13.1613L21.6284 16.1613M19.1798 13.1613C20.5102 12.4499 21.4819 11.4815 22.1284 10.6757M8.23469 10.806L5.12842 12.1613M22.1284 10.6757L25.1284 12.1613" stroke="black" strokeLinecap="round" /> </g> 
              </svg>
            )}
          </button>
        </div>
        {errors.newPassword && <p className="text-xs text-red-500 w-2/6">{errors.newPassword}</p>}

        {/* Confirm New Password */}
        <label className="mt-4 block text-base text-gray-700 w-2/6 text-left">Confirm password</label>
        <div className="relative w-2/6">
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            id="confirmPassword" 
            name="confirmPassword"
            className="mt-1 p-4 w-full text-sm border border-slate-400 rounded-xl"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button 
            type="button" 
            onClick={toggleConfirmPassword} 
            className="absolute inset-y-1 top-5 right-2 flex items-center text-gray-800"
          >
            {showConfirmPassword ? (
              <svg width="35" height="auto" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M22.2991 12.1613C22.2991 12.1613 19.2991 18.1613 12.2991 18.1613C5.29907 18.1613 2.29907 12.1613 2.29907 12.1613C2.29907 12.1613 5.29907 6.16125 12.2991 6.16125C19.2991 6.16125 22.2991 12.1613 22.2991 12.1613Z" stroke="black" strokeLinecap="round"/> <circle cx="12.2991" cy="12.1613" r="3" stroke="black" strokeLinecap="round"/> 
              </svg>
            ) : (
              <svg width="35" height="40" viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg" > <g filter="url(#filter0_d_1_2002)"> <path d="M23.1284 9.16125C23.1284 9.16125 22.8081 9.82861 22.1284 10.6757M15.1284 14.1613C13.5204 14.1613 12.1763 13.749 11.077 13.1613M15.1284 14.1613C16.7364 14.1613 18.0806 13.749 19.1798 13.1613M15.1284 14.1613V17.6613M7.12842 9.16125C7.12842 9.16125 7.48209 9.89807 8.23469 10.806M11.077 13.1613L8.12842 16.1613M11.077 13.1613C9.81761 12.4879 8.87966 11.5841 8.23469 10.806M19.1798 13.1613L21.6284 16.1613M19.1798 13.1613C20.5102 12.4499 21.4819 11.4815 22.1284 10.6757M8.23469 10.806L5.12842 12.1613M22.1284 10.6757L25.1284 12.1613" stroke="black" strokeLinecap="round" /> </g> 
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-500 w-2/6">{errors.confirmPassword}</p>}

        {/* Submit Button */}
        <button type="submit" className="mt-6 w-2/6 p-3 text-white bg-indigo-400 rounded-xl hover:bg-indigo-500">
          Save Changes
        </button>

        {notification && (
          <Notification message={notification} />
        )}
      </form>
    </div>
  );
}
