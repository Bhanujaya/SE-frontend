"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import CommentModal from "./CommentModal";
import AddTaskPopup from "./AddTaskPopup";
import TaskDetailsPopup from './TaskDetailsPopup'


interface Task {
  taskId: string;
  taskName: string;
  taskDetail: string;
  taskStatus: string;
  taskProjectId: string;
  taskComments: any[]; // Adjust type as needed
  taskParticipants: Member[]; // Adjust type as needed
  taskDueDate: string;
}

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

interface Project {
  project: ProjectDetail;
  tasks: any[];
  assigns: any[];
  meetings: any[];
  logs: any[];

}

interface TaskContainerProps {
  currentProject: Project | null;
}

// -----------------------------------------------

export default function TaskContainer({ currentProject }: TaskContainerProps) {
  const [tasks, setTasks] = useState<Task[]>(currentProject?.tasks || []);
  const [isTaskPopupVisible, setIsTaskPopupVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Store selected task for popup
  const [selectedTaskForDelete, setSelectedTaskForDelete] = useState<Task | null>(null);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<Task | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  
  const projectId = currentProject?.project.projectId;

  useEffect(() => {
    
    // Filter tasks based on projectId
    if (currentProject) {
      // console.log('currentProject in TaskContainer:', currentProject)
      // const tasks = currentProject.tasks;
      // console.log('tasks', tasks)
      
      console.log('tasks in current project: ', currentProject.tasks)
      const currentTasks = currentProject.tasks; 
      setTasks(currentTasks);
      // console.log('currentProject:', currentProject)

      console.log('currentTasks after setTasks:', currentTasks)
      console.log('tasks after setTasks:', tasks)


    } 

    
  }, [currentProject]);

  
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number; }>({ top: 0, left: 0 });
  const [deleteModalPosition, setDeleteModalPosition] = useState<{ top: number; left: number; }>({ top: 0, left: 0 });
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
        task.taskName === selectedTask.taskName
          ? { ...task, comments: [...task.taskComments, newComment] }
          : task
      );
      setSelectedTask({
        ...selectedTask,
        taskComments: [...selectedTask.taskComments, newComment],
      });
    }
  };


  // Function to call the delete endpoint
  const deleteTask = async (projectId: string, taskId: string) => {
    
    // handle token
    const tokenData = localStorage.getItem("jwt");
    const parsedTokenData = tokenData ? JSON.parse(tokenData) : null;
    const token = parsedTokenData ? parsedTokenData.token : "";
    console.log('token for delete:', token)

    if (!token) {
      console.error("Token not found");

      return;
    }

    // const taskData = {
    //   projectId: currentProject?.project.projectId,
    //   taskId: selectedTaskForDelete?.taskId,
      
    // };

    // console.log('taskData', taskData)
    
    try {
      const response = await fetch(`http://localhost:9000/task/delete?p=${projectId}&t=${taskId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token for authorization
        },
        // body: JSON.stringify(taskData)
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Task deleted:", responseData);
        setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
        // setSelectedTaskForDelete(null);
        handleCloseDeleteModal()
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Update the task list by removing the selected task
  const handleDeleteTask = () => {
    if (selectedTaskForDelete && currentProject) {
      // setTasks((prevTasks) =>
      //   prevTasks.filter((task) => task.taskName !== selectedTaskForDelete.taskName)
      // );

      deleteTask(currentProject.project.projectId, selectedTaskForDelete.taskId);
      // console.log('id:', currentProject.project.projectId, selectedTaskForDelete.taskId)

      handleCloseDeleteModal();
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


    // add task
  const handleAddTask = (taskName: string, taskDescription: string) => {
    console.log("Task Added:", taskName, taskDescription);
    // Logic to add the task to the project goes here
  };

  // add task  
  const handleToggleTaskPopup = () => {
    setIsTaskPopupVisible(!isTaskPopupVisible);
  };

  const handleOpenTaskDetails = (task: Task) => {
    setSelectedTaskForDetails(task);
  };
  
  // const handleCloseTaskDetails = () => {
  //   setSelectedTaskForDetails(null);
  // };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.taskId === updatedTask.taskId ? updatedTask : task))
    );
    setSelectedTaskForDetails(null);
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
                  // onClick={() => handleOpenTaskDetails(task)}
                >
                  {/* Name column */}
                  <td
                    className="flex sticky left-0 bg-white z-10 group-hover:bg-gray-100 min-w-[200px] font-semibold"
                    onClick={() => handleOpenTaskDetails(task)}
                  >
                    
                    <div className="p-4 flex items-center w-full">
                      <img src="/task.svg" alt="Task" className="min-w-min min-h-min mr-2" />
                      {task.taskName}
                    </div>
                  </td>

                  {/* Assignee */}
                  <td className="p-3">
                    <div className="flex items-center">
                      {task.taskParticipants &&
                        task.taskParticipants.slice(0, 3).map((participant) => (
                          <img
                            key={participant.memberId}
                            src={
                              participant.detail && participant.detail.img
                                ? participant.detail.img
                                : "https://via.placeholder.com/40"
                            }
                            alt={
                              participant.detail
                                ? `${participant.detail.memberName}'s profile`
                                : "Participant profile"
                            }
                            className="w-6 h-6 rounded-full mr-1"
                          />
                        ))}
                      {task.taskParticipants && task.taskParticipants.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-300 text-xs text-gray-700 flex items-center justify-center">
                          +{task.taskParticipants.length - 3}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Due Date */}
                  <td className="p-3">{new Date(task.taskDueDate).toLocaleDateString("en-TH")}</td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`flex max-w-fit items-center px-3 py-1 rounded-full text-sm gap-x-2 font-semibold text-white ${
                        task.taskStatus === "DONE" ? "bg-green-400" : task.taskStatus === "PROGRESS" ? "bg-blue-400" : "bg-orange-400"
                      } whitespace-nowrap`}
                    >
                      <img src="/todo.svg" alt="Status" />
                      {task.taskStatus}
                    </span>
                  </td>

                  {/* Comments */}
                  <td className="p-3">
                    <div className="flex gap-4">
                      <button
                        className="flex gap-x-2 text-gray-500 hover:ring-gray-200 hover:ring-1"
                        onClick={(e) => handleOpenCommentModal(task, e)}
                      >
                        <img src="/comment.svg" alt="Comment" />
                        {task.taskComments.length > 0 && <span>{task.taskComments.length}</span>}
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
                    onClick={handleToggleTaskPopup}
                  >
                    <div className="flex items-center ml-2">
                      <span className="text-2xl font-light pb-1 mr-2">+</span> Add Task
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
              taskName={selectedTask.taskName}
              comments={selectedTask.taskComments}
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

      {/* Task Details Popup */}
      {selectedTaskForDetails && (
        <TaskDetailsPopup
          currentProject={currentProject}
          task={selectedTaskForDetails}
          isVisible={true}
          onClose={() => setSelectedTaskForDetails(null)}
          onSaveTask={handleUpdateTask}
        />
      )}

      {/* Add Task Popup */}
      <AddTaskPopup
        // projectId={projectId}
        isVisible={isTaskPopupVisible}
        onClose={() => setIsTaskPopupVisible(false)}
        onAddTask={handleAddTask}
      />
    </>
  );
}
