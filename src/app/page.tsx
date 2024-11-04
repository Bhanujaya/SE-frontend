"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MdCheckBoxOutlineBlank } from "react-icons/md";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import Calendar from './Calendar';


interface KanBanResponse {
  taskId: string;  // UUID
  taskName: string;
  projectName: string;
  status: 'TODO' | 'PROGRESS' | 'DONE';
}

interface RecentlyViewResponse {
  recentlyViewId: string;  // UUID
  recentlyViewName: string;
  viewId: string;  // UUID
}

interface HomeResponse {
  tasks: KanBanResponse[];
  recentlyViews: RecentlyViewResponse[];
}

interface TaskState {
  todo: KanBanResponse[];
  progress: KanBanResponse[];
  done: KanBanResponse[];
}

interface StoredUserData {
  token: string;
  memberId: string;
  detail: {
    memberEmail: string;
    memberName: string;
    username: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

export default function Homepage() {
  const [homeData, setHomeData] = useState<{
    tasks: TaskState;
    recentlyViews: RecentlyViewResponse[];
  }>({
    tasks: {
      todo: [],
      progress: [],
      done: [],
    },
    recentlyViews: [],
  });
  const [userData, setUserData] = useState<StoredUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 21 || hour < 6) return "Good night";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getAuthHeader = (token: string): string => {
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  };

  const fetchHomeData = async (userInfo: StoredUserData) => {
    try {
      console.log("before " + userInfo.token)
      const response = await fetch(`${API_BASE_URL}/?m=${userInfo.memberId}`, {
        headers: {
          'Authorization': getAuthHeader(userInfo.token)
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch home data');
      }

      const data: HomeResponse = await response.json();

      console.log(data)

      const groupedTasks = {
        todo: data.tasks.filter(task => task.status === 'TODO'),
        progress: data.tasks.filter(task => task.status === 'PROGRESS'),
        done: data.tasks.filter(task => task.status === 'DONE')
      };

      setHomeData({
        tasks: groupedTasks,
        recentlyViews: data.recentlyViews
      });
    } catch (err) {
      console.error("Error fetching home data:", err);
      setError(err instanceof Error ? err.message : "Failed to load home data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("jwt");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (!parsedData.detail?.memberEmail) {
          throw new Error("Email not found in user data");
        }
        setUserData(parsedData);
        fetchHomeData(parsedData);
      } catch (error) {
        console.error("Error parsing JWT data:", error);
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  const onDragEnd = async (result: DropResult) => {
    if (!userData || !result.destination) return;

    const { source, destination, draggableId } = result;

    try {
      const sourceCol = source.droppableId as keyof TaskState;
      const destCol = destination.droppableId as keyof TaskState;

      const newTasks = { ...homeData.tasks };
      const [movedTask] = newTasks[sourceCol].splice(source.index, 1);
      movedTask.status = destCol === 'todo' ? 'TODO' :
        destCol === 'progress' ? 'PROGRESS' : 'DONE';
      newTasks[destCol].splice(destination.index, 0, movedTask);

      setHomeData(prev => ({
        ...prev,
        tasks: newTasks
      }));
      

      console.log(draggableId)
      console.log(movedTask.status)
      const response = await fetch(`${API_BASE_URL}/task/update-status?t=${draggableId}&s=${movedTask.status}`, {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(userData.token),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      if (userData) {
        await fetchHomeData(userData);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">
        {getGreeting()}, {userData?.detail.memberName}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recently Viewed Section */}
        <div className="bg-white rounded-lg p-6 shadow h-[300px] flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Recently visited</h2>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {homeData.recentlyViews.map((item) => (
              <Link
                href={`/project-board/${item.viewId}`}
                key={item.recentlyViewId}
              >
                <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md">
                  <img
                    src="/project-recent.svg"
                    alt="Project"
                    className="w-5 h-5"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {item.recentlyViewName}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-lg p-4 shadow h-[300px] flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Calendar</h2>
          <div className="overflow-y-auto flex-1 pr-2">
            <Calendar />
          </div>
        </div>

        {/* My Works Section */}
        <div className="lg:col-span-3 bg-white rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold mb-6">My Works</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['todo', 'progress', 'done'] as const).map((column) => (
                <Droppable droppableId={column} key={column}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-gray-50 rounded-lg p-4 flex flex-col h-[300px]"
                    >
                      <div className="flex items-center mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${column === 'todo'
                              ? 'bg-orange-100 text-orange-600'
                              : column === 'progress'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-green-100 text-green-600'
                            }`}
                        >
                          {column === 'todo'
                            ? 'To Do'
                            : column === 'progress'
                              ? 'In Progress'
                              : 'Done'}
                        </span>
                      </div>

                      <div className="overflow-y-auto flex-1 pr-2">
                        {homeData.tasks[column].map((task, index) => (
                          <Draggable
                            key={task.taskId}
                            draggableId={task.taskId}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white p-3 rounded-md shadow-sm mb-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <MdCheckBoxOutlineBlank size={12} className="text-indigo-500" />
                                  <span className="font-medium">{task.taskName}</span>
                                  <span className="text-sm text-gray-500">
                                    from {task.projectName}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}