'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiPlay, FiPause, FiTrash2, FiEdit2, FiShare2 } from 'react-icons/fi';

interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startDate: string;
  endDate?: string;
  dataset: string;
  model: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
}

const mockExperiments: Experiment[] = [
  {
    id: '1',
    name: 'Deepfake Detection Model Training',
    description: 'Training a CNN model for detecting deepfake videos',
    status: 'running',
    progress: 65,
    startDate: '2024-03-15',
    dataset: 'Deepfake Detection Dataset 2024',
    model: 'ResNet-50',
    metrics: {
      accuracy: 0.92,
      precision: 0.89,
      recall: 0.94,
      f1Score: 0.91
    }
  },
  {
    id: '2',
    name: 'Face Swap Analysis',
    description: 'Analyzing face swap techniques using GAN models',
    status: 'completed',
    progress: 100,
    startDate: '2024-03-10',
    endDate: '2024-03-14',
    dataset: 'Facial Expression Analysis Set',
    model: 'StyleGAN2',
    metrics: {
      accuracy: 0.88,
      precision: 0.85,
      recall: 0.90,
      f1Score: 0.87
    }
  }
];

const ExperimentsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'progress'>('date');

  const filteredExperiments = mockExperiments
    .filter(experiment => 
      experiment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(experiment => 
      statusFilter === 'all' || experiment.status === statusFilter
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      return b.progress - a.progress;
    });

  const getStatusColor = (status: Experiment['status']) => {
    switch (status) {
      case 'running':
        return 'text-green-500';
      case 'completed':
        return 'text-blue-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search experiments..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
            <FiPlay />
            New Experiment
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <select
          className="px-3 py-1 rounded-lg bg-gray-800 border border-gray-700"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'progress')}
        >
          <option value="date">Sort by Date</option>
          <option value="progress">Sort by Progress</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredExperiments.map(experiment => (
          <motion.div
            key={experiment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{experiment.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(experiment.status)}`}>
                    {experiment.status.charAt(0).toUpperCase() + experiment.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{experiment.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{experiment.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${experiment.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Dataset:</span>
                    <p className="text-gray-300">{experiment.dataset}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Model:</span>
                    <p className="text-gray-300">{experiment.model}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Start Date:</span>
                    <p className="text-gray-300">{experiment.startDate}</p>
                  </div>
                  {experiment.endDate && (
                    <div>
                      <span className="text-gray-400">End Date:</span>
                      <p className="text-gray-300">{experiment.endDate}</p>
                    </div>
                  )}
                </div>

                {experiment.status === 'completed' && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <span className="text-gray-400">Accuracy:</span>
                      <p className="text-gray-300">{(experiment.metrics.accuracy * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Precision:</span>
                      <p className="text-gray-300">{(experiment.metrics.precision * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Recall:</span>
                      <p className="text-gray-300">{(experiment.metrics.recall * 100).toFixed(1)}%</p>
                    </div>
                    <div>
                      <span className="text-gray-400">F1 Score:</span>
                      <p className="text-gray-300">{(experiment.metrics.f1Score * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {experiment.status === 'running' ? (
                  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition-colors">
                    <FiPause />
                    Pause
                  </button>
                ) : (
                  <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                    <FiPlay />
                    Start
                  </button>
                )}
                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <FiEdit2 />
                  Edit
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <FiShare2 />
                  Share
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors">
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExperimentsSection; 