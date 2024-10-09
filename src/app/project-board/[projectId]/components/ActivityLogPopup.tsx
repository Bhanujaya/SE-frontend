import { useRef, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";
import { format } from "date-fns";

export type ActivityLog = {
  id: string;
  time: Date;
  detail: string;
  projectId: string;
  taskId: string;
  meetingId: string;
  userId: string;
};

export type Member = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage: string;
  projectIds: string[];
};

export type Task = {
  id: string;
  name: string;
  assignee: string[];
  dueDate: string;
  status: "To Do" | "In Progress" | "Done";
  comments: { name: string; text: string; time: string }[];
  href: string;
  projectId: string;
};

interface ActivityLogPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

// Mock activity Logs data
const activityLogsData: ActivityLog[] = [
  {
    id: "1",
    time: new Date("2024-01-09T09:00:00Z"), // Date object
    detail: "Create Project",
    projectId: "1",
    taskId: "4",
    meetingId: "-",
    userId: "2",
  },
  {
    id: "2",
    time: new Date("2024-03-09T06:00:00Z"),
    detail: "Add",
    projectId: "1",
    taskId: "1",
    meetingId: "-",
    userId: "1",
  },
  {
    id: "3",
    time: new Date("2024-10-09T00:00:00Z"),
    detail: "Add",
    projectId: "1",
    taskId: "2",
    meetingId: "-",
    userId: "1",
  },
  {
    id: "4",
    time: new Date("2024-10-09T02:00:00Z"),
    detail: "Delete",
    projectId: "1",
    taskId: "2",
    meetingId: "-",
    userId: "1",
  },
  
];

// Mock users data
const usersData: Member[] = [
  {
    id: "1",
    username: "_pleang",
    firstName: "Pleang",
    lastName: "Nernngam",
    email: "lingnoi@kiki.com",
    role: "Owner",
    profileImage: "/profile.svg",
    projectIds: ["1", "2"],
  },
  {
    id: "2",
    username: "soodlhor",
    firstName: "Song",
    lastName: "Kang",
    email: "soodlhor@mak.com",
    role: "Member",
    profileImage: "/profile.svg",
    projectIds: ["1", "3"],
  },
];

// Mock tasks data
const tasksData: Task[] = [
  {
    id: "1",
    name: "Design homepage",
    assignee: ["John Cena"],
    dueDate: "2024-10-05",
    status: "In Progress",
    comments: [
      {
        name: "Nichakann Nernngam",
        text: "Work on the hero section",
        time: "2024-09-30 14:23",
      },
    ],
    href: "#",
    projectId: "1",
  },
  {
    id: "2",
    name: "Fix bugs in the homepage",
    assignee: ["Song Kang"],
    dueDate: "2024-10-01",
    status: "To Do",
    comments: [
      {
        name: "Nichakann Nernngam",
        text: "Check form validation",
        time: "2024-09-25 13:33",
      },
      {
        name: "John Cena",
        text: "Nice",
        time: "2024-09-30 16:44",
      },
    ],
    href: "#",
    projectId: "1",
  },
];

export default function ActivityPopup({
  isVisible,
  onClose,
}: ActivityLogPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-40"
        onClick={onClose}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className="absolute bg-white border rounded shadow-lg p-4 z-50 w-[800px] h-[400px]"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="mb-2 font-semibold">ACTIVITY LOG</p>
          <button
            onClick={onClose}
            className="hover:bg-gray-100 rounded p-1 ml-2"
          >
            <TfiClose className="w-4 h-4 text-gray-800" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="max-h-72 overflow-y-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left font-normal w-1/4 min-w-[220px]">
                    Date/Time
                  </th>
                  <th className="text-left font-normal w-1/4 min-w-[162px]">
                    User
                  </th>
                  <th className="text-left font-normal w-1/2 min-w-[146px]">
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {activityLogsData
                  .sort((a, b) => b.time.getTime() - a.time.getTime())
                  .map((log: ActivityLog) => {
                    // Find the user with user.id === log.userId
                    const user = usersData.find(
                      (user) => user.id === log.userId
                    );

                    // Find the task with task.id === log.taskId
                    const task = tasksData.find(
                      (task) => task.id === log.taskId
                    );

                    return (
                      <tr key={log.id} className="text-sm border-b hover:bg-gray-100">
                        <td className="min-w-[220px]">
                          <img
                            src="/laptop.svg"
                            alt="Activity Icon"
                            className="mr-2 inline-block"
                          />
                          {format(new Date(log.time), "MM/dd/yyyy HH:mm:ss")}
                        </td>
                        <td className="min-w-[162px]">
                          {user
                            ? `${user.firstName} ${user.lastName}`
                            : "Unknown User"}{" "}
                        </td>
                        <td className="min-w-[146px]">
                          {log.detail === "Delete" ? (
                            <img
                              src="/remove.svg"
                              alt="Remove Icon"
                              className="inline-block"
                            />
                          ) : log.detail === "Add" ? (
                            <img
                              src="/add.svg"
                              alt="Add Icon"
                              className="inline-block"
                            />
                          ) : null}
                          {log.detail}{" "}
                          <span className="font-semibold">
                            {task ? `${task.name}` : null}{" "}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
