"use client";

import Link from 'next/link'
import { Disclosure } from '@headlessui/react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { BackwardIcon, UserIcon, LockClosedIcon, HomeIcon, ChartPieIcon, Squares2X2Icon } from '@heroicons/react/24/outline'



const profileNavigation = [
  { name: 'BackHome', href: '/', iconPath: "/back-page.svg" },
  { name: 'Profile', href: '/profile-info', iconPath: "/profile_setting.svg" },
  { name: 'ChangePassword', href: '/changepassword', iconPath: "/changepassword.svg" },
];

const homeNavigation = [
  { name: 'Home', href: '/', iconPath: "/home.svg"},
  { name: 'Dashboard', href: '/dashboard', iconPath: "/pie-chart.svg" },
  { name: 'Projects', href: '/project-board', iconPath: "/project.svg"},
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Sidebar({ pathname }: { pathname: string }) {
  const navigation = pathname.startsWith('/profile') || pathname === '/changepassword' 
    ? profileNavigation 
    : homeNavigation;

  return (
    <Disclosure as="nav" className="bg-gray-100 w-56 min-h-screen max-w-screen">
      <div className="flex flex-col h-full">
        {/* ตำแหน่งปัจจุบัน */}
        <div className="px-60 py-2"> 
          <h2 className="text-lg text-gray-700">
            {navigation.find(item => item.href === pathname)?.name || 'Navigation'}
          </h2>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-2 py-1"> {/* เพิ่มค่า padding top */}
          <div className="flex flex-col space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={classNames(
                  pathname === item.href ? 'bg-customLightPurple' : 'hover:bg-gray-200',
                  'flex items-center space-x-3 rounded-md px-3 py-2 text-base font-medium text-gray-500'
                )}
              >
                <img src={item.iconPath} alt={item.name} className="mr-3 h-6 w-6 text-gray-500" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
