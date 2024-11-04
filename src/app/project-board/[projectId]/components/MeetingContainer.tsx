"use client";

import Link from "next/link";
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

// interface ProjectOwner {
//   token: string | null;
//   memberId: string;
//   detail: {
//     memberEmail: string;
//     memberName: string;
//     memberLastname: string;
//     username: string;
//     img: string;
//   };
// }

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

interface MeetingContainerProps {
  currentProject: Project | null;
}

// ------------------ Mock data ------------------

// const meetingsData: Meeting[] = [
//   {
//     id: "1",
//     topic: "Meeting 1",
//     date: "20/06/24",
//     location: "Bankhen",
//     projectId: "1",
//   },
//   {
//     id: "2",
//     topic: "Meeting 2",
//     date: "02/07/24",
//     location: "Teenoi",
//     projectId: "1",
//   },
// ];

// -----------------------------------------------

export default function MeetingContainer({ currentProject }: MeetingContainerProps) {
  const [meetings, setMeetings] = useState<Meeting[]>(currentProject?.meetings || []);
  const [isMeetingPopupVisible, setIsMeetingPopupVisible] = useState(false)

  useEffect(() => {
    if (currentProject) {
      // console.log('currentProj', currentProj)
      setMeetings(currentProject.meetings);    
    } 
    
  }, [currentProject]); // Re-run the filter when projectId changes

  useEffect(() => {
    console.log('meetings:', meetings);
    
  }, [meetings]);


  // Function to remove a meeting
  const handleRemoveMeeting = async (meetingId: string) => {
    try {
      const userData = localStorage.getItem("jwt");
      if (!userData) throw new Error("No token found");
  
      const { token } = JSON.parse(userData);
      console.log('token being sent:',token)
      const response = await fetch("http://localhost:9000/meeting/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ meetingId }), // Adjust request body format as needed
      });
  
      if (response.ok) {
        // Update state to reflect meeting removal
        setMeetings((prevMeetings) => prevMeetings.filter((meeting) => meeting.meetingId !== meetingId));
        console.log("Meeting deleted successfully");
      } else {
        console.error("Failed to delete meeting:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  // Function to add a new meeting
  const handleAddMeeting = (meetingName: string, meetingDescription: string) => {
    console.log("meeting Added:", meetingName, meetingDescription);
    // Logic to add the meeting to the project goes here
  };

  const handleToggleMeetingPopup = () => {
    setIsMeetingPopupVisible(!isMeetingPopupVisible);
  };

  return (
    <>
      {/*Header*/}
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
                  <td className="p-3">{new Date(meeting.meetingDate).toLocaleDateString("en-TH")}</td>

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

              {/* Add Member Button Row */}
              <tr className="text-sm">
                <td colSpan={3}>
                  <button
                    className="w-full flex items-center justify-left p-2 bg-transparent text-gray-400 hover:bg-gray-100"
                    onClick={handleToggleMeetingPopup}
                  >
                    <div className="flex items-center ml-2">
                      <span className="text-2xl font-light pb-1 mr-2">+</span>{" "}
                      Add Meeting
                    </div>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    
      {/* Add meeting Popup */}
      <AddMeetingPopup
        isVisible={isMeetingPopupVisible}
        onClose={() => setIsMeetingPopupVisible(false)}
        onAddMeeting={handleAddMeeting}
      />
    
    </>
  );
}
