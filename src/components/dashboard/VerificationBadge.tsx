'use client';

import { FC } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FiUser, FiAward, FiCheckCircle, FiLock, FiUpload } from 'react-icons/fi';
import Link from 'next/link';
import { motion } from 'framer-motion';

const VerificationBadge: FC = () => {
  const { user } = useAuth();
  
  // Return a default view if no user (for frontend-only mode)
  if (!user) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Researcher Verification</h2>
        <div className="text-gray-400 text-sm">
          <p>Verification status will appear here when available.</p>
        </div>
      </div>
    );
  }
  
  // Determine badge color based on verification status
  const badgeColor = user.isVerified 
    ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
    : 'bg-gradient-to-r from-gray-500 to-gray-700';

  // Determine badge icon and text based on status
  const badgeIcon = user.isVerified ? <FiCheckCircle size={18} /> : <FiUser size={18} />;
  const badgeText = user.isVerified ? 'Verified Researcher' : 'Not Verified';
  
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Researcher Verification</h2>
      
      {/* Verification Status Badge */}
      <div className="flex items-center mb-6">
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${badgeColor} text-white shadow-lg mr-3`}>
          {badgeIcon}
        </div>
        <div>
          <div className="text-lg font-medium text-white">{badgeText}</div>
          <p className="text-gray-400 text-sm">
            {user.isVerified 
              ? 'You have full access to researcher features' 
              : 'Become verified to access all researcher features'}
          </p>
        </div>
      </div>
      
      {/* Two paths to verification */}
      <div className="space-y-5">
        <h3 className="text-md font-medium text-gray-300 mb-3">Two ways to get verified:</h3>
        
        {/* Path 1: Earn 5 Badges */}
        <div className={`p-4 rounded-lg border relative ${
          user.badgesCount >= 5 
            ? 'bg-green-900/20 border-green-800/50' 
            : 'bg-gray-800/50 border-gray-700'
        }`}>
          {/* Badge indicator if completed */}
          {user.badgesCount >= 5 && (
            <div className="absolute -top-3 -right-3 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              <FiCheckCircle size={16} />
            </div>
          )}
          
          <div className="flex items-start">
            <div className={`p-3 rounded-full mr-4 ${
              user.badgesCount >= 5 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-indigo-900/20 text-indigo-400'
            }`}>
              <FiAward size={20} />
            </div>
            
            <div className="flex-1">
              <h4 className={`font-medium ${
                user.badgesCount >= 5 ? 'text-green-400' : 'text-white'
              }`}>
                Path 1: Earn 5 Learning Badges
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                Complete learning challenges to earn badges. Verification is automatic once you earn 5 badges.
              </p>
              
              <div className="flex items-center space-x-2">
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((user.badgesCount || 0) / 5 * 100, 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-gray-400 text-sm font-medium">
                  {user.badgesCount}/5
                </span>
              </div>
              
              <div className="mt-3">
                <Link href="/roadmap" 
                  className="inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                  View Learning Roadmap
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Path 2: Project Submission */}
        <div className={`p-4 rounded-lg border relative ${
          user.isVerified && !(user.badgesCount >= 5)
            ? 'bg-green-900/20 border-green-800/50' 
            : 'bg-gray-800/50 border-gray-700'
        }`}>
          {/* Badge indicator if verified through this path */}
          {user.isVerified && !(user.badgesCount >= 5) && (
            <div className="absolute -top-3 -right-3 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
              <FiCheckCircle size={16} />
            </div>
          )}
          
          <div className="flex items-start">
            <div className={`p-3 rounded-full mr-4 ${
              user.isVerified && !(user.badgesCount >= 5)
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-purple-900/20 text-purple-400'
            }`}>
              <FiUpload size={20} />
            </div>
            
            <div className="flex-1">
              <h4 className={`font-medium ${
                user.isVerified && !(user.badgesCount >= 5) ? 'text-green-400' : 'text-white'
              }`}>
                Path 2: Submit a Research Project
              </h4>
              <p className="text-gray-400 text-sm mb-3">
                Submit your DeepFake research project or paper for admin review. Verification is granted upon approval.
              </p>
              
              <div className="mt-3">
                <Link href="/submit-project" 
                  className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                  Submit Project for Review
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Current badges display */}
      {(user.badges && user.badges.length > 0) && (
        <div className="mt-6">
          <h3 className="text-md font-medium text-gray-300 mb-2">Your Earned Badges:</h3>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge, index) => (
              <div key={index} className="px-3 py-1 bg-indigo-900/30 border border-indigo-700/50 rounded-full text-indigo-400 text-sm flex items-center">
                <FiAward className="mr-1" size={12} />
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Benefits of verification */}
      <div className="mt-6 pt-4 border-t border-gray-800">
        <h3 className="text-md font-medium text-gray-300 mb-3">Verification Benefits:</h3>
        <ul className="space-y-2 text-gray-400 text-sm">
          <li className="flex items-start">
            <span className="text-indigo-400 mr-2">•</span>
            Access to verified-only research datasets
          </li>
          <li className="flex items-start">
            <span className="text-indigo-400 mr-2">•</span>
            Ability to publish articles and papers on the platform
          </li>
          <li className="flex items-start">
            <span className="text-indigo-400 mr-2">•</span>
            Participate in exclusive research collaborations
          </li>
          <li className="flex items-start">
            <span className="text-indigo-400 mr-2">•</span>
            Get recognized as a trusted contributor in the community
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VerificationBadge; 