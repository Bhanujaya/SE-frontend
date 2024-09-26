"use client"; 
import { Projects, ProjectsProps } from "./components/projects";
import { useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import { FaCalendarAlt } from 'react-icons/fa'; // Import calendar icon
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IoCameraSharp } from "react-icons/io5";
import { TfiClose } from "react-icons/tfi";


const projectsData: Omit<ProjectsProps, 'onFavoriteToggle'>[] = [
    {
      id: 1,
      projectName: "Project Name 1",
      creator: "Pleang",
      endDate: "12/02/24",
      description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs1xdLImF96hHZqmsAN66doFwYen9ZDW3Fbw&usqp=CAU',
      isFavorited: false,
    },
    // Other projects...
];

export default function Project() {
  const [projects, setProjects] = useState(projectsData);
  const [isPanelOpen, setIsPanelOpen] = useState(false); // State for controlling the panel
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // State for the uploaded image
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const handleFavoriteToggle = (id: number) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, isFavorited: !project.isFavorited } : project
    );
    setProjects(updatedProjects);
    console.log(`Project ${id} is now favorited: ${updatedProjects.find(p => p.id === id)?.isFavorited}`);
  };

  const handleNewProjectClick = () => {
    setIsPanelOpen(true); // Open the panel
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false); // Close the panel
  };


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl); // Set the uploaded image
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasDate(e.target.value !== ''); // Check if there's a date input
  };

  return ( 
    <div className="relative"> {/* To manage the position of the panel */}
       <div className="mb-14 mt-4 ml-6 flex justify-between items-center">
            <h1 className="text-3xl font-semibold">Project</h1>
            <button 
              className="bg-indigo-400 p-2.5 px-4 rounded-md text-base text-white font-semibold mr-10"
              onClick={handleNewProjectClick}
            >
                New Project
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 ml-16 mr-16">
          {projects.map(project => (
            <Projects
              key={project.id}
              {...project}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}

          {/* New Project box */}
          <div className="bg-gray-50 shadow-3xl rounded-xl overflow-hidden w-56 h-72 relative flex justify-center items-center cursor-pointer" onClick={handleNewProjectClick}
          >
            <div className="flex items-center gap-2 text-stone-400" >
              <FaPlus className="text-xl" />
              <h1 className="text-xl  font-semibold">New Project</h1>
            </div>
          </div>
        </div>

        {/* Conditional rendering of the sliding panel */}
        {isPanelOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
           <div className="bg-white w-5/12 h-4/6  rounded-lg shadow-lg relative">
        

            {/* Image Frame */}
    <div className="w-full h-2/5 mb-4 rounded-lg overflow-hidden relative">
    <button 
                   type="button" 
                   className="px-1 py-2 text-white rounded absolute top-2 right-3"
                   onClick={handleClosePanel}
                 >
                    <TfiClose className="w-5 h-6 text-gray-800" />

                 </button>
      <div
        className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-400 flex items-center justify-center"
        style={{ backgroundImage: uploadedImage ? `url(${uploadedImage})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        
      </div>

      {/* Button to upload image positioned at bottom right */}
      <div className="absolute  bg-gray-50 px-1 pl-2  rounded-lg right-3 bottom-3.5 flex shadow-xs hover:bg-gray-200">
      <IoCameraSharp className="mt-1.5" />

        <label className="cursor-pointer bg-gray-50 text-black p-1.5 px-1 text-xs rounded-md hover:bg-gray-200">
          Add Photo
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden"
          />
        </label>
      </div>
    </div>

             <form className="ml-8">
               <div className="mb-2">
                 <input 
                   type="text" 
                   className="w-4/5 p-2 text-xl rounded placeholder-slate-500 focus:border-transparent focus:outline-none" 
                   placeholder="Project Name"
                   maxLength={25}
                 />
               </div>
               <div className="mb-4">
                 <textarea 
                   className="w-11/12 p-3 rounded focus:border-transparent focus:outline-none" 
                   placeholder="Description"
                   maxLength={120}
                 ></textarea>

               </div>
               
               <div className="mb-4 ml-2 mt-8">
               <div className="relative w-2/3">
      {/* Calendar Icon */}
      <div className="absolute inset-y-0 z-20 left-0 flex items-center pl-3 pointer-events-none">
        <FaCalendarAlt className="text-slate-400" />
      </div>

      {/* Custom Date Picker Input */}
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => setSelectedDate(date)}
        placeholderText="Due date"
        className="w-3/5 placeholder-xl pl-10 pr-2 py-2 px-1 z-10 border text-gray-500 placeholder-slate-400 border-slate-500 rounded-xl"
        dateFormat="dd/MM/yyyy"
      />
    </div>
            
               </div>
               <div className="border-b ml-2 w-11/12 border-gray-300 mt-6"></div>


               <div className="flex ml-96 mt-4  ">
               
                 <button 
                   type="submit" 
                   className="px-5 py-3 bg-indigo-400 text-white rounded-lg hover:bg-indigo-600 "
                 >
                   Create Project
                 </button>
               </div>
             </form>
           </div>
         </div>
       )}
   </div>
  );
}
