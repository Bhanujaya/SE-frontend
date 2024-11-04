// AddMeetingPopup.tsx

import { useState } from "react";
import { TfiClose } from "react-icons/tfi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";

interface AddMeetingPopupProps {
  projectId: string;
  isVisible: boolean;
  onClose: () => void;
  onAddMeeting: (newMeeting: Meeting) => void;
}

interface Meeting {
  meetingId: string;
  meetingTopic: string;
  meetingDate: string;
  meetingLocation: string;
  meetingProjectId: string;
}

const AddMeetingPopup = ({
  projectId,
  isVisible,
  onClose,
  onAddMeeting,
}: AddMeetingPopupProps) => {
  const [meetingTopic, setMeetingTopic] = useState("");
  const [meetingLocation, setMeetingLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState({ meetingTopic: "", selectedDate: "" });

  const handleAddMeeting = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle token
    const tokenData = localStorage.getItem("jwt");
    const parsedTokenData = tokenData ? JSON.parse(tokenData) : null;
    const token = parsedTokenData ? parsedTokenData.token : "";

    if (!token) {
      console.error("Token not found");
      return;
    }

    if (!meetingTopic) {
      setErrors({ ...errors, meetingTopic: "Meeting topic is required!" });
      return;
    } else {
      setErrors({ ...errors, meetingTopic: "" });
    }

    const meetingData = {
      meetingTopic: meetingTopic,
      meetingLocation: meetingLocation,
      meetingDate: selectedDate ? selectedDate.toISOString() : null,
      meetingProjectId: projectId,
    };

    try {
      console.log("Token being sent:", token);
      const response = await fetch("http://localhost:9000/meeting/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token if needed
        },
        body: JSON.stringify(meetingData),
      });

      if (response.ok) {
        const responseData: Meeting = await response.json();
        console.log("Meeting created successfully:", responseData);
        onAddMeeting(responseData); // Pass the new meeting data back to parent
        handleClose(); // Reset form and close popup
      } else {
        // Handle error response
        const errorData = await response.json();
        console.error("Failed to create meeting:", errorData);
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  const handleClose = () => {
    setMeetingTopic("");
    setMeetingLocation("");
    setSelectedDate(null);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
      <form
        className="bg-white p-6 rounded-2xl shadow-lg z-50 w-6/12 relative"
        onSubmit={handleAddMeeting}
      >
        {/* Close button */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button type="button" className="text-gray-500" onClick={handleClose}>
            <TfiClose className="w-4 h-4 text-gray-800 mr-2 mt-2" />
          </button>
        </div>

        <input
          type="text"
          placeholder="Meeting Topic"
          value={meetingTopic}
          maxLength={20}
          onChange={(e) => setMeetingTopic(e.target.value)}
          className="mb-2 mt-2 p-2 text-xl rounded focus:border-transparent focus:outline-none"
        />
        {errors.meetingTopic && (
          <p className="eMessage">{errors.meetingTopic}</p>
        )}

        <div className="mb-2 ml-1 flex gap-0.5 items-center">
          <IoLocationOutline size={20} />
          <input
            type="text"
            value={meetingLocation}
            onChange={(e) => setMeetingLocation(e.target.value)}
            className="w-full p-2 text-base rounded placeholder-slate-500 focus:border-transparent focus:outline-none"
            placeholder="Location"
            maxLength={40}
          />
        </div>

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

export default AddMeetingPopup;
