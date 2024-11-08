"use client";  

import { useState } from 'react';
import Link from 'next/link';
import Notification from '@/app/login/components/LoginNotifications';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });
    setShowNotification(false);

    // Validation logic
    let formErrors = { email: '', password: '' };
    if (!email) {
      formErrors.email = 'Email is required';
    }
    if (!password) {
      formErrors.password = 'Password is required';
    }

    setErrors(formErrors);

    if (!formErrors.email && !formErrors.password) {
      
      try {
        const response = await fetch("http://localhost:9000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberEmail: email,
            memberPassword: password,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("jwt", JSON.stringify(data));
          window.location.href = "/";
        } else {
          setNotificationMessage('Invalid email or password. Please try again.');
          setShowNotification(true);
          
          setTimeout(() => {
            setShowNotification(false);
          }, 3000);
          
          console.error("Login error: ", response.statusText);
        }
  
      } catch (err) {
        setNotificationMessage('Network error. Please try again later.');
        setShowNotification(true);
        
        // Auto-hide notification after 3 seconds
        setTimeout(() => {
          setShowNotification(false);
        }, 3000);
        
        console.error("Network error: ", err);
      }
    }
  };

  return (
    <div className="flex h-screen font-sans bg-cover bg-no-repeat bg-[url('/login.png')] lg:bg-none">
      
      {/* Conditional opacity and background image for narrow screens */}
      <div className="absolute inset-0 bg-opacity-40 bg-customGray lg:bg-transparent"></div>

      <div className="flex items-center justify-center flex-1 text-black relative z-10">
        <div className="bg-white shadow-4xl rounded-3xl overflow-hidden w-8/12 h-3/5 mx-28">
          <div className="mt-4 flex flex-col items-center justify-center">
            <h1 className="text-3xl mx-auto mt-10 font-sans font-medium">Welcome back</h1>
            {showNotification && (
                <Notification 
                  message={notificationMessage}
                  type="error"
                />
              )}
            <form onSubmit={handleSubmit} className="space-y-4 w-3/4 mx-auto mt-3">
              <div>
                <label className="block text-base text-gray-700">Email</label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  id="email"
                  name="email"
                  className={`mt-1 p-2.5 w-full text-lg border border-slate-400 rounded-xl focus:outline-customDarkBlue ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="eMessage">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-base text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    id="password"
                    name="password"
                    className={`mt-1 p-2.5 w-full text-lg border border-slate-400 rounded-xl focus:outline-customDarkBlue ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-y-0  right-0 pr-3 pt-4 flex items-center text-lg leading-5">
                    <button type="button" onClick={togglePassword} className="text-gray-800 focus:outline-none">
                      {showPassword ? (
                        <svg width="55" height="35" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M22.2991 12.1613C22.2991 12.1613 19.2991 18.1613 12.2991 18.1613C5.29907 18.1613 2.29907 12.1613 2.29907 12.1613C2.29907 12.1613 5.29907 6.16125 12.2991 6.16125C19.2991 6.16125 22.2991 12.1613 22.2991 12.1613Z" stroke="black" stroke-linecap="round"/> <circle cx="12.2991" cy="12.1613" r="3" stroke="black" stroke-linecap="round"/> </svg>                      ) : (
                        <svg width="55" height="35" viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg" > <g filter="url(#filter0_d_1_2002)"> <path d="M23.1284 9.16125C23.1284 9.16125 22.8081 9.82861 22.1284 10.6757M15.1284 14.1613C13.5204 14.1613 12.1763 13.749 11.077 13.1613M15.1284 14.1613C16.7364 14.1613 18.0806 13.749 19.1798 13.1613M15.1284 14.1613V17.6613M7.12842 9.16125C7.12842 9.16125 7.48209 9.89807 8.23469 10.806M11.077 13.1613L8.12842 16.1613M11.077 13.1613C9.81761 12.4879 8.87966 11.5841 8.23469 10.806M19.1798 13.1613L21.6284 16.1613M19.1798 13.1613C20.5102 12.4499 21.4819 11.4815 22.1284 10.6757M8.23469 10.806L5.12842 12.1613M22.1284 10.6757L25.1284 12.1613" stroke="black" strokeLinecap="round" /> </g> <defs> <filter id="filter0_d_1_2002" x="-0.871582" y="0.161255" width="39.061" height="38.883" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" > <feFlood floodOpacity="0" result="BackgroundImageFix" /> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" /> <feOffset dy="4" /> <feGaussianBlur stdDeviation="2" /> <feComposite in2="hardAlpha" operator="out" /> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" /> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_2002" /> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_2002" result="shape" /> </filter> </defs> </svg>
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && <p className="eMessage">{errors.password}</p>}
              </div>
              <div>
                <button type="submit" className="mt-2 w-full bg-customDarkBlue text-xl text-white p-3 rounded-lg hover:bg-sky-950 focus:outline-none focus:bg-sky-950 transition-colors duration-300">Login</button>
              </div>
            </form>
            <div className="mt-3 text-sm text-gray-600 text-center">
              <p>Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign up</Link></p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 mb-12 ml-16 text-xl text-gray-300">
          <h1>Computer Science, Kasetsart University</h1>
        </div>
      </div>
      
    <img src="login.png" alt="login" className="hidden lg:block w-full lg:w-5/12 object-cover object-center" />
    
    </div>
  );
}
