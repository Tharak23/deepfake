import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BlogPost from '@/models/BlogPost';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Set JSON content type
  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    const { id } = params;
    
    // Validate ID format first
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid blog post ID format' },
        { status: 400, headers }
      );
    }

    // Attempt database connection
    try {
      await dbConnect();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        {
          post: getFallbackPost(id),
          fallback: true,
          error: 'Database connection failed'
        },
        { headers }
      );
    }

    // Find the blog post
    const post = await BlogPost.findById(id).lean();
    
    if (!post) {
      console.log('Blog post not found, returning fallback');
      return NextResponse.json(
        {
          post: getFallbackPost(id),
          fallback: true
        },
        { headers }
      );
    }

    // Format the response
    const formattedPost = {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || post.content.substring(0, 200) + '...',
      author: {
        id: post.author?.id || 'unknown',
        name: post.author?.name || 'Unknown Author',
        image: post.author?.image
      },
      createdAt: post.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: post.updatedAt?.toISOString() || new Date().toISOString(),
      tags: post.tags || [],
      likes: post.likes || 0,
      comments: Array.isArray(post.comments) ? post.comments.length : 0,
      image: post.image
    };

    return NextResponse.json({ post: formattedPost }, { headers });

  } catch (error) {
    console.error('Error in blog post API route:', error);
    
    // Return a proper error response
    return NextResponse.json(
      {
        error: 'Failed to fetch blog post',
        details: error instanceof Error ? error.message : 'Unknown error',
        fallback: true,
        post: getFallbackPost(params.id)
      },
      { status: 500, headers }
    );
  }
}

function getFallbackPost(id: string) {
  return {
    id,
    title: 'Understanding Deepfakes: A Comprehensive Guide',
    content: `
      <h2>Introduction to Deepfakes</h2>
      <p>Deepfakes are synthetic media in which a person in an existing image or video is replaced with someone else's likeness. The term "deepfake" combines "deep learning" and "fake," and these manipulations are created using artificial intelligence techniques.</p>
      
      <h2>How Deepfakes Work</h2>
      <p>Deepfakes are created using deep learning algorithms, particularly generative adversarial networks (GANs). These networks consist of two parts:</p>
      <ul>
        <li>A generator that creates fake images</li>
        <li>A discriminator that tries to detect the fakes</li>
      </ul>
      
      <h2>Applications and Implications</h2>
      <p>While deepfakes can be used for entertainment and creative purposes, they also raise concerns about:</p>
      <ul>
        <li>Misinformation and fake news</li>
        <li>Privacy violations</li>
        <li>Political manipulation</li>
        <li>Identity theft</li>
      </ul>
      
      <h2>Detecting Deepfakes</h2>
      <p>Several methods can help identify deepfakes:</p>
      <ul>
        <li>Looking for inconsistencies in lighting and shadows</li>
        <li>Checking for unnatural facial movements</li>
        <li>Analyzing audio-visual synchronization</li>
        <li>Using AI-powered detection tools</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>As deepfake technology continues to evolve, it's crucial to stay informed about its capabilities and limitations. Understanding how to detect and verify media content is becoming increasingly important in our digital age.</p>
    `,
    excerpt: 'A comprehensive guide to understanding deepfakes, their creation, detection, and implications for society.',
    author: {
      id: 'fallback-author',
      name: 'AI Research Team',
      image: null
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['deepfake', 'AI', 'technology', 'digital media'],
    likes: 0,
    comments: 0,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  };
} 