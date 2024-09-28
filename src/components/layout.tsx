"use client";

import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { usePathname } from 'next/navigation'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const protectedPath = ['/login', '/register'];
  const showLayout = !protectedPath.includes(pathname);

  return (
    <>
      {showLayout ? (
        <div className="min-h-screen grid grid-cols-[auto,1fr] grid-rows-[auto,1fr]">
          <header className="col-span-2">
            <Header />
          </header>
          
          <aside className="row-span-2 bg-gray-100">
            <Sidebar pathname={pathname} />
          </aside>

          <main className="p-6">
            {children}
          </main>
        </div>
      ) : (
        <div>{children}</div>
      )}
    </>
  );
}
