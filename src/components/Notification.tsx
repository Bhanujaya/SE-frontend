// "use client";

// import Link from "next/link";
// import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

// export type Notification = {
//   id: string;
//   time: Date;
//   detail: string;      // (Invite to project, Invite to task, Invite to meeting, Project reminder, Task reminder)
//   status: string;      // (READ/UN_READ)
//   projectId: string;
//   taskId: string;
//   meetingId: string;
//   userId: string;

//   href: string;             // maybe use
//   profileImgPath: string;   // maybe use
// }

// // const notificationsData: Notification[] = [      // uncomment later
// // remove 'name' ,'projectName', "taskName", "meetingName" props after uncomment

// const notificationsData = [
  
//   {
//     id: "1",
//     time: new Date("2024-01-09T09:00:00Z"),
//     detail: "Invite to task",
//     status: "READ",
//     name: "Chalawit",
//     projectName: "-",
//     taskName: "Task Name",
//     meetingName: "-",
//     href: "#",
//     profileImgPath: "/profile.svg",
//   },
//   {
//     id: "2",
//     time: new Date("2024-09-21T06:00:00Z"),
//     detail: "Invite to meeting",
//     status: "READ",
//     name: "Mario",
//     projectName: "",
//     taskName: "-",
//     meetingName: "Meeting Name",
//     href: "#",
//     profileImgPath: "/profile.svg",
//   },
//   {
//     id: "3",
//     time: new Date("2024-10-08T09:00:00Z"),
//     detail: "Project reminder",
//     status: "READ",
//     name: "Noppadol",
//     projectName: "Project Name",
//     taskName: "-",
//     meetingName: "-",
//     href: "#",
//     profileImgPath: "/profile.svg",
//   },
//   {
//     id: "4",
//     time: new Date("2024-10-10T06:00:00Z"),
//     detail: "Task reminder",
//     status: "UN_READ",
//     name: "John",
//     projectName: "Project 1",
//     taskName: "Task Name",
//     meetingName: "-",
//     href: "#",
//     profileImgPath: "/profile.svg",
//   },
//   {
//     id: "5",
//     time: new Date("2024-10-10T11:00:00Z"),
//     detail: "Invite to project",
//     status: "UN_READ",
//     name: "Pleang",
//     projectName: "Project Name",
//     taskName: "-",
//     meetingName: "-",
//     href: "#",
//     profileImgPath: "/profile.svg",
//   },
  
// ];

// // Sort notifications, newest first
// const sortedNotifications = notificationsData.sort(
//   (a, b) => b.time.getTime() - a.time.getTime()
// );

// // Function to format time
// const formatTime = (time: Date) => {
//   const now = new Date();
//   const diffInMs = now.getTime() - time.getTime();
//   const diffInMinutes = Math.floor(diffInMs / 60000); // difference in minutes
//   const diffInHours = Math.floor(diffInMinutes / 60); // difference in hours
//   const diffInDays = Math.floor(diffInHours / 24); // difference in days

//   if (diffInMinutes < 60) {
//     return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
//   } else if (diffInHours < 24) {
//     return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
//   } else if (diffInDays < 7) {
//     return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
//   } else {
//     return time.toLocaleString("th-TH", {
//       timeZone: "Asia/Bangkok",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   }
// };

// export default function Notification() {
  
//   // Check if there are any unread noti
//   const hasUnreadNotifications = notificationsData.some(
//     (notification) => notification.status === "UN_READ"
//   );

//   // Switch case according to detail (Invite to project, Invite to task, Invite to meeting, Project reminder, Task reminder)
//   const renderNotificationText = (item: typeof notificationsData[0]) => {
//     switch (item.detail) {
//       case "Invite to project":
//         return (
//           <>
//             <span className="font-semibold text-gray-900">{item.name} </span>
//             invites you to the project{" "}
//             <span className="font-semibold text-gray-900">{item.projectName}</span>.
//           </>
//         );
//       case "Invite to task":
//         return (
//           <>
//             <span className="font-semibold text-gray-900">{item.name} </span>
//             invites you to the task{" "}
//             <span className="font-semibold text-gray-900"> {item.taskName}</span>.
//           </>
//         );
//       case "Invite to meeting":
//         return (
//           <>
//             <span className="font-semibold text-gray-900">{item.name} </span>
//             invites you to the meeting{" "}
//             <span className="font-semibold text-gray-900">{item.meetingName}</span>.
//           </>
//         );
//       case "Project reminder":
//         return (
//           <>
//             <span className="font-semibold text-gray-900">Reminder: </span>
//             Your project{" "}
//             <span className="font-semibold text-gray-900">{item.projectName}</span> is due tomorrow at 00:00.
//           </>
//         );
//       case "Task reminder":
//         return (
//           <>
//             <span className="font-semibold text-gray-900">Reminder: </span>
//             Your task{" "}
//             <span className="font-semibold text-gray-900">{item.taskName}</span> is due tomorrow at 00:00.
//           </>
//         );
//       default:
//         return "New notification";
//     }
//   };

  
  
//   return (
//     <Popover className="relative flex justify-center items-center">
//       {/* Notification button */}
//       <PopoverButton className="flex items-center justify-center gap-x-1 text-sm font-semibold leading-6 text-white h-8 w-8 hover:bg-gray-700 rounded-full">
//         <img src="/bell.svg" alt="Notification" className="w-7" />
        
//         {/* Show red dot on noti button */}
//         {hasUnreadNotifications && (
//           <span className="absolute top-2 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
//         )}

//       </PopoverButton>

