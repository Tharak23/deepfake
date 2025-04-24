'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from './Navbar';
import Footer from './Footer';
import FileUploadZone from './FileUploadZone';
import FileList from './FileList';
import SuccessModal from './SuccessModal';

// File type definition
export type FileItem = {
  id: string;
  name: string;
  originalName: string;
  category: string;
  size: number;
  type: string;
  uploadTime: Date;
  uploadedBy: string;
  url: string;
  isPrivate: boolean;
};

const FileStorageSystem = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [privacyFilter, setPrivacyFilter] = useState('All');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<FileItem | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Load files from API on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('/api/storage/files');
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching files:', errorData);
          return;
        }
        
        const data = await response.json();
        
        // Convert API data format to our component's format
        const convertedFiles = data.files.map((file: any) => ({
          id: file.id,
          name: file.title,
          originalName: file.originalName,
          category: file.tags[0] || 'Uncategorized',
          size: file.size,
          type: file.mimeType,
          uploadTime: new Date(file.createdAt),
          uploadedBy: file.isOwner ? 'You' : 'Other User',
          url: file.url,
          isPrivate: file.isPrivate
        }));
        
        setFiles(convertedFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    
    fetchFiles();
  }, []);

  // Replaced localStorage code with API call
  const handleFileUpload = async (newFile: FileItem) => {
    try {
      // Create form data
      const formData = new FormData();
      
      // Convert from our component file to API format
      const fileBlob = await fetch(newFile.url).then(r => r.blob());
      
      // Map UI category to valid backend type values
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
      
      const fileType = getFileTypeFromCategory(newFile.category);
      console.log('Mapped category to file type:', { category: newFile.category, fileType });
      
      formData.append('file', fileBlob, newFile.originalName);
      formData.append('type', fileType); // Use mapped type instead of hardcoded 'datasets'
      formData.append('title', newFile.name);
      formData.append('tags', JSON.stringify([newFile.category]));
      formData.append('isPrivate', newFile.isPrivate.toString());
      
      // Upload to API
      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error uploading file:', errorData);
        return;
      }
      
      // Add to local state
      setFiles((prevFiles) => [...prevFiles, newFile]);
      setUploadedFile(newFile);
      setShowSuccessModal(true);
      
      // Refresh the file list
      window.location.reload();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      const response = await fetch(`/api/storage/file/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting file:', errorData);
        return;
      }
      
      // Update local state
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         file.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || file.category === categoryFilter;
    const matchesPrivacy = 
      privacyFilter === 'All' || 
      (privacyFilter === 'Private' && file.isPrivate) || 
      (privacyFilter === 'Public' && !file.isPrivate);
    
    return matchesSearch && matchesCategory && matchesPrivacy;
  });

  const categories = ['All', 'Research', 'Case Study', 'Dataset', 'Algorithm', 'Publication'];
  const privacyOptions = ['All', 'Public', 'Private'];

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Secure <span className="text-[var(--secondary)] glow">File</span>{' '}
              <span className="text-[var(--accent)] glow">Storage</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Upload, manage, and securely store research files, datasets, and case studies
              for the DeepFake Detection Research Lab.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <motion.div
                ref={ref}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <FileUploadZone onFileUpload={handleFileUpload} />
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="card overflow-hidden"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">Stored Files</h2>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-grow">
                      <input
                        type="text"
                        placeholder="Search files..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
                        aria-label="Filter by category"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        value={privacyFilter}
                        onChange={(e) => setPrivacyFilter(e.target.value)}
                        className="w-full sm:w-auto px-4 py-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] text-white"
                        aria-label="Filter by privacy"
                      >
                        {privacyOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <FileList files={filteredFiles} onDeleteFile={handleDeleteFile} />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showSuccessModal && uploadedFile && (
          <SuccessModal
            file={uploadedFile}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default FileStorageSystem; 