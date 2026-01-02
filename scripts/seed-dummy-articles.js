const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const DeepFakeArticleSchema = new mongoose.Schema({
  source: {
    id: { type: String, default: null },
    name: { type: String, required: true },
  },
  author: { type: String, default: null },
  title: { type: String, required: true },
  description: { type: String, default: null },
  url: { type: String, required: true, unique: true },
  urlToImage: { type: String, default: null },
  publishedAt: { type: Date, required: true },
  content: { type: String, default: null },
  category: { type: String, required: true, default: 'news' },
  relevanceScore: { type: Number, required: true, default: 0 },
  isPublished: { type: Boolean, default: true },
  publishDate: { type: Date, default: null },
  tags: [{ type: String }],
}, {
  timestamps: true,
});

const DeepFakeArticle = mongoose.models.DeepFakeArticle || mongoose.model('DeepFakeArticle', DeepFakeArticleSchema);

const dummyArticles = [
  {
    source: { id: 'tech-news', name: 'Tech News Daily' },
    author: 'Dr. Sarah Chen',
    title: 'AI-Generated Deepfakes Pose Growing Threat to Digital Identity Verification',
    description: 'Recent advances in AI technology have made it increasingly difficult to distinguish between real and synthetic media, raising concerns about identity verification systems.',
    url: 'https://example.com/deepfake-identity-threat-2024',
    urlToImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    content: 'Deepfake technology has reached a critical point where AI-generated videos and images are nearly indistinguishable from authentic content. This poses significant challenges for digital identity verification systems that rely on facial recognition and biometric data. Security experts warn that traditional verification methods may no longer be sufficient.',
    category: 'security',
    relevanceScore: 95,
    isPublished: true,
    publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    tags: ['deepfake', 'AI', 'security', 'identity-verification', 'biometrics'],
  },
  {
    source: { id: 'ai-research', name: 'AI Research Journal' },
    author: 'Prof. Michael Zhang',
    title: 'New Detection Algorithms Show Promise in Identifying Synthetic Media',
    description: 'Researchers have developed advanced machine learning models that can detect deepfakes with over 98% accuracy, offering hope in the fight against synthetic media manipulation.',
    url: 'https://example.com/deepfake-detection-algorithms-2024',
    urlToImage: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    content: 'A breakthrough in deepfake detection technology has been achieved by a team of researchers who developed neural network models capable of identifying synthetic media with unprecedented accuracy. The new algorithms analyze subtle inconsistencies in facial movements, lighting, and audio synchronization that are characteristic of AI-generated content.',
    category: 'research',
    relevanceScore: 92,
    isPublished: true,
    publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    tags: ['deepfake-detection', 'machine-learning', 'neural-networks', 'research', 'AI'],
  },
  {
    source: { id: 'cyber-security', name: 'Cybersecurity Weekly' },
    author: 'James Wilson',
    title: 'Deepfake Scams Cost Businesses Millions in 2024',
    description: 'Cybercriminals are increasingly using deepfake technology to impersonate executives and conduct sophisticated fraud schemes, resulting in significant financial losses.',
    url: 'https://example.com/deepfake-scams-business-2024',
    urlToImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    content: 'Businesses worldwide are reporting a surge in deepfake-related fraud cases. Attackers use AI-generated videos and voice clones to impersonate company executives, tricking employees into transferring funds or revealing sensitive information. The sophistication of these attacks has increased dramatically, making them harder to detect.',
    category: 'security',
    relevanceScore: 88,
    isPublished: true,
    publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    tags: ['deepfake', 'cybersecurity', 'fraud', 'business', 'scams'],
  },
  {
    source: { id: 'media-ethics', name: 'Media Ethics Today' },
    author: 'Emily Rodriguez',
    title: 'The Ethical Dilemma of Deepfake Technology in Entertainment',
    description: 'As deepfake technology becomes more accessible, the entertainment industry faces ethical questions about consent, authenticity, and the future of digital performances.',
    url: 'https://example.com/deepfake-ethics-entertainment-2024',
    urlToImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    content: 'The entertainment industry is grappling with the ethical implications of deepfake technology. While it offers creative possibilities, such as bringing deceased actors back to the screen or de-aging performers, it also raises concerns about consent, artistic integrity, and the potential for misuse.',
    category: 'ethics',
    relevanceScore: 85,
    isPublished: true,
    publishDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    tags: ['deepfake', 'ethics', 'entertainment', 'media', 'consent'],
  },
  {
    source: { id: 'legal-news', name: 'Legal Tech Review' },
    author: 'Attorney David Kim',
    title: 'New Legislation Targets Deepfake Misuse in Political Campaigns',
    description: 'Lawmakers are introducing bills to regulate the use of deepfake technology in political advertising, aiming to protect democratic processes from manipulation.',
    url: 'https://example.com/deepfake-political-legislation-2024',
    urlToImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    content: 'In response to growing concerns about deepfake technology being used to spread misinformation during elections, legislators are proposing new regulations. These bills would require clear labeling of synthetic media in political advertisements and impose penalties for malicious use.',
    category: 'politics',
    relevanceScore: 90,
    isPublished: true,
    publishDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    tags: ['deepfake', 'politics', 'legislation', 'misinformation', 'elections'],
  },
  {
    source: { id: 'tech-innovation', name: 'Tech Innovation Hub' },
    author: 'Lisa Anderson',
    title: 'Real-Time Deepfake Detection Tools Now Available for Consumers',
    description: 'New consumer-friendly applications allow users to verify the authenticity of videos and images in real-time, empowering individuals to identify synthetic media.',
    url: 'https://example.com/real-time-deepfake-detection-tools-2024',
    urlToImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    content: 'Several tech companies have launched mobile applications that enable users to detect deepfakes in real-time. These tools use advanced AI algorithms to analyze media content and provide instant feedback about its authenticity, helping users navigate an increasingly complex digital landscape.',
    category: 'technology',
    relevanceScore: 87,
    isPublished: true,
    publishDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    tags: ['deepfake-detection', 'mobile-apps', 'consumer-tech', 'AI', 'verification'],
  },
  {
    source: { id: 'academic-journal', name: 'Journal of Digital Media' },
    author: 'Dr. Robert Thompson',
    title: 'Generative Adversarial Networks: The Technology Behind Modern Deepfakes',
    description: 'An in-depth exploration of GANs and how they enable the creation of highly realistic synthetic media, with implications for both creative and malicious applications.',
    url: 'https://example.com/gans-deepfake-technology-2024',
    urlToImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    content: 'Generative Adversarial Networks (GANs) represent a breakthrough in AI technology that has made modern deepfakes possible. This article explores the technical foundations of GANs, their evolution, and the dual nature of their applications - from creative tools to potential weapons of misinformation.',
    category: 'research',
    relevanceScore: 93,
    isPublished: true,
    publishDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
    tags: ['GANs', 'deepfake', 'AI', 'machine-learning', 'research', 'technology'],
  },
  {
    source: { id: 'social-media', name: 'Social Media Insights' },
    author: 'Maria Garcia',
    title: 'Social Media Platforms Struggle with Deepfake Content Moderation',
    description: 'Major social media platforms are implementing new policies and AI tools to combat the spread of deepfake content, but challenges remain in balancing free speech and safety.',
    url: 'https://example.com/social-media-deepfake-moderation-2024',
    urlToImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
    publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    content: 'Social media companies are facing increasing pressure to address deepfake content on their platforms. While new moderation tools and policies are being implemented, the rapid evolution of deepfake technology makes it difficult to keep up with detection and removal efforts.',
    category: 'social-media',
    relevanceScore: 86,
    isPublished: true,
    publishDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    tags: ['deepfake', 'social-media', 'content-moderation', 'platforms', 'policy'],
  },
  {
    source: { id: 'healthcare-tech', name: 'Healthcare Technology Review' },
    author: 'Dr. Jennifer Lee',
    title: 'Deepfake Technology in Medical Training: Opportunities and Risks',
    description: 'Medical institutions are exploring the use of deepfake technology for training purposes, but ethical concerns about patient consent and data privacy remain.',
    url: 'https://example.com/deepfake-medical-training-2024',
    urlToImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
    publishedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
    content: 'Some medical schools are experimenting with deepfake technology to create realistic training scenarios for students. While this could enhance medical education, it raises questions about using patient data and maintaining ethical standards in healthcare training.',
    category: 'healthcare',
    relevanceScore: 80,
    isPublished: true,
    publishDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
    tags: ['deepfake', 'healthcare', 'medical-training', 'ethics', 'education'],
  },
  {
    source: { id: 'forensics', name: 'Digital Forensics Quarterly' },
    author: 'Detective Mark Johnson',
    title: 'Forensic Techniques for Deepfake Analysis in Criminal Investigations',
    description: 'Law enforcement agencies are developing specialized forensic methods to analyze and authenticate digital evidence in cases involving suspected deepfake content.',
    url: 'https://example.com/deepfake-forensics-criminal-investigations-2024',
    urlToImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    content: 'Digital forensics experts are creating new methodologies to detect and analyze deepfakes in criminal investigations. These techniques involve examining metadata, analyzing compression artifacts, and using specialized software to identify signs of manipulation.',
    category: 'forensics',
    relevanceScore: 89,
    isPublished: true,
    publishDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    tags: ['deepfake', 'forensics', 'law-enforcement', 'criminal-investigation', 'digital-evidence'],
  },
];

async function seedDummyArticles() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    if (!mongoUri) {
      console.error('MongoDB URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    let created = 0;
    let skipped = 0;

    for (const article of dummyArticles) {
      try {
        const existing = await DeepFakeArticle.findOne({ url: article.url });
        if (existing) {
          console.log(`Article already exists: ${article.title}`);
          skipped++;
          continue;
        }

        const newArticle = await DeepFakeArticle.create(article);
        console.log(`Created article: ${newArticle.title}`);
        created++;
      } catch (error) {
        if (error.code === 11000) {
          console.log(`Duplicate article skipped: ${article.title}`);
          skipped++;
        } else {
          console.error(`Error creating article "${article.title}":`, error.message);
        }
      }
    }

    console.log(`\nSeeding complete!`);
    console.log(`Created: ${created} articles`);
    console.log(`Skipped: ${skipped} articles (duplicates)`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding articles:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDummyArticles();

