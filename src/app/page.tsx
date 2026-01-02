'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ResearchSection from '@/components/ResearchSection';
import TeamSection from '@/components/TeamSection';
import StatsSection from '@/components/StatsSection';
import BlogSection from '@/components/BlogSection';
import CaseStudySection from '@/components/CaseStudySection';
import DemoSection from '@/components/DemoSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import AuthDebug from '@/components/AuthDebug';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsSection />
      <ResearchSection />
      <TeamSection />
      <CaseStudySection />
      <DemoSection />
      <BlogSection />
      <ContactSection />
      <Footer />
      <AuthDebug />
    </main>
  );
}
