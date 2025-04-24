'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiAward, FiInfo, FiArrowRight, FiCheckCircle, FiLock } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const BadgeOverview = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  
  const badges = [
    {
      id: 'ai-foundations',
      title: 'AI Foundations',
      description: 'Master the basics of AI, machine learning, and deep learning fundamentals.',
      colorClass: 'from-blue-600 to-cyan-400',
      shadowClass: 'shadow-blue-700/20',
      requirements: [
        'Watch Video 1: "Introduction to AI & Deep Learning Concepts"',
        'Read Article: "Neural Networks Architecture & Applications"',
        'Watch Video 2: "Implementing Basic ML Models with Python"'
      ],
      phase: 1,
      path: '/learn/phase-1',
      level: 'Beginner'
    },
    {
      id: 'gan-master',
      title: 'GAN Master',
      description: 'Explore Generative Adversarial Networks and learn to create synthetic images.',
      colorClass: 'from-teal-500 to-emerald-400',
      shadowClass: 'shadow-teal-700/20',
      requirements: [
        'Watch Video 1: "GAN Architecture & Working Principles"',
        'Read Article: "StyleGAN Design & Implementation Details"',
        'Watch Video 2: "Training Your First GAN Model"'
      ],
      phase: 2,
      path: '/learn/phase-2',
      level: 'Intermediate'
    },
    {
      id: 'ethics-detection',
      title: 'Ethics & Detection',
      description: 'Learn techniques to identify manipulated media and understand ethical implications.',
      colorClass: 'from-violet-600 to-purple-400',
      shadowClass: 'shadow-violet-700/20',
      requirements: [
        'Watch Video 1: "Deepfake Detection Techniques"',
        'Read Article: "Ethical Considerations in AI-Generated Media"',
        'Watch Video 2: "Implementing Detection Algorithms"'
      ],
      phase: 3,
      path: '/learn/phase-3',
      level: 'Advanced'
    },
    {
      id: 'practical-expert',
      title: 'Practical Expert',
      description: 'Apply your knowledge to create and detect deepfakes with real-world datasets.',
      colorClass: 'from-amber-500 to-orange-400',
      shadowClass: 'shadow-amber-700/20',
      requirements: [
        'Watch Video 1: "Advanced Deepfake Creation Methods"',
        'Read Article: "Working with Real-World Deepfake Datasets"',
        'Watch Video 2: "Developing Robust Detection Systems"'
      ],
      phase: 4,
      path: '/learn/phase-4',
      level: 'Expert'
    },
    {
      id: 'deepfake-researcher',
      title: 'DeepFake Researcher',
      description: 'Contribute to the research community and become a verified researcher.',
      colorClass: 'from-rose-500 to-pink-400',
      shadowClass: 'shadow-rose-700/20',
      requirements: [
        'Watch Video 1: "Research Methodologies in Deepfake Analysis"',
        'Read Article: "Publishing Research & Contributing to Open Source"',
        'Watch Video 2: "Future Directions in Deepfake Technology"'
      ],
      phase: 5,
      path: '/learn/phase-5',
      level: 'Master'
    }
  ];
  
  const handleBadgeClick = (badge: any) => {
    if (selectedBadge === badge.id) {
      setSelectedBadge(null);
    } else {
      setSelectedBadge(badge.id);
    }
  };
  
  const navigateToLearningPage = (path: string) => {
    // Navigate to the learning page for this specific badge/phase
    window.location.href = path;
  };
  
  const isBadgeEarned = (badgeTitle: string) => {
    return user?.badges?.includes(badgeTitle) || false;
  };
  
  const isPhaseUnlocked = (phase: number) => {
    if (phase === 1) return true;
    
    // A phase is unlocked if the user has earned the badge from the previous phase
    const previousBadge = badges[phase - 2].title;
    return isBadgeEarned(previousBadge);
  };
  
  return (
    <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <FiAward className="text-indigo-400 mr-3" size={24} />
        <h2 className="text-2xl font-bold text-white">Deepfake Research Roadmap Badges</h2>
      </div>
      
      <div className="text-gray-300 mb-8 max-w-3xl">
        <p>Your journey to becoming a verified deepfake researcher involves earning all 5 badges. Each badge represents mastery of a specific phase in the deepfake research roadmap.</p>
        <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-800/50 rounded-lg flex items-start">
          <FiInfo className="text-indigo-400 mt-1 mr-3 flex-shrink-0" size={18} />
          <p className="text-sm">
            Click on any badge to view its requirements. Each badge requires completing 3 learning steps (2 videos and 1 article). Complete all tasks in a phase to earn its badge. You need all 5 badges to become a verified researcher with full platform access.
          </p>
        </div>
      </div>
      
      {/* Badge progression bar */}
      <div className="relative mb-12 px-4">
        <div className="absolute h-1 bg-gray-700 top-1/2 left-0 right-0 transform -translate-y-1/2 z-0"></div>
        <div className="flex justify-between relative z-10">
          {badges.map((badge, index) => {
            const earned = isBadgeEarned(badge.title);
            const unlocked = isPhaseUnlocked(badge.phase);
            return (
              <div key={badge.id} className="flex flex-col items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full cursor-pointer flex items-center justify-center shadow-lg ${
                    earned 
                      ? `bg-gradient-to-r ${badge.colorClass} ${badge.shadowClass}` 
                      : unlocked
                        ? 'bg-gray-800 border border-gray-700 hover:border-gray-600'
                        : 'bg-gray-900 border border-gray-800 opacity-50 cursor-not-allowed'
                  }`}
                  whileHover={unlocked ? { scale: 1.1 } : {}}
                  onClick={() => unlocked && handleBadgeClick(badge)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {earned ? (
                    <FiCheckCircle size={24} className="text-white" />
                  ) : unlocked ? (
                    <span className="text-white font-bold">{badge.phase}</span>
                  ) : (
                    <FiLock size={18} className="text-gray-600" />
                  )}
                </motion.div>
                <div className="mt-2 text-center">
                  <div className={`font-medium ${earned ? 'text-white' : 'text-gray-400'}`}>
                    {badge.title.split(' ')[0]}
                  </div>
                  <div className="text-xs text-gray-500">{badge.level}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Badge details */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {badges.map((badge) => {
          const earned = isBadgeEarned(badge.title);
          const unlocked = isPhaseUnlocked(badge.phase);
          
          return (
            <motion.div
              key={badge.id}
              className={`relative rounded-xl p-4 border cursor-pointer transition-all duration-300 ${
                selectedBadge === badge.id
                  ? `border-white/20 bg-gradient-to-br ${badge.colorClass} bg-opacity-10`
                  : earned
                    ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'
                    : unlocked
                      ? 'border-gray-800 bg-gray-900/50 hover:bg-gray-900'
                      : 'border-gray-800 bg-gray-900/30 opacity-50 cursor-not-allowed'
              }`}
              onClick={() => unlocked && handleBadgeClick(badge)}
              whileHover={unlocked ? { scale: 1.02 } : {}}
              layout
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  earned 
                    ? `bg-gradient-to-r ${badge.colorClass}`
                    : 'bg-gray-800'
                }`}>
                  <FiAward size={18} className={earned ? 'text-white' : 'text-gray-500'} />
                </div>
                <div className="ml-3">
                  <h3 className={`font-medium ${earned ? 'text-white' : 'text-gray-300'}`}>
                    {badge.title}
                  </h3>
                  <div className="text-xs text-gray-500">Phase {badge.phase}</div>
                </div>
              </div>
              
              <AnimatePresence>
                {selectedBadge === badge.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 mt-4 border-t border-gray-700/50">
                      <p className="text-sm text-gray-300 mb-3">{badge.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">Requirements:</h4>
                        <ul className="text-sm text-gray-400 space-y-2">
                          {badge.requirements.map((req, i) => (
                            <li key={i} className="flex items-start">
                              <span className={`inline-block w-4 h-4 rounded-full flex-shrink-0 mt-0.5 mr-2 ${
                                i === 0 || i === 2 ? 'bg-indigo-800' : 'bg-purple-800'
                              }`}></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <button
                        onClick={() => navigateToLearningPage(badge.path)}
                        className={`w-full py-3 rounded-md text-sm font-medium flex items-center justify-center transition-all duration-300 ${
                          earned
                            ? 'bg-green-600/30 text-green-400 hover:bg-green-600/40'
                            : 'bg-gradient-to-r from-indigo-600/90 to-indigo-500/90 text-white hover:from-indigo-500/90 hover:to-indigo-400/90 shadow-lg shadow-indigo-900/20'
                        }`}
                      >
                        {earned ? 'Review Content' : 'Start Learning This Phase'}
                        <FiArrowRight className="ml-2" size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {earned && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <FiCheckCircle size={14} className="text-white" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Current progress summary */}
      <div className="mt-8 p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-white">Your Badge Progress</h3>
          <div className="text-sm font-medium bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full border border-indigo-800/50">
            {user?.badges?.length || 0}/5 Earned
          </div>
        </div>
        
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((user?.badges?.length || 0) / 5) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <p className="mt-3 text-sm text-gray-400">
          {user?.badges?.length === 5 ? (
            <span className="text-green-400">Congratulations! You've earned all badges and are now eligible for Verified Researcher status.</span>
          ) : (
            <>
              Continue your learning journey to earn all 5 badges and become a verified researcher. 
              Each badge requires completing 3 learning steps (2 videos and 1 article).
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default BadgeOverview; 