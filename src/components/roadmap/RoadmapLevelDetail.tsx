'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiTrash, FiCheck, FiX, FiAward, FiVideo, FiFileText } from 'react-icons/fi';
import React, { KeyboardEvent } from 'react';

export type Resource = {
  type: string;
  title: string;
  description: string;
  duration: string;
  link: string;
};

export type Level = {
  id: number;
  title: string;
  description: string;
  status: string;
  badge: string;
  badgeColor: string;
  icon: any;
  x: string;
  y: string;
  resources: Resource[];
};

type RoadmapLevelDetailProps = {
  level: Level;
  fileUploads: string[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isCompleted: boolean;
  canComplete: boolean;
  onComplete: () => void;
};

const RoadmapLevelDetail = ({
  level,
  fileUploads,
  onFileUpload,
  isCompleted,
  canComplete,
  onComplete,
}: RoadmapLevelDetailProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Convert FileList to array and extract names
      const files = Array.from(e.dataTransfer.files);
      const event = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onFileUpload(event);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  const renderIcon = (type: string) => {
    return type === 'video' ? 
      <FiVideo className="text-indigo-400" size={20} /> : 
      <FiFileText className="text-purple-400" size={20} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="ml-16 mt-4 mb-10 relative"
    >
      {/* Left border line decoration */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800 z-0"></div>
      
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 z-10 relative">
        {/* Badge information */}
        {isCompleted ? (
          <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-800/50 rounded-lg flex items-center">
            <div className="p-2 bg-yellow-500 rounded-full mr-3">
              <FiAward size={20} className="text-yellow-900" />
            </div>
            <div>
              <h4 className="text-yellow-400 font-semibold">Badge Earned: {level.badge}</h4>
              <p className="text-yellow-500/70 text-sm">
                You've completed this level and earned the {level.badge} badge! This counts toward your Verified Researcher status.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-indigo-900/20 border border-indigo-800/50 rounded-lg flex items-center">
            <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full mr-3">
              <FiAward size={20} className="text-indigo-400" />
            </div>
            <div>
              <h4 className="text-indigo-400 font-semibold">Badge Available: {level.badge}</h4>
              <p className="text-indigo-500/70 text-sm">
                Complete this level to earn the {level.badge} badge and progress toward Verified Researcher status.
              </p>
            </div>
          </div>
        )}
        
        {/* Learning steps */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Learning Steps</h4>
          <div className="space-y-2">
            {level.resources && level.resources.map((resource, index) => (
              <div 
                key={index}
                className="flex items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="mr-3">
                  {renderIcon(resource.type)}
                </div>
                <div className="flex-1">
                  <span className="text-gray-300">{resource.title}</span>
                  <div className="text-xs text-gray-500 mt-1">{resource.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Upload section */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            Required Uploads
            <span className="ml-auto text-xs font-normal text-gray-400">
              {fileUploads.length}/{level.resources ? level.resources.length : 0} uploaded
            </span>
          </h4>
          
          {/* File upload dropzone */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              dragActive
                ? 'border-indigo-500 bg-indigo-900/20'
                : 'border-gray-700 bg-gray-800/30'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id={`fileUpload-${level.id}`}
              className="hidden"
              onChange={onFileUpload}
              multiple
            />
            <label
              htmlFor={`fileUpload-${level.id}`}
              className="cursor-pointer"
            >
              <div className="flex flex-col items-center">
                <FiUpload
                  size={30}
                  className="text-indigo-400 mb-3"
                />
                <p className="text-gray-300 mb-1">
                  Drag & drop files or click to upload
                </p>
                <p className="text-sm text-gray-500">
                  {level.resources ? level.resources.map(r => r.title.split(':')[0]).join(', ') : 'Required files'}
                </p>
              </div>
            </label>
          </div>
          
          {/* Uploaded files list */}
          {fileUploads.length > 0 && (
            <div className="mt-4 space-y-2">
              <h5 className="text-gray-400 text-sm font-medium">Uploaded files:</h5>
              {fileUploads.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 bg-gray-800 rounded border border-gray-700"
                >
                  <span className="flex-1 text-gray-300 text-sm truncate">
                    {file}
                  </span>
                  <button className="text-gray-500 hover:text-red-400">
                    <FiTrash size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Completion status */}
        <div>
          {isCompleted ? (
            <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-3 flex items-center">
              <FiCheck size={20} className="text-green-400 mr-2" />
              <span className="text-green-400">Level completed</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                onClick={onComplete}
                disabled={!canComplete}
                className={`py-2 px-4 rounded-lg font-medium flex items-center justify-center sm:flex-1 ${
                  canComplete
                    ? `bg-gradient-to-r ${level.badgeColor} text-white`
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FiCheck className="mr-2" size={18} />
                {canComplete 
                  ? `Complete Level & Earn ${level.badge} Badge` 
                  : 'Upload Required Files to Complete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RoadmapLevelDetail; 