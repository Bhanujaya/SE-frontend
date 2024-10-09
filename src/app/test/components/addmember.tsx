"use client";

import React from 'react';
import { IoCheckmarkCircleSharp } from "react-icons/io5"; // Checkmark icon

type AddMemberPopupProps = {
    tempMembers: { id: number; name: string; profilePic: string; selected: boolean }[];
    toggleTempSelect: (id: number) => void;
    handleDoneClick: () => void;
    handleCancelClick: () => void;
    position: { top: number; left: number };
};

export const AddMemberPopup: React.FC<AddMemberPopupProps> = ({
    tempMembers,
    toggleTempSelect,
    handleDoneClick,
    handleCancelClick,
    position,
}) => {
    return (
        <div className="absolute z-50 mt-24 right-[10px] bg-white w-56 h-60 p-4 rounded-2xl shadow-2xl"
              style={{ top: position.top, left: position.left }}>
            <h3 className="text-sm font-semibold mb-2">Add Member</h3>
            <div className="overflow-y-auto max-h-32 mt-3"> {/* Limit height for 4 items before scrolling */}
                <ul>
                    {tempMembers.map((member) => (
                        <li
                            key={member.id}
                            className={`flex items-center justify-between py-1 px-2 cursor-pointer gap-2 ${member.selected ? 'bg-gray-200 text-black' : 'text-gray-800'}`}
                            onClick={() => toggleTempSelect(member.id)}
                        >
                            <div className="flex text-xs items-center gap-2">
                                <img
                                    src={member.profilePic}
                                    alt={`${member.name}'s profile`}
                                    className="w-6 h-6 rounded-full"
                                />
                                <span>{member.name}</span>
                            </div>
                            {member.selected && (
                                <IoCheckmarkCircleSharp size={16} className="text-indigo-500" />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-4 flex justify-between">
                <button
                    onClick={handleCancelClick}
                    className="bg-gray-200 text-gray-500 py-1 px-2 text-xs rounded-md"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDoneClick}
                    className="bg-indigo-500 text-white py-1 px-2 text-xs rounded-md"
                >
                    Invite
                </button>
            </div>
        </div>
    );
};
