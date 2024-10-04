import React from "react";

interface TaskProps {
  id: string,
  name: string;
  assignee: string;
  dueDate: string;
  status: string;
  comment: string;
}

const Task: React.FC<TaskProps> = ({
  id,
  name,
  assignee,
  dueDate,
  status,
  comment,
}) => {
  return (
    <div className="flex flex-col p-4 bg-white rounded-lg shadow-lg mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{name}</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            status === "Done"
              ? "bg-green-100 text-green-800"
              : status === "In Progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mt-2">
        <div>
          <span className="font-medium">Assignee: </span>
          {assignee}
        </div>
        <div>
          <span className="font-medium">Due Date: </span>
          {dueDate}
        </div>
      </div>
      <div className="mt-2 text-gray-700">
        <span className="font-medium">Comment: </span>
        {comment}
      </div>
    </div>
  );
};

export default Task;
