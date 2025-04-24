'use client';

import { motion } from 'framer-motion';
import { FiChevronDown, FiAward } from 'react-icons/fi';
import { RiAiGenerate } from 'react-icons/ri';
import { useAuth } from '@/contexts/AuthContext';

type RoadmapHeroProps = {
  scrollProgress: number;
};

const RoadmapHero = ({ scrollProgress }: RoadmapHeroProps) => {
  const { user } = useAuth();
  
  // Define badge colors for different categories
  const badgeStyles = {
    "AI Foundations": "from-blue-600 to-cyan-400",
    "GAN Master": "from-teal-500 to-emerald-400",
    "Ethics & Detection": "from-violet-600 to-purple-400",
    "Practical Expert": "from-amber-500 to-orange-400",
    "DeepFake Researcher": "from-rose-500 to-pink-400",
  };
  
  return (
    <div className="relative">
      {/* Decorative elements that move based on scroll */}
      <div 
        className="absolute -left-12 top-20 opacity-30"
        style={{ transform: `translateY(${scrollProgress * 60}px)` }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="59.5" stroke="url(#paint0_linear)" strokeOpacity="0.5" />
          <circle cx="60" cy="60" r="40" stroke="url(#paint1_linear)" strokeOpacity="0.5" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div
        className="absolute -right-16 top-40 opacity-20" 
        style={{ transform: `translateY(${-scrollProgress * 80}px)` }}
      >
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0.5" y="0.5" width="159" height="159" rx="19.5" stroke="url(#paint0_linear)" strokeOpacity="0.7" />
          <rect x="40.5" y="40.5" width="79" height="79" rx="9.5" stroke="url(#paint1_linear)" strokeOpacity="0.7" />
          <defs>
            <linearGradient id="paint0_linear" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="40" y1="40" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main content */}
      <div className="relative text-center max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          DeepFake Research Roadmap
        </motion.h1>
        
        <motion.div
          className="mt-6 text-lg md:text-xl text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p>Your guided journey to mastering deepfake detection and research</p>
        </motion.div>
        
        {/* Badge Display Section */}
        {user && (
          <motion.div 
            className="mt-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="inline-flex items-center bg-gray-900/50 rounded-full px-4 py-1 border border-indigo-500/30">
              <FiAward className="text-indigo-400 mr-2" size={18} />
              <span className="text-indigo-300 font-medium">
                {user.badgesCount || 0}/5 Badges Earned
              </span>
            </div>
            
            {/* Badges Collection */}
            <div className="mt-6 max-w-3xl mx-auto">
              <div className="flex flex-wrap justify-center gap-4">
                {['AI Foundations', 'GAN Master', 'Ethics & Detection', 'Practical Expert', 'DeepFake Researcher'].map((badge, index) => {
                  const earned = user.badges?.includes(badge);
                  return (
                    <motion.div
                      key={badge}
                      className={`flex items-center px-4 py-2 rounded-xl border ${
                        earned 
                          ? `bg-gradient-to-r ${badgeStyles[badge as keyof typeof badgeStyles]} bg-opacity-20 border-white/20` 
                          : 'bg-gray-800/50 border-gray-700/50'
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        earned 
                          ? `bg-gradient-to-r ${badgeStyles[badge as keyof typeof badgeStyles]}` 
                          : 'bg-gray-700'
                      }`}>
                        <FiAward className={earned ? 'text-white' : 'text-gray-400'} size={16} />
                      </div>
                      <div className="text-left">
                        <div className={earned ? 'text-white font-medium' : 'text-gray-400'}>
                          {badge}
                        </div>
                        <div className="text-xs text-gray-500">
                          {earned ? 'Earned' : 'Not yet earned'}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Verification Status */}
              {(user.badgesCount || 0) >= 5 && (
                <motion.div 
                  className="mt-6 inline-flex items-center bg-green-900/30 text-green-400 rounded-full px-5 py-2 border border-green-700/50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="font-medium">Verified Researcher Status Achieved!</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex justify-center"
        >
          <button 
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="animate-bounce flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 transition-colors"
            aria-label="Scroll down to view roadmap"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }
            }}
          >
            <FiChevronDown size={20} />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default RoadmapHero; 