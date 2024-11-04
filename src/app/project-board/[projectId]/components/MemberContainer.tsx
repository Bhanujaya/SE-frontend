"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { TfiClose } from "react-icons/tfi";
import AddMemberPopup from "./AddMemberProject";

interface MemberData {
  memberId: string;
  memberName: string;
  memberLastName: string;
  role: string;
  img: string;
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

interface MemberContainerProps {
  currentProject: Project | null;
}

// ------------------ Mock data ------------------

// const membersData: Member[] = [
//   {
//     id: "1",
//     username: "_pleang",
//     firstName: "Pleang",
//     lastName: "Nernngam",
//     email: "lingnoi@kiki.com",
//     role: "Owner",
//     profileImage: "/profile.svg",
//     projectIds: ["1", "2"],
//   },
//   {
//     id: "2",
//     username: "soodlhor",
//     firstName: "Song",
//     lastName: "Kang",
//     email: "soodlhor@mak.com",
//     role: "Member",
//     profileImage: "/profile.svg",
//     projectIds: ["1", "3"],
//   },
//   {
//     id: "3",
//     username: "big_muscle",
//     firstName: "John",
//     lastName: "Cena",
//     email: "khangrang@mak.com",
//     role: "Member",
//     profileImage: "/profile.svg",
//     projectIds: ["1"],
//   },
// ];

// -----------------------------------------------

export default function MemberContainer({ currentProject }: MemberContainerProps) {
  const [members, setMembers] = useState<MemberData[]>(currentProject?.assigns || []);
  const [isPopupVisible, setIsPopupVisible] = useState(false); 

  useEffect(() => {
    if (currentProject) {
      // console.log('currentProj', currentProj)
      setMembers(currentProject.assigns);
    
    } 
  }, [currentProject]); // Re-run the filter when projectId changes

  useEffect(() => {
    console.log('members:', members);
    
    // members.forEach((member, index) => {
    //   console.log(`Member ${index + 1} details:`, member.detail);
    // });
    
  }, [members]);


  // Function to remove a member
  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = members.filter((member) => member.memberId !== memberId);
    setMembers(updatedMembers);
  };

  // Function to add a new member (for simplicity, a placeholder member is added)
  // const handleAddMember = () => {
  //   {
  //     /* Implements later */
  //   }

  //   // const newMember: Member = {
  //   //   id: "0",
  //   //   name: "New Member",
  //   //   role: "Member",
  //   //   profileImage: "/profile.svg",
  //   // };
  //   // setMembers([...members, newMember]);
  // };

  const handleAddMember = () => {
    setIsPopupVisible(true); 
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false); 
  };

    const handleInviteMember = (email: string) => {
    // const newMember: Member = {
    //   memberId: (members.length + 1).toString(),
    //   username: "new_member",
    //   firstName: "New",
    //   lastName: "Member",
    //   email: email,
    //   role: "Member",
    //   profileImage: "/profile.svg",
    //   projectIds: [projectId], 
    // };
    // setMembers([...members, newMember]); 
    // setIsPopupVisible(false); 
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
              <tr className="border-b">
                {/* Profile Image and Name */}
                <td className="p-3 flex items-center">
                    <div className="relative">
                      <img
                        src={currentProject?.project.projectOwner.detail.img || "/profile.svg"} // Default image if none is provided
                        alt={`${currentProject?.project.projectOwner.detail.memberName || 'Unknown'} ${currentProject?.project.projectOwner.detail.memberLastname}`}
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
                    {currentProject?.project.projectOwner.detail.memberName} {currentProject?.project.projectOwner.detail.memberLastname}
                    </span>
                  </td>
                  {/* Role */}
                  <td className="p-3 text-sm">Owner</td>


              </tr>

              {members.map((member, index) => (
                <tr key={index} className="border-b">
                  {/* Profile Image and Name */}
                  <td className="p-3 flex items-center">
                    <div className="relative">
                      <img
                        src={member.img || "/profile.svg"} // Default image if none is provided
                        alt={`${member.memberName || 'Unknown'} ${member.memberLastName}`}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      {/* Show crown for Owner */}
                      {/* {member.role === "Owner" && (
                        <img
                          src="/crown.svg"
                          alt="Crown"
                          className="absolute top-[-10px] right-0 w-4 h-4"
                        />
                      )} */}
                    </div>
                    <span className="text-sm ml-2">
                      {member.memberName} {member.memberLastName}
                    </span>
                  </td>
                  {/* Role */}
                  <td className="p-3 text-sm">{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</td>
                  
                  
                  <td className="p-3">


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

      {/* Add Member Popup */}
      <AddMemberPopup
        isVisible={isPopupVisible}
        onClose={handleClosePopup}
        onInvite={handleInviteMember}
      />
    </>
  );
}
