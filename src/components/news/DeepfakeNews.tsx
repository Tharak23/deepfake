'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Article {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

type NewsSource = 'newsapi' | 'gnews';

export default function DeepfakeNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newsSource, setNewsSource] = useState<NewsSource>('newsapi');
  const [retryCount, setRetryCount] = useState(0);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/news?source=${newsSource}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch news');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.articles || !Array.isArray(data.articles)) {
        throw new Error('Invalid response format from API');
      }

      setArticles(data.articles);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Failed to load news');
      
      // Auto-retry logic
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(fetchNews, 2000 * (retryCount + 1)); // Exponential backoff
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [newsSource]);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            🧠 DeepFake News & Info
          </h1>
          <p className="text-gray-400">
            Stay updated with the latest news about deepfake technology
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Source Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setNewsSource('newsapi')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                newsSource === 'newsapi'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              NewsAPI
            </button>
            <button
              onClick={() => setNewsSource('gnews')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                newsSource === 'gnews'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              GNews
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">
              {retryCount > 0 
                ? `Retrying... (Attempt ${retryCount}/3)`
                : 'Loading latest news...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <p className="font-bold">Error loading news</p>
              <p>{error}</p>
            </div>
            <button
              onClick={() => {
                setRetryCount(0);
                fetchNews();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No articles found matching your search.</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && !error && filteredArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Article Image */}
                <div className="relative h-48 w-full">
                  {article.urlToImage ? (
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <span>{article.source.name}</span>
                    <span>•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Read More
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 