import React, { useEffect, useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Link from "next/link";

// Backend compatible types
type NotificationType = 'PROJECT' | 'TASK' | 'MEETING';
type NotificationStatus = 'READ' | 'UNREAD';
type ProjectStatus = 'FAVORITE' | 'UNFAVORITE';
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

interface MeetingResponse {
  meetingId: string;
  meetingTopic: string;
  meetingDate: string;
  meetingLocation: string;
  meetingProjectId: string;
}

interface ProjectResponse {
  projectId: string;
  projectName: string;
  projectDescription: string;
  projectDeadline: Date;
  projectFav: ProjectStatus;
  projectOwner: MemberResponse;
  projectImg: string;
}

interface TaskResponse {
  taskId: string;
  taskName: string;
  taskDetail: string;
  taskDueDate: string;
  taskStatus: TaskStatus;
  taskProjectId: string;
  taskComments: CommentResponse[];
  taskParticipants: MemberResponse[];
}

interface MemberResponse {
  memberId: string;
  memberName: string;
  memberEmail: string;
  username: string;
}

interface CommentResponse {
  commentId: string;
  commentTaskId: string;
  commentContent: string;
  commentPostTime: string;
  commentMemberId: string;
}

interface NotificationResponse {
  notificationId: string;
  notificationTime: string;
  notificationStatus: NotificationStatus;
  type: NotificationType;
  project?: ProjectResponse;
  task?: TaskResponse;
  meeting?: MeetingResponse;
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
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
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
          ? { ...notification, notificationStatus: 'READ' }
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

  const formatMeetingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatProjectId = (uuid: string): string => {
    // Remove hyphens and take first 32 characters
    const hexString = uuid.replace(/-/g, '').slice(0, 32);
    return `0x${hexString}`;
  };

  const getNotificationHref = (notification: NotificationResponse) => {
    switch (notification.type) {
      case 'PROJECT':
        return notification.project 
          ? `/project-board/${formatProjectId(notification.project.projectId)}` 
          : '#';
      case 'TASK':
        return notification.task 
          ? `/project-board/${formatProjectId(notification.task.taskProjectId)}?task=${notification.task.taskId}` 
          : '#';
      case 'MEETING':
        return notification.meeting 
          ? `/project-board/${formatProjectId(notification.meeting.meetingProjectId)}?meeting=${notification.meeting.meetingId}` 
          : '#';
      default:
        return '#';
    }
  };

  const getNotificationContent = (notification: NotificationResponse) => {
    switch (notification.type) {
      case 'PROJECT':
        return {
          title: notification.project?.projectName || '',
          action: 'invites you to the project',
          detail: notification.project?.projectDescription || ''
        };
      case 'TASK':
        return {
          title: notification.task?.taskName || '',
          action: 'has assigned you to the task',
          detail: notification.task?.taskDetail || ''
        };
      case 'MEETING':
        return {
          title: notification.meeting?.meetingTopic || '',
          action: 'has scheduled a meeting',
          detail: `at ${notification.meeting?.meetingLocation || ''} on ${notification.meeting?.meetingDate ? formatMeetingDate(notification.meeting.meetingDate) : ''}`
        };
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
            notifications.map((notification) => {
              const content = getNotificationContent(notification);
              return (
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
                        <span className="font-medium">
                          {content.action}
                        </span>
                        {' '}
                        <span className="font-medium">
                          {content.title}
                        </span>
                      </p>
                      {content.detail && (
                        <p className="text-sm text-gray-600 mt-1">
                          {content.detail}
                        </p>
                      )}
                      <p className={`mt-1 text-xs ${
                        notification.notificationStatus === 'UNREAD'
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}>
                        {formatTime(notification.notificationTime)}
                      </p>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverPanel>
    </Popover>
  );
};

export default NotificationComponent;