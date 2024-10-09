import { useState } from "react";
import { TfiClose } from "react-icons/tfi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from 'react-icons/fa';
import CommentModal from "./CommentModal";  
import { AddMemberPopup } from "@/app/test/components/addmember";

interface AddTaskPopupProps {
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
  const [taskStatus, setTaskStatus] = useState("In Progress");
  const [imgSrc, setImgSrc] = useState("/undo.svg"); 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);

  const tempMembers = [
        { id: 1, name: "Member 1", selected: false, profilePic: 'https://via.placeholder.com/40' },
        { id: 2, name: "Member 2", selected: false, profilePic: 'https://via.placeholder.com/40' },
        { id: 3, name: "Member 3", selected: false, profilePic: 'https://via.placeholder.com/40' },
        { id: 4, name: "Member 4", selected: false, profilePic: 'https://via.placeholder.com/40' },
        { id: 5, name: "Member 5", selected: false, profilePic: 'https://via.placeholder.com/40' },
    ];


  const handleStatusChange = (status: string) => {
    setTaskStatus(status);
    setImgSrc("/todo.svg");
  };

  const handleAddTask = () => {
    if (taskName && taskDescription) {
      onAddTask(taskName, taskDescription, taskStatus, selectedDate);
      setTaskName("");
      setTaskDescription("");
      setTaskStatus("In Progress");
      setSelectedDate(null);
      setImgSrc("/todo.svg");
      setComments([]);
      onClose();
    }
  };

  const handleClose = () => {
    setTaskName("");
    setTaskDescription("");
    setTaskStatus("In Progress");
    setImgSrc("/todo.svg");
    setSelectedDate(null);
    setComments([]); 
    setShowAddMemberPopup(false); 

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg z-60 w-6/12 relative">
        <div className="absolute top-2 right-2 flex gap-2">
          <button onClick={handleClose} className="text-gray-500">
            <TfiClose className="w-4 h-4 text-gray-800 mr-2 mt-2" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          maxLength={20}
          onChange={(e) => setTaskName(e.target.value)}
          className="mb-2 mt-2 p-2 w-96 text-2xl rounded focus:border-transparent focus:outline-none"
        />

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleStatusChange("In Progress")}
            className={`text-xs py-1 w-32 h-6 rounded-2xl hover:bg-blue-400 ${
              taskStatus === "In Progress" ? "bg-blue-400 text-white" : "bg-blue-300 text-white"
            }`}
          >
            <img src={taskStatus === "In Progress" ? imgSrc : "/undo.svg"} alt="In Progress" className="inline-block w-4 h-4 mr-2" />
            IN PROGRESS
          </button>
          <button
            onClick={() => handleStatusChange("Done")}
            className={`text-xs py-1 w-20 h-6 rounded-2xl hover:bg-green-400 ${
              taskStatus === "Done" ? "bg-green-400 text-white" : "bg-green-300 text-white"
            }`}
          >
            <img src={taskStatus === "Done" ? imgSrc : "/undo.svg"} alt="Done" className="inline-block w-4 h-4 mr-2" />
            DONE
          </button>
          <button
            onClick={() => handleStatusChange("To Do")}
            className={`text-xs py-1 w-20 h-6 rounded-2xl hover:bg-orange-400 ${
              taskStatus === "To Do" ? "bg-orange-400 text-white" : "bg-orange-300 text-white"
            }`}
          >
            <img src={taskStatus === "To Do" ? imgSrc : "/undo.svg"} alt="To Do" className="inline-block w-4 h-4 mr-2" />
            TO DO
          </button>
          <div className="ml-48">
            <h2 className="font-bold">Assignee</h2>
            <button className="text-sm text-gray-400 ml-10" onClick={openAddMemberPopup}>
                <span className="text-xl font-light mr-2">+</span>
                        Assignee
            </button>
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
            <button className="flex items-center text-sm border rounded-lg border-slate-500 h-8 w-28">
              <FaCalendarAlt className="text-slate-400 mr-2 ml-2 text-2xl" />
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                placeholderText="Due date"
                className="placeholder-xl border-none outline-none text-gray-500 w-full"
                dateFormat="dd/MM/yyyy"
              />
            </button>
          </div>

          <button
            className="ml-auto mr-4 mt-1 flex items-center text-sm"
            onClick={handleCommentClick} 
          >
            <img src="/comment.svg" alt="Comment" className="w-5 h-5" />
            {comments.length > 0 && ( 
              <span className="ml-1 text-xs text-gray-400">{comments.length}</span>
            )}
          </button>
        </div>

        <div className="border-b ml-2 w-full border-gray-300 mt-4"></div>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleAddTask}
            className="text-white text-sm mt-5 bg-customPurple hover:bg-[#8182d1] rounded-lg h-9 w-24"
          >
            Save
          </button>
        </div>
      </div>

      {/* AddMemberPopup */}
      {showAddMemberPopup && (
        <AddMemberPopup
          tempMembers={tempMembers}
          toggleTempSelect={(id: number) => console.log(`Toggle member with id: ${id}`)}
          handleDoneClick={handleDoneClick}
          handleCancelClick={handleCancelClick}
          position={{top:100, left:900}}
        />
      )}

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
