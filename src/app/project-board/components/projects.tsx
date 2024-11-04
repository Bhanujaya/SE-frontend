"use client";
import React from 'react';
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";

export type ProjectsProps = {
  id: string;
  projectName: string;
  creator: string;
  endDate: string;
  description: string;
  imageUrl: string;
  isFavorited: boolean;
  onFavoriteToggle: (id: string) => void;
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
    <div className="bg-white shadow-lg rounded-xl overflow-hidden w-56 h-72 relative hover:shadow-xl transition-shadow duration-300">
      <div className="h-36">
        <img
          className="h-full w-full object-cover"
          src={imageUrl}
          alt="Project image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.png";
          }}
        />
      </div>
      <div className="p-4 flex flex-col h-36">
        <div className="flex gap-1 items-center mb-2">
          <img
            src="/project-recent.svg"
            alt="Project"
            className="w-5 h-5"
          />
          <div className='font-semibold text-lg'>{projectName}</div>
        </div>
        <div className="text-gray-600 text-sm mb-2">{description}</div>
        <div className="text-gray-500 text-xs mt-auto text-right">
          end date - {endDate}
        </div>
      </div>
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(id);
          }}
          className="p-1 hover:bg-white hover:bg-opacity-50 rounded-full transition-colors duration-200"
        >
          {isFavorited ? (
            <GoStarFill size={24} className="text-yellow-400" />
          ) : (
            <GoStar size={24} className="text-gray-400 hover:text-yellow-400" />
          )}
        </button>
      </div>
    </div>
  );
}