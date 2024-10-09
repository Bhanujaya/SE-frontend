"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import CommentModal from "./CommentModal";

export type Task = {
  id: string;
  name: string;
  assignee: string[];
  dueDate: string;
  status: "To Do" | "In Progress" | "Done";
  comments: { name: string; text: string; time: string }[];
  href: string;
  projectId: string;
}

// ------------------ Mock data ------------------

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
  {
    id: "3",
    name: "Create header",
    assignee: ["Song Kang"],
    dueDate: "2024-10-01",
    status: "Done",
    comments: [],
    href: "#",
    projectId: "1",
  },
];

// -----------------------------------------------

export default function TaskContainer({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Filter tasks based on projectId
    const filteredTasks = tasksData.filter(
      (task) => task.projectId === projectId
    );
    setTasks(filteredTasks);
  }, [projectId]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTaskForDelete, setSelectedTaskForDelete] =
    useState<Task | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [deleteModalPosition, setDeleteModalPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  {
    /* Handle Comment Modal */
  }
  const handleOpenCommentModal = (task: Task, event: React.MouseEvent) => {
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    setSelectedTask(task);
    setModalPosition({
      top: buttonRect.bottom,
      left: buttonRect.left,
    });

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  };

  const handleCloseCommentModal = () => {
    setSelectedTask(null);
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
  };

  const handleSendComment = (newComment: {
    name: string;
    text: string;
    time: string;
  }) => {
    if (selectedTask) {
      const updatedTasks = tasks.map((task) =>
        task.name === selectedTask.name
          ? { ...task, comments: [...task.comments, newComment] }
          : task
      );
      setSelectedTask({
        ...selectedTask,
        comments: [...selectedTask.comments, newComment],
      });
    }
  };

  const handleOpenDeleteModal = (task: Task, event: React.MouseEvent) => {
    const buttonRect = (event.target as HTMLElement).getBoundingClientRect();
    setSelectedTaskForDelete(task);
    setDeleteModalPosition({
      top: buttonRect.bottom,
      left: buttonRect.left,
    });

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
  };

  const handleCloseDeleteModal = () => {
    setSelectedTaskForDelete(null);
    document.body.style.overflow = "auto";
    document.body.style.paddingRight = "0px";
  };

  // Update the task list by removing the selected task
  const handleDeleteTask = () => {
    if (selectedTaskForDelete) {
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.name !== selectedTaskForDelete.name)
      );
      handleCloseDeleteModal();
    }
  };

  return (
    <>
      <div className="relative bg-white rounded-lg py-4 pr-24 pl-12 lg:col-span-2">
        <div className="relative overflow-x-auto overflow-y-auto max-h-[320px]">
          <table className="min-w-full table-auto bg-white rounded-lg">
            <thead>
              <tr className="bg-transparent text-sm text-gray-400">
                <th className="p-3 text-left font-normal sticky left-0 bg-white z-10 min-w-[200px]">
                  Name
                </th>
                <th className="p-3 text-left font-normal min-w-[146px]">
                  Assignee
                </th>
                <th className="p-3 text-left font-normal min-w-[120px]">
                  Due Date
                </th>
                <th className="p-3 text-left font-normal min-w-[146px]">
                  Status
                </th>
                <th className="p-3 text-left font-normal min-w-[120px]">
                  Comment
                </th>
                <th className="p-3 text-left font-normal min-w-[120px]"></th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 group border-b border-gray-300 items-center text-sm"
                >
                  {/* Name column */}

                  <td className="flex sticky left-0 bg-white z-10 group-hover:bg-gray-100 min-w-[200px] font-semibold">
                    <Link
                      href={task.href}
                      className="p-4 flex items-center w-full"
                    >
                      <img
                        src="/task.svg"
                        alt="Task"
                        className="min-w-min min-h-min mr-2"
                      />

                      {task.name}
                    </Link>
                  </td>

                  <td className="p-3">{task.assignee}</td>
                  <td className="p-3">{task.dueDate}</td>
                  <td className="p-3">
                    <span
                      className={`flex max-w-fit items-center px-3 py-1 rounded-full text-sm gap-x-2 font-semibold text-white ${
                        task.status === "Done"
                          ? "bg-green-400"
                          : task.status === "In Progress"
                          ? "bg-blue-400"
                          : "bg-orange-400"
                      } whitespace-nowrap`}
                    >
                      <img src="/todo.svg" alt="Status" />
                      {task.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-4">
                      {/* Comment Button */}
                      <button
                        className="flex gap-x-2 text-gray-500 hover:ring-gray-200 hover-ring-1"
                        onClick={(e) => handleOpenCommentModal(task, e)}
                      >
                        <img src="/comment.svg" alt="Comment" />
                        {task.comments.length > 0 && (
                          <span>{task.comments.length}</span>
                        )}
                      </button>
                    </div>
                  </td>
                  {/* Ellipsis Button for Delete */}
                  <td className="p-0 items-center justify-center text-right">
                    <button
                      className="text-gray-500 w-6 h-6 mr-4"
                      onClick={(e) => handleOpenDeleteModal(task, e)}
                    >
                      <img src="/ellipsis.svg" alt="More options" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Add Task Button Row */}
              <tr className="text-sm">
                <td colSpan={6}>
                  <button
                    className="w-full flex items-center justify-left p-2 bg-transparent text-gray-400 hover:bg-gray-100"
                    // onClick={handleAddTask} // Uncomment and implement this function later
                  >
                    <div className="flex items-center ml-2">
                      <span className="text-2xl font-light pb-1 mr-2">+</span>{" "}
                      Add Task
                    </div>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Backdrop and Comment Modal */}
        {selectedTask && (
          <>
            <div
              className="fixed inset-0 bg-transparent z-40"
              onClick={handleCloseCommentModal}
            ></div>

            <CommentModal
              taskName={selectedTask.name}
              comments={selectedTask.comments}
              onClose={handleCloseCommentModal}
              onSendComment={handleSendComment}
              position={{
                top: modalPosition.top - 128,
                left: modalPosition.left - 640,
              }}
            />
          </>
        )}

        {selectedTaskForDelete && (
          <>
            <div
              className="fixed inset-0 bg-transparent z-40"
              onClick={handleCloseDeleteModal}
            ></div>

            <div
              className="fixed z-50 bg-white shadow-lg items-center hover:bg-gray-100 ring-1 ring-gray-200 rounded-md"
              style={{
                top: deleteModalPosition.top,
                left: deleteModalPosition.left,
              }}
            >
              <button
                className="text-red-400 flex items-center p-2 mr-1"
                onClick={handleDeleteTask}
              >
                <img src="/remove_red.svg" alt="Remove" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
