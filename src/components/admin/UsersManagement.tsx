'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiCheck, 
  FiX, 
  FiEdit, 
  FiUser, 
  FiShield, 
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiAlertTriangle,
  FiFileText,
  FiExternalLink,
  FiBriefcase,
  FiMail,
  FiAlertCircle,
  FiClock,
  FiLink,
  FiFile,
  FiLoader,
  FiDownload
} from 'react-icons/fi';
import Link from 'next/link';

// Mock data for the demo
const mockUsers = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'user', status: 'active', dateJoined: '2023-05-12', avatar: null },
  { id: 2, name: 'Alice Johnson', email: 'alice.j@example.com', role: 'verified_researcher', status: 'active', dateJoined: '2023-04-03', avatar: null },
  { id: 3, name: 'Robert Brown', email: 'robert.brown@example.com', role: 'user', status: 'pending', dateJoined: '2023-06-08', avatar: null, verificationRequest: { institution: 'Stanford University', position: 'PhD Candidate', field: 'Computer Vision', publications: 3, submissionDate: '2023-06-10' } },
  { id: 4, name: 'Emma Wilson', email: 'emma.w@example.com', role: 'verified_researcher', status: 'active', dateJoined: '2023-02-19', avatar: null },
  { id: 5, name: 'Michael Davis', email: 'michael.d@example.com', role: 'user', status: 'active', dateJoined: '2023-05-25', avatar: null },
  { id: 6, name: 'Sarah Martinez', email: 'sarah.m@example.com', role: 'user', status: 'suspended', dateJoined: '2023-03-30', avatar: null },
  { id: 7, name: 'David Thompson', email: 'david.t@example.com', role: 'user', status: 'active', dateJoined: '2023-06-15', avatar: null },
  { id: 8, name: 'Jennifer Garcia', email: 'jennifer.g@example.com', role: 'verified_researcher', status: 'active', dateJoined: '2023-01-22', avatar: null },
  { id: 9, name: 'William Clark', email: 'william.c@example.com', role: 'user', status: 'pending', dateJoined: '2023-06-20', avatar: null, verificationRequest: { institution: 'MIT', position: 'Assistant Professor', field: 'Deep Learning', publications: 8, submissionDate: '2023-06-22' } },
  { id: 10, name: 'Elizabeth Rodriguez', email: 'elizabeth.r@example.com', role: 'user', status: 'active', dateJoined: '2023-05-17', avatar: null },
];

// Define types
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  image?: string;
};

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

