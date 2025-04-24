import PhaseVideoContent from '@/components/learning/PhaseVideoContent';

export const metadata = {
  title: 'Deepfake Example - Deepfake Learning',
  description: "See real examples of deepfakes and understand how they're created.",
};

export default function Phase1Video2Page() {
  return (
    <PhaseVideoContent 
      phaseNumber={1}
      stepNumber={3}
      stepType="video"
      title="Deepfake Example"
      description="A practical walkthrough of deepfake examples, showing the technology in action."
      duration="8:45"
      videoUrl="https://www.youtube.com/watch?v=WzK1MBEpkJ0"
      nextStepPath="/learn/phase-2/video-1"
      badgeName="AI Foundations"
    />
  );
} 