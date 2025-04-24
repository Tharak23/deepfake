'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import BadgeOverview from '../roadmap/BadgeOverview';
import { FiArrowLeft, FiBookOpen, FiAward } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const LearningPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const winHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;
      const totalScroll = docHeight - winHeight;
      const progress = Math.min(scrollY / totalScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f172a] to-[#0f1a2b] overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 z-0 opacity-20">
          <div 
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-[100px]"
            style={{ 
              transform: !isMobile ? `translate(${scrollProgress * 50}px, ${-scrollProgress * 30}px)` : 'none' 
            }}
          ></div>
          <div 
            className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-blue-600/20 blur-[100px]"
            style={{ 
              transform: !isMobile ? `translate(${-scrollProgress * 40}px, ${scrollProgress * 40}px)` : 'none' 
            }}
          ></div>
          <div 
            className="absolute top-2/3 right-1/3 w-72 h-72 rounded-full bg-cyan-600/20 blur-[100px]"
            style={{ 
              transform: !isMobile ? `translate(${scrollProgress * 30}px, ${scrollProgress * 50}px)` : 'none' 
            }}
          ></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Back button */}
          <div className="mb-8">
            <Link href="/roadmap" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
              <FiArrowLeft className="mr-2" size={16} />
              <span>Back to Introduction</span>
            </Link>
          </div>
          
          {/* Page Title */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 mb-4">
              DeepFake Learning Roadmap
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Your comprehensive journey through all phases of deepfake research and detection
            </p>
            
            {/* User progress summary if logged in */}
            {user && (
              <div className="mt-6 inline-flex items-center bg-indigo-900/30 rounded-full px-5 py-2 border border-indigo-700/30">
                <FiAward className="text-indigo-400 mr-2" size={18} />
                <span className="text-indigo-300">
                  {user.badgesCount || 0}/5 Badges Earned
                </span>
              </div>
            )}
          </motion.div>
          
          {/* Learning pathway introduction */}
          <motion.div
            className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <div className="flex items-start md:items-center flex-col md:flex-row">
              <div className="bg-indigo-900/30 p-3 rounded-lg mr-0 md:mr-6 mb-4 md:mb-0">
                <FiBookOpen className="text-indigo-400" size={28} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Your Learning Pathway</h2>
                <p className="text-gray-300">
                  This roadmap guides you through 5 phases of deepfake mastery. Each phase consists of 3 steps: 
                  two video lessons and one in-depth article. Complete all steps in a phase to earn its badge.
                  Earn all 5 badges to achieve Verified Researcher status with exclusive platform privileges.
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Badge overview section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-16"
          >
            <BadgeOverview />
          </motion.div>
          
          {/* Call-to-action */}
          <motion.div
            className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-800/30 rounded-xl p-8 text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Begin Your Journey?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-6">
              Start with Phase 1 and work your way through each step. Track your progress, earn badges, and become a verified researcher.
            </p>
            <Link href="/learn/phase-1/video-1">
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-900/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Phase 1
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LearningPage; 