const UsersManagement = () => {
  // State for users tab
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // State for verification requests tab
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [loadingVerifications, setLoadingVerifications] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [currentVerificationPage, setCurrentVerificationPage] = useState(1);
  const [totalVerificationPages, setTotalVerificationPages] = useState(1);
  const [totalVerifications, setTotalVerifications] = useState(0);
  
  // Currently active tab
  const [activeTab, setActiveTab] = useState<'users' | 'verification'>('users');
  
  // Fetch data when component mounts or tab changes
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(currentUserPage);
    } else {
      fetchVerificationRequests(currentVerificationPage);
    }
  }, [activeTab, currentUserPage, currentVerificationPage]);
  
  // Fetch users
  const fetchUsers = async (page: number = 1) => {
    try {
      setLoadingUsers(true);
      setUserError(null);
      
      const response = await fetch(`/api/admin/users?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setUsers(data.users || []);
      setCurrentUserPage(page);
      setTotalUserPages(data.pagination?.pages || 1);
      setTotalUsers(data.pagination?.total || 0);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      setUserError(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };
  
  // Fetch verification requests
  const fetchVerificationRequests = async (page: number = 1) => {
    try {
      setLoadingVerifications(true);
      setVerificationError(null);
      
      const response = await fetch(`/api/admin/verification-requests?page=${page}&limit=10`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch verification requests: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Verification requests:', data.requests);
      
      setVerificationRequests(data.requests || []);
      setCurrentVerificationPage(page);
      setTotalVerificationPages(data.pagination?.pages || 1);
      setTotalVerifications(data.pagination?.total || 0);
      
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      setVerificationError(error instanceof Error ? error.message : 'Failed to fetch verification requests');
    } finally {
      setLoadingVerifications(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Handle user pagination
  const handleUserPagination = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalUserPages) {
      fetchUsers(newPage);
    }
  };
  
  // Handle verification pagination
  const handleVerificationPagination = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalVerificationPages) {
      fetchVerificationRequests(newPage);
    }
  };
  
  // Handle verification approval
  const handleApproveVerification = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to approve this verification request?')) {
      return;
    }
    
      try {
        const response = await fetch('/api/admin/verification-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          requestId,
            action: 'approve',
          notes: 'Approved from User Management dashboard'
          })
        });
        
        if (!response.ok) {
        throw new Error(`Failed to approve request: ${response.statusText}`);
      }
      
      // Refresh verification requests
      fetchVerificationRequests(currentVerificationPage);
      
      // Show success message
      alert('Verification request approved successfully');
        
      } catch (error) {
      console.error('Error approving verification request:', error);
      alert(error instanceof Error ? error.message : 'Failed to approve request');
    }
  };
  
  // Handle verification rejection
  const handleRejectVerification = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to reject this verification request?')) {
      return;
    }
    
      try {
        const response = await fetch('/api/admin/verification-requests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          requestId,
            action: 'reject',
          notes: 'Rejected from User Management dashboard'
          })
        });
        
        if (!response.ok) {
        throw new Error(`Failed to reject request: ${response.statusText}`);
      }
      
      // Refresh verification requests
      fetchVerificationRequests(currentVerificationPage);
      
      // Show success message
      alert('Verification request rejected successfully');
        
      } catch (error) {
      console.error('Error rejecting verification request:', error);
      alert(error instanceof Error ? error.message : 'Failed to reject request');
    }
  };
  
  // Download project file
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
  
  // Render loading state
  const renderLoading = () => (
    <div className="p-8 flex justify-center">
      <FiLoader className="animate-spin text-indigo-500" size={24} />
    </div>
  );
  
  // Render error state
  const renderError = (error: string | null, retryFunction: () => void) => (
    <div className="bg-red-900/10 border border-red-800/30 rounded-lg p-4 text-red-400">
      <p className="flex items-center">
        <FiAlertCircle className="mr-2" />
        {error || 'An error occurred'}
      </p>
      <button
        onClick={retryFunction}
        className="mt-2 text-sm bg-red-900/30 hover:bg-red-900/50 text-red-300 px-3 py-1 rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>
  );
  
  // Render users tab content
  const renderUsersTab = () => {
    if (loadingUsers) {
      return renderLoading();
    }
    
    if (userError) {
      return renderError(userError, () => fetchUsers(currentUserPage));
    }
    
    if (users.length === 0) {
      return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">No users found</p>
        </div>
      );
    }

  return (
      <>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 text-gray-400 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user) => (
                <tr key={user._id} className="text-gray-300 hover:bg-gray-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {user.image ? (
                        <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full mr-3" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          <FiUser className="text-gray-400" />
                        </div>
                      )}
                      <span>{user.name || 'Anonymous User'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-900/30 text-red-400' 
                        : user.role === 'verified_researcher' 
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.createdAt ? formatDate(user.createdAt) : 'Unknown'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button 
                        className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                        title="Edit User"
                      >
                        <FiEdit size={16} />
                      </button>
                      <a 
                        href={`mailto:${user.email}`} 
                        className="p-1 text-gray-400 hover:text-indigo-400 transition-colors"
                        title="Email User"
                      >
                        <FiMail size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6 bg-gray-900/50 border border-gray-800 rounded-lg p-3">
          <div className="text-gray-400 text-sm">
            Showing {users.length} of {totalUsers} users
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleUserPagination(currentUserPage - 1)}
              disabled={currentUserPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentUserPage === 1
                  ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handleUserPagination(currentUserPage + 1)}
              disabled={currentUserPage === totalUserPages}
              className={`px-3 py-1 rounded-md ${
                currentUserPage === totalUserPages
                  ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </>
    );
  };
  
  // Render verification requests tab content
  const renderVerificationTab = () => {
    if (loadingVerifications) {
      return renderLoading();
    }
    
    if (verificationError) {
      return renderError(verificationError, () => fetchVerificationRequests(currentVerificationPage));
    }
    
    // Render summary stats
    const pendingCount = verificationRequests.filter(req => req.status === 'pending').length;
    const approvedCount = verificationRequests.filter(req => req.status === 'approved').length;
    const rejectedCount = verificationRequests.filter(req => req.status === 'rejected').length;
    
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Pending Requests</div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">{pendingCount}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Approved Requests</div>
            <div className="text-2xl font-bold text-green-400 mt-1">{approvedCount}</div>
      </div>
      
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Rejected Requests</div>
            <div className="text-2xl font-bold text-red-400 mt-1">{rejectedCount}</div>
          </div>
      </div>
      
        {verificationRequests.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400">No verification requests found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {verificationRequests.map(request => (
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
                <div className="p-4">
                  <div className="flex flex-col md:flex-row justify-between">
                    {/* User info */}
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                        <FiUser className="text-gray-400" size={20} />
                          </div>
                      <div className="ml-3">
                        <div className="font-medium text-white">{request.userName}</div>
                        <div className="text-sm text-gray-400">{request.userEmail}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {request.institution} · {request.position}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status and date */}
                    <div className="flex flex-col md:items-end">
                      <div className="flex items-center mb-1">
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${
                          request.status === 'approved'
                            ? 'bg-green-900/30 text-green-400'
                            : request.status === 'rejected'
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {request.status === 'approved' ? (
                            <>
                              <FiCheck className="mr-1" size={10} />
                              Approved
                            </>
                          ) : request.status === 'rejected' ? (
                            <>
                              <FiX className="mr-1" size={10} />
                              Rejected
                            </>
                          ) : (
                            <>
                              <FiClock className="mr-1" size={10} />
                              Pending
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 ml-2">
                          {formatDate(request.dateSubmitted)}
                        </div>
                      </div>
                      
                      {/* Action buttons for pending requests */}
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleRejectVerification(request._id)}
                            className="px-2 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-300 text-xs rounded transition-colors flex items-center"
                          >
                            <FiX className="mr-1" size={10} />
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveVerification(request._id)}
                            className="px-2 py-1 bg-green-900/30 hover:bg-green-900/50 text-green-300 text-xs rounded transition-colors flex items-center"
                          >
                            <FiCheck className="mr-1" size={10} />
                            Approve
                          </button>
                        </div>
                      )}
                                  </div>
                                </div>
                                
                  {/* Project details if available */}
                  {request.project && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <h3 className="text-sm font-medium text-white flex items-center mb-2">
                        <FiFileText className="text-blue-400 mr-1" size={14} />
                        Project: {request.project.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-2">{request.project.description}</p>
                      
                      {/* File information */}
                      {request.projectFile ? (
                        <div className="flex items-center bg-gray-800/50 p-2 rounded-md mt-2">
                          <FiFile className="text-blue-400 mr-2" size={14} />
                          <div className="flex-1 text-sm">
                            <p className="text-white">{request.projectFile.fileName}</p>
                            <p className="text-gray-500 text-xs">
                              {(request.projectFile.fileSize / (1024 * 1024)).toFixed(2)} MB
                            </p>
                                  </div>
                          <button
                            onClick={() => request.projectFile && downloadProjectFile(request._id, request.projectFile.fileName)}
                            className="px-2 py-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-300 text-xs rounded transition-colors"
                          >
                            <FiDownload className="mr-1" size={12} />
                            Download
                          </button>
                                </div>
                      ) : request.project.fileLink ? (
                        <a
                          href={request.project.fileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center text-sm mt-2"
                        >
                          <FiLink className="mr-1" size={14} />
                          View Project Link
                        </a>
                      ) : null}
                                  </div>
                  )}
                                </div>
                              </div>
            ))}
            
            {/* Pagination */}
            {totalVerificationPages > 1 && (
              <div className="flex justify-between items-center mt-6 bg-gray-900/50 border border-gray-800 rounded-lg p-3">
                <div className="text-gray-400 text-sm">
                  Showing {verificationRequests.length} of {totalVerifications} requests
                              </div>
                              <div className="flex space-x-2">
                                <button
                    onClick={() => handleVerificationPagination(currentVerificationPage - 1)}
                    disabled={currentVerificationPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentVerificationPage === 1
                        ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Previous
                                </button>
                                <button
                    onClick={() => handleVerificationPagination(currentVerificationPage + 1)}
                    disabled={currentVerificationPage === totalVerificationPages}
                    className={`px-3 py-1 rounded-md ${
                      currentVerificationPage === totalVerificationPages
                        ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Next
                                </button>
                              </div>
                            </div>
            )}
                          </div>
        )}
      </>
    );
  };
  
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-5">
        <h2 className="text-xl font-bold text-white">User Management</h2>
        <p className="text-gray-400 mt-1">
          Manage users, roles, and verification requests
        </p>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-800">
        <nav className="flex space-x-8">
            <button
            onClick={() => setActiveTab('users')}
            className={`py-3 px-1 relative ${
              activeTab === 'users' 
                ? 'text-indigo-400 font-medium' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span>Users</span>
            {activeTab === 'users' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
            </button>
            
              <button
            onClick={() => setActiveTab('verification')}
            className={`py-3 px-1 relative ${
              activeTab === 'verification' 
                ? 'text-indigo-400 font-medium' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span>Verification Requests</span>
            {activeTab === 'verification' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"></span>
            )}
              </button>
        </nav>
      </div>
      
      {/* Tab content */}
      {activeTab === 'users' ? renderUsersTab() : renderVerificationTab()}
    </div>
  );
};

export default UsersManagement; 