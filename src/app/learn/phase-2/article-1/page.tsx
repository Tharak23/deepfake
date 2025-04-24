import PhaseArticleContent from '@/components/learning/PhaseArticleContent';

export const metadata = {
  title: 'Generative Adversarial Networks Explained - Deepfake Learning',
  description: 'Deep dive into GANs and how they generate realistic images.',
};

export default function Phase2Article1Page() {
  return (
    <PhaseArticleContent 
      phaseNumber={2}
      stepNumber={2}
      stepType="article"
      title="Generative Adversarial Networks Explained"
      description="Deep dive into GANs and how they are used in IBM Developer workflows."
      duration="25 min"
      pdfUrl="/pdfs/Generative-adversarial-networks-explained-IBM-Developer.pdf"
      nextStepPath="/learn/phase-2/video-2"
      badgeName="GAN Master"
    />
  );
} 