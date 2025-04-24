'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiFile, FiX, FiLock, FiGlobe } from 'react-icons/fi';
import { FileItem } from './FileStorageSystem';

type FileUploadZoneProps = {
  onFileUpload: (file: FileItem) => void;
};

const FileUploadZone = ({ onFileUpload }: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [category, setCategory] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setFile(file);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error state
    setError(null);
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!fileName.trim()) {
      setError('Please enter a file name');
      return;
    }
    
    if (!category) {
      setError('Please select a category');
      return;
    }
    
    // Validate file size (max 50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }
    
    // Start upload process
    setIsUploading(true);
    setUploadProgress(0);
    
    // Clear any previous timeouts
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 5;
      });
    }, 100);
    
    try {
      // Create form data for API upload
      const formData = new FormData();
      
      // Ensure the file is properly attached to the form
      if (!(file instanceof Blob)) {
        throw new Error('Invalid file object');
      }
      
      // Map UI category to valid backend type values (papers, datasets, experiments, images)
      const getFileTypeFromCategory = (category: string): string => {
        switch(category) {
          case 'Research':
          case 'Publication':
            return 'papers';
          case 'Dataset':
            return 'datasets';
          case 'Algorithm':
          case 'Case Study':
            return 'experiments';
          default:
            return 'datasets'; // Default fallback
        }
      };
      
      const fileType = getFileTypeFromCategory(category);
      console.log('Mapped category to file type:', { category, fileType });
      
      formData.append('file', file);
      formData.append('type', fileType); // Use mapped type instead of hardcoded 'datasets'
      formData.append('title', fileName.trim());
      formData.append('tags', JSON.stringify([category]));
      formData.append('isPrivate', isPrivate.toString());
      
      // Upload to API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      }).catch(err => {
        if (err.name === 'AbortError') {
          throw new Error('Upload request timed out. Please try again.');
        }
        throw err;
      });
      
      clearTimeout(timeoutId);
      
      // Clear progress interval
      clearInterval(progressInterval);
      
      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            errorMessage += `: ${errorData.details}`;
          }
        } catch (e) {
          // If we can't parse the error JSON, just use the status text
          errorMessage = `Upload failed with status ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      setUploadProgress(100);
      
      // Create a new file object with API response data
      const newFile: FileItem = {
        id: data.file.id,
        name: data.file.title,
        originalName: file.name,
        category,
        size: file.size,
        type: file.type,
        uploadTime: new Date(),
        uploadedBy: 'You', // In a real app, this would come from authentication
        url: data.file.url,
        isPrivate: isPrivate
      };
      
      // Notify parent component
      onFileUpload(newFile);
      
      // Reset form
      setFile(null);
      setFileName('');
      setCategory('');
      setIsPrivate(false);
      setIsUploading(false);
      setUploadProgress(0);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Clear progress interval if still running
      clearInterval(progressInterval);
      
      // Set appropriate error message
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === 'string') {
        setError(error);
      } else {
        setError('Failed to upload file. Please try again.');
      }
      
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName('');
    setCategory('');
    setIsPrivate(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const categories = ['Research', 'Case Study', 'Dataset', 'Algorithm', 'Publication'];

  return (
    <div className="card overflow-hidden">
      <h2 className="text-2xl font-bold mb-6">Upload File</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="fileName" className="block text-sm font-medium text-gray-300 mb-2">
            File Name
          </label>
          <input
            type="text"
            id="fileName"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
            placeholder="Enter a name for your file"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
            aria-label="File category"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Privacy
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md border ${
                !isPrivate 
                  ? 'bg-green-500/20 border-green-500/30 text-green-400' 
                  : 'bg-[var(--card-bg)] border-[var(--border)] text-gray-400 hover:bg-[var(--muted)]/10'
              } transition-colors duration-200`}
            >
              <FiGlobe size={18} />
              <span>Public</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPrivate(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md border ${
                isPrivate 
                  ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
                  : 'bg-[var(--card-bg)] border-[var(--border)] text-gray-400 hover:bg-[var(--muted)]/10'
              } transition-colors duration-200`}
            >
              <FiLock size={18} />
              <span>Private</span>
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            {isPrivate 
              ? 'Private files are only visible to you' 
              : 'Public files are visible to all users'}
          </p>
        </div>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 mb-6 ${
            isDragging
              ? 'border-[var(--secondary)] bg-[var(--secondary)]/10'
              : file
                ? 'border-[var(--accent)] bg-[var(--accent)]/5'
                : 'border-[var(--border)] hover:border-[var(--secondary)]/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!file ? (
            <div className="py-6">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <FiUpload className="mx-auto text-[var(--secondary)] mb-4" size={40} />
              </motion.div>
              <p className="text-gray-300 mb-2">
                Drag and drop your file here, or{' '}
                <label className="text-[var(--secondary)] cursor-pointer hover:underline">
                  browse
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>
              </p>
              <p className="text-gray-500 text-sm">
                Supported formats: PDF, JPG, PNG, MP4, etc.
              </p>
            </div>
          ) : (
            <div className="py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <FiFile className="text-[var(--accent)] mr-2" size={24} />
                  <div className="text-left">
                    <p className="text-white font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-white p-1"
                  aria-label="Remove file"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-md p-3 mb-6">
            {error}
          </div>
        )}
        
        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-[var(--muted)]/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
                initial={{ width: '0%' }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </div>
        )}
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isUploading}
            className={`btn btn-primary flex-grow ${
              isUploading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
          
          {file && !isUploading && (
            <button
              type="button"
              onClick={resetForm}
              className="btn bg-[var(--muted)] hover:bg-[var(--muted)]/70 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FileUploadZone; 