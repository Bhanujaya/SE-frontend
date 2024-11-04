"use client";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const protectedPath = ["/login", "/register"];
  const showLayout = !protectedPath.includes(pathname);

  return (
    <>
      {showLayout ? (
        <div className="min-h-screen grid grid-cols-[auto,1fr] grid-rows-[4rem,1fr]">
        <header className="col-span-2 z-40 fixed top-0 left-0 w-full bg-white shadow">
          <Header />
        </header>
      
        <aside className="row-span-2 sticky top-16 bg-gray-100 h-[calc(100vh-4rem)]">
          <Sidebar pathname={pathname} />
        </aside>
      
        <main className="col-start-2 row-start-2 bg-white p-6 overflow-auto"> {/* Changed row-start from 1 to 2 */}
          {children}
        </main>
      </div>
      
      
      ) : (
        <div>{children}</div>
      )}
    </>
  );
}
