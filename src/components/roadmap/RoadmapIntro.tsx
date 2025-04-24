'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiChevronRight, FiVideo, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { GiBrain, GiArtificialIntelligence } from 'react-icons/gi';
import { AiOutlineExperiment } from 'react-icons/ai';
import { MdOutlineScience } from 'react-icons/md';
import { BsShieldCheck } from 'react-icons/bs';

const RoadmapIntro = () => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero Section */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 mb-6">
          Your DeepFake Research Journey
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Follow our structured learning path to master deepfake technology, detection methods, and ethical research practices.
        </p>
      </motion.div>

      {/* Visual Roadmap Overview */}
      <motion.div
        className="mt-16 md:mt-24 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {/* Line connecting phases */}
        <div className="absolute left-4 md:left-1/2 top-8 bottom-16 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-500 hidden md:block"></div>
        
        {/* Responsive roadmap phases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-32 relative">
          {/* Phase 1 */}
          <motion.div 
            className="md:text-right md:pr-12"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="flex md:flex-row-reverse items-start mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 mr-3 md:ml-3">
                <GiArtificialIntelligence className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white">Phase 1: AI Foundations</h3>
            </div>
            <p className="text-gray-300 pl-12 md:pl-0">Master the basics of AI, machine learning, and deep learning fundamentals.</p>
            <p className="text-indigo-400 text-sm mt-2 pl-12 md:pl-0">Earn your AI Foundations Badge</p>
          </motion.div>
          
          {/* Empty div for spacing in desktop view */}
          <div className="hidden md:block"></div>
          
          {/* Phase 2 */}
          <div className="hidden md:block"></div>
          <motion.div 
            className="md:text-left md:pl-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                <GiBrain className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white">Phase 2: GAN Master</h3>
            </div>
            <p className="text-gray-300 pl-12">Explore Generative Adversarial Networks and learn to create synthetic images.</p>
            <p className="text-teal-400 text-sm mt-2 pl-12">Earn your GAN Master Badge</p>
          </motion.div>
          
          {/* Phase 3 */}
          <motion.div 
            className="md:text-right md:pr-12"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="flex md:flex-row-reverse items-start mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-400 rounded-full flex items-center justify-center flex-shrink-0 mr-3 md:ml-3">
                <BsShieldCheck className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white">Phase 3: Ethics & Detection</h3>
            </div>
            <p className="text-gray-300 pl-12 md:pl-0">Learn techniques to identify manipulated media and understand ethical implications.</p>
            <p className="text-purple-400 text-sm mt-2 pl-12 md:pl-0">Earn your Ethics & Detection Badge</p>
          </motion.div>
          
          {/* Empty div for spacing in desktop view */}
          <div className="hidden md:block"></div>
          
          {/* Phase 4 */}
          <div className="hidden md:block"></div>
          <motion.div 
            className="md:text-left md:pl-12"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <div className="flex items-start mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                <AiOutlineExperiment className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white">Phase 4: Practical Expert</h3>
            </div>
            <p className="text-gray-300 pl-12">Apply your knowledge to create and detect deepfakes with real-world datasets.</p>
            <p className="text-amber-400 text-sm mt-2 pl-12">Earn your Practical Expert Badge</p>
          </motion.div>
          
          {/* Phase 5 */}
          <motion.div 
            className="md:text-right md:pr-12"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="flex md:flex-row-reverse items-start mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mr-3 md:ml-3">
                <MdOutlineScience className="text-white" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-white">Phase 5: DeepFake Researcher</h3>
            </div>
            <p className="text-gray-300 pl-12 md:pl-0">Contribute to the research community and become a verified researcher.</p>
            <p className="text-rose-400 text-sm mt-2 pl-12 md:pl-0">Earn your DeepFake Researcher Badge</p>
          </motion.div>
        </div>
        
        {/* Completion marker */}
        <motion.div 
          className="absolute left-4 md:left-1/2 bottom-0 transform md:translate-x-[-50%] md:translate-y-[150%]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center">
            <FiCheckCircle className="text-white" size={20} />
          </div>
        </motion.div>
      </motion.div>

      {/* Phase Structure */}
      <motion.div
        className="mt-32 md:mt-40 mb-16 bg-gray-900/30 border border-gray-800 rounded-xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-white text-center mb-10">Each Phase Consists of 3 Steps</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
              <FiVideo className="text-indigo-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Video Lesson 1</h3>
            <p className="text-gray-400">Watch an introductory video about the core concepts of the phase.</p>
            <div className="text-xs text-indigo-400 bg-indigo-900/40 px-3 py-1 rounded-full mt-4 border border-indigo-800/50">
              45-60 minutes
            </div>
          </div>
          
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-purple-900/50 rounded-full flex items-center justify-center mb-4">
              <FiFileText className="text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">In-depth Article</h3>
            <p className="text-gray-400">Read a comprehensive article that expands on the key topics.</p>
            <div className="text-xs text-purple-400 bg-purple-900/40 px-3 py-1 rounded-full mt-4 border border-purple-800/50">
              20-35 minutes
            </div>
          </div>
          
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-cyan-900/50 rounded-full flex items-center justify-center mb-4">
              <FiVideo className="text-cyan-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Video Lesson 2</h3>
            <p className="text-gray-400">Complete your learning with an advanced practical video tutorial.</p>
            <div className="text-xs text-cyan-400 bg-cyan-900/40 px-3 py-1 rounded-full mt-4 border border-cyan-800/50">
              60-75 minutes
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Complete all 3 steps in each phase to earn the respective badge. Collect all 5 badges to become a verified researcher with access to exclusive datasets and publishing capabilities.
          </p>
          
          <Link href="/learning">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-lg font-medium rounded-lg shadow-lg shadow-indigo-900/50 flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Learning
              <FiChevronRight className="ml-2" size={20} />
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RoadmapIntro; 