//       {/* Drop down */}
//       <PopoverPanel className="absolute -right-1 top-full z-10 mt-3 w-80 max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
//         <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
//           <p className="flex items-center justify-start gap-x-2.5 p-6 pb-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100">
//             Notification
//           </p>
//         </div>
//         <div className="p-2 pb-4">
//           {sortedNotifications.map((item) => (
//             <div
//               key={item.name}
//               className="group relative flex items-center gap-x-4 rounded-lg p-2 text-sm leading-2 hover:bg-gray-50"
//             >
//               <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-gray-50">
//                 <img
//                   src={item.profileImgPath}
//                   aria-hidden="true"
//                   className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
//                 />

//                 {/* Red dot for UN_READ */}
//                 {item.status === "UN_READ" && (
//                   <span className="absolute center-0 right-2 block h-2 w-2 rounded-full bg-red-500"></span>
//                 )}
//               </div>

//               <div className="flex-auto">
//                 <Link
//                   href={item.href}
//                   className="block font-semibold text-gray-900 p-0"
//                 >
//                   <div className="font-thin">
//                     {renderNotificationText(item)}
//                   </div>
//                   <span className="absolute inset-0" />
//                   {/* Time */}
//                   <p className={`mt-1 text-xs font-thin ${item.status === "UN_READ" ?
//                     "text-blue-500" : "text-gray-500"}`}>
//                     {formatTime(item.time)}
//                   </p>
//                 </Link>
                
//               </div>
//             </div>
//           ))}
//         </div>
//       </PopoverPanel>
//     </Popover>
//   );
// }

import React, { useEffect, useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Link from "next/link";

type NotificationType = 'PROJECT' | 'TASK' | 'MEETING';
type NotificationStatus = 'READ' | 'UNREAD';

interface Notification {
  notificationId: string;
  notificationTime: string;
  notificationDetail: string;
  notificationStatus: NotificationStatus;
  type: NotificationType;
  projectId?: string;
  taskId?: string;
  meetingId?: string;
  receiverId: string;
}

interface StoredUserData {
  token: string;
  memberId: string;
  detail: {
    memberEmail: string;
    memberName: string;
    username: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<StoredUserData | null>(null);

  const getAuthHeader = (token: string): string => {
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  };

  const fetchNotifications = async (userInfo: StoredUserData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notification?m=${userInfo.memberId}`, {
        headers: {
          'Authorization': getAuthHeader(userInfo.token)
        }
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!userData) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notification?n=${notificationId}`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(userData.token)
        }
      });

      if (!response.ok) throw new Error('Failed to mark notification as read');

      setNotifications(notifications.map(notification =>
        notification.notificationId === notificationId
          ? { ...notification, notificationStatus: 'READ' as NotificationStatus }
          : notification
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("jwt");
    if (storedData) {
      try {
        const parsedData: StoredUserData = JSON.parse(storedData);
        if (!parsedData.detail?.memberEmail) {
          throw new Error("Email not found in user data");
        }
        setUserData(parsedData);
        fetchNotifications(parsedData);
      } catch (error) {
        console.error("Error parsing JWT data:", error);
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    if (!userData) return;

    const interval = setInterval(() => {
      fetchNotifications(userData);
    }, 60000);

    return () => clearInterval(interval);
  }, [userData]);

  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return date.toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const getNotificationHref = (notification: Notification) => {
    switch (notification.type) {
      case 'PROJECT':
        return notification.projectId ? `/project-board/${notification.projectId}` : '#';
      case 'TASK':
        return notification.taskId ? `/task/${notification.taskId}` : '#';
      case 'MEETING':
        return notification.meetingId ? `/meeting/${notification.meetingId}` : '#';
      default:
        return '#';
    }
  };

  const hasUnreadNotifications = notifications.some(
    notification => notification.notificationStatus === 'UNREAD'
  );

  return (
    <Popover className="relative flex justify-center items-center">
      <PopoverButton className="flex items-center justify-center gap-x-1 text-sm font-semibold leading-6 text-white h-8 w-8 hover:bg-gray-700 rounded-full">
        <img src="/bell.svg" alt="Notification" className="w-7" />
        {hasUnreadNotifications && (
          <span className="absolute top-2 right-0 block h-2 w-2 rounded-full bg-red-500" />
        )}
      </PopoverButton>

      <PopoverPanel className="absolute -right-1 top-full z-10 mt-3 w-80 max-w-sm overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
        <div className="grid grid-cols-1 divide-x divide-gray-900/5 bg-gray-50">
          <p className="flex items-center justify-start gap-x-2.5 p-6 pb-2 text-sm font-semibold leading-6 text-gray-900">
            Notifications
          </p>
        </div>
        <div className="p-2 pb-4">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.notificationId}
                className="group relative flex items-start gap-x-4 rounded-lg p-2 text-sm leading-2 hover:bg-gray-50"
                onClick={() => markAsRead(notification.notificationId)}
              >
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {notification.notificationStatus === 'UNREAD' && (
                    <span className="absolute mt-auto right-2 block h-2.5 w-2.5 rounded-full bg-red-500" />
                  )}
                </div>

                <div className="flex-auto">
                  <Link
                    href={getNotificationHref(notification)}
                    className="block text-gray-900"
                  >
                    <p className="text-sm">
                      <span className="font-medium">Owner</span>
                      {notification.type === 'TASK' ? ' has added you to the meeting ' : ' invites you to the project '}
                      <span className="font-medium">
                        {notification.notificationDetail.split(' ').pop()}
                      </span>
                      <span>.</span>
                    </p>
                    <p className={`mt-1 text-xs ${notification.notificationStatus === 'UNREAD'
                        ? "text-blue-500"
                        : "text-gray-500"
                      }`}>
                      {formatTime(notification.notificationTime)}
                    </p>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
};

export default NotificationComponent;