'use client'

import Link from 'next/link';
import { useState } from 'react'
import styles from '../styles/Header.module.css'

const Header = () => {

  // temp database
  const currentUser = {
    firstName: "Nichakann",
    surName: "Nernngam",
    age: 20
  }
  const peopleName = "Alex"
  const projectName = "Project 1"

  

  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const toggleNotificationDropdown = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  }

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  }

  const closeDropdowns = () => {
    setShowNotificationDropdown(false);
    setShowProfileDropdown(false);
  }

  const isDropdownOpen = showNotificationDropdown || showProfileDropdown;

  return (
    <nav className={styles.header}>
      <div className={styles.container}>
        <Link href='/' className={styles.logo}>Kidmaiok</Link> {/*Wainting for logo*/}
        <ul className={styles.navLinks}>

          <button onClick={toggleNotificationDropdown} className={styles.notificationButton}>
            <img src='/bell.svg' alt="Notification" className={styles.bellIcon}></img>
          </button>
          {showNotificationDropdown && (
            <div className={styles.dropdownNotification}>
              <h1 className={styles.notificationHeader}>Notification</h1>
              <li>
              <p className={styles.notificationContent}><strong>{peopleName}</strong> invite you to <strong>{projectName}</strong></p>
              <p className={styles.notificationContent}><strong>{peopleName}</strong> invite you to <strong>{projectName}</strong></p>
              <p className={styles.notificationContent}><strong>{peopleName}</strong> invite you to <strong>{projectName}</strong></p>
              </li>
            </div>
          )}

          <button onClick={toggleProfileDropdown} className={styles.profileSettingButton}>
            <div className={styles.iconContainer}>
              <img src="/profile.svg" alt="Profile" className={styles.profileSettingIcon} />
              <img src="/dropdown.svg" alt="Dropdown" className={styles.profileSettingIcon} />
            </div>
            </button> 
          {showProfileDropdown && (
            <div className={styles.dropdownProfile}>
              <h1 className={styles.currentUserFullName}>{currentUser.firstName} {currentUser.surName}</h1>
              <Link href='/profileSetting' className={styles.profileContent}> 
                <img src='/profile2.svg' alt='Profile' className={styles.peopleIcon}/> 
                <span className={styles.profileText}>My profile</span>
              </Link>
              <h1 className={styles.separator} />
              <Link href='/login' className={styles.profileContent}> 
                <img src='/logout.svg' alt='Logout' className={styles.logoutIcon}/> 
                <span className={styles.profileText}>Log out</span>
              </Link>
            </div>
          )}

        </ul>

        {isDropdownOpen && (
          <div className={styles.overlay} onClick={closeDropdowns}></div>
        )}
      </div>
    </nav>
  );
};

export default Header;
