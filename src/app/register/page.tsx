"use client";  

import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', username: '', firstName: '', surname: '', password: '', confirmPassword: '' });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formErrors = { email: '', username: '', firstName: '', surname: '', password: '', confirmPassword: '' };
    if (!email) {
      formErrors.email = 'Email required!';
    }
    if (!username) {
      formErrors.username = 'Username required!';
    }
    if (!firstName) {
      formErrors.firstName = 'First name required!';
    }
    if (!surname) {
      formErrors.surname = 'Surname required!';
    }
    if (!password) {
      formErrors.password = 'Password required!';
    }
    if (!confirmPassword) {
      formErrors.confirmPassword = 'Confirm password!';
    } else if (confirmPassword !== password) {
      formErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(formErrors);

    // Proceed with form submission if there are no errors
    if (!formErrors.email && !formErrors.username && !formErrors.firstName && !formErrors.surname && !formErrors.password && !formErrors.confirmPassword) {
      // Perform form submission (e.g., API call)
    }
  };

  return (
    <>
      <div className="flex h-screen customGray font-sans justify-center">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/bg-signup.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.2
          }}
        ></div>
        <div className='bg-white relative z-10 shadow-4xl rounded-3xl overflow-hidden  my-auto w-2/5 h-5/6'>
          <div className="mt-4 flex flex-col items-center justify-center">
            <h1 className="text-3xl mx-auto mt-5 font-sans font-medium">Sign Up</h1>
            <form onSubmit={handleSubmit} className="space-y-3 w-full lg:w-3/4 mx-auto mt-4">
              <div>
                <label className="ml-1 block text-sm text-gray-700">Email</label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-0.5 p-2.5 w-full text-lg border border-slate-400 rounded-2xl  focus:outline-customDarkBlue"
                />
                {errors.email && <p className="eMessage">{errors.email}</p>}
              </div>

              <div>
                <label className="ml-1 block text-sm text-gray-700">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-0.5 p-2.5 w-full text-lg border border-slate-400 rounded-2xl focus:outline-customDarkBlue"
                />
                {errors.username && <p className="eMessage">{errors.username}</p>}
              </div>

              <div className="flex space-x-3">
                <div className="w-1/2">
                  <label className="ml-1 block text-sm text-gray-700">First name</label>
                  <input
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="mt-0.5 p-2.5 w-full text-lg border border-slate-400 rounded-2xl focus:outline-customDarkBlue"
                  />
                  {errors.firstName && <p className="eMessage">{errors.firstName}</p>}
                </div>

                <div className="w-1/2">
                  <label className="ml-1 block text-sm text-gray-700">Surname</label>
                  <input
                    type="text"
                    placeholder="Enter your surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="mt-0.5 p-2.5 w-full text-lg border border-slate-400 rounded-2xl focus:outline-customDarkBlue"
                  />
                  {errors.surname && <p className="eMessage">{errors.surname}</p>}
                </div>
              </div>

              <div>
                <label className="ml-1 block text-sm text-gray-700">Password</label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-0.5 p-2.5 w-full text-lg border border-slate-400 rounded-2xl focus:outline-customDarkBlue pr-12"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 top-2 flex items-center text-xl leading-5 focus:outline-none"
                  >
                    {showPassword ? (  
                      <svg  width="55" height="35" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M22.2991 12.1613C22.2991 12.1613 19.2991 18.1613 12.2991 18.1613C5.29907 18.1613 2.29907 12.1613 2.29907 12.1613C2.29907 12.1613 5.29907 6.16125 12.2991 6.16125C19.2991 6.16125 22.2991 12.1613 22.2991 12.1613Z" stroke="black" stroke-linecap="round"/> <circle cx="12.2991" cy="12.1613" r="3" stroke="black" stroke-linecap="round"/> </svg>                      ) : (
                      <svg width="55" height="35" viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg" > <g filter="url(#filter0_d_1_2002)"> <path d="M23.1284 9.16125C23.1284 9.16125 22.8081 9.82861 22.1284 10.6757M15.1284 14.1613C13.5204 14.1613 12.1763 13.749 11.077 13.1613M15.1284 14.1613C16.7364 14.1613 18.0806 13.749 19.1798 13.1613M15.1284 14.1613V17.6613M7.12842 9.16125C7.12842 9.16125 7.48209 9.89807 8.23469 10.806M11.077 13.1613L8.12842 16.1613M11.077 13.1613C9.81761 12.4879 8.87966 11.5841 8.23469 10.806M19.1798 13.1613L21.6284 16.1613M19.1798 13.1613C20.5102 12.4499 21.4819 11.4815 22.1284 10.6757M8.23469 10.806L5.12842 12.1613M22.1284 10.6757L25.1284 12.1613" stroke="black" strokeLinecap="round" /> </g> <defs> <filter id="filter0_d_1_2002" x="-0.871582" y="0.161255" width="39.061" height="38.883" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" > <feFlood floodOpacity="0" result="BackgroundImageFix" /> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" /> <feOffset dy="4" /> <feGaussianBlur stdDeviation="2" /> <feComposite in2="hardAlpha" operator="out" /> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" /> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_2002" /> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_2002" result="shape" /> </filter> </defs> </svg>
                      )}
                  </button>
                </div>
                {errors.password && <p className="eMessage">{errors.password}</p>}
              </div>

              <div>
                <label className="ml-1 block text-sm text-gray-700">Confirm Password</label>
                <div className="relative w-full">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-0.5 p-2.5 w-full text-lg border border-slate-400 rounded-2xl focus:outline-customDarkBlue pr-12"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    className="absolute inset-y-0 right-0 top-2 flex items-center text-xl leading-5 focus:outline-none"
                  >
                     {showConfirmPassword ? (  
                      <svg  width="55" height="35" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M22.2991 12.1613C22.2991 12.1613 19.2991 18.1613 12.2991 18.1613C5.29907 18.1613 2.29907 12.1613 2.29907 12.1613C2.29907 12.1613 5.29907 6.16125 12.2991 6.16125C19.2991 6.16125 22.2991 12.1613 22.2991 12.1613Z" stroke="black" stroke-linecap="round"/> <circle cx="12.2991" cy="12.1613" r="3" stroke="black" stroke-linecap="round"/> </svg>                      ) : (
                      <svg width="55" height="35" viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg" > <g filter="url(#filter0_d_1_2002)"> <path d="M23.1284 9.16125C23.1284 9.16125 22.8081 9.82861 22.1284 10.6757M15.1284 14.1613C13.5204 14.1613 12.1763 13.749 11.077 13.1613M15.1284 14.1613C16.7364 14.1613 18.0806 13.749 19.1798 13.1613M15.1284 14.1613V17.6613M7.12842 9.16125C7.12842 9.16125 7.48209 9.89807 8.23469 10.806M11.077 13.1613L8.12842 16.1613M11.077 13.1613C9.81761 12.4879 8.87966 11.5841 8.23469 10.806M19.1798 13.1613L21.6284 16.1613M19.1798 13.1613C20.5102 12.4499 21.4819 11.4815 22.1284 10.6757M8.23469 10.806L5.12842 12.1613M22.1284 10.6757L25.1284 12.1613" stroke="black" strokeLinecap="round" /> </g> <defs> <filter id="filter0_d_1_2002" x="-0.871582" y="0.161255" width="39.061" height="38.883" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" > <feFlood floodOpacity="0" result="BackgroundImageFix" /> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" /> <feOffset dy="4" /> <feGaussianBlur stdDeviation="2" /> <feComposite in2="hardAlpha" operator="out" /> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" /> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_2002" /> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_2002" result="shape" /> </filter> </defs> </svg>
                      )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="eMessage">{errors.confirmPassword}</p>}
              </div>

              <div>
                <button type="submit" className="w-full bg-customDarkBlue text-xl text-white p-3 rounded-lg hover:bg-sky-950 focus:outline-none focus:bg-sky-950 transition-colors duration-300 mt-3">Sign Up</button>
              </div>
            </form>
            <div className="ml-1 mt-2 block text-sm text-gray-600 text-center">
              <p>Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
