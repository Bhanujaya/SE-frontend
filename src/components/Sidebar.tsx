'use client'

import Link from 'next/link'
import { Disclosure } from '@headlessui/react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { HomeIcon, ChartPieIcon, Squares2X2Icon } from '@heroicons/react/24/outline'


const navigation = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Dashboard', href: '/dashboard', icon: ChartPieIcon },
  { name: 'Projects', href: '/project-board', icon: Squares2X2Icon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar() {

  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="bg-gray-100 w-56 min-h-screen max-w-screen">
      <div className="flex flex-col h-full">

        {/* Navigation */}
        <div className="flex-1 px-2 py-4">
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

                <item.icon className="mr-3 h-6 w-6 text-gray-500" aria-hidden="true" />

                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Disclosure>
  )
}
