"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";

export type Member = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage: string;
  projectIds: string[];

}

interface MemberContainerProps {
  projectId: string; // Pass the projectId dynamically
}

// ------------------ Mock data ------------------

const membersData: Member[] = [
  {
    id: "1",
    username: "_pleang",
    firstName: "Pleang",
    lastName: "Nernngam",
    email: "lingnoi@kiki.com",
    role: "Owner",
    profileImage: "/profile.svg",
    projectIds: ["1", "2"],
  },
  {
    id: "2",
    username: "soodlhor",
    firstName: "Song",
    lastName: "Kang",
    email: "soodlhor@mak.com",
    role: "Member",
    profileImage: "/profile.svg",
    projectIds: ["1", "3"],
  },
  {
    id: "3",
    username: "big_muscle",
    firstName: "John",
    lastName: "Cena",
    email: "khangrang@mak.com",
    role: "Member",
    profileImage: "/profile.svg",
    projectIds: ["1"],
  },
];

// -----------------------------------------------

export default function MemberContainer({ projectId }: MemberContainerProps) {
  const [members, setMembers] = useState<Member[]>(membersData);

  useEffect(() => {
    // Filter meetings based on the projectId
    const filteredMembers = membersData.filter((member) =>
      member.projectIds.includes(projectId)
    );
    setMembers(filteredMembers);
  }, [projectId]); // Re-run the filter when projectId changes

  // Function to remove a member
  const handleRemoveMember = (id: string) => {
    const updatedMembers = members.filter((member) => member.id !== id);
    setMembers(updatedMembers);
  };

  // Function to add a new member (for simplicity, a placeholder member is added)
  const handleAddMember = () => {
    {
      /* Implements later */
    }

    // const newMember: Member = {
    //   id: "0",
    //   name: "New Member",
    //   role: "Member",
    //   profileImage: "/profile.svg",
    // };
    // setMembers([...members, newMember]);
  };

  return (
    <>
      {/*Header*/}
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
              <tr className="text-gray-400 text-left text-sm ">
                <th className="p-3 font-normal">Name</th>
                <th className="p-3 font-normal">Role</th>
                <th className="p-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {members.map((member, index) => (
                <tr key={index} className="border-b">
                  {/* Profile Image and Name */}
                  <td className="p-3 flex items-center">
                    <div className="relative">
                      <img
                        src={member.profileImage}
                        alt={member.firstName}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      {/* Show crown for Owner */}
                      {member.role === "Owner" && (
                        <img
                          src="/crown.svg"
                          alt="Crown"
                          className="absolute top-[-10px] right-0 w-4 h-4"
                        />
                      )}
                    </div>
                    <span className="text-sm ml-2">
                      {member.firstName} {member.lastName}
                    </span>
                  </td>
                  {/* Role */}
                  <td className="p-3 text-sm">{member.role}</td>

                  <td className="p-3">
                    {member.role !== "Owner" ? (
                      <button
                        className="hover:bg-gray-100 rounded-md p-1"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <TfiClose className="w-4 h-4 text-gray-800" />
                      </button>
                    ) : (
                      <div className="h-4 w-4">
                        {" "}
                        {/* hidden the remove button */}{" "}
                      </div>
                    )}
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
                      <span className="text-2xl font-light pb-1 mr-2">+</span>{" "}
                      Add Member
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
