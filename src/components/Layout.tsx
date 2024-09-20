"use client";

import Header from './Header'
import Sidebar from './Sidebar'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const protectedPath = ['/login', '/register'];
  const showLayout = !protectedPath.includes(pathname);

  return (
    <>
      {showLayout && <Header />}
      {showLayout && <Sidebar />}
      {children}
    </>
  );
}
