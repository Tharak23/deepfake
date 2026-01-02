'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiUpload, FiLink, FiFile, FiX, FiAlertCircle, FiCheck, FiLoader, FiAward, FiArrowLeft, FiPaperclip } from 'react-icons/fi';

export default function VerificationRequestPage() {
  const { user, status } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestType = searchParams.get('type') || 'standard';
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    fileLink: ''
  });
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  
  useEffect(() => {
    // No authentication required - allow access to verification request page
    // If user has 5 or more badges, show a message suggesting they refresh for automatic verification
    if (user?.badgesCount && user.badgesCount >= 5) {
      setSuccess('You have 5 or more badges! You should be automatically verified as a researcher. Please refresh the page or try again later.');
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');
    
    if (!file) {
      return;
    }
    
    // Check file type
    const allowedTypes = [
      'application/pdf', 
      'application/zip', 
      'application/x-zip-compressed', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setFileError('Invalid file type. Please upload a PDF, ZIP, or document file.');
      return;
    }
    
    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setFileError('File is too large. Maximum size is 10MB.');
      return;
    }
    
    setProjectFile(file);
  };
  
  const handleFileRemove = () => {
    setProjectFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate inputs
      if (!projectData.title.trim()) {
        throw new Error('Project title is required');
      }
      
      if (!projectData.description.trim()) {
        throw new Error('Project description is required');
      }
      
      if (!projectFile && !projectData.fileLink.trim()) {
        throw new Error('Either a project file or file link is required');
      }
      
      console.log('Preparing submission data with file:', projectFile?.name);
      
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('title', projectData.title);
      formData.append('description', projectData.description);
      
      // Add file or file link
      if (projectFile) {
        formData.append('projectFile', projectFile);
      }
      
      if (projectData.fileLink) {
        formData.append('fileLink', projectData.fileLink);
      }
      
      // Submit the project
      const response = await fetch('/api/user/request-verification', {
        method: 'POST',
        body: formData
      });
      
      let data;
      try {
        data = await response.json();
        console.log('Response from API:', response.status, data);
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
        throw new Error('Failed to parse server response. Please try again.');
      }
      
      if (!response.ok) {
        const errorMessage = data?.error || data?.details || data?.message || 'Failed to submit project';
        console.error('API error:', errorMessage);
        throw new Error(`Submission failed: ${errorMessage}`);
      }
      
      setSuccess(data.message || 'Your project has been submitted successfully! Our team will review it and get back to you soon.');
      setProjectData({
        title: '',
        description: '',
        fileLink: ''
      });
      setProjectFile(null);
      
      // Redirect to profile after a delay
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while submitting your project';
      console.error('Project submission error details:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <FiLoader className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <button
          onClick={() => router.push('/profile')}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" size={16} />
          Back to Profile
        </button>
        
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
              <FiAward className="mr-2 text-[var(--primary)]" size={24} />
              Project Submission for Researcher Verification
            </h1>
            
            <p className="text-gray-400 mb-6">
              Submit a project that demonstrates your knowledge and expertise in deepfake detection or research to be considered for Verified Researcher status.
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center text-red-400">
                <FiAlertCircle className="mr-2" size={18} />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center text-green-400">
                <FiCheck className="mr-2" size={18} />
                <span>{success}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-gray-300 text-sm font-medium mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={projectData.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your project title"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">
                  Project Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={projectData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe your project, its purpose, and what technologies or methods you used. Explain how it demonstrates your knowledge in the field."
                  required
                />
              </div>
              
              {/* File Upload */}
              <div>
                <label htmlFor="projectFile" className="block text-gray-300 text-sm font-medium mb-2">
                  Project File (PDF, ZIP, or document) *
                </label>
                
                {!projectFile ? (
                  <div className="relative">
                    <input
                      type="file"
                      id="projectFile"
                      name="projectFile"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.zip,.doc,.docx,.xls,.xlsx"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-gray-800/50 border border-gray-700 border-dashed rounded-md p-6 flex flex-col items-center justify-center hover:bg-gray-800/70 transition-colors"
                    >
                      <FiUpload className="text-indigo-400 mb-2" size={24} />
                      <span className="text-gray-300">Click to upload your project file</span>
                      <span className="text-gray-500 text-sm mt-1">
                        Supported formats: PDF, ZIP, DOC, DOCX, XLS, XLSX (Max 10MB)
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-md p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <FiFile className="text-indigo-400 mr-3" size={20} />
                      <div>
                        <p className="text-white font-medium">{projectFile.name}</p>
                        <p className="text-gray-500 text-sm">{(projectFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleFileRemove}
                      className="p-2 hover:bg-gray-700/50 rounded-full transition-colors"
                    >
                      <FiX className="text-gray-400" size={18} />
                    </button>
                  </div>
                )}
                
                {fileError && (
                  <p className="mt-2 text-red-400 text-sm flex items-center">
                    <FiAlertCircle className="mr-1" size={14} />
                    {fileError}
                  </p>
                )}
                
                <p className="text-gray-500 text-sm mt-2">
                  Your project file will be securely stored and only accessible to our verification team.
                </p>
              </div>
              
              {/* Alternate Link Option */}
              <div>
                <div className="flex items-center mb-2">
                  <label htmlFor="fileLink" className="block text-gray-300 text-sm font-medium">
                    Project Link (Optional if file is uploaded)
                  </label>
                  <span className="ml-2 text-xs text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded">
                    Alternative to file upload
                  </span>
                </div>
                <input
                  type="url"
                  id="fileLink"
                  name="fileLink"
                  value={projectData.fileLink}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Link to your project repository, document, or demo (GitHub, Google Drive, etc.)"
                />
                <p className="mt-1 text-gray-500 text-sm">
                  If you prefer to share a link instead of uploading a file, please provide a link to your project files, repository, or demo. Make sure the link is accessible to reviewers.
                </p>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-md shadow-lg shadow-indigo-900/30 transition-colors flex items-center"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" size={18} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiUpload className="mr-2" size={18} />
                      Submit Project
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 