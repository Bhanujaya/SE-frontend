import { useState, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import CommentModal from "./CommentModal";
import AddMemberPopup from "@/app/project-board/[projectId]/components/addmember";


interface MemberDetail {
  memberEmail: string;
  memberName: string;
  memberLastname: string;
  username: string;
  img: string | null;
}

interface Member {
  memberId: string;
  detail?: MemberDetail;
  memberName?: string;
  memberLastName?: string;
  role?: string;
  img?: string | null;
  token?: any;
}
 

interface Assignee {
  memberId: string;
  memberName: string;
  memberLastName: string;
  img: string | null;
  selected?: boolean;
}

interface Task {
  taskId: string;
  taskName: string;
  taskDetail: string;
  taskStatus: string;
  taskProjectId: string;
  taskComments: any[];
  taskParticipants: any[];
  taskDueDate: string;
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

interface TaskDetailsPopupProps {
  currentProject: Project | null;
  task: Task | null;
  isVisible: boolean;
  onClose: () => void;
  onSaveTask: (updatedTask: Task) => void;
}

interface Comment {
  name: string;
  text: string;
  time: string;
}

const TaskDetailsPopup = ({
  currentProject,
  task,
  isVisible,
  onClose,
  onSaveTask,
}: TaskDetailsPopupProps) => {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("PROGRESS");
  const [imgSrc, setImgSrc] = useState("/undo.svg");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);

  const [tempMembers, setTempMembers] = useState<Assignee[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [initialAssignees, setInitialAssignees] = useState<Assignee[]>([]);

  useEffect(() => {
    if (task && currentProject) {
      setTaskName(task.taskName);
      setTaskDescription(task.taskDetail);
      setTaskStatus(task.taskStatus);
      setSelectedDate(task.taskDueDate ? new Date(task.taskDueDate) : null);
      setComments(task.taskComments || []);

      // Set imgSrc based on taskStatus
      if (task.taskStatus === "DONE") {
        setImgSrc("/todo.svg"); // Replace with your actual image paths
      } else if (task.taskStatus === "PROGRESS") {
        setImgSrc("/todo.svg");
      } else {
        setImgSrc("/todo.svg");
      }

      // Initialize tempMembers from currentProject.assigns
      const projectMembers: Assignee[] = currentProject.assigns.map((assign) => ({
        memberId: assign.memberId,
        memberName: assign.memberName,
        memberLastName: assign.memberLastName,
        img: assign.img,
        selected: false,
      }));

      // Mark members as selected if they are in taskParticipants
      const updatedMembers = projectMembers.map((member) => {
        const isSelected = task.taskParticipants.some(
          (participant) => participant.memberId === member.memberId
        );
        return { ...member, selected: isSelected };
      });

      setTempMembers(updatedMembers);

      const initialAssigneesList = updatedMembers.filter((member) => member.selected);
      setAssignees(initialAssigneesList);
      setInitialAssignees(initialAssigneesList);
    }
  }, [task, currentProject]);

  const handleStatusChange = (status: string) => {
    setTaskStatus(status);
    if (status === "DONE") {
      setImgSrc("/todo.svg");
    } else if (status === "PROGRESS") {
      setImgSrc("/todo.svg");
    } else {
      setImgSrc("/todo.svg");
    }
  };

  const toggleTempSelect = (memberId: string) => {
    setTempMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.memberId === memberId ? { ...member, selected: !member.selected } : member
      )
    );
  };

  const handleDoneClick = () => {
    const selectedMembers = tempMembers.filter((member) => member.selected);
    setAssignees(selectedMembers);
    setShowAddMemberPopup(false);
  };

  const handleCancelClick = () => {
    // Reset tempMembers to initial state
    setTempMembers((prevMembers) =>
      prevMembers.map((member) => {
        const wasSelected = initialAssignees.some(
          (assignee) => assignee.memberId === member.memberId
        );
        return { ...member, selected: wasSelected };
      })
    );
    setShowAddMemberPopup(false);
  };

  const handleSaveTask = async () => {
    if (task && currentProject) {
      // Get the token
      const tokenData = localStorage.getItem("jwt");
      const parsedTokenData = tokenData ? JSON.parse(tokenData) : null;
      const token = parsedTokenData ? parsedTokenData.token : "";

      if (!token) {
        console.error("Token not found");
        return;
      }

      // Prepare the request payload
      const taskUpdateData = {
        taskId: task.taskId,
        taskProjectId: currentProject.project.projectId,
        taskName,
        taskDetail: taskDescription,
        taskDueDate: selectedDate ? selectedDate.toISOString() : null,
      };

      try {
        // Update Task Details
        const response = await fetch(`http://localhost:9000/task/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskUpdateData),
        });

        if (response.ok) {
          // Update Task Status
          const statusResponse = await fetch(
            `http://localhost:9000/task/update-status?t=${task.taskId}&s=${taskStatus}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (statusResponse.ok) {
            // Determine added and removed participants
            const selectedMemberIds = assignees.map((member) => member.memberId);
            const initialMemberIds = initialAssignees.map((member) => member.memberId);

            const addedMemberIds = selectedMemberIds.filter(
              (id) => !initialMemberIds.includes(id)
            );
            const removedMemberIds = initialMemberIds.filter(
              (id) => !selectedMemberIds.includes(id)
            );

            // Add Participants
            if (addedMemberIds.length > 0) {
              const addParticipantsResponse = await fetch(
                `http://localhost:9000/task/addParticipate?t=${task.taskId}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(addedMemberIds),
                }
              );

              if (!addParticipantsResponse.ok) {
                console.error("Failed to add participants");
              }
            }

            // Remove Participants
            if (removedMemberIds.length > 0) {
              const deleteParticipantsResponse = await fetch(
                `http://localhost:9000/task/deleteParticipate?t=${task.taskId}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(removedMemberIds),
                }
              );

              if (!deleteParticipantsResponse.ok) {
                console.error("Failed to remove participants");
              }
            }

            // Prepare the updated task object
            const updatedTask: Task = {
              ...task,
              taskName,
              taskDetail: taskDescription,
              taskStatus,
              taskDueDate: selectedDate ? selectedDate.toISOString() : "",
              taskParticipants: assignees,
            };

            // Update the task in the parent component
            onSaveTask(updatedTask);
            onClose();
          } else {
            console.error("Failed to update task status");
          }
        } else {
          console.error("Failed to update task");
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const handleClose = () => {
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

  if (!isVisible || !task) return null;

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
            onClick={() => handleStatusChange("PROGRESS")}
            className={`text-xs py-1 w-32 h-6 rounded-2xl hover:bg-blue-400 ${
              taskStatus === "PROGRESS" ? "bg-blue-400 text-white" : "bg-blue-300 text-white"
            }`}
          >
            <img
              src={taskStatus === "PROGRESS" ? imgSrc : "/undo.svg"}
              alt="In Progress"
              className="inline-block w-4 h-4 mr-2"
            />
            IN PROGRESS
          </button>
          <button
            onClick={() => handleStatusChange("DONE")}
            className={`text-xs py-1 w-20 h-6 rounded-2xl hover:bg-green-400 ${
              taskStatus === "DONE" ? "bg-green-400 text-white" : "bg-green-300 text-white"
            }`}
          >
            <img
              src={taskStatus === "DONE" ? imgSrc : "/undo.svg"}
              alt="Done"
              className="inline-block w-4 h-4 mr-2"
            />
            DONE
          </button>
          <button
            onClick={() => handleStatusChange("TODO")}
            className={`text-xs py-1 w-20 h-6 rounded-2xl hover:bg-orange-400 ${
              taskStatus === "TODO" ? "bg-orange-400 text-white" : "bg-orange-300 text-white"
            }`}
          >
            <img
              src={taskStatus === "TODO" ? imgSrc : "/undo.svg"}
              alt="To Do"
              className="inline-block w-4 h-4 mr-2"
            />
            TO DO
          </button>
          <div className="ml-auto">
            <h2 className="font-bold">Assignee</h2>
            <div className="flex items-center">
              {assignees.map((assignee) => (
                <img
                  key={assignee.memberId}
                  src={assignee.img || "https://via.placeholder.com/40"}
                  alt={`${assignee.memberName}'s profile`}
                  className="w-6 h-6 rounded-full mr-1"
                />
              ))}
              <button className="text-sm text-gray-400 ml-2" onClick={openAddMemberPopup}>
                <span className="text-xl font-light mr-2">+</span>
                Assignee
              </button>
            </div>
          </div>
        </div>

        <textarea
          placeholder="Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          maxLength={200}
          rows={7}
          className="mb-4 p-2 w-full h-52 rounded focus:border-transparent focus:outline-none"
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
            onClick={handleSaveTask}
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
          toggleTempSelect={toggleTempSelect}
          handleDoneClick={handleDoneClick}
          handleCancelClick={handleCancelClick}
          position={{ top: window.innerHeight / 2 - 150, left: window.innerWidth / 2 - 200 }}
        />
      )}

      {showCommentModal && (
        <CommentModal
          taskName={taskName}
          comments={comments}
          onClose={() => setShowCommentModal(false)}
          onSendComment={handleSendComment}
          position={{ top: 400, left: 720 }}
        />
      )}
    </div>
  );
};

export default TaskDetailsPopup;
