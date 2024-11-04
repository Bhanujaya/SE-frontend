// MemberContainer.tsx

"use client";

import { useState, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";
import AddMemberPopup from "./AddMemberPopup";

interface MemberData {
  memberId: string;
  memberName: string;
  memberLastName: string;
  role: string;
  img: string;
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
  assigns: MemberData[]; // Updated type to MemberData[]
  meetings: any[];
  logs: any[];
}

interface MemberContainerProps {
  currentProject: Project | null;
  onProjectDataChange: () => void; // Added prop to handle project data refresh
}

export default function MemberContainer({
  currentProject,
  onProjectDataChange,
}: MemberContainerProps) {
  const [members, setMembers] = useState<MemberData[]>(currentProject?.assigns || []);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    if (currentProject) {
      setMembers(currentProject.assigns);
    }
  }, [currentProject]);

  // Function to remove a member
  const handleRemoveMember = async (memberId: string) => {
    const projectId = currentProject?.project.projectId;

    const memberData = {
      projectId: projectId,
      memberId: memberId,
      role: "member",
    };

    try {
      const userData = localStorage.getItem("jwt");
      if (!userData) throw new Error("No token found");

      const { token } = JSON.parse(userData);
      const response = await fetch(`http://localhost:9000/${projectId}/unassign`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        console.log("Member deleted successfully");
        onProjectDataChange(); // Refresh project data to update members list
      } else {
        console.error("Failed to delete member:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  // Function to handle adding a new member
  const handleAddMember = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleInviteMember = (email: string) => {
    console.log("Invited member with email:", email);
    onProjectDataChange(); // Refresh project data to update members list
    setIsPopupVisible(false);
  };

  const projectId = currentProject?.project.projectId;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center">
          <img src="/people.svg" alt="People" className="mr-2" />
          <h1 className="text-lg font-medium">Member</h1>
        </div>

        <button
          onClick={handleAddMember}
          className="flex items-center bg-white rounded-md py-1 px-2 ring-1 ring-gray-200 hover:ring-gray-300 hover:bg-gray-100 text-sm"
        >
          <span className="text-xl font-light mr-2">+</span>
          Add Member
        </button>
      </div>

      {/* Content */}
      <div className="overflow-hidden max-h-64">
        <div className="overflow-y-auto h-full">
          <table className="min-w-full table-auto bg-white rounded-lg">
            <thead>
              <tr className="text-gray-400 text-left text-sm">
                <th className="p-3 font-normal">Name</th>
                <th className="p-3 font-normal">Role</th>
                <th className="p-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {/* Project Owner */}
              <tr className="border-b">
                <td className="p-3 flex items-center">
                  <div className="relative">
                    <img
                      src={currentProject?.project.projectOwner.detail.img || "/profile.svg"}
                      alt={`${currentProject?.project.projectOwner.detail.memberName || "Unknown"} ${
                        currentProject?.project.projectOwner.detail.memberLastname
                      }`}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    {/* Show crown for Owner */}
                    <img
                      src="/crown.svg"
                      alt="Crown"
                      className="absolute top-[-10px] right-0 w-4 h-4"
                    />
                  </div>
                  <span className="text-sm ml-2">
                    {currentProject?.project.projectOwner.detail.memberName}{" "}
                    {currentProject?.project.projectOwner.detail.memberLastname}
                  </span>
                </td>
                <td className="p-3 text-sm">Owner</td>
                <td className="p-3"></td>
              </tr>

              {/* Other Members */}
              {members.map((member, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3 flex items-center">
                    <div className="relative">
                      <img
                        src={member.img || "/profile.svg"}
                        alt={`${member.memberName || "Unknown"} ${member.memberLastName}`}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    </div>
                    <span className="text-sm ml-2">
                      {member.memberName} {member.memberLastName}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </td>
                  <td className="p-3">
                    <button
                      className="hover:bg-gray-100 rounded-md p-1"
                      onClick={() => handleRemoveMember(member.memberId)}
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
                    onClick={handleAddMember}
                  >
                    <div className="flex items-center ml-2">
                      <span className="text-2xl font-light pb-1 mr-2">+</span> Add Member
                    </div>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Popup */}
      {projectId && (
        <AddMemberPopup
          projectId={projectId}
          isVisible={isPopupVisible}
          onClose={handleClosePopup}
          onInvite={handleInviteMember}
        />
      )}
    </>
  );
}
