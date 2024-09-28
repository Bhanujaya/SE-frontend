"use client";

import Link from "next/link";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";

import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";

const currentUser = {
  firstName: "Nichakann",
  surName: "Nernngam",
  age: 20,
};

const notifications = [
  {
    name: "Alex",
    projectName: "Project 1",
    href: "#",
    profileImgPath: "/profile.svg",
  },
  {
    name: "Mario",
    projectName: "Project 1",
    href: "#",
    profileImgPath: "/profile.svg",
  },
  {
    name: "Noppadol",
    projectName: "Project 1",
    href: "#",
    profileImgPath: "/profile.svg",
  },
  {
    name: "John",
    projectName: "Project 1",
    href: "#",
    profileImgPath: "/profile.svg",
  },
  {
    name: "Chalawit",
    projectName: "Project 1",
    href: "#",
    profileImgPath: "/profile.svg",
  },
];

const profileSettings = [
  { button: "Profile", href: "/profile-info", iconPath: "/profile2.svg" },
  { button: "Log out", href: "#", iconPath: "/logout.svg" },
];

export default function Header() {
  return (
    <header className="bg-customDarkBlue">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-8xl items-center justify-between p-2 px-6"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="m-1.5 p-1.5 text-white">
            <span className="sr-only">Your Company</span>
            Logo
          </Link>
        </div>
        <div className="flex flex-1 justify-end items-center">
          <PopoverGroup className="flex gap-x-6">
            <Popover className="relative flex justify-center items-center">
              {/* Notification button */}
              <PopoverButton className="flex items-center justify-center gap-x-1 text-sm font-semibold leading-6 text-white h-8 w-8 hover:bg-gray-600 rounded-md">
                <img src="/bell.svg" alt="Notification" className="w-7" />
              </PopoverButton>

              {/* Drop down */}
              <PopoverPanel className="absolute -right-1 top-full z-10 mt-3 w-80 max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                  <p className="flex items-center justify-start gap-x-2.5 p-6 pb-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100">
                    Notification
                  </p>
                </div>
                <div className="p-1">
                  {notifications.map((item) => (
                    <div
                      key={item.name}
                      className="group relative flex items-center gap-x-4 rounded-lg p-2 text-sm leading-2 hover:bg-gray-50"
                    >
                      <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <img
                          src={item.profileImgPath}
                          aria-hidden="true"
                          className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                        />
                      </div>
                      <div className="flex-auto">
                        <Link
                          href={item.href}
                          className="block font-semibold text-gray-900 p-0"
                        >
                          {item.name}
                          <span className="absolute inset-0" />
                        </Link>
                        <p className="mt-1 text-gray-600">
                          {" "}
                          invited you to{" "}
                          <span className="font-semibold text-gray-900">
                            {item.projectName}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverPanel>
            </Popover>

            <Popover className="relative">
              {/* Profile Setting button */}
              <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-white bg-gray-700 hover:bg-gray-600 rounded-full p-1">
                <img src="/profile.svg" alt="Profile" className="w-9" />
                <ChevronDownIcon
                  aria-hidden="true"
                  className="h-4 w-4 flex-none text-gray-300"
                />
              </PopoverButton>

              {/* Drop down */}
              <PopoverPanel className="absolute -right-1 top-full z-10 mt-3 w-screen max-w-[300px] overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
                  <p className="flex items-center justify-start gap-x-2.5 p-6 pb-2 text-md font-semibold leading-6 text-gray-900 hover:bg-gray-100">
                    {currentUser.firstName} {currentUser.surName}
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
                        <Link href={item.href} className="block text-gray-500">
                          {item.button}
                          <span className="absolute inset-0" />
                        </Link>
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
