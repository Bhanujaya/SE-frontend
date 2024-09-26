"use client";

import React from 'react';
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";
import { GoProjectRoadmap } from "react-icons/go";

export type ProjectsProps = {
  id: Number;
  projectName: String;
  creator: String;
  endDate: String;
  description: String;
  imageUrl: string;
  isFavorited: Boolean;
  onFavoriteToggle: (id: Number) => void;
};

export function Projects({
  id,
  projectName,
  creator,
  endDate,
  description,
  imageUrl,
  isFavorited,
  onFavoriteToggle,
}: ProjectsProps) {
  return (
    <div className="bg-white shadow-3xl rounded-xl overflow-hidden w-56 h-72 relative">
      <img className="h-1/2 w-full object-cover" src={imageUrl} alt="Project image" />
      <div className="text-base mt-2 ml-1.5 flex flex-col space-y-1 justify-between">
        <div className="flex gap-1 items-center ml-2">
        <GoProjectRoadmap />

          <div className='font-semibold '>{projectName}</div>
        </div>
        <div className=" text-xs ml-3">{description}</div>
      </div>
      <div className="absolute bottom-4 text-gray-400 right-4 flex items-center text-sm  font-light">
        <span className="mr-1">end date -</span>
        <span>{endDate}</span>
      </div>

      {/* Favorite Button */}
      <div className="absolute top-2 right-2">
        <button onClick={() => onFavoriteToggle(id)}>
          {isFavorited ? (
            <GoStarFill size={24} className="text-yellow-400 mt-1" />
          ) : (
            <GoStar size={24} className='mt-1' />
          )}
        </button>
      </div>
    </div>
  );
}
