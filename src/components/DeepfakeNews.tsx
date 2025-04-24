import { useState, useEffect } from 'react';
import { FiExternalLink, FiClock, FiAlertCircle, FiLoader } from 'react-icons/fi';

interface Article {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: string;
}

export default function DeepfakeNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorDetails(null);
      
      const response = await fetch('/api/news');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch news');
      }
      
      if (data.message && !data.articles?.length) {
        setError('No Articles Available');
        setErrorDetails(data.message);
        setArticles([]);
        return;
      }
      
      if (!data.articles) {
        throw new Error('Invalid response format');
      }
      
      setArticles(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError(error instanceof Error ? error.message : 'Failed to load news');
      setErrorDetails('Please try again later or contact support if the problem persists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="animate-spin text-[var(--primary)] mx-auto" size={32} />
          <p className="mt-4 text-gray-400">Loading latest deepfake news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-6">
        <div className="flex items-start">
          <FiAlertCircle className="text-red-400 mt-1 mr-3" size={24} />
          <div>
            <h3 className="text-lg font-medium text-red-400">Error Loading News</h3>
            <p className="mt-2 text-red-300/80">{error}</p>
            {errorDetails && (
              <p className="mt-2 text-sm text-red-300/60">{errorDetails}</p>
            )}
            <button
              onClick={() => fetchNews()}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors duration-200"
            >
              <FiLoader className="mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-6">
        <div className="flex items-start">
          <FiAlertCircle className="text-yellow-400 mt-1 mr-3" size={24} />
          <div>
            <p className="text-yellow-400">No deepfake-related news found.</p>
            {errorDetails && (
              <p className="mt-2 text-sm text-yellow-400/60">{errorDetails}</p>
            )}
            <button
              onClick={() => fetchNews()}
              className="mt-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors duration-200"
            >
              <FiLoader className="mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <article
          key={index}
          className="bg-[var(--muted)]/10 border border-[var(--border)] rounded-lg overflow-hidden hover:border-[var(--primary)]/50 transition-all duration-200 group"
        >
          {article.image && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}
          
          <div className="p-6">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <FiClock size={14} />
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              <span className="text-gray-500">•</span>
              <span>{article.source}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--primary)] transition-colors duration-200"
              >
                {article.title}
              </a>
            </h3>
            
            <p className="text-gray-400 mb-4 line-clamp-3">
              {article.description}
            </p>
            
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-200"
            >
              Read More
              <FiExternalLink className="ml-2" size={14} />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
} 