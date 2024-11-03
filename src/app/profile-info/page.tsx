"use client";

import { useState, useEffect } from "react";
import { CameraIcon } from "@heroicons/react/24/outline";
import Notification from "@/app/profile-info/components/Notification";

interface MemberDetail {
  memberEmail: string;
  memberName: string;
  memberLastname: string;
  username: string;
  img: string | null;
}

interface MemberData {
  token: string | null;
  memberId: string;
  detail: MemberDetail;
}

export default function ProfileInfo() {
  const DEFAULT_IMAGE = "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg";
  
  const [memberName, setName] = useState("");
  const [memberLastname, setSurname] = useState("");
  const [username, setUsername] = useState("");
  const [currentImage, setCurrentImage] = useState(""); 
  const [newImage, setNewImage] = useState<string | null>(null); 
  const [isChanged, setIsChanged] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("jwt");
    console.log("jwt:", userData);

    if (userData) {
      try {
        const member = JSON.parse(userData) as MemberData;

        if (member.token) {
          const fetchData = async () => {
            try {
              const response = await fetch(
                `http://localhost:9000/member?m=${member.memberId}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${member.token}`,
                  },
                }
              );

              if (!response.ok) {
                if (response.status === 401) {
                  window.location.href = "/login";
                  return;
                }
                throw new Error("Failed to fetch data");
              }

              const data = await response.json();
              console.log("Fetched user data:", data);

              setName(data.detail.memberName || '');
              setSurname(data.detail.memberLastname || '');
              setUsername(data.detail.username || '');
              setCurrentImage(data.detail.img || DEFAULT_IMAGE);
              setNewImage(null);
              setIsChanged(false);

            } catch (error) {
              console.error("Error fetching data:", error);
              setNotification({message: 'Failed to load profile data. Please try again.', type:"error"});
            }
          };

          fetchData();
        } else {
          console.warn("No token found. Redirecting to login.");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Invalid JWT token:", error);
        setNotification({message: 'Invalid session data. Please log in again.', type: "error"});
      }
    } else {
      window.location.href = "/login";
    }
  }, []);


  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000); 

      return () => clearTimeout(timer); 
    }
  }, [notification]); 

  const handleSaveChanges = async () => {
    if (!memberName.trim() || !memberLastname.trim() || !username.trim()) {
       setNotification({ message: "All fields are required. Please fill out all fields.", type: 'error' });
      setTimeout(() => setNotification(null), 5000); // Clear notification after 5 seconds
      return; // Stop execution if any field is empty
    }

    try {
      const userData = localStorage.getItem("jwt");
      if (!userData) {
        setNotification({message: 'Please log in to save changes', type: "error"});
        window.location.href = "/login";
        return;
      }

      const member = JSON.parse(userData) as MemberData;
      if (!member.token) {
        setNotification({message: 'Invalid session. Please log in again.', type: "error"});
        window.location.href = "/login";
        return;
      }

      console.log("Token being used:", member.token);

      const requestBody = {
        memberId: member.memberId,
        detail: {
          memberEmail: member.detail.memberEmail,
          memberName,
          memberLastname,
          username,
          // ใช้รูปใหม่ถ้ามี ไม่มีใช้รูปเดิม
          img: newImage || currentImage 
        }
      };

      console.log("Request body:", requestBody);

      const response = await fetch('http://localhost:9000/member/edit-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${member.token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('jwt');
          setNotification({message: 'Session expired. Please log in again.', type: "error"});
          window.location.href = "/login";
          return;
        }
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      const updatedData = await response.json();
      console.log("Updated data:", updatedData);

      setName(updatedData.detail.memberName || '');
      setSurname(updatedData.detail.memberLastname || '');
      setUsername(updatedData.detail.username || '');
      setCurrentImage(updatedData.detail.img || DEFAULT_IMAGE);
      setNewImage(null);
      
      setNotification({ message: 'Profile updated successfully', type: "success" });
      setIsChanged(false);

    } catch (error) {
      console.error('Error in handleSaveChanges:', error);
      if (error instanceof Error) {
        setNotification({ message: 'Failed to update profile: ${error.message}', type: "error" });
      } else {
        setNotification({message: 'Failed to update profile. Please try again.', type: "error"});
      }
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setIsChanged(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewImage(imageUrl);
      setIsChanged(true);
    }
  }

  // ใช้ newImage ถ้ามี ไม่งั้นใช้ currentImage
  const displayImage = newImage || currentImage || DEFAULT_IMAGE;

  return (
    <div className="mt-8 flex h-screen overflow-hidden">
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <div className="p-8 ml-96 bg-white">
        <div className="relative flex justify-center">
          <img
            src={displayImage}
            alt="Profile Picture"
            className="rounded-full h-32 w-32 object-cover"
          />

          <div className="absolute bottom-0 left-52 bg-white p-1 rounded-full border shadow-md hover:bg-gray-100">
            <label className="cursor-pointer">
              <CameraIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="hidden" 
              />
            </label>
          </div>
        </div>

        <div className="text-center mt-7">
          <h2 className="text-2xl">
            <span className="mr-14">{memberName}</span>
            <span>{memberLastname}</span>
          </h2>
        </div>

        <div className="flex justify-center space-x-5 mt-7">
          <div className="flex-1 text-center">
            <div className="relative">
              <label className="absolute left-2 -top-2.5 transition-all text-black">First name</label>
              <input
                type="text"
                value={memberName}
                onChange={(e) => handleInputChange(setName, e.target.value)}
                className="border rounded-xl border-gray-400 px-2 py-2 h-10 w-44 mt-4"
              />
            </div>
          </div>

          <div className="flex-1 text-center">
            <div className="relative">
              <label className="absolute left-2 -top-2.5 text-black">Surname</label>
              <input
                type="text"
                value={memberLastname}
                onChange={(e) => handleInputChange(setSurname, e.target.value)}
                className="border rounded-xl border-gray-400 px-2 py-2 h-10 w-44 mt-4"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="relative mt-7">
            <label className="absolute left-2 -top-2.5 transition-all text-black">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => handleInputChange(setUsername, e.target.value)}
              className="border rounded-xl border-gray-400 px-2 py-2 w-full mt-4"
            />
          </div>
        </div>

        <button
          onClick={handleSaveChanges}
          disabled={!isChanged}
          className={`w-full px-4 py-2 rounded-xl mt-5 text-white transition-colors duration-300 
            ${isChanged 
              ? 'bg-indigo-400 hover:bg-indigo-500' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}