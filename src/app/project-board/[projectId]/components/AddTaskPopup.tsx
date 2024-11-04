// AddTaskPopup.tsx

"use client";

import { useState } from "react";
import { TfiClose } from "react-icons/tfi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";

interface AddTaskPopupProps {
  projectId: string;
  isVisible: boolean;
  onClose: () => void;
  onAddTask: (newTask: Task) => void;
}

interface Comment {
  name: string;
  text: string;
  time: string;
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

const AddTaskPopup = ({
  projectId,
  isVisible,
  onClose,
  onAddTask,
}: AddTaskPopupProps) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("TODO");
  const [imgSrc, setImgSrc] = useState("/undo.svg");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [errors, setErrors] = useState({
    taskName: "",
    taskStatus: "",
    selectedDate: "",
  });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle token
    const tokenData = localStorage.getItem("jwt");
    const parsedTokenData = tokenData ? JSON.parse(tokenData) : null;
    const token = parsedTokenData ? parsedTokenData.token : "";

    if (!token) {
      console.error("Token not found");
      return;
    }

    if (!taskName) {
      setErrors({ ...errors, taskName: "Task name required!" });
      return; // Don't proceed if there are errors
    } else {
      setErrors({ ...errors, taskName: "" }); // Clear errors if the task name is valid
    }

    const taskData = {
      taskName: taskName,
      taskDetail: taskDescription,
      taskDueDate: selectedDate ? selectedDate.toISOString() : null, // Format the date to ISO string
      taskProjectId: projectId, // Use projectId from props
      taskOwnerId: parsedTokenData.memberId, // Set the task owner ID correctly
    };

    try {
      console.log("Token being sent:", token);
      const response = await fetch("http://localhost:9000/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token if needed
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const responseData: Task = await response.json();
        console.log("Task created successfully:", responseData);
        onAddTask(responseData); // Pass the new task data back to parent
        handleClose(); // Reset form and close popup
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error("Failed to create task:", errorData);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleClose = () => {
    setTaskName("");
    setTaskDescription("");
    setTaskStatus("TODO");
    setImgSrc("/todo.svg");
    setSelectedDate(null);
    setComments([]);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <form
        className="bg-white p-6 rounded-2xl shadow-lg z-50 w-6/12 relative"
        onSubmit={handleAddTask}
      >
        {/* Close button */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button type="button" className="text-gray-500" onClick={handleClose}>
            <TfiClose className="w-4 h-4 text-gray-800 mr-2 mt-2" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          maxLength={20}
          onChange={(e) => setTaskName(e.target.value)}
          className="mb-2 mt-2 p-2 text-xl rounded focus:border-transparent focus:outline-none"
        />
        {errors.taskName && <p className="eMessage">{errors.taskName}</p>}

        <div className="flex gap-2 mb-4 ml-2">
          <div className="text-xs p-1 pl-2 mt-6 w-20 h-6 rounded-2xl bg-orange-300 text-white">
            <img
              src="/todo.svg"
              alt="To Do"
              className="inline-block w-4 h-4 mr-2"
            />
            To do
          </div>
        </div>

        <textarea
          placeholder="Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          maxLength={200}
          rows={7}
          className="mb-4 p-2 w-3/5 h-52 rounded focus:border-transparent focus:outline-none"
        />

        <div className="mb-4 mt-5 flex justify-start items-center">
          <div className="flex flex-col">
            <div className="flex items-center text-sm border rounded-lg border-slate-500 h-8 w-28">
              <FaCalendarAlt className="text-slate-400 mr-2 ml-2 text-2xl" />
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                placeholderText="Due date"
                className="placeholder-xl border-none outline-none text-gray-500 w-full"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        </div>

        <div className="border-b ml-2 w-full border-gray-300 mt-4"></div>

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="text-white text-sm mt-5 bg-customPurple hover:bg-[#8182d1] rounded-lg h-9 w-24"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskPopup;
