import { NextResponse } from 'next/server';

const GNEWS_API_KEY = '00cea76c0f82ab5a21a952431b837298';
const GNEWS_API_URL = 'https://gnews.io/api/v4/search';
const GNEWS_TOP_URL = 'https://gnews.io/api/v4/top-headlines';

// Keywords for searching deepfake-related news
const SEARCH_KEYWORDS = [
  'deepfake',
  '"deep fake"',
  'AI fake',
  'synthetic media',
  'face swap'
];

// Keywords to validate if an article is truly about deepfakes
const VALIDATION_KEYWORDS = [
  'deepfake',
  'deep fake',
  'synthetic',
  'artificial intelligence',
  'ai',
  'face',
  'fake',
  'manipulat',
  'generat'
];

export async function GET() {
  try {
    // Try different search queries until we find articles
    let allArticles = [];
    let attempts = 0;
    
    // First try the search endpoint
    for (const searchQuery of SEARCH_KEYWORDS) {
      if (allArticles.length >= 5) break; // Stop if we have enough articles
      attempts++;
      
      console.log(`Attempt ${attempts}: Searching for "${searchQuery}"...`);
      
      // Construct the URL with search parameters
      const url = new URL(GNEWS_API_URL);
      url.searchParams.append('q', searchQuery);
      url.searchParams.append('lang', 'en');
      url.searchParams.append('max', '10');
      url.searchParams.append('token', GNEWS_API_KEY);
      url.searchParams.append('sortby', 'publishedAt'); // Get latest news first
      
      console.log('Fetching news from:', url.toString());

      try {
        const response = await fetch(url.toString(), {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DeepfakeNews/1.0',
          },
          cache: 'no-store', // Don't cache to avoid rate limit issues
        });

        console.log('API Status:', response.status);
        
        // Check if we've hit the rate limit
        if (response.status === 429 || response.status === 403) {
          console.log('Rate limit or permission error, trying next approach');
          break; // Break out of this loop and try top headlines instead
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error:', errorText);
          continue; // Try next keyword
        }

        const data = await response.json();
        console.log('API response:', data);

        if (!data.articles || !Array.isArray(data.articles)) {
          console.error('Invalid response structure');
          continue;
        }

        // Filter with more relaxed criteria (only 1 keyword match required)
        const validArticles = data.articles
          .filter(article => {
            if (!article.title || !article.description) return false;
            
            const content = `${article.title} ${article.description}`.toLowerCase();
            
            return VALIDATION_KEYWORDS.some(keyword => 
              content.includes(keyword.toLowerCase())
            );
          })
          .map(article => ({
            title: article.title,
            description: article.description,
            content: article.content,
            url: article.url,
            image: article.image,
            publishedAt: article.publishedAt,
            source: article.source?.name || 'Unknown Source'
          }));

        console.log(`Found ${validArticles.length} valid articles for "${searchQuery}"`);
        allArticles.push(...validArticles);
      } catch (error) {
        console.error('Error fetching search results:', error);
        continue;
      }
    }

    // If we couldn't get articles from search, try top headlines in technology category
    if (allArticles.length < 3) {
      console.log('Trying top technology headlines as fallback...');
      
      try {
        const url = new URL(GNEWS_TOP_URL);
        url.searchParams.append('category', 'technology');
        url.searchParams.append('lang', 'en');
        url.searchParams.append('max', '10');
        url.searchParams.append('token', GNEWS_API_KEY);
        
        const response = await fetch(url.toString(), {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DeepfakeNews/1.0',
          },
          cache: 'no-store',
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.articles && Array.isArray(data.articles)) {
            const techArticles = data.articles.map(article => ({
              title: article.title,
              description: article.description,
              content: article.content,
              url: article.url,
              image: article.image,
              publishedAt: article.publishedAt,
              source: article.source?.name || 'Unknown Source'
            }));
            
            console.log(`Found ${techArticles.length} technology headlines`);
            allArticles.push(...techArticles);
          }
        }
      } catch (error) {
        console.error('Error fetching top headlines:', error);
      }
    }

    // Remove duplicates based on URL
    allArticles = Array.from(new Map(allArticles.map(a => [a.url, a])).values());
    
    // Sort by date (newest first)
    allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Take only the first 10 articles
    allArticles = allArticles.slice(0, 10);

    console.log(`Total valid articles after filtering: ${allArticles.length}`);

    // If we still don't have any articles, use fallback mock data
    if (allArticles.length === 0) {
      console.log('No articles found, using fallback data');
      return NextResponse.json(
        { articles: getFallbackArticles() },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    }

    return NextResponse.json(
      { articles: allArticles },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );

  } catch (error) {
    console.error('Error in news API route:', error);
    
    // Return fallback data instead of an error
    return NextResponse.json(
      { articles: getFallbackArticles() },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }
}

// Fallback data to use when API fails
function getFallbackArticles() {
  return [
    {
      title: "The Rise of Deepfakes: How AI Is Changing Digital Media",
      description: "Deepfakes are becoming increasingly sophisticated, raising concerns about misinformation and digital security.",
      content: "As AI technology advances, deepfakes are becoming harder to detect. Researchers are developing new methods to identify these synthetic media creations.",
      url: "https://example.com/deepfake-article-1",
      image: "https://images.unsplash.com/photo-1562408590-e32931084e23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      publishedAt: new Date().toISOString(),
      source: "Tech Insights"
    },
    {
      title: "New Deepfake Detection Tool Claims 96% Accuracy Rate",
      description: "A team of researchers has developed an AI system that can detect deepfake videos with unprecedented accuracy.",
      content: "The new tool analyzes subtle facial movements and inconsistencies that are typically present in AI-generated media.",
      url: "https://example.com/deepfake-article-2",
      image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      source: "AI Research Journal"
    },
    {
      title: "Governments Worldwide Consider Legislation to Combat Deepfakes",
      description: "In response to growing concerns, lawmakers are drafting new regulations to address the potential misuse of deepfake technology.",
      content: "Proposed laws would require clear labeling of AI-generated content and impose penalties for malicious use of deepfakes.",
      url: "https://example.com/deepfake-article-3",
      image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      publishedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      source: "Global Policy Review"
    },
    {
      title: "How to Spot a Deepfake: A Guide for the Average Internet User",
      description: "With deepfakes becoming more common, here are some tips to help you identify potentially manipulated media.",
      content: "Look for unnatural blinking, strange facial proportions, and inconsistent lighting. These can all be indicators of synthetic media.",
      url: "https://example.com/deepfake-article-4",
      image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      publishedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      source: "Digital Literacy Foundation"
    },
    {
      title: "Deepfake Technology Has Positive Applications in Film Industry",
      description: "While often discussed as a threat, deepfake technology is finding legitimate uses in cinema and entertainment.",
      content: "Movie studios are using deepfake techniques to de-age actors and create special effects that were previously impossible or prohibitively expensive.",
      url: "https://example.com/deepfake-article-5",
      image: "https://images.unsplash.com/photo-1578022761797-b8636ac1773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
      publishedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      source: "Entertainment Weekly"
    }
  ];
} 