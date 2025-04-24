'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  FiCheck, 
  FiLock, 
  FiAward, 
  FiChevronRight,
  FiCpu,
  FiLayers,
  FiShield,
  FiCode,
  FiUpload,
  FiCheckCircle,
  FiFileText,
  FiBookOpen,
  FiAlertCircle,
  FiArrowRight,
  FiPlay
} from 'react-icons/fi';
import { MdOutlineScience } from 'react-icons/md';
import { AiOutlineExperiment } from 'react-icons/ai';
import { CgPathTrim } from 'react-icons/cg';
import RoadmapLevelDetail from './RoadmapLevelDetail';
import { useAuth } from '@/contexts/AuthContext';

type RoadmapTimelineProps = {
  activeLevel: number;
  setActiveLevel: (level: number) => void;
};

const RoadmapTimeline = ({ activeLevel, setActiveLevel }: RoadmapTimelineProps) => {
  const { user, refreshUserProfile } = useAuth();
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [expandedLevel, setExpandedLevel] = useState<number | null>(1);
  const [fileUploads, setFileUploads] = useState<{ [key: number]: string[] }>({});
  const [badgeError, setBadgeError] = useState<string | null>(null);
  const [badgeSuccess, setBadgeSuccess] = useState<string | null>(null);

  const roadmapSteps = [
    {
      id: 1,
      title: "AI Foundations",
      description:
        "Master the fundamentals of AI, neural networks, and machine learning essential for understanding deepfake technology.",
      status: "completed",
      badge: "AI Foundations",
      badgeColor: "from-blue-600 to-cyan-400",
      icon: FiCpu,
      x: '10%',
      y: '20%',
      resources: [
        {
          type: "video",
          title: "What Are Deepfakes",
          description: "An introduction to deepfake technology, how it's created, and what makes it so convincing.",
          duration: "12:25",
          link: "/learn/phase-1/video-1"
        },
        {
          type: "article",
          title: "The Digital Face and Deepfakes on Screen",
          description: "Detailed breakdown of digital face manipulation and deepfake technologies in media.",
          duration: "20 min",
          link: "/learn/phase-1/article-1"
        },
        {
          type: "video",
          title: "Deepfake Example",
          description: "A practical walkthrough of deepfake examples, showing the technology in action.",
          duration: "8:45",
          link: "/learn/phase-1/video-2"
        }
      ]
    },
    {
      id: 2,
      title: "GAN Master",
      description:
        "Explore Generative Adversarial Networks (GANs) and learn how they create synthetic media and deepfakes.",
      status: "completed",
      badge: "GAN Master",
      badgeColor: "from-teal-500 to-emerald-400",
      icon: FiLayers,
      x: '30%',
      y: '35%',
      resources: [
        {
          type: "video",
          title: "Understanding GANs: How Generative Models Work",
          description: "A comprehensive exploration of Generative Adversarial Networks and their role in creating deepfakes.",
          duration: "50 min",
          link: "/learn/phase-2/video-1"
        },
        {
          type: "article",
          title: "Generative Adversarial Networks Explained",
          description: "Deep dive into GANs and how they are used in IBM Developer workflows.",
          duration: "25 min",
          link: "/learn/phase-2/article-1"
        },
        {
          type: "video",
          title: "Dangers of Deepfake",
          description: "Explore the ethical implications, security risks, and societal impact of deepfake technology.",
          duration: "15:20",
          link: "/learn/phase-2/video-2"
        }
      ]
    },
    {
      id: 3,
      title: "Ethics & Detection",
      description:
        "Understand the ethical implications of deepfakes and learn techniques to detect manipulated media.",
      status: "current",
      badge: "Ethics & Detection",
      badgeColor: "from-violet-600 to-purple-400",
      icon: FiShield,
      x: '50%',
      y: '20%',
      resources: [
        {
          type: "video",
          title: "Deepfake Detection Techniques",
          description: "Overview of current methods to identify AI-generated and manipulated media.",
          duration: "55 min",
          link: "/learn/phase-3/video-1"
        },
        {
          type: "article",
          title: "Ethical Considerations in AI-Generated Media",
          description: "Exploring the social, legal, and ethical implications of deepfake technology.",
          duration: "30 min",
          link: "/learn/phase-3/article-1"
        },
        {
          type: "video",
          title: "Implementing Detection Algorithms",
          description: "Hands-on tutorial for building your own deepfake detection system.",
          duration: "70 min",
          link: "/learn/phase-3/video-2"
        }
      ]
    },
    {
      id: 4,
      title: "Practical Expert",
      description:
        "Apply your knowledge to create and detect deepfakes using real-world datasets and advanced techniques.",
      status: "upcoming",
      badge: "Practical Expert",
      badgeColor: "from-amber-500 to-orange-400",
      icon: FiCode,
      x: '70%',
      y: '35%',
      resources: [
        {
          type: "video",
          title: "Advanced Deepfake Creation Methods",
          description: "Advanced techniques for creating more realistic and convincing synthetic media.",
          duration: "60 min",
          link: "/learn/phase-4/video-1"
        },
        {
          type: "article",
          title: "Working with Real-World Deepfake Datasets",
          description: "Guide to accessing and using established deepfake datasets for research purposes.",
          duration: "25 min",
          link: "/learn/phase-4/article-1"
        },
        {
          type: "video",
          title: "Developing Robust Detection Systems",
          description: "Building enterprise-grade detection frameworks for production deployment.",
          duration: "75 min",
          link: "/learn/phase-4/video-2"
        }
      ]
    },
    {
      id: 5,
      title: "DeepFake Researcher",
      description:
        "Contribute to the deepfake research community and become a verified researcher with publishing privileges.",
      status: "upcoming",
      badge: "DeepFake Researcher",
      badgeColor: "from-rose-500 to-pink-400",
      icon: FiAward,
      x: '90%',
      y: '20%',
      resources: [
        {
          type: "video",
          title: "Research Methodologies in Deepfake Analysis",
          description: "Learn proper research methodologies and statistical analysis for deepfake studies.",
          duration: "50 min",
          link: "/learn/phase-5/video-1"
        },
        {
          type: "article",
          title: "Publishing Research & Contributing to Open Source",
          description: "Guide to writing research papers and contributing to open source deepfake projects.",
          duration: "35 min",
          link: "/learn/phase-5/article-1"
        },
        {
          type: "video",
          title: "Future Directions in Deepfake Technology",
          description: "Exploring emerging trends and future research directions in the deepfake field.",
          duration: "65 min",
          link: "/learn/phase-5/video-2"
        }
      ]
    }
  ];

  // Load completed levels from user's badges if available
  useEffect(() => {
    if (user && user.badges) {
      const completed: number[] = [];
      roadmapSteps.forEach((level, index) => {
        if (user.badges?.includes(level.badge)) {
          completed.push(level.id);
        }
      });
      if (completed.length > 0) {
        setCompletedLevels(completed);
      }
    }
  }, [user]);

  const handleFileUpload = (level: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).map(file => file.name);
      setFileUploads(prev => ({
        ...prev,
        [level]: [...(prev[level] || []), ...newFiles]
      }));
    }
  };

  const checkLevelCompletion = (level: number) => {
    const requiredFiles = roadmapSteps[level - 1].resources.map(resource => resource.link);
    const uploadedFiles = fileUploads[level] || [];
    
    // Check if all required files are uploaded
    return requiredFiles.every(file => 
      uploadedFiles.some(uploadedFile => 
        uploadedFile.toLowerCase().includes(file.toLowerCase())
      )
    );
  };

  // Function to earn a badge when completing a level
  const earnBadge = async (level: number) => {
    try {
      const badgeName = roadmapSteps[level - 1].badge;
      
      // Check if user already has this badge
      if (user?.badges?.includes(badgeName)) {
        return;
      }
      
      // Call the API to award the badge
      const response = await fetch('/api/user/update-badges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ badgeName })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to earn badge');
      }
      
      // Show success message
      setBadgeSuccess(`You earned the "${badgeName}" badge!`);
      
      // Clear the message after 5 seconds
      setTimeout(() => {
        setBadgeSuccess(null);
      }, 5000);
      
      // Refresh user profile to get updated badges
      await refreshUserProfile();
      
    } catch (error) {
      console.error('Error earning badge:', error);
      setBadgeError((error as Error).message || 'Failed to earn badge');
      
      // Clear the error after 5 seconds
      setTimeout(() => {
        setBadgeError(null);
      }, 5000);
    }
  };

  const completeLevel = async (level: number) => {
    if (!completedLevels.includes(level) && checkLevelCompletion(level)) {
      // Update local state
      setCompletedLevels(prev => [...prev, level]);
      
      // Earn badge for this level
      await earnBadge(level);
      
      // If there's a next level, unlock it
      if (level < roadmapSteps.length) {
        setActiveLevel(level + 1);
        setExpandedLevel(level + 1);
      }
    }
  };

  const isLevelLocked = (level: number) => {
    // Level 1 is always unlocked
    if (level === 1) return false;
    
    // Level is unlocked if the previous level is completed
    return !completedLevels.includes(level - 1);
  };

  const toggleExpandLevel = (level: number) => {
    if (isLevelLocked(level)) return;
    
    setExpandedLevel(expandedLevel === level ? null : level);
    setActiveLevel(level);
  };

  const handleKeyDown = (event: React.KeyboardEvent, level: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isLevelLocked(level)) {
        toggleExpandLevel(level);
      }
    }
  };

  const navigateToLearningPage = (path: string, event: React.MouseEvent) => {
    event.preventDefault();
    console.log(`Navigating to: ${path}`);
    
    // Use client-side navigation
    const router = require('next/navigation').useRouter();
    if (router) {
      router.push(path);
    } else {
      // Fallback to regular navigation
      window.location.href = path;
    }
  };

  const BadgeDetailDisplay = ({ badge, isEarned, color, path }: { badge: string, isEarned: boolean, color: string, path: string }) => {
    return (
      <div 
        className={`p-4 rounded-lg mb-4 cursor-pointer transition-all duration-300 hover:transform hover:scale-102 ${
          isEarned 
            ? `bg-gradient-to-r ${color} bg-opacity-10 border border-white/10` 
            : 'bg-gray-800/50 border border-gray-700/50'
        }`}
        onClick={(e) => navigateToLearningPage(path, e)}
      >
        <div className="flex items-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 ${
            isEarned 
              ? `bg-gradient-to-r ${color} shadow-lg` 
              : 'bg-gray-700'
          }`}>
            <FiAward size={28} className={isEarned ? 'text-white' : 'text-gray-500'} />
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold ${isEarned ? 'text-white' : 'text-gray-400'} text-lg`}>{badge}</h4>
            <div className="flex items-center">
              <p className="text-sm text-gray-500 mr-2">{isEarned ? 'Earned' : 'Not yet earned'}</p>
              <div className="text-xs bg-indigo-900/30 text-indigo-400 px-2 py-0.5 rounded-full">
                Phase {badge === 'AI Foundations' ? 1 : badge === 'GAN Master' ? 2 : badge === 'Ethics & Detection' ? 3 : badge === 'Practical Expert' ? 4 : 5}
              </div>
            </div>
          </div>
          {isEarned && (
            <div className="ml-auto">
              <div className="bg-green-900/30 text-green-400 text-xs font-medium px-2 py-1 rounded-full border border-green-800/50">
                Earned
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 flex justify-end">
          <button 
            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center"
            onClick={(e) => navigateToLearningPage(path, e)}
          >
            View Learning Content
            <FiChevronRight className="ml-1" size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-16">
      {/* Badge notification messages */}
      {badgeSuccess && (
        <div className="p-4 bg-green-900/20 border border-green-800/50 rounded-lg flex items-center text-green-400 mb-4">
          <FiAward className="mr-2" size={18} />
          <span>{badgeSuccess}</span>
        </div>
      )}
      
      {badgeError && (
        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded-lg flex items-center text-red-400 mb-4">
          <FiAlertCircle className="mr-2" size={18} />
          <span>{badgeError}</span>
        </div>
      )}
      
      {/* User badge progress */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-5 mb-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <FiAward className="mr-2 text-indigo-400" size={22} />
          Your Badges Collection
          <div className="ml-auto px-3 py-1 text-sm font-medium rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-800/50">
            {user?.badgesCount || 0}/5 Badges
          </div>
        </h3>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-400">Progress toward Researcher Verification</span>
            <span className="font-medium text-indigo-300">{((user?.badgesCount || 0) / 5) * 100}%</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${((user?.badgesCount || 0) / 5) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {(user?.badgesCount || 0) >= 5 
              ? 'You have enough badges to be verified! Refreshing the page should update your status.'
              : `Complete ${5 - (user?.badgesCount || 0)} more badges to automatically become a Verified Researcher.`
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roadmapSteps.map((level) => (
            <BadgeDetailDisplay 
              key={level.id}
              badge={level.badge}
              isEarned={user?.badges?.includes(level.badge) || false}
              color={level.badgeColor}
              path={level.resources[0].link}
            />
          ))}
        </div>
        
        {user?.badges && user.badges.length > 0 ? (
          <div className="mt-4 p-3 bg-indigo-900/20 border border-indigo-800/50 rounded-lg text-center">
            <p className="text-indigo-300">
              <span className="font-medium">Great progress!</span> You've earned {user.badges.length} out of 5 badges required for verification.
            </p>
          </div>
        ) : (
          <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg text-center">
            <p className="text-gray-400">
              Complete learning levels to earn badges and progress toward verification status.
            </p>
          </div>
        )}
      </div>
      
      {/* Interactive Map */}
      <div className="relative h-[400px] w-full rounded-xl overflow-hidden p-8 bg-gradient-to-r from-[#0a192f] to-[#0f2942] border border-indigo-900/40">
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-blue-900/10 to-transparent"></div>
          <div className="absolute w-full h-full opacity-10" style={{ backgroundImage: 'url(/grid-pattern.svg)' }}></div>
        </div>
        
        {/* Path lines */}
        <svg className="absolute inset-0 w-full h-full z-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          
          {/* Connection lines between nodes */}
          <path 
            d={`M ${roadmapSteps[0].x} ${roadmapSteps[0].y} L ${roadmapSteps[1].x} ${roadmapSteps[1].y}`} 
            stroke={completedLevels.includes(1) ? "url(#pathGradient)" : "#1e293b"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={completedLevels.includes(1) ? "0" : "5,5"}
            fill="none"
          />
          <path 
            d={`M ${roadmapSteps[1].x} ${roadmapSteps[1].y} L ${roadmapSteps[2].x} ${roadmapSteps[2].y}`} 
            stroke={completedLevels.includes(2) ? "url(#pathGradient)" : "#1e293b"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={completedLevels.includes(2) ? "0" : "5,5"}
            fill="none"
          />
          <path 
            d={`M ${roadmapSteps[2].x} ${roadmapSteps[2].y} L ${roadmapSteps[3].x} ${roadmapSteps[3].y}`} 
            stroke={completedLevels.includes(3) ? "url(#pathGradient)" : "#1e293b"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={completedLevels.includes(3) ? "0" : "5,5"}
            fill="none"
          />
          <path 
            d={`M ${roadmapSteps[3].x} ${roadmapSteps[3].y} L ${roadmapSteps[4].x} ${roadmapSteps[4].y}`} 
            stroke={completedLevels.includes(4) ? "url(#pathGradient)" : "#1e293b"}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={completedLevels.includes(4) ? "0" : "5,5"}
            fill="none"
          />
        </svg>
        
        {/* Map Nodes */}
        <div className="relative z-10 h-full">
          {roadmapSteps.map((level) => (
            <motion.div
              key={level.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: isLevelLocked(level.id) ? 0.5 : 1,
                x: activeLevel === level.id ? 5 : 0,
                y: activeLevel === level.id ? -5 : 0,
              }}
              transition={{ 
                duration: 0.4, 
                delay: level.id * 0.1,
              }}
              style={{
                position: 'absolute',
                left: level.x,
                top: level.y,
                transform: 'translate(-50%, -50%)',
              }}
              className={`cursor-pointer ${isLevelLocked(level.id) ? 'cursor-not-allowed' : ''}`}
              onClick={() => toggleExpandLevel(level.id)}
              onKeyDown={(event) => handleKeyDown(event, level.id)}
              tabIndex={0}
            >
              <div className="relative">
                {/* Node */}
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
                    completedLevels.includes(level.id)
                      ? `bg-gradient-to-r ${level.badgeColor} border-2 border-white/10`
                      : isLevelLocked(level.id)
                      ? 'bg-gray-800/80 border border-gray-700'
                      : `bg-gradient-to-r ${level.badgeColor} opacity-80 border border-white/10`
                  } ${
                    activeLevel === level.id
                      ? 'ring-4 ring-indigo-500/30 scale-110'
                      : ''
                  }`}
                >
                  {completedLevels.includes(level.id) ? (
                    <FiCheck size={24} className="text-white" />
                  ) : isLevelLocked(level.id) ? (
                    <FiLock size={20} className="text-gray-500" />
                  ) : (
                    <span className="font-bold text-xl text-white">{level.id}</span>
                  )}
                </div>
                
                {/* Badge indicator */}
                {completedLevels.includes(level.id) && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 w-6 h-6 rounded-full flex items-center justify-center">
                    <FiAward size={14} />
                  </div>
                )}
                
                {/* Label */}
                <div 
                  className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap text-center ${
                    activeLevel === level.id ? 'text-white font-medium' : 'text-gray-400'
                  }`}
                >
                  <span>{level.title.split('–')[0].trim()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Timeline View */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
          <CgPathTrim className="mr-2 text-indigo-400" size={24} />
          Your Learning Journey
          <div className="ml-auto px-3 py-1 text-sm font-medium rounded-full bg-indigo-900/50 text-indigo-300 border border-indigo-800/50">
            {completedLevels.length}/5 Levels
          </div>
        </h2>
        
        <div className="relative pb-10">
          {/* Timeline line */}
          <div className="absolute left-8 top-6 bottom-0 w-0.5 bg-gradient-to-b from-indigo-600 via-purple-500 to-indigo-800"></div>
          
          {/* Levels */}
          <div className="space-y-10">
            {roadmapSteps.map((level) => (
              <div key={level.id}>
                <div 
                  className={`flex items-start cursor-pointer ${isLevelLocked(level.id) ? 'opacity-50' : ''}`}
                  onClick={() => toggleExpandLevel(level.id)}
                  onKeyDown={(event) => handleKeyDown(event, level.id)}
                  tabIndex={0}
                >
                  {/* Level indicator */}
                  <div 
                    className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
                      completedLevels.includes(level.id)
                        ? `bg-gradient-to-r ${level.badgeColor} shadow-lg shadow-purple-600/20`
                        : isLevelLocked(level.id)
                        ? 'bg-gray-800 border border-gray-700'
                        : `bg-gradient-to-r ${level.badgeColor} opacity-80`
                    } ${
                      activeLevel === level.id
                        ? 'ring-4 ring-indigo-500/30 scale-110'
                        : ''
                    }`}
                  >
                    {completedLevels.includes(level.id) ? (
                      <FiCheck size={24} className="text-white" />
                    ) : isLevelLocked(level.id) ? (
                      <FiLock size={22} className="text-gray-500" />
                    ) : (
                      <span className="font-bold text-xl text-white">{level.id}</span>
                    )}
                    
                    {/* Badge indicator */}
                    {completedLevels.includes(level.id) && (
                      <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 w-6 h-6 rounded-full flex items-center justify-center">
                        <FiAward size={14} />
                      </div>
                    )}
                  </div>
                  
                  {/* Level title and description */}
                  <div className="ml-6 flex-1">
                    <h3 className="text-xl font-semibold text-white flex items-center group">
                      {level.title}
                      {completedLevels.includes(level.id) && (
                        <span className="ml-3 text-xs px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full flex items-center">
                          <FiCheck className="mr-1" size={12} />
                          Completed
                        </span>
                      )}
                      {completedLevels.includes(level.id) && (
                        <span className="ml-2 text-xs px-2 py-0.5 bg-yellow-900/30 text-yellow-400 rounded-full flex items-center">
                          <FiAward className="mr-1" size={12} />
                          {level.badge}
                        </span>
                      )}
                      <FiChevronRight 
                        className={`ml-2 text-indigo-400 transition-transform duration-300 ${
                          expandedLevel === level.id ? 'rotate-90' : 'rotate-0'
                        } ${isLevelLocked(level.id) ? 'opacity-30' : 'group-hover:translate-x-1'}`} 
                        size={18} 
                      />
                    </h3>
                    <p className="text-gray-400 mt-1">{level.description}</p>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedLevel === level.id && !isLevelLocked(level.id) && (
                    <RoadmapLevelDetail 
                      level={level} 
                      fileUploads={fileUploads[level.id] || []}
                      onFileUpload={(e) => handleFileUpload(level.id, e)}
                      isCompleted={completedLevels.includes(level.id)}
                      canComplete={checkLevelCompletion(level.id)}
                      onComplete={() => completeLevel(level.id)}
                    />
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapTimeline; 
