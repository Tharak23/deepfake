'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Define the model data structure
interface Model {
  name: string;
  description: string;
  useCase: string;
}

interface Category {
  id: string;
  title: string;
  emoji: string;
  models: Model[];
}

const ModelsSection = () => {
  // Define the model categories and their models
  const categories: Category[] = [
    {
      id: 'face-swapping',
      title: 'Face Swapping Models',
      emoji: '🎭',
      models: [
        {
          name: 'DeepFaceLab',
          description: 'High-quality face swap tool used in industry.',
          useCase: 'Professional-grade face swapping for film and media production'
        },
        {
          name: 'FaceSwap',
          description: 'Open-source GUI tool for deepfakes.',
          useCase: 'User-friendly interface for creating face swaps'
        },
        {
          name: 'SimSwap',
          description: 'One-shot face swapping from a single image.',
          useCase: 'Quick face swapping with minimal reference images'
        }
      ]
    },
    {
      id: 'face-animation',
      title: 'Face Animation Models',
      emoji: '📽️',
      models: [
        {
          name: 'First Order Motion Model',
          description: 'Animate any image using a driving video.',
          useCase: 'Create animated faces from still images'
        },
        {
          name: 'Avatarify',
          description: 'Real-time face animation via webcam.',
          useCase: 'Live streaming with animated avatars'
        },
        {
          name: 'Live Portrait',
          description: 'Brings still images to life using AI.',
          useCase: 'Animate portraits for interactive experiences'
        }
      ]
    },
    {
      id: 'lip-sync',
      title: 'Lip Sync Models',
      emoji: '🔊',
      models: [
        {
          name: 'Wav2Lip',
          description: 'Sync lip movements with any audio.',
          useCase: 'Create realistic talking videos from audio'
        },
        {
          name: 'SyncNet',
          description: 'Predict lip movement from audio for syncing.',
          useCase: 'Generate accurate lip movements for dubbing'
        }
      ]
    },
    {
      id: 'talking-avatar',
      title: 'Talking Avatar & Presenter Models',
      emoji: '🤖',
      models: [
        {
          name: 'Synthesia',
          description: 'Create AI avatars that talk from text.',
          useCase: 'Generate video content with AI presenters'
        },
        {
          name: 'D-ID',
          description: 'Animate photos to talk with audio/text input.',
          useCase: 'Create talking head videos from still images'
        },
        {
          name: 'HeyGen',
          description: 'Generate AI presenters for business videos.',
          useCase: 'Professional video content with AI hosts'
        }
      ]
    },
    {
      id: 'apis-sdks',
      title: 'Ready-to-Use APIs & SDKs',
      emoji: '🧩',
      models: [
        {
          name: 'DeepAR',
          description: 'Face filters, tracking, and AR effects.',
          useCase: 'Add AR effects to mobile applications'
        },
        {
          name: 'Banuba',
          description: 'Face AR SDK for mobile/web apps.',
          useCase: 'Implement face tracking in applications'
        },
        {
          name: 'Ready Player Me',
          description: 'Build customizable 3D avatars.',
          useCase: 'Create personalized avatars for metaverse applications'
        }
      ]
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Deepfake Models & Tools</h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Explore the latest deepfake models and tools categorized by their functionality.
          Each model includes a description and use case to help you understand its applications.
        </p>
      </div>

      {categories.map((category) => (
        <section key={category.id} className="card p-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">{category.emoji}</span>
            {category.title}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.models.map((model, index) => (
              <motion.div
                key={index}
                className="bg-[var(--card-bg)] rounded-lg p-6 border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <h4 className="text-xl font-semibold mb-2">{model.name}</h4>
                <p className="text-gray-400 mb-4">{model.description}</p>
                <div className="mb-4">
                  <span className="text-sm font-medium text-[var(--accent)]">Use Case:</span>
                  <p className="text-sm text-gray-300">{model.useCase}</p>
                </div>
                <button className="btn btn-sm btn-primary w-full">
                  Learn More
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ModelsSection; 