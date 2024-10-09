"use client";

import Link from "next/link";
import TaskContainer from "./components/TaskContainer";
import MemberContainer from "./components/MemberContainer";
import MeetingContainer from "./components/MeetingContainer";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ActivityLogPopup from "./components/ActivityLogPopup";
import AddTaskPopup from "./components/AddTaskPopup";

// ------------- Mock data --------------

const currentUser = {
  name: "Nichakann",
  // More attribute...
};

const projects = [
  {
    id: "1",
    projectName: "Project Name",
    creator: "Pleang",
    endDate: "12/02/24",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs1xdLImF96hHZqmsAN66doFwYen9ZDW3Fbw&usqp=CAU",
    isFavorited: false,
    // More attribute...
  },
];

// -----------------------------------------

export default function ProjectLayout({
  params,
}: {
  params: { projectId: string };
}) {

  const { projectId } = params;
  const project = projects.find((project) => project.id === projectId);
  
  if (!project) {
    return <p>Project not found</p>;
  }
  
  const router = useRouter();
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
  const [isActivityPopupVisible, setIsActivityPopupVisible] = useState(false);
  // add task
  const [isTaskPopupVisible, setIsTaskPopupVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleToggleDeletePopup = () => {
    setIsDeletePopupVisible(!isDeletePopupVisible);
  };

  const handleToggleActivityPopup = () => {
    setIsActivityPopupVisible(!isActivityPopupVisible);
  };

  const handleDeleteProject = () => {
    console.log("Project deleted");
    router.push("/project-board");
  };

  // add task
  const handleAddTask = (taskName: string, taskDescription: string) => {
    console.log("Task Added:", taskName, taskDescription);
    // Logic to add the task to the project goes here
  };

  const handleToggleTaskPopup = () => {
  setIsTaskPopupVisible(!isTaskPopupVisible);
  };


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

  return (
    <>
      {/* Header of Project page*/}
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
            <img src="/project-recent.svg" alt="Project" className="mr-2" />{" "}
            {project.projectName} {projectId}
          </span>
        </div>

        <div className="flex items-center justify-between gap-x-4">
          {/* Add Task button (on the header) */}
          <button className="text-white font-medium px-4 py-1 bg-customPurple hover:bg-[#8182d1] rounded-md"
          onClick={handleToggleTaskPopup}>
            Add Task
          </button>

          {/* Activity button */}
          <button
            className="p-1 hover:bg-gray-100 rounded-md"
            onClick={handleToggleActivityPopup}
          >
            <img src="/activity.svg" alt="Activity" />
          </button>

          {/* Delete Project button */}
          <button
            onClick={handleToggleDeletePopup}
            className="flex items-center p-1 hover:bg-gray-100 rounded-md ml-2"
          >
            <img src="/remove_red.svg" alt="Setting" />
            <p className="mt-[2px] text-xs text-red-400">Delete project</p>
          </button>
        </div>
      </div>

      {/* Add backdrop opacity 50% when display Delete Popup */}
      {isDeletePopupVisible && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsDeletePopupVisible(false)}
        />
      )}

      {/* Delete Confirmation Popup */}
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

      {/* Activity Popup */}
      <ActivityLogPopup
        isVisible={isActivityPopupVisible}
        onClose={() => setIsActivityPopupVisible(false)}
      />

      {/* Body */}
      <div className="mx-0 max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-8">
        {/* Task block */}
        <div className="lg:col-span-2 max-h-[320px]">
          <TaskContainer projectId={projectId} />
        </div>

        {/* Member block */}
        <div className="bg-white p-6 h-[320px] flex flex-col">
          <MemberContainer projectId={projectId} />
        </div>

        {/* Meeting block */}
        <div className="bg-white p-6 h-[320px] flex flex-col">
          <MeetingContainer projectId={projectId} />
        </div>

        {/* Add Task Popup */}
        <AddTaskPopup
          isVisible={isTaskPopupVisible}
          onClose={() => setIsTaskPopupVisible(false)}
          onAddTask={handleAddTask}
        />
      </div>
    </>
  );
}
