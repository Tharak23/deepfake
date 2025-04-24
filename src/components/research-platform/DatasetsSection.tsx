'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiDownload, FiUpload, FiInfo } from 'react-icons/fi';

interface Dataset {
  id: string;
  name: string;
  description: string;
  size: string;
  format: string;
  uploadDate: string;
  downloads: number;
  tags: string[];
}

const mockDatasets: Dataset[] = [
  {
    id: '1',
    name: 'Deepfake Detection Dataset 2024',
    description: 'A comprehensive dataset of deepfake videos and images for training detection models',
    size: '2.5 GB',
    format: 'ZIP',
    uploadDate: '2024-03-15',
    downloads: 1234,
    tags: ['deepfake', 'detection', 'videos', 'images']
  },
  {
    id: '2',
    name: 'Facial Expression Analysis Set',
    description: 'High-quality facial expression dataset with annotated emotions',
    size: '1.8 GB',
    format: 'ZIP',
    uploadDate: '2024-03-10',
    downloads: 856,
    tags: ['facial', 'expressions', 'emotions', 'annotated']
  },
  // Add more mock datasets as needed
];

const DatasetsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'downloads'>('date');

  const filteredDatasets = mockDatasets
    .filter(dataset => 
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(dataset => 
      selectedTags.length === 0 || 
      selectedTags.every(tag => dataset.tags.includes(tag))
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
      return b.downloads - a.downloads;
    });

  const allTags = Array.from(new Set(mockDatasets.flatMap(dataset => dataset.tags)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search datasets..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <FiFilter />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
            <FiUpload />
            Upload Dataset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => {
              setSelectedTags(prev =>
                prev.includes(tag)
                  ? prev.filter(t => t !== tag)
                  : [...prev, tag]
              );
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <select
          className="px-3 py-1 rounded-lg bg-gray-800 border border-gray-700"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'downloads')}
        >
          <option value="date">Sort by Date</option>
          <option value="downloads">Sort by Downloads</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredDatasets.map(dataset => (
          <motion.div
            key={dataset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6 hover:bg-gray-800/50 transition-colors"
          >
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{dataset.name}</h3>
                <p className="text-gray-400 mb-4">{dataset.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {dataset.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full text-sm bg-gray-800 text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span>Size: {dataset.size}</span>
                  <span>Format: {dataset.format}</span>
                  <span>Uploaded: {dataset.uploadDate}</span>
                  <span>Downloads: {dataset.downloads}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                  <FiDownload />
                  Download
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                  <FiInfo />
                  Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DatasetsSection; 