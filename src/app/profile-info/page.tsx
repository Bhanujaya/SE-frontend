"use client";

import { useState, useEffect } from "react";
import { CameraIcon } from "@heroicons/react/24/outline"; 
import Notification from "@/components/Notification";

export default function ProfileInfo() {
  const [name, setName] = useState("Lorem");
  const [surname, setSurname] = useState("Ipsum");
  const [username, setUsername] = useState("Lorem_ipsum");
  
  const [savedName, setSavedName] = useState(name);
  const [savedSurname, setSavedSurname] = useState(surname);
  
  const [profileImage, setProfileImage] = useState("https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg");

  const [isEditing, setIsEditing] = useState({
    name: true,
    surname: true,
    username: true,
  });

  // สถานะมีการเปลี่ยนแปลงข้อมูลไหม
  const [isChanged, setIsChanged] = useState(false);

    // Alert when succes
  const [notification, setNotification] = useState<string | null>(null);

  // แสดงปุ่ม Save Changes เมื่อเข้าไปที่หน้าโปรไฟล์
  useEffect(() => {
    setIsChanged(true);
    
    document.body.style.overflow = 'hidden';


    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);


const handleSaveChanges = () => {
  // อัปเดตข้อมูล
  setSavedName(name);
  setSavedSurname(surname);
  setIsChanged(false);

  // แสดงการแจ้งเตือนเมื่อบันทึกสำเร็จ
  setNotification("Saved");

  // ตั้งเวลาให้การแจ้งเตือนหายไป
  setTimeout(() => setNotification(null), 3000);
};



  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setIsChanged(true);
  };

  // อัปโหลดรูปโปรไฟล์
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // URL รูปที่อัปโหลด
      const imageUrl = URL.createObjectURL(file); 
      // อัปเดตรูปโปรไฟล์
      setProfileImage(imageUrl); 
    }
  };

  return (
    <div className="mt-8 flex h-screen overflow-hidden"> 
      <div className="p-8 ml-96 bg-white"> 
        {/* รูปโปรไฟล์ */}
        <div className="relative flex justify-center">
          <img
            // ใช้ URL ของรูปโปรไฟล์ที่อัปเดต
            src={profileImage} 
            alt="Profile Picture"
            className="rounded-full h-32 w-32 object-cover"
          />
          {/* ปุ่มสำหรับเปลี่ยนรูปโปรไฟล์ */}
          <div className="absolute bottom-0 left-52 bg-white p-1 rounded-full border shadow-md hover:bg-gray-100">
            <label className="cursor-pointer">
              <CameraIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
              {/* Input สำหรับอัปโหลดรูปโปรไฟล์ */}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="hidden" 
              />
            </label>
          </div>
        </div>

        {/* แสดงชื่อและนามสกุลด้านล่างรูปโปรไฟล์ */}
        <div className="text-center mt-7">
          <h2 className="text-2xl">
            <span className="mr-14">{savedName}</span>
            <span>{savedSurname}</span>
          </h2>
        </div>

        {/* First Name */}
        <div className="flex justify-center space-x-5 mt-7">
          <div className="flex-1 text-center">
            <div className="relative">
              <label className={`absolute left-2 -top-2.5 transition-all text-black`}>First name</label>
              {isEditing.name ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleInputChange(setName, e.target.value)}
                  className="border rounded-xl border-gray-400 px-2 py-2 h-10 w-44 mt-4"
                  onFocus={() => setIsEditing({ ...isEditing, name: true })}
                  onBlur={() => !name && setIsEditing({ ...isEditing, name: false })}
                />
              ) : (
                <p onClick={() => setIsEditing({ ...isEditing, name: true })} className="text-lg cursor-pointer mt-4">
                  {savedName}
                </p>
              )}
            </div>
          </div>

          {/* Surname */}
          <div className="flex-1 text-center">
            <div className="relative">
              <label className={`absolute left-2 -top-2.5 text-black`}>Surname</label>
              {isEditing.surname ? (
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => handleInputChange(setSurname, e.target.value)}
                  className="border rounded-xl border-gray-400 px-2 py-2 h-10 w-44 mt-4"
                  onFocus={() => setIsEditing({ ...isEditing, surname: true })}
                  onBlur={() => !surname && setIsEditing({ ...isEditing, surname: false })}
                />
              ) : (
                <p onClick={() => setIsEditing({ ...isEditing, surname: true })} className="text-lg cursor-pointer mt-4">
                  {savedSurname}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* แก้ไขชื่อผู้ใช้ */}
        <div>
          <div className="relative mt-7">
            <label className={`absolute left-2 -top-2.5 transition-all text-black`}>Username</label>
            {isEditing.username ? (
              <input
                type="text"
                value={username}
                onChange={(e) => handleInputChange(setUsername, e.target.value)}
                className="border rounded-xl border-gray-400 px-2 py-2 w-full mt-4"
                onFocus={() => setIsEditing({ ...isEditing, username: true })}
                onBlur={() => !username && setIsEditing({ ...isEditing, username: false })}
              />
            ) : (
              <p onClick={() => setIsEditing({ ...isEditing, username: true })} className="text-lg cursor-pointer mt-4">
                {username}
              </p>
            )}
          </div>
        </div>

        {/* ปุ่มบันทึกการเปลี่ยนแปลง */}
        <button
          onClick={handleSaveChanges}
          className="bg-indigo-400 text-white px-4 py-2 rounded-xl mt-5 w-full hover:bg-indigo-500">
          Save Changes
        </button>
        
        {notification && (
          <Notification message={notification} />
        )}
      </div>
    </div>
  );
}
