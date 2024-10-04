"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";

interface Meeting {
  id: string;
  topic: string;
  date: string;
  location: string;
  projectId: string;
}

interface MeetingContainerProps {
  projectId: string; // Pass the projectId dynamically
}


// ------------------ Mock data ------------------

const meetingsData: Meeting[] = [
  {
    id: "1",
    topic: "Meeting 1",
    date: "20/06/24",
    location: "Bankhen",
    projectId: '1',
  },
  {
    id: "2",
    topic: "Meeting 2",
    date: "02/07/24",
    location: "Teenoi",
    projectId: "1"
  },
];

// -----------------------------------------------


export default function MeetingContainer({ projectId }: MeetingContainerProps) {
  const [meetings, setMeetings] = useState<Meeting[]>(meetingsData);

  useEffect(() => {
    // Filter meetings based on the projectId
    const filteredMeetings = meetingsData.filter(
      (meeting) => meeting.projectId === projectId
    );
    setMeetings(filteredMeetings);
  }, [projectId]); // Re-run the filter when projectId changes

  // Function to remove a meeting
  const handleRemoveMeeting = (id: string) => {
    const updatedMeetings = meetings.filter((meeting) => meeting.id !== id);
    setMeetings(updatedMeetings);
  };

  // Function to add a new meeting
  const handleAddMeeting = () => {
    //Implements later
 
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
          onClick={handleAddMeeting}
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
                    <span className="py-1">{meeting.topic}</span>
                  </td>
                  {/* Date */}
                  <td className="p-3">{meeting.date}</td>

                  <td className="p-3">
                    <button
                      className="hover:bg-gray-100 rounded-md p-1"
                      onClick={() => handleRemoveMeeting(meeting.id)}
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
                    onClick={handleAddMeeting} 
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
    </>
  );
}
