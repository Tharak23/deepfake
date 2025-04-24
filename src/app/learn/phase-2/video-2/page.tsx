import PhaseVideoContent from '@/components/learning/PhaseVideoContent';

export const metadata = {
  title: 'Dangers of Deepfake - Deepfake Learning',
  description: 'Understand the ethical concerns and potential threats posed by deepfake technology.',
};

export default function Phase2Video2Page() {
  return (
    <PhaseVideoContent 
      phaseNumber={2}
      stepNumber={3}
      stepType="video"
      title="Dangers of Deepfake"
      description="Explore the ethical implications, security risks, and societal impact of deepfake technology."
      duration="15:20"
      videoUrl="https://www.youtube.com/watch?v=o9-vgQLNREo"
      nextStepPath="/learn/phase-3/video-1"
      badgeName="GAN Master"
    />
  );
} 