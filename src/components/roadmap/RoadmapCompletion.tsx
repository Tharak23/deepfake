'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCheck, 
  FiStar, 
  FiAward, 
  FiUnlock, 
  FiLoader, 
  FiAlertCircle, 
  FiBriefcase, 
  FiFileText, 
  FiLink, 
  FiX,
  FiCheckCircle
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const RoadmapCompletion = () => {
  const { user, status } = useAuth();
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'approved' | 'rejected'>('none');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    researchField: '',
    institution: '',
    position: '',
    publicationsCount: 0,
    motivation: '',
    publicationLinks: ['']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [roadmapCompleted, setRoadmapCompleted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [certificateError, setCertificateError] = useState<string | null>(null);
  const [certificateSuccess, setCertificateSuccess] = useState(false);
  
  // Check if user is already a researcher
  const isResearcher = user?.role === 'researcher';
  
  // Fetch verification request status on component mount
  useEffect(() => {
    if (status === 'authenticated' && user) {
      fetchVerificationStatus();
      
      // For demo purposes, we'll assume the roadmap is completed
      // In a real app, you would check the user's progress
      setRoadmapCompleted(true);
    }
  }, [status, user]);
  
  const fetchVerificationStatus = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/user/request-verification');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Server responded with status: ${response.status}` }));
        throw new Error(errorData.error || `Failed with status code: ${response.status}`);
      }
      
      const data = await response.json();
      setRequestStatus(data.status || 'none');
      
    } catch (error) {
      console.error('Error fetching verification status:', error);
      // Don't set general component error to avoid UI disruption
      // Just log the error and continue with default 'none' status
      setRequestStatus('none');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePublicationLinkChange = (index: number, value: string) => {
    const updatedLinks = [...formData.publicationLinks];
    updatedLinks[index] = value;
    setFormData(prev => ({
      ...prev,
      publicationLinks: updatedLinks
    }));
  };
  
  const addPublicationLink = () => {
    setFormData(prev => ({
      ...prev,
      publicationLinks: [...prev.publicationLinks, '']
    }));
  };
  
  const removePublicationLink = (index: number) => {
    const updatedLinks = formData.publicationLinks.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      publicationLinks: updatedLinks.length ? updatedLinks : ['']
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Filter out empty publication links
      const filteredLinks = formData.publicationLinks.filter(link => link.trim() !== '');
      
      const response = await fetch('/api/user/request-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          publicationLinks: filteredLinks,
          roadmapCompleted
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Your verification request has been submitted successfully!');
        setRequestStatus('pending');
        setShowForm(false);
      } else {
        setError(data.error || 'Failed to submit verification request');
      }
    } catch (error) {
      setError('An error occurred while submitting your request');
      console.error('Error submitting verification request:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRequestCertificate = async () => {
    setCertificateLoading(true);
    setCertificateError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if roadmap is completed
      if (roadmapCompleted) {
        setCertificateSuccess(true);
      } else {
        throw new Error('You must complete all roadmap levels first');
      }
    } catch (error) {
      setCertificateError((error as Error).message);
    } finally {
      setCertificateLoading(false);
    }
  };
  
  const renderStatusMessage = () => {
    if (isResearcher) {
      return (
        <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 mt-4 flex items-start">
          <FiCheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="text-green-400 font-medium">You are a Verified Researcher</h3>
            <p className="text-green-300/80 text-sm mt-1">
              You have full access to all researcher features including blog posting and file storage.
            </p>
          </div>
        </div>
      );
    }
    
    switch (requestStatus) {
      case 'pending':
        return (
          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4 mt-4 flex items-start">
            <FiLoader className="text-amber-400 mt-1 mr-3 flex-shrink-0 animate-spin" size={20} />
            <div>
              <h3 className="text-amber-400 font-medium">Verification Request Pending</h3>
              <p className="text-amber-300/80 text-sm mt-1">
                Your request is being reviewed by our administrators. You'll be notified once it's processed.
              </p>
            </div>
          </div>
        );
      case 'approved':
        return (
          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 mt-4 flex items-start">
            <FiCheck className="text-green-400 mt-1 mr-3 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-green-400 font-medium">Verification Request Approved</h3>
              <p className="text-green-300/80 text-sm mt-1">
                Your request has been approved! Please refresh the page or log out and log back in to access researcher features.
              </p>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 mt-4 flex items-start">
            <FiX className="text-red-400 mt-1 mr-3 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-red-400 font-medium">Verification Request Rejected</h3>
              <p className="text-red-300/80 text-sm mt-1">
                Your request was not approved. You can submit a new request with additional information.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-300 px-3 py-1 rounded-md transition-colors"
              >
                Submit New Request
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  const roadmapCompletedPercentage = user?.roadmapProgress || 0;
  
  const badgeColors = {
    "AI Foundations": "from-blue-600 to-cyan-400",
    "GAN Master": "from-teal-500 to-emerald-400",
    "Ethics & Detection": "from-violet-600 to-purple-400",
    "Practical Expert": "from-amber-500 to-orange-400",
    "DeepFake Researcher": "from-rose-500 to-pink-400",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-800/50 rounded-t-xl p-6">
        <div className="flex items-center mb-4">
          <div className="bg-indigo-900/50 p-3 rounded-lg mr-4">
            <FiAward className="text-indigo-300" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Research Access Verification</h2>
            <p className="text-indigo-300">Complete all levels to unlock full research platform access</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
            <div className="flex items-center text-gray-300 mb-2">
              <FiStar className="mr-2 text-amber-400" size={18} />
              <h3 className="font-medium">Researcher Status</h3>
            </div>
            <div className="text-lg font-medium text-white">
              {isResearcher ? 'Verified Researcher' : 'Advanced Learner'}
            </div>
            <div className="mt-1 text-sm text-gray-400">
              {isResearcher ? 'Full platform access granted' : 'Level 3 expertise achieved'}
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
            <div className="flex items-center text-gray-300 mb-2">
              <FiCheck className="mr-2 text-green-400" size={18} />
              <h3 className="font-medium">Verification Requirements</h3>
            </div>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <div className={`w-3 h-3 rounded-full ${roadmapCompleted ? 'bg-green-500' : 'bg-gray-600'} mr-2`}></div>
              <span>Complete all 5 learning levels</span>
            </div>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Submit all required assignments</span>
            </div>
            <div className="flex items-center text-sm text-gray-400 mt-1">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Contribute to research community</span>
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
            <div className="flex items-center text-gray-300 mb-2">
              <FiUnlock className="mr-2 text-purple-400" size={18} />
              <h3 className="font-medium">Research Access</h3>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              <p>Unlocks private datasets, advanced training models, and collaboration opportunities.</p>
            </div>
          </div>
        </div>
        
        {/* Status message */}
        {renderStatusMessage()}
        
        {/* Error and success messages */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 mt-4 flex items-start">
            <FiAlertCircle className="text-red-400 mt-1 mr-3 flex-shrink-0" size={20} />
            <p className="text-red-300">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 mt-4 flex items-start">
            <FiCheck className="text-green-400 mt-1 mr-3 flex-shrink-0" size={20} />
            <p className="text-green-300">{success}</p>
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-r from-indigo-950/50 to-purple-950/50 border-t border-indigo-900/30 p-6 rounded-b-xl">
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium text-white mb-4">Researcher Verification Request</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="researchField" className="block text-sm font-medium text-gray-300 mb-1">
                  Research Field*
                </label>
                <input
                  type="text"
                  id="researchField"
                  name="researchField"
                  value={formData.researchField}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Computer Vision, NLP, etc."
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-300 mb-1">
                  Institution*
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Stanford University"
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-1">
                  Position*
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., PhD Candidate, Professor"
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="publicationsCount" className="block text-sm font-medium text-gray-300 mb-1">
                  Number of Publications
                </label>
                <input
                  type="number"
                  id="publicationsCount"
                  name="publicationsCount"
                  value={formData.publicationsCount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="motivation" className="block text-sm font-medium text-gray-300 mb-1">
                Motivation for Access*
              </label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Explain why you need access to the research platform and how it will benefit your work..."
                className="w-full bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Publication Links
              </label>
              {formData.publicationLinks.map((link, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handlePublicationLinkChange(index, e.target.value)}
                    placeholder="https://example.com/publication"
                    className="flex-1 bg-gray-800/70 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => removePublicationLink(index)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-400 transition-colors"
                    aria-label="Remove publication link"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPublicationLink}
                className="mt-1 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-md transition-colors flex items-center"
              >
                <FiLink className="mr-1" size={14} />
                Add Publication Link
              </button>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
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
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center mb-1">
                <h3 className="text-lg font-medium text-white">Ready to become a verified researcher?</h3>
              </div>
              <p className="text-indigo-300 text-sm">Request verification once you've completed all levels of the DeepFake research roadmap.</p>
            </div>
            
            {!isResearcher && requestStatus === 'none' && (
              <button
                onClick={() => setShowForm(true)} 
                className="px-5 py-2.5 rounded-lg font-medium transition-all min-w-[180px] bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-900/30"
                disabled={!roadmapCompleted}
                aria-label="Request verification to become a verified researcher"
              >
                Request Verification
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-r from-gray-900 to-indigo-900/60 border border-indigo-500/40 rounded-xl p-8 max-w-2xl w-full shadow-2xl relative"
          >
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <FiX size={24} />
            </button>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">DeepFake Research Progress</h3>
              <p className="text-gray-400 mb-6">Researcher verification and badge status</p>
              
              <div className="flex justify-between items-center mb-8">
                <div className="text-left">
                  <p className="text-gray-400">Issued to:</p>
                  <p className="text-xl font-medium text-white">{user?.name || 'Researcher'}</p>
                </div>
                <div className="text-left">
                  <p className="text-gray-400">Badges earned:</p>
                  <p className="text-xl font-medium text-white">{user?.badgesCount || 0}/5</p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${Math.min((user?.badgesCount || 0) / 5 * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-right text-gray-400 text-sm mt-1">
                  {Math.min((user?.badgesCount || 0) / 5 * 100, 100)}% Complete
                </p>
              </div>
              
              <div className="mb-8 grid grid-cols-5 gap-2">
                {Object.entries(badgeColors).map(([badge, color], index) => {
                  const isEarned = user?.badges?.includes(badge) || false;
                  return (
                    <div
                      key={badge}
                      className="flex flex-col items-center"
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isEarned
                          ? `bg-gradient-to-r ${color}`
                          : 'bg-gray-800'
                      }`}>
                        <FiAward 
                          size={20} 
                          className={isEarned ? 'text-white' : 'text-gray-600'} 
                        />
                      </div>
                      <span className="text-xs mt-1 text-gray-400 truncate w-full text-center">{badge.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
              
              {user?.isVerified ? (
                <div className="p-3 bg-green-900/30 border border-green-800/50 rounded-lg">
                  <p className="text-green-400 font-medium">
                    You are a verified researcher with full platform access
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-indigo-900/30 border border-indigo-800/50 rounded-lg">
                  <p className="text-indigo-400">
                    Complete your badges to become a verified researcher
                  </p>
                </div>
              )}
              
              <div className="mt-8">
                <button
                  onClick={handleRequestCertificate}
                  disabled={certificateLoading || !roadmapCompleted}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    roadmapCompleted
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {certificateLoading 
                    ? 'Processing...' 
                    : certificateSuccess 
                      ? 'Certificate Generated!' 
                      : 'Request Certificate'
                  }
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Badge Showcase */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 mt-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Your Badge Collection
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Earn all badges by completing the learning roadmap phases - each phase includes 2 video lessons and 1 article.
            Complete all 5 phases to become a verified researcher and access exclusive features and resources.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
            {Object.entries(badgeColors).map(([badge, color], index) => {
              const isEarned = user?.badges?.includes(badge) || false;
              return (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center ${
                    isEarned
                      ? `bg-gradient-to-r ${color} shadow-lg`
                      : 'bg-gray-800'
                  }`}>
                    <div className={`w-22 h-22 md:w-28 md:h-28 rounded-full flex items-center justify-center ${
                      isEarned
                        ? 'bg-black/10 border border-white/20'
                        : 'bg-gray-900 border border-gray-700'
                    }`}>
                      <FiAward 
                        size={isEarned ? 50 : 40} 
                        className={isEarned ? 'text-white' : 'text-gray-600'} 
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3 text-center">
                    <span className={`font-medium ${isEarned ? 'text-white' : 'text-gray-500'}`}>
                      {badge}
                    </span>
                    {isEarned && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <FiCheck size={16} className="text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {user?.badges && user.badges.length > 0 ? (
            <div className="mt-8 p-4 bg-indigo-900/20 border border-indigo-800/50 rounded-lg text-center max-w-2xl mx-auto">
              <p className="text-indigo-300">
                <span className="font-medium">Great progress!</span> You've earned {user.badges.length} out of 5 badges required for verification.
                Each badge requires completing 3 learning steps (2 videos and 1 article).
              </p>
            </div>
          ) : (
            <div className="mt-8 p-4 bg-gray-800/50 border border-gray-700/30 rounded-lg text-center max-w-2xl mx-auto">
              <p className="text-gray-400">
                Complete learning phases to earn badges and progress toward verification status.
                Each phase consists of 3 learning steps (2 videos and 1 article).
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RoadmapCompletion; 