// MeetingContainer.tsx

"use client";

import { useState, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";
import AddMeetingPopup from "./AddMeetingPopup";

interface Meeting {
  meetingId: string;
  meetingTopic: string;
  meetingDate: string;
  meetingLocation: string;
  meetingProjectId: string;
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
  meetings: Meeting[];
  logs: any[];
}

interface MeetingContainerProps {
  currentProject: Project | null;
  onProjectDataChange: () => void;
}

export default function MeetingContainer({
  currentProject,
  onProjectDataChange,
}: MeetingContainerProps) {
  const [meetings, setMeetings] = useState<Meeting[]>(currentProject?.meetings || []);
  const [isMeetingPopupVisible, setIsMeetingPopupVisible] = useState(false);

  useEffect(() => {
    if (currentProject) {
      setMeetings(currentProject.meetings);
    }
  }, [currentProject]);

  const handleRemoveMeeting = async (meetingId: string) => {
    const projectId = currentProject?.project.projectId;

    if (!projectId) {
      console.error("Project ID is not available");
      return;
    }

    const meetingData = {
      meetingId: meetingId,
      meetingProjectId: projectId,
    };

    try {
      const userData = localStorage.getItem("jwt");
      if (!userData) throw new Error("No token found");

      const { token } = JSON.parse(userData);
      console.log("Token being sent:", token);
      const response = await fetch("http://localhost:9000/meeting/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(meetingData),
      });

      if (response.ok) {
        console.log("Meeting deleted successfully");
        onProjectDataChange(); // Refresh project data to update meetings list
      } else {
        console.error("Failed to delete meeting:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  const handleAddMeeting = (newMeeting: Meeting) => {
    console.log("Meeting Added:", newMeeting);
    // Update the meetings state with the new meeting
    setMeetings((prevMeetings) => [...prevMeetings, newMeeting]);
  };

  const handleToggleMeetingPopup = () => {
    setIsMeetingPopupVisible(!isMeetingPopupVisible);
  };

  const projectId = currentProject?.project.projectId;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center">
          <img src="/calendar.svg" alt="Calendar" className="mr-2" />
          <h1 className="text-lg font-medium">Meeting</h1>
        </div>

        <button
          onClick={handleToggleMeetingPopup}
          className="bg-white rounded-md py-1 px-2 ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-gray-100 text-sm"
        >
          <span className="text-xl font-light mr-2">+</span>
          Add Meeting
        </button>
      </div>

      {/* Content */}
      <div className="overflow-hidden max-h-64">
        <div className="overflow-y-auto h-full">
          <table className="min-w-full table-auto bg-white rounded-lg">
            <thead>
              <tr className="text-gray-400 text-left text-sm ">
                <th className="p-3 font-normal">Name</th>
                <th className="p-3 font-normal">Date</th>
                <th className="p-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting, index) => (
                <tr key={index} className="border-b text-sm">
                  {/* Name */}
                  <td className="p-3 flex items-center">
                    <span className="py-1">{meeting.meetingTopic}</span>
                  </td>
                  {/* Date */}
                  <td className="p-3">
                    {meeting.meetingDate
                      ? new Date(meeting.meetingDate).toLocaleDateString("en-TH")
                      : "-"}
                  </td>

                  <td className="p-3">
                    <button
                      className="hover:bg-gray-100 rounded-md p-1"
                      onClick={() => handleRemoveMeeting(meeting.meetingId)}
                    >
                      <TfiClose className="w-4 h-4 text-gray-800" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Add Meeting Button Row */}
              <tr className="text-sm">
                <td colSpan={3}>
                  <button
                    className="w-full flex items-center justify-left p-2 bg-transparent text-gray-400 hover:bg-gray-100"
                    onClick={handleToggleMeetingPopup}
                  >
                    <div className="flex items-center ml-2">
                      <span className="text-2xl font-light pb-1 mr-2">+</span> Add Meeting
                    </div>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Meeting Popup */}
      {projectId && (
        <AddMeetingPopup
          projectId={projectId}
          isVisible={isMeetingPopupVisible}
          onClose={() => setIsMeetingPopupVisible(false)}
          onAddMeeting={handleAddMeeting}
        />
      )}
    </>
  );
}
