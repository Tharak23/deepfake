'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiUser, FiTag, FiMessageCircle, FiThumbsUp, FiShare2, FiArrowLeft, FiLoader, FiAlertCircle, FiInfo } from 'react-icons/fi';
import Link from 'next/link';

type BlogPost = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  likes: number;
  comments: number;
  image?: string;
};

export default function BlogPostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) {
        console.error('No ID provided:', id);
        setError('No blog post ID provided');
        setLoading(false);
        return;
      }

      // Log the ID for debugging
      console.log('Received ID:', id);
      
      // Handle array of params case and clean the ID
      const actualId = Array.isArray(id) ? id[0] : id;
      const cleanId = decodeURIComponent(String(actualId)).trim();
      
      console.log('Cleaned ID:', cleanId);

      // Validate ID format before making the API call
      if (!cleanId || cleanId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(cleanId)) {
        console.error('Invalid ID format:', {
          originalId: id,
          cleanedId: cleanId,
          length: cleanId.length,
          matches: /^[0-9a-fA-F]{24}$/.test(cleanId)
        });
        setError(`Invalid blog post ID format. Please check the URL and try again.`);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');
      setIsFallback(false);
      
      try {
        console.log('Making API request for ID:', cleanId);
        const response = await fetch(`/api/blog/${cleanId}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Invalid response type:', contentType);
          throw new Error('Server returned an invalid response format');
        }

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          throw new Error('Failed to parse server response');
        }
        
        if (!response.ok && !data.fallback) {
          console.error('API error:', {
            status: response.status,
            data: data
          });
          throw new Error(data.error || data.details || `Failed to fetch blog post (${response.status})`);
        }
        
        if (!data.post) {
          console.error('Missing post data in response:', data);
          throw new Error('Invalid response format: missing post data');
        }
        
        console.log('Blog post fetched successfully:', data.post.title);
        setBlogPost(data.post);
        setIsFallback(data.fallback || false);
        setRetryCount(0); // Reset retry count on success
      } catch (error) {
        console.error('Error fetching blog post:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load blog post';
        setError(errorMessage);
        
        // Auto-retry logic - only retry for certain types of errors
        const shouldRetry = !(
          errorMessage.includes('Invalid blog post ID') ||
          errorMessage.includes('parse server response') ||
          errorMessage.includes('invalid response format')
        );
        
        if (retryCount < 3 && shouldRetry) {
          console.log(`Retrying... Attempt ${retryCount + 1}/3`);
          setRetryCount(prev => prev + 1);
          setTimeout(fetchBlogPost, 2000 * (retryCount + 1)); // Exponential backoff
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [id, retryCount]);
  
  const handleLike = async () => {
    if (!blogPost || !user) return;
    
    try {
      const response = await fetch(`/api/blog/${blogPost.id}/like`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to like post');
      }
      
      setBlogPost({
        ...blogPost,
        likes: blogPost.likes + 1
      });
      
      setLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };
  
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
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20 flex items-center justify-center">
          <div className="text-center">
            <FiLoader className="animate-spin text-[var(--primary)] mx-auto" size={32} />
            <p className="mt-4 text-gray-400">
              {retryCount > 0 
                ? `Retrying... (Attempt ${retryCount}/3)`
                : 'Loading blog post...'}
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !blogPost) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 flex items-center text-red-400">
                <FiAlertCircle className="mr-3 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-lg font-medium mb-2">Error Loading Blog Post</h2>
                  <p>{error || 'The requested blog post could not be found.'}</p>
                  <p className="mt-2 text-sm opacity-80">
                    {error?.includes('ID format') ? 
                      'Please make sure you\'re using a valid blog post URL.' :
                      'Please try again or contact support if the problem persists.'}
                  </p>
                  <div className="mt-4 flex gap-4">
                    <Link 
                      href="/blog"
                      className="inline-flex items-center text-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-200"
                    >
                      <FiArrowLeft className="mr-2" />
                      Back to Blog
                    </Link>
                    {!error?.includes('ID format') && (
                      <button
                        onClick={() => {
                          setRetryCount(0);
                          setLoading(true);
                        }}
                        className="inline-flex items-center text-[var(--primary)] hover:text-[var(--secondary)] transition-colors duration-200"
                      >
                        <FiLoader className="mr-2" />
                        Try Again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#0f172a] pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto">
            <Link 
              href="/blog"
              className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" />
              Back to Blog
            </Link>
            
            {isFallback && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center text-yellow-400">
                <FiInfo className="mr-3 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-lg font-medium mb-2">Demo Content</h2>
                  <p>This is a demo blog post. The actual content could not be loaded from the database.</p>
                </div>
              </div>
            )}
            
            {blogPost.image && (
              <div className="mb-8 rounded-xl overflow-hidden h-64 md:h-80 lg:h-96 relative">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${blogPost.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60"></div>
              </div>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">{blogPost.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-8 text-gray-400">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[var(--muted)] mr-2">
                  {blogPost.author.image ? (
                    <img 
                      src={blogPost.author.image} 
                      alt={blogPost.author.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white text-xs">
                      {blogPost.author.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <span className="text-sm">{blogPost.author.name}</span>
              </div>
              
              <div className="flex items-center">
                <FiClock className="mr-2" size={14} />
                <span className="text-sm">{formatDate(blogPost.createdAt)}</span>
              </div>
              
              <div className="flex items-center">
                <FiThumbsUp className="mr-2" size={14} />
                <span className="text-sm">{blogPost.likes} likes</span>
              </div>
              
              <div className="flex items-center">
                <FiMessageCircle className="mr-2" size={14} />
                <span className="text-sm">{blogPost.comments} comments</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {blogPost.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="prose prose-invert max-w-none">
              {/* Render content as HTML */}
              <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
            </div>
            
            <div className="border-t border-[var(--border)] pt-6 mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLike}
                    disabled={liked}
                    className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      liked
                        ? 'bg-[var(--primary)]/20 text-[var(--primary)] cursor-not-allowed'
                        : 'bg-[var(--muted)] text-gray-300 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]'
                    }`}
                  >
                    <FiThumbsUp className="mr-2" />
                    {liked ? 'Liked' : 'Like'}
                  </button>
                  
                  <button
                    className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[var(--muted)] text-gray-300 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all duration-300"
                  >
                    <FiMessageCircle className="mr-2" />
                    Comment
                  </button>
                </div>
                
                <button
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[var(--muted)] text-gray-300 hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition-all duration-300"
                >
                  <FiShare2 className="mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 