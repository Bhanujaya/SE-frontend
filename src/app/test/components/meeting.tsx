"use client";

import React from 'react';
import { CiCalendar } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import { TfiClose } from "react-icons/tfi";


type MainPanelProps = {
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
    time: string;
    setTime: (time: string) => void;
    selectedMembers: { id: number; name: string; profilePic: string }[];
    handleAddMemberClick: () => void;
    handleClosePanel: () => void;
};

export const Meeting: React.FC<MainPanelProps> = ({
    selectedDate,
    setSelectedDate,
    time,
    setTime,
    selectedMembers,
    handleAddMemberClick,
    handleClosePanel,
}) => {
    return (
        <div className="bg-white w-5/12 h-3/5 rounded-lg shadow-2xl relative p-2 z-20 flex">
            <div className="w-9/12 p-5"> {/* Left side for form */}
                <button
                    onClick={handleClosePanel}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    <TfiClose className="w-4 h-4 text-gray-800" />
                </button>

                <div className="flex gap-2.5 items-center mt-5 mb-2">
                    <CiCalendar size={24} />
                    <div className="font-md text-lg">Meeting</div>
                </div>

                <form className="ml-2">
                    <div className="mb-2">
                        <input
                            type="text"
                            className="w-full p-2 text-xl rounded placeholder-slate-500 focus:border-transparent focus:outline-none font-medium placeholder:font-normal"
                            placeholder="Meeting Name"
                            maxLength={25}
                        />
                    </div>
                    <div className="mb-2 ml-1 flex gap-0.5 items-center">
                        <IoLocationOutline size={20} />
                        <input
                            type="text"
                            className="w-full p-2 text-base rounded placeholder-slate-500 focus:border-transparent focus:outline-none"
                            placeholder="Location"
                            maxLength={40}
                        />
                    </div>
                    <div className="mb-2 ml-1">
                        <textarea
                            className="w-full p-1 rounded focus:border-transparent text-base focus:outline-none resize-none"
                            placeholder="Description"
                            maxLength={120}
                            rows={3}
                        ></textarea>
                    </div>

                    <div className="mb-4 ml-2 mt-8 flex gap-2">
                        {/* Date Picker */}
                        <div className="relative w-32">
                            <div className="absolute inset-y-0 z-20 left-0 flex items-center pl-3 pointer-events-none">
                                <FaCalendarAlt className="text-slate-400" />
                            </div>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date | null) => setSelectedDate(date)}
                                placeholderText="Due date"
                                className="w-full placeholder-xl pl-8 pr-2 py-2 px-1 z-10 border text-gray-500 placeholder-slate-400 border-slate-500 rounded-xl"
                                dateFormat="dd/MM/yyyy"
                            />
                        </div>

                        {/* Time Picker */}
                        <div className="relative w-32">
                            <input
                                type="time"
                                onChange={(e) => setTime(e.target.value)}
                                value={time}
                                className="text-gray-600 placeholder-slate-400 rounded-lg focus:outline-none border-none w-full h-10 px-2"
                            />
                        </div>
                    </div>
                </form>
            </div>

            <div className="w-5/12 p-5 relative"> {/* Right side for members */}
                <h3 className="text-base font-medium mt-14">Member</h3>

                {/* Scrollable member list */}
                <div className="overflow-y-auto max-h-32 mt-2">
                    <ul className="flex flex-col gap-1">
                        {selectedMembers.length > 0 ? (
                            selectedMembers.map((member) => (
                                <li key={member.id} className="py-0.5">
                                    <div className="flex text-xs items-center gap-2">
                                        <img
                                            src={member.profilePic}
                                            alt={`${member.name}'s profile`}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span>{member.name}</span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p></p>
                        )}
                    </ul>
                </div>

                {/* + Member button outside the scrollable area */}
                <div className="mt-2 flex items-center justify-center gap-1.5 text-stone-400" onClick={handleAddMemberClick}>
                    <span className="text-xl">+</span>
                    <h1 className="text-xs">Add Member</h1>
                </div>
            </div>
        </div>
    );
};
