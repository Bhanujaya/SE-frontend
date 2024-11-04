"use client";

import Link from "next/link";
import TaskContainer from "./components/TaskContainer";
import MemberContainer from "./components/MemberContainer";
import MeetingContainer from "./components/MeetingContainer";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ActivityLogPopup from "./components/ActivityLogPopup";
import AddTaskPopup from "./components/AddTaskPopup";
// import jwtDecode from "jwt-decode"; // Use default import for jwt-decode


// ------------- Mock data --------------

// const currentUser = {
//   name: "Nichakann",
//   // More attribute...
// };
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

// interface Project {
//   project: ProjectDetail;
//   tasks: Task[];
//   assigns: Assign[];
//   meetings: Meeting[];
//   logs: Log[];
// }

interface Project {
  project: ProjectDetail;
  tasks: any[];
  assigns: any[];
  meetings: any[];
  logs: any[];
}

// const projects = [
//   {
//     id: "1",
//     projectName: "Project Name",
//     creator: "Pleang",
//     endDate: "12/02/24",
//     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
//     imageUrl:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs1xdLImF96hHZqmsAN66doFwYen9ZDW3Fbw&usqp=CAU",
//     isFavorited: false,
//     // More attribute...
//   },
// ];

// -----------------------------------------
export default function ProjectLayout({ params }: { params: { projectId: string } }) {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const { projectId } = params;
  
  const router = useRouter();
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [isActivityPopupVisible, setIsActivityPopupVisible] = useState(false);
  const [isTaskPopupVisible, setIsTaskPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleToggleDeletePopup = () => setIsDeletePopupVisible(!isDeletePopupVisible);
  const handleToggleActivityPopup = () => setIsActivityPopupVisible(!isActivityPopupVisible);
  const handleToggleTaskPopup = () => setIsTaskPopupVisible(!isTaskPopupVisible);

  const handleDeleteProject = () => {
    console.log("Project deleted");
    router.push("/project-board");
  };

  const handleAddTask = (taskName: string, taskDescription: string) => {
    console.log("Task Added:", taskName, taskDescription);
  };

  // Fetch the current project data using the JWT token
  useEffect(() => {
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

      const fetchData = async () => {
        try {

          // GET url for project details
          // @ i = projectId, m = memberId
          // @GetMapping("/project-board")
          
          // รอหน้า project-board ส่ง projectId มาหน้านี้
          const projectIdtest = "6292753c-273d-4d53-a0d7-f4e0b377260e"  // dynamic projectId later

          const response = await fetch(
            `http://localhost:9000/project-detail?i=${projectIdtest}&m=${member.memberId}`,
            {
              method: "GET",
              headers: {
                'Authorization': `Bearer ${member.token}`,
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
      };

      fetchData();
    } catch (error) {
      console.error("Invalid JWT token:", error);
      router.push("/login");
    }
  }, [projectId, router]);

  useEffect(() => {
    const handleDeleteClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
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

  return (
    <>
      {/* Header of Project page*/}
      <div className="flex px-2 items-center justify-between bg-white">
        <div className="flex items-center justify-between text-xl">
          <Link href="/project-board" className="hover:bg-gray-100 px-2 rounded-md text-gray-400 font-light">
            Project
          </Link>
          /
          <span className="flex ml-1 p-1 font-medium">
            <img src="/project-recent.svg" alt="Project" className="mr-2" />
            {currentProject?.project.projectName}
          </span>
        </div>

        <div className="flex items-center justify-between gap-x-4">
          <button className="text-white font-medium px-4 py-1 bg-customPurple hover:bg-[#8182d1] rounded-md" onClick={handleToggleTaskPopup}>
            Add Task
          </button>
          <button className="p-1 hover:bg-gray-100 rounded-md" onClick={handleToggleActivityPopup}>
            <img src="/activity.svg" alt="Activity" />
          </button>
          <button onClick={handleToggleDeletePopup} className="flex items-center p-1 hover:bg-gray-100 rounded-md ml-2">
            <img src="/remove_red.svg" alt="Setting" />
            <p className="mt-[2px] text-xs text-red-400">Delete project</p>
          </button>
        </div>
      </div>

      {isDeletePopupVisible && (
        <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsDeletePopupVisible(false)} />
      )}

      {isDeletePopupVisible && (
        <div ref={popupRef} className="absolute bg-white border rounded-lg shadow-lg p-4 z-50" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <p className="mb-2">Are you sure you want to delete this project?</p>
          <button onClick={handleDeleteProject} className="text-red-600 font-semibold hover:bg-red-100 rounded p-1">
            Delete
          </button>
          <button onClick={() => setIsDeletePopupVisible(false)} className="text-gray-500 hover:bg-gray-100 rounded p-1 ml-2">
            Cancel
          </button>
        </div>
      )}

      <ActivityLogPopup isVisible={isActivityPopupVisible} onClose={() => setIsActivityPopupVisible(false)} />

      <div className="mx-0 max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-8">
        <div className="lg:col-span-2 max-h-[320px]">
          <TaskContainer currentProject={currentProject} />
        </div>

        <div className="bg-white p-6 h-[320px] flex flex-col">
          <MemberContainer currentProject={currentProject} />
        </div>

        <div className="bg-white p-6 h-[320px] flex flex-col">
          <MeetingContainer currentProject={currentProject} />
        </div>

        <AddTaskPopup isVisible={isTaskPopupVisible} onClose={() => setIsTaskPopupVisible(false)} onAddTask={handleAddTask} />
      </div>
    </>
  );
}