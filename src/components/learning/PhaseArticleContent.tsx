'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight, FiCheck, FiBookOpen, FiAward, FiDownload, FiFileText } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

interface PhaseArticleContentProps {
  phaseNumber: number;
  stepNumber: number;
  stepType: 'video' | 'article';
  title: string;
  description: string;
  duration: string;
  nextStepPath: string;
  badgeName: string;
  pdfUrl?: string;
}

const PhaseArticleContent = ({
  phaseNumber,
  stepNumber,
  stepType,
  title,
  description,
  duration,
  nextStepPath,
  badgeName,
  pdfUrl
}: PhaseArticleContentProps) => {
  const [completed, setCompleted] = useState(false);
  const [articleRead, setArticleRead] = useState(false);
  const { user } = useAuth();

  // Track article reading progress - in a real app, this would use scroll tracking
  const handleArticleRead = () => {
    setArticleRead(true);
  };

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
              <span className="px-2 py-0.5 bg-purple-900/30 text-purple-400 text-xs rounded-full border border-purple-800/30">
                Article
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
          
          {/* Article content */}
          <motion.div
            className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-8">
              {pdfUrl ? (
                <div className="flex flex-col items-center">
                  <div className="bg-gray-800/50 rounded-xl p-6 mb-6 w-full max-w-3xl flex flex-col items-center">
                    <FiFileText size={48} className="text-purple-400 mb-3" />
                    <h2 className="text-xl font-bold text-white mb-2">PDF Article: {title}</h2>
                    <p className="text-gray-300 text-center mb-4">
                      This article is available as a PDF document. You can download it or read the summary below.
                    </p>
                    <a 
                      href={pdfUrl} 
                      download
                      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg flex items-center transition-colors mb-4"
                      onClick={() => {
                        console.log('Downloading PDF:', pdfUrl);
                        setTimeout(handleArticleRead, 1000);
                      }}
                    >
                      <FiDownload className="mr-2" size={18} />
                      Download PDF
                    </a>
                  </div>
                  
                  {/* Article summary as fallback */}
                  <div className="w-full max-w-3xl bg-gray-800/40 rounded-xl mb-6 p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Article Summary</h2>
                    
                    {phaseNumber === 1 && (
                      <div className="prose prose-invert prose-headings:text-white prose-a:text-indigo-400 max-w-none">
                        <h3>The Digital Face and Deepfakes on Screen</h3>
                        <p className="text-gray-300">
                          This article explores the evolution of digital face manipulation in media and how deepfake 
                          technology has transformed visual effects in film and television.
                        </p>
                        <p className="text-gray-300">
                          Key topics covered include:
                        </p>
                        <ul className="text-gray-300">
                          <li>History of visual effects and face replacement</li>
                          <li>Technical approaches to digital face manipulation</li>
                          <li>Ethical considerations in media production</li>
                          <li>Case studies from major films and television shows</li>
                          <li>Future directions and implications for the industry</li>
                        </ul>
                      </div>
                    )}
                    
                    {phaseNumber === 2 && (
                      <div className="prose prose-invert prose-headings:text-white prose-a:text-indigo-400 max-w-none">
                        <h3>Generative Adversarial Networks Explained</h3>
                        <p className="text-gray-300">
                          This article provides a comprehensive overview of Generative Adversarial Networks (GANs) 
                          and their application in creating synthetic media, including deepfakes.
                        </p>
                        <p className="text-gray-300">
                          Key topics covered include:
                        </p>
                        <ul className="text-gray-300">
                          <li>Core principles of GAN architecture</li>
                          <li>The generator and discriminator components</li>
                          <li>Training process and optimization strategies</li>
                          <li>Different GAN variants (StyleGAN, CycleGAN, etc.)</li>
                          <li>Applications in image generation, style transfer, and face synthesis</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={handleArticleRead} 
                    className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600/70 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <FiCheck className="mr-2" size={16} />
                    Mark as Read
                  </button>
                </div>
              ) : (
                <div className="prose prose-invert prose-headings:text-white prose-a:text-indigo-400 max-w-none">
                  <h2>Introduction to Neural Networks & Deep Learning</h2>
                  <p>
                    Neural networks are a set of algorithms, modeled loosely after the human brain, that are designed 
                    to recognize patterns. They interpret sensory data through a kind of machine perception, labeling, 
                    or clustering raw input.
                  </p>
                  
                  <p>
                    The patterns they recognize are numerical, contained in vectors, into which all real-world data, 
                    be it images, sound, text, or time series, must be translated.
                  </p>
                  
                  <h3>Key Components</h3>
                  <p>
                    A typical neural network contains layers of connected nodes, each building on the previous layer 
                    to refine the prediction or categorization process:
                  </p>
                  <ul>
                    <li>Input layer: Receives the initial data</li>
                    <li>Hidden layers: Process the data through weighted connections</li>
                    <li>Output layer: Produces the final prediction or classification</li>
                  </ul>
                  
                  <p>
                    Deep learning refers to neural networks with multiple hidden layers that enable learning of complex 
                    patterns in large amounts of data.
                  </p>
                  
                  <h2>Applications in Deepfake Technology</h2>
                  <p>
                    The ability of deep neural networks to recognize and generate patterns is what enables them to create 
                    convincing synthetic media, known as deepfakes.
                  </p>
                  
                  <p>
                    Key types of networks used in deepfake creation include:
                  </p>
                  <ul>
                    <li>Autoencoders: Compress and reconstruct data</li>
                    <li>Generative Adversarial Networks (GANs): Generate new data that mimics the original</li>
                  </ul>
                  
                  <h3>Ethical Considerations</h3>
                  <p>
                    The ability to create convincing synthetic media raises important ethical questions about:
                  </p>
                  <ul>
                    <li>Consent and privacy</li>
                    <li>Misinformation and manipulation</li>
                    <li>Identity theft and fraud</li>
                  </ul>
                  
                  <p>
                    As researchers in this field, we have a responsibility to understand these implications and develop 
                    technologies that can counteract malicious uses of deepfakes.
                  </p>
                  
                  <h2>Implementation Approaches</h2>
                  <p>
                    Modern neural networks for deepfakes typically use specialized architectures like:
                  </p>
                  <ul>
                    <li>Convolutional Neural Networks (CNNs) for image processing</li>
                    <li>Recurrent Neural Networks (RNNs) for sequential data</li>
                    <li>Transformers for advanced pattern recognition</li>
                  </ul>
                  
                  <p>
                    These networks are trained on large datasets of images and videos to learn the patterns and features 
                    that make up realistic human faces and movements.
                  </p>
                  
                  <button 
                    onClick={handleArticleRead} 
                    className="mt-8 inline-flex items-center px-4 py-2 bg-purple-600/70 hover:bg-purple-600 text-white rounded-lg transition-colors"
                  >
                    <FiCheck className="mr-2" size={16} />
                    Mark as Read
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-gray-800/40 border-t border-gray-700/50 p-5">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  {articleRead ? 'Article read - click "Continue" to move to the next step' : 'Read the article and mark as read to continue'}
                </div>
                
                <Link 
                  href={nextStepPath}
                  className={`px-5 py-2 rounded-lg font-medium flex items-center ${
                    articleRead
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500' 
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={(e) => {
                    if (!articleRead) {
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
          
          {/* Related content */}
          <motion.div
            className="bg-gray-900/30 border border-gray-800 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold text-white mb-3">Related Resources</h2>
            <p className="text-gray-300 mb-4">
              These resources provide additional context to the topics covered in this article.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">Deep Learning Fundamentals</h3>
                <p className="text-gray-400 text-sm mb-2">
                  A comprehensive overview of neural network architecture and implementation.
                </p>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 text-sm">Learn more →</a>
              </div>
              
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">Ethical AI Development</h3>
                <p className="text-gray-400 text-sm mb-2">
                  Guidelines for responsible development and deployment of AI systems.
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

export default PhaseArticleContent; 