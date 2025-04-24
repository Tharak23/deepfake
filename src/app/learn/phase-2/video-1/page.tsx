import PhaseVideoContent from '@/components/learning/PhaseVideoContent';

export const metadata = {
  title: 'Understanding GANs: How Generative Models Work - Deepfake Learning',
  description: 'Learn about the architecture and principles behind Generative Adversarial Networks (GANs).',
};

export default function Phase2Video1Page() {
  return (
    <PhaseVideoContent 
      phaseNumber={2}
      stepNumber={1}
      stepType="video"
      title="Understanding GANs: How Generative Models Work"
      description="A comprehensive exploration of Generative Adversarial Networks and their role in creating deepfakes."
      duration="50 min"
      videoUrl="https://www.youtube.com/watch?v=TpMIssRdhco"
      nextStepPath="/learn/phase-2/article-1"
      badgeName="GAN Master"
    />
  );
} 