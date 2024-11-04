"use client";

import { useEffect, useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Notification from "./Notification";

interface MemberResponse {
  memberEmail: string;
  memberName: string;
  memberLastname: string;
  username: string;
  img: string | null;
}

interface JWTData {
  token: string;
  memberId: string;
  detail: MemberResponse;
}

const profileSettings = [
  { button: "Profile", href: "/profile-info", iconPath: "/profile2.svg" },
  { button: "Log out", href: "#", iconPath: "/logout.svg" },
];

export default function AuthenticatedHeader() {
  const router = useRouter();
  const [userData, setUserData] = useState<MemberResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const refreshUserData = async () => {
    try {
      if (typeof window === 'undefined') return;
      
      const jwtString = localStorage.getItem("jwt");
      if (!jwtString) {
        throw new Error("No JWT found");
      }

      let jwtData: JWTData;
      try {
        jwtData = JSON.parse(jwtString);
      } catch (e) {
        throw new Error("Invalid JWT format");
      }

      if (!jwtData.token || !jwtData.memberId) {
        throw new Error("Invalid token data");
      }

      if (jwtData.detail) {
        setUserData(jwtData.detail);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member?m=${jwtData.memberId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtData.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("jwt");
          throw new Error("Unauthorized - Please login again");
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const data: MemberResponse = await response.json();
      setUserData(data);

    } catch (err) {
      console.error("Error refreshing user data:", err);
      setError(err instanceof Error ? err.message : "Failed to load user data");
      
      if (err instanceof Error && 
          (err.message.includes("JWT") || 
           err.message.includes("Unauthorized"))) {
        localStorage.removeItem("jwt");
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  refreshUserData();

  window.addEventListener('profileUpdated', refreshUserData);
 
  return () => {
    window.removeEventListener('profileUpdated', refreshUserData);
  };
}, [router]);

  if (error) {
    return (
      <div className="bg-customDarkBlue p-4 flex justify-center items-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }


  if (!userData) {
    return (
      <div className="bg-customDarkBlue p-4 flex justify-center items-center">
        <div className="text-white">No user data available</div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="bg-customDarkBlue p-4 flex justify-center items-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <header className="bg-customDarkBlue">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-8xl items-center justify-between p-2 px-6"
      >
        <div className="flex lg:flex-1 ">
          <Link href="/" >
            {/* <span className="sr-only">Your Company</span> */}
            <img src="taskdown.png" className="w-19 h-10 rounded-2xl"/>
          </Link>
        </div>

        <div className="flex flex-1 justify-end items-center">
          <PopoverGroup className="flex gap-x-6">
            <Notification />
            
            <Popover className="relative">
              <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white bg-gray-700 hover:bg-gray-600 rounded-full p-1">
                <img 
                  src={userData.img || "/profile.svg"} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full object-cover"
                />
                <ChevronDownIcon
                  aria-hidden="true"
                  className="h-4 w-4 flex-none text-gray-300"
                />
              </PopoverButton>

              <PopoverPanel className="absolute -right-1 top-full z-10 mt-3 w-screen max-w-[300px] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                  <p className="flex items-center justify-start gap-x-2.5 p-6 pb-2 text-md font-semibold leading-6 text-gray-900 hover:bg-gray-100">
                    {userData.memberName} {userData.memberLastname}
                  </p>
                </div>

                <div className="p-2">
                  {profileSettings.map((item, index) => (
                    <div
                      key={item.button}
                      className={`group relative flex items-center gap-x-6 rounded-lg p-2 text-sm leading-6 hover:bg-gray-50 ${
                        index !== profileSettings.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                    >
                      <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg group-hover:bg-white">
                        <img src={item.iconPath} alt="" />
                      </div>
                      <div className="flex-auto">
                        {item.button === "Log out" ? (
                          <button
                            onClick={handleLogout}
                            className="block text-gray-500 w-full text-left"
                          >
                            {item.button}
                          </button>
                        ) : (
                          <Link href={item.href} className="block text-gray-500">
                            {item.button}
                            <span className="absolute inset-0" />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverPanel>
            </Popover>
          </PopoverGroup>
        </div>
      </nav>
    </header>
  );
}