import PhaseVideoContent from '@/components/learning/PhaseVideoContent';

export const metadata = {
  title: 'What Are Deepfakes - Deepfake Learning',
  description: 'Learn about deepfake technology, how it works, and its implications.',
};

export default function Phase1Video1Page() {
  return (
    <PhaseVideoContent 
      phaseNumber={1}
      stepNumber={1}
      stepType="video"
      title="What Are Deepfakes"
      description="An introduction to deepfake technology, how it's created, and what makes it so convincing."
      duration="12:25"
      videoUrl="https://www.youtube.com/watch?v=pkF3m5wVUYI"
      nextStepPath="/learn/phase-1/article-1"
      badgeName="AI Foundations"
    />
  );
} 