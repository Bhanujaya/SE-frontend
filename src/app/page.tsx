"use client";
import Image from "next/image";
import Link from "next/link";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "react-beautiful-dnd";
import { useState } from "react";

// mock data
const currentUser = {
  firstName: "Nichakann",
  surName: "Nernngam",
};

const recentlyOpens = [
  { name: "Project name", type: "project",  href: "/project" },
  { name: "Project name", type: "project",  href: "/project" },
  { name: "Task name",    type: "task",     href: "/project/task-1" },
  { name: "Task name",    type: "task",     href: "/project/task-1" },
  { name: "Project name", type: "project",  href: "/project" },
  { name: "Project name", type: "project",  href: "/project" },
  { name: "Task name",    type: "task",     href: "/project/task-1" },
  // More items...
];

// Define task and state structure for Kanban
interface Task {
  id: string;
  content: string;
}

interface TaskState {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}

export default function Homepage() {
  // Initial Kanban task state
  const [tasks, setTasks] = useState<TaskState>({
    todo: [
      { id: "task-1", content: "Task 1" },
      { id: "task-2", content: "Task 2" },
      { id: "task-5", content: "Task 5" },
      { id: "task-6", content: "Task 6" },
      { id: "task-7", content: "Task 7" },
    ],
    inProgress: [{ id: "task-3", content: "Task 3" }],
    done: [{ id: "task-4", content: "Task 4" }],
  });

  // Handle drag and drop
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return; // If dropped outside a list

    const sourceCol = source.droppableId as keyof TaskState;
    const destCol = destination.droppableId as keyof TaskState;

    // If dropped within the same column
    if (sourceCol === destCol) {
      const newColumnTasks = Array.from(tasks[sourceCol]);
      const [movedTask] = newColumnTasks.splice(source.index, 1);
      newColumnTasks.splice(destination.index, 0, movedTask);
      setTasks((prev) => ({ ...prev, [sourceCol]: newColumnTasks }));
    } else {
      // If dropped into a different column
      const startColTasks = Array.from(tasks[sourceCol]);
      const finishColTasks = Array.from(tasks[destCol]);
      const [movedTask] = startColTasks.splice(source.index, 1);
      finishColTasks.splice(destination.index, 0, movedTask);

      setTasks((prev) => ({
        ...prev,
        [sourceCol]: startColTasks,
        [destCol]: finishColTasks,
      }));
    }
  };

  // Date options for greeting
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Bangkok",
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
    hour12: false,
  };

  const getGreeting = (): string => {
    const now = new Date();
    const currentHour = now.getHours();
    if (currentHour >= 21 || currentHour < 6) {
      return "Good night";
    } else if (currentHour < 12) {
      return "Good morning";
    } else if (currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  const greetingMessage = getGreeting();

  return (
    <div className="bg-gray-50 pb-24 sm:pb-32">
      {/* Greeting */}
      <div className="mx-auto max-w-7xl lg:px-8">
        <h2 className="text-left text-pretty text-2xl py-4 font-semibold text-gray-800">
          {greetingMessage}, {currentUser.firstName}
        </h2>
      </div>

      {/* Layout Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-8">
        {/* Recently Opened Section */}
        <div className="relative bg-white shadow rounded-lg p-6 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-800">
            Recently Opened
          </h3>
          <div className="mt-4 max-h-[250px] overflow-y-auto">
            {recentlyOpens.map((item) => (
              <Link key={item.name} href={item.href}>
                <div className="hover:bg-gray-100 p-2 flex items-center space-x-4 cursor-pointer">
                  <img
                    src={
                      item.type === "project"
                        ? "/project-recent.svg"
                        : "/task.svg"
                    }
                    alt={item.type}
                    className="w-6"
                  />
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Kanban Section */}
        <div className="relative bg-white shadow rounded-lg p-4 overflow-hidden lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 text-left">
            My Works
          </h3>
          <div className="mt-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-3 gap-4">
                {["todo", "inProgress", "done"].map((col) => (
                  <Droppable droppableId={col} key={col}>
                    {(provided: DroppableProvided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="p-4 bg-gray-200 rounded-lg h-[15rem] overflow-y-auto"
                      >
                        <div className="flex justify-center items-center text-center">
                          <span
                            className={`flex items-center justify-center text-sm font-semibold p-1 px-2 rounded-full text-white ${
                              col === "todo"
                                ? "bg-orange-500"
                                : col === "inProgress"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            } whitespace-nowrap`}
                          >
                            <img src="todo.svg" alt={col} className="mr-2" />{" "}
                            {col === "todo"
                              ? "To Do"
                              : col === "inProgress"
                              ? "In Progress"
                              : "Done"}
                          </span>
                        </div>

                        {tasks[col as keyof TaskState].map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided: DraggableProvided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-2 mt-2 bg-white rounded-lg shadow"
                              >
                                {task.content}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
}
