"use client";

import React, { useState } from 'react';
import { Meeting } from './components/meeting'; // Adjust the path according to your file structure
import { AddMemberPopup } from './components/addmember'; // Adjust the path according to your file structure

export default function Test() {
    const [time, setTime] = useState('00:00');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility state
    const [isMainPanelOpen, setIsMainPanelOpen] = useState(true); // Main panel visibility state
    const [members, setMembers] = useState([
        { id: 1, name: "Member 1", selected: false, profilePic: 'https://via.placeholder.com/40' },
        { id: 2, name: "Member 2", selected: false, profilePic: 'https://via.placeholder.com/40' },
        { id: 3, name: "Member 3", selected: false, profilePic: 'https://via.placeholder.com/40' },
        { id: 4, name: "Member 4", selected: false, profilePic: 'https://via.placeholder.com/40' },
        { id: 5, name: "Member 5", selected: false, profilePic: 'https://via.placeholder.com/40' },
    ]);
    const [selectedMembers, setSelectedMembers] = useState<{ id: number; name: string; profilePic: string }[]>([]);

    const handleAddMemberClick = () => {
        setIsPopupOpen(true);
    };

    const handleClosePanel = () => {
        setIsMainPanelOpen(false);
    };

    const toggleTempSelect = (id: number) => {
        setMembers((prevMembers) =>
            prevMembers.map((member) =>
                member.id === id ? { ...member, selected: !member.selected } : member
            )
        );
    };

    const handleDoneClick = () => {
        const newMembers = members.filter(member => member.selected);
        setSelectedMembers([...selectedMembers, ...newMembers]);
        setIsPopupOpen(false);
        // Reset selected state
        setMembers(members.map(member => ({ ...member, selected: false })));
    };

    const handleCancelClick = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
            {isMainPanelOpen && (
                <Meeting
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    time={time}
                    setTime={setTime}
                    selectedMembers={selectedMembers}
                    handleAddMemberClick={handleAddMemberClick}
                    handleClosePanel={handleClosePanel}
                />
            )}
            {isPopupOpen && (
                <AddMemberPopup
                    tempMembers={members}
                    toggleTempSelect={toggleTempSelect}
                    handleDoneClick={handleDoneClick}
                    handleCancelClick={handleCancelClick}
                />
            )}
        </div>
    );
}
