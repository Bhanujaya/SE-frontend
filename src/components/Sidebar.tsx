"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import styles from "../styles/Sidebar.module.css";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.sidebar}>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/" className={pathname === '/' ? styles.active : ''}>
              <img src="/home.svg" alt="Home" />Home
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className={pathname === '/dashboard' ? styles.active : ''}>
            <img src="/pie-chart.svg" alt="Dashboard" />Dashboard
          </Link>
        </li>
        <li>
          <Link href="/project-board" className={pathname === '/project' ? styles.active : ''}>
            <img src="/project.svg" alt="Project" />
            Project
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
