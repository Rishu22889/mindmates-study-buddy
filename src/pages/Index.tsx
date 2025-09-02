import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import StudyZoneShowcase from '@/components/StudyZoneShowcase';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import ProofOfImpact from '@/components/ProofOfImpact';
import Testimonials from '@/components/Testimonials';
import Integrations from '@/components/Integrations';
import AboutTeam from '@/components/AboutTeam';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <StudyZoneShowcase />
        <HowItWorks />
        <Pricing />
        <ProofOfImpact />
        <Testimonials />
        <Integrations />
        <AboutTeam />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
