import { useState } from "react";
import { TfiClose } from "react-icons/tfi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from 'react-icons/fa';
import CommentModal from "./CommentModal";  
import AddMemberPopup from "@/app/project-board/[projectId]/components/addmember";

interface AddTaskPopupProps {
  // projectId: string;
  isVisible: boolean;
  onClose: () => void;
  onAddTask: (taskName: string, taskDescription: string, taskStatus: string, dueDate: Date | null) => void;
}

interface Comment {
  name: string;
  text: string;
  time: string;
}

const AddTaskPopup = ({ isVisible, onClose, onAddTask }: AddTaskPopupProps) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("TODO");
  const [imgSrc, setImgSrc] = useState("/undo.svg"); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  // const [taskDueDate, setTaskDueDate] = useState("")
  
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);

  const [errors, setErrors] = useState({ taskName: '', taskStatus: '', selectedDate: '' });

  const handleStatusChange = (status: string) => {
    setTaskStatus(status);
    setImgSrc("/todo.svg");
  };

  let formErrors = { taskName: '', taskStatus: '', selectedDate: '' };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // handle token
    const tokenData = localStorage.getItem("jwt");
    const parsedTokenData = tokenData ? JSON.parse(tokenData) : null;
    const token = parsedTokenData ? parsedTokenData.token : "";

    if (!token) {
      console.error("Token not found");
      return;
    }

    if (!taskName) {
      setErrors({ ...errors, taskName: 'Task name required!' });
      return; // Don't proceed if there are errors
    } else {
      setErrors({ ...errors, taskName: '' }); // Clear errors if the task name is valid
    }

    // setErrors(formErrors)

    console.log(formErrors.taskName)
        // Check if there are any form errors

    const projectId = "2a5cf408-ce79-44b0-8ba9-97c48284c77d	"  // dynamic projectId later
    const taskData = {
      // taskId: "", // Backend should generate this if not required upfront
      taskName: taskName,
      taskDetail: taskDescription,
      // taskStatus: taskStatus.toUpperCase().replace(" ", "_"), // Formatting status to match backend format (e.g., "TODO")
      taskDueDate: selectedDate ? selectedDate.toISOString() : null, // Format the date to ISO string
      taskProjectId: projectId, // Replace with actual project ID or make dynamic if available
      

      taskOwnerId: parsedTokenData.memberId, // Set the task owner ID correctly
      // taskParticipants: [], // Populate with selected participants if applicable
      taskArai: '',
    };
    
    
      // Perform form submission (e.g., API call)
      
      try {
        console.log('Token being sent:', token);
        console.log('projectId:', projectId)
        console.log('parsedTokenData.memberId:', parsedTokenData.memberId)

        const response = await fetch("http://localhost:9000/task/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // include token if needed
          },
          body: JSON.stringify(taskData)
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log("Task created successfully:", responseData);
          onAddTask(taskName, taskDescription, taskStatus, selectedDate); // Notify parent component
          handleClose(); // Reset form and close popup
          window.location.reload();
        } else {
          // handle error response
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
    setShowAddMemberPopup(true); 

    onClose();
  };

  const handleSendComment = (newComment: Comment) => {
    setComments([...comments, newComment]);
  };

  const handleCommentClick = () => {
    setShowCommentModal(true); 
  };

  const openAddMemberPopup = () => {
    setShowAddMemberPopup(true);
  };

  const handleCancelClick = () => {
    setShowAddMemberPopup(false); 
  };

  const handleDoneClick = () => {
    setShowAddMemberPopup(false); 
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      
      <form className="bg-white p-6 rounded-2xl shadow-lg z-50 w-6/12 relative" onSubmit={handleAddTask}>
        
        {/* x close button */}
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
          

        <div className='text-xs p-1 pl-2 mt-6 w-20 h-6 rounded-2xl bg-orange-300 text-white' >
          <img src="/todo.svg" alt="To Do" className="inline-block w-4 h-4 mr-2" />
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

          {/* ไม่ใช้ comments ตอนสร้าง task? */}
          {/* <button
            className="ml-auto mr-4 mt-1 flex items-center text-sm"
            onClick={handleCommentClick} 
          >
            <img src="/comment.svg" alt="Comment" className="w-5 h-5" />
            {comments.length > 0 && ( 
              <span className="ml-1 text-xs text-gray-400">{comments.length}</span>
            )}
          </button> */}
        </div>

        <div className="border-b ml-2 w-full border-gray-300 mt-4"></div>

        <div className="flex justify-end gap-2">
          <button
            type="submit"
            // onClick={handleAddTask}
            className="text-white text-sm mt-5 bg-customPurple hover:bg-[#8182d1] rounded-lg h-9 w-24"
          >
            Save
          </button>
        </div>
      </form>

      {/* AddMemberPopup */}
      {/* {showAddMemberPopup && (
        <AddMemberPopup
          tempMembers={tempMembers}
          toggleTempSelect={(id: number) => console.log(`Toggle member with id: ${id}`)}
          handleDoneClick={handleDoneClick}
          handleCancelClick={handleCancelClick}
          position={{top:100, left:900}}
        />
      )} */}

      {showCommentModal && (
        <CommentModal
          taskName={taskName}
          comments={comments}
          onClose={() => setShowCommentModal(false)} 
          onSendComment={handleSendComment}
          position={{ top: 400, left: 720}} 
        />
      )}
    </div>
  );
};

export default AddTaskPopup;
