import React from 'react';
import { IoCheckmarkCircleSharp } from 'react-icons/io5';

interface Member {
  memberId: string;
  memberName: string;
  memberLastName: string;
  img: string | null;
  selected?: boolean;
}

interface AddMemberPopupProps {
  tempMembers: Member[];
  toggleTempSelect: (memberId: string) => void;
  handleDoneClick: () => void;
  handleCancelClick: () => void;
  position: { top: number; left: number };
}

const AddMemberPopup: React.FC<AddMemberPopupProps> = ({
  tempMembers,
  toggleTempSelect,
  handleDoneClick,
  handleCancelClick,
  position,
}) => {
  return (
    <div
      className="absolute z-50 bg-white w-64 h-80 p-4 rounded-2xl shadow-2xl"
      style={{ top: position.top, left: position.left }}
    >
      <h3 className="text-sm font-semibold mb-2">Add Member</h3>
      <div className="overflow-y-auto max-h-56 mt-3">
        <ul>
          {tempMembers.map((member) => (
            <li
              key={member.memberId}
              className={`flex items-center justify-between py-2 px-2 cursor-pointer gap-2 ${
                member.selected ? 'bg-gray-200 text-black' : 'text-gray-800'
              }`}
              onClick={() => toggleTempSelect(member.memberId)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={member.img || 'https://via.placeholder.com/40'}
                  alt={`${member.memberName}'s profile`}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm">{member.memberName}</span>
              </div>
              {member.selected && (
                <IoCheckmarkCircleSharp size={20} className="text-indigo-500" />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={handleCancelClick}
          className="bg-gray-200 text-gray-500 py-1 px-4 text-sm rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleDoneClick}
          className="bg-indigo-500 text-white py-1 px-4 text-sm rounded-md"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default AddMemberPopup;