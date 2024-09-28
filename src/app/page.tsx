"use client";
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
  { type: "project", name: "Project name", href: "#" },
  { type: "task", name: "Task name", href: "#", fromProject: "Project name" },
  // More items...
];

// Define task and state structure for Kanban
interface Task {
  id: string;
  name: string;
  fromProject: string;
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
      {
        id: "task-1",
        name: "Task name",
        fromProject: "Project name",
      },
      {
        id: "task-2",
        name: "Task name",
        fromProject: "Project name",
      },
    ],
    inProgress: [],
    done: [],
  });

  // Handle drag and drop
  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

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

  const getGreeting = (hour: number): string => {
    if (hour >= 21 || hour < 6) {
      return "Good night";
    } else if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

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

  // Get the current date and time depending on options
  const currentDate = new Date().toLocaleString("en-US", options);
  // Create a Date object from the localized string (currentDate) to get the hour
  const currentHour = new Date(currentDate).getHours();

  const greetingMessage = getGreeting(currentHour);

  return (
    <div className="bg-white pb-24 sm:pb-32">
      {/* Greeting */}
      <div className="mx-auto max-w-7xl lg:px-8">
        <h2 className="text-left text-pretty text-2xl py-4 font-semibold text-gray-800">
          {greetingMessage}, {currentUser.firstName}
        </h2>
      </div>

      {/* Layout Grid */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-8">
        
        {/* Recently Opened Section */}
        <div className="relative bg-white rounded-lg p-6 overflow-hidden ring-1 ring-gray-200 hover:ring-gray-400">
          <h3 className="text-lg font-semibold text-gray-800">Recents</h3>
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
                  <div>
                    {item.name}
                    {/*Note: inside the parentheses is alredy true, so we just check if item.type is true and show it*/}
                    {item.type === "task" && (
                      <span className="ml-2 text-gray-400">
                        &gt; {item.fromProject}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Kanban Section */}
        <div className="relative bg-white shadow rounded-lg p-4 overflow-hidden lg:col-span-2 ring-1 ring-gray-200 hover:ring-gray-400">
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
                        <div className="flex items-center text-center mb-6">
                          <span
                            className={`flex items-center justify-center text-sm font-semibold p-1 px-2 rounded-full text-white ${
                              col === "todo"
                                ? "bg-orange-400"
                                : col === "inProgress"
                                ? "bg-blue-400"
                                : "bg-green-400"
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
                                className="flex p-4 mt-2 bg-white rounded-lg shadow select-none hover:bg-gray-100"  // Prevent drag and highlight the content instead
                              >
                                <span className="mr-2">
                                  <img src="/task.svg" alt="Task" />
                                </span>
                                {task.name}
                                <span className="ml-2 text-gray-400">
                                  &gt; {task.fromProject}
                                </span>
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
