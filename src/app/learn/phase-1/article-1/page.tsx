import PhaseArticleContent from '@/components/learning/PhaseArticleContent';

export const metadata = {
  title: 'The Digital Face and Deepfakes on Screen - Deepfake Learning',
  description: 'Detailed breakdown of digital face manipulation and deepfake technologies.',
};

export default function Phase1Article1Page() {
  return (
    <PhaseArticleContent 
      phaseNumber={1}
      stepNumber={2}
      stepType="article"
      title="The Digital Face and Deepfakes on Screen"
      description="Detailed breakdown of digital face manipulation and deepfake technologies in media."
      duration="20 min"
      pdfUrl="/pdfs/bode-et-al-2021-the-digital-face-and-deepfakes-on-screen.pdf"
      nextStepPath="/learn/phase-1/video-2"
      badgeName="AI Foundations"
    />
  );
} 