"use client";
import { useState, useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { TfiClose } from "react-icons/tfi";
import { IoCameraSharp } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from 'next/link';
import { Projects } from './components/projects';

type UUID = string;

interface ProjectResponse {
  projectId: UUID;
  projectName: string;
  projectDescription: string;
  projectDeadline: Date;
  projectFav: "FAVOUR" | "UNFAVOURED";
  projectOwnerId: UUID;
  projectImg: string;
}

interface ProjectRequest {
  projectName: string;
  projectDescription: string;
  projectDeadline: Date;
  projectOwnerId: UUID;
  projectImg: string;
}

interface StoredUserData {
  token: string;
  memberId: UUID;
  email: string;
  detail: {
    memberEmail: string;
    memberName: string;
    username: string;
  };
}

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

export default function Project() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [currentUserId, setCurrentUserId] = useState<UUID | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newProject, setNewProject] = useState<{
    projectName: string;
    projectDescription: string;
    projectImg: string;
  }>({
    projectName: "",
    projectDescription: "",
    projectImg: "?"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<StoredUserData | null>(null);

  const getAuthHeader = (token: string): string => {
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  };

  useEffect(() => {
    const storedData = localStorage.getItem("jwt");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (!parsedData.detail?.memberEmail) {
          throw new Error("Email not found in user data");
        }
        setUserData({
          ...parsedData,
          email: parsedData.detail.memberEmail
        });
        fetchProjects({
          ...parsedData,
          email: parsedData.detail.memberEmail
        });
      } catch (error) {
        console.error("Error parsing JWT data:", error);
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchProjects = async (userInfo: StoredUserData) => {
    try {
      const response = await fetch(`http://localhost:9000/project/${userInfo.email}`, {
        headers: {
          'Authorization': getAuthHeader(userInfo.token)
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch projects: ${errorText}`);
      }

      const data = await response.json();
      setProjects(data);

      if (data.length > 0) {
        setCurrentUserId(data[0].projectOwnerId);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userData) {
      try {
        setIsLoading(true);
        setError(null);
        setUploadProgress(0);

        // Show preview immediately
        const previewUrl = URL.createObjectURL(file);
        setUploadedImage(previewUrl);

        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(file);

        // Update the project state with the Cloudinary URL
        setNewProject(prev => ({
          ...prev,
          projectImg: cloudinaryUrl
        }));

        setUploadProgress(100);
      } catch (error) {
        console.error('Error processing image:', error);
        setError('Failed to upload image');
        setUploadedImage(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFavoriteToggle = async (projectId: UUID) => {
    if (!userData) {
      window.location.href = '/login';
      return;
    }

    try {
      const currentProject = projects.find((p) => p.projectId === projectId);
      if (!currentProject) return;

      const newStatus = currentProject.projectFav === "FAVOUR" ? "UNFAVOURED" : "FAVOUR";

      const response = await fetch("http://localhost:9000/project/update-favour", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
          'Authorization': getAuthHeader(userData.token)
        },
        body: JSON.stringify({ projectId, projectFav: newStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update favorite status: ${errorText}`);
      }

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.projectId === projectId ? { ...project, projectFav: newStatus } : project
        )
      );
    } catch (err) {
      console.error("Error updating favorite status:", err);
      setError("Failed to update favorite status");
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) {
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!selectedDate) {
      setError("Please select a due date");
      setIsLoading(false);
      return;
    }

    try {
      const projectRequest: ProjectRequest = {
        projectName: newProject.projectName,
        projectDescription: newProject.projectDescription,
        projectDeadline: selectedDate,
        projectOwnerId: userData.memberId,
        projectImg: newProject.projectImg
      };

      const response = await fetch("http://localhost:9000/project/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Accept': 'application/json',
          'Authorization': getAuthHeader(userData.token)
        },
        body: JSON.stringify(projectRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create project: ${errorText}`);
      }

      const createdProject = await response.json();
      setProjects((prev) => [...prev, createdProject]);
      setIsPanelOpen(false);
      resetForm();

      await fetchProjects(userData);
    } catch (err) {
      console.error("Error creating project:", err);
      setError(err instanceof Error ? err.message : "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewProject({
      projectName: "",
      projectDescription: "",
      projectImg: "?"
    });
    setSelectedDate(null);
    setUploadedImage(null);
    setUploadProgress(0);
  };

  const convertToProjectProps = (project: ProjectResponse) => ({
    id: project.projectId,
    projectName: project.projectName,
    creator: project.projectOwnerId,
    endDate: new Date(project.projectDeadline).toLocaleDateString(),
    description: project.projectDescription,
    imageUrl: project.projectImg !== "?" ? project.projectImg : "/placeholder.png",
    isFavorited: project.projectFav === "FAVOUR",
    onFavoriteToggle: (id: string) => handleFavoriteToggle(id)
  });

  return (
    <div className="relative">
      <div className="mb-14 mt-4 ml-6 flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Projects</h1>
        <button
          className="bg-indigo-400 p-2.5 px-4 rounded-md text-base text-white font-semibold mr-10 hover:bg-indigo-500"
          onClick={() => setIsPanelOpen(true)}
        >
          New Project
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-center mb-4 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 ml-16 mr-16">
        {projects.map((project) => (
          <Link key={project.projectId} href={`/project-board/${project.projectId}`}>
            <div onClick={(e) => e.preventDefault()}>
              <Projects {...convertToProjectProps(project)} />
            </div>
          </Link>
        ))}

        <div
          className="bg-gray-50 shadow-3xl rounded-xl overflow-hidden w-56 h-72 relative flex justify-center items-center cursor-pointer hover:bg-gray-100"
          onClick={() => setIsPanelOpen(true)}
        >
          <div className="flex items-center gap-2 text-stone-400">
            <div className="text-xl">+</div>
            <h1 className="text-xl font-semibold">New Project</h1>
          </div>
        </div>
      </div>

      {isPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-5/12 h-4/5 rounded-lg shadow-lg relative">
            <div className="w-full h-2/5 mb-4 rounded-lg overflow-hidden relative">
              <button
                type="button"
                className="px-1 py-2 text-white rounded absolute top-2 right-3 z-10"
                onClick={() => setIsPanelOpen(false)}
              >
                <TfiClose className="w-5 h-6 text-gray-800" />
              </button>

              <div
                className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-400 flex items-center justify-center"
                style={{
                  backgroundImage: uploadedImage ? `url(${uploadedImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white">Uploading... {uploadProgress}%</div>
                  </div>
                )}
              </div>

              <div className="absolute bg-gray-50 px-1 pl-2 rounded-lg right-3 bottom-3.5 flex shadow-xs hover:bg-gray-200">
                <IoCameraSharp className="mt-1.5" />
                <label className="cursor-pointer bg-gray-50 text-black p-1.5 px-1 text-xs rounded-md hover:bg-gray-200">
                  {isLoading ? "Uploading..." : "Add Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>

            <form onSubmit={handleCreateProject} className="ml-8">
              <div className="mb-2">
                <input
                  type="text"
                  value={newProject.projectName}
                  onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
                  className="w-4/5 p-2 text-xl rounded placeholder-slate-500 focus:border-transparent focus:outline-none"
                  placeholder="Project Name"
                  maxLength={25}
                  required
                />
              </div>

              <div className="mb-4">
                <textarea
                  value={newProject.projectDescription}
                  onChange={(e) => setNewProject({ ...newProject, projectDescription: e.target.value })}
                  className="w-11/12 p-3 rounded focus:border-transparent focus:outline-none"
                  placeholder="Description"
                  maxLength={120}
                  required
                />
              </div>

              <div className="mb-4 ml-2 mt-8">
                <div className="relative w-2/3">
                  <div className="absolute inset-y-0 z-20 left-0 flex items-center pl-3 pointer-events-none">
                    <FaCalendarAlt className="text-slate-400" />
                  </div>

                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    placeholderText="Due date"
                    className="w-3/5 placeholder-xl pl-10 pr-2 py-2 px-1 z-10 border text-gray-500 placeholder-slate-400 border-slate-500 rounded-xl"
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                  />
                </div>
              </div>

              <div className="border-b ml-2 w-11/12 border-gray-300 mt-6" />

              <div className="flex ml-96 mt-4">
                <button
                  type="submit"
                  className="px-5 py-3 bg-indigo-400 text-white rounded-lg hover:bg-indigo-600 disabled:bg-indigo-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

