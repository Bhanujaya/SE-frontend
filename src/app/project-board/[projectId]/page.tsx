// project-board/[projectId]/page.tsx

"use client";

import Link from "next/link";
import TaskContainer from "./components/TaskContainer";
import MemberContainer from "./components/MemberContainer";
import MeetingContainer from "./components/MeetingContainer";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ActivityLogPopup from "./components/ActivityLogPopup";
import AddTaskPopup from "./components/AddTaskPopup";

interface MemberDetail {
  memberEmail: string;
  memberName: string;
  memberLastname: string;
  username: string;
  img: string | null;
}

interface Member {
  memberId: string;
  detail: MemberDetail;
}

interface ProjectDetail {
  projectId: string;
  projectName: string;
  projectDescription: string;
  projectDeadline: string;
  projectFav: string;
  projectOwner: Member;
  projectImg: string;
}

interface Task {
  taskId: string;
  taskName: string;
  taskDetail: string;
  taskStatus: string;
  taskProjectId: string;
  taskComments: any[];
  taskParticipants: Member[];
  taskDueDate: string;
}

interface Project {
  project: ProjectDetail;
  tasks: Task[];
  assigns: any[];
  meetings: any[];
  logs: any[];
}

export default function ProjectLayout({
  params,
}: {
  params: { projectId: string };
}) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const router = useRouter();
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [isActivityPopupVisible, setIsActivityPopupVisible] = useState(false);
  const [isAddTaskPopupVisible, setIsAddTaskPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleToggleDeletePopup = () =>
    setIsDeletePopupVisible(!isDeletePopupVisible);
  const handleToggleActivityPopup = () =>
    setIsActivityPopupVisible(!isActivityPopupVisible);

  const handleDeleteProject = () => {
    console.log("Project deleted");
    router.push("/project-board");
  };

  function parseProjectId(formattedId: string): string {
    // Remove '0x' prefix
    if (!formattedId.startsWith("0x")) {
      throw new Error("Invalid project ID format");
    }
    const idWithoutPrefix = formattedId.slice(2);

    // Ensure it is 32 characters
    if (idWithoutPrefix.length !== 32) {
      throw new Error("Invalid project ID length");
    }

    // Insert hyphens at positions 8, 12, 16, 20
    const idWithHyphens = `${idWithoutPrefix.slice(
      0,
      8
    )}-${idWithoutPrefix.slice(8, 12)}-${idWithoutPrefix.slice(
      12,
      16
    )}-${idWithoutPrefix.slice(16, 20)}-${idWithoutPrefix.slice(20)}`;
    return idWithHyphens;
  }

  // Function to fetch project data
  const fetchProjectData = async () => {
    const userData = localStorage.getItem("jwt");
    if (!userData) {
      console.warn("No token found. Redirecting to login.");
      router.push("/login");
      return;
    }

    try {
      const member = JSON.parse(userData) as {
        token: string;
        memberId: string;
      };

      if (!member.token) {
        console.warn("No token found. Redirecting to login.");
        router.push("/login");
        return;
      }

      const parsedProjectId = parseProjectId(params.projectId);

      console.log("parsedProjectId", parsedProjectId);

      try {
        const response = await fetch(
          `http://localhost:9000/project-detail?i=${parsedProjectId}&m=${member.memberId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${member.token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const data: Project = await response.json();
        setCurrentProject(data);
        console.log("Fetched project data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } catch (error) {
      console.error("Invalid JWT token:", error);
      router.push("/login");
    }
  };

  // Fetch project data on component mount and when projectId changes
  useEffect(() => {
    fetchProjectData();
  }, [params.projectId]);

  useEffect(() => {
    const handleDeleteClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsDeletePopupVisible(false);
      }
    };

    if (isDeletePopupVisible) {
      document.addEventListener("mousedown", handleDeleteClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleDeleteClickOutside);
    };
  }, [isDeletePopupVisible]);

  const handleAddTask = () => {
    setIsAddTaskPopupVisible(true);
  };

  const handleCloseAddTaskPopup = () => {
    setIsAddTaskPopupVisible(false);
  };

  const handleTaskAdded = () => {
    setIsAddTaskPopupVisible(false);
    fetchProjectData(); // Refresh project data to include the new task
  };

  const projectId = currentProject?.project.projectId;

  return (
    <>
      {/* Header of Project page */}
      <div className="flex px-2 items-center justify-between bg-white">
        <div className="flex items-center justify-between text-xl">
          <Link
            href="/project-board"
            className="hover:bg-gray-100 px-2 rounded-md text-gray-400 font-light"
          >
            Project
          </Link>
          /
          <span className="flex ml-1 p-1 font-medium">
            <img src="/project-recent.svg" alt="Project" className="mr-2" />
            {currentProject?.project.projectName}
          </span>
        </div>

        <div className="flex items-center justify-between gap-x-4">
          {/* Add Task Button */}
          <button
            className="flex items-center text-white bg-customPurple rounded-md py-2 px-3 ring-1 ring-gray-200 hover:bg-[#8d91fb] text-sm"
            onClick={handleAddTask}
          >
            Add Task
          </button>

          {/* Activity Log Button */}
          <button
            className="p-1 hover:bg-gray-100 rounded-md"
            onClick={handleToggleActivityPopup}
          >
            <img src="/activity.svg" alt="Activity" />
          </button>
        </div>
      </div>

      {isDeletePopupVisible && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsDeletePopupVisible(false)}
        />
      )}

      {isDeletePopupVisible && (
        <div
          ref={popupRef}
          className="absolute bg-white border rounded-lg shadow-lg p-4 z-50"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <p className="mb-2">Are you sure you want to delete this project?</p>
          <button
            onClick={handleDeleteProject}
            className="text-red-600 font-semibold hover:bg-red-100 rounded p-1"
          >
            Delete
          </button>
          <button
            onClick={() => setIsDeletePopupVisible(false)}
            className="text-gray-500 hover:bg-gray-100 rounded p-1 ml-2"
          >
            Cancel
          </button>
        </div>
      )}

      <ActivityLogPopup
        projectId={currentProject?.project?.projectId || ''}
        isOpen={isActivityPopupVisible}
        onClose={() => setIsActivityPopupVisible(false)}
        projectName="ProjectName"
      />

      <div className="mx-0 max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-8">
        <div className="lg:col-span-2 max-h-[320px]">
          <TaskContainer currentProject={currentProject} />
        </div>

        <div className="bg-white p-6 h-[320px] flex flex-col">
          <MemberContainer
            currentProject={currentProject}
            onProjectDataChange={fetchProjectData}
          />
        </div>

        <div className="bg-white p-6 h-[320px] flex flex-col">
          <MeetingContainer
            currentProject={currentProject}
            onProjectDataChange={fetchProjectData}
          />
        </div>
      </div>

      {/* Add Task Popup */}
      {projectId && (
        <AddTaskPopup
          projectId={projectId}
          isVisible={isAddTaskPopupVisible}
          onClose={handleCloseAddTaskPopup}
          onAddTask={handleTaskAdded}
        />
      )}
    </>
  );
}
