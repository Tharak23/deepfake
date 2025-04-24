'use client';

import { useState, useEffect } from 'react';
import { 
  FiCheckCircle, 
  FiX, 
  FiUser, 
  FiFileText, 
  FiExternalLink,
  FiClock,
  FiInfo,
  FiChevronDown,
  FiEye,
  FiLoader,
  FiAlertCircle,
  FiMail,
  FiBriefcase,
  FiFile
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

// Define the verification request type
type VerificationRequest = {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  dateSubmitted: string;
  researchField: string;
  institution: string;
  position: string;
  publicationsCount: number;
  motivation: string;
  publicationLinks: string[];
  status: 'pending' | 'approved' | 'rejected';
  roadmapCompleted: boolean;
  reviewedBy?: string;
  reviewDate?: string;
  reviewNotes?: string;
  avatar?: string | null;
  project?: {
    title: string;
    description: string;
    fileLink: string;
  };
  projectFile?: {
    fileName: string;
    fileType: string;
    fileSize: number;
  };
};

const ResearcherVerification = () => {
  const { user } = useAuth();
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [processedCount, setProcessedCount] = useState({ approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  // Fetch verification requests from the API
  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/verification-requests');
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Set verification requests
      setVerificationRequests(data.requests || []);
      
      // Calculate processed counts
      const approved = data.requests.filter((req: VerificationRequest) => req.status === 'approved').length;
      const rejected = data.requests.filter((req: VerificationRequest) => req.status === 'rejected').length;
      setProcessedCount({ approved, rejected });
      
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      setError('Failed to load verification requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (window.confirm('Are you sure you want to approve this researcher verification request?')) {
      try {
        setActionLoading(requestId);
        
        const response = await fetch('/api/admin/verification-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requestId,
            action: 'approve',
            notes: reviewNotes
          })
        });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        // Update local state
        setVerificationRequests(
          verificationRequests.map((request) =>
            request._id === requestId ? { ...request, status: 'approved', reviewDate: new Date().toISOString(), reviewNotes } : request
          )
        );
        
        setProcessedCount(prev => ({ ...prev, approved: prev.approved + 1 }));
        setReviewNotes('');
        
      } catch (error) {
        console.error('Error approving request:', error);
        alert('Failed to approve request. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (window.confirm('Are you sure you want to reject this researcher verification request?')) {
      try {
        setActionLoading(requestId);
        
        const response = await fetch('/api/admin/verification-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requestId,
            action: 'reject',
            notes: reviewNotes
          })
        });
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }
        
        // Update local state
        setVerificationRequests(
          verificationRequests.map((request) =>
            request._id === requestId ? { ...request, status: 'rejected', reviewDate: new Date().toISOString(), reviewNotes } : request
          )
        );
        
        setProcessedCount(prev => ({ ...prev, rejected: prev.rejected + 1 }));
        setReviewNotes('');
        
      } catch (error) {
        console.error('Error rejecting request:', error);
        alert('Failed to reject request. Please try again.');
      } finally {
        setActionLoading(null);
      }
    }
  };

  const toggleRequestDetails = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const downloadProjectFile = async (requestId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/admin/verification-requests/file/${requestId}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching file: ${response.statusText}`);
      }
      
      // Get the file as a blob
      const fileBlob = await response.blob();
      
      // Create a URL for the blob
      const fileUrl = URL.createObjectURL(fileBlob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(fileUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download the file. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <h2 className="text-xl font-bold text-white flex items-center">
          <FiCheckCircle className="mr-2" size={20} />
          Researcher Verification
        </h2>
        <p className="text-gray-400 mt-1">
          Review and approve researcher verification requests to grant access to advanced platform features.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Pending Requests</div>
            <div className="text-2xl font-bold text-white mt-1">{verificationRequests.filter(r => r.status === 'pending').length}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Approved (Total)</div>
            <div className="text-2xl font-bold text-green-400 mt-1">{processedCount.approved}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Rejected (Total)</div>
            <div className="text-2xl font-bold text-red-400 mt-1">{processedCount.rejected}</div>
          </div>
        </div>
      </div>
      
      {/* Guidelines section */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-800/40 rounded-lg p-5">
        <div className="flex items-start">
          <div className="p-2 bg-indigo-900/40 rounded-md mr-4">
            <FiInfo className="text-indigo-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Verification Guidelines</h3>
            <ul className="text-gray-300 mt-2 space-y-2 list-disc pl-5">
              <li>Verify the applicant's academic or research credentials</li>
              <li>Check for relevant publications or research experience</li>
              <li>Assess whether their research focus aligns with the platform's purpose</li>
              <li>Evaluate their motivation for requesting access</li>
              <li>Consider their institution's reputation if applicable</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Loading and error states */}
      {loading && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 flex justify-center items-center">
          <FiLoader className="animate-spin text-indigo-400 mr-3" size={24} />
          <p className="text-gray-300">Loading verification requests...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/10 border border-red-800/30 rounded-lg p-5 flex items-start">
          <FiAlertCircle className="text-red-400 mt-1 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="text-red-400 font-medium">Error Loading Requests</h3>
            <p className="text-red-300/80 text-sm mt-1">{error}</p>
            <button
              onClick={fetchVerificationRequests}
              className="mt-2 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-300 px-3 py-1 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Verification requests list */}
      {!loading && !error && verificationRequests.length === 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">No verification requests found.</p>
        </div>
      )}
      
      {!loading && !error && verificationRequests.length > 0 && (
        <div className="space-y-4">
          {verificationRequests.map((request) => (
            <div
              key={request._id}
              className={`bg-gray-900/50 border rounded-lg overflow-hidden transition-colors ${
                request.status === 'approved'
                  ? 'border-green-700 bg-green-900/5'
                  : request.status === 'rejected'
                  ? 'border-red-700 bg-red-900/5'
                  : 'border-gray-800'
              }`}
            >
              {/* Request header */}
              <div className="p-5">
                <div className="flex flex-col sm:flex-row justify-between">
                  {/* User info */}
                  <div className="flex items-center mb-4 sm:mb-0">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                      {request.avatar ? (
                        <img src={request.avatar} alt={request.userName} className="w-12 h-12 rounded-full" />
                      ) : (
                        <FiUser className="text-gray-400" size={24} />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-medium text-white">{request.userName}</div>
                      <div className="text-sm text-gray-400">{request.userEmail}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {request.institution} · {request.position}
                      </div>
                    </div>
                  </div>

                  {/* Status and actions */}
                  <div className="flex flex-col sm:items-end">
                    <div className="flex items-center mb-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                        request.status === 'approved'
                          ? 'bg-green-900/30 text-green-400'
                          : request.status === 'rejected'
                          ? 'bg-red-900/30 text-red-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {request.status === 'approved' ? (
                          <>
                            <FiCheckCircle className="mr-1" size={12} />
                            Approved
                          </>
                        ) : request.status === 'rejected' ? (
                          <>
                            <FiX className="mr-1" size={12} />
                            Rejected
                          </>
                        ) : (
                          <>
                            <FiClock className="mr-1" size={12} />
                            Pending Review
                          </>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        Submitted {new Date(request.dateSubmitted).toLocaleDateString()}
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          disabled={actionLoading === request._id}
                          className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs rounded transition-colors flex items-center"
                        >
                          {actionLoading === request._id ? (
                            <FiLoader className="animate-spin mr-1" size={12} />
                          ) : (
                            <FiX className="mr-1" size={12} />
                          )}
                          Reject
                        </button>
                        
                        <button
                          onClick={() => handleApproveRequest(request._id)}
                          disabled={actionLoading === request._id}
                          className="px-3 py-1 bg-green-900/30 hover:bg-green-900/50 text-green-300 text-xs rounded transition-colors flex items-center"
                        >
                          {actionLoading === request._id ? (
                            <FiLoader className="animate-spin mr-1" size={12} />
                          ) : (
                            <FiCheckCircle className="mr-1" size={12} />
                          )}
                          Approve
                        </button>
                        
                        <button
                          onClick={() => toggleRequestDetails(request._id)}
                          className="px-3 py-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 text-xs rounded transition-colors flex items-center"
                        >
                          <FiEye className="mr-1" size={12} />
                          {expandedRequest === request._id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    )}
                    
                    {(request.status === 'approved' || request.status === 'rejected') && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleRequestDetails(request._id)}
                          className="px-3 py-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 text-xs rounded transition-colors flex items-center"
                        >
                          <FiEye className="mr-1" size={12} />
                          {expandedRequest === request._id ? 'Hide Details' : 'View Details'}
                        </button>
                        
                        <a
                          href={`mailto:${request.userEmail}`}
                          className="px-3 py-1 bg-indigo-900/30 hover:bg-indigo-900/50 text-indigo-300 text-xs rounded transition-colors flex items-center"
                        >
                          <FiMail className="mr-1" size={12} />
                          Contact
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Expanded details */}
                {expandedRequest === request._id && (
                  <div className="p-6 border-t border-gray-800">
                    {/* Basic info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-gray-400 text-sm mb-2">Research Field</h3>
                        <p className="text-white">{request.researchField}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-gray-400 text-sm mb-2">Affiliation</h3>
                        <p className="text-white">{request.institution}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-gray-400 text-sm mb-2">Position</h3>
                        <p className="text-white">{request.position}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-gray-400 text-sm mb-2">Publications Count</h3>
                        <p className="text-white">{request.publicationsCount}</p>
                      </div>
                    </div>
                    
                    {/* Project submission section */}
                    {request.project && (
                      <div className="mt-6 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 className="text-white font-medium mb-3 flex items-center">
                          <FiFileText className="mr-2 text-blue-400" size={16} />
                          Project Submission
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-gray-400 text-sm mb-1">Project Title</h4>
                            <p className="text-white font-medium">{request.project.title}</p>
                          </div>
                          
                          <div>
                            <h4 className="text-gray-400 text-sm mb-1">Description</h4>
                            <p className="text-gray-300">{request.project.description}</p>
                          </div>
                          
                          {request.projectFile ? (
                            <div>
                              <h4 className="text-gray-400 text-sm mb-1">Project File</h4>
                              <div className="flex items-center bg-gray-900/50 p-3 rounded-md border border-gray-700">
                                <FiFile className="text-blue-400 mr-2" size={16} />
                                <div className="flex-1">
                                  <p className="text-white text-sm font-medium">{request.projectFile.fileName}</p>
                                  <p className="text-gray-500 text-xs">
                                    {(request.projectFile.fileSize / (1024 * 1024)).toFixed(2)} MB • {request.projectFile.fileType.split('/')[1].toUpperCase()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => downloadProjectFile(request._id, request.projectFile!.fileName)}
                                  className="px-3 py-1 bg-blue-900/40 hover:bg-blue-900/60 text-blue-400 text-sm rounded-md transition-colors"
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          ) : request.project.fileLink ? (
                            <div>
                              <h4 className="text-gray-400 text-sm mb-1">Project Link</h4>
                              <a
                                href={request.project.fileLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 flex items-center transition-colors inline-block"
                              >
                                <FiExternalLink className="mr-1" size={14} />
                                View Project File
                              </a>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )}
                    
                    {/* Motivation */}
                    <div className="mt-6">
                      <h3 className="text-gray-400 text-sm mb-2">Motivation</h3>
                      <p className="text-white bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        {request.motivation}
                      </p>
                    </div>
                    
                    {/* Publication links */}
                    {request.publicationLinks && request.publicationLinks.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-gray-400 text-sm mb-2">Publications & Links</h3>
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <ul className="space-y-2">
                            {request.publicationLinks.map((link, index) => (
                              <li key={index}>
                                <a 
                                  href={link.startsWith('http') ? link : `https://${link}`} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 flex items-center transition-colors"
                                >
                                  <FiExternalLink className="mr-2" size={14} />
                                  {link}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {/* Roadmap status */}
                    <div className="mt-6">
                      <h3 className="text-gray-400 text-sm mb-2">Roadmap Status</h3>
                      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-2 ${request.roadmapCompleted ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="text-white">
                          {request.roadmapCompleted ? 'Completed all roadmap levels' : 'Roadmap in progress'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Admin review section */}
                    {request.status === 'pending' ? (
                      <div className="mt-6 border-t border-gray-800 pt-6">
                        <h3 className="text-gray-300 font-medium mb-4">Review Decision</h3>
                        
                        <div className="mb-4">
                          <label htmlFor="review-notes" className="block text-gray-400 text-sm mb-2">
                            Review Notes (optional)
                          </label>
                          <textarea
                            id="review-notes"
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white"
                            rows={3}
                            placeholder="Add notes about your decision..."
                          ></textarea>
                        </div>
                        
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleRejectRequest(request._id)}
                            disabled={actionLoading === request._id}
                            className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-md transition-colors flex items-center"
                          >
                            {actionLoading === request._id ? (
                              <FiLoader className="animate-spin mr-2" size={16} />
                            ) : (
                              <FiX className="mr-2" size={16} />
                            )}
                            Reject Request
                          </button>
                          
                          <button
                            onClick={() => handleApproveRequest(request._id)}
                            disabled={actionLoading === request._id}
                            className="px-4 py-2 bg-green-900/30 hover:bg-green-900/50 text-green-300 rounded-md transition-colors flex items-center"
                          >
                            {actionLoading === request._id ? (
                              <FiLoader className="animate-spin mr-2" size={16} />
                            ) : (
                              <FiCheckCircle className="mr-2" size={16} />
                            )}
                            Approve as Researcher
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 border-t border-gray-800 pt-6">
                        <h3 className="text-gray-300 font-medium mb-2">Review Information</h3>
                        
                        <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <div className="mb-2">
                            <span className="text-gray-400 text-sm">Decision:</span>
                            <span className={`ml-2 ${
                              request.status === 'approved' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {request.status === 'approved' ? 'Approved' : 'Rejected'}
                            </span>
                          </div>
                          
                          {request.reviewDate && (
                            <div className="mb-2">
                              <span className="text-gray-400 text-sm">Review Date:</span>
                              <span className="ml-2 text-white">
                                {new Date(request.reviewDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          
                          {request.reviewNotes && (
                            <div>
                              <span className="text-gray-400 text-sm block mb-1">Notes:</span>
                              <p className="text-gray-300">{request.reviewNotes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearcherVerification; 