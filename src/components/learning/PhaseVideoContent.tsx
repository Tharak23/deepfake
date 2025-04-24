'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight, FiCheck, FiPlay, FiAward } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

interface PhaseVideoContentProps {
  phaseNumber: number;
  stepNumber: number;
  stepType: 'video' | 'article';
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  nextStepPath: string;
  badgeName: string;
}

const PhaseVideoContent = ({
  phaseNumber,
  stepNumber,
  stepType,
  title,
  description,
  duration,
  videoUrl,
  nextStepPath,
  badgeName
}: PhaseVideoContentProps) => {
  const [completed, setCompleted] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);
  const { user } = useAuth();

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  // Mock video watching completion - in real app, this would track actual video progress
  const handleVideoComplete = () => {
    setVideoWatched(true);
  };

  // Auto-mark video as watched after 10 seconds (for demo purposes)
  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoWatched(true);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  // Mark step as completed in user progress
  const markStepCompleted = async () => {
    try {
      // API call would go here to update user progress
      console.log(`Marking Phase ${phaseNumber} ${stepType} ${stepNumber} as completed`);
      setCompleted(true);
      
      // Show completion notification or update UI
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0f172a] to-[#0f1a2b]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Navigation and progress */}
          <div className="mb-8 flex justify-between items-center">
            <Link href="/learning" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
              <FiArrowLeft className="mr-2" size={16} />
              <span>Back to Roadmap</span>
            </Link>
            
            <div className="inline-flex items-center">
              <div className="text-sm text-gray-400">
                Phase {phaseNumber} &bull; Step {stepNumber} of 3
              </div>
              <div className="ml-3 inline-flex bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-800/30">
                <FiAward className="text-indigo-400 mr-1" size={14} />
                <span className="text-xs text-indigo-400">{badgeName}</span>
              </div>
            </div>
          </div>
          
          {/* Content header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{title}</h1>
            <div className="flex items-center text-gray-400 mb-6">
              <span className="mr-4">{duration}</span>
              <span className="px-2 py-0.5 bg-indigo-900/30 text-indigo-400 text-xs rounded-full border border-indigo-800/30">
                {stepType === 'video' ? 'Video Lesson' : 'Article'}
              </span>
              
              {completed && (
                <span className="ml-3 px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-800/30 flex items-center">
                  <FiCheck className="mr-1" size={12} />
                  Completed
                </span>
              )}
            </div>
            <p className="text-gray-300 text-lg max-w-3xl">{description}</p>
          </motion.div>
          
          {/* Video player */}
          <motion.div
            className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {videoId ? (
                <iframe 
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
                  title={title}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <button 
                    onClick={handleVideoComplete}
                    className="bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-full p-4 transition-colors"
                  >
                    <FiPlay size={30} />
                  </button>
                </div>
              )}
              
              {videoWatched && (
                <div className="absolute bottom-4 right-4 bg-green-900/80 text-green-400 px-3 py-1 rounded-full text-sm flex items-center">
                  <FiCheck className="mr-1" size={14} />
                  Watched
                </div>
              )}
            </div>
            
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-3">Video Content</h2>
              <p className="text-gray-300 mb-4">
                {phaseNumber === 1 && stepNumber === 1 && "This video explains what deepfakes are, how they are created using AI technology, and their growing presence in digital media."}
                {phaseNumber === 1 && stepNumber === 3 && "This video showcases real-world examples of deepfakes, demonstrating how they can be used to manipulate images and videos."}
                {phaseNumber === 2 && stepNumber === 1 && "This video explains how Generative Adversarial Networks work, exploring the relationship between generator and discriminator networks in creating synthetic media."}
                {phaseNumber === 2 && stepNumber === 3 && "This video examines the potential dangers of deepfake technology, including misinformation, privacy concerns, and security threats."}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {videoWatched ? 'Video watched - click "Continue" to move to the next step' : 'Watch the video to continue your progress'}
                </div>
                
                <Link 
                  href={nextStepPath}
                  className={`px-5 py-2 rounded-lg font-medium flex items-center ${
                    videoWatched
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500' 
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (!videoWatched) {
                      e.preventDefault();
                    } else {
                      markStepCompleted();
                    }
                  }}
                >
                  Continue
                  <FiArrowRight className="ml-2" size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Additional resources */}
          <motion.div
            className="bg-gray-900/30 border border-gray-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-white mb-3">Additional Resources</h2>
            <p className="text-gray-300 mb-4">
              Explore these resources to deepen your understanding of the topics covered in this lesson.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">
                  {phaseNumber === 1 && stepNumber === 1 && "Neural Network Basics"}
                  {phaseNumber === 1 && stepNumber === 3 && "Python ML Libraries"}
                  {phaseNumber === 2 && stepNumber === 1 && "GAN Architecture"}
                  {phaseNumber === 2 && stepNumber === 3 && "Advanced GAN Training"}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {phaseNumber === 1 && stepNumber === 1 && "A comprehensive guide to understanding the structure and function of neural networks."}
                  {phaseNumber === 1 && stepNumber === 3 && "Overview of the most popular machine learning libraries for Python."}
                  {phaseNumber === 2 && stepNumber === 1 && "Detailed breakdown of the generator and discriminator components of GANs."}
                  {phaseNumber === 2 && stepNumber === 3 && "Advanced techniques to improve GAN training stability and output quality."}
                </p>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 text-sm">Learn more →</a>
              </div>
              
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">
                  {phaseNumber === 1 && stepNumber === 1 && "Deep Learning Applications"}
                  {phaseNumber === 1 && stepNumber === 3 && "Dataset Preparation"}
                  {phaseNumber === 2 && stepNumber === 1 && "Types of GANs"}
                  {phaseNumber === 2 && stepNumber === 3 && "Model Evaluation"}
                </h3>
                <p className="text-gray-400 text-sm mb-2">
                  {phaseNumber === 1 && stepNumber === 1 && "Explore real-world applications of deep learning technology across various industries."}
                  {phaseNumber === 1 && stepNumber === 3 && "Best practices for preparing and cleaning datasets for machine learning."}
                  {phaseNumber === 2 && stepNumber === 1 && "Compare different GAN variants like StyleGAN, CycleGAN, and more."}
                  {phaseNumber === 2 && stepNumber === 3 && "How to evaluate GAN model performance and avoid common pitfalls."}
                </p>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 text-sm">Learn more →</a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PhaseVideoContent; 